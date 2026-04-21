import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

// const STICKERS = [
//   { id: 'lily', src: '/stickers/lily.webp' },
//   { id: 'lucu', src: '/stickers/hantu.webp' },
//   // Tambahkan stiker lain di sini jika ada
// ];

export const StickerDrawer = ({ onAddSticker }) => {
  return (
    <div className="w-full bg-white/80 backdrop-blur-md border-t border-slate-100 p-6 shadow-2xl">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Select Stickers
          </span>
          <div className="h-px flex-1 bg-slate-100" />
        </div>
        
        <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
        {STICKERS.map((sticker) => (
          <motion.button
            key={sticker.id}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onAddSticker(sticker.src)}
            className="relative shrink-0 w-20 h-20 bg-white rounded-2xl shadow-sm border border-slate-50 p-2 flex items-center justify-center hover:shadow-md transition-all"
          >
            <Image
              src={sticker.src}
              alt={sticker.id}
              fill
              sizes="80px"
              className="object-contain p-2 pointer-events-none" 
            />
          </motion.button>
        ))}
        
        {[1, 2, 3].map((i) => (
          <div key={i} className="shrink-0 w-20 h-20 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 flex items-center justify-center">
            <span className="text-[20px] opacity-20">✨</span>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};
