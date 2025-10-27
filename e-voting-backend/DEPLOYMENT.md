# Environment Configuration Guide

## Development Mode (Default)
The server automatically runs in development mode with NO rate limiting.

## Production Mode
To run in production mode with full security (rate limiting enabled):

### Option 1: Set environment variable
```bash
# Windows PowerShell
$env:NODE_ENV="production"; npm start

# Windows Command Prompt
set NODE_ENV=production && npm start

# Linux/Mac
NODE_ENV=production npm start
```

### Option 2: Create production .env file
Create a `.env` file in the backend directory with:
```
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
EMAIL_HOST=your-smtp-host
EMAIL_PORT=587
EMAIL_USER=your-email
EMAIL_PASS=your-password
PORT=5000
```

## Rate Limiting Behavior

### Development Mode (NODE_ENV=development)
- ✅ NO rate limiting on authentication endpoints
- ✅ NO general request rate limiting  
- ✅ NO speed limiting
- ✅ Full logging for debugging

### Production Mode (NODE_ENV=production)
- 🔒 5 login attempts per 15 minutes per IP
- 🔒 100 general requests per 15 minutes per IP
- 🔒 Speed limiting after 50 requests
- 🔒 All security headers enabled
