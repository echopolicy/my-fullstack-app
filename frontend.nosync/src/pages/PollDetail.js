import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Forum from "../components/Forum";
import PollShare from "../components/PollShare";

const PollDetail = () => {
  const { id } = useParams();
  const location = useLocation();

  // detect embed mode if URL has ?embed=1 or ?embed=true
  const searchParams = new URLSearchParams(location.search);
  const embedMode = searchParams.get('embed') === '1' || searchParams.get('embed') === 'true';

  const [poll, setPoll] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showVoteToast, setShowVoteToast] = useState(false);

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
      }
    };

    fetchPoll();
  }, [id]);

  const handleOptionChange = (index) => {
    if (poll.pollType === 'multiple') {
      setSelectedOptions((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
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
      }
    } catch (err) {
      console.error('Error submitting vote:', err);
    }
  };

  if (!poll) {
    return <div className="p-6 text-center">Loading poll...</div>;
  }

  const shareUrl = window.location.href; // will include ?embed=1 when inside iframe
  const pollQuestion = poll.question;

  const votesArray = Array.isArray(poll.votes) ? poll.votes : Array(poll.options.length).fill(0);
  const totalVotes = votesArray.reduce((a, b) => a + b, 0);

  // Minimal container for embed mode (less padding and no extra UI)
  if (embedMode) {
    return (
      <div className="p-4 max-w-full mx-auto" style={{ fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial' }}>
        <h2 className="text-lg font-semibold mb-3">{poll.question}</h2>

        {!hasVoted ? (
          <div className="mb-4">
            <div className="space-y-2 mb-4">
              {poll.options.map((option, index) => (
                <label key={index} className="block p-2 border rounded hover:bg-gray-50 cursor-pointer">
                  <input
                    type={poll.pollType === 'multiple' ? 'checkbox' : 'radio'}
                    name="pollOption"
                    value={index}
                    checked={selectedOptions.includes(index)}
                    onChange={() => handleOptionChange(index)}
                    className="mr-2"
                  />
                  {option.text}
                </label>
              ))}
            </div>
            <button
              onClick={handleVote}
              disabled={selectedOptions.length === 0}
              className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 w-full"
            >
              Submit Vote
            </button>
          </div>
        ) : (
          <div className="space-y-3">
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
          </div>
        )}

        {/* In embedded mode we show a compact share row (optional). Use variant="compact" */}
        <div className="mt-4">
          <PollShare shareUrl={shareUrl} pollQuestion={pollQuestion} pollId={poll.id || poll._id} variant="default" />
        </div>

        {/* Small vote confirmation (only inside embed) */}
        {showVoteToast && (
          <div className="fixed bottom-3 right-3 bg-green-600 text-white px-3 py-1 rounded text-sm">
            Your vote has been submitted!
          </div>
        )}
      </div>
    );
  }

  // Normal (non-embed) full page rendering
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{poll.question}</h2>
      <p className="text-sm text-gray-500 mb-6">Category: {poll.category}</p>

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

      {/* Full-page share */}
      <PollShare shareUrl={shareUrl} pollQuestion={pollQuestion} pollId={poll.id || poll._id} variant="full" />

      {/* Forum */}
      <Forum pollId={poll.id || poll._id} />

      {showVoteToast && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-5 py-2 rounded-lg shadow-lg">
          Your vote has been submitted!
        </div>
      )}
    </div>
  );
};

export default PollDetail;