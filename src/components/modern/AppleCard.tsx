/**
 * Apple-style Card Component
 * Minimalist, clean, elegant interface with subtle interactions
 */

import React, { forwardRef } from 'react'
import { cn } from '../../utils/cn'

interface AppleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'glass'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  hover?: boolean
  children: React.ReactNode
}

export const AppleCard = forwardRef<HTMLDivElement, AppleCardProps>(
  ({ variant = 'default', size = 'md', hover = true, className, children, ...props }, ref) => {
    const variants = {
      default: [
        'bg-white dark:bg-black',
        'border border-gray-200 dark:border-gray-800',
        'shadow-sm dark:shadow-none'
      ],
      elevated: [
        'bg-white dark:bg-zinc-900',
        'shadow-xl shadow-gray-200/50 dark:shadow-black/50',
        'border-0'
      ],
      outlined: [
        'bg-white dark:bg-black',
        'border border-gray-300 dark:border-gray-700',
        'shadow-none'
      ],
      glass: [
        'bg-white/80 dark:bg-black/80',
        'backdrop-blur-xl backdrop-saturate-150',
        'border border-gray-200/50 dark:border-gray-800/50',
        'shadow-lg shadow-gray-200/20 dark:shadow-black/20'
      ]
    }

    const sizes = {
      sm: 'p-4 rounded-lg',
      md: 'p-6 rounded-xl',
      lg: 'p-8 rounded-2xl',
      xl: 'p-10 rounded-3xl'
    }

    const hoverEffects = hover ? [
      'transition-all duration-300 ease-out',
      'hover:scale-[1.01]',
      variant === 'elevated' && 'hover:shadow-2xl hover:shadow-gray-200/60 dark:hover:shadow-black/60',
      variant !== 'elevated' && 'hover:shadow-md dark:hover:shadow-none',
      'hover:-translate-y-0.5'
    ].filter(Boolean) : []

    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          'relative overflow-hidden',
          // Variant styles
          variants[variant],
          // Size styles
          sizes[size],
          // Hover effects
          hoverEffects,
          // Custom className
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

AppleCard.displayName = 'AppleCard'