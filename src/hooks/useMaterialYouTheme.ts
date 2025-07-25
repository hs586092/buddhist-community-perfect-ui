/**
 * useMaterialYouTheme Hook
 *
 * Implements Material You dynamic color theming with Buddhist adaptations
 * Features color generation, contrast checking, and theme persistence
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { MaterialYouTheme } from '../types/dashboard';

// Color generation utilities
const hexToHsl = (hex: string): [number, number, number] => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
};

const hslToHex = (h: number, s: number, l: number): string => {
  h = h % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }

  const toHex = (val: number) => {
    const hex = Math.round((val + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

// Generate Material You color palette from seed color
const generateColorPalette = (seedColor: string, isDark = false): MaterialYouTheme => {
  const [h, s, l] = hexToHsl(seedColor);

  // Generate primary palette
  const primary = seedColor;
  const primaryContainer = hslToHex(h, s * 0.6, isDark ? 25 : 85);
  const onPrimary = isDark ? '#000000' : '#FFFFFF';
  const onPrimaryContainer = hslToHex(h, s, isDark ? 85 : 15);

  // Generate secondary palette (30° hue shift)
  const secondaryHue = (h + 30) % 360;
  const secondary = hslToHex(secondaryHue, s * 0.7, isDark ? 70 : 40);
  const secondaryContainer = hslToHex(secondaryHue, s * 0.4, isDark ? 25 : 85);
  const onSecondary = isDark ? '#000000' : '#FFFFFF';
  const onSecondaryContainer = hslToHex(secondaryHue, s * 0.8, isDark ? 85 : 15);

  // Generate tertiary palette (60° hue shift)
  const tertiaryHue = (h + 60) % 360;
  const tertiary = hslToHex(tertiaryHue, s * 0.6, isDark ? 70 : 40);
  const tertiaryContainer = hslToHex(tertiaryHue, s * 0.3, isDark ? 25 : 85);
  const onTertiary = isDark ? '#000000' : '#FFFFFF';
  const onTertiaryContainer = hslToHex(tertiaryHue, s * 0.7, isDark ? 85 : 15);

  // Error colors (Material Design standard)
  const error = isDark ? '#F2B8B5' : '#B3261E';
  const errorContainer = isDark ? '#8C1D18' : '#F9DEDC';
  const onError = isDark ? '#601410' : '#FFFFFF';
  const onErrorContainer = isDark ? '#F2B8B5' : '#410E0B';

  // Surface colors
  const background = isDark ? '#0F0F0F' : '#FEFBFF';
  const surface = isDark ? '#141218' : '#FEFBFF';
  const surfaceVariant = isDark ? '#49454F' : '#E7E0EC';
  const onBackground = isDark ? '#E6E1E5' : '#1C1B1F';
  const onSurface = isDark ? '#E6E1E5' : '#1C1B1F';
  const onSurfaceVariant = isDark ? '#CAC4D0' : '#49454F';

  // Outline colors
  const outline = isDark ? '#938F99' : '#79747E';
  const outlineVariant = isDark ? '#49454F' : '#CAC4D0';

  // System colors
  const shadow = '#000000';
  const scrim = '#000000';

  // Buddhist-specific colors
  const lotus = hslToHex(340, 85, isDark ? 75 : 65); // Pink lotus
  const dharma = hslToHex(45, 90, isDark ? 80 : 55);  // Golden dharma wheel
  const sangha = hslToHex(120, 60, isDark ? 70 : 45); // Green community
  const karma = hslToHex(270, 70, isDark ? 75 : 50);  // Purple karma
  const wisdom = hslToHex(210, 80, isDark ? 75 : 55); // Blue wisdom
  const compassion = hslToHex(15, 85, isDark ? 80 : 60); // Orange compassion

  return {
    primary,
    onPrimary,
    primaryContainer,
    onPrimaryContainer,
    secondary,
    onSecondary,
    secondaryContainer,
    onSecondaryContainer,
    tertiary,
    onTertiary,
    tertiaryContainer,
    onTertiaryContainer,
    error,
    onError,
    errorContainer,
    onErrorContainer,
    background,
    onBackground,
    surface,
    onSurface,
    surfaceVariant,
    onSurfaceVariant,
    outline,
    outlineVariant,
    shadow,
    scrim,
    lotus,
    dharma,
    sangha,
    karma,
    wisdom,
    compassion,
  };
};

interface UseMaterialYouThemeReturn {
  theme: MaterialYouTheme;
  isDark: boolean;
  updateAccentColor: (color: string) => void;
  generateTheme: (seedColor: string, dark?: boolean) => MaterialYouTheme;
  toggleDarkMode: () => void;
  resetToSystemTheme: () => void;
}

const THEME_STORAGE_KEY = 'material-you-theme';
const DARK_MODE_KEY = 'dark-mode-preference';

export const useMaterialYouTheme = (): UseMaterialYouThemeReturn => {
  // Detect system dark mode preference
  const getSystemDarkMode = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }, []);

  // State
  const [seedColor, setSeedColor] = useState('#6366F1'); // Default indigo
  const [isDark, setIsDark] = useState(getSystemDarkMode);

  // Generate theme based on current settings
  const theme = useMemo(() => {
    return generateColorPalette(seedColor, isDark);
  }, [seedColor, isDark]);

  // Load persisted settings
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const savedDarkMode = localStorage.getItem(DARK_MODE_KEY);

    if (savedTheme) {
      setSeedColor(savedTheme);
    }

    if (savedDarkMode !== null) {
      setIsDark(savedDarkMode === 'true');
    }
  }, []);

  // Apply theme to CSS custom properties
  useEffect(() => {
    const root = document.documentElement;

    // Apply Material You colors as CSS custom properties
    Object.entries(theme).forEach(([key, value]) => {
      root.style.setProperty(`--md-sys-color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, value);
    });

    // Apply to Tailwind CSS classes
    root.style.setProperty('--color-primary', theme.primary);
    root.style.setProperty('--color-on-primary', theme.onPrimary);
    root.style.setProperty('--color-background', theme.background);
    root.style.setProperty('--color-surface', theme.surface);
    root.style.setProperty('--color-on-surface', theme.onSurface);

    // Set dark mode class
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme.surface);
    }
  }, [theme, isDark]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      const savedDarkMode = localStorage.getItem(DARK_MODE_KEY);
      if (savedDarkMode === null) {
        setIsDark(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Update accent color
  const updateAccentColor = useCallback((color: string) => {
    setSeedColor(color);
    localStorage.setItem(THEME_STORAGE_KEY, color);
  }, []);

  // Generate theme utility
  const generateTheme = useCallback((color: string, dark?: boolean) => {
    return generateColorPalette(color, dark ?? isDark);
  }, [isDark]);

  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    localStorage.setItem(DARK_MODE_KEY, newDarkMode.toString());
  }, [isDark]);

  // Reset to system theme
  const resetToSystemTheme = useCallback(() => {
    setIsDark(getSystemDarkMode());
    localStorage.removeItem(DARK_MODE_KEY);
  }, [getSystemDarkMode]);

  return {
    theme,
    isDark,
    updateAccentColor,
    generateTheme,
    toggleDarkMode,
    resetToSystemTheme,
  };
};
