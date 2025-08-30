import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../App.css';

const CATEGORY_OPTIONS = ['Workplace', 'Tech', 'Politics', 'Education', 'Health'];
const TAG_OPTIONS = ['New Trends', 'Survey', 'Feedback', 'Fun'];

const PollEdit = () => {
  const { id } = useParams(); // poll ID
  const navigate = useNavigate();
  const [pollData, setPollData] = useState(null);
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState([]);
  const [closeDate, setCloseDate] = useState('');
  const [pollType, setPollType] = useState('single');
  const [visibility, setVisibility] = useState('public');
  const [options, setOptions] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/polls/${id}`);
        if (!response.ok) throw new Error('Failed to fetch poll');
        const data = await response.json();

        // prevent editing if votes exist
        const totalVotes = data.votes.reduce((sum, v) => sum + v, 0);
        if (totalVotes > 0) {
          alert('Cannot edit poll after votes have been cast.');
          navigate('/dashboard');
          return;
        }

        setPollData(data);
        setQuestion(data.question);
        setCategory(data.category);
        setTags(data.tags || []);
        setCloseDate(data.closeDate ? data.closeDate.split('T')[0] : '');
        setPollType(data.pollType);
        setVisibility(data.visibilityPublic ? 'public' : 'private');
        setOptions(data.options.map(opt => opt.text || opt));
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchPoll();
  }, [id, navigate]);

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const addOption = () => options.length < 5 && setOptions([...options, '']);
  const removeOption = (index) => options.length > 2 && setOptions(options.filter((_, i) => i !== index));
  const handleTagChange = (e) => {
    const value = e.target.value;
    setTags(prev => prev.includes(value) ? prev.filter(tag => tag !== value) : [...prev, value]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const updatedPoll = {
        question,
        category,
        tags,
        closeDate: closeDate || null,
        pollType,
        visibilityPublic: visibility === 'public',
        options: options.map(text => ({ text, votes: 0 }))
      };

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/polls/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPoll)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to update poll');
      }

      navigate(`/polls/${id}`);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (error) return <div className="text-center p-6 text-red-500">{error}</div>;
  if (!pollData) return <div className="text-center p-6">Loading poll...</div>;

  return (
    <div className="poll-container">
      <h2 className="poll-header">Edit Poll</h2>
      <form onSubmit={handleSubmit} className="poll-form">
        {/* Question */}
        <div>
          <label className="form-label">Question</label>
          <input
            type="text"
            className="form-input"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="form-label">Category</label>
          <select
            className="form-input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            {CATEGORY_OPTIONS.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="form-label">Tags</label>
          <div className="tag-group">
            {TAG_OPTIONS.map(tag => (
              <label key={tag} className={`tag-label ${tags.includes(tag) ? 'tag-label-active' : 'tag-label-inactive'}`}>
                <input
                  type="checkbox"
                  value={tag}
                  checked={tags.includes(tag)}
                  onChange={handleTagChange}
                  className="tag-checkbox-hidden"
                />
                {tag}
              </label>
            ))}
          </div>
        </div>

        {/* Close Date */}
        <div>
          <label className="form-label">Close Date (optional)</label>
          <input
            type="date"
            className="form-input"
            value={closeDate}
            onChange={(e) => setCloseDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
          />
        </div>

        {/* Poll Type */}
        <div>
          <label className="form-label">Poll Type</label>
          <select value={pollType} onChange={(e) => setPollType(e.target.value)} className="form-input">
            <option value="single">Single Choice</option>
            <option value="multiple">Multiple Choice</option>
          </select>
        </div>

        {/* Visibility */}
        <div>
          <label className="form-label mb-2">Visibility</label>
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="visibility"
                value="public"
                checked={visibility === 'public'}
                onChange={(e) => setVisibility(e.target.value)}
                className="mr-2"
              />
              Public
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="visibility"
                value="private"
                checked={visibility === 'private'}
                onChange={(e) => setVisibility(e.target.value)}
                className="mr-2"
              />
              Private
            </label>
          </div>
        </div>

        {/* Options */}
        <div>
          <label className="form-label">Options</label>
          {options.map((opt, index) => (
            <div key={index} className="option-group">
              <input
                type="text"
                value={opt}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="option-input"
                required
              />
              {options.length > 2 && (
                <button type="button" onClick={() => removeOption(index)} className="btn-remove">Remove</button>
              )}
            </div>
          ))}
          {options.length < 5 && (
            <button type="button" onClick={addOption} className="btn-add-option">+ Add another option</button>
          )}
        </div>

        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? 'Updating...' : '✅ Update Poll'}
        </button>
      </form>
    </div>
  );
};

export default PollEdit;