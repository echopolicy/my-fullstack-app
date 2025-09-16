import { useEffect, useState, useRef } from 'react';
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

const CATEGORY_OPTIONS = ['All', 'Workplace', 'Tech', 'Politics', 'Education', 'Health'];

const PollFeed = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [showReportToast, setShowReportToast] = useState(false);
  const [activePollInfo, setActivePollInfo] = useState(null);
  const [fadeOutPollId, setFadeOutPollId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const infoBoxRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/polls`);
        if (!response.ok) throw new Error('Network response was not ok');
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

  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(url)
      .then(() => {
        setShowCopyToast(true);
        setTimeout(() => setShowCopyToast(false), 2500);
      })
      .catch(err => console.error('Failed to copy link: ', err));
  };

  const handleReportPoll = async (pollId) => {
    try {
      await fetch(`${process.env.REACT_APP_API_BASE_URL}/polls/${pollId}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Inappropriate content' }),
      });
      setShowReportToast(true);
      setTimeout(() => setShowReportToast(false), 2500);
      setPolls(prev => prev.map(p => p.id === pollId ? { ...p, reported: true } : p));
      setActivePollInfo(null);
    } catch (err) {
      console.error('Failed to report poll: ', err);
    }
  };

  // Toggle info box with fade-out animation
  const toggleInfoBox = (pollId) => {
    if (activePollInfo === pollId) {
      setFadeOutPollId(pollId);
      setTimeout(() => {
        setActivePollInfo(null);
        setFadeOutPollId(null);
      }, 300); // match transition duration
    } else {
      setActivePollInfo(pollId);
    }
  };

  // Close info box when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (infoBoxRef.current && !infoBoxRef.current.contains(event.target)) {
        if (activePollInfo) {
          setFadeOutPollId(activePollInfo);
          setTimeout(() => {
            setActivePollInfo(null);
            setFadeOutPollId(null);
          }, 300);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activePollInfo]);

  const filteredPolls = polls.filter(poll => {
    const matchesCategory = selectedCategory === 'All' || poll.category === selectedCategory;
    const matchesSearch = poll.question.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) return <div className="text-center p-10">Loading polls...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">All Active Polls</h2>

      {/* Filter & Search */}
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
          {CATEGORY_OPTIONS.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

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
              <div key={poll.id || poll._id} className="relative bg-white shadow border rounded p-4 flex flex-col justify-between">

                {/* Info Icon */}
                <button
                  onClick={() => toggleInfoBox(poll.id)}
                  className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition"
                  title="More info / Report"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 6.5a6.5 6.5 0 11-6.5 6.5 6.507 6.507 0 016.5-6.5z" />
                  </svg>
                </button>

                <div>
                  <h3 className="text-lg font-semibold mb-2">{poll.question}</h3>
                  {poll.tags?.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-1">
                      {poll.tags.map(tag => (
                        <span key={tag} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">{tag}</span>
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-gray-600">Total Votes: {totalVotes}</p>
                  {poll.closeDate && <p className="text-sm text-gray-500">Closes: {new Date(poll.closeDate).toLocaleDateString()}</p>}
                </div>

                {/* Actions */}
                <div className="mt-4 flex flex-col gap-3">
                  <button
                    onClick={() => navigate(`/polls/${poll.id || poll._id}`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition w-full text-center"
                  >
                    Vote Now
                  </button>

                  <div className="flex items-center flex-wrap gap-2 mt-2 pt-2 border-t">
                    <span className="text-sm font-medium text-gray-600">Share:</span>
                    <TwitterShareButton url={shareUrl} title={pollQuestion}><TwitterIcon size={32} round /></TwitterShareButton>
                    <FacebookShareButton url={shareUrl} quote={pollQuestion}><FacebookIcon size={32} round /></FacebookShareButton>
                    <LinkedinShareButton url={shareUrl} title={pollQuestion}><LinkedinIcon size={32} round /></LinkedinShareButton>
                    <WhatsappShareButton url={shareUrl} title={pollQuestion}><WhatsappIcon size={32} round /></WhatsappShareButton>
                    <EmailShareButton url={shareUrl} subject={pollQuestion}><EmailIcon size={32} round /></EmailShareButton>
                    <button onClick={() => handleCopyLink(shareUrl)} title="Copy link" className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Info / Report Box with fade */}
                {activePollInfo === poll.id && (
                  <div
                    ref={infoBoxRef}
                    className={`absolute top-8 right-2 bg-white border shadow-lg rounded p-3 w-48 z-10
                               transition-opacity duration-300 ease-in-out
                               ${fadeOutPollId === poll.id ? 'opacity-0' : 'opacity-100'}`}
                  >
                    <p className="text-sm text-gray-700 mb-2">
                      This poll can be reported if it is inappropriate.
                    </p>
                    <button
                      onClick={() => handleReportPoll(poll.id || poll._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition w-full text-center"
                    >
                      Report Poll
                    </button>
                  </div>
                )}
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

      {showReportToast && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white px-5 py-2 rounded-lg shadow-lg z-50">
          Poll reported successfully!
        </div>
      )}
    </div>
  );
};

export default PollFeed;