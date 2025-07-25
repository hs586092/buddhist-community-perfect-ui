/**
 * usePerformanceMonitoring Hook
 *
 * Monitors Core Web Vitals and custom performance metrics
 * Provides real-time dashboard performance insights
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { PerformanceMetrics } from '../types/dashboard';

interface UsePerformanceMonitoringReturn {
  metrics: PerformanceMetrics | null;
  startMonitoring: () => void;
  stopMonitoring: () => void;
  recordCustomMetric: (name: string, value: number) => void;
  getMetricHistory: (metricName: string) => number[];
}

const INITIAL_METRICS: PerformanceMetrics = {
  coreWebVitals: {
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    firstInputDelay: 0,
    cumulativeLayoutShift: 0,
    timeToInteractive: 0,
  },
  customMetrics: {
    widgetLoadTime: {},
    apiResponseTime: {},
    renderTime: 0,
    bundleSize: 0,
    memoryUsage: 0,
  },
  userExperience: {
    errorRate: 0,
    bounceRate: 0,
    sessionDuration: 0,
    pageViews: 1,
    userSatisfaction: 5,
  },
};

export const usePerformanceMonitoring = (): UsePerformanceMonitoringReturn => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const observersRef = useRef<PerformanceObserver[]>([]);
  const sessionStartRef = useRef<number>(Date.now());
  const metricHistoryRef = useRef<Record<string, number[]>>({});

  // Record custom metric
  const recordCustomMetric = useCallback((name: string, value: number) => {
    if (!metricHistoryRef.current[name]) {
      metricHistoryRef.current[name] = [];
    }
    metricHistoryRef.current[name].push(value);

    setMetrics(prev => {
      if (!prev) return null;
      return {
        ...prev,
        customMetrics: {
          ...prev.customMetrics,
          [name]: value,
        },
      };
    });
  }, []);

  // Get metric history
  const getMetricHistory = useCallback((metricName: string): number[] => {
    return metricHistoryRef.current[metricName] || [];
  }, []);

  // Start performance monitoring
  const startMonitoring = useCallback(() => {
    if (isMonitoring || typeof window === 'undefined') return;

    setIsMonitoring(true);
    setMetrics(INITIAL_METRICS);
    sessionStartRef.current = Date.now();

    // Core Web Vitals monitoring
    if ('PerformanceObserver' in window) {
      // First Contentful Paint & Largest Contentful Paint
      const paintObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          setMetrics(prev => {
            if (!prev) return null;
            const updates: Partial<PerformanceMetrics['coreWebVitals']> = {};

            if (entry.name === 'first-contentful-paint') {
              updates.firstContentfulPaint = entry.startTime;
            }

            return {
              ...prev,
              coreWebVitals: { ...prev.coreWebVitals, ...updates },
            };
          });
        });
      });

      try {
        paintObserver.observe({ entryTypes: ['paint'] });
        observersRef.current.push(paintObserver);
      } catch (error) {
        console.warn('Paint observer not supported:', error);
      }

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          setMetrics(prev => {
            if (!prev) return null;
            return {
              ...prev,
              coreWebVitals: {
                ...prev.coreWebVitals,
                largestContentfulPaint: lastEntry.startTime,
              },
            };
          });
        }
      });

      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        observersRef.current.push(lcpObserver);
      } catch (error) {
        console.warn('LCP observer not supported:', error);
      }

      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        list.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });

        setMetrics(prev => {
          if (!prev) return null;
          return {
            ...prev,
            coreWebVitals: {
              ...prev.coreWebVitals,
              cumulativeLayoutShift: prev.coreWebVitals.cumulativeLayoutShift + clsValue,
            },
          };
        });
      });

      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        observersRef.current.push(clsObserver);
      } catch (error) {
        console.warn('CLS observer not supported:', error);
      }

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          setMetrics(prev => {
            if (!prev) return null;
            return {
              ...prev,
              coreWebVitals: {
                ...prev.coreWebVitals,
                firstInputDelay: entry.processingStart - entry.startTime,
              },
            };
          });
        });
      });

      try {
        fidObserver.observe({ entryTypes: ['first-input'] });
        observersRef.current.push(fidObserver);
      } catch (error) {
        console.warn('FID observer not supported:', error);
      }

      // Navigation timing for TTI
      const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (navigationEntries.length > 0) {
        const nav = navigationEntries[0];
        setMetrics(prev => {
          if (!prev) return null;
          return {
            ...prev,
            coreWebVitals: {
              ...prev.coreWebVitals,
              timeToInteractive: nav.domInteractive - nav.fetchStart,
            },
          };
        });
      }
    }

    // Memory usage monitoring
    const monitorMemory = () => {
      if ('memory' in performance) {
        const memInfo = (performance as any).memory;
        setMetrics(prev => {
          if (!prev) return null;
          return {
            ...prev,
            customMetrics: {
              ...prev.customMetrics,
              memoryUsage: memInfo.usedJSHeapSize,
            },
          };
        });
      }
    };

    // Monitor memory every 5 seconds
    const memoryInterval = setInterval(monitorMemory, 5000);

    // Bundle size estimation
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      const estimatedBundleSize = performance.getEntriesByType('navigation')
        .reduce((total, entry: any) => total + (entry.transferSize || 0), 0);

      setMetrics(prev => {
        if (!prev) return null;
        return {
          ...prev,
          customMetrics: {
            ...prev.customMetrics,
            bundleSize: estimatedBundleSize,
          },
        };
      });
    }

    // Session duration tracking
    const updateSessionDuration = () => {
      const duration = Date.now() - sessionStartRef.current;
      setMetrics(prev => {
        if (!prev) return null;
        return {
          ...prev,
          userExperience: {
            ...prev.userExperience,
            sessionDuration: duration,
          },
        };
      });
    };

    const sessionInterval = setInterval(updateSessionDuration, 10000);

    // Cleanup function
    return () => {
      clearInterval(memoryInterval);
      clearInterval(sessionInterval);
    };
  }, [isMonitoring]);

  // Stop monitoring
  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);

    // Disconnect all observers
    observersRef.current.forEach(observer => {
      observer.disconnect();
    });
    observersRef.current = [];
  }, []);

  // Error tracking
  useEffect(() => {
    if (!isMonitoring) return;

    const handleError = () => {
      setMetrics(prev => {
        if (!prev) return null;
        return {
          ...prev,
          userExperience: {
            ...prev.userExperience,
            errorRate: prev.userExperience.errorRate + 1,
          },
        };
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, [isMonitoring]);

  // Page visibility tracking for bounce rate
  useEffect(() => {
    if (!isMonitoring) return;

    let isVisible = !document.hidden;
    let visibilityStart = Date.now();

    const handleVisibilityChange = () => {
      const now = Date.now();
      const timeVisible = now - visibilityStart;

      if (document.hidden) {
        // Page became hidden
        if (timeVisible < 3000) { // Less than 3 seconds = bounce
          setMetrics(prev => {
            if (!prev) return null;
            return {
              ...prev,
              userExperience: {
                ...prev.userExperience,
                bounceRate: prev.userExperience.bounceRate + 1,
              },
            };
          });
        }
      } else {
        // Page became visible
        visibilityStart = now;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isMonitoring]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMonitoring();
    };
  }, [stopMonitoring]);

  return {
    metrics,
    startMonitoring,
    stopMonitoring,
    recordCustomMetric,
    getMetricHistory,
  };
};
