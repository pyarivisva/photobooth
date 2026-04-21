import React from 'react';
import { motion } from 'framer-motion';

export const LayoutSelector = ({ options, onSelect }) => {
  return (
    <div className="w-full max-w-4xl flex flex-col items-center">
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Pick Your Layout</h2>
        <p className="text-slate-500">How many photos do you want to take today?</p>
      </div>

      <div className="flex flex-wrap justify-center gap-8 px-4">
        {options.map((option) => (
          <motion.button
            key={option.id}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(option.slots)}
            className="group relative flex flex-col items-center p-8 bg-white rounded-[3rem] shadow-xl border-4 border-transparent hover:border-blue-500 transition-all w-64"
          >
            <div className="w-full aspect-2/3 bg-slate-50 rounded-2xl mb-6 flex flex-col items-center justify-center p-4 gap-2 border-2 border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
              {[...Array(option.slots)].map((_, i) => (
                <div key={i} className="w-full h-full bg-slate-200 rounded-sm group-hover:bg-blue-200 transition-colors" />
              ))}
            </div>
            
            <div className="text-center">
              <span className="block text-lg font-black text-slate-800 uppercase tracking-tighter">
                {option.name}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {option.slots} shots
              </span>
            </div>

            {/* Bouncy tag */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-4 -right-4 bg-pink-500 text-white text-[10px] font-black px-4 py-2 rounded-full shadow-lg rotate-12"
            >
              Try It!
            </motion.div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
