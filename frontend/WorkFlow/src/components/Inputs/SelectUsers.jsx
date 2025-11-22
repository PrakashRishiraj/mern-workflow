import React, { useEffect, useState, useMemo } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuUsers, LuSearch, LuTrophy } from "react-icons/lu";
import { motion } from "framer-motion";

const SelectUsers = ({ selectedUsers, setSelectedUsers }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelectedUsers, setTempSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Fetch all users
  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      if (response.data?.length > 0) {
        setAllUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // ✅ Filter users by search query
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return allUsers;
    return allUsers.filter((user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allUsers, searchQuery]);

  // ✅ Get top 10 users by completed tasks
  const topUsers = useMemo(() => {
    return [...allUsers]
      .sort((a, b) => (b.completedTasks || 0) - (a.completedTasks || 0))
      .slice(0, 10);
  }, [allUsers]);

  // ✅ Toggle user selection
  const toggleUserSelection = (userId) => {
    setTempSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // ✅ Assign selected users
  const handleAssign = () => {
    setIsModalOpen(false);
    setSelectedUsers(tempSelectedUsers);
  };

  const selectedUsersAvatars = allUsers
    .filter((user) => selectedUsers.includes(user._id))
    .map((user) => user.profileImageUrl);

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    if (selectedUsers.length === 0) {
      setTempSelectedUsers([]);
    }
  }, [selectedUsers]);

  return (
    <div className="relative">
      {/* --- Add Members Button --- */}
      {selectedUsersAvatars.length === 0 ? (
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg 
          bg-linear-to-r from-indigo-600 to-indigo-700
          hover:from-indigo-500 hover:to-indigo-600
          border border-indigo-500/40 text-white text-sm font-medium
          transition-all duration-300 shadow-lg hover:shadow-indigo-500/50"
        >
          <LuUsers className="text-lg" />
          Add Members
        </button>
      ) : (
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setIsModalOpen(true)}
        >
          <div className="flex -space-x-2">
            {selectedUsersAvatars.map((avatar, idx) => (
              <img
                key={idx}
                src={avatar}
                alt="user"
                className="w-9 h-9 rounded-full border-2 border-indigo-500/60 hover:border-indigo-400 transition-all group-hover:scale-110"
              />
            ))}
          </div>
          <span className="text-indigo-300 text-sm font-medium group-hover:text-indigo-200 transition-colors">
            + Edit
          </span>
        </div>
      )}

      {/* --- Modal --- */}
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-linear-to-br from-slate-900 via-slate-800 to-indigo-950
            border border-indigo-500/30 rounded-2xl shadow-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="mb-6">
              <h3 className="text-xl font-bold bg-linear-to-r from-indigo-300 to-indigo-200 bg-clip-text text-transparent mb-4">
                Assign Members
              </h3>

              {/* Search Bar */}
              <div className="relative">
                <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg
                  text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500/50
                  transition-all duration-200"
                />
              </div>
            </div>

            {/* Users List - Scrollable */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {/* Top Performers Section */}
              {!searchQuery && topUsers.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <LuTrophy className="w-5 h-5 text-amber-400" />
                    <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wider">
                      Top Performers
                    </h4>
                  </div>

                  <div className="space-y-2">
                    {topUsers.map((user, rank) => (
                      <motion.div
                        key={user._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: rank * 0.05 }}
                        onClick={() => toggleUserSelection(user._id)}
                        className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer border transition-all group
                          ${
                            tempSelectedUsers.includes(user._id)
                              ? "bg-indigo-600/40 border-indigo-400/60"
                              : "bg-slate-700/30 border-slate-600/30 hover:bg-slate-700/50 hover:border-slate-500/50"
                          }`}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="relative">
                            <img
                              src={user.profileImageUrl || "https://img.lovepik.com/png/20231027/Dark-gray-simple-avatar-grey-silhouette-placeholder_369196_wh860.png"}
                              alt={user.name}
                              className="w-9 h-9 rounded-full border border-slate-500/50"
                            />
                            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-xs font-bold text-slate-900">
                              {rank + 1}
                            </div>
                          </div>
                          <div className="min-w-0">
                            <p className="text-slate-100 text-sm font-medium truncate">
                              {user.name}
                            </p>
                            <p className="text-xs text-amber-300 font-semibold">
                              {user.completedTasks || 0} completed
                            </p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={tempSelectedUsers.includes(user._id)}
                          readOnly
                          className="accent-indigo-500 w-5 h-5 cursor-pointer"
                        />
                      </motion.div>
                    ))}
                  </div>

                  {filteredUsers.length > 0 && (
                    <div className="h-px bg-linear-to-r from-transparent via-slate-600/30 to-transparent my-4" />
                  )}
                </div>
              )}

              {/* Search Results / All Users */}
              {filteredUsers.length > 0 ? (
                <div>
                  {searchQuery && (
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-3 px-2">
                      Search Results
                    </p>
                  )}
                  <div className="space-y-2">
                    {filteredUsers.map((user) => (
                      <motion.div
                        key={user._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => toggleUserSelection(user._id)}
                        className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer border transition-all
                          ${
                            tempSelectedUsers.includes(user._id)
                              ? "bg-indigo-600/40 border-indigo-400/60"
                              : "bg-slate-700/30 border-slate-600/30 hover:bg-slate-700/50 hover:border-slate-500/50"
                          }`}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <img
                            src={user.profileImageUrl || "https://img.lovepik.com/png/20231027/Dark-gray-simple-avatar-grey-silhouette-placeholder_369196_wh860.png"}
                            alt={user.name}
                            className="w-9 h-9 rounded-full border border-slate-500/50"
                          />
                          <div className="min-w-0">
                            <p className="text-slate-100 text-sm font-medium truncate">
                              {user.name}
                            </p>
                            <p className="text-xs text-slate-400">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={tempSelectedUsers.includes(user._id)}
                          readOnly
                          className="accent-indigo-500 w-5 h-5 cursor-pointer"
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <LuSearch className="w-12 h-12 text-slate-600 mb-3" />
                  <p className="text-slate-400 text-sm">
                    {searchQuery ? "No users found." : "No users available."}
                  </p>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-700/50">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSearchQuery("");
                }}
                className="px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-slate-100
                font-medium transition-all duration-200 border border-slate-600/50"
              >
                Cancel
              </button>
              <button
                onClick={handleAssign}
                className="px-4 py-2 rounded-lg bg-linear-to-r from-indigo-600 to-indigo-700
                hover:from-indigo-500 hover:to-indigo-600 text-white font-medium transition-all duration-200 shadow-lg"
              >
                Assign
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default SelectUsers;