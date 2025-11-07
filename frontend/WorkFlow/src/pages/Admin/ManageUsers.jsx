import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuFileSpreadsheet } from "react-icons/lu";
import UserCard from "../../components/Cards/UserCard";
import toast from "react-hot-toast";
import { FaUserAlt } from "react-icons/fa";

const ManageUsers = () => {
  const [allUsers, setAllUsers] = useState([]);

  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      if (response.data?.length > 0) {
        setAllUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching all users: ", error);
    }
  };

  useEffect(() => {
    getAllUsers();
    return () => {};
  }, []);

  // Download task report
  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_USERS, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "user_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("User report downloaded successfully!");
    } catch (error) {
      console.error("Error downloading user details: ", error);
      toast.error("Error in downloading User Report.");
    }
  };

  return (
    <DashboardLayout activeMenu="Team Members">
      <div className="rounded-2xl min-h-screen bg-linear-to-b from-slate-900 via-slate-950 to-indigo-950 p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold bg-linear-to-r from-indigo-400 to-violet-500 bg-clip-text text-transparent drop-shadow-md">
            Team Members
          </h2>

          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-2 bg-linear-to-r from-indigo-600 to-violet-700 hover:from-indigo-500 hover:to-violet-600 text-white font-medium px-4 py-2 rounded-lg shadow-md transition-all duration-300 hover:scale-105"
          >
            <LuFileSpreadsheet className="text-lg" />
            <span>Download Report</span>
          </button>
        </div>

        {/* User Cards */}
        <div className="space-y-6 py-6">
          {allUsers.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {allUsers.map((user) => (
                <UserCard key={user._id} userInfo={user} />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
                  <FaUserAlt className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-lg font-semibold text-slate-200">No team members found.</p>
                <p className="text-sm text-slate-400 mt-2">Start by adding members to your team.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageUsers;
