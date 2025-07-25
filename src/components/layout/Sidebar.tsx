/**
 * Sidebar Component
 * 
 * Responsive glassmorphism sidebar with nested navigation, animations,
 * and comprehensive accessibility features.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GlassCard, ThemeToggle } from '../ui';
import { useNavigationContext } from '../../contexts/NavigationContext';
import { useMockAuth } from '../auth/MockAuthProvider';
import { NavigationItem, NavigationGroup } from '../../types/navigation';
import { cn } from '../../utils/cn';

interface SidebarProps {
  className?: string;
  collapsible?: boolean;
  theme?: 'light' | 'dark' | 'glass';
}

/**
 * Sidebar Component
 * 
 * Production-ready sidebar navigation with:
 * - Glassmorphism design with backdrop blur effects
 * - Nested navigation with smooth expand/collapse animations
 * - Badge support for notifications and status indicators
 * - Active state management with visual highlighting
 * - Keyboard navigation and screen reader support
 * - User profile section with avatar and role display
 * - Theme toggle integration
 * - Mobile-responsive behavior
 * - Scroll handling for long navigation lists
 * - Focus management and accessibility compliance
 */
export const Sidebar: React.FC<SidebarProps> = ({
  className,
  collapsible = true,
  theme = 'glass'
}) => {
  const { sidebarOpen, toggleSidebar } = useNavigationContext();
  const { user, logout } = useMockAuth();
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['main', 'community']));
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Navigation configuration
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
          href: '/community',
          icon: '👥',
          badge: '5',
          description: 'Community hub with groups, events, and members',
          children: [
            { id: 'hub', label: 'Community Hub', href: '/community', icon: '🏠' },
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
          description: 'Content management',
          children: [
            { id: 'articles', label: 'Articles', href: '/content/articles', icon: '📄' },
            { id: 'resources', label: 'Resources', href: '/content/resources', icon: '📚' },
            { id: 'media', label: 'Media Library', href: '/content/media', icon: '🖼️' },
            { id: 'categories', label: 'Categories', href: '/content/categories', icon: '🏷️' },
          ]
        }
      ]
    },
    {
      id: 'tools',
      label: 'Tools & Analytics',
      items: [
        {
          id: 'analytics',
          label: 'Analytics',
          href: '/analytics',
          icon: '📊',
          badge: 'New',
          description: 'Performance metrics'
        },
        {
          id: 'notifications',
          label: 'Notifications',
          href: '/notifications',
          icon: '🔔',
          badge: user?.role === 'Administrator' ? '12' : '5',
          description: 'Recent notifications'
        },
        {
          id: 'chat',
          label: 'Community Chat',
          href: '/chat',
          icon: '💬',
          badge: '2',
          description: 'Real-time chat rooms'
        },
        {
          id: 'settings',
          label: 'Settings',
          href: '/settings',
          icon: '⚙️',
          description: 'Application settings'
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
          icon: '👑',
          description: 'Administrative controls'
        },
        {
          id: 'user-management',
          label: 'User Management',
          href: '/admin/users',
          icon: '👥',
          description: 'Manage users and roles'
        },
        {
          id: 'content-moderation',
          label: 'Content Moderation',
          href: '/admin/moderation',
          icon: '🛡️',
          badge: '2',
          description: 'Review flagged content'
        },
        {
          id: 'system-health',
          label: 'System Health',
          href: '/admin/health',
          icon: '💚',
          description: 'System status and monitoring'
        }
      ]
    });
  }

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
    }
    item.onClick?.();
  };

  // Navigation item component
  const NavigationItemComponent = ({ 
    item, 
    depth = 0, 
    parentExpanded = true 
  }: { 
    item: NavigationItem; 
    depth?: number; 
    parentExpanded?: boolean; 
  }) => {
    const hasChildren = item.children && item.children.length > 0;
    const isItemActive = isActive(item);
    const isExpanded = expandedGroups.has(item.id);

    const itemClasses = cn(
      // Base styles
      'relative flex items-center gap-3 w-full text-left transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2 focus:ring-offset-transparent',
      'group',
      
      // Depth-based padding
      depth === 0 ? 'px-4 py-3' : 'px-8 py-2',
      
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
      
      // Animation
      'motion-reduce:transition-none'
    );

    const IconComponent = typeof item.icon === 'string' 
      ? () => <span className="text-lg">{item.icon}</span>
      : item.icon;

    return (
      <div className={cn('transition-all duration-200', !parentExpanded && 'hidden')}>
        {item.href && !hasChildren ? (
          <Link
            to={item.href}
            className={itemClasses}
            aria-current={isItemActive ? 'page' : undefined}
            title={item.description}
          >
            <ItemContent item={item} hasChildren={hasChildren || false} isExpanded={isExpanded || false} />
          </Link>
        ) : (
          <button
            onClick={() => handleItemClick(item)}
            className={itemClasses}
            aria-expanded={hasChildren ? isExpanded : undefined}
            title={item.description}
            disabled={item.disabled}
          >
            <ItemContent item={item} hasChildren={hasChildren || false} isExpanded={isExpanded || false} />
          </button>
        )}

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="ml-4 space-y-1 animate-fade-in-down">
            {item.children?.map(child => (
              <NavigationItemComponent
                key={child.id}
                item={child}
                depth={depth + 1}
                parentExpanded={isExpanded}
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
        <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
          {typeof item.icon === 'string' ? (
            <span className="text-base">{item.icon}</span>
          ) : (
            item.icon
          )}
        </span>
      )}
      <span className="flex-1 truncate font-medium">{item.label}</span>
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
            'w-4 h-4 transition-transform duration-200 flex-shrink-0',
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

  return (
    <div
      ref={sidebarRef}
      className={cn(
        'h-full flex flex-col',
        'bg-white/10 dark:bg-black/20 backdrop-blur-xl',
        'border-r border-white/20 dark:border-white/5',
        'shadow-xl shadow-black/10 dark:shadow-black/25',
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/20 dark:border-white/5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-primary-500/50 rounded-lg p-1"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center text-white font-bold">
              CC
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold gradient-text">Community</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Center</span>
            </div>
          </Link>

          {/* Collapse Button */}
          {collapsible && (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-white/10 dark:hover:bg-white/5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              aria-label="Toggle sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          )}
        </div>
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
          <GlassCard variant="light" padding="sm" className="relative">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.role}
                </p>
              </div>
              <button
                onClick={logout}
                className="p-1 rounded-lg hover:bg-white/10 dark:hover:bg-white/5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                title="Sign out"
                aria-label="Sign out"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
};