import React, { useState } from "react";
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";

const TodoListInput = ({ todoList, setTodoList }) => {
  const [option, setOption] = useState("");

  // ✅ Add new todo
  const handleAddOption = () => {
    if (option) {
      setTodoList([...todoList, option.trim()]);
      setOption("");
    }
  };

  // ✅ Delete a todo
  const handleDeleteOption = (index) => {
    const updatedArr = todoList.filter((_, idx) => idx !== index);
    setTodoList(updatedArr);
  };

  console.log("Rendering TodoListInput:", todoList);

  return (
    <div className="bg-linear-to-br from-slate-900 to-slate-950 border border-slate-700/50 rounded-xl p-5 shadow-md shadow-indigo-900/30">
      <h3 className="text-gray-200 text-lg font-medium mb-4">To-Do Checklist</h3>

      {/* --- Todo List --- */}
      <div className="space-y-3 mb-4 max-h-[250px] overflow-y-auto pr-2">
        {todoList.length === 0 && (
          <p className="text-gray-500 text-sm italic">No tasks added yet.</p>
        )}

        {todoList.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 hover:border-indigo-500/60 transition-all duration-200"
          >
            <p className="flex items-center gap-2 text-gray-300 text-sm">
              <span className="text-indigo-400 font-mono">
                {index < 9 ? `0${index + 1}` : index + 1}.
              </span>
              {item}
            </p>

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
        <input
          type="text"
          placeholder="Enter new task..."
          value={option}
          onChange={({ target }) => setOption(target.value)}
          className="flex-1 px-3 py-2 text-sm text-gray-200 bg-slate-800 border border-slate-700/60 rounded-lg placeholder-gray-500 
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
        />

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

export default TodoListInput;
