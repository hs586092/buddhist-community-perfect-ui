/**
 * useTheme Hook
 *
 * Custom hook for theme management with system preference detection
 * Supports light, dark, and system modes with smooth transitions
 */

import { useCallback, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface UseThemeReturn {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  systemTheme: ResolvedTheme;
}

const THEME_STORAGE_KEY = 'dharma-theme';
const THEME_ATTRIBUTE = 'data-theme';

export const useTheme = (): UseThemeReturn => {
  const [theme, setThemeState] = useState<Theme>('system');
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>('light');

  // Detect system theme preference
  const getSystemTheme = useCallback((): ResolvedTheme => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }, []);

  // Resolve actual theme (convert 'system' to 'light' or 'dark')
  const resolvedTheme: ResolvedTheme = theme === 'system' ? systemTheme : theme;

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      setThemeState(savedTheme);
    }

    // Set initial system theme
    setSystemTheme(getSystemTheme());
  }, [getSystemTheme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  // Apply theme to DOM
  useEffect(() => {
    const root = document.documentElement;

    // Remove previous theme classes
    root.classList.remove('light', 'dark');

    // Add current theme class
    root.classList.add(resolvedTheme);

    // Set data attribute for CSS
    root.setAttribute(THEME_ATTRIBUTE, resolvedTheme);

    // Set CSS custom properties for smooth transitions
    root.style.setProperty('--theme-transition', 'background-color 0.3s ease, color 0.3s ease');

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        resolvedTheme === 'dark' ? '#1f2937' : '#ffffff'
      );
    }
  }, [resolvedTheme]);

  // Set theme function
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);

    // Trigger custom event for other components
    window.dispatchEvent(new CustomEvent('themeChange', {
      detail: { theme: newTheme, resolvedTheme: newTheme === 'system' ? systemTheme : newTheme }
    }));
  }, [systemTheme]);

  // Toggle between light and dark (skips system)
  const toggleTheme = useCallback(() => {
    const newTheme = resolvedTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }, [resolvedTheme, setTheme]);

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    systemTheme,
  };
};
