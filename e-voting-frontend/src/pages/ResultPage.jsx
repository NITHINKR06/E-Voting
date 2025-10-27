// src/pages/ResultPage.jsx
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api, { commentAPI } from '../services/api';
import Comment from '../components/Comment';
import { getUser } from '../utils/auth';

const ResultPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalVotes, setTotalVotes] = useState(0);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchResults();
    setCurrentUser(getUser());
  }, []);

  const fetchResults = async () => {
    try {
      const res = await api.get('/candidates');
      const sortedResults = res.data.sort((a, b) => b.votes - a.votes);
      setResults(sortedResults);
      setTotalVotes(sortedResults.reduce((sum, candidate) => sum + candidate.votes, 0));
    } catch (error) {
      toast.error('Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const getPercentage = (votes) => {
    if (totalVotes === 0) return 0;
    return ((votes / totalVotes) * 100).toFixed(1);
  };

  const getRankColor = (index) => {
    const colors = ['bg-yellow-100 text-yellow-800', 'bg-gray-100 text-gray-800', 'bg-orange-100 text-orange-800'];
    return colors[index] || 'bg-blue-100 text-blue-800';
  };

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const response = await commentAPI.getComments('general'); // Using 'general' as electionId for now
      setComments(response.data);
    } catch (error) {
      toast.error('Failed to load comments');
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    if (!currentUser) {
      toast.error('Please login to comment');
      return;
    }

    try {
      const response = await commentAPI.createComment({
        content: newComment,
        electionId: 'general', // Using 'general' as electionId for now
        candidateId: null
      });
      
      setComments(prev => [response.data, ...prev]);
      setNewComment('');
      toast.success('Comment posted successfully');
    } catch (error) {
      toast.error('Failed to post comment');
    }
  };

  const handleUpdateComment = (commentId, newContent) => {
    setComments(prev => 
      prev.map(comment => 
        comment._id === commentId 
          ? { ...comment, content: newContent, isEdited: true, editedAt: new Date() }
          : comment
      )
    );
  };

  const handleDeleteComment = (commentId) => {
    setComments(prev => prev.filter(comment => comment._id !== commentId));
  };

  const handleLikeComment = (commentId, isLiked, likesCount) => {
    setComments(prev => 
      prev.map(comment => 
        comment._id === commentId 
          ? { 
              ...comment, 
              likes: isLiked 
                ? [...comment.likes, { _id: currentUser.id, name: currentUser.name }]
                : comment.likes.filter(like => like._id !== currentUser.id),
              likesCount: likesCount
            }
          : comment
      )
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Election Results
          </h1>
          <p className="text-xl text-gray-600">
            Live voting statistics
          </p>
        </div>

        {results.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <p className="text-gray-600 text-lg">No results available at the moment.</p>
          </div>
        ) : (
          <>
            {/* Total Votes Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 text-center">
              <p className="text-gray-600 mb-2">Total Votes Cast</p>
              <p className="text-4xl font-bold text-blue-600">{totalVotes}</p>
            </div>

            {/* Results List */}
            <div className="space-y-4">
              {results.map((result, index) => (
                <div 
                  key={result._id || result.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getRankColor(index)}`}>
                          #{index + 1}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-800">{result.name}</h3>
                          <p className="text-indigo-600 font-semibold">{result.party}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-gray-800">{result.votes}</p>
                        <p className="text-sm text-gray-600">votes</p>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-4 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${getPercentage(result.votes)}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600">{getPercentage(result.votes)}% of total votes</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Winner Announcement */}
            {results.length > 0 && results[0].votes > 0 && (
              <div className="mt-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl shadow-lg p-8 text-center">
                <div className="inline-block bg-white rounded-full p-4 mb-4">
                  <svg className="w-12 h-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Winner!</h2>
                <p className="text-xl text-white font-semibold">{results[0].name}</p>
                <p className="text-white">{results[0].party}</p>
              </div>
            )}

            {/* Comments Section */}
            <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Comments & Discussion</h2>
                <button
                  onClick={() => {
                    setShowComments(!showComments);
                    if (!showComments && comments.length === 0) {
                      fetchComments();
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {showComments ? 'Hide Comments' : 'Show Comments'}
                </button>
              </div>

              {showComments && (
                <>
                  {/* Add Comment Form */}
                  {currentUser ? (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <span className="font-semibold text-gray-800">{currentUser.name || 'User'}</span>
                      </div>
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Share your thoughts about the election results..."
                        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="3"
                        maxLength="500"
                      />
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">{newComment.length}/500</span>
                        <button
                          onClick={handleAddComment}
                          disabled={!newComment.trim()}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                          Post Comment
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                      <p className="text-yellow-800">Please login to post comments</p>
                    </div>
                  )}

                  {/* Comments List */}
                  {loadingComments ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-2 text-gray-600">Loading comments...</p>
                    </div>
                  ) : comments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <p>No comments yet. Be the first to share your thoughts!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <Comment
                          key={comment._id}
                          comment={comment}
                          onUpdate={handleUpdateComment}
                          onDelete={handleDeleteComment}
                          onLike={handleLikeComment}
                          currentUserId={currentUser?.id}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResultPage;