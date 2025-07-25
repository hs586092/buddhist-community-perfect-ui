// Performance optimization utilities for Buddhist Community
// Core Web Vitals monitoring and optimization

// Buddhist Community Performance Standards
export const DHARMA_PERFORMANCE_TARGETS = {
  // Largest Contentful Paint - 법회 리뷰 로딩
  LCP: 2500, // 2.5 seconds
  
  // First Input Delay - 불자 소통 반응성  
  FID: 100, // 100 milliseconds
  
  // Cumulative Layout Shift - 연꽃 UI 안정성
  CLS: 0.1, // 0.1 score
  
  // Time to First Byte - 첫 바이트까지 시간
  TTFB: 600, // 600 milliseconds
  
  // First Contentful Paint
  FCP: 1800, // 1.8 seconds
  
  // Speed Index
  SI: 3000, // 3 seconds
  
  // Time to Interactive
  TTI: 3800, // 3.8 seconds
} as const;

// Performance monitoring interface
interface PerformanceMetrics {
  lcp?: number;
  fid?: number;
  cls?: number;
  ttfb?: number;
  fcp?: number;
  si?: number;
  tti?: number;
  timestamp: number;
  url: string;
}

class BuddhistPerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private observer: PerformanceObserver | null = null;

  constructor() {
    this.initializeMonitoring();
  }

  private initializeMonitoring() {
    // Monitor Core Web Vitals
    if ('PerformanceObserver' in window) {
      this.monitorLCP();
      this.monitorFID();
      this.monitorCLS();
      this.monitorTTFB();
    }

    // Monitor other performance metrics
    this.monitorResourceTiming();
    this.monitorNavigationTiming();
  }

  private monitorLCP() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        
        if (lastEntry) {
          this.recordMetric('lcp', lastEntry.startTime);
          
          // Alert if LCP is poor
          if (lastEntry.startTime > DHARMA_PERFORMANCE_TARGETS.LCP) {
            console.warn('🪷 성능 주의: LCP가 목표치를 초과했습니다', {
              actual: lastEntry.startTime,
              target: DHARMA_PERFORMANCE_TARGETS.LCP
            });
          }
        }
      });

      observer.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (error) {
      console.error('LCP 모니터링 초기화 실패:', error);
    }
  }

  private monitorFID() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.recordMetric('fid', entry.processingStart - entry.startTime);
          
          // Alert if FID is poor
          if (entry.processingStart - entry.startTime > DHARMA_PERFORMANCE_TARGETS.FID) {
            console.warn('🙏 성능 주의: FID가 목표치를 초과했습니다', {
              actual: entry.processingStart - entry.startTime,
              target: DHARMA_PERFORMANCE_TARGETS.FID
            });
          }
        });
      });

      observer.observe({ type: 'first-input', buffered: true });
    } catch (error) {
      console.error('FID 모니터링 초기화 실패:', error);
    }
  }

  private monitorCLS() {
    try {
      let clsValue = 0;
      let clsEntries: any[] = [];

      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsEntries.push(entry);
            clsValue += (entry as any).value;
          }
        }
        
        this.recordMetric('cls', clsValue);
        
        // Alert if CLS is poor
        if (clsValue > DHARMA_PERFORMANCE_TARGETS.CLS) {
          console.warn('🌸 성능 주의: CLS가 목표치를 초과했습니다', {
            actual: clsValue,
            target: DHARMA_PERFORMANCE_TARGETS.CLS,
            entries: clsEntries
          });
        }
      });

      observer.observe({ type: 'layout-shift', buffered: true });
    } catch (error) {
      console.error('CLS 모니터링 초기화 실패:', error);
    }
  }

  private monitorTTFB() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.responseStart > 0) {
            const ttfb = entry.responseStart - entry.requestStart;
            this.recordMetric('ttfb', ttfb);
            
            // Alert if TTFB is poor
            if (ttfb > DHARMA_PERFORMANCE_TARGETS.TTFB) {
              console.warn('🧘‍♀️ 성능 주의: TTFB가 목표치를 초과했습니다', {
                actual: ttfb,
                target: DHARMA_PERFORMANCE_TARGETS.TTFB
              });
            }
          }
        });
      });

      observer.observe({ type: 'navigation', buffered: true });
    } catch (error) {
      console.error('TTFB 모니터링 초기화 실패:', error);
    }
  }

  private monitorResourceTiming() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          // Monitor slow resources
          const loadTime = entry.responseEnd - entry.startTime;
          if (loadTime > 3000) { // 3 seconds threshold
            console.warn('📿 리소스 로딩 지연:', {
              name: entry.name,
              loadTime,
              type: entry.initiatorType
            });
          }
        });
      });

      observer.observe({ type: 'resource', buffered: true });
    }
  }

  private monitorNavigationTiming() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navTiming = performance.getEntriesByType('navigation')[0] as any;
        if (navTiming) {
          const fcp = performance.getEntriesByName('first-contentful-paint')[0]?.startTime;
          
          if (fcp) {
            this.recordMetric('fcp', fcp);
            
            if (fcp > DHARMA_PERFORMANCE_TARGETS.FCP) {
              console.warn('💫 성능 주의: FCP가 목표치를 초과했습니다', {
                actual: fcp,
                target: DHARMA_PERFORMANCE_TARGETS.FCP
              });
            }
          }
        }
      }, 0);
    });
  }

  private recordMetric(type: keyof PerformanceMetrics, value: number) {
    const metric: PerformanceMetrics = {
      [type]: value,
      timestamp: Date.now(),
      url: window.location.href
    };

    this.metrics.push(metric);
    
    // Keep only last 50 metrics to prevent memory leaks
    if (this.metrics.length > 50) {
      this.metrics = this.metrics.slice(-50);
    }

    // Send to analytics (in real implementation)
    this.sendMetricToAnalytics(type, value);
  }

  private sendMetricToAnalytics(type: string, value: number) {
    // In production, send to your analytics service
    // For now, just log for development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🪷 성능 지표 [${type}]:`, value);
    }
    
    // Example: Send to Google Analytics, Firebase, or custom endpoint
    // gtag('event', 'performance_metric', {
    //   metric_type: type,
    //   metric_value: value,
    //   page_location: window.location.href
    // });
  }

  public getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  public getLatestMetrics(): Partial<PerformanceMetrics> {
    const latest: Partial<PerformanceMetrics> = {
      timestamp: Date.now(),
      url: window.location.href
    };

    // Get latest of each metric type
    const metricTypes = ['lcp', 'fid', 'cls', 'ttfb', 'fcp'] as const;
    
    metricTypes.forEach(type => {
      const latestMetric = this.metrics
        .filter(m => m[type] !== undefined)
        .sort((a, b) => b.timestamp - a.timestamp)[0];
      
      if (latestMetric) {
        latest[type] = latestMetric[type];
      }
    });

    return latest;
  }

  public getPerformanceGrade(): 'excellent' | 'good' | 'needs-improvement' | 'poor' {
    const latest = this.getLatestMetrics();
    let score = 0;
    let totalChecks = 0;

    // LCP check
    if (latest.lcp !== undefined) {
      totalChecks++;
      if (latest.lcp <= 2500) score++;
      else if (latest.lcp <= 4000) score += 0.5;
    }

    // FID check
    if (latest.fid !== undefined) {
      totalChecks++;
      if (latest.fid <= 100) score++;
      else if (latest.fid <= 300) score += 0.5;
    }

    // CLS check
    if (latest.cls !== undefined) {
      totalChecks++;
      if (latest.cls <= 0.1) score++;
      else if (latest.cls <= 0.25) score += 0.5;
    }

    const percentage = totalChecks > 0 ? score / totalChecks : 0;

    if (percentage >= 0.9) return 'excellent';
    if (percentage >= 0.75) return 'good';
    if (percentage >= 0.5) return 'needs-improvement';
    return 'poor';
  }

  public cleanup() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// Image optimization utilities
export const ImageOptimization = {
  // Convert image format for better performance
  getOptimizedImageUrl: (src: string, options?: {
    format?: 'webp' | 'avif' | 'jpg' | 'png';
    quality?: number;
    width?: number;
    height?: number;
  }): string => {
    // In a real implementation, this would connect to an image CDN
    // like Cloudinary, ImageKit, or custom service
    
    const { format = 'webp', quality = 80, width, height } = options || {};
    
    // For development, return original
    if (process.env.NODE_ENV === 'development') {
      return src;
    }
    
    // Example implementation for production
    let optimizedUrl = src;
    
    // Add format conversion
    if (format !== 'jpg' && format !== 'png') {
      optimizedUrl += `?format=${format}`;
    }
    
    // Add quality parameter
    optimizedUrl += optimizedUrl.includes('?') ? '&' : '?';
    optimizedUrl += `quality=${quality}`;
    
    // Add dimensions if provided
    if (width) {
      optimizedUrl += `&w=${width}`;
    }
    if (height) {
      optimizedUrl += `&h=${height}`;
    }
    
    return optimizedUrl;
  },

  // Lazy loading with intersection observer
  setupLazyLoading: () => {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const src = img.dataset.src;
            
            if (src) {
              img.src = src;
              img.classList.remove('lazy');
              observer.unobserve(img);
            }
          }
        });
      });

      // Observe all lazy images
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }
};

// Font optimization
export const FontOptimization = {
  // Preload critical fonts
  preloadFonts: () => {
    const fonts = [
      {
        family: 'Noto Sans KR',
        weight: '300',
        display: 'swap'
      },
      {
        family: 'Noto Sans KR', 
        weight: '400',
        display: 'swap'
      }
    ];

    fonts.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      link.href = `https://fonts.gstatic.com/s/notosanskr/v27/PbykFmXiEBPT4ITbgNA5Cgm20xz6BbD5.woff2`;
      document.head.appendChild(link);
    });
  },

  // Optimize font loading
  optimizeFontLoading: () => {
    // Add font-display: swap to all fonts
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'Noto Sans KR';
        font-style: normal;
        font-weight: 300;
        font-display: swap;
        src: url('https://fonts.gstatic.com/s/notosanskr/v27/PbykFmXiEBPT4ITbgNA5Cgm20xz6BbD5.woff2') format('woff2');
      }
      
      @font-face {
        font-family: 'Noto Sans KR';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: url('https://fonts.gstatic.com/s/notosanskr/v27/PbykFmXiEBPT4ITbgNA5Cgm20xz6BbD5.woff2') format('woff2');
      }
    `;
    document.head.appendChild(style);
  }
};

// Initialize performance monitoring
export const performanceMonitor = new BuddhistPerformanceMonitor();

// Service Worker registration for caching
export const ServiceWorkerManager = {
  register: async () => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('🌸 Service Worker 등록 성공:', registration);
        
        // Update on reload
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content available, prompt user to refresh
                if (confirm('새로운 버전이 있습니다. 페이지를 새로고침할까요?')) {
                  window.location.reload();
                }
              }
            });
          }
        });
        
        return registration;
      } catch (error) {
        console.error('Service Worker 등록 실패:', error);
        return null;
      }
    }
    return null;
  }
};

// Bundle analyzer helper
export const BundleAnalyzer = {
  // Analyze bundle size and suggest optimizations
  analyzeBundleSize: () => {
    if (process.env.NODE_ENV === 'development') {
      // Estimate bundle sizes
      const scripts = Array.from(document.querySelectorAll('script[src]'));
      const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
      
      console.group('🪷 번들 크기 분석');
      
      scripts.forEach((script: any) => {
        if (script.src.includes('localhost') || script.src.includes('assets')) {
          console.log('Script:', script.src);
        }
      });
      
      styles.forEach((style: any) => {
        if (style.href.includes('localhost') || style.href.includes('assets')) {
          console.log('Stylesheet:', style.href);
        }
      });
      
      console.groupEnd();
    }
  },

  // Suggest optimizations based on bundle analysis
  suggestOptimizations: () => {
    const suggestions = [
      '🌱 Code splitting으로 초기 로딩 크기 줄이기',
      '🍃 Tree shaking으로 사용하지 않는 코드 제거',
      '🌸 이미지 최적화 (WebP 포맷 사용)',
      '🪷 폰트 최적화 (preload, font-display: swap)',
      '🧘‍♀️ Service Worker로 캐싱 전략 구현'
    ];
    
    console.group('💡 성능 최적화 제안');
    suggestions.forEach(suggestion => console.log(suggestion));
    console.groupEnd();
  }
};

export default {
  performanceMonitor,
  ImageOptimization,
  FontOptimization,
  ServiceWorkerManager,
  BundleAnalyzer,
  DHARMA_PERFORMANCE_TARGETS
};