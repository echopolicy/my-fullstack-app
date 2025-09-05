import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');

  // Fetch featured polls on mount
  useEffect(() => {
    const fetchPolls = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/polls/featured`);
        
        if (!response.ok) {
          throw new Error('Could not fetch featured polls.');
        }
        
        const data = await response.json();
        setPolls(data);
      } catch (error) {
        console.error('Error fetching featured polls:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, []);

  // Extract unique tags for the filter dropdown
  const uniqueTags = ['All', ...new Set(polls.flatMap((poll) => poll.tags || []))];

  // Filter polls by search term and selected tag
  const filteredPolls = polls.filter((poll) => {
    const matchesSearch = poll.question
      ? poll.question.toLowerCase().includes(searchTerm.toLowerCase())
      : false;
    const matchesTag = selectedTag === 'All' || (poll.tags && poll.tags.includes(selectedTag));
    return matchesSearch && matchesTag;
  });

  // Helper component for rendering poll cards
  const PollsDisplay = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          <p className="text-gray-600 ml-4">Loading featured polls...</p>
        </div>
      );
    }
    if (error) {
      return <p className="text-red-500 text-center animate-pulse">Error: {error}</p>;
    }
    if (filteredPolls.length === 0) {
      return <p className="text-gray-600 text-center col-span-full">No polls match your search. Try another!</p>;
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredPolls.map((poll) => (
          <div
            key={poll.id || poll._id}
            className="bg-white shadow-lg p-6 border rounded-lg flex flex-col transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-blue-200"
          >
            <div className="flex-grow">
              <h3 className="font-semibold text-lg text-blue-900 mb-2">{poll.question}</h3>
              <p className="text-sm text-gray-600 mb-2">
                Total Votes: {Array.isArray(poll.votes) ? poll.votes.reduce((sum, current) => sum + current, 0) : 0}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-2.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      Array.isArray(poll.votes)
                        ? (poll.votes.reduce((sum, current) => sum + current, 0) / 100) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
            <Link
              to={`/polls/${poll.id || poll._id}`}
              className="inline-block mt-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 text-center text-sm font-medium"
            >
              Cast Your Vote
            </Link>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 text-center">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-blue-100 to-green-100 py-16 rounded-lg shadow-lg animate-fade-in">
        <h1 className="text-5xl font-extrabold text-blue-800 mb-4 animate-slide-up">EchoPolicy</h1>
        <p className="text-xl text-gray-800 mb-8 max-w-3xl mx-auto animate-slide-up animation-delay-200">
          Your voice matters! Join thousands in shaping policies through quick, impactful polls.
        </p>
        <Link
          to="/polls"
          className="mr-4 inline-block bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-full shadow-lg hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-300 text-lg font-semibold animate-pulse-slow"
        >
          Start Voting Now
        </Link>
         <Link
          to="/create"
          className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-full shadow-lg hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-300 text-lg font-semibold animate-pulse-slow"
        >
          Create New Poll
        </Link>
      </div>

      {/* How It Works Section */}
      <section className="my-16">
        <h2 className="text-3xl font-semibold text-blue-800 mb-8 animate-slide-up">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {[
            {
              title: '1. Vote or Create',
              description: 'Jump into polls that spark your interest or launch your own in seconds.',
            },
            {
              title: '2. Discover Insights',
              description: 'See real-time results and uncover what your community thinks.',
            },
            {
              title: '3. Drive Change',
              description: 'Share poll results to spark conversations and influence decisions.',
            },
          ].map((step, index) => (
            <div
              key={index}
              className="bg-white shadow-lg p-6 rounded-lg border transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-green-200 animate-slide-up"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <h3 className="font-bold text-lg text-blue-800 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Polls Section */}
      <section className="mb-12 text-left max-w-5xl mx-auto">
        <h2 className="text-3xl font-semibold text-blue-800 mb-6 animate-slide-up">Trending Polls</h2>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Find polls that matter to you..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded-lg w-full sm:flex-grow focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
          />
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="px-4 py-2 border rounded-lg w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
          >
            {uniqueTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        <PollsDisplay />
      </section>

      <footer className="text-gray-600 font-medium mt-16 animate-fade-in">
        “Your vote is your voice—make it count!”
      </footer>
    </div>
  );
};

export default Home;