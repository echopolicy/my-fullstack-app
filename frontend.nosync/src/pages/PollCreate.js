import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CATEGORY_OPTIONS = ["Workplace", "Tech", "Politics", "Education", "Health"];
const TAG_OPTIONS = ["New Trends", "Survey", "Feedback", "Fun"];

const PollCreate = () => {
  const { isLoggedIn, user, token: ctxToken } = useAuth();
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState([]);
  const [closeDate, setCloseDate] = useState("");
  const [pollType, setPollType] = useState("single");
  const [visibility, setVisibility] = useState("public");
  const [options, setOptions] = useState(["", ""]);
  const [showToast, setShowToast] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // option handling
  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const addOption = () => {
    if (options.length < 5) setOptions([...options, ""]);
  };

  const removeOption = (index) => {
    if (options.length > 2) setOptions(options.filter((_, i) => i !== index));
  };

  // tag toggle
  const handleTagChange = (e) => {
    const value = e.target.value;
    setTags((prev) =>
      prev.includes(value) ? prev.filter((tag) => tag !== value) : [...prev, value]
    );
  };

  // preview poll
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const newPoll = {
      question,
      category,
      tags,
      closeDate: closeDate || null,
      createdAt: new Date().toISOString(),
      votes: 0,
      trending: false,
      pollType,
      visibilityPublic: visibility === "public",
      options: options.map((text) => ({ text, votes: 0 })),
    };

    setPreview(newPoll);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // save poll live
  const handleMakeLive = async () => {
    if (!preview) return;
    setIsLoading(true);
    setError("");

    try {
      const pollToSubmit = {
        ...preview,
        ...(isLoggedIn && user ? { user_id: user.id || user._id } : {}),
      };

      const token = ctxToken || localStorage.getItem("token");
      const headers = { "Content-Type": "application/json" };
      if (isLoggedIn && token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/polls`, {
        method: "POST",
        headers,
        body: JSON.stringify(pollToSubmit),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to make the poll live.");
      }

      const data = await response.json();
      navigate(`/polls/${data.id || data._id}`);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        ✨ Create a New Poll
      </h2>

      {showToast && (
        <div className="mb-4 p-3 text-green-800 bg-green-100 border border-green-300 rounded-lg text-center animate-bounce">
          ✅ Poll created! Preview below.
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 text-red-800 bg-red-100 border border-red-300 rounded-lg text-center">
          ❌ {error}
        </div>
      )}

      {!preview ? (
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-xl rounded-2xl p-6 space-y-6"
        >
          {/* Question */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Question
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category
            </label>
            <select
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
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
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {TAG_OPTIONS.map((tag) => (
                <label
                  key={tag}
                  className={`px-4 py-2 rounded-full cursor-pointer text-sm font-medium ${
                    tags.includes(tag)
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
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
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Close Date (optional)
            </label>
            <input
              type="date"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
              value={closeDate}
              onChange={(e) => setCloseDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          {/* Poll Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Poll Type
            </label>
            <select
              value={pollType}
              onChange={(e) => setPollType(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
            >
              <option value="single">Single Choice</option>
              <option value="multiple">Multiple Choice</option>
            </select>
          </div>

          {/* Visibility */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Visibility
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="visibility"
                  value="public"
                  checked={visibility === "public"}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="text-orange-500 focus:ring-orange-400"
                />
                <span>🌍 Public</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="visibility"
                  value="private"
                  checked={visibility === "private"}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="text-orange-500 focus:ring-orange-400"
                />
                <span>🔒 Private</span>
              </label>
            </div>
          </div>

          {/* Options */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Options
            </label>
            {options.map((opt, index) => (
              <div key={index} className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
                  required
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                  >
                    ✖
                  </button>
                )}
              </div>
            ))}
            {options.length < 5 && (
              <button
                type="button"
                onClick={addOption}
                className="mt-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition"
              >
                + Add another option
              </button>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg shadow-md hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition font-semibold"
          >
            Preview Poll
          </button>
        </form>
      ) : (
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            {preview.question}
          </h3>
          <div className="space-y-2 text-gray-700 mb-4">
            <p><strong>Category:</strong> {preview.category}</p>
            <p><strong>Tags:</strong> {preview.tags.join(", ") || "None"}</p>
            <p><strong>Type:</strong> {preview.pollType === "single" ? "Single Choice" : "Multiple Choice"}</p>
            <p><strong>Visibility:</strong> {preview.visibilityPublic ? "Public 🌍" : "Private 🔒"}</p>
            {preview.closeDate && (
              <p><strong>Closes on:</strong> {new Date(preview.closeDate).toLocaleDateString()}</p>
            )}
          </div>
          <ul className="list-disc pl-6 text-gray-800 mb-6">
            {preview.options.map((opt, i) => (
              <li key={i}>{opt.text}</li>
            ))}
          </ul>
          <div className="flex gap-4">
            <button
              onClick={handleMakeLive}
              className="flex-1 bg-green-500 text-white py-3 rounded-lg shadow-md hover:bg-green-600 transform hover:scale-105 transition font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "✅ Make It Live"}
            </button>
            <button
              onClick={() => setPreview(null)}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
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