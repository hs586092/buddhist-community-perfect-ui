/**
 * useDashboardConfig Hook
 *
 * Manages dashboard configuration including widget positions,
 * user preferences, and responsive layout settings
 */

import { useCallback, useEffect, useState } from 'react';
import type { DashboardConfig } from '../types/dashboard';

interface UseDashboardConfigReturn {
  config: DashboardConfig;
  updateConfig: (updates: Partial<DashboardConfig>) => void;
  resetConfig: () => void;
  saveConfig: () => void;
  loadConfig: () => void;
}

const DEFAULT_CONFIG: DashboardConfig = {
  layout: {
    breakpoints: {
      mobile: 320,
      tablet: 768,
      desktop: 1024,
      wide: 1440,
    },
    grid: {
      columns: 4,
      gap: 24,
      margin: 32,
    },
    containerQueries: true,
  },
  widgets: {
    enabled: [
      'welcome',
      'meditation-streak',
      'events',
      'activity-feed',
      'progress',
      'achievements',
    ],
    positions: {
      welcome: { column: 0, row: 0, width: 2, height: 1 },
      'meditation-streak': { column: 2, row: 0, width: 1, height: 2 },
      events: { column: 0, row: 1, width: 2, height: 1 },
      'activity-feed': { column: 3, row: 0, width: 1, height: 3 },
      progress: { column: 0, row: 2, width: 2, height: 2 },
      achievements: { column: 2, row: 2, width: 1, height: 1 },
    },
    customizable: true,
  },
  animations: {
    reduceMotion: false,
    duration: 'normal',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  accessibility: {
    highContrast: false,
    largeText: false,
    screenReader: false,
    keyboardNavigation: true,
  },
};

const CONFIG_STORAGE_KEY = 'buddhist-dashboard-config';

export const useDashboardConfig = (
  initialConfig?: Partial<DashboardConfig>
): UseDashboardConfigReturn => {
  const [config, setConfig] = useState<DashboardConfig>(() => {
    return { ...DEFAULT_CONFIG, ...initialConfig };
  });

  // Load configuration from localStorage
  const loadConfig = useCallback(() => {
    try {
      const savedConfig = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig(prev => ({ ...prev, ...parsedConfig }));
      }
    } catch (error) {
      console.warn('Failed to load dashboard config:', error);
    }
  }, []);

  // Save configuration to localStorage
  const saveConfig = useCallback(() => {
    try {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
    } catch (error) {
      console.warn('Failed to save dashboard config:', error);
    }
  }, [config]);

  // Update configuration
  const updateConfig = useCallback((updates: Partial<DashboardConfig>) => {
    setConfig(prev => {
      const newConfig = { ...prev };

      // Deep merge updates
      Object.keys(updates).forEach(key => {
        const updateKey = key as keyof DashboardConfig;
        if (typeof updates[updateKey] === 'object' && updates[updateKey] !== null) {
          newConfig[updateKey] = {
            ...prev[updateKey],
            ...updates[updateKey]
          } as any;
        } else {
          newConfig[updateKey] = updates[updateKey] as any;
        }
      });

      return newConfig;
    });
  }, []);

  // Reset to default configuration
  const resetConfig = useCallback(() => {
    setConfig(DEFAULT_CONFIG);
    localStorage.removeItem(CONFIG_STORAGE_KEY);
  }, []);

  // Load config on mount
  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  // Auto-save when config changes (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveConfig();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [config, saveConfig]);

  // Detect system preferences
  useEffect(() => {
    const detectSystemPreferences = () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const highContrast = window.matchMedia('(prefers-contrast: high)').matches;

      updateConfig({
        animations: { ...config.animations, reduceMotion },
        accessibility: { ...config.accessibility, highContrast },
      });
    };

    detectSystemPreferences();

    // Listen for changes
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const contrastQuery = window.matchMedia('(prefers-contrast: high)');

    motionQuery.addEventListener('change', detectSystemPreferences);
    contrastQuery.addEventListener('change', detectSystemPreferences);

    return () => {
      motionQuery.removeEventListener('change', detectSystemPreferences);
      contrastQuery.removeEventListener('change', detectSystemPreferences);
    };
  }, []);

  return {
    config,
    updateConfig,
    resetConfig,
    saveConfig,
    loadConfig,
  };
};
