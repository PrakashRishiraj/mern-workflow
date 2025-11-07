import React, { useState } from 'react';
import { LuChevronDown } from 'react-icons/lu';
import { motion, AnimatePresence } from 'framer-motion';

const SelectDropdown = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  return (
    <div className="relative w-full max-w-sm">
      {/* Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex justify-between items-center px-4 py-3 text-sm rounded-xl 
                   bg-linear-to-r from-slate-800 to-indigo-900 
                   text-gray-200 border border-slate-700 shadow-md
                   transition-all duration-200 hover:from-slate-700 hover:to-indigo-800
                   focus:ring-2 focus:ring-indigo-500 focus:outline-none"
      >
        <span>{selectedLabel || placeholder}</span>
        <LuChevronDown
          className={`ml-2 text-gray-300 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
          size={18}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute mt-2 w-full rounded-xl 
                       bg-linear-to-r from-slate-900 to-indigo-950 
                       border border-slate-700 shadow-lg z-20 overflow-hidden"
          >
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`px-4 py-2 text-sm cursor-pointer transition-all 
                            text-gray-300 hover:text-white 
                            hover:bg-linear-to-r hover:from-indigo-800 hover:to-slate-800`}
              >
                {option.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SelectDropdown;
