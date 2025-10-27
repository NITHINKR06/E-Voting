const Comment = require('../models/Comment');
const User = require('../models/User');

// Get all comments for an election
const getComments = async (req, res) => {
  try {
    console.log('getComments - req.user:', req.user);
    console.log('getComments - req.query:', req.query);
    
    const { electionId, candidateId } = req.query;
    
    let query = { 
      isDeleted: false,
      parentComment: null  // Only top-level comments
    };
    
    if (electionId) {
      query.electionId = electionId;
    }
    
    if (candidateId) {
      query.candidateId = candidateId;
    }

    console.log('getComments - query:', query);

    const comments = await Comment.find(query)
      .populate('author', 'name email')
      .populate('likes', 'name')
      .populate({
        path: 'replies',
        populate: {
          path: 'author',
          select: 'name email'
        }
      })
      .sort({ createdAt: -1 });

    console.log('getComments - found comments:', comments.length);
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
};

// Create a new comment
const createComment = async (req, res) => {
  try {
    const { content, electionId, candidateId, parentCommentId } = req.body;
    const userId = req.user.id;

    // Validate content
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    if (content.length > 500) {
      return res.status(400).json({ message: 'Comment is too long (max 500 characters)' });
    }

    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const commentData = {
      content: content.trim(),
      author: userId,
      authorName: user.name,
      electionId,
      candidateId: candidateId || null,
      parentComment: parentCommentId || null
    };

    const comment = new Comment(commentData);
    await comment.save();

    // If this is a reply, add it to parent comment's replies
    if (parentCommentId) {
      await Comment.findByIdAndUpdate(
        parentCommentId,
        { $push: { replies: comment._id } }
      );
    }

    // Populate the comment before sending
    await comment.populate('author', 'name email');

    res.status(201).json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Failed to create comment' });
  }
};

// Update a comment
const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    if (content.length > 500) {
      return res.status(400).json({ message: 'Comment is too long (max 500 characters)' });
    }

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is the author
    if (comment.author.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to edit this comment' });
    }

    // Check if comment is deleted
    if (comment.isDeleted) {
      return res.status(400).json({ message: 'Cannot edit deleted comment' });
    }

    comment.content = content.trim();
    comment.isEdited = true;
    comment.editedAt = new Date();

    await comment.save();
    await comment.populate('author', 'name email');

    res.json(comment);
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ message: 'Failed to update comment' });
  }
};

// Delete a comment (soft delete)
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is the author
    if (comment.author.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    // Soft delete
    comment.isDeleted = true;
    comment.deletedAt = new Date();
    comment.content = '[This comment has been deleted]';

    await comment.save();

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Failed to delete comment' });
  }
};

// Like/Unlike a comment
const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.isDeleted) {
      return res.status(400).json({ message: 'Cannot like deleted comment' });
    }

    const isLiked = comment.likes.includes(userId);

    if (isLiked) {
      // Unlike
      comment.likes.pull(userId);
    } else {
      // Like
      comment.likes.push(userId);
    }

    await comment.save();

    res.json({ 
      isLiked: !isLiked, 
      likesCount: comment.likes.length 
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ message: 'Failed to toggle like' });
  }
};

// Get comment replies
const getReplies = async (req, res) => {
  try {
    const { id } = req.params;

    const replies = await Comment.find({ 
      parentComment: id, 
      isDeleted: false 
    })
      .populate('author', 'name email')
      .populate('likes', 'name')
      .sort({ createdAt: 1 });

    res.json(replies);
  } catch (error) {
    console.error('Error fetching replies:', error);
    res.status(500).json({ message: 'Failed to fetch replies' });
  }
};

module.exports = {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  toggleLike,
  getReplies
};
