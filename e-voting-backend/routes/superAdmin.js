const express = require('express');
const { createSuperAdmin, checkAdminExists } = require('../controllers/superAdminController');
const router = express.Router();

// Public routes for initial admin setup
router.post('/create-super-admin', createSuperAdmin);
router.get('/check-admin', checkAdminExists);

module.exports = router;
