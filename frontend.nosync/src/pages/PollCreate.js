import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const CATEGORY_OPTIONS = ['Workplace', 'Tech', 'Politics', 'Education', 'Health'];
const TAG_OPTIONS = ['New Trends', 'Survey', 'Feedback', 'Fun'];

const PollCreate = () => {
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState([]);
  const [closeDate, setCloseDate] = useState('');
  const [pollType, setPollType] = useState('single');
  const [visibility, setVisibility] = useState('public');
  const [options, setOptions] = useState(['', '']);
  const [showToast, setShowToast] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // handle option edits
  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const addOption = () => {
    if (options.length < 5) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  // toggle tags
  const handleTagChange = (e) => {
    const value = e.target.value;
    setTags((prev) =>
      prev.includes(value)
        ? prev.filter((tag) => tag !== value)
        : [...prev, value]
    );
  };

  // preview before making poll live
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const newPoll = {
      question,
      category,
      tags,
      closeDate: closeDate || null,
      createdAt: new Date().toISOString(),
      votes: 0,
      trending: false,
      pollType,
      visibilityPublic: visibility === 'public',
      options: options.map((text) => ({ text, votes: 0 })),
    };

    setPreview(newPoll);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // actually save poll
  const handleMakeLive = async () => {
    if (!preview) return;
    setIsLoading(true);
    setError('');

    try {
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;

      // send userId if logged in
      const pollToSubmit = {
        ...preview,
        user_id: user ? user.id : null,
      };

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/polls`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pollToSubmit),
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to make the poll live.');
      }

      const data = await response.json();
      console.log('Poll created:', data);

      navigate(`/polls/${data.id}`);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="poll-container">
      <h2 className="poll-header">Create a New Poll</h2>

      {showToast && (
        <div className="toast-notification">✅ Poll created! Preview below.</div>
      )}

      {error && <div className="error-box">❌ {error}</div>}

      {!preview ? (
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
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="form-label">Tags</label>
            <div className="tag-group">
              {TAG_OPTIONS.map((tag) => (
                <label
                  key={tag}
                  className={`tag-label ${
                    tags.includes(tag)
                      ? 'tag-label-active'
                      : 'tag-label-inactive'
                  }`}
                >
                  <input
                    type="checkbox"
                    value={tag}
                    onChange={handleTagChange}
                    checked={tags.includes(tag)}
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
            <select
              value={pollType}
              onChange={(e) => setPollType(e.target.value)}
              className="form-input"
            >
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
                <span>Public</span>
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
                <span>Private</span>
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
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="btn-remove"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            {options.length < 5 && (
              <button
                type="button"
                onClick={addOption}
                className="btn-add-option"
              >
                + Add another option
              </button>
            )}
          </div>

          <button type="submit" className="btn-primary">
            Preview Poll
          </button>
        </form>
      ) : (
        <div className="preview-container">
          <h3 className="preview-title">{preview.question}</h3>
          <div className="preview-details">
            <p>
              <strong>Category:</strong> {preview.category}
            </p>
            <p>
              <strong>Tags:</strong> {preview.tags.join(', ') || 'None'}
            </p>
            <p>
              <strong>Type:</strong>{' '}
              {preview.pollType === 'single' ? 'Single Choice' : 'Multiple Choice'}
            </p>
            <p>
              <strong>Visibility:</strong>{' '}
              {preview.visibilityPublic ? 'Public' : 'Private'}
            </p>
            {preview.closeDate && (
              <p>
                <strong>Closes on:</strong>{' '}
                {new Date(preview.closeDate).toLocaleDateString()}
              </p>
            )}
          </div>
          <ul className="preview-list">
            {preview.options.map((opt, i) => (
              <li key={i}>{opt.text}</li>
            ))}
          </ul>

          <div className="preview-btn-group">
            <button
              onClick={handleMakeLive}
              className="btn-success"
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : '✅ Make It Live'}
            </button>
            <button
              onClick={() => setPreview(null)}
              className="btn-secondary"
              disabled={isLoading}
            >
              ✏️ Edit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PollCreate;