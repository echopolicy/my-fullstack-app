import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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

const PollDetail = () => {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showVoteToast, setShowVoteToast] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);

  useEffect(() => {
    const voted = localStorage.getItem(`voted-${id}`) === 'true';
    setHasVoted(voted);

    const fetchPoll = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/polls/${id}`);
        if (!response.ok) {
          throw new Error('Poll not found');
        }
        const data = await response.json();
        setPoll(data);
      } catch (err) {
        console.error('Error fetching poll:', err);
        // Optionally set an error state here to show in the UI
      }
    };

    fetchPoll();
  }, [id]);

  const handleOptionChange = (index) => {
    if (poll.pollType === 'multiple') {
      setSelectedOptions((prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index)
          : [...prev, index]
      );
    } else {
      setSelectedOptions([index]);
    }
  };

  const handleVote = async () => {
    if (selectedOptions.length === 0 || hasVoted) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/polls/${id}/vote`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionIndexes: selectedOptions }),
      });

      if (response.ok) {
        const updatedPoll = await response.json();
        setPoll(updatedPoll);
        setHasVoted(true);
        localStorage.setItem(`voted-${id}`, 'true');
        setShowVoteToast(true);
        setTimeout(() => setShowVoteToast(false), 3000);
      } else {
        const errorMsg = await response.text();
        console.error('Vote failed:', errorMsg);
        // Consider showing a user-friendly error message instead of an alert
      }
    } catch (err) {
      console.error('Error submitting vote:', err);
    }
  };
  
  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      setShowCopyToast(true);
      setTimeout(() => setShowCopyToast(false), 2500);
    }).catch(err => {
      console.error('Failed to copy link: ', err);
    });
  };

  if (!poll) {
    return <div className="p-6 text-center">Loading poll...</div>;
  }

  // Define share variables here so they are always available
  const shareUrl = window.location.href;
  const pollQuestion = poll.question;

  const votesArray = Array.isArray(poll.votes)
    ? poll.votes
    : Array(poll.options.length).fill(0);
  const totalVotes = votesArray.reduce((a, b) => a + b, 0);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{poll.question}</h2>
      <p className="text-sm text-gray-500 mb-6">Category: {poll.category}</p>

      {/* Voting Section or Results Section */}
      {!hasVoted ? (
        <div className="mb-6">
          <div className="space-y-2 mb-4">
            {poll.options.map((option, index) => (
              <label key={index} className="block p-3 border rounded hover:bg-gray-50 cursor-pointer">
                <input
                  type={poll.pollType === 'multiple' ? 'checkbox' : 'radio'}
                  name="pollOption"
                  value={index}
                  checked={selectedOptions.includes(index)}
                  onChange={() => handleOptionChange(index)}
                  className="mr-3"
                />
                {option.text}
              </label>
            ))}
          </div>
          <button
            onClick={handleVote}
            disabled={selectedOptions.length === 0}
            className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50 w-full"
          >
            Submit Vote
          </button>
        </div>
      ) : (
        <div className="space-y-4 mb-8">
          <h3 className="font-semibold text-lg">Results</h3>
          {poll.options.map((option, index) => {
            const voteCount = votesArray[index] || 0;
            const percent = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
            return (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{option.text}</span>
                  <span>{voteCount} votes ({percent}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-blue-500 h-4 rounded-full text-xs text-white flex items-center justify-center"
                    style={{ width: `${percent}%` }}
                  >
                   {percent > 10 ? `${percent}%` : ''}
                  </div>
                </div>
              </div>
            );
          })}
           <p className="text-right text-sm text-gray-600 font-bold mt-4">Total Votes: {totalVotes}</p>
        </div>
      )}

      {/* Share Section - Always visible */}
      <div className="mt-8 pt-4 border-t">
        <h3 className="text-center font-semibold mb-3">Share this Poll</h3>
        <div className="flex items-center justify-center flex-wrap gap-3">
          <TwitterShareButton url={shareUrl} title={pollQuestion}>
            <TwitterIcon size={40} round />
          </TwitterShareButton>
          <FacebookShareButton url={shareUrl} quote={pollQuestion}>
            <FacebookIcon size={40} round />
          </FacebookShareButton>
          <LinkedinShareButton url={shareUrl} title={pollQuestion}>
            <LinkedinIcon size={40} round />
          </LinkedinShareButton>
          <WhatsappShareButton url={shareUrl} title={pollQuestion}>
            <WhatsappIcon size={40} round />
          </WhatsappShareButton>
          <EmailShareButton url={shareUrl} subject={pollQuestion} body="Check out this poll:">
            <EmailIcon size={40} round />
          </EmailShareButton>
          <button 
            onClick={() => handleCopyLink(shareUrl)} 
            title="Copy link" 
            className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </button>
        </div>
      </div>

      {/* Toast Notifications */}
      {showVoteToast && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-5 py-2 rounded-lg shadow-lg">
          Your vote has been submitted!
        </div>
      )}
      {showCopyToast && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-5 py-2 rounded-lg shadow-lg">
          Link copied to clipboard!
        </div>
      )}
    </div>
  );
};

export default PollDetail;