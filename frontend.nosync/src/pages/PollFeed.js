// src/pages/PollFeed.js
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PollShare from '../components/PollShare';

// Define categories outside the component so it doesn't get recreated on every render
const CATEGORY_OPTIONS = ['All', 'Workplace', 'Tech', 'Politics', 'Education', 'Health'];

const PollFeed = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // State for the search input
  const [selectedCategory, setSelectedCategory] = useState('All'); // State for the category filter
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/polls`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPolls(data);
      } catch (err) {
        console.error('Error fetching polls:', err);
        setError('Failed to load polls. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, []);

  // Apply filters to the polls
  const filteredPolls = polls.filter((poll) => {
    const matchesCategory = selectedCategory === 'All' || poll.category === selectedCategory;
    const matchesSearch = poll.question.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return <div className="text-center p-10">Loading polls...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">All Active Polls</h2>

      {/* Filter and Search Section */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by poll question..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-md w-full sm:flex-grow"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border rounded-md w-full sm:w-auto"
        >
          {CATEGORY_OPTIONS.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {filteredPolls.length === 0 ? (
        <p className="text-gray-600 text-center">No polls match your criteria.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPolls.map((poll) => {
            const pollId = poll.id || poll._id;
            const totalVotes = Array.isArray(poll.votes)
              ? poll.votes.reduce((sum, current) => sum + current, 0)
              : 0;

            return (
              <div
                key={pollId}
                className="bg-white shadow border rounded p-4 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-semibold mb-2">{poll.question}</h3>
                  {poll.tags && poll.tags.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-1">
                      {poll.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-gray-600">Total Votes: {totalVotes}</p>
                  {poll.closeDate && (
                    <p className="text-sm text-gray-500">
                      Closes: {new Date(poll.closeDate).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="mt-4">
                  <button
                    onClick={() => navigate(`/polls/${pollId}`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition self-start w-full text-center"
                  >
                    Vote Now
                  </button>

                  {/* Compact Share */}
                  <div className="mt-4">
                 <PollShare
                    shareUrl={`https://echopolicy.com/polls/${pollId}`}
                    pollQuestion={poll.question}
                    pollId={pollId}
                    variant="compact"
                  />

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PollFeed;