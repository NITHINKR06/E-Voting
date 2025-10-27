const express = require('express');
const { addCandidate, viewResults } = require('../controllers/adminController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const router = express.Router();

router.post('/addCandidate', auth, admin, addCandidate);
router.get('/viewResults', auth, admin, viewResults);

module.exports = router;