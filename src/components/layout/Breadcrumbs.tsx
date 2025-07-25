/**
 * Breadcrumbs Component
 * 
 * Accessible breadcrumb navigation with glassmorphism design and
 * responsive behavior for mobile devices.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigationContext } from '../../contexts/NavigationContext';
import { BreadcrumbItem } from '../../types/navigation';
import { cn } from '../../utils/cn';

interface BreadcrumbsProps {
  className?: string;
  maxItems?: number;
  showHome?: boolean;
  separator?: React.ReactNode;
  variant?: 'default' | 'minimal' | 'pills';
}

/**
 * Breadcrumbs Component
 * 
 * Production-ready breadcrumbs with:
 * - Glassmorphism design with subtle styling
 * - Responsive behavior with collapse on mobile
 * - Keyboard navigation and screen reader support
 * - Custom separators and styling variants
 * - Automatic truncation for long paths
 * - Icon support for breadcrumb items
 * - Active state management
 * - Smooth hover animations
 */
export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  className,
  maxItems = 5,
  showHome = true,
  separator,
  variant = 'default'
}) => {
  const { breadcrumbs } = useNavigationContext();

  // Default separator
  const defaultSeparator = (
    <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
    </svg>
  );

  const separatorElement = separator || defaultSeparator;

  // Process breadcrumbs
  let displayBreadcrumbs = [...breadcrumbs];

  // Remove home if showHome is false
  if (!showHome && displayBreadcrumbs.length > 0 && displayBreadcrumbs[0].href === '/') {
    displayBreadcrumbs = displayBreadcrumbs.slice(1);
  }

  // Truncate if too many items
  if (displayBreadcrumbs.length > maxItems) {
    const start = displayBreadcrumbs.slice(0, 1);
    const end = displayBreadcrumbs.slice(-2);
    displayBreadcrumbs = [
      ...start,
      { label: '...', href: undefined, active: false },
      ...end
    ];
  }

  if (displayBreadcrumbs.length === 0) {
    return null;
  }

  // Variant styles
  const variantClasses = {
    default: 'flex items-center space-x-2 text-sm',
    minimal: 'flex items-center space-x-1 text-xs',
    pills: 'flex items-center space-x-1 text-sm'
  };

  const itemVariantClasses = {
    default: cn(
      'flex items-center gap-2 px-2 py-1 rounded-md transition-colors duration-200',
      'hover:bg-white/10 dark:hover:bg-white/5'
    ),
    minimal: cn(
      'flex items-center gap-1 px-1 py-0.5 transition-colors duration-200',
      'hover:text-primary-600 dark:hover:text-primary-400'
    ),
    pills: cn(
      'flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200',
      'bg-white/5 dark:bg-black/10 hover:bg-white/10 dark:hover:bg-white/5',
      'border border-white/10 dark:border-white/5'
    )
  };

  const BreadcrumbItem = ({ 
    item, 
    isLast, 
    index 
  }: { 
    item: BreadcrumbItem; 
    isLast: boolean; 
    index: number; 
  }) => {
    const isActive = item.active || isLast;
    const isEllipsis = item.label === '...';

    const itemClasses = cn(
      itemVariantClasses[variant],
      isActive && 'text-primary-600 dark:text-primary-400 font-medium',
      !isActive && !isEllipsis && 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
      isEllipsis && 'text-gray-400 dark:text-gray-500 cursor-default',
      'focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-1'
    );

    const content = (
      <>
        {item.icon && !isEllipsis && (
          <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
            {typeof item.icon === 'string' ? (
              <span className="text-sm">{item.icon}</span>
            ) : (
              item.icon
            )}
          </span>
        )}
        <span className="truncate max-w-[120px] sm:max-w-none">
          {item.label}
        </span>
      </>
    );

    if (isEllipsis || !item.href || isActive) {
      return (
        <span className={cn(itemClasses, 'cursor-default')}>
          {content}
        </span>
      );
    }

    return (
      <Link
        to={item.href}
        className={itemClasses}
        aria-current={isActive ? 'page' : undefined}
      >
        {content}
      </Link>
    );
  };

  return (
    <nav 
      aria-label="Breadcrumb"
      className={cn(variantClasses[variant], className)}
    >
      <ol className="flex items-center space-x-2 min-w-0">
        {displayBreadcrumbs.map((item, index) => {
          const isLast = index === displayBreadcrumbs.length - 1;
          
          return (
            <li key={`${item.href}-${index}`} className="flex items-center space-x-2 min-w-0">
              <BreadcrumbItem
                item={item}
                isLast={isLast}
                index={index}
              />
              
              {!isLast && (
                <span 
                  className="flex-shrink-0" 
                  aria-hidden="true"
                >
                  {separatorElement}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};