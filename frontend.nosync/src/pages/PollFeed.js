import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PollFeed = () => {
  const [polls, setPolls] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5001/api/polls')  // Adjust this if needed
      .then(res => res.json())
      .then(data => {
        console.log('Fetched polls:', data);
        setPolls(data);
      })
      .catch(err => console.error('Error fetching polls:', err));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">All Active Polls</h2>

      {polls.length === 0 ? (
        <p className="text-gray-600">No active polls available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {polls.map(poll => (
            <div key={poll.id} className="bg-white shadow border rounded p-4 relative">
              <h3 className="text-lg font-semibold mb-2">{poll.question}</h3>

              {/* Tags (optional) */}
              {poll.tags && poll.tags.length > 0 && (
                <div className="mb-2">
                  {poll.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded mr-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Close date & vote info */}
              <p className="text-sm text-gray-600">
                Votes: {Array.isArray(poll.votes) ? poll.votes.reduce((a, b) => a + b, 0) : 0} | Closes: {poll.closeDate}
              </p>

              {/* Vote Now */}
              <button
                onClick={() => navigate(`/polls/${poll.id}`)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
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