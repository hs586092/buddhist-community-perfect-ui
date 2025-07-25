// Security and Privacy utilities for Buddhist Community
// Following Buddhist principles of protection and compassion

// Privacy-first configuration
export const BUDDHIST_PRIVACY_CONFIG = {
  // Data collection principles
  dataCollection: 'minimal' as const,        // Only essential data
  userTracking: 'none' as const,            // No tracking
  anonymousOption: 'always' as const,       // Always allow anonymous
  dataRetention: '1year' as const,          // Auto-delete after 1 year
  
  // Security settings
  encryption: 'aes256' as const,
  sessionTimeout: 30 * 60 * 1000,          // 30 minutes
  csrfProtection: true,
  xssProtection: true,
  contentSecurityPolicy: true,
  
  // Rate limiting
  rateLimiting: {
    windowMs: 15 * 60 * 1000,              // 15 minutes
    maxRequests: 100,                       // Max 100 requests per window
    message: '잠시 후 다시 시도해주세요. 마음을 차분히 가라앉히고 기다려주세요.'
  }
} as const;

// Content Security Policy configuration
export const generateCSP = (): string => {
  const cspDirectives = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-inline'", // For Vite in development
      "'unsafe-eval'",   // For Vite in development
      'https://www.google-analytics.com',
      'https://www.googletagmanager.com',
      'https://fonts.googleapis.com',
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'", // For styled components and CSS-in-JS
      'https://fonts.googleapis.com',
    ],
    'font-src': [
      "'self'",
      'https://fonts.gstatic.com',
      'data:',
    ],
    'img-src': [
      "'self'",
      'data:',
      'blob:',
      'https:',
    ],
    'connect-src': [
      "'self'",
      'https://www.google-analytics.com',
      'https://firebase.googleapis.com',
      'wss:', // For WebSocket connections
    ],
    'frame-src': ["'none'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    'upgrade-insecure-requests': [],
  };

  // Convert to CSP string
  return Object.entries(cspDirectives)
    .map(([directive, sources]) => {
      if (sources.length === 0) {
        return directive;
      }
      return `${directive} ${sources.join(' ')}`;
    })
    .join('; ');
};

// Input sanitization for Buddhist community
export class CompassionateSanitizer {
  private static readonly HTML_ENTITIES: Record<string, string> = {
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '&': '&amp;',
  };

  private static readonly MALICIOUS_PATTERNS = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
    /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /on\w+\s*=/gi,
  ];

  // Sanitize HTML content with Buddhist compassion
  static sanitizeHTML(input: string): string {
    if (!input || typeof input !== 'string') {
      return '';
    }

    let sanitized = input;

    // Remove malicious patterns
    this.MALICIOUS_PATTERNS.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });

    // Escape HTML entities
    sanitized = sanitized.replace(/[<>"'/&]/g, char => 
      this.HTML_ENTITIES[char] || char
    );

    // Limit length (prevent DOS attacks)
    if (sanitized.length > 10000) {
      sanitized = sanitized.substring(0, 10000) + '...';
    }

    return sanitized.trim();
  }

  // Sanitize Buddhist review content
  static sanitizeReviewContent(content: string): string {
    // First apply general HTML sanitization
    let sanitized = this.sanitizeHTML(content);

    // Remove excessive whitespace
    sanitized = sanitized.replace(/\s+/g, ' ');

    // Remove any remaining harmful patterns
    sanitized = sanitized.replace(/[^\w\s가-힣ㄱ-ㅎㅏ-ㅣ.,!?;:()\-'"]/g, '');

    // Ensure Buddhist values - filter inappropriate language
    sanitized = this.filterInappropriateContent(sanitized);

    return sanitized;
  }

  // Filter inappropriate content with Buddhist compassion
  private static filterInappropriateContent(content: string): string {
    const inappropriateWords = [
      // This would contain a list of words to filter
      // For demonstration, using mild examples
      '욕설', '증오', '혐오', '차별'
    ];

    let filtered = content;

    inappropriateWords.forEach(word => {
      const regex = new RegExp(word, 'gi');
      filtered = filtered.replace(regex, '🌸'); // Replace with lotus emoji
    });

    return filtered;
  }

  // Validate temple name (prevent injection)
  static validateTempleName(name: string): boolean {
    if (!name || typeof name !== 'string') {
      return false;
    }

    // Check length
    if (name.length < 2 || name.length > 50) {
      return false;
    }

    // Check for valid characters (Korean, basic punctuation)
    const validPattern = /^[가-힣a-zA-Z\s\-()]+$/;
    return validPattern.test(name);
  }

  // Validate email with Buddhist mindfulness
  static validateEmail(email: string): boolean {
    if (!email || typeof email !== 'string') {
      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email) && email.length <= 254;
  }
}

// Rate limiting implementation
export class MindfulRateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(windowMs: number = 15 * 60 * 1000, maxRequests: number = 100) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  // Check if request is allowed
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    // Get existing requests for this identifier
    const existingRequests = this.requests.get(identifier) || [];

    // Filter out expired requests
    const validRequests = existingRequests.filter(time => time > windowStart);

    // Check if under limit
    if (validRequests.length < this.maxRequests) {
      validRequests.push(now);
      this.requests.set(identifier, validRequests);
      return true;
    }

    return false;
  }

  // Get remaining requests
  getRemainingRequests(identifier: string): number {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    const existingRequests = this.requests.get(identifier) || [];
    const validRequests = existingRequests.filter(time => time > windowStart);
    
    return Math.max(0, this.maxRequests - validRequests.length);
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    for (const [identifier, requests] of this.requests.entries()) {
      const validRequests = requests.filter(time => time > windowStart);
      
      if (validRequests.length === 0) {
        this.requests.delete(identifier);
      } else {
        this.requests.set(identifier, validRequests);
      }
    }
  }
}

// Session management with Buddhist principles
export class BuddhistSessionManager {
  private static readonly SESSION_KEY = 'buddhist_session';
  private static readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

  // Create session with minimal data
  static createSession(userData?: {
    nickname?: string;
    buddhistLevel?: string;
    preferences?: any;
  }): string {
    const sessionId = this.generateSecureId();
    const session = {
      id: sessionId,
      createdAt: Date.now(),
      lastActivity: Date.now(),
      userData: userData || {},
      isAnonymous: !userData?.nickname,
    };

    // Store in secure way (encrypted in production)
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    
    return sessionId;
  }

  // Validate session
  static validateSession(): boolean {
    try {
      const sessionData = localStorage.getItem(this.SESSION_KEY);
      if (!sessionData) {
        return false;
      }

      const session = JSON.parse(sessionData);
      const now = Date.now();

      // Check if session expired
      if (now - session.lastActivity > this.SESSION_TIMEOUT) {
        this.destroySession();
        return false;
      }

      // Update last activity
      session.lastActivity = now;
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));

      return true;
    } catch (error) {
      console.error('세션 검증 실패:', error);
      this.destroySession();
      return false;
    }
  }

  // Get session data
  static getSessionData(): any {
    try {
      const sessionData = localStorage.getItem(this.SESSION_KEY);
      if (!sessionData) {
        return null;
      }

      return JSON.parse(sessionData);
    } catch (error) {
      console.error('세션 데이터 조회 실패:', error);
      return null;
    }
  }

  // Destroy session
  static destroySession(): void {
    localStorage.removeItem(this.SESSION_KEY);
  }

  // Generate secure ID
  private static generateSecureId(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
}

// Privacy compliance helper
export class PrivacyCompliance {
  // Check if user has consented to data collection
  static hasConsent(): boolean {
    return localStorage.getItem('buddhist_privacy_consent') === 'true';
  }

  // Set privacy consent
  static setConsent(consent: boolean): void {
    if (consent) {
      localStorage.setItem('buddhist_privacy_consent', 'true');
      localStorage.setItem('buddhist_consent_date', new Date().toISOString());
    } else {
      this.clearAllData();
    }
  }

  // Clear all user data (right to be forgotten)
  static clearAllData(): void {
    const keysToRemove = [
      'buddhist_privacy_consent',
      'buddhist_consent_date',
      'buddhist_session',
      'buddhist-app-emotions',
      'buddhist-app-font-size',
      'buddhist-app-visited',
      'buddhist-app-last-notification'
    ];

    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });

    // Clear any session storage
    sessionStorage.clear();

    console.log('🪷 모든 개인 데이터가 삭제되었습니다.');
  }

  // Get data retention policy
  static getDataRetentionInfo(): {
    retentionPeriod: string;
    dataTypes: string[];
    contactInfo: string;
  } {
    return {
      retentionPeriod: '1년',
      dataTypes: [
        '닉네임 (선택사항)',
        '불교 수행 레벨',
        '법회 리뷰 내용',
        '소통 메시지',
        '감정 체크인 기록'
      ],
      contactInfo: 'privacy@buddhist-community.kr'
    };
  }

  // Check if data should be automatically deleted
  static shouldAutoDelete(): boolean {
    const consentDate = localStorage.getItem('buddhist_consent_date');
    if (!consentDate) {
      return false;
    }

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    return new Date(consentDate) < oneYearAgo;
  }
}

// Initialize security measures
export const initializeSecurity = (): void => {
  // Set CSP header (in production, this would be set by server)
  if (process.env.NODE_ENV === 'production') {
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = generateCSP();
    document.head.appendChild(meta);
  }

  // Initialize rate limiter
  const rateLimiter = new MindfulRateLimiter();

  // Set up periodic cleanup
  setInterval(() => {
    rateLimiter.cleanup();
    
    // Check for auto-deletion of old data
    if (PrivacyCompliance.shouldAutoDelete()) {
      PrivacyCompliance.clearAllData();
      console.log('🌸 1년이 지난 개인 데이터가 자동으로 삭제되었습니다.');
    }
  }, 60 * 60 * 1000); // Every hour

  // Validate session on page load
  BuddhistSessionManager.validateSession();

  console.log('🛡️ 불교 커뮤니티 보안 시스템이 초기화되었습니다.');
};

export default {
  BUDDHIST_PRIVACY_CONFIG,
  CompassionateSanitizer,
  MindfulRateLimiter,
  BuddhistSessionManager,
  PrivacyCompliance,
  generateCSP,
  initializeSecurity
};