import React from "react";

const TaskStatusTabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="w-full flex justify-center px-2">
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 bg-linear-to-r from-slate-900 via-slate-800 to-indigo-900 rounded-2xl p-2 sm:p-3 md:p-4 shadow-lg max-w-4xl w-full">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={`relative flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm md:text-base font-medium transition-all duration-300 ${
              activeTab === tab.label
                ? "bg-lienar-to-r from-indigo-500 to-indigo-700 text-white shadow-md scale-105"
                : "text-gray-300 hover:text-white hover:bg-slate-700/40"
            }`}
          >
            <span className="truncate max-w-20 sm:max-w-[120px]">{tab.label}</span>

            <span
              className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-semibold ${
                activeTab === tab.label
                  ? "bg-white/20 text-white"
                  : "bg-slate-700/50 text-gray-300"
              }`}
            >
              {tab.count}
            </span>

            {activeTab === tab.label && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-indigo-400 to-indigo-600 rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TaskStatusTabs;
