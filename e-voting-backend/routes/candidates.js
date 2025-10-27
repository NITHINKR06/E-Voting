const express = require('express');
const { getCandidates, vote } = require('../controllers/candidateController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', getCandidates);
router.post('/vote', auth, vote);

module.exports = router;