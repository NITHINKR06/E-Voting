// src/components/Comment.jsx
import { useState } from 'react';
import { toast } from 'react-toastify';
import { commentAPI } from '../services/api';

// Simple date formatting function
const formatTimeAgo = (date) => {
  const now = new Date();
  const commentDate = new Date(date);
  const diffInSeconds = Math.floor((now - commentDate) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
};

const Comment = ({ comment, onUpdate, onDelete, onLike, currentUserId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState([]);
  const [loadingReplies, setLoadingReplies] = useState(false);

  const isAuthor = comment.author._id === currentUserId;
  const isLiked = comment.likes.some(like => like._id === currentUserId);

  const handleEdit = async () => {
    if (!editContent.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      await commentAPI.updateComment(comment._id, editContent);
      onUpdate(comment._id, editContent);
      setIsEditing(false);
      toast.success('Comment updated successfully');
    } catch (error) {
      toast.error('Failed to update comment');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await commentAPI.deleteComment(comment._id);
        onDelete(comment._id);
        toast.success('Comment deleted successfully');
      } catch (error) {
        toast.error('Failed to delete comment');
      }
    }
  };

  const handleLike = async () => {
    try {
      const response = await commentAPI.toggleLike(comment._id);
      onLike(comment._id, response.data.isLiked, response.data.likesCount);
    } catch (error) {
      toast.error('Failed to like comment');
    }
  };

  const handleReply = async () => {
    if (!replyContent.trim()) {
      toast.error('Reply cannot be empty');
      return;
    }

    try {
      const response = await commentAPI.createComment({
        content: replyContent,
        electionId: comment.electionId,
        candidateId: comment.candidateId,
        parentCommentId: comment._id
      });
      
      setReplies(prev => [response.data, ...prev]);
      setReplyContent('');
      setIsReplying(false);
      toast.success('Reply posted successfully');
    } catch (error) {
      toast.error('Failed to post reply');
    }
  };

  const loadReplies = async () => {
    if (replies.length > 0) {
      setShowReplies(!showReplies);
      return;
    }

    setLoadingReplies(true);
    try {
      const response = await commentAPI.getReplies(comment._id);
      setReplies(response.data);
      setShowReplies(true);
    } catch (error) {
      toast.error('Failed to load replies');
    } finally {
      setLoadingReplies(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-3">
      {/* Comment Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            {comment.authorName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-800">{comment.authorName}</p>
            <p className="text-xs text-gray-500">
              {formatTimeAgo(comment.createdAt)}
              {comment.isEdited && (
                <span className="ml-1 text-gray-400">(edited)</span>
              )}
            </p>
          </div>
        </div>
        
        {isAuthor && (
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Comment Content */}
      {isEditing ? (
        <div className="mb-3">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="3"
            maxLength="500"
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500">{editContent.length}/500</span>
            <div className="space-x-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-800 mb-3">{comment.content}</p>
      )}

      {/* Comment Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-1 text-sm ${
              isLiked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
            }`}
          >
            <svg className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>{comment.likes.length}</span>
          </button>
          
          <button
            onClick={() => setIsReplying(!isReplying)}
            className="text-gray-600 hover:text-blue-600 text-sm"
          >
            Reply
          </button>
          
          {comment.replies && comment.replies.length > 0 && (
            <button
              onClick={loadReplies}
              className="text-gray-600 hover:text-blue-600 text-sm"
            >
              {showReplies ? 'Hide' : 'Show'} {comment.replies.length} replies
            </button>
          )}
        </div>
      </div>

      {/* Reply Form */}
      {isReplying && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="2"
            maxLength="500"
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500">{replyContent.length}/500</span>
            <div className="space-x-2">
              <button
                onClick={() => setIsReplying(false)}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleReply}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                Reply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Replies */}
      {showReplies && (
        <div className="mt-3 ml-6 space-y-2">
          {loadingReplies ? (
            <div className="text-center py-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : (
            replies.map((reply) => (
              <Comment
                key={reply._id}
                comment={reply}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onLike={onLike}
                currentUserId={currentUserId}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Comment;
