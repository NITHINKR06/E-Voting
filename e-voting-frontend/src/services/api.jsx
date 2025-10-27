// src/services/api.js
import axios from 'axios';
import { getToken } from '../utils/auth';

const API_BASE_URL = 'http://localhost:5000/api'; // Replace with your backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
});

// Add JWT to requests if available
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Comment API functions
export const commentAPI = {
  // Get all comments for an election
  getComments: (electionId, candidateId = null) => {
    const params = { electionId };
    if (candidateId) params.candidateId = candidateId;
    return api.get('/comments', { params });
  },

  // Create a new comment
  createComment: (commentData) => {
    return api.post('/comments', commentData);
  },

  // Update a comment
  updateComment: (commentId, content) => {
    return api.put(`/comments/${commentId}`, { content });
  },

  // Delete a comment
  deleteComment: (commentId) => {
    return api.delete(`/comments/${commentId}`);
  },

  // Like/Unlike a comment
  toggleLike: (commentId) => {
    return api.post(`/comments/${commentId}/like`);
  },

  // Get replies for a comment
  getReplies: (commentId) => {
    return api.get(`/comments/${commentId}/replies`);
  }
};

export default api;