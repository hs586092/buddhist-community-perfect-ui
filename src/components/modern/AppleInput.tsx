/**
 * Apple-style Input Component
 * Clean, minimal input fields with subtle focus states
 */

import React, { useState, useId, forwardRef } from 'react'
import { cn } from '../../utils/cn'

interface AppleInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>, 'size'> {
  label?: string
  helperText?: string
  error?: string
  size?: 'sm' | 'md' | 'lg'
  multiline?: boolean
  rows?: number
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const AppleInput = forwardRef<HTMLInputElement | HTMLTextAreaElement, AppleInputProps>(
  ({ 
    label, 
    helperText, 
    error, 
    size = 'md', 
    multiline = false,
    rows = 4,
    leftIcon,
    rightIcon,
    className, 
    id,
    onFocus,
    onBlur,
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false)
    const generatedId = useId()
    const inputId = id || generatedId

    const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setIsFocused(true)
      onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setIsFocused(false)
      onBlur?.(e)
    }

    const sizes = {
      sm: {
        input: 'px-3 py-2 text-sm',
        icon: 'w-4 h-4'
      },
      md: {
        input: 'px-4 py-3 text-base',
        icon: 'w-5 h-5'
      },
      lg: {
        input: 'px-5 py-4 text-lg',
        icon: 'w-6 h-6'
      }
    }

    const InputComponent = multiline ? 'textarea' : 'input'
    const currentSize = sizes[size]

    return (
      <div className="space-y-2">
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block text-sm font-medium transition-colors duration-200',
              'text-gray-900 dark:text-gray-100',
              isFocused && 'text-blue-600 dark:text-blue-400'
            )}
          >
            {label}
          </label>
        )}
        
        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className={cn(
              'absolute left-3 top-1/2 -translate-y-1/2 z-10',
              'text-gray-400 dark:text-gray-500',
              isFocused && 'text-blue-500 dark:text-blue-400',
              currentSize.icon
            )}>
              {leftIcon}
            </div>
          )}

          {/* Input Field */}
          <InputComponent
            ref={ref as any}
            id={inputId}
            className={cn(
              'w-full rounded-xl border transition-all duration-200 ease-out',
              'bg-gray-50 dark:bg-gray-900',
              'border-gray-200 dark:border-gray-700',
              'text-gray-900 dark:text-gray-100',
              'placeholder:text-gray-500 dark:placeholder:text-gray-400',
              'focus:outline-none focus:ring-0',
              'focus:border-blue-500 dark:focus:border-blue-400',
              'focus:bg-white dark:focus:bg-black',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error && '!border-red-500 dark:!border-red-400 !bg-red-50 dark:!bg-red-950/20',
              // Size styles
              currentSize.input,
              // Icon padding
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              // Multiline styles
              multiline && 'resize-none',
              className
            )}
            onFocus={handleFocus}
            onBlur={handleBlur}
            rows={multiline ? rows : undefined}
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && (
            <div className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2 z-10',
              'text-gray-400 dark:text-gray-500',
              isFocused && 'text-blue-500 dark:text-blue-400',
              currentSize.icon
            )}>
              {rightIcon}
            </div>
          )}

          {/* Focus Ring */}
          {isFocused && (
            <div className="absolute inset-0 rounded-xl ring-4 ring-blue-500/20 dark:ring-blue-400/20 pointer-events-none" />
          )}
        </div>

        {/* Helper Text / Error */}
        {(helperText || error) && (
          <p className={cn(
            'text-sm',
            error 
              ? 'text-red-600 dark:text-red-400' 
              : 'text-gray-600 dark:text-gray-400'
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)

AppleInput.displayName = 'AppleInput'