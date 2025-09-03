import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const Forum = ({ pollId }) => {
  const { isLoggedIn, user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null); // track parent_id for replies
  const [replyContent, setReplyContent] = useState(""); // track reply input
  const [loading, setLoading] = useState(true);

  // Fetch comments for this poll
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/comments/poll/${pollId}`
        );
        if (!res.ok) throw new Error("Failed to fetch comments");
        const data = await res.json();
        setComments(data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [pollId]);

  // Add new comment (top-level or reply)
  const handleAddComment = async (content, parent_id = null) => {
    if (!isLoggedIn) {
      alert("You must be logged in to comment.");
      return;
    }
    if (!content.trim()) return;

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/comments/poll/${pollId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            poll_id: pollId,
            user_id: user.id,
            content,
            parent_id,
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to post comment");

      // Refresh comments
      const updated = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/comments/poll/${pollId}`
      ).then((r) => r.json());

      setComments(updated);
      if (parent_id) {
        setReplyingTo(null);
        setReplyContent("");
      } else {
        setNewComment("");
      }
    } catch (err) {
      console.error("Post error:", err);
    }
  };

  // Render nested comments (backend includes replies)
  const renderComments = (list) =>
    list.map((c) => (
      <div key={c.id} className="ml-4 mt-2 border-l pl-2">
        <p className="text-sm">
          <strong>{c.user?.fullName || "User"}:</strong> {c.content}
        </p>

        {isLoggedIn && (
          <>
            <button
              className="text-xs text-blue-600 mt-1"
              onClick={() => setReplyingTo(c.id)}
            >
              Reply
            </button>

            {replyingTo === c.id && (
              <div className="mt-2 ml-4 flex gap-2">
                <input
                  type="text"
                  placeholder="Write a reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="flex-1 border px-2 py-1 rounded text-sm"
                />
                <button
                  onClick={() => handleAddComment(replyContent, c.id)}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                >
                  Post
                </button>
                <button
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyContent("");
                  }}
                  className="px-3 py-1 bg-gray-300 text-sm rounded"
                >
                  Cancel
                </button>
              </div>
            )}
          </>
        )}

        {c.replies && c.replies.length > 0 && (
          <div className="ml-4">{renderComments(c.replies)}</div>
        )}
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
            onClick={() => handleAddComment(newComment, null)}
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
        <div>{renderComments(comments)}</div>
      )}
    </div>
  );
};

export default Forum;