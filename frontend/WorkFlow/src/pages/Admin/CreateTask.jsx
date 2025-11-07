import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { PRIORITY_DATA } from "../../utils/data";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router";
import { LuTrash2 } from "react-icons/lu";
import SelectUsers from "../../components/Inputs/SelectUsers";
import SelectDropdown from "../../components/Inputs/SelectDropdown";
import TodoListInput from "../../components/Inputs/TodoListInput";
import AddAttachmentsInput from "../../components/Inputs/AddAttachmentsInput";
import moment from "moment";

const CreateTask = () => {
  const location = useLocation();
  const { taskId } = location.state || {};
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: null,
    assignedTo: [],
    todoChecklist: [],
    attachments: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  // ✅ Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData({ ...taskData, [name]: value });
  };

  const handleUserSelect = (users) => {
    setTaskData({ ...taskData, assignedTo: users });
  };

  const clearData = () => {
    setTaskData({
      title: "",
      description: "",
      priority: "Low",
      dueDate: null,
      assignedTo: [],
      todoChecklist: [],
      attachments: [],
    });
  };

  const createTask = async () => {
    try {

      const formattedTaskData = {
        ...taskData,
        todoChecklist: taskData.todoChecklist.map((text) => ({
          text,
          isDone: false,
        })),
        assignedTo:
        typeof taskData.assignedTo === "string"
          ? JSON.parse(taskData.assignedTo)
          : taskData.assignedTo,
      };

      setLoading(true);

      console.log("🧾 Final payload being sent:", formattedTaskData);

      await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, formattedTaskData);
      toast.success("Task created successfully!");
      clearData();
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async () => {
    try {
      // Normalize payload same as createTask
      const formattedTaskData = {
        ...taskData,
        // convert todoChecklist from ["todo 1", ...] to [{text, isDone}]
        todoChecklist: (taskData.todoChecklist || []).map((text) => ({
          text,
          isDone: false,
        })),
        // ensure assignedTo is an array (if it arrives as a JSON string, parse it)
        assignedTo:
          typeof taskData.assignedTo === "string"
            ? JSON.parse(taskData.assignedTo)
            : taskData.assignedTo || [],
      };

      setLoading(true);

      // Support API_PATHS being either a string or a function that accepts id
      let url;
      if (typeof API_PATHS.TASKS.UPDATE_TASK === "function") {
        url = API_PATHS.TASKS.UPDATE_TASK(taskId);
      } else {
        // If UPDATE_TASK is e.g. "/api/tasks", the pattern you used before was `${...}/${taskId}`
        url = `${API_PATHS.TASKS.UPDATE_TASK}/${taskId}`;
      }

      console.log("🔁 Updating task — URL:", url);
      console.log("🔁 Payload:", formattedTaskData);

      const res = await axiosInstance.put(url, formattedTaskData);

      toast.success("Task updated successfully!");
      // navigate back to tasks list
      navigate("/admin/tasks");
    } catch (err) {
      // Helpful debug logs — open browser console to inspect
      console.error("Update task error:", err);
      if (err?.response) {
        console.error("Status:", err.response.status);
        console.error("Response data:", err.response.data);
        // Friendly messages for common responses
        const status = err.response.status;
        if (status === 401) {
          toast.error("You are not authenticated. Please login again.");
          return;
        }
        if (status === 403) {
          toast.error("You are not authorized to update this task.");
          return;
        }
        if (status === 404) {
          toast.error("Task not found. It may have been deleted.");
          return;
        }
        // fallback to server message if available
        toast.error(err.response.data?.message || "Failed to update task");
      } else {
        // network or other error
        toast.error("Network error — failed to update task");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setError(null);

    if (!taskData.title.trim()) return setError("Title is required.");
    if (!taskData.description.trim()) return setError("Description is required.");
    if (!taskData.dueDate?.trim()) return setError("Due Date is required.");
    if (taskData.assignedTo?.length === 0) return setError("Assign at least one member.");
    if (taskData.todoChecklist?.length === 0) return setError("Add at least one todo.");

    taskId ? updateTask() : createTask();
  };

  const getTaskDetailsByID = async (id) => {
    if (!id) return;
    try {
      setLoading(true);

      // Support API_PATHS either string or function
      let url;
      if (typeof API_PATHS.TASKS.GET_TASK_BY_ID === "function") {
        url = API_PATHS.TASKS.GET_TASK_BY_ID(id);
      } else {
        url = `${API_PATHS.TASKS.GET_TASK_BY_ID}/${id}`;
      }

      const response = await axiosInstance.get(url);
      const taskInfo = response.data?.task || response.data; // adjust depending on API shape

      if (taskInfo) {
        setTaskData({
          title: taskInfo.title || "",
          description: taskInfo.description || "",
          priority: taskInfo.priority || "Low",
          dueDate: taskInfo.dueDate ? moment(taskInfo.dueDate).format("YYYY-MM-DD") : "",
          // for assignedTo you want an array of user ids:
          assignedTo: (taskInfo.assignedTo || []).map((u) => (u._id ? u._id : u)),
          // convert server checklist to array of strings for your TodoListInput
          todoChecklist: (taskInfo.todoChecklist || []).map((t) => (typeof t === "string" ? t : t.text || "")),
          attachments: taskInfo.attachments || [],
        });
      }
    } catch (error) {
      console.error("Error fetching task by ID:", error);
      toast.error("Failed to load task details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(taskId) {
      getTaskDetailsByID(taskId)
    }
    return () => {}
  }, [taskId])

  const deleteTask = async () => {
    try {
      await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId))
      setOpenDeleteAlert(false);
      toast.success("Task Deleted Successfully")
      navigate("/admin/dashboard")
    } catch (error) {
      console.error("Error deleting task: ", error)
    }
  }

  return (
    <DashboardLayout activeMenu="Create Task">
      <div className="rounded-2xl min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-indigo-900 text-gray-100 py-10 px-6">
        <div className="max-w-5xl mx-auto backdrop-blur-md bg-slate-800/50 p-8 rounded-2xl shadow-xl border border-slate-700">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-semibold bg-linear-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent">
              {taskId ? "Update Task" : "Create Task"}
            </h2>
            {taskId && (
              <button
                onClick={() => setOpenDeleteAlert(true)}
                className="flex items-center gap-2 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-all"
              >
                <LuTrash2 /> Delete
              </button>
            )}
          </div>

          {/* Form */}
          <div className="space-y-8">
            {/* Title */}
            <div>
              <label className="block text-sm text-slate-300 mb-1">Task Title</label>
              <input
                type="text"
                name="title"
                placeholder="Create App UI"
                className="w-full bg-slate-900/60 border border-slate-700 focus:border-indigo-500 rounded-lg px-4 py-2 text-gray-100 outline-none transition"
                value={taskData.title}
                onChange={handleChange}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm text-slate-300 mb-1">Description</label>
              <textarea
                name="description"
                placeholder="Describe task details..."
                rows={4}
                className="w-full bg-slate-900/60 border border-slate-700 focus:border-indigo-500 rounded-lg px-4 py-2 text-gray-100 outline-none transition"
                value={taskData.description}
                onChange={handleChange}
              />
            </div>

            {/* Priority, Date, Assign */}
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm text-slate-300 mb-1">Priority</label>
                <SelectDropdown
                  options={PRIORITY_DATA}
                  value={taskData.priority}
                  onChange={(val) => setTaskData({ ...taskData, priority: val })}
                  placeholder="Select Priority"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1">Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  className="w-full bg-slate-900/60 border border-slate-700 focus:border-indigo-500 rounded-lg px-4 py-2 text-gray-100 outline-none transition"
                  value={taskData.dueDate || ""}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1">Assign To</label>
                <SelectUsers
                  selectedUsers={taskData.assignedTo}
                  setSelectedUsers={(users) => setTaskData({ ...taskData, assignedTo: users })
                }
                />
              </div>
            </div>

            {/* Todo Checklist */}
            <div>
              <label className="block text-sm text-slate-300 mb-2">Todo Checklist</label>
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                <TodoListInput
                  todoList={taskData.todoChecklist}
                  setTodoList={(updatedList) =>
                    setTaskData({ ...taskData, todoChecklist: updatedList })
                  }
                />
              </div>
            </div>

            {/* Attachments */}
            <div>
              <label className="block text-sm text-slate-300 mb-2">Attachments</label>
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                <AddAttachmentsInput
                  attachments={taskData.attachments}
                  setAttachments={(updatedList) =>
                    setTaskData({ ...taskData, attachments: updatedList })
                  }
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-rose-400 text-sm bg-rose-950/30 border border-rose-700 rounded-md px-3 py-2">
                ⚠️ {error}
              </p>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-linear-to-r from-indigo-500 to-indigo-700 hover:from-indigo-400 hover:to-indigo-600 px-6 py-2 rounded-lg text-white font-semibold transition-all disabled:opacity-50"
              >
                {loading
                  ? "Saving..."
                  : taskId
                  ? "UPDATE TASK"
                  : "CREATE TASK"}
              </button>
            </div>
          </div>
        </div>
        {/* 🧩 Delete Confirmation Modal */}
        {openDeleteAlert && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-sm w-full shadow-2xl text-center">
              <h3 className="text-lg font-semibold text-gray-100 mb-2">
                Confirm Delete
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Are you sure you want to delete this task? This action cannot be
                undone.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setOpenDeleteAlert(false)}
                  className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteTask}
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CreateTask;
