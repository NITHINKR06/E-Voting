// src/pages/ResultPage.jsx
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

const ResultPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    fetchResults();
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
          </>
        )}
      </div>
    </div>
  );
};

export default ResultPage;