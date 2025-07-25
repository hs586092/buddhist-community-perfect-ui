/**
 * Nature Theme Card Component
 * 자연 테마 카드 - 초록색, 갈색, 베이지 색감
 */

import React, { forwardRef } from 'react'
import { cn } from '../../utils/cn'

interface NatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'leaf' | 'wood' | 'stone' | 'earth'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export const NatureCard = forwardRef<HTMLDivElement, NatureCardProps>(
  ({ variant = 'leaf', size = 'md', className, children, ...props }, ref) => {
    const variants = {
      leaf: [
        'bg-gradient-to-br from-green-50 to-emerald-100',
        'border-2 border-green-200/60',
        'shadow-lg shadow-green-200/30',
        'hover:shadow-xl hover:shadow-green-300/40',
        'hover:border-green-300/80'
      ],
      wood: [
        'bg-gradient-to-br from-amber-50 to-orange-100', 
        'border-2 border-amber-200/60',
        'shadow-lg shadow-amber-200/30',
        'hover:shadow-xl hover:shadow-amber-300/40',
        'hover:border-amber-300/80'
      ],
      stone: [
        'bg-gradient-to-br from-slate-50 to-gray-100',
        'border-2 border-slate-200/60', 
        'shadow-lg shadow-slate-200/30',
        'hover:shadow-xl hover:shadow-slate-300/40',
        'hover:border-slate-300/80'
      ],
      earth: [
        'bg-gradient-to-br from-yellow-50 to-amber-100',
        'border-2 border-yellow-200/60',
        'shadow-lg shadow-yellow-200/30', 
        'hover:shadow-xl hover:shadow-yellow-300/40',
        'hover:border-yellow-300/80'
      ]
    }

    const sizes = {
      sm: 'p-4 rounded-lg',
      md: 'p-6 rounded-xl', 
      lg: 'p-8 rounded-2xl'
    }

    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          'transition-all duration-300 ease-out',
          'hover:scale-[1.02] hover:-translate-y-1',
          // Variant styles
          variants[variant],
          // Size styles
          sizes[size],
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

NatureCard.displayName = 'NatureCard'