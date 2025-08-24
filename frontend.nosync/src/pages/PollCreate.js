import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CATEGORY_OPTIONS = ['Workplace', 'Tech', 'Politics', 'Education', 'Health'];
const TAG_OPTIONS = ['New Trends', 'Survey', 'Feedback', 'Fun'];

const PollCreate = () => {
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState([]);
  const [closeDate, setCloseDate] = useState('');
  const [pollType, setPollType] = useState('single');
  const [visibility, setVisibility] = useState('public'); // State remains 'public' or 'private' for the radio buttons
  const [options, setOptions] = useState(['', '']);
  const [showToast, setShowToast] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleTagChange = (e) => {
    const value = e.target.value;
    setTags((prevTags) =>
      prevTags.includes(value)
        ? prevTags.filter((tag) => tag !== value)
        : [...prevTags, value]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    //Fixed Bug to include visibility
    const newPoll = {
      question,
      category,
      tags,
      closeDate: closeDate || null,
      createdAt: new Date().toISOString(),
      votes: 0,
      trending: false,
      pollType,
      visibilityPublic: visibility === 'public', // Sends true for 'public', false for 'private'
      options: options.map((text) => ({ text, votes: 0 })),
    };

    setPreview(newPoll);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleMakeLive = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/polls`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preview),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to make the poll live.');
      }

      const data = await response.json();
      console.log('Poll created:', data);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4 mb-10">
      <h2 className="text-2xl font-bold mb-6">Create a New Poll</h2>

      {showToast && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded shadow-lg z-50">
          ✅ Poll created! Preview below.
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          ❌ {error}
        </div>
      )}

      {!preview ? (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow p-6 rounded">
          {/* Question Input */}
          <div>
            <label className="block mb-1 font-medium">Question</label>
            <input
              type="text"
              className="w-full border px-4 py-2 rounded"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
          </div>

          {/* Category Select */}
          <div>
            <label className="block mb-1 font-medium">Category</label>
            <select
              className="w-full border px-4 py-2 rounded"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Tags Checkboxes */}
          <div>
            <label className="block mb-1 font-medium">Tags</label>
            <div className="flex flex-wrap gap-2">
              {TAG_OPTIONS.map((tag) => (
                <label
                  key={tag}
                  className={`border rounded-full px-3 py-1 text-sm cursor-pointer ${
                    tags.includes(tag)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    value={tag}
                    onChange={handleTagChange}
                    checked={tags.includes(tag)}
                    className="hidden"
                  />
                  {tag}
                </label>
              ))}
            </div>
          </div>

          {/* Close Date */}
          <div>
            <label className="block mb-1 font-medium">Close Date (optional)</label>
            <input
              type="date"
              className="w-full border px-4 py-2 rounded"
              value={closeDate}
              onChange={(e) => setCloseDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          {/* Poll Type */}
          <div>
            <label className="block mb-1 font-medium">Poll Type</label>
            <select
              value={pollType}
              onChange={(e) => setPollType(e.target.value)}
              className="w-full border px-4 py-2 rounded"
            >
              <option value="single">Single Choice (Radio)</option>
              <option value="multiple">Multiple Choice (Checkbox)</option>
            </select>
          </div>
          
          {/* Visibility Section */}
          <div>
            <label className="block mb-2 font-medium">Visibility</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="visibility"
                  value="public"
                  checked={visibility === 'public'}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="mr-2"
                />
                Public (Visible to everyone)
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="visibility"
                  value="private"
                  checked={visibility === 'private'}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="mr-2"
                />
                Private (Only via direct link)
              </label>
            </div>
          </div>

          {/* Options */}
          <div>
            <label className="block mb-1 font-medium">Options</label>
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="flex-1 border px-4 py-2 rounded"
                  required
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addOption}
              className="text-blue-600 hover:underline text-sm mt-1"
            >
              + Add another option
            </button>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition w-full sm:w-auto"
          >
            Preview Poll
          </button>
        </form>
      ) : (
        <div className="bg-white shadow p-6 rounded mt-6">
          <h3 className="text-xl font-bold mb-4">{preview.question}</h3>
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <p><strong>Category:</strong> {preview.category}</p>
            <p><strong>Tags:</strong> {preview.tags.join(', ') || 'None'}</p>
            <p><strong>Type:</strong> {preview.pollType === 'single' ? 'Single Choice' : 'Multiple Choice'}</p>
            {/* CORRECTED: This now reads the correct boolean field for the preview */}
            <p><strong>Visibility:</strong> {preview.visibilityPublic ? 'Public' : 'Private'}</p>
            {preview.closeDate && (
              <p><strong>Closes on:</strong> {new Date(preview.closeDate).toLocaleDateString()}</p>
            )}
          </div>
          <ul className="list-disc list-inside mb-6 space-y-1">
            {preview.options.map((opt, i) => (
              <li key={i}>{opt.text}</li>
            ))}
          </ul>
          
          <div className="flex gap-4">
            <button
              onClick={handleMakeLive}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : '✅ Make It Live'}
            </button>
            <button
              onClick={() => setPreview(null)}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed"
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