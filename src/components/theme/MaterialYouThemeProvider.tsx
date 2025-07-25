/**
 * Material You Theme Provider
 *
 * Provides Material You theme context and applies CSS custom properties
 * Supports dynamic theming and responsive design tokens
 */

import React, { createContext, useContext, useEffect } from 'react';
import type { MaterialYouTheme } from '../../types/dashboard';

interface MaterialYouThemeContextValue {
  theme: MaterialYouTheme;
  updateTheme: (theme: MaterialYouTheme) => void;
}

const MaterialYouThemeContext = createContext<MaterialYouThemeContextValue | null>(null);

interface MaterialYouThemeProviderProps {
  theme: MaterialYouTheme;
  children: React.ReactNode;
  className?: string;
}

export const MaterialYouThemeProvider: React.FC<MaterialYouThemeProviderProps> = ({
  theme,
  children,
  className = '',
}) => {
  // Apply theme to CSS custom properties
  useEffect(() => {
    const root = document.documentElement;

    // Material You system colors
    const themeProperties = {
      // Primary
      '--md-sys-color-primary': theme.primary,
      '--md-sys-color-on-primary': theme.onPrimary,
      '--md-sys-color-primary-container': theme.primaryContainer,
      '--md-sys-color-on-primary-container': theme.onPrimaryContainer,

      // Secondary
      '--md-sys-color-secondary': theme.secondary,
      '--md-sys-color-on-secondary': theme.onSecondary,
      '--md-sys-color-secondary-container': theme.secondaryContainer,
      '--md-sys-color-on-secondary-container': theme.onSecondaryContainer,

      // Tertiary
      '--md-sys-color-tertiary': theme.tertiary,
      '--md-sys-color-on-tertiary': theme.onTertiary,
      '--md-sys-color-tertiary-container': theme.tertiaryContainer,
      '--md-sys-color-on-tertiary-container': theme.onTertiaryContainer,

      // Error
      '--md-sys-color-error': theme.error,
      '--md-sys-color-on-error': theme.onError,
      '--md-sys-color-error-container': theme.errorContainer,
      '--md-sys-color-on-error-container': theme.onErrorContainer,

      // Surface
      '--md-sys-color-background': theme.background,
      '--md-sys-color-on-background': theme.onBackground,
      '--md-sys-color-surface': theme.surface,
      '--md-sys-color-on-surface': theme.onSurface,
      '--md-sys-color-surface-variant': theme.surfaceVariant,
      '--md-sys-color-on-surface-variant': theme.onSurfaceVariant,

      // Outline
      '--md-sys-color-outline': theme.outline,
      '--md-sys-color-outline-variant': theme.outlineVariant,

      // System
      '--md-sys-color-shadow': theme.shadow,
      '--md-sys-color-scrim': theme.scrim,

      // Buddhist colors
      '--md-sys-color-lotus': theme.lotus,
      '--md-sys-color-dharma': theme.dharma,
      '--md-sys-color-sangha': theme.sangha,
      '--md-sys-color-karma': theme.karma,
      '--md-sys-color-wisdom': theme.wisdom,
      '--md-sys-color-compassion': theme.compassion,

      // Tailwind CSS integration
      '--color-primary': theme.primary,
      '--color-primary-foreground': theme.onPrimary,
      '--color-secondary': theme.secondary,
      '--color-secondary-foreground': theme.onSecondary,
      '--color-background': theme.background,
      '--color-foreground': theme.onBackground,
      '--color-card': theme.surface,
      '--color-card-foreground': theme.onSurface,
      '--color-border': theme.outline,
      '--color-input': theme.surfaceVariant,
      '--color-ring': theme.primary,
      '--color-muted': theme.surfaceVariant,
      '--color-muted-foreground': theme.onSurfaceVariant,
      '--color-accent': theme.secondaryContainer,
      '--color-accent-foreground': theme.onSecondaryContainer,
      '--color-destructive': theme.error,
      '--color-destructive-foreground': theme.onError,

      // iOS-style design tokens
      '--ios-blur-backdrop': 'blur(20px)',
      '--ios-border-radius-small': '8px',
      '--ios-border-radius-medium': '12px',
      '--ios-border-radius-large': '16px',
      '--ios-border-radius-extra-large': '24px',
      '--ios-shadow-small': '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
      '--ios-shadow-medium': '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
      '--ios-shadow-large': '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
      '--ios-shadow-extra-large': '0 25px 50px rgba(0, 0, 0, 0.25)',

      // Motion design tokens
      '--motion-ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      '--motion-ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
      '--motion-ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
      '--motion-duration-fast': '150ms',
      '--motion-duration-normal': '300ms',
      '--motion-duration-slow': '500ms',

      // Spacing scale (8pt grid)
      '--spacing-0': '0px',
      '--spacing-1': '4px',
      '--spacing-2': '8px',
      '--spacing-3': '12px',
      '--spacing-4': '16px',
      '--spacing-5': '20px',
      '--spacing-6': '24px',
      '--spacing-8': '32px',
      '--spacing-10': '40px',
      '--spacing-12': '48px',
      '--spacing-16': '64px',
      '--spacing-20': '80px',
      '--spacing-24': '96px',

      // Typography scale
      '--font-size-xs': '12px',
      '--font-size-sm': '14px',
      '--font-size-base': '16px',
      '--font-size-lg': '18px',
      '--font-size-xl': '20px',
      '--font-size-2xl': '24px',
      '--font-size-3xl': '30px',
      '--font-size-4xl': '36px',
      '--font-size-5xl': '48px',

      // Line heights
      '--line-height-tight': '1.25',
      '--line-height-normal': '1.5',
      '--line-height-relaxed': '1.75',

      // Font weights
      '--font-weight-light': '300',
      '--font-weight-normal': '400',
      '--font-weight-medium': '500',
      '--font-weight-semibold': '600',
      '--font-weight-bold': '700',
    };

    // Apply all properties
    Object.entries(themeProperties).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    // Cleanup function
    return () => {
      Object.keys(themeProperties).forEach((property) => {
        root.style.removeProperty(property);
      });
    };
  }, [theme]);

  const contextValue: MaterialYouThemeContextValue = {
    theme,
    updateTheme: () => {
      // This would be implemented if we need runtime theme updates
      console.log('Theme update not implemented in provider');
    },
  };

  return (
    <MaterialYouThemeContext.Provider value={contextValue}>
      <div
        className={`material-you-theme ${className}`}
        style={{
          backgroundColor: `var(--md-sys-color-background)`,
          color: `var(--md-sys-color-on-background)`,
          minHeight: '100vh',
          transition: 'background-color var(--motion-duration-normal) var(--motion-ease-out), color var(--motion-duration-normal) var(--motion-ease-out)',
        }}
      >
        {children}
      </div>
    </MaterialYouThemeContext.Provider>
  );
};

// Hook to use Material You theme context
export const useMaterialYouThemeContext = (): MaterialYouThemeContextValue => {
  const context = useContext(MaterialYouThemeContext);
  if (!context) {
    throw new Error('useMaterialYouThemeContext must be used within MaterialYouThemeProvider');
  }
  return context;
};

// Utility component for themed containers
interface ThemedContainerProps {
  children: React.ReactNode;
  variant?: 'surface' | 'surface-variant' | 'primary-container' | 'secondary-container';
  className?: string;
  style?: React.CSSProperties;
}

export const ThemedContainer: React.FC<ThemedContainerProps> = ({
  children,
  variant = 'surface',
  className = '',
  style = {},
}) => {
  const variantStyles = {
    surface: {
      backgroundColor: 'var(--md-sys-color-surface)',
      color: 'var(--md-sys-color-on-surface)',
    },
    'surface-variant': {
      backgroundColor: 'var(--md-sys-color-surface-variant)',
      color: 'var(--md-sys-color-on-surface-variant)',
    },
    'primary-container': {
      backgroundColor: 'var(--md-sys-color-primary-container)',
      color: 'var(--md-sys-color-on-primary-container)',
    },
    'secondary-container': {
      backgroundColor: 'var(--md-sys-color-secondary-container)',
      color: 'var(--md-sys-color-on-secondary-container)',
    },
  };

  return (
    <div
      className={`themed-container ${className}`}
      style={{
        ...variantStyles[variant],
        ...style,
      }}
    >
      {children}
    </div>
  );
};
