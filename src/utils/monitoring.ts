// Production monitoring and analytics utilities
// 실제 운영을 위한 모니터링 및 분석 시스템

export interface MonitoringConfig {
  // Analytics providers
  googleAnalytics?: {
    measurementId: string;
    enabled: boolean;
  };
  
  // Error tracking
  sentry?: {
    dsn: string;
    environment: string;
    enabled: boolean;
  };
  
  // Performance monitoring
  performance: {
    enabled: boolean;
    sampleRate: number; // 0.0 to 1.0
    reportingInterval: number; // in milliseconds
  };
  
  // User analytics (privacy-compliant)
  userAnalytics: {
    enabled: boolean;
    anonymousOnly: boolean;
    trackingConsent: boolean;
  };
}

// Default configuration following Buddhist privacy principles
export const DEFAULT_MONITORING_CONFIG: MonitoringConfig = {
  performance: {
    enabled: true,
    sampleRate: 0.1, // 10% sampling for production
    reportingInterval: 30000 // 30 seconds
  },
  
  userAnalytics: {
    enabled: true,
    anonymousOnly: true, // 불교 원칙: 개인정보 최소화
    trackingConsent: true // 사용자 동의 필수
  }
};

// Error monitoring with Buddhist compassion
export class CompassionateErrorMonitor {
  private config: MonitoringConfig;
  private errorQueue: Array<{
    error: Error;
    context: any;
    timestamp: Date;
    userId?: string;
  }> = [];
  
  constructor(config: MonitoringConfig = DEFAULT_MONITORING_CONFIG) {
    this.config = config;
    this.initializeErrorHandling();
  }

  private initializeErrorHandling() {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.reportError(event.error, {
        type: 'javascript_error',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    // Promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.reportError(new Error(event.reason), {
        type: 'unhandled_promise_rejection',
        reason: event.reason
      });
    });

    // React error boundary integration
    this.setupReactErrorBoundary();
  }

  private setupReactErrorBoundary() {
    // This would integrate with React Error Boundary
    // For now, we'll provide a method to manually report React errors
  }

  public reportError(error: Error, context: any = {}) {
    try {
      const errorReport = {
        error,
        context: {
          ...context,
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          // Buddhist context - no personal information
          session: this.getAnonymousSessionId(),
          buddhist_level: this.getBuddhistLevel() // If user chose to share
        },
        timestamp: new Date(),
        userId: this.config.userAnalytics.anonymousOnly ? undefined : this.getUserId()
      };

      this.errorQueue.push(errorReport);
      
      // Log for development
      if (process.env.NODE_ENV === 'development') {
        console.error('🚨 불자 커뮤니티 오류:', error);
        console.group('오류 상세 정보');
        console.log('Context:', context);
        console.log('Stack:', error.stack);
        console.groupEnd();
      }

      // Send to monitoring service in production
      this.sendErrorReport(errorReport);
      
    } catch (monitoringError) {
      console.error('모니터링 시스템 오류:', monitoringError);
    }
  }

  private async sendErrorReport(errorReport: any) {
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    try {
      // In production, send to your error tracking service
      // Example: Sentry, LogRocket, or custom endpoint
      
      if (this.config.sentry?.enabled && this.config.sentry.dsn) {
        await this.sendToSentry(errorReport);
      }
      
      // Or send to custom endpoint
      await this.sendToCustomEndpoint(errorReport);
      
    } catch (error) {
      console.error('오류 리포트 전송 실패:', error);
    }
  }

  private async sendToSentry(errorReport: any) {
    // Sentry integration would go here
    // This is a placeholder for actual Sentry implementation
    console.log('📤 Sentry로 오류 리포트 전송:', errorReport.error.message);
  }

  private async sendToCustomEndpoint(errorReport: any) {
    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: errorReport.error.message,
          stack: errorReport.error.stack,
          context: errorReport.context,
          timestamp: errorReport.timestamp
        })
      });
    } catch (error) {
      console.error('커스텀 엔드포인트 전송 실패:', error);
    }
  }

  private getAnonymousSessionId(): string {
    // Generate or retrieve anonymous session ID
    let sessionId = sessionStorage.getItem('buddhist_anonymous_session');
    if (!sessionId) {
      sessionId = 'anon_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('buddhist_anonymous_session', sessionId);
    }
    return sessionId;
  }

  private getBuddhistLevel(): string | null {
    // Only if user voluntarily shared this information
    return localStorage.getItem('buddhist_level_shared') || null;
  }

  private getUserId(): string | undefined {
    // Only return if user explicitly consented to identification
    if (this.config.userAnalytics.anonymousOnly) {
      return undefined;
    }
    return localStorage.getItem('user_id') || undefined;
  }

  public getErrorStats() {
    return {
      totalErrors: this.errorQueue.length,
      recentErrors: this.errorQueue.slice(-10),
      errorsByType: this.groupErrorsByType()
    };
  }

  private groupErrorsByType() {
    const groups: Record<string, number> = {};
    this.errorQueue.forEach(item => {
      const type = item.context.type || 'unknown';
      groups[type] = (groups[type] || 0) + 1;
    });
    return groups;
  }
}

// User behavior analytics (privacy-first)
export class MindfulAnalytics {
  private config: MonitoringConfig;
  private events: Array<{
    event: string;
    properties: any;
    timestamp: Date;
  }> = [];

  constructor(config: MonitoringConfig = DEFAULT_MONITORING_CONFIG) {
    this.config = config;
  }

  // Track page views with minimal data
  public trackPageView(page: string, additionalData?: any) {
    if (!this.config.userAnalytics.enabled) {
      return;
    }

    const event = {
      event: 'page_view',
      properties: {
        page,
        timestamp: new Date().toISOString(),
        // Buddhist principle: minimal data collection
        ...additionalData
      },
      timestamp: new Date()
    };

    this.events.push(event);
    this.sendAnalyticsEvent(event);
  }

  // Track Buddhist community specific events
  public trackBuddhistEvent(eventType: 'review_created' | 'message_sent' | 'emotion_checked' | 'meditation_started', properties?: any) {
    if (!this.config.userAnalytics.enabled) {
      return;
    }

    const event = {
      event: `buddhist_${eventType}`,
      properties: {
        timestamp: new Date().toISOString(),
        anonymous_session: this.getAnonymousSessionId(),
        ...properties
      },
      timestamp: new Date()
    };

    this.events.push(event);
    this.sendAnalyticsEvent(event);
  }

  // Track performance metrics
  public trackPerformance(metrics: {
    lcp?: number;
    fid?: number;
    cls?: number;
    ttfb?: number;
  }) {
    if (!this.config.performance.enabled) {
      return;
    }

    const event = {
      event: 'performance_metrics',
      properties: {
        ...metrics,
        timestamp: new Date().toISOString(),
        page: window.location.pathname
      },
      timestamp: new Date()
    };

    this.events.push(event);
    this.sendAnalyticsEvent(event);
  }

  private async sendAnalyticsEvent(event: any) {
    try {
      // Check user consent
      if (this.config.userAnalytics.trackingConsent && !this.hasUserConsent()) {
        return;
      }

      // Send to Google Analytics (if configured)
      if (this.config.googleAnalytics?.enabled && this.config.googleAnalytics.measurementId) {
        await this.sendToGoogleAnalytics(event);
      }

      // Send to custom analytics endpoint
      await this.sendToCustomAnalytics(event);

    } catch (error) {
      console.error('분석 이벤트 전송 실패:', error);
    }
  }

  private async sendToGoogleAnalytics(event: any) {
    try {
      // Google Analytics 4 implementation
      if (typeof gtag !== 'undefined') {
        gtag('event', event.event, event.properties);
      }
    } catch (error) {
      console.error('Google Analytics 전송 실패:', error);
    }
  }

  private async sendToCustomAnalytics(event: any) {
    try {
      if (process.env.NODE_ENV === 'production') {
        await fetch('/api/analytics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event)
        });
      } else {
        console.log('📊 분석 이벤트:', event);
      }
    } catch (error) {
      console.error('커스텀 분석 전송 실패:', error);
    }
  }

  private hasUserConsent(): boolean {
    return localStorage.getItem('buddhist_analytics_consent') === 'true';
  }

  private getAnonymousSessionId(): string {
    let sessionId = sessionStorage.getItem('buddhist_anonymous_session');
    if (!sessionId) {
      sessionId = 'anon_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('buddhist_anonymous_session', sessionId);
    }
    return sessionId;
  }

  public setUserConsent(consent: boolean) {
    localStorage.setItem('buddhist_analytics_consent', consent.toString());
    
    if (!consent) {
      // Clear existing analytics data if user withdraws consent
      this.events = [];
      sessionStorage.removeItem('buddhist_anonymous_session');
    }
  }

  public getAnalyticsStats() {
    return {
      totalEvents: this.events.length,
      recentEvents: this.events.slice(-20),
      eventsByType: this.groupEventsByType()
    };
  }

  private groupEventsByType() {
    const groups: Record<string, number> = {};
    this.events.forEach(item => {
      groups[item.event] = (groups[item.event] || 0) + 1;
    });
    return groups;
  }
}

// Health check monitoring
export class ServiceHealthMonitor {
  private healthChecks: Array<{
    name: string;
    url: string;
    interval: number;
    lastCheck?: Date;
    status?: 'healthy' | 'unhealthy' | 'unknown';
  }> = [];

  public addHealthCheck(name: string, url: string, intervalMs: number = 60000) {
    this.healthChecks.push({
      name,
      url,
      interval: intervalMs,
      status: 'unknown'
    });

    // Start monitoring
    this.startMonitoring(name);
  }

  private startMonitoring(name: string) {
    const healthCheck = this.healthChecks.find(hc => hc.name === name);
    if (!healthCheck) return;

    const performCheck = async () => {
      try {
        const response = await fetch(healthCheck.url, {
          method: 'HEAD',
          timeout: 5000
        });
        
        healthCheck.status = response.ok ? 'healthy' : 'unhealthy';
        healthCheck.lastCheck = new Date();
        
        if (!response.ok) {
          console.warn(`🚨 서비스 건강 상태 경고: ${name} - ${response.status}`);
        }
        
      } catch (error) {
        healthCheck.status = 'unhealthy';
        healthCheck.lastCheck = new Date();
        console.error(`❌ 서비스 건강 상태 확인 실패: ${name}`, error);
      }
    };

    // Initial check
    performCheck();
    
    // Periodic checks
    setInterval(performCheck, healthCheck.interval);
  }

  public getHealthStatus() {
    return {
      services: this.healthChecks.map(hc => ({
        name: hc.name,
        status: hc.status,
        lastCheck: hc.lastCheck,
        uptime: this.calculateUptime(hc)
      })),
      overall: this.getOverallHealth()
    };
  }

  private calculateUptime(healthCheck: any): string {
    // Simplified uptime calculation
    // In production, you'd track this more comprehensively
    if (healthCheck.status === 'healthy') {
      return '99.9%';
    } else {
      return '< 99%';
    }
  }

  private getOverallHealth(): 'healthy' | 'degraded' | 'unhealthy' {
    const healthyCount = this.healthChecks.filter(hc => hc.status === 'healthy').length;
    const totalCount = this.healthChecks.length;
    
    if (healthyCount === totalCount) return 'healthy';
    if (healthyCount > totalCount * 0.5) return 'degraded';
    return 'unhealthy';
  }
}

// Initialize monitoring system
export const initializeMonitoring = (config?: Partial<MonitoringConfig>) => {
  const fullConfig = { ...DEFAULT_MONITORING_CONFIG, ...config };
  
  // Initialize error monitoring
  const errorMonitor = new CompassionateErrorMonitor(fullConfig);
  
  // Initialize analytics
  const analytics = new MindfulAnalytics(fullConfig);
  
  // Initialize health monitoring
  const healthMonitor = new ServiceHealthMonitor();
  
  // Add basic health checks
  if (process.env.NODE_ENV === 'production') {
    healthMonitor.addHealthCheck('main-site', window.location.origin);
    // Add other critical services here
  }

  // Global monitoring instance
  (window as any).__buddhist_monitoring = {
    errorMonitor,
    analytics,
    healthMonitor
  };

  console.log('🛡️ 불교 커뮤니티 모니터링 시스템이 초기화되었습니다.');
  
  return {
    errorMonitor,
    analytics,
    healthMonitor
  };
};

// Export monitoring utilities
export default {
  CompassionateErrorMonitor,
  MindfulAnalytics,
  ServiceHealthMonitor,
  initializeMonitoring,
  DEFAULT_MONITORING_CONFIG
};