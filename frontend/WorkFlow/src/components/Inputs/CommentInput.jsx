import { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const CommentInput = ({ taskId, setTask, fetchTaskDetails }) => {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const submitComment = async () => {
    if (!comment.trim()) return;

    setLoading(true);

    try {
      // 1️⃣ Add the comment
      await axiosInstance.post(
        API_PATHS.TASKS.ADD_COMMENT(taskId),
        { text: comment }
      );

      // 2️⃣ Immediately fetch updated, fully populated task
      const updated = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(taskId));
      setTask(updated.data);

      // 3️⃣ Clear input
      setComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment..."
        className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:border-indigo-500 outline-none"
      />
      <button
        onClick={submitComment}
        disabled={loading}
        className={`px-4 py-2 rounded-lg text-white ${
          loading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-500"
        }`}
      >
        {loading ? "Sending..." : "Send"}
      </button>
    </div>
  );
};

export default CommentInput;
