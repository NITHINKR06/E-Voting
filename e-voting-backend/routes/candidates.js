const express = require('express');
const { getCandidates, vote } = require('../controllers/candidateController');
const auth = require('../middleware/auth');
const { voteLimiter, auditLogger } = require('../middleware/security');
const router = express.Router();

router.get('/', auditLogger('GET_CANDIDATES', 'CANDIDATE'), getCandidates);
router.post('/vote', [
  auth,
  voteLimiter,
  auditLogger('VOTE', 'CANDIDATE')
], vote);

module.exports = router;