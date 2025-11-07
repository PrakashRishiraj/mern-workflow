import React from "react";

const InfoCard = ({ icon: Icon, label, value, color }) => {
  return (
    <div
      className="flex float-left items-center justify-between bg-slate-800 border border-slate-700/40 
      rounded-lg p-4 shadow-sm w-[20%] min-w-[200px]"
    >
      {/* Icon */}
      <div
        className={`p-2.5 rounded-lg ${
          color || "bg-indigo-600/20 text-indigo-400"
        } flex items-center justify-center`}
      >
        {Icon && <Icon className="w-6 h-6" />}
      </div>

      {/* Text */}
      <div className="text-right">
        <p className="text-lg font-semibold text-slate-100">{value}</p>
        <p className="text-sm text-slate-400">{label}</p>
      </div>
    </div>
  );
};

export default InfoCard;
