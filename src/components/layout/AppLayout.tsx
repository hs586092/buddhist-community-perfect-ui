/**
 * AppLayout Component
 * 
 * Main application layout with responsive sidebar, header, and content areas.
 * Features glassmorphism design with mobile-first responsive behavior.
 */

import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { Breadcrumbs } from './Breadcrumbs';
import { useNavigationContext } from '../../contexts/NavigationContext';
import { useMockAuth } from '../auth/MockAuthProvider';
import { cn } from '../../utils/cn';

interface AppLayoutProps {
  className?: string;
  sidebarWidth?: 'sm' | 'md' | 'lg' | 'xl';
  headerHeight?: 'sm' | 'md' | 'lg';
  contentPadding?: 'none' | 'sm' | 'md' | 'lg';
  showBreadcrumbs?: boolean;
}

/**
 * AppLayout Component
 * 
 * Comprehensive application layout with:
 * - Responsive sidebar navigation with glassmorphism design
 * - Fixed header with user profile and theme controls
 * - Mobile-first navigation with touch gestures
 * - Breadcrumb navigation with route awareness
 * - Content area with proper spacing and overflow handling
 * - Keyboard shortcuts and accessibility features
 * - Smooth animations with reduced motion support
 */
export const AppLayout: React.FC<AppLayoutProps> = ({
  className,
  sidebarWidth = 'md',
  headerHeight = 'md',
  contentPadding = 'md',
  showBreadcrumbs = true,
}) => {
  const { sidebarOpen, mobileMenuOpen, setBreadcrumbs } = useNavigationContext();
  const { user } = useMockAuth();
  const location = useLocation();

  // Auto-generate breadcrumbs based on route
  useEffect(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [
      { label: 'Dashboard', href: '/', icon: '🏠' }
    ];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      breadcrumbs.push({
        label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
        href: isLast ? undefined : currentPath,
        active: isLast
      });
    });

    setBreadcrumbs(breadcrumbs);
  }, [location.pathname, setBreadcrumbs]);

  // Sidebar width classes
  const sidebarWidthClasses = {
    sm: 'w-60',
    md: 'w-72',
    lg: 'w-80',
    xl: 'w-96'
  };

  // Header height classes
  const headerHeightClasses = {
    sm: 'h-14',
    md: 'h-16',
    lg: 'h-20'
  };

  // Content padding classes
  const contentPaddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div className={cn(
      'min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900',
      'transition-colors duration-300 ease-out',
      className
    )}>
      {/* Desktop Sidebar */}
      <aside className={cn(
        'fixed top-0 left-0 z-40 h-screen transition-transform duration-300 ease-out',
        'hidden lg:block',
        sidebarWidthClasses[sidebarWidth],
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <Sidebar />
      </aside>

      {/* Mobile Navigation */}
      <MobileNav />

      {/* Main Content Wrapper */}
      <div className={cn(
        'transition-all duration-300 ease-out',
        'lg:ml-0',
        sidebarOpen && 'lg:ml-72' // Adjust based on sidebar width
      )}>
        {/* Header */}
        <header className={cn(
          'sticky top-0 z-30 w-full',
          'bg-white/10 dark:bg-black/20 backdrop-blur-lg',
          'border-b border-white/20 dark:border-white/5',
          'shadow-lg shadow-black/10 dark:shadow-black/25',
          headerHeightClasses[headerHeight]
        )}>
          <Header />
        </header>

        {/* Breadcrumbs */}
        {showBreadcrumbs && (
          <div className="sticky top-16 z-20 bg-white/5 dark:bg-black/10 backdrop-blur-sm border-b border-white/10 dark:border-white/5">
            <div className="container mx-auto px-4 py-2">
              <Breadcrumbs />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className={cn(
          'min-h-screen transition-all duration-300 ease-out',
          'relative z-10',
          contentPaddingClasses[contentPadding],
          showBreadcrumbs && 'pt-2' // Extra padding when breadcrumbs are shown
        )}>
          <div className="container mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => {
            const { setMobileMenuOpen } = useNavigationContext();
            setMobileMenuOpen(false);
          }}
          role="presentation"
          aria-hidden="true"
        />
      )}

      {/* Keyboard Shortcuts Info (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 z-50 opacity-50 hover:opacity-100 transition-opacity duration-200">
          <div className="bg-black/80 text-white text-xs px-3 py-2 rounded-lg backdrop-blur-lg border border-white/10">
            <div className="space-y-1">
              <div>⌘B / Ctrl+B: Toggle sidebar</div>
              <div>⌘/ / Ctrl+/: Toggle mobile menu</div>
              <div>ESC: Close mobile menu</div>
            </div>
          </div>
        </div>
      )}

      {/* Focus Trap for Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className="sr-only"
          tabIndex={0}
          onFocus={() => {
            const firstFocusable = document.querySelector('#mobile-nav [tabindex="0"], #mobile-nav button, #mobile-nav a') as HTMLElement;
            firstFocusable?.focus();
          }}
        />
      )}
    </div>
  );
};