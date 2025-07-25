import React, { forwardRef, useState, useId } from 'react';
import { cn } from '../../utils/cn';

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | boolean | undefined;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'glass' | 'filled' | 'outline' | 'minimal';
  inputSize?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  success?: boolean;
  clearable?: boolean;
  onClear?: () => void;
  multiline?: boolean;
  rows?: number;
}

/**
 * GlassInput Component
 * 
 * Production-ready glassmorphism input field with comprehensive features and accessibility.
 * 
 * Features:
 * - 4 visual variants (glass, filled, outline, minimal)
 * - 3 size options (sm, md, lg) with responsive design
 * - Advanced glassmorphism styling with backdrop blur
 * - Floating label animation with smooth transitions
 * - Icon support with proper sizing (left/right positioning)
 * - Error, success, and loading states with visual feedback
 * - Clearable functionality with accessibility
 * - Enhanced error and helper text states
 * - Full accessibility compliance (WCAG 2.1 AA)
 * - Screen reader support with proper ARIA attributes
 * - Keyboard navigation and focus management
 * - Touch-friendly interaction targets
 * - Dark mode optimized with automatic adjustments
 * - Reduced motion support
 */
const GlassInput = forwardRef<HTMLInputElement | HTMLTextAreaElement, GlassInputProps>(
  (props, ref) => {
  const {
    className,
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    variant = 'glass',
    inputSize = 'md',
    loading = false,
    success = false,
    clearable = false,
    onClear,
    multiline = false,
    rows = 3,
    id,
    type = 'text',
    disabled,
    required,
    value,
    defaultValue,
    onFocus,
    onBlur,
    onChange,
    ...restProps
  } = props;
  
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(Boolean(value || defaultValue));
  const generatedId = useId();
    
  const inputId = id || generatedId;
  const hasError = Boolean(error);
  const errorMessage = typeof error === 'string' ? error : '';
  const errorId = hasError ? `${inputId}-error` : undefined;
  const helperId = helperText ? `${inputId}-helper` : undefined;
  const descriptionIds = [errorId, helperId].filter(Boolean).join(' ') || undefined;
    
  // Size configurations
  const sizeClasses = {
      sm: 'h-9 px-3 text-sm',
      md: 'h-11 px-4 text-sm',
      lg: 'h-12 px-4 text-base'
    };

  const iconSizes = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5', 
      lg: 'w-5 h-5'
    };

  const labelPositions = {
      sm: { floating: 'top-0.5 text-xs', static: 'top-2' },
      md: { floating: 'top-0.5 text-xs', static: 'top-2.5' },
      lg: { floating: 'top-1 text-xs', static: 'top-3' }
    };
    
  const baseInputClasses = cn(
    // Base styling
      'w-full border transition-all duration-200 ease-out',
      'placeholder-transparent focus:placeholder-gray-400 dark:focus:placeholder-gray-500',
      'focus:outline-none focus:ring-2 focus:ring-offset-0',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'motion-reduce:transition-none',
      
    // Size
      sizeClasses[inputSize],
      
    // Touch targets
      'min-h-[44px]'
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
        labelPositions[inputSize].floating,
        'left-3 transform -translate-y-1/2',
        'text-primary-600 dark:text-primary-400 font-medium'
      ) : cn(
        labelPositions[inputSize].static,
        'left-4'
      ),
      
    // Error state
      hasError && (isFocused || hasValue) && 'text-red-600 dark:text-red-400',
    // Success state  
      success && (isFocused || hasValue) && 'text-green-600 dark:text-green-400'
    );
    
  const iconClasses = cn(
      'absolute text-gray-400 dark:text-gray-500 pointer-events-none',
      iconSizes[inputSize]
    );

  // State-specific styling
  const stateClasses = cn(
      hasError && cn(
        'border-red-500 focus:border-red-500 focus:ring-red-500/20',
        variant === 'glass' && 'focus:bg-red-50/10 dark:focus:bg-red-900/10'
      ),
      success && !hasError && cn(
        'border-green-500 focus:border-green-500 focus:ring-green-500/20',
        variant === 'glass' && 'focus:bg-green-50/10 dark:focus:bg-green-900/10'
      ),
      loading && 'pr-10'
    );
    
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };
    
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(Boolean(e.target.value));
      onBlur?.(e);
    };
    
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(Boolean(e.target.value));
      onChange?.(e);
    };

  const handleClear = () => {
      setHasValue(false);
      onClear?.();
    const input = (ref as React.MutableRefObject<HTMLInputElement>)?.current;
      if (input) {
        input.value = '';
        input.focus();
      }
    };

  // Loading spinner component
  const LoadingSpinner = () => (
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
        <svg
          className={cn('animate-spin text-gray-400', iconSizes[inputSize])}
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    );

  // Success/Error icon
  const StatusIcon = () => {
      if (hasError) {
        return (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
            <svg className={iconSizes[inputSize]} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        );
      }
      if (success) {
        return (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
            <svg className={iconSizes[inputSize]} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        );
      }
      return null;
    };

  // Clear button
  const ClearButton = () => {
      if (!clearable || !hasValue || disabled || loading) return null;
      
      return (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
          aria-label="Clear input"
          tabIndex={-1}
        >
          <svg className={iconSizes[inputSize]} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      );
    };

    return (
      <div className="w-full">
        <div className={containerClasses}>
          {leftIcon && (
            <div className={cn(iconClasses, 'left-3 top-1/2 transform -translate-y-1/2')}>
              {leftIcon}
            </div>
          )}
          
          {multiline ? (
            <textarea
              ref={ref}
              id={inputId}
              value={value}
              defaultValue={defaultValue}
              rows={rows}
              className={cn(
                baseInputClasses,
                variantClasses[variant],
                stateClasses,
                leftIcon && 'pl-10',
                (rightIcon || clearable || success || hasError || loading) && 'pr-10',
                'resize-none min-h-[44px]',
                className
              )}
              disabled={disabled}
              required={required}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
              aria-invalid={hasError}
              aria-describedby={descriptionIds}
              {...restProps}
            />
          ) : (
            <input
              ref={ref}
              id={inputId}
              type={type}
              value={value}
              defaultValue={defaultValue}
              className={cn(
                baseInputClasses,
                variantClasses[variant],
                stateClasses,
                leftIcon && 'pl-10',
                (rightIcon || clearable || success || hasError || loading) && 'pr-10',
                className
              )}
              disabled={disabled}
              required={required}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
              aria-invalid={hasError}
              aria-describedby={descriptionIds}
              {...restProps}
            />
          )}
          
          {label && (
            <label
              htmlFor={inputId}
              className={cn(
                labelClasses,
                leftIcon && 'left-10'
              )}
            >
              {label}
              {required && (
                <span className="text-red-500 ml-1" aria-label="required field">
                  *
                </span>
              )}
            </label>
          )}
          
          {rightIcon && !loading && !success && !hasError && !clearable && (
            <div className={cn(iconClasses, 'right-3 top-1/2 transform -translate-y-1/2')}>
              {rightIcon}
            </div>
          )}

          {loading && <LoadingSpinner />}
          {!loading && (success || hasError) && <StatusIcon />}
          {!loading && !success && !hasError && <ClearButton />}
        </div>
        
        {hasError && errorMessage && (
          <p
            id={errorId}
            className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
            role="alert"
            aria-live="polite"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errorMessage}
          </p>
        )}
        
        {helperText && !hasError && (
          <p
            id={helperId}
            className="mt-1.5 text-sm text-gray-600 dark:text-gray-400"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

GlassInput.displayName = 'GlassInput';

export { GlassInput };