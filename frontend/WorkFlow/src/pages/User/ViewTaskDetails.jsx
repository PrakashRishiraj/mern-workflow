import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import moment from "moment";
import { LuSquareArrowOutUpRight } from "react-icons/lu";
import { FaCheckCircle, FaClock, FaHourglass } from "react-icons/fa";

const ViewTaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);

  const getStatusTagColor = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-linear-to-r from-blue-600/30 to-blue-500/20 text-blue-300 border border-blue-500/40";
      case "Completed":
        return "bg-linear-to-r from-emerald-600/30 to-emerald-500/20 text-emerald-300 border border-emerald-500/40";
      case "Pending":
        return "bg-linear-to-r from-amber-600/30 to-amber-500/20 text-amber-300 border border-amber-500/40";
      default:
        return "bg-linear-to-r from-slate-600/30 to-slate-500/20 text-slate-300 border border-slate-500/40";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "In Progress":
        return <FaClock className="w-4 h-4" />;
      case "Completed":
        return <FaCheckCircle className="w-4 h-4" />;
      case "Pending":
        return <FaHourglass className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getPriorityStyles = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return {
          bg: "bg-linear-to-r from-red-600/20 to-red-500/10",
          border: "border-red-500/40",
          text: "text-red-300",
          dot: "bg-red-500",
        };
      case "medium":
        return {
          bg: "bg-linear-to-r from-orange-600/20 to-orange-500/10",
          border: "border-orange-500/40",
          text: "text-orange-300",
          dot: "bg-orange-500",
        };
      case "low":
        return {
          bg: "bg-linear-to-r from-green-600/20 to-green-500/10",
          border: "border-green-500/40",
          text: "text-green-300",
          dot: "bg-green-500",
        };
      default:
        return {
          bg: "bg-linear-to-r from-slate-600/20 to-slate-500/10",
          border: "border-slate-500/40",
          text: "text-slate-300",
          dot: "bg-slate-500",
        };
    }
  };

  const getTaskDetailsById = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(id));
      if (response.data) {
        setTask(response.data);
      }
    } catch (error) {
      console.error("Error fetching task: ", error);
    }
  };

  const updateTodoChecklist = async (index) => {
    const todoChecklist = [...task?.todoChecklist];
    const taskId = id;

    if (todoChecklist && todoChecklist[index]) {
      todoChecklist[index].completed = !todoChecklist[index].completed;

      try {
        const response = await axiosInstance.put(
          API_PATHS.TASKS.UPDATE_TODO_CHECKLIST(taskId),
          { todoChecklist }
        );
        if (response.status === 200) {
          setTask(response.data?.task || task);
        } else {
          todoChecklist[index].completed = !todoChecklist[index].completed;
        }
      } catch (error) {
        todoChecklist[index].completed = !todoChecklist[index].completed;
      }
    }
  };

  const handleLinkClick = (link) => {
    if (!/^https?:\/\//i.test(link)) {
      link = "https://" + link;
    }
    window.open(link, "_blank");
  };

  useEffect(() => {
    if (id) getTaskDetailsById();
  }, [id]);

  return (
    <DashboardLayout activeMenu="My Tasks">
      <div className="p-6 md:p-10 bg-linear-to-b from-slate-900 via-slate-800 to-indigo-950 min-h-screen text-slate-100">
        {task && (
          <div className="max-w-4xl mx-auto bg-linear-to-br from-slate-800 via-slate-800 to-indigo-950 rounded-2xl shadow-lg border border-indigo-500/20 backdrop-blur-md p-6 space-y-6">
            {/* Title + Status */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2 className="text-2xl md:text-3xl font-semibold bg-linear-to-r from-indigo-400 to-violet-500 bg-clip-text text-transparent">
                {task?.title}
              </h2>

              <div className={`inline-flex items-center gap-2.5 text-xs uppercase tracking-wide px-4 py-2.5 rounded-full font-semibold shadow-lg ${getStatusTagColor(
                task?.status
              )}`}>
                {getStatusIcon(task?.status)}
                {task?.status}
              </div>
            </div>

            {/* Description */}
            <div className="bg-linear-to-br from-slate-900/80 to-indigo-900/20 p-6 rounded-xl border border-indigo-500/15 hover:border-indigo-500/30 transition-all">
              <InfoBox label="Description" value={task?.description} />
            </div>

            {/* Priority + Due Date + Assigned */}
            <div className="grid md:grid-cols-3 gap-4">
              {/* Priority */}
              <div className={`p-6 rounded-xl border transition-all hover:border-opacity-100 ${getPriorityStyles(task?.priority).bg} ${getPriorityStyles(task?.priority).border}`}>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-3">
                  Priority
                </label>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getPriorityStyles(task?.priority).dot} shadow-lg`}></div>
                  <p className={`text-lg font-bold ${getPriorityStyles(task?.priority).text}`}>
                    {task?.priority}
                  </p>
                </div>
              </div>

              {/* Due Date */}
              <div className="bg-linear-to-br from-slate-900/80 to-indigo-900/20 p-6 rounded-xl border border-indigo-500/15 hover:border-indigo-500/30 transition-all">
                <InfoBox
                  label="Due Date"
                  value={
                    task?.dueDate
                      ? moment(task?.dueDate).format("Do MMM YYYY")
                      : "N/A"
                  }
                />
              </div>

              {/* Assigned To */}
              <div className="bg-linear-to-br from-slate-900/80 to-indigo-900/20 p-6 rounded-xl border border-indigo-500/15 hover:border-indigo-500/30 transition-all">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-3">
                  Assigned To
                </label>
                <div className="flex -space-x-2">
                  {task?.assignedTo?.map((user, index) => (
                    <div
                      key={index}
                      className="relative group"
                      title={user.fullName || user.name}
                    >
                      <img
                        src={user.profileImageUrl || "/default-avatar.png"}
                        alt={user.fullName || user.name}
                        className="w-10 h-10 rounded-full border-2 border-indigo-500/50 hover:border-indigo-400 hover:scale-110 transition-all shadow-lg"
                      />
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-900 text-slate-100 text-xs px-2 py-1 rounded whitespace-nowrap border border-indigo-500/30 z-10">
                        {user.fullName || user.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Todo Checklist */}
            {task?.todoChecklist?.length > 0 && (
              <div className="bg-linear-to-br from-slate-900/80 to-indigo-900/20 p-6 rounded-xl border border-indigo-500/15">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-4">
                  ✓ Todo Checklist
                </label>
                <div className="space-y-3">
                  {task?.todoChecklist.map((item, index) => (
                    <TodoChecklist
                      key={`todo_${index}`}
                      text={item.text}
                      isChecked={item?.completed}
                      onChange={() => updateTodoChecklist(index)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Attachments */}
            {task?.attachments?.length > 0 && (
              <div className="bg-linear-to-br from-slate-900/80 to-indigo-900/20 p-6 rounded-xl border border-indigo-500/15">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-4">
                  📎 Attachments
                </label>
                <div className="space-y-2">
                  {task?.attachments.map((link, index) => (
                    <Attachment
                      key={`link_${link}`}
                      link={link}
                      index={index}
                      onClick={() => handleLinkClick(link)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ViewTaskDetails;

// Subcomponents
const InfoBox = ({ label, value }) => (
  <>
    <label className="block text-xs font-bold text-indigo-300 uppercase tracking-widest mb-3">
      {label}
    </label>
    <p className="text-slate-200 text-base leading-relaxed font-medium">{value}</p>
  </>
);

const TodoChecklist = ({ text, isChecked, onChange }) => (
  <div
    className={`flex items-center gap-3 p-3 rounded-lg border border-slate-700/50 hover:border-indigo-500/30 hover:bg-indigo-950/20 transition-all cursor-pointer group ${
      isChecked ? "opacity-70" : ""
    }`}
  >
    <input
      type="checkbox"
      checked={isChecked}
      onChange={onChange}
      className="w-5 h-5 accent-indigo-500 cursor-pointer"
    />
    <p
      className={`text-sm flex-1 ${
        isChecked ? "line-through text-slate-500" : "text-slate-200 group-hover:text-slate-100"
      }`}
    >
      {text}
    </p>
  </div>
);

const Attachment = ({ link, index, onClick }) => (
  <div
    onClick={onClick}
    className="flex justify-between items-center p-4 rounded-lg border border-slate-700/50 hover:border-indigo-500/50 hover:bg-indigo-950/30 cursor-pointer transition-all group"
  >
    <div className="flex items-center gap-3">
      <span className="text-indigo-400 font-bold text-sm bg-indigo-500/20 px-2.5 py-1.5 rounded-lg group-hover:bg-indigo-500/30 transition-all">
        {index + 1 < 10 ? `0${index + 1}` : index + 1}
      </span>
      <p className="text-sm truncate max-w-[250px] text-slate-200 group-hover:text-indigo-300 transition-colors">{link}</p>
    </div>
    <LuSquareArrowOutUpRight className="text-indigo-400/60 group-hover:text-indigo-300 transition-colors" />
  </div>
);