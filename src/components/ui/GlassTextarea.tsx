import React, { forwardRef, useState, useId } from 'react';
import { cn } from '../../utils/cn';

interface GlassTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'glass' | 'filled' | 'outline' | 'minimal';
  textareaSize?: 'sm' | 'md' | 'lg';
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
  autoResize?: boolean;
  maxLength?: number;
  showCount?: boolean;
}

/**
 * GlassTextarea Component
 * 
 * Production-ready glassmorphism textarea with comprehensive features and accessibility.
 * 
 * Features:
 * - 4 visual variants (glass, filled, outline, minimal)
 * - 3 size options (sm, md, lg) with responsive design
 * - Advanced glassmorphism styling with backdrop blur
 * - Floating label animation with smooth transitions
 * - Auto-resize functionality for dynamic height
 * - Character count display with progress indication
 * - Error and helper text states with visual feedback
 * - Full accessibility compliance (WCAG 2.1 AA)
 * - Screen reader support with proper ARIA attributes
 * - Keyboard navigation and focus management
 * - Touch-friendly interaction targets
 * - Dark mode optimized with automatic adjustments
 * - Reduced motion support
 */
export const GlassTextarea = forwardRef<HTMLTextAreaElement, GlassTextareaProps>(
  ({
    className,
    label,
    error,
    helperText,
    variant = 'glass',
    textareaSize = 'md',
    resize = 'vertical',
    autoResize = false,
    maxLength,
    showCount = false,
    id,
    disabled,
    required,
    value,
    defaultValue,
    onFocus,
    onBlur,
    onChange,
    onInput,
    ...props
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(Boolean(value || defaultValue));
    const [charCount, setCharCount] = useState(
      (value?.toString().length || defaultValue?.toString().length || 0)
    );
    const generatedId = useId();
    
    const inputId = id || generatedId;
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText ? `${inputId}-helper` : undefined;
    const countId = showCount ? `${inputId}-count` : undefined;
    const descriptionIds = [errorId, helperId, countId].filter(Boolean).join(' ') || undefined;
    
    // Size configurations
    const sizeClasses = {
      sm: 'min-h-[80px] p-3 text-sm',
      md: 'min-h-[100px] p-4 text-sm',
      lg: 'min-h-[120px] p-4 text-base'
    };

    const labelPositions = {
      sm: { floating: 'top-1 text-xs', static: 'top-3' },
      md: { floating: 'top-1 text-xs', static: 'top-4' },
      lg: { floating: 'top-1 text-xs', static: 'top-4' }
    };
    
    const baseTextareaClasses = cn(
      // Base styling
      'w-full border transition-all duration-200 ease-out',
      'placeholder-transparent focus:placeholder-gray-400 dark:focus:placeholder-gray-500',
      'focus:outline-none focus:ring-2 focus:ring-offset-0',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'motion-reduce:transition-none',
      
      // Resize behavior
      resize === 'none' && 'resize-none',
      resize === 'both' && 'resize',
      resize === 'horizontal' && 'resize-x',
      resize === 'vertical' && 'resize-y',
      
      // Size
      sizeClasses[textareaSize]
    );
    
    const variantClasses = {
      glass: cn(
        // Glass effect from design system
        'bg-white/10 backdrop-blur-md border-white/20',
        'shadow-md shadow-black/5',
        'text-gray-900 dark:text-white',
        'focus:bg-white/15 focus:border-white/30 focus:ring-white/20',
        'dark:bg-black/20 dark:border-white/10',
        'dark:focus:bg-black/25 dark:focus:border-white/15 dark:focus:ring-white/10'
      ),
      filled: cn(
        'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700',
        'text-gray-900 dark:text-white',
        'focus:bg-white dark:focus:bg-gray-900 focus:border-primary-500 focus:ring-primary-500/20'
      ),
      outline: cn(
        'bg-transparent border-gray-300 dark:border-gray-600',
        'text-gray-900 dark:text-white',
        'focus:border-primary-500 focus:ring-primary-500/20'
      ),
      minimal: cn(
        'bg-transparent border-transparent border-b-gray-300 dark:border-b-gray-600',
        'rounded-none border-b-2',
        'text-gray-900 dark:text-white',
        'focus:border-b-primary-500 focus:ring-0'
      )
    };
    
    const containerClasses = 'relative w-full';
    
    const labelClasses = cn(
      'absolute px-1 transition-all duration-200 pointer-events-none',
      'text-gray-600 dark:text-gray-400',
      'bg-white/60 dark:bg-black/60 backdrop-blur-sm rounded',
      variant === 'minimal' && 'bg-transparent',
      
      // Position based on state and size
      (isFocused || hasValue) ? cn(
        labelPositions[textareaSize].floating,
        'left-3 transform -translate-y-1/2',
        'text-primary-600 dark:text-primary-400 font-medium'
      ) : cn(
        labelPositions[textareaSize].static,
        'left-4'
      ),
      
      // Error state
      error && (isFocused || hasValue) && 'text-red-600 dark:text-red-400'
    );

    // State-specific styling
    const stateClasses = cn(
      error && cn(
        'border-red-500 focus:border-red-500 focus:ring-red-500/20',
        variant === 'glass' && 'focus:bg-red-50/10 dark:focus:bg-red-900/10'
      )
    );
    
    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };
    
    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      setHasValue(Boolean(e.target.value));
      onBlur?.(e);
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setHasValue(Boolean(newValue));
      setCharCount(newValue.length);
      
      // Auto-resize functionality
      if (autoResize) {
        const textarea = e.target;
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
      }
      
      onChange?.(e);
    };

    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
      const newValue = (e.target as HTMLTextAreaElement).value;
      setCharCount(newValue.length);
      onInput?.(e);
    };

    // Character count progress calculation
    const charCountProgress = maxLength ? (charCount / maxLength) * 100 : 0;
    const isNearLimit = charCountProgress >= 80;
    const isAtLimit = charCountProgress >= 100;

    return (
      <div className="w-full">
        <div className={containerClasses}>
          <textarea
            ref={ref}
            id={inputId}
            value={value}
            defaultValue={defaultValue}
            className={cn(
              baseTextareaClasses,
              variantClasses[variant],
              stateClasses,
              className
            )}
            disabled={disabled}
            required={required}
            maxLength={maxLength}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            onInput={handleInput}
            aria-invalid={Boolean(error)}
            aria-describedby={descriptionIds}
            {...props}
          />
          
          {label && (
            <label
              htmlFor={inputId}
              className={labelClasses}
            >
              {label}
              {required && (
                <span className="text-red-500 ml-1" aria-label="required field">
                  *
                </span>
              )}
            </label>
          )}
        </div>
        
        {/* Footer section with character count and error/helper text */}
        <div className="flex justify-between items-start mt-1.5 gap-4">
          <div className="flex-1">
            {error && (
              <p
                id={errorId}
                className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                role="alert"
                aria-live="polite"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            )}
            
            {helperText && !error && (
              <p
                id={helperId}
                className="text-sm text-gray-600 dark:text-gray-400"
              >
                {helperText}
              </p>
            )}
          </div>

          {/* Character count */}
          {showCount && (
            <div className="flex-shrink-0">
              <span
                id={countId}
                className={cn(
                  'text-sm tabular-nums',
                  isAtLimit ? 'text-red-600 dark:text-red-400 font-medium' :
                  isNearLimit ? 'text-amber-600 dark:text-amber-400' :
                  'text-gray-500 dark:text-gray-400'
                )}
                aria-label={`${charCount} characters${maxLength ? ` of ${maxLength}` : ''}`}
              >
                {charCount}
                {maxLength && (
                  <>
                    <span className="text-gray-400 dark:text-gray-500">/</span>
                    {maxLength}
                  </>
                )}
              </span>
              
              {/* Progress bar for character limit */}
              {maxLength && (
                <div className="w-16 h-1 bg-gray-200 dark:bg-gray-700 rounded-full mt-1 overflow-hidden">
                  <div
                    className={cn(
                      'h-full transition-all duration-200 rounded-full',
                      isAtLimit ? 'bg-red-500' :
                      isNearLimit ? 'bg-amber-500' :
                      'bg-primary-500'
                    )}
                    style={{ width: `${Math.min(charCountProgress, 100)}%` }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);

GlassTextarea.displayName = 'GlassTextarea';