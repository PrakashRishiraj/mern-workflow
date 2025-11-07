import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { UserContext } from "../../context/userContext";
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from "../../utils/data";
import { motion } from "framer-motion";

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);
  const [sideMenuData, setSideMenuData] = useState([]);
  const navigate = useNavigate();

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }
    navigate(route);
  };

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  useEffect(() => {
    if (user) {
      setSideMenuData(
        user?.role === "admin" ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA
      );
    }
  }, [user]);

  return (
    <motion.aside
      initial={{ x: -200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 80, damping: 15 }}
      className="h-full w-64 bg-linear-to-b from-slate-900 via-slate-800 to-indigo-900 border-r border-slate-700 shadow-2xl text-white flex flex-col p-6 relative z-40"
    >
      {/* --- Profile Section --- */}
      <div className="flex flex-col items-center mb-8">
        <img
          src={user?.profileImageUrl || "https://ui-avatars.com/api/?name=User"}
          alt="Profile"
          className="w-20 h-20 rounded-full border-2 border-indigo-500 object-cover shadow-md"
        />
        <div className="text-center mt-3">
          {user?.role && (
            <span className="text-xs uppercase tracking-wide text-indigo-400 font-semibold">
              {user.role}
            </span>
          )}
          <h5 className="text-lg font-semibold text-slate-100 mt-1">
            {user?.name || "User"}
          </h5>
          <p className="text-slate-400 text-sm truncate w-48">
            {user?.email || ""}
          </p>
        </div>
      </div>

      {/* --- Menu Buttons --- */}
      <div className="flex-1 space-y-1">
        {sideMenuData.map((item, index) => (
          <button
            key={`menu_${index}`}
            className={`w-full flex items-center gap-4 px-5 py-3 rounded-lg transition-all duration-200 text-sm cursor-pointer font-medium ${
              activeMenu === item.label
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-700/40"
                : "text-slate-300 hover:bg-indigo-700/30 hover:text-white"
            }`}
            onClick={() => handleClick(item.path)}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </div>

      {/* --- Footer --- */}
      <div className="text-center text-xs text-slate-500 mt-6">
        <p>© {new Date().getFullYear()} WorkFlow</p>
      </div>
    </motion.aside>
  );
};

export default SideMenu;
