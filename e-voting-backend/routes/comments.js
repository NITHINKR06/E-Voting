const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// GET /api/comments - Get all comments for an election
router.get('/', commentController.getComments);

// POST /api/comments - Create a new comment
router.post('/', commentController.createComment);

// GET /api/comments/:id/replies - Get replies for a comment
router.get('/:id/replies', commentController.getReplies);

// PUT /api/comments/:id - Update a comment
router.put('/:id', commentController.updateComment);

// DELETE /api/comments/:id - Delete a comment
router.delete('/:id', commentController.deleteComment);

// POST /api/comments/:id/like - Like/Unlike a comment
router.post('/:id/like', commentController.toggleLike);

module.exports = router;
