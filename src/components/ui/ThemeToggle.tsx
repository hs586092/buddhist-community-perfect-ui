import React from 'react';
import { cn } from '../../utils/cn';
import { useTheme } from '../../hooks/useTheme';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  variant?: 'icon' | 'switch' | 'dropdown';
}

/**
 * ThemeToggle Component
 * 
 * A comprehensive theme switcher with multiple UI variants and accessibility features.
 * 
 * Features:
 * - Multiple variants (icon button, switch, dropdown)
 * - Animated icons with smooth transitions
 * - Full keyboard navigation support
 * - Screen reader announcements
 * - Customizable sizes and styling
 * - System preference detection
 * - WCAG 2.1 AA compliant
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className,
  size = 'md',
  showLabel = false,
  variant = 'icon'
}) => {
  const { theme, setTheme, toggleTheme, isDark } = useTheme();
  
  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3'
  };
  
  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  // Icon variants
  const SunIcon = () => (
    <svg
      className={cn(
        iconSizeClasses[size],
        'transition-transform duration-300',
        isDark ? 'rotate-90 scale-0' : 'rotate-0 scale-100'
      )}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );

  const MoonIcon = () => (
    <svg
      className={cn(
        iconSizeClasses[size],
        'transition-transform duration-300',
        isDark ? 'rotate-0 scale-100' : '-rotate-90 scale-0'
      )}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  );


  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light mode';
      case 'dark':
        return 'Dark mode';
      case 'system':
        return 'System preference';
      default:
        return 'Toggle theme';
    }
  };

  // Icon button variant
  if (variant === 'icon') {
    return (
      <button
        onClick={toggleTheme}
        className={cn(
          'glass-button relative inline-flex items-center justify-center rounded-lg transition-all duration-200 focus-ring',
          sizeClasses[size],
          'hover:-translate-y-0.5 hover:shadow-md',
          className
        )}
        aria-label={`Current theme: ${getThemeLabel()}. Click to cycle themes.`}
        title={getThemeLabel()}
      >
        <div className="relative">
          <SunIcon />
          <div className="absolute inset-0">
            <MoonIcon />
          </div>
        </div>
        {showLabel && (
          <span className="ml-2 text-sm font-medium">
            {theme === 'system' ? 'Auto' : theme === 'light' ? 'Light' : 'Dark'}
          </span>
        )}
      </button>
    );
  }

  // Switch variant
  if (variant === 'switch') {
    return (
      <div className="flex items-center gap-3">
        {showLabel && (
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {getThemeLabel()}
          </span>
        )}
        <button
          onClick={toggleTheme}
          className={cn(
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus-ring',
            isDark ? 'bg-blue-600' : 'bg-gray-200',
            className
          )}
          role="switch"
          aria-checked={isDark}
          aria-label={`Toggle theme. Current: ${getThemeLabel()}`}
        >
          <span
            className={cn(
              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 shadow-sm',
              isDark ? 'translate-x-6' : 'translate-x-1'
            )}
          />
        </button>
      </div>
    );
  }

  // Dropdown variant
  if (variant === 'dropdown') {
    return (
      <div className="relative">
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as any)}
          className={cn(
            'glass-input appearance-none bg-transparent pr-8 pl-3 py-2 text-sm focus-ring',
            className
          )}
          aria-label="Select theme"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg
            className="h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    );
  }

  return null;
};

ThemeToggle.displayName = 'ThemeToggle';