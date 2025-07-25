// Main entry point for Buddhist Community Production App
// 불교 커뮤니티 프로덕션 앱의 진입점

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Production utilities
import { initializeSecurity } from './utils/security';
import { performanceMonitor, ServiceWorkerManager } from './utils/performance';
import { initializeMonitoring } from './utils/monitoring';
import { i18n, a11y } from './utils/i18n';

// Initialize security and performance monitoring
const initializeProductionSystems = async () => {
  try {
    console.log('🪷 불교 커뮤니티 초기화 시작...');

    // 1. Security initialization
    initializeSecurity();
    console.log('✅ 보안 시스템 초기화 완료');

    // 2. Performance monitoring
    if (process.env.NODE_ENV === 'production') {
      // Initialize performance monitoring
      console.log('📊 성능 모니터링 시작...');
      
      // Register service worker for offline support
      await ServiceWorkerManager.register();
      console.log('🔄 Service Worker 등록 완료');
      
      // Initialize comprehensive monitoring
      const monitoring = initializeMonitoring({
        performance: {
          enabled: true,
          sampleRate: 0.1, // 10% sampling for production
          reportingInterval: 30000
        },
        userAnalytics: {
          enabled: true,
          anonymousOnly: true, // 불교 원칙: 개인정보 최소화
          trackingConsent: true
        }
      });
      
      console.log('🛡️ 모니터링 시스템 초기화 완료');
    }

    // 3. Internationalization and Accessibility
    console.log('🌍 다국어 및 접근성 시스템 초기화...');
    // i18n and a11y are already initialized in their modules
    console.log('✅ 다국어 및 접근성 시스템 준비 완료');

    // 4. Track initial page load
    if (typeof window !== 'undefined' && window.performance) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          const paintEntries = performance.getEntriesByType('paint');
          
          if (navigation && process.env.NODE_ENV === 'production') {
            // Report initial performance metrics
            const metrics = {
              loadComplete: navigation.loadEventEnd - navigation.navigationStart,
              domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
              firstPaint: paintEntries.find(entry => entry.name === 'first-paint')?.startTime,
              firstContentfulPaint: paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime,
            };
            
            console.log('📈 초기 성능 지표:', metrics);
          }
        }, 0);
      });
    }

    console.log('🎉 불교 커뮤니티 초기화 완료!');
    
  } catch (error) {
    console.error('❌ 시스템 초기화 실패:', error);
    
    // Even if initialization fails, we should still render the app
    // but with reduced functionality
  }
};

// Initialize systems
initializeProductionSystems();

// Error boundary for the entire app
class BuddhistErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 불교 커뮤니티 오류:', error);
    console.error('오류 정보:', errorInfo);
    
    // Report error to monitoring system
    if (typeof window !== 'undefined' && (window as any).__buddhist_monitoring) {
      const { errorMonitor } = (window as any).__buddhist_monitoring;
      errorMonitor?.reportError(error, {
        componentStack: errorInfo.componentStack,
        errorBoundary: 'BuddhistErrorBoundary'
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="max-w-md w-full mx-4">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="text-6xl mb-4">🪷</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                잠시 문제가 발생했습니다
              </h1>
              <p className="text-gray-600 mb-6 leading-relaxed">
                불교 커뮤니티에 일시적인 문제가 발생했습니다.<br />
                마음을 차분히 가라앉히고 잠시 후 다시 시도해주세요.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  페이지 새로고침
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  홈으로 돌아가기
                </button>
              </div>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                    개발자 정보 (개발 모드)
                  </summary>
                  <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto max-h-32">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Main app initialization
const initializeApp = () => {
  const container = document.getElementById('root');
  
  if (!container) {
    console.error('❌ Root 컨테이너를 찾을 수 없습니다');
    return;
  }

  // Ensure main content has proper accessibility attributes
  container.setAttribute('role', 'main');
  container.setAttribute('id', 'main-content');

  const root = ReactDOM.createRoot(container);
  
  root.render(
    <React.StrictMode>
      <BuddhistErrorBoundary>
        <App />
      </BuddhistErrorBoundary>
    </React.StrictMode>
  );

  console.log('🪷 불교 커뮤니티 렌더링 완료');
};

// Initialize the app
initializeApp();

// Analytics page view tracking
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      if ((window as any).__buddhist_monitoring?.analytics) {
        const analytics = (window as any).__buddhist_monitoring.analytics;
        analytics.trackPageView('/', {
          referrer: document.referrer,
          userAgent: navigator.userAgent,
          language: navigator.language,
          timestamp: new Date().toISOString()
        });
      }
    }, 1000);
  });
}

// Handle visibility changes for analytics
document.addEventListener('visibilitychange', () => {
  if (process.env.NODE_ENV === 'production' && (window as any).__buddhist_monitoring?.analytics) {
    const analytics = (window as any).__buddhist_monitoring.analytics;
    
    if (document.visibilityState === 'hidden') {
      analytics.trackBuddhistEvent('session_pause');
    } else if (document.visibilityState === 'visible') {
      analytics.trackBuddhistEvent('session_resume');
    }
  }
});

// Handle app lifecycle for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('beforeunload', () => {
    // Track session end
    if (process.env.NODE_ENV === 'production' && (window as any).__buddhist_monitoring?.analytics) {
      const analytics = (window as any).__buddhist_monitoring.analytics;
      analytics.trackBuddhistEvent('session_end');
    }
  });
}

console.log('🎋 불교 커뮤니티가 평화롭게 시작되었습니다');