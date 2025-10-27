const express = require('express');
const { body } = require('express-validator');
const { 
  adminLogin, 
  createAdmin, 
  updateAdminProfile, 
  changeAdminPassword, 
  getAdminInfo 
} = require('../controllers/adminAuthController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const router = express.Router();

// Public admin routes
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
], adminLogin);

router.post('/create', [
  body('name').notEmpty().trim().escape(),
  body('rollNumber').notEmpty().trim().escape(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('adminSecret').notEmpty(),
], createAdmin);

// Protected admin routes
router.get('/profile', auth, admin, getAdminInfo);
router.put('/profile', auth, admin, updateAdminProfile);
router.put('/change-password', auth, admin, changeAdminPassword);

module.exports = router;
