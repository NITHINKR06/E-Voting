const express = require('express');
const { body } = require('express-validator');
const { register, login, verifyOTP } = require('../controllers/authController');
const router = express.Router();

router.post('/register', [
  body('name').notEmpty(),
  body('rollNumber').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
], register);

router.post('/login', login);
router.post('/verify-otp', verifyOTP);

module.exports = router;