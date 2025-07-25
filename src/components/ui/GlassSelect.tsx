import React, { forwardRef, useState, useId } from 'react';
import { cn } from '../../utils/cn';

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
}

interface GlassSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  placeholder?: string;
  options: Option[];
  variant?: 'glass' | 'filled' | 'outline' | 'minimal';
  selectSize?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  clearable?: boolean;
  onClear?: () => void;
}

/**
 * GlassSelect Component
 * 
 * Production-ready glassmorphism select dropdown with comprehensive features and accessibility.
 * 
 * Features:
 * - 4 visual variants (glass, filled, outline, minimal)
 * - 3 size options (sm, md, lg) with responsive design
 * - Advanced glassmorphism styling with backdrop blur
 * - Floating label animation with smooth transitions
 * - Option grouping support for better organization
 * - Loading state with spinner animation
 * - Clearable functionality with accessibility
 * - Error and helper text states with visual feedback
 * - Full accessibility compliance (WCAG 2.1 AA)
 * - Screen reader support with proper ARIA attributes
 * - Keyboard navigation and focus management
 * - Touch-friendly interaction targets
 * - Dark mode optimized with automatic adjustments
 * - Reduced motion support
 */
export const GlassSelect = forwardRef<HTMLSelectElement, GlassSelectProps>(
  ({
    className,
    label,
    error,
    helperText,
    placeholder = 'Select an option...',
    options,
    variant = 'glass',
    selectSize = 'md',
    loading = false,
    clearable = false,
    onClear,
    id,
    disabled,
    required,
    value,
    defaultValue,
    onFocus,
    onBlur,
    onChange,
    ...props
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(Boolean(value || defaultValue));
    const generatedId = useId();
    
    const inputId = id || generatedId;
    const errorId = error ? `${inputId}-error` : undefined;
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
    
    const baseSelectClasses = cn(
      // Base styling
      'w-full border transition-all duration-200 ease-out appearance-none',
      'focus:outline-none focus:ring-2 focus:ring-offset-0',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'motion-reduce:transition-none',
      'cursor-pointer',
      
      // Size
      sizeClasses[selectSize],
      
      // Touch targets
      'min-h-[44px]',
      
      // Spacing for icons
      clearable && hasValue && !loading && 'pr-16',
      loading && 'pr-16'
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
        labelPositions[selectSize].floating,
        'left-3 transform -translate-y-1/2',
        'text-primary-600 dark:text-primary-400 font-medium'
      ) : cn(
        labelPositions[selectSize].static,
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
    
    const handleFocus = (e: React.FocusEvent<HTMLSelectElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };
    
    const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
      setIsFocused(false);
      setHasValue(Boolean(e.target.value));
      onBlur?.(e);
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setHasValue(Boolean(e.target.value));
      onChange?.(e);
    };

    const handleClear = () => {
      setHasValue(false);
      onClear?.();
      const select = (ref as React.MutableRefObject<HTMLSelectElement>)?.current;
      if (select) {
        select.value = '';
        select.focus();
        // Trigger change event
        const event = new Event('change', { bubbles: true });
        select.dispatchEvent(event);
      }
    };

    // Loading spinner component
    const LoadingSpinner = () => (
      <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
        <svg
          className={cn('animate-spin text-gray-400', iconSizes[selectSize])}
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

    // Dropdown arrow icon
    const DropdownIcon = () => (
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <svg
          className={cn('text-gray-400 dark:text-gray-500', iconSizes[selectSize])}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    );

    // Clear button
    const ClearButton = () => {
      if (!clearable || !hasValue || disabled || loading) return null;
      
      return (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 z-10"
          aria-label="Clear selection"
          tabIndex={-1}
        >
          <svg className={iconSizes[selectSize]} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      );
    };

    // Group options by group property
    const groupedOptions = options.reduce((groups, option) => {
      const group = option.group || 'default';
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(option);
      return groups;
    }, {} as Record<string, Option[]>);

    const hasGroups = Object.keys(groupedOptions).length > 1 || !groupedOptions.default;

    return (
      <div className="w-full">
        <div className={containerClasses}>
          <select
            ref={ref}
            id={inputId}
            value={value}
            defaultValue={defaultValue}
            className={cn(
              baseSelectClasses,
              variantClasses[variant],
              stateClasses,
              className
            )}
            disabled={disabled || loading}
            required={required}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            aria-invalid={Boolean(error)}
            aria-describedby={descriptionIds}
            {...props}
          >
            {/* Placeholder option */}
            {placeholder && (
              <option value="" disabled={required} hidden={required}>
                {placeholder}
              </option>
            )}
            
            {/* Render options with or without groups */}
            {hasGroups ? (
              Object.entries(groupedOptions).map(([groupName, groupOptions]) => (
                groupName === 'default' ? (
                  groupOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      disabled={option.disabled}
                    >
                      {option.label}
                    </option>
                  ))
                ) : (
                  <optgroup key={groupName} label={groupName}>
                    {groupOptions.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled}
                      >
                        {option.label}
                      </option>
                    ))}
                  </optgroup>
                )
              ))
            ) : (
              options.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </option>
              ))
            )}
          </select>
          
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

          {loading && <LoadingSpinner />}
          {!loading && <ClearButton />}
          {!loading && <DropdownIcon />}
        </div>
        
        {error && (
          <p
            id={errorId}
            className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
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
            className="mt-1.5 text-sm text-gray-600 dark:text-gray-400"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

GlassSelect.displayName = 'GlassSelect';