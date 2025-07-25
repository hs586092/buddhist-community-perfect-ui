/**
 * Modern Button Component - 2025 Design System
 * Features: Morphing states, haptic feedback, accessibility-first, micro-interactions
 */

import React, { forwardRef, useState } from 'react'
import { cn } from '../../utils/cn'

interface ModernButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'gradient' | 'glass'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
  morphing?: boolean // 2025 trend: morphing button states
  haptic?: boolean // 2025 trend: haptic-like visual feedback
}

export const ModernButton = forwardRef<HTMLButtonElement, ModernButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    loading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    morphing = true,
    haptic = true,
    className, 
    children, 
    disabled,
    onClick,
    ...props 
  }, ref) => {
    const [isPressed, setIsPressed] = useState(false)
    const [ripples, setRipples] = useState<Array<{id: number, x: number, y: number}>>([])

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) return

      // Haptic-like ripple effect
      if (haptic) {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const newRipple = { id: Date.now(), x, y }
        
        setRipples(prev => [...prev, newRipple])
        setTimeout(() => {
          setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
        }, 600)
      }

      onClick?.(e)
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-sm rounded-lg min-h-[2.25rem]',
      md: 'px-6 py-3 text-base rounded-xl min-h-[2.75rem]',
      lg: 'px-8 py-4 text-lg rounded-2xl min-h-[3.25rem]',
      xl: 'px-10 py-5 text-xl rounded-3xl min-h-[3.75rem]'
    }

    const variants = {
      primary: [
        'bg-gradient-to-r from-blue-600 to-blue-700',
        'text-white font-medium',
        'shadow-lg shadow-blue-500/25',
        'hover:from-blue-700 hover:to-blue-800',
        'hover:shadow-xl hover:shadow-blue-500/40',
        'active:from-blue-800 active:to-blue-900',
        morphing && 'hover:scale-105 active:scale-95',
        'focus:ring-4 focus:ring-blue-500/30'
      ],
      secondary: [
        'bg-gradient-to-r from-gray-100 to-gray-200',
        'dark:from-gray-700 dark:to-gray-800',
        'text-gray-900 dark:text-gray-100 font-medium',
        'shadow-lg shadow-gray-500/10',
        'hover:from-gray-200 hover:to-gray-300',
        'dark:hover:from-gray-600 dark:hover:to-gray-700',
        morphing && 'hover:scale-105 active:scale-95',
        'focus:ring-4 focus:ring-gray-500/30'
      ],
      ghost: [
        'bg-transparent',
        'text-gray-700 dark:text-gray-300 font-medium',
        'hover:bg-gray-100/80 dark:hover:bg-gray-800/80',
        morphing && 'hover:scale-105 active:scale-95',
        'focus:ring-4 focus:ring-gray-500/20'
      ],
      outline: [
        'bg-transparent',
        'border-2 border-gray-300 dark:border-gray-600',
        'text-gray-700 dark:text-gray-300 font-medium',
        'hover:border-gray-400 dark:hover:border-gray-500',
        'hover:bg-gray-50/50 dark:hover:bg-gray-800/50',
        morphing && 'hover:scale-105 active:scale-95',
        'focus:ring-4 focus:ring-gray-500/20'
      ],
      gradient: [
        'bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600',
        'text-white font-medium',
        'shadow-lg shadow-violet-500/25',
        'hover:from-violet-700 hover:via-blue-700 hover:to-cyan-700',
        'hover:shadow-xl hover:shadow-violet-500/40',
        morphing && 'hover:scale-105 active:scale-95',
        'focus:ring-4 focus:ring-violet-500/30',
        'animate-gradient-x bg-[length:200%_200%]'
      ],
      glass: [
        'bg-white/10 dark:bg-black/10',
        'backdrop-blur-xl backdrop-saturate-150',
        'border border-white/20 dark:border-white/10',
        'text-gray-900 dark:text-gray-100 font-medium',
        'shadow-2xl shadow-black/10',
        'hover:bg-white/20 dark:hover:bg-black/20',
        'hover:border-white/30 dark:hover:border-white/20',
        morphing && 'hover:scale-105 active:scale-95',
        'focus:ring-4 focus:ring-blue-500/20'
      ]
    }

    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          'relative inline-flex items-center justify-center',
          'font-medium transition-all duration-300 ease-out',
          'focus:outline-none focus-visible:ring-4',
          'overflow-hidden',
          
          // Size
          sizes[size],
          
          // Variant
          variants[variant].filter(Boolean),
          
          // Width
          fullWidth && 'w-full',
          
          // Disabled state
          isDisabled && [
            'opacity-50 cursor-not-allowed',
            '!transform-none !scale-100'
          ],

          // Morphing pressed state
          morphing && isPressed && !isDisabled && 'scale-95',
          
          // Custom className
          className
        )}
        disabled={isDisabled}
        onClick={handleClick}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        {...props}
      >
        {/* Haptic Ripple Effects */}
        {haptic && ripples.map(ripple => (
          <span
            key={ripple.id}
            className="absolute inset-0 pointer-events-none"
            style={{
              left: ripple.x - 20,
              top: ripple.y - 20,
              width: 40,
              height: 40,
            }}
          >
            <span className="block w-full h-full bg-white/30 rounded-full animate-ping" />
          </span>
        ))}

        {/* Loading Spinner */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Content */}
        <div className={cn(
          'flex items-center justify-center gap-2 transition-opacity duration-200',
          loading && 'opacity-0'
        )}>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          {children && <span>{children}</span>}
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </div>

        {/* Gradient animation overlay for gradient variant */}
        {variant === 'gradient' && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
        )}
      </button>
    )
  }
)

ModernButton.displayName = 'ModernButton'