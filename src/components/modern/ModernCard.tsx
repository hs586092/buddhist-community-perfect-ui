/**
 * Modern Card Component - 2025 Design Trends
 * Features: Neumorphism + Glassmorphism hybrid, subtle animations, accessibility-first
 */

import React, { forwardRef } from 'react'
import { cn } from '../../utils/cn'

interface ModernCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'neumorphic' | 'flat' | 'elevated'
  size?: 'sm' | 'md' | 'lg'
  glow?: boolean
  hover?: boolean
  children: React.ReactNode
}

export const ModernCard = forwardRef<HTMLDivElement, ModernCardProps>(
  ({ variant = 'glass', size = 'md', glow = false, hover = true, className, children, ...props }, ref) => {
    const variants = {
      glass: [
        'bg-white/[0.02] dark:bg-black/[0.02]',
        'backdrop-blur-xl backdrop-saturate-[1.8]',
        'border border-white/[0.08] dark:border-white/[0.05]',
        'shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(255,255,255,0.02)]'
      ],
      neumorphic: [
        'bg-gray-100/80 dark:bg-gray-900/80',
        'shadow-[8px_8px_16px_rgba(0,0,0,0.15),-8px_-8px_16px_rgba(255,255,255,0.7)]',
        'dark:shadow-[8px_8px_16px_rgba(0,0,0,0.4),-8px_-8px_16px_rgba(255,255,255,0.02)]',
        'border-0'
      ],
      flat: [
        'bg-white/90 dark:bg-gray-900/90',
        'border border-gray-200/50 dark:border-gray-700/50',
        'shadow-[0_1px_3px_rgba(0,0,0,0.08)]'
      ],
      elevated: [
        'bg-white dark:bg-gray-900',
        'shadow-[0_20px_50px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)]',
        'border border-gray-100 dark:border-gray-800'
      ]
    }

    const sizes = {
      sm: 'p-4 rounded-xl',
      md: 'p-6 rounded-2xl',
      lg: 'p-8 rounded-3xl'
    }

    const hoverEffects = hover ? [
      'transition-all duration-300 ease-out',
      'hover:scale-[1.02] hover:-translate-y-1',
      variant === 'glass' && 'hover:bg-white/[0.04] dark:hover:bg-black/[0.04]',
      variant === 'elevated' && 'hover:shadow-[0_25px_60px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_25px_60px_rgba(0,0,0,0.4)]',
      'hover:border-white/[0.12] dark:hover:border-white/[0.08]'
    ].filter(Boolean) : []

    const glowEffect = glow ? [
      'relative',
      'before:absolute before:inset-0 before:rounded-[inherit] before:p-[1px]',
      'before:bg-gradient-to-r before:from-blue-500/20 before:via-purple-500/20 before:to-pink-500/20',
      'before:mask-[linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]',
      'before:mask-composite-[exclude]',
      'before:animate-pulse'
    ] : []

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
          // Glow effects
          glowEffect,
          // Custom className
          className
        )}
        {...props}
      >
        {/* Subtle gradient overlay for depth */}
        {variant === 'glass' && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-black/[0.02] dark:from-white/[0.02] dark:to-black/[0.08] rounded-[inherit] pointer-events-none" />
        )}
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    )
  }
)

ModernCard.displayName = 'ModernCard'