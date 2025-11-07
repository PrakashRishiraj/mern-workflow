import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuFileSpreadsheet } from "react-icons/lu";
import TaskStatusTabs from "../../components/TaskStatusTabs";
import TaskCard from "../../components/Cards/TaskCard";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { FaEdit, FaEye, FaTimes } from "react-icons/fa";

const ManageTasks = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentUser, setCurrentUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const navigate = useNavigate();

  // Get current user info
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
        setCurrentUser(response.data);
      } catch (error) {
        console.log("Error fetching user info: ", error);
      }
    };
    getUserInfo();
  }, []);

  const getAllTasks = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
        params: {
          status: filterStatus === "All" ? "" : filterStatus,
        },
      });

      let tasks = response.data?.tasks?.length > 0 ? response.data.tasks : [];

      // Filter tasks where user is creator or assigned
      if (currentUser) {
        tasks = tasks.filter((task) => {
          const isCreator = task.createdBy === currentUser._id;
          const isAssigned = task.assignedTo?.some(
            (user) => user._id === currentUser._id
          );
          return isCreator || isAssigned;
        });
      }

      setAllTasks(tasks);

      // Recalculate status summary based on filtered tasks
      const statusSummary = {
        all: tasks.length,
        pending: tasks.filter((t) => t.status === "Pending").length,
        inProgress: tasks.filter((t) => t.status === "In Progress").length,
        completed: tasks.filter((t) => t.status === "Completed").length,
      };

      const statusArray = [
        { label: "All", count: statusSummary.all },
        { label: "Pending", count: statusSummary.pending },
        { label: "In Progress", count: statusSummary.inProgress },
        { label: "Completed", count: statusSummary.completed },
      ];

      setTabs(statusArray);
    } catch (error) {
      console.log("Error fetching tasks: ", error);
      toast.error("Error fetching tasks");
    }
  };

  const handleTaskClick = (taskData) => {
    setSelectedTask(taskData);
    setIsModalOpen(true);
  };

  const handleEditTask = () => {
    if (selectedTask) {
      navigate(`/admin/create-task`, { state: { taskId: selectedTask._id } });
      setIsModalOpen(false);
    }
  };

  const handleViewTask = () => {
    if (selectedTask) {
      navigate(`/user/task-details/${selectedTask._id}`, { state: { taskId: selectedTask._id } });
      setIsModalOpen(false);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_TASKS, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "task_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Task report downloaded successfully!");
    } catch (error) {
      console.error("Error downloading task details: ", error);
      toast.error("Error in downloading Task Report.");
    }
  };

  useEffect(() => {
    if (currentUser) {
      getAllTasks();
    }
  }, [filterStatus, currentUser]);

  return (
    <DashboardLayout activeMenu="Manage Tasks">
      <div className="space-y-6 p-4 md:p-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Manage Tasks
            </h2>
            <p className="text-sm text-muted-foreground">
              View, filter, and track all your tasks in one place.
            </p>
          </div>

          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-2 bg-linear-to-r from-indigo-600 to-violet-700 hover:from-indigo-500 hover:to-violet-600 text-white font-medium px-4 py-2 rounded-lg shadow-md transition-all duration-300 hover:scale-105"
          >
            <LuFileSpreadsheet className="h-4 w-4" />
            Download Report
          </button>
        </div>

        {/* Status Tabs */}
        {tabs?.length > 0 && (
          <div className="border-b border-border pb-4">
            <TaskStatusTabs
              tabs={tabs}
              activeTab={filterStatus}
              setActiveTab={setFilterStatus}
            />
          </div>
        )}

        {/* Task List */}
        <div
          className="
          grid gap-4 
          sm:grid-cols-1 
          md:grid-cols-2 
          lg:grid-cols-3 
          xl:grid-cols-4"
        >
          {allTasks.length > 0 ? (
            allTasks.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <TaskCard
                  title={item.title}
                  description={item.description}
                  priority={item.priority}
                  status={item.status}
                  progress={item.progress}
                  createdAt={item.createdAt}
                  dueDate={item.dueDate}
                  assignedTo={item.assignedTo?.map(
                    (user) => user.profileImageUrl
                  )}
                  attachmentCount={item.attachments?.length || 0}
                  completedTodoCount={item.completedTodoCount || 0}
                  todoChecklist={item.todoChecklist || []}
                  onClick={() => handleTaskClick(item)}
                />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <p className="text-lg font-medium">No tasks found</p>
              <p className="text-sm">Try changing filters or create a new task.</p>
            </div>
          )}
        </div>
      </div>

      {/* Task Action Modal - Inline */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="w-full max-w-md rounded-2xl bg-linear-to-br from-slate-900 via-slate-800 to-indigo-950 border border-indigo-500/30 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="relative bg-linear-to-r from-slate-800 to-indigo-900/50 px-6 py-5 border-b border-indigo-500/20 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-100">Task Actions</h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                  >
                    <FaTimes className="text-slate-400 hover:text-slate-200" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-sm text-slate-400 mb-6">
                    What would you like to do with{" "}
                    <span className="text-indigo-300 font-semibold">"{selectedTask?.title}"</span>?
                  </p>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {/* View Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleViewTask}
                      className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl
                                 bg-linear-to-r from-blue-600/80 to-blue-500/80 hover:from-blue-600 hover:to-blue-500
                                 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-blue-500/30"
                    >
                      <FaEye className="text-lg" />
                      View Task
                    </motion.button>

                    {/* Edit Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleEditTask}
                      className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl
                                 bg-linear-to-r from-indigo-600/80 to-indigo-500/80 hover:from-indigo-600 hover:to-indigo-500
                                 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-indigo-500/30"
                    >
                      <FaEdit className="text-lg" />
                      Edit Task
                    </motion.button>

                    {/* Cancel Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsModalOpen(false)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-600/50 hover:border-slate-500/80
                                 text-slate-300 hover:text-slate-100 font-semibold transition-all duration-200
                                 hover:bg-slate-700/30"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default ManageTasks;