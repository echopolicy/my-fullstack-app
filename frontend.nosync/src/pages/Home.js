import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [polls, setPolls] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');

  // Fetch featured polls on mount
  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/polls/featured');
        const data = await response.json();
        setPolls(data);
      } catch (error) {
        console.error('Error fetching featured polls:', error);
      }
    };

    fetchPolls();
  }, []);

  // Extract unique tags
  const uniqueTags = ['All', ...new Set(polls.flatMap((poll) => poll.tags || []))];

  // Filter polls by search and selected tag
  const filteredPolls = polls.filter((poll) => {
    const matchesSearch = poll.question
      ? poll.question.toLowerCase().includes(searchTerm.toLowerCase())
      : false;
    const matchesTag = selectedTag === 'All' || poll.tags?.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="max-w-5xl mx-auto py-16 px-4 text-center">
      <h1 className="text-4xl font-bold text-blue-700 mb-4">EchoPolicy</h1>
      <p className="text-lg text-gray-700 mb-4">
        Our mission is simple: to amplify public and workplace voices through short, impactful polls—
        influencing policies that matter. Your opinion shouldn't end at the watercooler. With EchoPolicy, it echoes where it counts.
      </p>
      <a
        href="/polls"
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded shadow hover:bg-blue-700 transition mb-12"
      >
        Get Started – View Polls
      </a>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Why EchoPolicy?</h2>
        <p className="text-gray-600">
          Whether you're an employee, a citizen, or a policymaker—knowing how people feel about issues helps
          drive better, more inclusive decisions. We’re here to make feedback powerful, accessible, and action-driven.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">How It Works</h2>
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

      {/* Search & Filter for Featured Polls */}
      <section className="mb-12 text-left max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Featured Polls</h2>

        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            type="text"
            placeholder="Search polls..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded w-full sm:w-2/3"
          />
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="px-4 py-2 border rounded w-full sm:w-1/3"
          >
            {uniqueTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredPolls.map((poll) => (
            <div key={poll.id} className="bg-white shadow p-4 border rounded relative pt-6">
              <h3 className="font-semibold text-lg mb-2">{poll.question}</h3>

              {/* Badges */}
              <div className="absolute top-2 right-2 flex space-x-1">
                {poll.trending && (
                  <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs">
                    Trending
                  </span>
                )}
                {new Date(poll.createdAt) >= new Date(Date.now() - 1000 * 60 * 60 * 24 * 7) && (
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">
                    New
                  </span>
                )}
              </div>

              {/* Tags */}
              <p className="text-sm text-gray-600 my-2">
                {poll.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded mr-1"
                  >
                    {tag}
                  </span>
                ))}
              </p>

              <p className="text-sm text-gray-600">
                Votes: {Array.isArray(poll.votes) ? poll.votes.length : poll.votes} | Closes: {poll.closeDate}
              </p>

              <Link
                to={`/polls/${poll.id}`}
                className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                
                Vote Now
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="text-gray-500 italic">
        “Change doesn't start with lawmakers—it starts with voices like yours.”
      </section>
    </div>
  );
};

export default Home;