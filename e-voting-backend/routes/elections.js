const express = require('express');
const {
  createElection,
  getAllElections,
  getElectionById,
  updateElection,
  deleteElection,
  startElection,
  endElection,
  addCandidateToElection,
  removeCandidateFromElection,
  getActiveElection,
  getElectionStats
} = require('../controllers/electionController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const router = express.Router();

// Public routes
router.get('/active', getActiveElection);
router.get('/:id', getElectionById);
router.get('/:id/stats', getElectionStats);

// Admin routes
router.post('/', auth, admin, createElection);
router.get('/', auth, admin, getAllElections);
router.put('/:id', auth, admin, updateElection);
router.delete('/:id', auth, admin, deleteElection);
router.post('/:id/start', auth, admin, startElection);
router.post('/:id/end', auth, admin, endElection);
router.post('/candidates/add', auth, admin, addCandidateToElection);
router.post('/candidates/remove', auth, admin, removeCandidateFromElection);

module.exports = router;
