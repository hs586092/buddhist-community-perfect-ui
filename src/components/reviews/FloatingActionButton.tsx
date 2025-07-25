import { motion } from 'framer-motion';
import React from 'react';

interface FloatingActionButtonProps {
  onClick?: () => void;
  icon?: string;
  label?: string;
  className?: string;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onClick,
  icon = '✍️',
  label = 'Action',
  className = ''
}) => {
  return (
    <motion.button
      onClick={onClick}
      className={`bg-amber-500 hover:bg-amber-600 text-white rounded-full p-4 shadow-lg ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={label}
    >
      <span className="text-xl">{icon}</span>
    </motion.button>
  );
};
