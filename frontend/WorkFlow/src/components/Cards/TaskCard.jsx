import React from "react";
import { FaClock, FaUserAlt, FaPaperclip, FaListUl, FaCalendarAlt } from "react-icons/fa";
import moment from "moment";

const TaskCard = ({
  title,
  description,
  priority,
  status,
  progress,
  createdAt,
  dueDate,
  assignedTo,
  attachmentCount,
  completedTodoCount,
  todoChecklist,
  onClick,
}) => {
  const getStatusTagColor = () => {
    switch (status) {
      case "In Progress":
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
      case "Completed":
        return "bg-green-500/20 text-green-400 border border-green-500/30";
      default:
        return "bg-slate-500/20 text-slate-300 border border-slate-600/40";
    }
  };

  const getPriorityTagColor = () => {
    switch (priority) {
      case "Low":
        return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
      case "Medium":
        return "bg-orange-500/20 text-orange-400 border border-orange-500/30";
      case "High":
        return "bg-red-500/20 text-red-400 border border-red-500/30";
      default:
        return "bg-slate-500/20 text-slate-300 border border-slate-600/40";
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-linear-to-br from-slate-900 via-slate-800 to-indigo-950 border border-slate-700/50 
      rounded-2xl p-5 hover:shadow-xl hover:shadow-indigo-900/30 transition-all duration-300 cursor-pointer 
      text-gray-200 flex flex-col justify-between gap-4 group relative overflow-hidden"
    >
      {/* Glow Accent */}
      <div className="absolute inset-0 bg-linear-to-br from-indigo-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Top Section */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg md:text-xl font-semibold group-hover:text-indigo-400 transition">
            {title}
          </h3>
          <p className="text-sm text-gray-400 line-clamp-2">{description}</p>
        </div>

        <div className="flex flex-col gap-2 text-right">
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusTagColor()}`}
          >
            {status}
          </span>
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityTagColor()}`}
          >
            {priority}
          </span>
        </div>
      </div>

      {/* Progress Section */}
      <div className="w-full mt-2">
        <div className="h-2 bg-slate-700/40 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              status === "Completed"
                ? "bg-green-500"
                : "bg-indigo-500"
            }`}
            style={{ width: `${progress || 0}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Progress: {progress || 0}% ({completedTodoCount || 0}/
          {todoChecklist?.length || 0})
        </p>
      </div>

      {/* Metadata Section */}
      <div className="flex flex-wrap justify-between items-center mt-2 text-sm text-gray-400 gap-y-2">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1">
            <FaCalendarAlt className="text-indigo-400" />
            <span>{moment(createdAt).format("MMM D, YYYY")}</span>
          </div>

          <div className="flex items-center gap-1">
            <FaClock className="text-indigo-400" />
            <span>Due {moment(dueDate).fromNow()}</span>
          </div>

          <div className="flex items-center gap-1">
            <FaPaperclip className="text-indigo-400" />
            <span>{attachmentCount || 0}</span>
          </div>

          <div className="flex items-center gap-1">
            <FaListUl className="text-indigo-400" />
            <span>{todoChecklist?.length || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
