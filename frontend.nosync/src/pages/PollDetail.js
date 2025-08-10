import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const PollDetail = () => {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const voted = localStorage.getItem(`voted-${id}`) === 'true';
    setHasVoted(voted);

    const fetchPoll = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/polls/${id}`);
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
      const response = await fetch(`http://localhost:5001/api/polls/${id}/vote`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ optionIndexes: selectedOptions }),
      });

      if (response.ok) {
        const updatedPoll = await response.json();
        setPoll(updatedPoll);
        setHasVoted(true);
        localStorage.setItem(`voted-${id}`, 'true');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } else {
        const errorMsg = await response.text();
        console.error('Vote failed:', errorMsg);
        alert('Something went wrong while submitting your vote. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting vote:', err);
    }
  };

  if (!poll) {
    return <div className="p-6">Loading...</div>;
  }

  const votesArray = Array.isArray(poll.votes)
    ? poll.votes
    : Array(poll.options.length).fill(0);
  const totalVotes = votesArray.reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{poll.question}</h2>

      {!hasVoted ? (
        <>
          <div className="space-y-2 mb-4">
            {poll.options.map((option, index) => (
              <label key={index} className="block">
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
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Submit Vote
          </button>
        </>
      ) : (
        <div className="space-y-4">
          {poll.options.map((option, index) => {
            const voteCount = votesArray[index] || 0;
            const percent = Math.round((voteCount / totalVotes) * 100);
            return (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{option.text}</span>
                  <span>{voteCount} votes • {percent}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-500 h-3 rounded-full"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showToast && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow">
          Your vote has been submitted!
        </div>
      )}
    </div>
  );
};

export default PollDetail;