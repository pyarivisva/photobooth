import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Ghost, Coffee } from 'lucide-react';

export const FilterBar = ({ activeFilter, setActiveFilter }) => {
  const filters = [
    { id: 'normal', name: 'Normal', icon: <Sun size={20} />, class: 'filter-normal' },
    { id: 'grayscale', name: 'B&W', icon: <Ghost size={20} />, class: 'filter-grayscale' },
    { id: 'sepia', name: 'Sepia', icon: <Coffee size={20} />, class: 'filter-sepia' },
  ];
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 px-2 custom-scrollbar no-scrollbar">
      {filters.map((filter) => {
        const isSelected = activeFilter === filter.id;
        return (
          <motion.button
            key={filter.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveFilter(filter.id)}
            className={`shrink-0 flex flex-col items-center gap-2 p-4 rounded-4xl transition-all border-2 min-w-21.25 ${
              isSelected 
                ? 'bg-blue-50 border-blue-500 shadow-sm' 
                : 'bg-white border-transparent'
            }`}
          >
            <div className={`p-3 rounded-2xl ${isSelected ? 'bg-blue-500 text-white' : 'bg-slate-50 text-slate-400'}`}>
               {filter.icon}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${isSelected ? 'text-blue-600' : 'text-slate-500'}`}>
              {filter.name}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};
