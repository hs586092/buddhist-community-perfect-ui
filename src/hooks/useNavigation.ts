/**
 * useNavigation Hook
 * 
 * Custom hook for managing navigation state, responsive behavior,
 * and user interactions across the application.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NavigationContextType, BreadcrumbItem, NavigationUser, ResponsiveConfig, defaultResponsive } from '../types/navigation';

interface UseNavigationOptions {
  responsive?: Partial<ResponsiveConfig>;
  autoCloseMobile?: boolean;
  persistSidebar?: boolean;
  localStorageKey?: string;
}

export const useNavigation = (options: UseNavigationOptions = {}): NavigationContextType => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const {
    responsive = defaultResponsive,
    autoCloseMobile = true,
    persistSidebar = true,
    localStorageKey = 'navigation-state'
  } = options;

  // State management
  const [sidebarOpen, setSidebarOpenState] = useState(() => {
    if (!persistSidebar) return false;
    try {
      const stored = localStorage.getItem(localStorageKey);
      return stored ? JSON.parse(stored).sidebarOpen : true;
    } catch {
      return true;
    }
  });

  const [mobileMenuOpen, setMobileMenuOpenState] = useState(false);
  const [breadcrumbs, setBreadcrumbsState] = useState<BreadcrumbItem[]>([]);
  const [user, setUser] = useState<NavigationUser | undefined>();

  // Responsive detection
  const [screenSize, setScreenSize] = useState(() => {
    if (typeof window === 'undefined') return 'desktop';
    const width = window.innerWidth;
    if (width < responsive.mobile) return 'mobile';
    if (width < responsive.tablet) return 'tablet';
    if (width < responsive.desktop) return 'desktop';
    return 'wide';
  });

  const isMobile = screenSize === 'mobile';
  const isTablet = screenSize === 'tablet';

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let newSize: string;
      
      if (width < responsive.mobile) newSize = 'mobile';
      else if (width < responsive.tablet) newSize = 'tablet';
      else if (width < responsive.desktop) newSize = 'desktop';
      else newSize = 'wide';

      setScreenSize(newSize);

      // Auto-close mobile menu when switching to desktop
      if (newSize !== 'mobile' && mobileMenuOpen) {
        setMobileMenuOpenState(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [responsive, mobileMenuOpen]);

  // Persist sidebar state
  useEffect(() => {
    if (!persistSidebar) return;
    
    try {
      const state = JSON.stringify({ sidebarOpen });
      localStorage.setItem(localStorageKey, state);
    } catch (error) {
      console.warn('Failed to persist navigation state:', error);
    }
  }, [sidebarOpen, persistSidebar, localStorageKey]);

  // Auto-close mobile menu on route change
  useEffect(() => {
    if (autoCloseMobile && mobileMenuOpen) {
      setMobileMenuOpenState(false);
    }
  }, [location.pathname, autoCloseMobile, mobileMenuOpen]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Escape to close mobile menu
      if (event.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpenState(false);
        return;
      }

      // Ctrl/Cmd + B to toggle sidebar
      if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
        event.preventDefault();
        if (!isMobile) {
          setSidebarOpenState(prev => !prev);
        }
        return;
      }

      // Ctrl/Cmd + / to toggle mobile menu
      if ((event.ctrlKey || event.metaKey) && event.key === '/') {
        event.preventDefault();
        if (isMobile) {
          setMobileMenuOpenState(prev => !prev);
        }
        return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen, isMobile]);

  // Enhanced navigation handlers
  const setSidebarOpen = useCallback((open: boolean) => {
    setSidebarOpenState(open);
  }, []);

  const setMobileMenuOpen = useCallback((open: boolean) => {
    setMobileMenuOpenState(open);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpenState(prev => !prev);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpenState(prev => !prev);
  }, []);

  const setBreadcrumbs = useCallback((newBreadcrumbs: BreadcrumbItem[]) => {
    setBreadcrumbsState(newBreadcrumbs);
  }, []);

  const handleNavigate = useCallback((path: string) => {
    navigate(path);
    if (autoCloseMobile && mobileMenuOpen) {
      setMobileMenuOpenState(false);
    }
  }, [navigate, autoCloseMobile, mobileMenuOpen]);

  // Context value with memoization for performance
  const contextValue = useMemo(() => ({
    currentPath: location.pathname,
    sidebarOpen: isMobile ? false : sidebarOpen,
    mobileMenuOpen,
    breadcrumbs,
    user,
    setSidebarOpen,
    setMobileMenuOpen,
    toggleSidebar,
    toggleMobileMenu,
    setBreadcrumbs,
    navigate: handleNavigate,
    // Additional utility properties
    isMobile,
    isTablet,
    screenSize,
    responsive
  }), [
    location.pathname,
    sidebarOpen,
    mobileMenuOpen,
    breadcrumbs,
    user,
    isMobile,
    isTablet,
    screenSize,
    setSidebarOpen,
    setMobileMenuOpen,
    toggleSidebar,
    toggleMobileMenu,
    setBreadcrumbs,
    handleNavigate,
    responsive
  ]);

  return contextValue as NavigationContextType;
};

// Additional hook for managing navigation items
export const useNavigationItems = () => {
  const [activeItems, setActiveItems] = useState<Set<string>>(new Set());
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const setActive = useCallback((itemId: string) => {
    setActiveItems(prev => new Set([itemId]));
  }, []);

  const toggleGroup = useCallback((groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  }, []);

  const isActive = useCallback((itemId: string) => {
    return activeItems.has(itemId);
  }, [activeItems]);

  const isExpanded = useCallback((groupId: string) => {
    return expandedGroups.has(groupId);
  }, [expandedGroups]);

  return {
    activeItems,
    expandedGroups,
    setActive,
    toggleGroup,
    isActive,
    isExpanded,
    setActiveItems,
    setExpandedGroups
  };
};