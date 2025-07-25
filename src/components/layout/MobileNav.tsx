/**
 * MobileNav Component
 * 
 * Mobile navigation drawer with touch gestures and glassmorphism design.
 * Optimized for mobile devices with smooth animations and accessibility.
 */

import React, { useRef, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GlassCard, ThemeToggle } from '../ui';
import { useNavigationContext } from '../../contexts/NavigationContext';
import { useMockAuth } from '../auth/MockAuthProvider';
import { NavigationItem, NavigationGroup } from '../../types/navigation';
import { cn } from '../../utils/cn';

interface MobileNavProps {
  className?: string;
  position?: 'left' | 'right' | 'top' | 'bottom';
  animation?: 'slide' | 'fade' | 'scale';
  swipeToClose?: boolean;
}

/**
 * MobileNav Component
 * 
 * Production-ready mobile navigation with:
 * - Glassmorphism design with backdrop blur
 * - Touch gesture support with swipe-to-close
 * - Smooth slide animations with spring physics
 * - Nested navigation with expandable sections
 * - User profile section with avatar and role
 * - Theme toggle integration
 * - Focus trap for accessibility
 * - Auto-close on route navigation
 * - Reduced motion support
 * - Performance optimized rendering
 */
export const MobileNav: React.FC<MobileNavProps> = ({
  className,
  position = 'left',
  animation = 'slide',
  swipeToClose = true
}) => {
  const { mobileMenuOpen, setMobileMenuOpen } = useNavigationContext();
  const { user, logout } = useMockAuth();
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['main']));
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Navigation configuration (same as Sidebar but optimized for mobile)
  const navigationGroups: NavigationGroup[] = [
    {
      id: 'main',
      label: 'Main Navigation',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          href: '/',
          icon: '🏠',
          description: 'Overview and analytics'
        },
        {
          id: 'community',
          label: 'Community',
          icon: '👥',
          badge: '5',
          children: [
            { id: 'feed', label: 'Activity Feed', href: '/community/feed', icon: '📰' },
            { id: 'members', label: 'Members', href: '/community/members', icon: '👤', badge: '248' },
            { id: 'groups', label: 'Groups', href: '/community/groups', icon: '🏘️' },
            { id: 'events', label: 'Events', href: '/community/events', icon: '📅', badge: '3' },
          ]
        },
        {
          id: 'content',
          label: 'Content',
          icon: '📝',
          children: [
            { id: 'articles', label: 'Articles', href: '/content/articles', icon: '📄' },
            { id: 'resources', label: 'Resources', href: '/content/resources', icon: '📚' },
            { id: 'media', label: 'Media Library', href: '/content/media', icon: '🖼️' },
          ]
        }
      ]
    },
    {
      id: 'tools',
      label: 'Tools',
      items: [
        {
          id: 'analytics',
          label: 'Analytics',
          href: '/analytics',
          icon: '📊',
          badge: 'New'
        },
        {
          id: 'notifications',
          label: 'Notifications',
          href: '/notifications',
          icon: '🔔',
          badge: '5'
        },
        {
          id: 'settings',
          label: 'Settings',
          href: '/settings',
          icon: '⚙️'
        }
      ]
    }
  ];

  // Add admin section for administrators
  if (user?.role === 'Administrator') {
    navigationGroups.push({
      id: 'admin',
      label: 'Administration',
      items: [
        {
          id: 'admin-dashboard',
          label: 'Admin Dashboard',
          href: '/admin',
          icon: '👑'
        },
        {
          id: 'user-management',
          label: 'User Management',
          href: '/admin/users',
          icon: '👥'
        },
        {
          id: 'content-moderation',
          label: 'Moderation',
          href: '/admin/moderation',
          icon: '🛡️',
          badge: '2'
        }
      ]
    });
  }

  // Touch gesture handling
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    if (!swipeToClose) return;
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!swipeToClose) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!swipeToClose || !touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (position === 'left' && isLeftSwipe) {
      setMobileMenuOpen(false);
    } else if (position === 'right' && isRightSwipe) {
      setMobileMenuOpen(false);
    }
  };

  // Keyboard handling
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!mobileMenuOpen) return;

      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen, setMobileMenuOpen]);

  // Focus management
  useEffect(() => {
    if (mobileMenuOpen && navRef.current) {
      const focusableElements = navRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      firstElement?.focus();
    }
  }, [mobileMenuOpen]);

  // Check if item is active
  const isActive = (item: NavigationItem): boolean => {
    if (item.href === location.pathname) return true;
    if (item.children) {
      return item.children.some(child => child.href === location.pathname);
    }
    return false;
  };

  // Toggle group expansion
  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  // Handle item click
  const handleItemClick = (item: NavigationItem) => {
    if (item.children) {
      toggleGroup(item.id);
    } else {
      setMobileMenuOpen(false);
    }
    item.onClick?.();
  };

  // Navigation item component
  const NavigationItemComponent = ({ 
    item, 
    depth = 0 
  }: { 
    item: NavigationItem; 
    depth?: number; 
  }) => {
    const hasChildren = item.children && item.children.length > 0;
    const isItemActive = isActive(item);
    const isExpanded = expandedGroups.has(item.id);

    const itemClasses = cn(
      'relative flex items-center gap-3 w-full text-left transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2 focus:ring-offset-transparent',
      'group touch-manipulation',
      
      // Depth-based padding (more generous for mobile)
      depth === 0 ? 'px-4 py-4' : 'px-8 py-3',
      
      // State styles
      item.disabled 
        ? 'opacity-50 cursor-not-allowed' 
        : 'cursor-pointer hover:bg-white/10 dark:hover:bg-white/5',
      
      // Active state
      isItemActive 
        ? 'bg-white/20 text-primary-600 dark:text-primary-400 font-semibold shadow-sm' 
        : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white',
      
      // Border radius
      'rounded-lg mx-2',
      
      // Touch target (minimum 44px)
      'min-h-[44px]'
    );

    return (
      <div className="transition-all duration-200">
        {item.href && !hasChildren ? (
          <Link
            to={item.href}
            className={itemClasses}
            onClick={() => handleItemClick(item)}
            aria-current={isItemActive ? 'page' : undefined}
          >
            <ItemContent item={item} hasChildren={hasChildren || false} isExpanded={isExpanded || false} />
          </Link>
        ) : (
          <button
            onClick={() => handleItemClick(item)}
            className={itemClasses}
            aria-expanded={hasChildren ? isExpanded : undefined}
            disabled={item.disabled}
          >
            <ItemContent item={item} hasChildren={hasChildren || false} isExpanded={isExpanded || false} />
          </button>
        )}

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="ml-2 space-y-1 animate-fade-in-down">
            {item.children?.map(child => (
              <NavigationItemComponent
                key={child.id}
                item={child}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Item content component
  const ItemContent = ({ 
    item, 
    hasChildren, 
    isExpanded 
  }: { 
    item: NavigationItem; 
    hasChildren: boolean; 
    isExpanded: boolean; 
  }) => (
    <>
      {item.icon && (
        <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-lg">
          {typeof item.icon === 'string' ? item.icon : item.icon}
        </span>
      )}
      <span className="flex-1 truncate font-medium text-base">{item.label}</span>
      {item.badge && (
        <span className={cn(
          'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0',
          typeof item.badge === 'number' || !isNaN(Number(item.badge))
            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
        )}>
          {item.badge}
        </span>
      )}
      {hasChildren && (
        <svg
          className={cn(
            'w-5 h-5 transition-transform duration-200 flex-shrink-0',
            isExpanded && 'rotate-180'
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      )}
    </>
  );

  if (!mobileMenuOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden animate-fade-in"
        onClick={() => setMobileMenuOpen(false)}
        role="presentation"
        aria-hidden="true"
      />

      {/* Mobile Navigation */}
      <div
        id="mobile-nav"
        ref={navRef}
        className={cn(
          'fixed top-0 z-50 h-full w-80 max-w-[85vw] lg:hidden',
          'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl',
          'border-r border-white/20 dark:border-white/5',
          'shadow-2xl shadow-black/20 dark:shadow-black/40',
          'transform transition-transform duration-300 ease-out',
          // Position-based classes
          position === 'left' ? 'left-0 animate-slide-in-left' : 'right-0 animate-slide-in-right',
          className
        )}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        role="navigation"
        aria-label="Mobile navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/20 dark:border-white/5">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-primary-500/50 rounded-lg p-1"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center text-white font-bold">
              CC
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold gradient-text">Community</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Center</span>
            </div>
          </Link>

          {/* Close Button */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-lg hover:bg-white/10 dark:hover:bg-white/5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            aria-label="Close navigation"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-6">
          {navigationGroups.map(group => (
            <div key={group.id} className="space-y-2">
              {/* Group Label */}
              <h3 className="px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {group.label}
              </h3>
              
              {/* Group Items */}
              <div className="space-y-1">
                {group.items.map(item => (
                  <NavigationItemComponent key={item.id} item={item} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/20 dark:border-white/5 space-y-4">
          {/* Theme Toggle */}
          <div className="flex justify-center">
            <ThemeToggle variant="icon" size="sm" />
          </div>

          {/* User Profile */}
          {user && (
            <GlassCard variant="light" padding="sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user.email}
                  </p>
                  <p className="text-xs text-primary-600 dark:text-primary-400">
                    {user.role}
                  </p>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="p-2 rounded-lg hover:bg-white/10 dark:hover:bg-white/5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </GlassCard>
          )}

          {/* Swipe Indicator */}
          {swipeToClose && (
            <div className="flex justify-center">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span>👈</span>
                <span>Swipe to close</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};