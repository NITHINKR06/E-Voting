import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { getToken, removeToken, isAdmin } from '../utils/auth';

const ElectionManagement = () => {
  const [elections, setElections] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('elections');
  const [showCreateElection, setShowCreateElection] = useState(false);
  const [editingElection, setEditingElection] = useState(null);
  const [newElection, setNewElection] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    settings: {
      allowMultipleVotes: false,
      requireVerification: true,
      showResultsBeforeEnd: false,
      maxCandidates: 10
    }
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!getToken()) {
      navigate('/login');
      return;
    }
    
    // Additional admin check
    if (!isAdmin()) {
      toast.error('Admin access required');
      navigate('/dashboard');
      return;
    }
    
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [electionsRes, candidatesRes] = await Promise.all([
        api.get('/elections'),
        api.get('/candidates')
      ]);
      
      setElections(electionsRes.data);
      setCandidates(candidatesRes.data);
    } catch (error) {
      toast.error('Failed to load data');
      if (error.response?.status === 401) {
        removeToken();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateElection = async (e) => {
    e.preventDefault();
    try {
      await api.post('/elections', newElection);
      toast.success('Election created successfully');
      setNewElection({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        settings: {
          allowMultipleVotes: false,
          requireVerification: true,
          showResultsBeforeEnd: false,
          maxCandidates: 10
        }
      });
      setShowCreateElection(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create election');
    }
  };

  const handleUpdateElection = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/elections/${editingElection._id}`, editingElection);
      toast.success('Election updated successfully');
      setEditingElection(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update election');
    }
  };

  const handleDeleteElection = async (id) => {
    if (!window.confirm('Are you sure you want to delete this election?')) return;
    
    try {
      await api.delete(`/elections/${id}`);
      toast.success('Election deleted successfully');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete election');
    }
  };

  const handleStartElection = async (id) => {
    if (!window.confirm('Are you sure you want to start this election?')) return;
    
    try {
      await api.post(`/elections/${id}/start`);
      toast.success('Election started successfully');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to start election');
    }
  };

  const handleEndElection = async (id) => {
    if (!window.confirm('Are you sure you want to end this election?')) return;
    
    try {
      await api.post(`/elections/${id}/end`);
      toast.success('Election ended successfully');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to end election');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      upcoming: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading elections...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'elections', name: 'Elections', icon: '🗳️' },
    { id: 'candidates', name: 'Candidates', icon: '👥' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">Election Management</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/admin')}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Back to Admin
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg p-2 mb-8">
          <div className="flex space-x-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="font-medium">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Elections Tab */}
        {activeTab === 'elections' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Elections</h2>
              <button
                onClick={() => setShowCreateElection(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Election
              </button>
            </div>

            {/* Create Election Modal */}
            {showCreateElection && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Create New Election</h3>
                  <form onSubmit={handleCreateElection}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Election Title</label>
                        <input
                          type="text"
                          placeholder="Enter election title"
                          value={newElection.title}
                          onChange={(e) => setNewElection({...newElection, title: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                          placeholder="Enter election description"
                          value={newElection.description}
                          onChange={(e) => setNewElection({...newElection, description: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows="3"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Start Date & Time</label>
                          <input
                            type="datetime-local"
                            value={newElection.startDate}
                            onChange={(e) => setNewElection({...newElection, startDate: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">End Date & Time</label>
                          <input
                            type="datetime-local"
                            value={newElection.endDate}
                            onChange={(e) => setNewElection({...newElection, endDate: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Max Candidates</label>
                        <input
                          type="number"
                          min="1"
                          max="50"
                          value={newElection.settings.maxCandidates}
                          onChange={(e) => setNewElection({
                            ...newElection, 
                            settings: {...newElection.settings, maxCandidates: parseInt(e.target.value)}
                          })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={newElection.settings.allowMultipleVotes}
                            onChange={(e) => setNewElection({
                              ...newElection, 
                              settings: {...newElection.settings, allowMultipleVotes: e.target.checked}
                            })}
                            className="mr-2"
                          />
                          Allow Multiple Votes
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={newElection.settings.showResultsBeforeEnd}
                            onChange={(e) => setNewElection({
                              ...newElection, 
                              settings: {...newElection.settings, showResultsBeforeEnd: e.target.checked}
                            })}
                            className="mr-2"
                          />
                          Show Results Before End
                        </label>
                      </div>
                    </div>
                    <div className="flex space-x-4 mt-6">
                      <button
                        type="submit"
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Create Election
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCreateElection(false)}
                        className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Elections List */}
            <div className="space-y-4">
              {elections.map((election) => (
                <div key={election._id} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{election.title}</h3>
                      <p className="text-gray-600 mt-1">{election.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(election.status)}`}>
                          {election.status.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-500">
                          {election.candidates.length} candidates
                        </span>
                        <span className="text-sm text-gray-500">
                          {election.totalVotes} votes
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {election.status === 'upcoming' && (
                        <button
                          onClick={() => handleStartElection(election._id)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                        >
                          Start
                        </button>
                      )}
                      {election.status === 'active' && (
                        <button
                          onClick={() => handleEndElection(election._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                        >
                          End
                        </button>
                      )}
                      <button
                        onClick={() => setEditingElection(election)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteElection(election._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <strong>Start:</strong> {formatDate(election.startDate)}
                    </div>
                    <div>
                      <strong>End:</strong> {formatDate(election.endDate)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Candidates Tab */}
        {activeTab === 'candidates' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">All Candidates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidates.map((candidate) => (
                <div key={candidate._id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="h-48 bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                    {candidate.photo ? (
                      <img 
                        src={candidate.photo} 
                        alt={candidate.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-white text-4xl font-bold">
                        {candidate.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800">{candidate.name}</h3>
                    <p className="text-blue-600 font-semibold">{candidate.party}</p>
                    <p className="text-gray-600 text-sm mt-2">{candidate.description}</p>
                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-sm text-gray-500">{candidate.votes} votes</span>
                      <button
                        onClick={() => navigate('/admin')}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                      >
                        Manage
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ElectionManagement;
