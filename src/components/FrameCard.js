/* eslint-disable @next/next/no-img-element */
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

export const FrameCard = ({ frame, isSelected, onClick }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    onClick={onClick}
    className={`relative w-48 aspect-1/3 rounded-2xl overflow-hidden cursor-pointer border-4 transition-all shadow-lg ${
      isSelected ? 'border-blue-500 scale-105 shadow-blue-100' : 'border-white opacity-80'
    }`}
  >
    {/* Menggunakan thumbnail statis untuk menghemat baterai */}
    <div 
      className="w-full h-full bg-slate-100 flex items-center justify-center"
      style={{ backgroundColor: frame.color || '#f1f5f9' }}
    >
       {frame.src && (
         <img 
           src={frame.src} 
           className="w-full h-full object-contain" 
           alt={frame.name} 
         />
       )}
    </div>

    {isSelected && (
      <div className="absolute top-3 right-3 bg-blue-500 text-white p-1 rounded-full z-20 shadow-lg">
        <Check size={14} strokeWidth={4} />
      </div>
    )}
    
    <div className="absolute bottom-0 inset-x-0 p-3 bg-linear-to-t from-black/50 to-transparent z-20 text-left">
      <p className="text-[10px] font-black text-white tracking-widest uppercase">{frame.name}</p>
    </div>
  </motion.div>
);