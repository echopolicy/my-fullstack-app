import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PollFeed = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        // CORRECTED: Using the environment variable for the API URL
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

  if (loading) {
    return <div className="text-center p-10">Loading polls...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">All Active Polls</h2>

      {polls.length === 0 ? (
        <p className="text-gray-600">No active polls are available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {polls.map(poll => (
            <div key={poll.id || poll._id} className="bg-white shadow border rounded p-4 flex flex-col">
              <div className="flex-grow">
                <h3 className="text-lg font-semibold mb-2">{poll.question}</h3>

                {poll.tags && poll.tags.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-1">
                    {poll.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-sm text-gray-600">
                  Total Votes: {Array.isArray(poll.votes) ? poll.votes.reduce((sum, current) => sum + current, 0) : 0}
                </p>
                {poll.closeDate && (
                   <p className="text-sm text-gray-500">
                     Closes: {new Date(poll.closeDate).toLocaleDateString()}
                   </p>
                )}
              </div>
              
              <button
                onClick={() => navigate(`/polls/${poll.id || poll._id}`)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition self-start"
              >
                Vote Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PollFeed;