import React, { useState } from 'react'
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";
import { LuPaperclip } from 'react-icons/lu';

const AddAttachmentsInput = ({ attachments, setAttachments }) => {
  const [option, setOption] = useState("");

  // ✅ Add new attachment
  const handleAddOption = () => {
    if (option.trim()) {
      setAttachments([...attachments, option.trim()]);
      setOption("");
    }
  };

  // ✅ Delete attachment
  const handleDeleteOption = (index) => {
    const updatedArr = attachments.filter((_, idx) => idx !== index);
    setAttachments(updatedArr);
  };

  return (
    <div className="bg-linear-to-br from-slate-900 to-slate-950 border border-slate-700/50 rounded-xl p-5 shadow-md shadow-indigo-900/30">
      <h3 className="text-gray-200 text-lg font-medium mb-4 flex items-center gap-2">
        <LuPaperclip className="text-indigo-400 text-xl" />
        Attachments
      </h3>

      {/* --- Attachment List --- */}
      <div className="space-y-3 mb-4 max-h-[250px] overflow-y-auto pr-2">
        {attachments.length === 0 && (
          <p className="text-gray-500 text-sm italic">No attachments added yet.</p>
        )}

        {attachments.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 hover:border-indigo-500/60 transition-all duration-200"
          >
            <div className="flex items-center gap-2 text-gray-300 text-sm truncate">
              <LuPaperclip className="text-indigo-400" />
              <a
                href={item}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline hover:text-indigo-300 truncate"
              >
                {item}
              </a>
            </div>

            <button
              onClick={() => handleDeleteOption(index)}
              className="text-gray-400 hover:text-red-400 transition-all duration-200"
            >
              <HiOutlineTrash className="text-lg" />
            </button>
          </div>
        ))}
      </div>

      {/* --- Input Field --- */}
      <div className="flex items-center gap-3">
        <div className="flex items-center flex-1 bg-slate-800 border border-slate-700/60 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500 transition-all duration-200">
          <LuPaperclip className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Add file link (URL)..."
            value={option}
            onChange={({ target }) => setOption(target.value)}
            className="flex-1 bg-transparent text-gray-200 text-sm placeholder-gray-500 focus:outline-none"
          />
        </div>

        <button
          onClick={handleAddOption}
          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-linear-to-r from-indigo-600 to-indigo-700 
          text-white text-sm hover:from-indigo-500 hover:to-indigo-600 shadow-md hover:shadow-indigo-700/30 transition-all duration-300"
        >
          <HiMiniPlus className="text-base" /> Add
        </button>
      </div>
    </div>
  );
};

export default AddAttachmentsInput;
