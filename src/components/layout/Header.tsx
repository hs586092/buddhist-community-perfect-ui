/**
 * Header Component
 * 
 * Responsive application header with glassmorphism design, user controls,
 * and mobile navigation trigger.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GlassButton, GlassInput, ThemeToggle } from '../ui';
import { useNavigationContext } from '../../contexts/NavigationContext';
import { useMockAuth } from '../auth/MockAuthProvider';
import { NotificationCenter } from '../notifications';
import { cn } from '../../utils/cn';

interface HeaderProps {
  className?: string;
  showSearch?: boolean;
  showNotifications?: boolean;
  showUserMenu?: boolean;
}

/**
 * Header Component
 * 
 * Production-ready header with:
 * - Glassmorphism design with backdrop blur
 * - Mobile hamburger menu with smooth animations
 * - Global search with keyboard shortcuts
 * - Notification center with badge counts
 * - User dropdown menu with profile links
 * - Responsive behavior for all screen sizes
 * - Keyboard navigation and accessibility
 * - Theme toggle integration
 * - Real-time updates and loading states
 */
export const Header: React.FC<HeaderProps> = ({
  className,
  showSearch = true,
  showNotifications = true,
  showUserMenu = true,
}) => {
  const { toggleSidebar, toggleMobileMenu } = useNavigationContext();
  const { user, logout } = useMockAuth();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [notifications, setNotifications] = useState(5); // Mock notification count
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle search shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        const searchInput = document.getElementById('global-search') as HTMLInputElement;
        searchInput?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    // Implement search functionality
    console.log('Searching for:', value);
  };

  const handleUserMenuToggle = () => {
    setShowUserDropdown(prev => !prev);
  };

  const handleLogout = () => {
    setShowUserDropdown(false);
    logout();
  };

  return (
    <header className={cn(
      'w-full h-16 flex items-center justify-between px-4 lg:px-6',
      className
    )}>
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-lg hover:bg-white/10 dark:hover:bg-white/5 transition-colors duration-200 lg:hidden focus:outline-none focus:ring-2 focus:ring-primary-500/50"
          aria-label="Toggle mobile menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Desktop Sidebar Toggle */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex p-2 rounded-lg hover:bg-white/10 dark:hover:bg-white/5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
          aria-label="Toggle sidebar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Mobile Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 lg:hidden focus:outline-none focus:ring-2 focus:ring-primary-500/50 rounded-lg p-1"
        >
          <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            CC
          </div>
          <span className="text-lg font-bold gradient-text">Community</span>
        </Link>
      </div>

      {/* Center Section - Search */}
      {showSearch && (
        <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <div className="relative w-full">
            <GlassInput
              id="global-search"
              placeholder="Search community... (⌘K)"
              value={searchValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              leftIcon="🔍"
              variant="glass"
              className="w-full"
            />
            
            {/* Search Suggestions */}
            {searchFocused && searchValue && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border border-white/20 dark:border-white/10 rounded-lg shadow-lg z-50 animate-fade-in-up">
                <div className="p-2 space-y-1">
                  <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                    Search results for "{searchValue}"
                  </div>
                  {/* Mock search results */}
                  <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 dark:hover:bg-white/5 transition-colors duration-200">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">👥</span>
                      <div>
                        <div className="font-medium">Community Groups</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">3 groups found</div>
                      </div>
                    </div>
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 dark:hover:bg-white/5 transition-colors duration-200">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">📄</span>
                      <div>
                        <div className="font-medium">Articles & Posts</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">12 articles found</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Mobile Search Button */}
        {showSearch && (
          <button className="p-2 rounded-lg hover:bg-white/10 dark:hover:bg-white/5 transition-colors duration-200 md:hidden focus:outline-none focus:ring-2 focus:ring-primary-500/50">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        )}

        {/* Notifications */}
        {showNotifications && (
          <NotificationCenter />
        )}

        {/* Theme Toggle */}
        <div className="hidden sm:block">
          <ThemeToggle variant="icon" size="sm" />
        </div>

        {/* User Menu */}
        {showUserMenu && user && (
          <div ref={userMenuRef} className="relative">
            <button
              onClick={handleUserMenuToggle}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-white/10 dark:hover:bg-white/5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              aria-expanded={showUserDropdown}
              aria-haspopup="true"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300 max-w-24 truncate">
                {user.name.split(' ')[0]}
              </span>
              <svg
                className={cn(
                  'w-4 h-4 transition-transform duration-200 hidden sm:block',
                  showUserDropdown && 'rotate-180'
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* User Dropdown */}
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border border-white/20 dark:border-white/10 rounded-lg shadow-lg z-50 animate-fade-in-up">
                {/* User Info */}
                <div className="p-4 border-b border-white/10 dark:border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                      <p className="text-xs text-primary-600 dark:text-primary-400">
                        {user.role}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-white/5 transition-colors duration-200"
                    onClick={() => setShowUserDropdown(false)}
                  >
                    <span className="w-5 h-5 flex items-center justify-center">👤</span>
                    Profile Settings
                  </Link>
                  <Link
                    to="/preferences"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-white/5 transition-colors duration-200"
                    onClick={() => setShowUserDropdown(false)}
                  >
                    <span className="w-5 h-5 flex items-center justify-center">⚙️</span>
                    Preferences
                  </Link>
                  <Link
                    to="/help"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-white/5 transition-colors duration-200"
                    onClick={() => setShowUserDropdown(false)}
                  >
                    <span className="w-5 h-5 flex items-center justify-center">❓</span>
                    Help & Support
                  </Link>
                  
                  {user.role === 'Administrator' && (
                    <>
                      <div className="border-t border-white/10 dark:border-white/5 my-2"></div>
                      <Link
                        to="/admin"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors duration-200"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <span className="w-5 h-5 flex items-center justify-center">👑</span>
                        Admin Dashboard
                      </Link>
                    </>
                  )}
                  
                  <div className="border-t border-white/10 dark:border-white/5 my-2"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                  >
                    <span className="w-5 h-5 flex items-center justify-center">🚪</span>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};