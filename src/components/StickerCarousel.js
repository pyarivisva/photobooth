import React from 'react';
import { motion } from 'framer-motion';

const STICKERS = [
  { id: 's1', src: '/stickers/1.webp' },
  { id: 's2', src: '/stickers/2.webp' },
  { id: 's3', src: '/stickers/3.webp' },
  { id: 's4', src: '/stickers/4.webp' },
  { id: 's5', src: '/stickers/5.webp' },
  { id: 's6', src: '/stickers/6.webp' },
  { id: 's7', src: '/stickers/7.webp' },
  { id: 's8', src: '/stickers/8.webp' },
];

export const StickerCarousel = ({ onAddSticker }) => {
  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-4 px-2">
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 px-2 custom-scrollbar no-scrollbar">
        {STICKERS.map((sticker) => (
          <motion.button
            key={sticker.id}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onAddSticker(sticker.src)}
            className="relative shrink-0 w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 p-2 flex items-center justify-center hover:shadow-md transition-all"
          >
            <img
              src={sticker.src}
              alt={sticker.id}
              className="w-full h-full object-contain pointer-events-none"
            />
          </motion.button>
        ))}
        
      </div>
    </div>
  );
};
