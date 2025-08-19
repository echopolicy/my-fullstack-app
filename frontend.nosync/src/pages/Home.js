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
        // CORRECTED: Using the environment variable for the API URL
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
      return <p className="text-gray-600">Loading featured polls...</p>;
    }
    if (error) {
      return <p className="text-red-500">Error: {error}</p>;
    }
    if (filteredPolls.length === 0) {
      return <p className="text-gray-600 col-span-full">No featured polls match your criteria.</p>;
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredPolls.map((poll) => (
          <div key={poll.id || poll._id} className="bg-white shadow p-4 border rounded flex flex-col">
            <div className="flex-grow">
              <h3 className="font-semibold text-base mb-2">{poll.question}</h3>
              <p className="text-sm text-gray-600 mb-2">
                 {/* CORRECTED: Sum the votes array */}
                Total Votes: {Array.isArray(poll.votes) ? poll.votes.reduce((sum, current) => sum + current, 0) : 0}
              </p>
            </div>
            <Link
              to={`/polls/${poll.id || poll._id}`}
              className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-center text-sm"
            >
              Vote Now
            </Link>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 text-center">
      {/* Hero Section */}
      <h1 className="text-4xl font-bold text-blue-700 mb-4">EchoPolicy</h1>
      <p className="text-lg text-gray-700 mb-6 max-w-3xl mx-auto">
        Our mission is simple: to amplify public and workplace voices through short, impactful polls—influencing policies that matter.
      </p>
      <Link
        to="/polls"
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded shadow hover:bg-blue-700 transition mb-16"
      >
        Get Started – View All Polls
      </Link>

      {/* How It Works Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-white shadow p-6 rounded border">
            <h3 className="font-bold mb-2">1. Create or Vote</h3>
            <p className="text-sm text-gray-600">Start your own poll or participate in polls that matter to you.</p>
          </div>
          <div className="bg-white shadow p-6 rounded border">
            <h3 className="font-bold mb-2">2. See the Data</h3>
            <p className="text-sm text-gray-600">We aggregate responses to surface honest, community-powered insights.</p>
          </div>
          <div className="bg-white shadow p-6 rounded border">
            <h3 className="font-bold mb-2">3. Share the Impact</h3>
            <p className="text-sm text-gray-600">Use data to inform decisions, support change, and drive policy conversations.</p>
          </div>
        </div>
      </section>

      {/* Featured Polls Section */}
      <section className="mb-12 text-left max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Featured Polls</h2>

        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            type="text"
            placeholder="Search featured polls..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded w-full sm:flex-grow"
          />
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="px-4 py-2 border rounded w-full sm:w-auto"
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

      <footer className="text-gray-500 italic mt-16">
        “Change doesn't start with lawmakers—it starts with voices like yours.”
      </footer>
    </div>
  );
};

export default Home;
