const express = require('express');
const { body } = require('express-validator');
const { register, login, verifyOTP } = require('../controllers/authController');
const { authLimiter, auditLogger } = require('../middleware/security');
const router = express.Router();

router.post('/register', [
  authLimiter,
  auditLogger('REGISTER', 'USER'),
  body('name').notEmpty().trim().escape(),
  body('rollNumber').notEmpty().trim().escape(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
], register);

router.post('/login', [
  authLimiter,
  auditLogger('LOGIN', 'USER'),
], login);

router.post('/verify-otp', [
  authLimiter,
  auditLogger('VERIFY_OTP', 'USER'),
], verifyOTP);

module.exports = router;