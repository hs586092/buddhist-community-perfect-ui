import React, { useState } from 'react';
import {
  GlassCard,
  GlassButton,
  GlassNavigation,
  ThemeToggle,
} from '../ui';
import { useMockAuth } from '../auth/MockAuthProvider';
import { cn } from '../../utils/cn';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * DashboardLayout Component
 * 
 * Main layout for authenticated users with navigation and content areas.
 * Features glassmorphism design with responsive sidebar navigation.
 */
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useMockAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigationItems = [
    { 
      label: 'Dashboard', 
      href: '/dashboard', 
      icon: '🏠', 
      active: true 
    },
    { 
      label: 'Community', 
      icon: '👥',
      children: [
        { label: 'Feed', href: '/community/feed' },
        { label: 'Events', href: '/community/events' },
        { label: 'Groups', href: '/community/groups' },
      ]
    },
    { 
      label: 'Content', 
      icon: '📝',
      children: [
        { label: 'Articles', href: '/content/articles' },
        { label: 'Resources', href: '/content/resources' },
        { label: 'Media', href: '/content/media' },
      ]
    },
    { 
      label: 'Analytics', 
      href: '/analytics', 
      icon: '📊',
      badge: '3' 
    },
    { 
      label: 'Settings', 
      href: '/settings', 
      icon: '⚙️' 
    },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Top Navigation */}
      <GlassNavigation
        items={navigationItems}
        logo={
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              CC
            </div>
            <span className="text-xl font-bold gradient-text">Community</span>
          </div>
        }
        logoHref="/dashboard"
        actions={
          <div className="flex items-center gap-3">
            <ThemeToggle variant="icon" size="sm" />
            
            {/* User Menu */}
            <div className="relative">
              <GlassButton
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                )}
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium">
                    {user?.name || 'User'}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.role || 'Member'}
                  </div>
                </div>
              </GlassButton>

              {/* Dropdown Menu */}
              {isSidebarOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border border-white/20 dark:border-white/10 rounded-lg shadow-lg z-50 animate-fade-in-up">
                  <div className="py-2">
                    <div className="px-4 py-3 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        {user?.avatar ? (
                          <img 
                            src={user.avatar} 
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {user?.name?.charAt(0) || 'U'}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {user?.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {user?.email}
                          </p>
                          <p className="text-xs text-primary-600 dark:text-primary-400 font-medium">
                            {user?.role}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <a
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-white/5 transition-colors duration-200"
                    >
                      <span>👤</span>
                      Profile Settings
                    </a>
                    
                    <a
                      href="/preferences"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-white/5 transition-colors duration-200"
                    >
                      <span>⚙️</span>
                      Preferences
                    </a>
                    
                    {/* Admin Panel Link (if admin) */}
                    {user?.role === 'Administrator' && (
                      <a
                        href="/admin"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors duration-200"
                      >
                        <span>👑</span>
                        Admin Panel
                      </a>
                    )}
                    
                    <div className="border-t border-white/10 mt-2 pt-2">
                      <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
                        Logged in as {user?.role}
                      </div>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                      >
                        <span>🚪</span>
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        }
        variant="fixed"
        blur="lg"
        shadow="lg"
      />

      {/* Main Content */}
      <div className="pt-16">
        <div className="container mx-auto px-4 py-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold gradient-text mb-2">
              Welcome back, {user?.name?.split(' ')[0] || 'there'}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Here's what's happening in your community today.
            </p>
          </div>

          {/* Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Quick Stats */}
            <div className="lg:col-span-1">
              <GlassCard variant="light" padding="lg" className="h-fit">
                <h3 className="text-lg font-semibold mb-4 gradient-text">
                  Quick Stats
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Posts Today
                    </span>
                    <span className="font-semibold text-primary-600 dark:text-primary-400">
                      12
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Active Members
                    </span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      248
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Events This Week
                    </span>
                    <span className="font-semibold text-amber-600 dark:text-amber-400">
                      5
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/20">
                  <GlassButton
                    variant="primary"
                    size="sm"
                    fullWidth
                    rightIcon="→"
                  >
                    View Analytics
                  </GlassButton>
                </div>
              </GlassCard>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {children}
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close user menu */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};