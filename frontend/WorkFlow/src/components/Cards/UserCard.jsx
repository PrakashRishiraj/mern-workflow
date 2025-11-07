import React from "react";
import { motion } from "framer-motion";
import { FaUserAlt, FaEnvelope, FaCalendarAlt, FaUserShield, FaCheckCircle, FaClock, FaHourglass } from "react-icons/fa";

const UserCard = ({ userInfo = {} }) => {
  const {
    name = "Unknown User",
    email = "no-email@example.com",
    role = "User",
    createdAt,
    profileImageUrl,
    pendingTasks = 0,
    inProgressTasks = 0,
    completedTasks = 0,
  } = userInfo;

  return (
    <motion.article
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="w-screen max-w-full px-4 relative overflow-hidden rounded-2xl shadow-2xl"
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-slate-800 to-indigo-950 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Border Gradient */}
      <div className="absolute inset-0 bg-linear-to-r from-indigo-500/20 via-slate-700/10 to-indigo-500/20 rounded-2xl pointer-events-none" />
      <div className="absolute inset-0 rounded-2xl border border-indigo-500/30 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-8 p-8 md:p-10">
        {/* Header Section: Avatar + User Info */}
        <div className="flex items-start gap-8">
          {/* Avatar Container */}
          <motion.div
            whileHover={{ scale: 1.08 }}
            className="shrink-0"
          >
            <div className="relative">
              {/* Glowing Border */}
              <div className="absolute inset-0 bg-linear-to-r from-indigo-600 to-indigo-400 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 animate-pulse" />
              
              {/* Avatar */}
              <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-indigo-500/60 bg-linear-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                {profileImageUrl ? (
                  <img
                    src={profileImageUrl}
                    alt={`${name}'s avatar`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUserAlt className="text-5xl text-indigo-400" />
                )}
              </div>
            </div>
          </motion.div>

          {/* User Details */}
          <div className="flex-1 min-w-0">
            <div className="mb-2">
              <h3 className="text-3xl md:text-2xl font-bold bg-linear-to-r from-indigo-300 via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                {name}
              </h3>
            </div>

            {/* User Metadata */}
            <div className="space-y-3 mt-4">
              <DetailItem
                icon={FaEnvelope}
                label="Email"
                value={email}
              />
              <DetailItem
                icon={FaUserShield}
                label="Role"
                value={role}
              />
              <DetailItem
                icon={FaCalendarAlt}
                label="Joined"
                value={createdAt ? new Date(createdAt).toLocaleDateString() : "—"}
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-linear-to-r from-transparent via-indigo-500/30 to-transparent" />

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-6">
          <StatItem
            icon={FaHourglass}
            label="Pending"
            count={pendingTasks}
            accentColor="from-amber-500/20 to-orange-500/10"
            iconColor="text-amber-400"
          />
          <StatItem
            icon={FaClock}
            label="In Progress"
            count={inProgressTasks}
            accentColor="from-blue-500/20 to-cyan-500/10"
            iconColor="text-blue-400"
          />
          <StatItem
            icon={FaCheckCircle}
            label="Completed"
            count={completedTasks}
            accentColor="from-emerald-500/20 to-green-500/10"
            iconColor="text-emerald-400"
          />
        </div>
      </div>
    </motion.article>
  );
};

const DetailItem = ({ icon: Icon, label, value }) => {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      className="flex items-center gap-3 group cursor-default"
    >
      <Icon className="w-4 h-4 text-indigo-400/60 shrink-0 group-hover:text-indigo-300 transition" />
      <div className="flex items-baseline gap-2 min-w-0">
        <span className="text-slate-400 text-sm font-medium">{label}:</span>
        <span className="text-slate-100 font-semibold truncate group-hover:text-indigo-200 transition">
          {value}
        </span>
      </div>
    </motion.div>
  );
};

const StatItem = ({ icon: Icon, label, count, accentColor, iconColor }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`relative overflow-hidden rounded-xl p-6 border border-indigo-500/20 bg-linear-to-br ${accentColor} backdrop-blur-sm group transition`}
    >
      {/* Background Gradient Shimmer */}
      <div className="absolute inset-0 bg-linear-to-r from-indigo-600/5 via-transparent to-indigo-600/5 opacity-0 group-hover:opacity-100 transition duration-300" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className={`${iconColor} text-xl mb-3`}
        >
          <Icon />
        </motion.div>
        
        <div className="text-center">
          <div className="text-xl md:text-3xl font-bold text-slate-100 mb-2">
            {count}
          </div>
          <div className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
            {label}
          </div>
        </div>
      </div>

      {/* Border Glow on Hover */}
      <div className="absolute inset-0 rounded-xl border border-indigo-400/0 group-hover:border-indigo-400/40 transition duration-300" />
    </motion.div>
  );
};

export default UserCard;