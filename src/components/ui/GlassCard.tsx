import React, { forwardRef, useState } from 'react';
import { cn } from '../../utils/cn';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'light' | 'medium' | 'strong' | 'minimal';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  interactive?: boolean;
  loading?: boolean;
  bordered?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  as?: React.ElementType;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * GlassCard Component
 * 
 * Production-ready glassmorphism card with comprehensive layout and interaction features.
 * 
 * Features:
 * - 4 glass variants (light, medium, strong, minimal)
 * - Flexible sizing system (sm, md, lg, xl)
 * - Configurable padding options
 * - Header and footer sections
 * - Enhanced hover and interactive states
 * - Loading state with skeleton effect
 * - Customizable shadows and borders
 * - Rounded corner variants
 * - Polymorphic component support (renders as any element)
 * - Full accessibility compliance with ARIA attributes
 * - Responsive design with mobile-first approach
 * - Dark mode optimized with automatic adjustments
 * - Reduced motion support
 */
export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ 
    className, 
    variant = 'medium', 
    size = 'md',
    padding = 'md',
    hover = false,
    interactive = false,
    loading = false,
    bordered = true,
    shadow = 'md',
    rounded = 'lg',
    as: Component = 'div',
    header,
    footer,
    children,
    onClick,
    onKeyDown,
    ...props
  }, ref) => {
    const [isPressed, setIsPressed] = useState(false);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (interactive && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        setIsPressed(true);
        onClick?.(e as any);
      }
      onKeyDown?.(e);
    };

    const handleKeyUp = () => {
      setIsPressed(false);
    };

    const baseClasses = cn(
      // Base glass card styling
      'relative overflow-hidden',
      'transition-all duration-300 ease-out',
      
      // Motion preferences
      'motion-reduce:transition-none motion-reduce:transform-none',
      
      // Focus management
      interactive && 'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
      
      // Loading state
      loading && 'animate-pulse'
    );
    
    const variantClasses = {
      light: cn(
        'bg-white/5 backdrop-blur-sm',
        'border-white/10',
        'dark:bg-black/5 dark:border-white/5'
      ),
      medium: cn(
        'bg-white/10 backdrop-blur-md',
        'border-white/20',
        'dark:bg-black/20 dark:border-white/10'
      ),
      strong: cn(
        'bg-white/20 backdrop-blur-lg',
        'border-white/30',
        'dark:bg-black/30 dark:border-white/15'
      ),
      minimal: cn(
        'bg-transparent backdrop-blur-none',
        'border-gray-200',
        'dark:border-gray-700'
      )
    };

    const sizeClasses = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl'
    };

    const paddingClasses = {
      none: 'p-0',
      sm: 'p-3',
      md: 'p-4 sm:p-6', 
      lg: 'p-6 sm:p-8',
      xl: 'p-8 sm:p-10'
    };

    const shadowClasses = {
      none: 'shadow-none',
      sm: 'shadow-sm',
      md: 'shadow-md shadow-black/5 dark:shadow-black/20',
      lg: 'shadow-lg shadow-black/10 dark:shadow-black/25',
      xl: 'shadow-xl shadow-black/15 dark:shadow-black/30'
    };

    const roundedClasses = {
      sm: 'rounded-sm',
      md: 'rounded-md', 
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      full: 'rounded-full'
    };
    
    const interactiveClasses = interactive ? cn(
      'cursor-pointer select-none',
      
      // Hover states
      hover && 'hover:-translate-y-1 hover:scale-[1.02]',
      hover && shadow !== 'none' && 'hover:shadow-lg hover:shadow-black/15 dark:hover:shadow-black/30',
      
      // Active/pressed states
      'active:scale-[0.98] active:translate-y-0',
      isPressed && 'scale-[0.98] translate-y-0',
      
      // Enhanced glass effect on hover
      variant === 'light' && hover && 'hover:bg-white/8 dark:hover:bg-black/8',
      variant === 'medium' && hover && 'hover:bg-white/15 dark:hover:bg-black/25',
      variant === 'strong' && hover && 'hover:bg-white/25 dark:hover:bg-black/35',
    ) : (
      hover && 'hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/10'
    );
    
    const borderClasses = bordered ? 'border' : 'border-0';

    // Loading skeleton content
    const SkeletonContent = () => (
      <div className="space-y-3">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded-md animate-pulse" />
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded-md animate-pulse w-3/4" />
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded-md animate-pulse w-1/2" />
      </div>
    );

    const cardContent = loading ? <SkeletonContent /> : children;

    return (
      <Component
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          shadowClasses[shadow],
          roundedClasses[rounded],
          borderClasses,
          interactiveClasses,
          // Apply padding only if no header/footer, otherwise handle separately
          !header && !footer && paddingClasses[padding],
          className
        )}
        {...(interactive && {
          role: 'button',
          tabIndex: 0,
          'aria-pressed': isPressed ? 'true' : 'false',
          onKeyDown: handleKeyDown,
          onKeyUp: handleKeyUp,
          onClick
        })}
        {...props}
      >
        {/* Header Section */}
        {header && (
          <div className={cn(
            'border-b border-white/10 dark:border-white/5',
            paddingClasses[padding],
            'pb-3 mb-0'
          )}>
            {header}
          </div>
        )}

        {/* Main Content */}
        <div className={cn(
          header || footer ? paddingClasses[padding] : '',
          header && 'pt-3',
          footer && 'pb-0'
        )}>
          {cardContent}
        </div>

        {/* Footer Section */}
        {footer && (
          <div className={cn(
            'border-t border-white/10 dark:border-white/5',
            paddingClasses[padding],
            'pt-3 mt-0'
          )}>
            {footer}
          </div>
        )}

        {/* Loading overlay */}
        {loading && (
          <div 
            className="absolute inset-0 bg-white/10 dark:bg-black/20 backdrop-blur-sm rounded-inherit"
            aria-hidden="true"
          />
        )}
      </Component>
    );
  }
);

GlassCard.displayName = 'GlassCard';