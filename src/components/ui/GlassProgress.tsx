/**
 * GlassProgress Component
 * 
 * Glassmorphism-styled progress bar with smooth animations.
 */

import React from 'react';
import { cn } from '../../utils/cn';

interface GlassProgressProps {
  value: number; // 0-100
  max?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  animated?: boolean;
}

/**
 * Enhanced Glassmorphism Progress Bar
 * 
 * Features:
 * - Smooth progress animations
 * - Multiple size variants
 * - Color variants for different states
 * - Optional percentage label
 * - Accessibility support with ARIA
 * - Glassmorphism visual style
 */
export const GlassProgress: React.FC<GlassProgressProps> = ({
  value,
  max = 100,
  className,
  size = 'md',
  variant = 'default',
  showLabel = false,
  animated = true,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const variantClasses = {
    default: 'from-indigo-500 to-purple-500',
    success: 'from-green-500 to-emerald-500',
    warning: 'from-yellow-500 to-orange-500',
    error: 'from-red-500 to-rose-500',
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between mb-1">
        {showLabel && (
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {Math.round(percentage)}%
          </span>
        )}
      </div>
      
      <div
        className={cn(
          'w-full bg-white/30 backdrop-blur-sm rounded-full overflow-hidden',
          'border border-white/20 dark:border-white/10',
          'shadow-inner',
          sizeClasses[size]
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={`Progress: ${Math.round(percentage)}%`}
      >
        <div
          className={cn(
            'h-full rounded-full bg-gradient-to-r shadow-sm',
            'transition-all duration-500 ease-out',
            variantClasses[variant],
            animated && 'animate-pulse'
          )}
          style={{ width: `${percentage}%` }}
        >
          {/* Shimmer effect */}
          <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>
      </div>
    </div>
  );
};

// Add shimmer animation to globals if needed
declare global {
  namespace JSX {
    interface IntrinsicElements {
      style: React.DetailedHTMLProps<React.StyleHTMLAttributes<HTMLStyleElement>, HTMLStyleElement>;
    }
  }
}