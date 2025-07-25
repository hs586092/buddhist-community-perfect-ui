/**
 * Apple-style Button Component
 * Clean, minimal buttons with smooth interactions
 */

import React, { forwardRef, useState } from 'react'
import { cn } from '../../utils/cn'

interface AppleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const AppleButton = forwardRef<HTMLButtonElement, AppleButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    loading = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    className, 
    children, 
    disabled,
    onClick,
    ...props 
  }, ref) => {
    const [isPressed, setIsPressed] = useState(false)

    const variants = {
      primary: [
        'bg-blue-500 text-white',
        'hover:bg-blue-600',
        'active:bg-blue-700',
        'shadow-sm',
        'focus:ring-blue-500/50'
      ],
      secondary: [
        'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100',
        'hover:bg-gray-200 dark:hover:bg-gray-700',
        'active:bg-gray-300 dark:active:bg-gray-600',
        'border border-gray-200 dark:border-gray-700',
        'focus:ring-gray-500/50'
      ],
      ghost: [
        'bg-transparent text-gray-900 dark:text-gray-100',
        'hover:bg-gray-100 dark:hover:bg-gray-800',
        'active:bg-gray-200 dark:active:bg-gray-700',
        'focus:ring-gray-500/30'
      ],
      destructive: [
        'bg-red-500 text-white',
        'hover:bg-red-600',
        'active:bg-red-700',
        'shadow-sm',
        'focus:ring-red-500/50'
      ]
    }

    const sizes = {
      sm: 'px-3 py-2 text-sm rounded-lg min-h-[2.25rem]',
      md: 'px-4 py-2.5 text-base rounded-xl min-h-[2.75rem]',
      lg: 'px-6 py-3 text-lg rounded-xl min-h-[3.25rem]'
    }

    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center gap-2',
          'font-medium transition-all duration-200 ease-out',
          'focus:outline-none focus:ring-4',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transform active:scale-95',
          
          // Size
          sizes[size],
          
          // Variant
          variants[variant],
          
          // Width
          fullWidth && 'w-full',
          
          // Disabled state
          isDisabled && [
            '!transform-none !scale-100',
            'pointer-events-none'
          ],
          
          // Custom className
          className
        )}
        disabled={isDisabled}
        onClick={onClick}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        {...props}
      >
        {/* Loading Spinner */}
        {loading && (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        
        {/* Left Icon */}
        {!loading && leftIcon && <span>{leftIcon}</span>}
        
        {/* Content */}
        {children && <span>{children}</span>}
        
        {/* Right Icon */}
        {!loading && rightIcon && <span>{rightIcon}</span>}
      </button>
    )
  }
)

AppleButton.displayName = 'AppleButton'