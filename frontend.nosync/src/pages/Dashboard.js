import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
  EmailIcon,
} from 'react-share';

// Define categories outside the component so it doesn't get recreated on every render
const CATEGORY_OPTIONS = ['All', 'Workplace', 'Tech', 'Politics', 'Education', 'Health'];

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // Search input state
  const [selectedCategory, setSelectedCategory] = useState('All'); // Category filter state
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      const fetchUserPolls = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/polls?user_id=${parsedUser.id}`);
          if (!response.ok) throw new Error('Failed to fetch your polls');
          const data = await response.json();
          setPolls(data);
        } catch (err) {
          console.error(err);
          setError('Failed to load your polls.');
        } finally {
          setLoading(false);
        }
      };

      fetchUserPolls();
    } else {
      setLoading(false);
    }
  }, []);

  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      setShowCopyToast(true);
      setTimeout(() => setShowCopyToast(false), 2500);
    }).catch(err => console.error('Failed to copy link:', err));
  };

  // Filter polls based on search and category
  const filteredPolls = polls.filter(poll => {
    const matchesCategory = selectedCategory === 'All' || poll.category === selectedCategory;
    const matchesSearch = poll.question.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (!user) return <p className="text-center p-10">Loading dashboard...</p>;
  if (loading) return <div className="text-center p-10">Loading your polls...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.fullName}</h1>

    {/* Create Poll button */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/admin/create")}
          className="px-4 py-2 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#3B82F6]"
        >
          Create Poll
        </button>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search your polls..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-md w-full sm:flex-grow"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border rounded-md w-full sm:w-auto"
        >
          {CATEGORY_OPTIONS.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>


      {error && <p className="text-red-500 mb-4">{error}</p>}

      {filteredPolls.length === 0 ? (
        <p className="text-gray-600 text-center">No polls match your criteria.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPolls.map(poll => {
            const shareUrl = `https://echopolicy.com/polls/${poll.id || poll._id}`;
            const pollQuestion = poll.question;
            const totalVotes = Array.isArray(poll.votes) 
              ? poll.votes.reduce((sum, current) => sum + current, 0) 
              : 0;

            return (
              <div key={poll.id || poll._id} className="bg-white shadow border rounded p-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{poll.question}</h3>
                  {poll.tags && poll.tags.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-1">
                      {poll.tags.map(tag => (
                        <span key={tag} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-gray-600">Total Votes: {totalVotes}</p>
                  {poll.closeDate && (
                    <p className="text-sm text-gray-500">Closes: {new Date(poll.closeDate).toLocaleDateString()}</p>
                  )}
                </div>

                <div className="mt-4">
                  <button
                    onClick={() => navigate(`/polls/${poll.id || poll._id}`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition self-start w-full text-center"
                  >
                    View / Vote
                  </button>
                  <button
                      onClick={() => navigate(`/admin/edit/${poll.id || poll._id}`)}
                      disabled={poll.votes.reduce((a, b) => a + b, 0) > 0}
                      className={`px-4 py-2 rounded w-full text-center transition ${
                        poll.votes.reduce((a, b) => a + b, 0) === 0
                          ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Edit Poll
                  </button>


                  <div className="flex items-center flex-wrap gap-3 mt-4 pt-3 border-t">
                    <span className="text-sm font-medium text-gray-600">Share:</span>
                    <TwitterShareButton url={shareUrl} title={pollQuestion}><TwitterIcon size={32} round /></TwitterShareButton>
                    <FacebookShareButton url={shareUrl} quote={pollQuestion}><FacebookIcon size={32} round /></FacebookShareButton>
                    <LinkedinShareButton url={shareUrl} title={pollQuestion}><LinkedinIcon size={32} round /></LinkedinShareButton>
                    <WhatsappShareButton url={shareUrl} title={pollQuestion}><WhatsappIcon size={32} round /></WhatsappShareButton>
                    <EmailShareButton url={shareUrl} subject={pollQuestion} body="Check out this poll:"><EmailIcon size={32} round /></EmailShareButton>
                    <button onClick={() => handleCopyLink(shareUrl)} title="Copy link" className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showCopyToast && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-5 py-2 rounded-lg shadow-lg z-50">
          Link copied to clipboard!
        </div>
      )}
    </div>
  );
};

export default Dashboard;