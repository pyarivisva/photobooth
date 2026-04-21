import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export const BackgroundElements = () => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    // Generate stable positions once on mount to prevent glitching/layout shifts
    const generatedStars = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: i % 2 === 0 ? `${Math.random() * 10}%` : `${90 + Math.random() * 10}%`,
      size: Math.random() * 15 + 10,
      duration: Math.random() * 2 + 3,
      delay: Math.random() * 5
    }));
    setStars(generatedStars);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-slate-50">
      {/* CSS Grain Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
      
      {/* Stable Animated Hearts */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0.1, 0.5, 0.1], 
            scale: [0.9, 1.1, 0.9],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute"
          style={{ top: star.top, left: star.left }}
        >
          <Heart size={star.size} fill="#ec4899" className="text-pink-400 blur-[0.5px]" />
        </motion.div>
      ))}
    </div>
  );
};
