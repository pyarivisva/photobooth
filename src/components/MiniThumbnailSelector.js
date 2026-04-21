import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export const MiniThumbnailSelector = ({ options, selectedFrame, slotCount, onSelect }) => {
  return (
    <div className="w-full">
      <div className="flex gap-4 overflow-x-auto pb-4 px-2 custom-scrollbar no-scrollbar">
        {options.map((option) => {
          const isSelected = selectedFrame.id === option.id;
          
          return (
            <motion.button
              key={option.id}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(option)}
              className={`shrink-0 flex flex-col items-center gap-3 p-3 rounded-[2.5rem] border-4 transition-all ${
                isSelected 
                  ? 'bg-blue-50 border-blue-500 shadow-lg' 
                  : 'bg-white border-transparent'
              }`}
            >
              {/* Mini Strip Preview */}
              <div 
                className={`relative rounded-xl overflow-hidden shadow-sm flex flex-col items-center border border-black/5 ${
                  slotCount === 1 ? 'w-16 h-20 pt-2' : 'w-14 h-36 pt-2 gap-1'
                }`}
                style={{ backgroundColor: option.color || 'white' }}
              >
                {/* Frame Image Content (if it's a template) */}
                {option.src ? (
                  <div className="absolute inset-0 w-full h-full">
                    <Image 
                      src={option.src} 
                      className="object-cover z-20" 
                      alt="Frame Art"
                      fill
                      sizes="64px"
                    />
                    {/* Placeholder content behind frame to simulate the look */}
                    <div className={`absolute inset-0 flex flex-col items-center z-10 ${slotCount === 1 ? 'pt-2' : 'pt-2 gap-1'}`}>
                      {[...Array(slotCount)].map((_, i) => (
                         <div key={i} className={`bg-slate-200 ${slotCount === 1 ? 'w-14 h-12 rounded-sm' : 'w-10 h-7 rounded-xs'}`} />
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Simulated photo slots for blank colors */
                  <div className={`flex flex-col items-center ${slotCount === 1 ? '' : 'gap-1'}`}>
                    {[...Array(slotCount)].map((_, i) => (
                      <div key={i} className={`bg-black/10 ${slotCount === 1 ? 'w-14 h-12 rounded-sm' : 'w-10 h-7 rounded-xs'}`} />
                    ))}
                  </div>
                )}
              </div>


              <span className={`text-[8px] font-black uppercase tracking-widest ${
                isSelected ? 'text-blue-600' : 'text-slate-500'
              }`}>
                {option.name.split(' ')[0]}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
