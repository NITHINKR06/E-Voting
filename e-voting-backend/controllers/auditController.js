const AuditLog = require('../models/AuditLog');
const User = require('../models/User');

exports.getAuditLogs = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      action, 
      userId, 
      ipAddress, 
      success,
      startDate,
      endDate 
    } = req.query;

    const filter = {};
    
    if (action) filter.action = action;
    if (userId) filter.userId = userId;
    if (ipAddress) filter.ipAddress = { $regex: ipAddress, $options: 'i' };
    if (success !== undefined) filter.success = success === 'true';
    
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }

    const logs = await AuditLog.find(filter)
      .populate('userId', 'name email rollNumber')
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await AuditLog.countDocuments(filter);

    res.json({
      logs,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSecurityStats = async (req, res) => {
  try {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalLogs,
      failedAttempts24h,
      uniqueIPs24h,
      topActions,
      topIPs,
      suspiciousActivity
    ] = await Promise.all([
      AuditLog.countDocuments(),
      AuditLog.countDocuments({ 
        success: false, 
        timestamp: { $gte: last24Hours } 
      }),
      AuditLog.distinct('ipAddress', { 
        timestamp: { $gte: last24Hours } 
      }),
      AuditLog.aggregate([
        { $match: { timestamp: { $gte: last7Days } } },
        { $group: { _id: '$action', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      AuditLog.aggregate([
        { $match: { timestamp: { $gte: last7Days } } },
        { $group: { _id: '$ipAddress', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      AuditLog.find({
        success: false,
        timestamp: { $gte: last24Hours }
      })
      .populate('userId', 'name email')
      .sort({ timestamp: -1 })
      .limit(20)
    ]);

    res.json({
      stats: {
        totalLogs,
        failedAttempts24h,
        uniqueIPs24h: uniqueIPs24h.length,
        suspiciousActivityCount: suspiciousActivity.length
      },
      topActions,
      topIPs,
      recentSuspiciousActivity: suspiciousActivity
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserAuditLogs = async (req, res) => {
  const { userId } = req.params;
  try {
    const logs = await AuditLog.find({ userId })
      .sort({ timestamp: -1 })
      .limit(100);

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.exportAuditLogs = async (req, res) => {
  try {
    const { format = 'json', startDate, endDate } = req.query;
    
    const filter = {};
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }

    const logs = await AuditLog.find(filter)
      .populate('userId', 'name email rollNumber')
      .sort({ timestamp: -1 });

    if (format === 'csv') {
      const csv = convertToCSV(logs);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=audit-logs.csv');
      res.send(csv);
    } else {
      res.json(logs);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const convertToCSV = (logs) => {
  const headers = [
    'Timestamp',
    'User',
    'Email',
    'Action',
    'Resource',
    'IP Address',
    'User Agent',
    'Success',
    'Error Message'
  ];

  const rows = logs.map(log => [
    log.timestamp.toISOString(),
    log.userId?.name || 'N/A',
    log.userId?.email || 'N/A',
    log.action,
    log.resource,
    log.ipAddress,
    log.userAgent,
    log.success,
    log.errorMessage || ''
  ]);

  return [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');
};
