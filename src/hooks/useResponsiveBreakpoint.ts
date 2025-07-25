/**
 * useResponsiveBreakpoint Hook
 *
 * iOS-style responsive design with container queries support
 * Provides breakpoint detection and responsive utilities
 */

import { useCallback, useEffect, useState } from 'react';
import type { Breakpoint } from '../types/dashboard';

interface UseResponsiveBreakpointOptions {
  enableContainerQueries?: boolean;
  customBreakpoints?: Record<string, number>;
}

interface UseResponsiveBreakpointReturn {
  breakpoint: Breakpoint;
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isWide: boolean;
  orientation: 'portrait' | 'landscape';
  isTouch: boolean;
  devicePixelRatio: number;
}

// Default iOS-style breakpoints
const DEFAULT_BREAKPOINTS = {
  mobile: 320,   // iPhone SE and up
  tablet: 768,   // iPad and up
  desktop: 1024, // Desktop and up
  wide: 1440,    // Large desktop
};

export const useResponsiveBreakpoint = (
  options: UseResponsiveBreakpointOptions = {}
): UseResponsiveBreakpointReturn => {
  const {
    enableContainerQueries = false,
    customBreakpoints = DEFAULT_BREAKPOINTS,
  } = options;

  const breakpoints = { ...DEFAULT_BREAKPOINTS, ...customBreakpoints };

  // State
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  const [deviceInfo, setDeviceInfo] = useState({
    isTouch: false,
    devicePixelRatio: 1,
  });

  // Detect device capabilities
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const detectDeviceInfo = () => {
      setDeviceInfo({
        isTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        devicePixelRatio: window.devicePixelRatio || 1,
      });
    };

    detectDeviceInfo();
  }, []);

  // Handle resize events
  const handleResize = useCallback(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Use ResizeObserver for container queries if enabled
    if (enableContainerQueries && 'ResizeObserver' in window) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.target === document.documentElement) {
            setDimensions({
              width: entry.contentRect.width,
              height: entry.contentRect.height,
            });
          }
        }
      });

      resizeObserver.observe(document.documentElement);
      return () => resizeObserver.disconnect();
    }

    // Fallback to window resize events
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize, enableContainerQueries]);

  // Determine current breakpoint
  const breakpoint: Breakpoint = (() => {
    const { width } = dimensions;

    if (width >= breakpoints.wide) return 'wide';
    if (width >= breakpoints.desktop) return 'desktop';
    if (width >= breakpoints.tablet) return 'tablet';
    return 'mobile';
  })();

  // Convenience boolean flags
  const isMobile = breakpoint === 'mobile';
  const isTablet = breakpoint === 'tablet';
  const isDesktop = breakpoint === 'desktop';
  const isWide = breakpoint === 'wide';

  // Calculate orientation
  const orientation: 'portrait' | 'landscape' =
    dimensions.height > dimensions.width ? 'portrait' : 'landscape';

  return {
    breakpoint,
    width: dimensions.width,
    height: dimensions.height,
    isMobile,
    isTablet,
    isDesktop,
    isWide,
    orientation,
    isTouch: deviceInfo.isTouch,
    devicePixelRatio: deviceInfo.devicePixelRatio,
  };
};
