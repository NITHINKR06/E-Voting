const express = require('express');
const { 
  addCandidate, 
  updateCandidate, 
  deleteCandidate, 
  viewResults, 
  getDashboardStats, 
  getAllUsers, 
  updateUserStatus, 
  resetVoting 
} = require('../controllers/adminController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const router = express.Router();

// Candidate management
router.post('/addCandidate', auth, admin, addCandidate);
router.put('/candidates/:id', auth, admin, updateCandidate);
router.delete('/candidates/:id', auth, admin, deleteCandidate);

// Results and statistics
router.get('/viewResults', auth, admin, viewResults);
router.get('/dashboard', auth, admin, getDashboardStats);

// User management
router.get('/users', auth, admin, getAllUsers);
router.put('/users/:id', auth, admin, updateUserStatus);

// Voting control
router.post('/resetVoting', auth, admin, resetVoting);

module.exports = router;