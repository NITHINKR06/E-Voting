const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const helmet = require('helmet');
const AuditLog = require('../models/AuditLog');

// Rate limiting configurations
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs (production security)
  message: {
    error: 'Too many authentication attempts, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting completely in development environment
  skip: (req) => {
    console.log(`Rate limiting check - NODE_ENV: ${process.env.NODE_ENV}`);
    return process.env.NODE_ENV === 'development';
  },
});

const voteLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 1, // limit each IP to 1 vote per hour
  message: {
    error: 'Voting rate limit exceeded, please try again later.',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting in development environment
  skip: (req) => process.env.NODE_ENV === 'development',
});

// Slow down configuration
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // allow 50 requests per 15 minutes, then...
  delayMs: () => 500, // begin adding 500ms of delay per request above 50
  // Skip speed limiting in development environment
  skip: (req) => process.env.NODE_ENV === 'development',
});

// Security headers middleware
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false
});


// Audit logging middleware
const auditLogger = (action, resource) => {
  return async (req, res, next) => {
    const startTime = Date.now();
    
    // Override res.json to capture response
    const originalJson = res.json;
    res.json = function(data) {
      const duration = Date.now() - startTime;
      
      // Log the action asynchronously
      setImmediate(async () => {
        try {
          const auditLog = new AuditLog({
            userId: req.user?.id,
            action,
            resource,
            resourceId: req.params?.id || req.body?.id,
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent'),
            details: {
              method: req.method,
              path: req.path,
              query: req.query,
              body: req.method !== 'GET' ? req.body : undefined,
              duration,
              statusCode: res.statusCode
            },
            success: res.statusCode < 400,
            errorMessage: res.statusCode >= 400 ? data?.message : undefined
          });
          
          await auditLog.save();
        } catch (error) {
          console.error('Audit logging error:', error);
        }
      });
      
      return originalJson.call(this, data);
    };
    
    next();
  };
};

// IP tracking middleware
const ipTracker = (req, res, next) => {
  req.ipAddress = req.ip || 
                 req.connection.remoteAddress || 
                 req.socket.remoteAddress ||
                 (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
                 req.headers['x-forwarded-for']?.split(',')[0] ||
                 'unknown';
  
  next();
};

// Session security middleware
const sessionSecurity = (req, res, next) => {
  // Prevent session fixation
  if (req.session && req.session.regenerate) {
    req.session.regenerate((err) => {
      if (err) {
        console.error('Session regeneration error:', err);
      }
      next();
    });
  } else {
    next();
  }
};

// Input validation middleware
const validateInput = (req, res, next) => {
  // Check for suspicious patterns
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /eval\(/i,
    /expression\(/i
  ];
  
  const checkObject = (obj, path = '') => {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (typeof value === 'string') {
        for (const pattern of suspiciousPatterns) {
          if (pattern.test(value)) {
            return res.status(400).json({
              error: 'Suspicious input detected',
              field: currentPath
            });
          }
        }
      } else if (typeof value === 'object' && value !== null) {
        const result = checkObject(value, currentPath);
        if (result) return result;
      }
    }
    return null;
  };
  
  const result = checkObject(req.body);
  if (result) return result;
  
  next();
};

// Export all middleware
module.exports = {
  authLimiter,
  voteLimiter,
  generalLimiter,
  speedLimiter,
  securityHeaders,
  auditLogger,
  ipTracker,
  sessionSecurity,
  validateInput
};
