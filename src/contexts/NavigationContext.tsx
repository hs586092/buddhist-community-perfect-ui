/**
 * NavigationContext
 * 
 * React context for managing global navigation state across the application.
 * Provides navigation state, user context, and responsive behavior.
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { NavigationContextType } from '../types/navigation';
import { useNavigation } from '../hooks/useNavigation';

// Create the context
const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

interface NavigationProviderProps {
  children: ReactNode;
  autoCloseMobile?: boolean;
  persistSidebar?: boolean;
  localStorageKey?: string;
}

/**
 * NavigationProvider Component
 * 
 * Provides navigation context to the entire application with responsive
 * behavior, state persistence, and keyboard shortcuts.
 */
export const NavigationProvider: React.FC<NavigationProviderProps> = ({
  children,
  autoCloseMobile = true,
  persistSidebar = true,
  localStorageKey = 'community-navigation-state'
}) => {
  const navigationValue = useNavigation({
    autoCloseMobile,
    persistSidebar,
    localStorageKey
  });

  return (
    <NavigationContext.Provider value={navigationValue}>
      {children}
    </NavigationContext.Provider>
  );
};

/**
 * useNavigationContext Hook
 * 
 * Custom hook to access navigation context. Throws error if used
 * outside of NavigationProvider.
 */
export const useNavigationContext = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  
  if (context === undefined) {
    throw new Error('useNavigationContext must be used within a NavigationProvider');
  }
  
  return context;
};