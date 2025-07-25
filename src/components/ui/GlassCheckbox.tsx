/**
 * GlassCheckbox Component
 * 
 * Glassmorphism-styled checkbox input with enhanced UX features.
 */

import React, { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface GlassCheckboxProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: ReactNode | string;
  description?: string;
  disabled?: boolean;
  error?: boolean;
  className?: string;
}

/**
 * Enhanced Glassmorphism Checkbox
 * 
 * Features:
 * - Accessible checkbox with proper ARIA support
 * - Smooth animations and hover states
 * - Error state styling
 * - Rich label support with descriptions
 * - Keyboard navigation support
 * - Focus management
 */
export const GlassCheckbox: React.FC<GlassCheckboxProps> = ({
  id,
  checked,
  onChange,
  label,
  description,
  disabled = false,
  error = false,
  className,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (!disabled) {
        onChange(!checked);
      }
    }
  };

  return (
    <div className={cn('flex items-start gap-3', className)}>
      <div className="relative flex-shrink-0">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div
          role="checkbox"
          aria-checked={checked}
          aria-labelledby={`${id}-label`}
          aria-describedby={description ? `${id}-description` : undefined}
          tabIndex={disabled ? -1 : 0}
          onKeyDown={handleKeyDown}
          onClick={() => !disabled && onChange(!checked)}
          className={cn(
            'w-5 h-5 rounded border-2 cursor-pointer transition-all duration-200',
            'flex items-center justify-center',
            'bg-white/50 backdrop-blur-sm',
            'hover:bg-white/70',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
            
            // Checked state
            checked && [
              'bg-indigo-600 border-indigo-600',
              'hover:bg-indigo-700 hover:border-indigo-700',
            ],
            
            // Error state
            error && !checked && [
              'border-red-500',
              'hover:border-red-600',
            ],
            
            // Disabled state
            disabled && [
              'opacity-50 cursor-not-allowed',
              'hover:bg-white/50',
            ],
            
            // Normal state
            !checked && !error && [
              'border-gray-300 dark:border-gray-600',
              'hover:border-gray-400 dark:hover:border-gray-500',
            ]
          )}
        >
          {checked && (
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
      </div>

      {(label || description) && (
        <div className="flex-1 min-w-0">
          {label && (
            <label
              id={`${id}-label`}
              htmlFor={id}
              className={cn(
                'block text-sm font-medium cursor-pointer transition-colors duration-200',
                disabled 
                  ? 'text-gray-400 dark:text-gray-600' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              )}
            >
              {label}
            </label>
          )}
          
          {description && (
            <p 
              id={`${id}-description`}
              className={cn(
                'mt-1 text-xs transition-colors duration-200',
                disabled 
                  ? 'text-gray-400 dark:text-gray-600' 
                  : 'text-gray-500 dark:text-gray-400'
              )}
            >
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
};