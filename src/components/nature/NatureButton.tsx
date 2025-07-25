/**
 * Nature Theme Button Component
 * 자연스러운 버튼 - 나무, 잎사귀 테마
 */

import React, { forwardRef } from 'react'
import { cn } from '../../utils/cn'

interface NatureButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'leaf' | 'wood' | 'stone' | 'earth'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
}

export const NatureButton = forwardRef<HTMLButtonElement, NatureButtonProps>(
  ({ 
    variant = 'leaf', 
    size = 'md', 
    loading = false,
    fullWidth = false,
    className, 
    children, 
    disabled,
    ...props 
  }, ref) => {
    const variants = {
      leaf: [
        'bg-gradient-to-r from-green-500 to-emerald-600',
        'text-white font-medium',
        'shadow-lg shadow-green-500/30',
        'hover:from-green-600 hover:to-emerald-700',
        'hover:shadow-xl hover:shadow-green-500/40',
        'active:from-green-700 active:to-emerald-800',
        'focus:ring-4 focus:ring-green-500/30'
      ],
      wood: [
        'bg-gradient-to-r from-amber-500 to-orange-600',
        'text-white font-medium', 
        'shadow-lg shadow-amber-500/30',
        'hover:from-amber-600 hover:to-orange-700',
        'hover:shadow-xl hover:shadow-amber-500/40',
        'active:from-amber-700 active:to-orange-800',
        'focus:ring-4 focus:ring-amber-500/30'
      ],
      stone: [
        'bg-gradient-to-r from-slate-500 to-gray-600',
        'text-white font-medium',
        'shadow-lg shadow-slate-500/30', 
        'hover:from-slate-600 hover:to-gray-700',
        'hover:shadow-xl hover:shadow-slate-500/40',
        'active:from-slate-700 active:to-gray-800',
        'focus:ring-4 focus:ring-slate-500/30'
      ],
      earth: [
        'bg-gradient-to-r from-yellow-600 to-amber-700',
        'text-white font-medium',
        'shadow-lg shadow-yellow-500/30',
        'hover:from-yellow-700 hover:to-amber-800', 
        'hover:shadow-xl hover:shadow-yellow-500/40',
        'active:from-yellow-800 active:to-amber-900',
        'focus:ring-4 focus:ring-yellow-500/30'
      ]
    }

    const sizes = {
      sm: 'px-4 py-2 text-sm rounded-lg min-h-[2.25rem]',
      md: 'px-6 py-3 text-base rounded-xl min-h-[2.75rem]', 
      lg: 'px-8 py-4 text-lg rounded-2xl min-h-[3.25rem]'
    }

    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center',
          'transition-all duration-200 ease-out',
          'focus:outline-none',
          'hover:scale-105 active:scale-95',
          
          // Size
          sizes[size],
          
          // Variant
          variants[variant],
          
          // Width
          fullWidth && 'w-full',
          
          // Disabled state
          isDisabled && [
            'opacity-50 cursor-not-allowed',
            '!transform-none !scale-100'
          ],
          
          // Custom className
          className
        )}
        disabled={isDisabled}
        {...props}
      >
        {/* Loading Spinner */}
        {loading && (
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
        )}
        
        {children}
      </button>
    )
  }
)

NatureButton.displayName = 'NatureButton'