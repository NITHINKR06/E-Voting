const express = require('express');
const {
  getAuditLogs,
  getSecurityStats,
  getUserAuditLogs,
  exportAuditLogs
} = require('../controllers/auditController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const router = express.Router();

// All audit routes require admin access
router.get('/', auth, admin, getAuditLogs);
router.get('/stats', auth, admin, getSecurityStats);
router.get('/user/:userId', auth, admin, getUserAuditLogs);
router.get('/export', auth, admin, exportAuditLogs);

module.exports = router;
