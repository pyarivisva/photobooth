import { motion, AnimatePresence } from 'framer-motion';

export const FlashEffect = ({ isVisible }) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-white z-100"
      />
    )}
  </AnimatePresence>
);