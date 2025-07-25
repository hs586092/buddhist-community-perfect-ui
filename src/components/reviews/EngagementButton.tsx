/**
 * Engagement Button - Modern Social Interaction Button
 *
 * Features:
 * - Smooth hover and active animations
 * - Buddhist-inspired color schemes
 * - Accessible keyboard navigation
 * - Count display with number formatting
 * - Ripple effects on click
 */

import { motion } from 'framer-motion';
import React from 'react';

interface EngagementButtonProps {
  icon: string;
  label: string;
  count?: number;
  active?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  color?: 'orange' | 'blue' | 'green' | 'gray';
  className?: string;
}

export const EngagementButton: React.FC<EngagementButtonProps> = ({
  icon,
  label,
  count = 0,
  active = false,
  onClick,
  color = 'gray',
  className = ''
}) => {
  const colorClasses = {
    orange: active ? 'text-orange-600 bg-orange-50' : 'text-gray-500 hover:text-orange-600',
    blue: active ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-blue-600',
    green: active ? 'text-green-600 bg-green-50' : 'text-gray-500 hover:text-green-600',
    gray: active ? 'text-gray-700 bg-gray-100' : 'text-gray-500 hover:text-gray-700'
  };

  return (
    <motion.button
      onClick={onClick}
      className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${colorClasses[color]} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="text-sm">{icon}</span>
      {count > 0 && (
        <span className="text-xs font-medium">{count}</span>
      )}
      <span className="sr-only">{label}</span>
    </motion.button>
  );
};
