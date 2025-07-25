/**
 * Navigation Types
 * 
 * Comprehensive type definitions for the navigation system including
 * sidebar navigation, mobile menus, and routing structures.
 */

import type { ReactNode } from 'react';

// Core navigation item interface
export interface NavigationItem {
  id: string;
  label: string;
  href?: string;
  icon?: ReactNode | string;
  badge?: string | number;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children?: NavigationItem[];
  description?: string;
  shortcut?: string;
  external?: boolean;
  permission?: string[];
  category?: string;
}

// Navigation group for organizing items
export interface NavigationGroup {
  id: string;
  label: string;
  items: NavigationItem[];
  collapsible?: boolean;
  collapsed?: boolean;
  icon?: ReactNode | string;
  permission?: string[];
}

// Sidebar configuration
export interface SidebarConfig {
  width?: 'sm' | 'md' | 'lg' | 'xl';
  position?: 'left' | 'right';
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  overlay?: boolean;
  backdrop?: boolean;
  persistent?: boolean;
  autoClose?: boolean;
  resizable?: boolean;
  theme?: 'light' | 'dark' | 'glass';
}

// Mobile menu configuration
export interface MobileMenuConfig {
  type?: 'overlay' | 'drawer' | 'dropdown';
  position?: 'top' | 'bottom' | 'left' | 'right';
  animation?: 'slide' | 'fade' | 'scale' | 'flip';
  backdrop?: boolean;
  swipeToClose?: boolean;
  threshold?: number;
}

// Breadcrumb interface
export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ReactNode | string;
  active?: boolean;
}

// Layout configuration
export interface LayoutConfig {
  sidebar?: SidebarConfig;
  mobile?: MobileMenuConfig;
  header?: {
    height?: 'sm' | 'md' | 'lg';
    sticky?: boolean;
    blur?: boolean;
    border?: boolean;
  };
  footer?: {
    sticky?: boolean;
    minimal?: boolean;
  };
  content?: {
    padding?: 'none' | 'sm' | 'md' | 'lg';
    maxWidth?: string;
    centered?: boolean;
  };
}

// User context for navigation
export interface NavigationUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  permissions: string[];
}

// Navigation context interface
export interface NavigationContextType {
  currentPath: string;
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  breadcrumbs: BreadcrumbItem[];
  user?: NavigationUser;
  setSidebarOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void;
  navigate: (path: string) => void;
}

// Animation variants for navigation components
export interface AnimationConfig {
  type: 'slide' | 'fade' | 'scale' | 'flip' | 'bounce';
  duration: number;
  easing: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
  delay?: number;
  stagger?: number;
}

// Responsive breakpoint configuration
export interface ResponsiveConfig {
  mobile: number;
  tablet: number;
  desktop: number;
  wide: number;
}

export const defaultResponsive: ResponsiveConfig = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
};