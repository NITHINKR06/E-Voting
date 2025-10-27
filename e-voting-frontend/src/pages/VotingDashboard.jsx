// src/pages/VotingDashboard.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { getToken, removeToken } from '../utils/auth';

const VotingDashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!getToken()) {
      navigate('/login');
      return;
    }
    fetchCandidates();
    checkVoteStatus();
  }, [navigate]);

  const fetchCandidates = async () => {
    try {
      const res = await api.get('/candidates');
      setCandidates(res.data);
    } catch (error) {
      toast.error('Failed to load candidates');
    } finally {
      setLoading(false);
    }
  };

  const checkVoteStatus = async () => {
    try {
      // Check if user has already voted
      // This would typically come from the backend user info
    } catch (error) {
      console.error('Error checking vote status:', error);
    }
  };

  const handleVote = async (candidateId) => {
    if (!window.confirm('Are you sure you want to vote for this candidate? This action cannot be undone.')) {
      return;
    }

    setVoting(true);
    try {
      await api.post('/candidates/vote', { candidateId });
      setVoted(true);
      toast.success('🎉 Your vote has been cast successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Voting failed');
      if (error.response?.status === 401) {
        removeToken();
        navigate('/login');
      }
    } finally {
      setVoting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading candidates...</p>
        </div>
      </div>
    );
  }

  if (voted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full text-center">
          <div className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h2>
          <p className="text-gray-600 mb-6">Your vote has been recorded successfully.</p>
          <button
            onClick={() => navigate('/results')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
          >
            View Results
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Cast Your Vote
          </h1>
          <p className="text-xl text-gray-600">
            Select your preferred candidate
          </p>
        </div>

        {candidates.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <p className="text-gray-600 text-lg">No candidates available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {candidates.map((candidate, index) => (
              <div 
                key={candidate._id || candidate.id || index} 
                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div className="h-64 bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                  {candidate.photo ? (
                    <img 
                      src={candidate.photo} 
                      alt={candidate.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-white text-6xl font-bold">
                      {candidate.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{candidate.name}</h3>
                  <p className="text-indigo-600 font-semibold mb-3">{candidate.party}</p>
                  <p className="text-gray-600 mb-4 line-clamp-2">{candidate.description}</p>
                  <button 
                    onClick={() => handleVote(candidate._id || candidate.id)}
                    disabled={voted || voting}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {voting ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      'Vote'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VotingDashboard;