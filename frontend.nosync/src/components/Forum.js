// Forum.js
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext"; // adjust path as needed

const Forum = ({ pollId }) => {
  const { isLoggedIn, user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch comments for this poll
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/comments/${pollId}`);
        if (!res.ok) throw new Error("Failed to fetch comments");
        const data = await res.json();
        setComments(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [pollId]);

  // Add new comment
  const handleAddComment = async (parentId = null) => {
    if (!isLoggedIn) {
      alert("You must be logged in to comment.");
      return;
    }
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // token from AuthContext
        },
        body: JSON.stringify({ pollId, content: newComment, parentId }),
      });
      if (!res.ok) throw new Error("Failed to post comment");
      const data = await res.json();

      // Optimistically update UI
      setComments((prev) => [...prev, data]);
      setNewComment("");
    } catch (err) {
      console.error(err);
    }
  };

  // Render comments recursively
  const renderComments = (parentId = null) =>
    comments
      .filter((c) => c.parentId === parentId)
      .map((c) => (
        <div key={c.id} className="ml-4 mt-2 border-l pl-2">
          <p className="text-sm">
            <strong>{c.username || "User"}:</strong> {c.content}
          </p>
          {isLoggedIn && (
            <button
              className="text-xs text-blue-600 mt-1"
              onClick={() => setNewComment(`@${c.username} `)}
            >
              Reply
            </button>
          )}
          {renderComments(c.id)}
        </div>
      ));

  return (
    <div className="mt-6 p-4 border-t">
      <h3 className="text-lg font-semibold mb-2">Discussion</h3>

      {isLoggedIn ? (
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 border px-3 py-2 rounded"
          />
          <button
            onClick={() => handleAddComment(null)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Post
          </button>
        </div>
      ) : (
        <p className="text-gray-500 text-sm">
          Log in to participate in the discussion.
        </p>
      )}

      {loading ? (
        <p className="text-gray-400">Loading comments...</p>
      ) : (
        <div>{renderComments()}</div>
      )}
    </div>
  );
};

export default Forum;