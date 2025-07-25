/**
 * Notion-style Layout Components
 * Functional and efficient layout system
 */

import React from 'react'
import { cn } from '../../utils/cn'

// Main Page Layout
interface NotionPageProps {
  children: React.ReactNode
  className?: string
  fullWidth?: boolean
}

export const NotionPage: React.FC<NotionPageProps> = ({ 
  children, 
  className, 
  fullWidth = false 
}) => {
  return (
    <div className={cn(
      'min-h-screen bg-white dark:bg-gray-900',
      'transition-linear-colors',
      className
    )}>
      <div className={cn(
        'mx-auto py-8',
        fullWidth ? 'px-6' : 'max-w-4xl px-6',
        'animate-linear-fade-in'
      )}>
        {children}
      </div>
    </div>
  )
}

// Content Section
interface NotionSectionProps {
  title?: string
  subtitle?: string
  children: React.ReactNode
  className?: string
  spacing?: 'sm' | 'md' | 'lg'
}

export const NotionSection: React.FC<NotionSectionProps> = ({
  title,
  subtitle,
  children,
  className,
  spacing = 'md'
}) => {
  const spacingClasses = {
    sm: 'space-y-4',
    md: 'space-y-6',
    lg: 'space-y-8'
  }

  return (
    <section className={cn(
      'animate-linear-slide-up',
      spacingClasses[spacing],
      className
    )}>
      {(title || subtitle) && (
        <div className="space-y-2">
          {title && (
            <h2 className={cn(
              'text-2xl font-semibold text-gray-900 dark:text-gray-100',
              'transition-linear-colors'
            )}>
              {title}
            </h2>
          )}
          {subtitle && (
            <p className={cn(
              'text-gray-600 dark:text-gray-400',
              'transition-linear-colors'
            )}>
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  )
}

// Card Grid
interface NotionGridProps {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4
  gap?: 'sm' | 'md' | 'lg'
  className?: string
}

export const NotionGrid: React.FC<NotionGridProps> = ({
  children,
  columns = 2,
  gap = 'md',
  className
}) => {
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }

  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8'
  }

  return (
    <div className={cn(
      'grid',
      columnClasses[columns],
      gapClasses[gap],
      'animate-linear-stagger-fade',
      className
    )}>
      {children}
    </div>
  )
}

// Block Container (like Notion blocks)
interface NotionBlockProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export const NotionBlock: React.FC<NotionBlockProps> = ({
  children,
  className,
  hover = true
}) => {
  return (
    <div className={cn(
      'group relative',
      'bg-white dark:bg-gray-800',
      'border border-gray-200 dark:border-gray-700',
      'rounded-lg p-6',
      'transition-linear',
      hover && [
        'hover-linear-lift',
        'hover:border-gray-300 dark:hover:border-gray-600',
        'hover:shadow-sm dark:hover:shadow-none'
      ],
      className
    )}>
      {children}
    </div>
  )
}

// Header with Icon
interface NotionHeaderProps {
  icon?: React.ReactNode
  title: string
  subtitle?: string
  actions?: React.ReactNode
  className?: string
}

export const NotionHeader: React.FC<NotionHeaderProps> = ({
  icon,
  title,
  subtitle,
  actions,
  className
}) => {
  return (
    <div className={cn(
      'flex items-start justify-between',
      'pb-6 mb-8 border-b border-gray-200 dark:border-gray-700',
      'animate-linear-slide-down',
      className
    )}>
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          {icon && (
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
              {icon}
            </div>
          )}
          <h1 className={cn(
            'text-3xl font-bold text-gray-900 dark:text-gray-100',
            'transition-linear-colors'
          )}>
            {title}
          </h1>
        </div>
        {subtitle && (
          <p className={cn(
            'text-lg text-gray-600 dark:text-gray-400',
            'transition-linear-colors'
          )}>
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex-shrink-0 animate-linear-slide-left">
          {actions}
        </div>
      )}
    </div>
  )
}

// Empty State
interface NotionEmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export const NotionEmptyState: React.FC<NotionEmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className
}) => {
  return (
    <div className={cn(
      'text-center py-12',
      'animate-linear-scale-in',
      className
    )}>
      {icon && (
        <div className="mx-auto w-16 h-16 mb-4 text-gray-400 dark:text-gray-500 flex items-center justify-center">
          {icon}
        </div>
      )}
      <h3 className={cn(
        'text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2',
        'transition-linear-colors'
      )}>
        {title}
      </h3>
      {description && (
        <p className={cn(
          'text-gray-600 dark:text-gray-400 mb-6',
          'transition-linear-colors'
        )}>
          {description}
        </p>
      )}
      {action && (
        <div className="animate-linear-fade-in">
          {action}
        </div>
      )}
    </div>
  )
}

// Loading State
interface NotionLoadingProps {
  lines?: number
  className?: string
}

export const NotionLoading: React.FC<NotionLoadingProps> = ({
  lines = 3,
  className
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-4 bg-gray-200 dark:bg-gray-700 rounded',
            'animate-linear-shimmer',
            i === lines - 1 && 'w-3/4'
          )}
        />
      ))}
    </div>
  )
}

// Stats/Metrics Display
interface NotionStatsProps {
  stats: Array<{
    label: string
    value: string | number
    icon?: React.ReactNode
  }>
  className?: string
}

export const NotionStats: React.FC<NotionStatsProps> = ({
  stats,
  className
}) => {
  return (
    <div className={cn(
      'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6',
      'animate-linear-stagger-slide',
      className
    )}>
      {stats.map((stat, index) => (
        <div
          key={index}
          className={cn(
            'bg-white dark:bg-gray-800',
            'border border-gray-200 dark:border-gray-700',
            'rounded-lg p-6',
            'transition-linear hover-linear-lift'
          )}
        >
          <div className="flex items-center space-x-3">
            {stat.icon && (
              <div className="text-blue-500 dark:text-blue-400">
                {stat.icon}
              </div>
            )}
            <div>
              <p className={cn(
                'text-2xl font-bold text-gray-900 dark:text-gray-100',
                'transition-linear-colors'
              )}>
                {stat.value}
              </p>
              <p className={cn(
                'text-sm text-gray-600 dark:text-gray-400',
                'transition-linear-colors'
              )}>
                {stat.label}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}