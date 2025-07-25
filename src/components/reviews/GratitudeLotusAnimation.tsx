/**
 * Gratitude Lotus Animation - Falling Lotus Petals
 *
 * Beautiful animation triggered when users show gratitude
 * Features floating lotus petals with physics-based motion
 */

import { motion } from 'framer-motion';
import React, { useEffect } from 'react';

interface GratitudeLotusAnimationProps {
  onComplete?: () => void;
}

export const GratitudeLotusAnimation: React.FC<GratitudeLotusAnimationProps> = ({ onComplete }) => {
  useEffect(() => {
    if (onComplete) {
      const timer = setTimeout(onComplete, 2000);
      return () => clearTimeout(timer);
    }
  }, [onComplete]);

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.5 }}
        className="text-4xl"
      >
        🪷
      </motion.div>
    </div>
  );
};
