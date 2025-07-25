/**
 * Modern Input Component - 2025 Design System
 * Features: Floating labels, micro-interactions, accessibility-first, fluid animations
 */

import React, { useState, useId, forwardRef } from 'react'
import { cn } from '../../utils/cn'

interface ModernInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>, 'size'> {
  label?: string
  helperText?: string
  error?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  variant?: 'floating' | 'filled' | 'outlined'
  multiline?: boolean
  rows?: number
}

export const ModernInput = forwardRef<HTMLInputElement | HTMLTextAreaElement, ModernInputProps>(
  ({ 
    label, 
    helperText, 
    error, 
    leftIcon, 
    rightIcon, 
    size = 'md', 
    variant = 'floating', 
    multiline = false,
    rows = 4,
    className, 
    id,
    value,
    defaultValue,
    onFocus,
    onBlur,
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false)
    const [hasValue, setHasValue] = useState(Boolean(value || defaultValue))
    const generatedId = useId()
    const inputId = id || generatedId

    const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setIsFocused(true)
      onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setIsFocused(false)
      setHasValue(Boolean(e.target.value))
      onBlur?.(e)
    }

    const sizes = {
      sm: {
        container: 'h-12',
        input: 'px-3 py-3 text-sm',
        label: 'text-xs',
        icon: 'w-4 h-4'
      },
      md: {
        container: 'h-14',
        input: 'px-4 py-4 text-base',
        label: 'text-sm',
        icon: 'w-5 h-5'
      },
      lg: {
        container: 'h-16',
        input: 'px-5 py-5 text-lg',
        label: 'text-base',
        icon: 'w-6 h-6'
      }
    }

    const variants = {
      floating: {
        container: [
          'relative',
          'bg-white/5 dark:bg-black/5',
          'border border-gray-200/30 dark:border-gray-700/30',
          'rounded-2xl',
          'backdrop-blur-sm',
          'transition-all duration-300 ease-out',
          isFocused && 'border-blue-400/50 dark:border-blue-500/50 shadow-[0_0_0_3px_rgba(59,130,246,0.1)]',
          error && '!border-red-400/50 dark:!border-red-500/50 !shadow-[0_0_0_3px_rgba(239,68,68,0.1)]'
        ],
        input: [
          'w-full bg-transparent',
          'outline-none border-none',
          'text-gray-900 dark:text-gray-100',
          'placeholder:text-transparent',
          leftIcon && 'pl-10',
          rightIcon && 'pr-10'
        ],
        label: [
          'absolute left-4 transition-all duration-300 ease-out pointer-events-none',
          'text-gray-500 dark:text-gray-400',
          (isFocused || hasValue) 
            ? '-top-2 text-xs bg-white/80 dark:bg-gray-900/80 px-2 rounded-full backdrop-blur-sm text-blue-600 dark:text-blue-400'
            : 'top-1/2 -translate-y-1/2 text-base',
          leftIcon && (isFocused || hasValue) ? 'left-4' : 'left-10'
        ]
      },
      filled: {
        container: [
          'relative',
          'bg-gray-100/80 dark:bg-gray-800/80',
          'rounded-2xl',
          'transition-all duration-300 ease-out',
          isFocused && 'bg-gray-100 dark:bg-gray-800 shadow-inner',
          error && '!bg-red-50/80 dark:!bg-red-900/20'
        ],
        input: [
          'w-full bg-transparent',
          'outline-none border-none',
          'text-gray-900 dark:text-gray-100',
          leftIcon && 'pl-10',
          rightIcon && 'pr-10'
        ],
        label: [
          'absolute left-4 top-2 text-xs',
          'text-gray-500 dark:text-gray-400',
          'transition-colors duration-300',
          isFocused && 'text-blue-600 dark:text-blue-400'
        ]
      },
      outlined: {
        container: [
          'relative',
          'bg-transparent',
          'border-2 border-gray-200 dark:border-gray-700',
          'rounded-2xl',
          'transition-all duration-300 ease-out',
          isFocused && 'border-blue-500 dark:border-blue-400',
          error && '!border-red-500 dark:!border-red-400'
        ],
        input: [
          'w-full bg-transparent',
          'outline-none border-none',
          'text-gray-900 dark:text-gray-100',
          leftIcon && 'pl-10',
          rightIcon && 'pr-10'
        ],
        label: [
          'absolute transition-all duration-300 ease-out pointer-events-none',
          'text-gray-500 dark:text-gray-400',
          (isFocused || hasValue)
            ? '-top-3 left-3 text-xs bg-white dark:bg-gray-900 px-2 text-blue-600 dark:text-blue-400'
            : 'top-1/2 left-4 -translate-y-1/2 text-base',
          leftIcon && !isFocused && !hasValue && 'left-10'
        ]
      }
    }

    const currentVariant = variants[variant]
    const currentSize = sizes[size]

    const InputComponent = multiline ? 'textarea' : 'input'

    return (
      <div className="space-y-2">
        <div 
          className={cn(
            currentSize.container,
            currentVariant.container,
            className
          )}
        >
          {/* Left Icon */}
          {leftIcon && (
            <div className={cn(
              'absolute left-3 top-1/2 -translate-y-1/2 z-20',
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
              currentSize.input,
              currentVariant.input,
              multiline && 'resize-none py-4 leading-relaxed'
            )}
            onFocus={handleFocus}
            onBlur={handleBlur}
            value={value}
            defaultValue={defaultValue}
            rows={multiline ? rows : undefined}
            {...props}
          />

          {/* Floating Label */}
          {label && (
            <label
              htmlFor={inputId}
              className={cn(
                currentSize.label,
                currentVariant.label
              )}
            >
              {label}
            </label>
          )}

          {/* Right Icon */}
          {rightIcon && (
            <div className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2 z-20',
              'text-gray-400 dark:text-gray-500',
              isFocused && 'text-blue-500 dark:text-blue-400',
              currentSize.icon
            )}>
              {rightIcon}
            </div>
          )}

          {/* Focus Ring */}
          <div className={cn(
            'absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300',
            'bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10',
            isFocused && 'opacity-100'
          )} />
        </div>

        {/* Helper Text / Error */}
        {(helperText || error) && (
          <div className={cn(
            'text-sm px-1 transition-colors duration-300',
            error ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
          )}>
            {error || helperText}
          </div>
        )}
      </div>
    )
  }
)

ModernInput.displayName = 'ModernInput'