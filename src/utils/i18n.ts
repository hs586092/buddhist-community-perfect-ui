// Internationalization and accessibility utilities
// 다국어 지원 및 접근성 유틸리티

export type SupportedLanguage = 'ko' | 'en' | 'zh' | 'ja';

export interface TranslationKeys {
  // Navigation
  'nav.home': string;
  'nav.review': string;
  'nav.community': string;
  'nav.about': string;
  
  // Common
  'common.loading': string;
  'common.error': string;
  'common.retry': string;
  'common.save': string;
  'common.cancel': string;
  'common.submit': string;
  'common.back': string;
  'common.next': string;
  
  // Buddhist terms
  'buddhist.temple': string;
  'buddhist.dharma': string;
  'buddhist.sangha': string;
  'buddhist.beginner': string;
  'buddhist.practitioner': string;
  'buddhist.veteran': string;
  'buddhist.meditation': string;
  'buddhist.mindfulness': string;
  
  // Review section
  'review.title': string;
  'review.write': string;
  'review.rating': string;
  'review.content': string;
  'review.submit': string;
  'review.temple_name': string;
  'review.dharma_talk_rating': string;
  'review.temple_atmosphere': string;
  
  // Community section
  'community.title': string;
  'community.send_message': string;
  'community.typing': string;
  'community.online_users': string;
  'community.message_placeholder': string;
  
  // Emotions
  'emotion.peaceful': string;
  'emotion.grateful': string;
  'emotion.contemplative': string;
  'emotion.joyful': string;
  'emotion.serene': string;
  'emotion.compassionate': string;
  
  // Accessibility
  'a11y.skip_to_content': string;
  'a11y.menu_toggle': string;
  'a11y.close_dialog': string;
  'a11y.font_size_increase': string;
  'a11y.font_size_decrease': string;
  'a11y.high_contrast': string;
  'a11y.screen_reader_only': string;
}

// Korean translations (default)
const translations_ko: TranslationKeys = {
  // Navigation
  'nav.home': '홈',
  'nav.review': '법회 리뷰',
  'nav.community': '불자 소통',
  'nav.about': '소개',
  
  // Common
  'common.loading': '로딩 중...',
  'common.error': '오류가 발생했습니다',
  'common.retry': '다시 시도',
  'common.save': '저장',
  'common.cancel': '취소',
  'common.submit': '제출',
  'common.back': '뒤로',
  'common.next': '다음',
  
  // Buddhist terms
  'buddhist.temple': '사찰',
  'buddhist.dharma': '법문',
  'buddhist.sangha': '승가',
  'buddhist.beginner': '입문자',
  'buddhist.practitioner': '수행자',
  'buddhist.veteran': '오랜불자',
  'buddhist.meditation': '명상',
  'buddhist.mindfulness': '마음챙김',
  
  // Review section
  'review.title': '법회 리뷰',
  'review.write': '리뷰 작성',
  'review.rating': '평점',
  'review.content': '내용',
  'review.submit': '리뷰 제출',
  'review.temple_name': '사찰명',
  'review.dharma_talk_rating': '법문 평점',
  'review.temple_atmosphere': '사찰 분위기',
  
  // Community section
  'community.title': '불자 소통',
  'community.send_message': '메시지 보내기',
  'community.typing': '입력 중...',
  'community.online_users': '접속 중인 불자',
  'community.message_placeholder': '따뜻한 마음으로 메시지를 입력해주세요...',
  
  // Emotions
  'emotion.peaceful': '평화로운',
  'emotion.grateful': '감사한',
  'emotion.contemplative': '사색적인',
  'emotion.joyful': '기쁜',
  'emotion.serene': '고요한',
  'emotion.compassionate': '자비로운',
  
  // Accessibility
  'a11y.skip_to_content': '본문으로 바로가기',
  'a11y.menu_toggle': '메뉴 열기/닫기',
  'a11y.close_dialog': '대화창 닫기',
  'a11y.font_size_increase': '글자 크기 키우기',
  'a11y.font_size_decrease': '글자 크기 줄이기',
  'a11y.high_contrast': '고대비 모드',
  'a11y.screen_reader_only': '스크린 리더 전용',
};

// English translations
const translations_en: TranslationKeys = {
  // Navigation
  'nav.home': 'Home',
  'nav.review': 'Dharma Reviews',
  'nav.community': 'Buddhist Community',
  'nav.about': 'About',
  
  // Common
  'common.loading': 'Loading...',
  'common.error': 'An error occurred',
  'common.retry': 'Retry',
  'common.save': 'Save',
  'common.cancel': 'Cancel',
  'common.submit': 'Submit',
  'common.back': 'Back',
  'common.next': 'Next',
  
  // Buddhist terms
  'buddhist.temple': 'Temple',
  'buddhist.dharma': 'Dharma',
  'buddhist.sangha': 'Sangha',
  'buddhist.beginner': 'Beginner',
  'buddhist.practitioner': 'Practitioner',
  'buddhist.veteran': 'Veteran',
  'buddhist.meditation': 'Meditation',
  'buddhist.mindfulness': 'Mindfulness',
  
  // Review section
  'review.title': 'Dharma Reviews',
  'review.write': 'Write Review',
  'review.rating': 'Rating',
  'review.content': 'Content',
  'review.submit': 'Submit Review',
  'review.temple_name': 'Temple Name',
  'review.dharma_talk_rating': 'Dharma Talk Rating',
  'review.temple_atmosphere': 'Temple Atmosphere',
  
  // Community section
  'community.title': 'Buddhist Community',
  'community.send_message': 'Send Message',
  'community.typing': 'Typing...',
  'community.online_users': 'Online Practitioners',
  'community.message_placeholder': 'Type your message with loving-kindness...',
  
  // Emotions
  'emotion.peaceful': 'Peaceful',
  'emotion.grateful': 'Grateful',
  'emotion.contemplative': 'Contemplative',
  'emotion.joyful': 'Joyful',
  'emotion.serene': 'Serene',
  'emotion.compassionate': 'Compassionate',
  
  // Accessibility
  'a11y.skip_to_content': 'Skip to main content',
  'a11y.menu_toggle': 'Toggle menu',
  'a11y.close_dialog': 'Close dialog',
  'a11y.font_size_increase': 'Increase font size',
  'a11y.font_size_decrease': 'Decrease font size',
  'a11y.high_contrast': 'High contrast mode',
  'a11y.screen_reader_only': 'Screen reader only',
};

// Chinese translations (simplified)
const translations_zh: TranslationKeys = {
  // Navigation
  'nav.home': '首页',
  'nav.review': '法会评论',
  'nav.community': '佛友交流',
  'nav.about': '关于',
  
  // Common
  'common.loading': '加载中...',
  'common.error': '发生错误',
  'common.retry': '重试',
  'common.save': '保存',
  'common.cancel': '取消',
  'common.submit': '提交',
  'common.back': '返回',
  'common.next': '下一步',
  
  // Buddhist terms
  'buddhist.temple': '寺院',
  'buddhist.dharma': '佛法',
  'buddhist.sangha': '僧伽',
  'buddhist.beginner': '初学者',
  'buddhist.practitioner': '修行者',
  'buddhist.veteran': '老居士',
  'buddhist.meditation': '禅修',
  'buddhist.mindfulness': '正念',
  
  // Review section
  'review.title': '法会评论',
  'review.write': '写评论',
  'review.rating': '评分',
  'review.content': '内容',
  'review.submit': '提交评论',
  'review.temple_name': '寺院名称',
  'review.dharma_talk_rating': '法谈评分',
  'review.temple_atmosphere': '寺院氛围',
  
  // Community section
  'community.title': '佛友交流',
  'community.send_message': '发送消息',
  'community.typing': '正在输入...',
  'community.online_users': '在线佛友',
  'community.message_placeholder': '请以慈悲心输入消息...',
  
  // Emotions
  'emotion.peaceful': '平静',
  'emotion.grateful': '感恩',
  'emotion.contemplative': '沉思',
  'emotion.joyful': '喜悦',
  'emotion.serene': '宁静',
  'emotion.compassionate': '慈悲',
  
  // Accessibility
  'a11y.skip_to_content': '跳转到主要内容',
  'a11y.menu_toggle': '切换菜单',
  'a11y.close_dialog': '关闭对话框',
  'a11y.font_size_increase': '增大字体',
  'a11y.font_size_decrease': '减小字体',
  'a11y.high_contrast': '高对比度模式',
  'a11y.screen_reader_only': '仅屏幕阅读器',
};

// Japanese translations
const translations_ja: TranslationKeys = {
  // Navigation
  'nav.home': 'ホーム',
  'nav.review': '法話レビュー',
  'nav.community': '仏教徒コミュニティ',
  'nav.about': '紹介',
  
  // Common
  'common.loading': '読み込み中...',
  'common.error': 'エラーが発生しました',
  'common.retry': '再試行',
  'common.save': '保存',
  'common.cancel': 'キャンセル',
  'common.submit': '送信',
  'common.back': '戻る',
  'common.next': '次へ',
  
  // Buddhist terms
  'buddhist.temple': '寺院',
  'buddhist.dharma': '法話',
  'buddhist.sangha': '僧伽',
  'buddhist.beginner': '初心者',
  'buddhist.practitioner': '修行者',
  'buddhist.veteran': 'ベテラン',
  'buddhist.meditation': '瞑想',
  'buddhist.mindfulness': 'マインドフルネス',
  
  // Review section
  'review.title': '法話レビュー',
  'review.write': 'レビューを書く',
  'review.rating': '評価',
  'review.content': '内容',
  'review.submit': 'レビュー送信',
  'review.temple_name': '寺院名',
  'review.dharma_talk_rating': '法話評価',
  'review.temple_atmosphere': '寺院の雰囲気',
  
  // Community section
  'community.title': '仏教徒コミュニティ',
  'community.send_message': 'メッセージ送信',
  'community.typing': '入力中...',
  'community.online_users': 'オンライン仏教徒',
  'community.message_placeholder': '慈愛の心でメッセージを入力してください...',
  
  // Emotions
  'emotion.peaceful': '平和',
  'emotion.grateful': '感謝',
  'emotion.contemplative': '瞑想的',
  'emotion.joyful': '喜び',
  'emotion.serene': '静寂',
  'emotion.compassionate': '慈悲',
  
  // Accessibility
  'a11y.skip_to_content': 'メインコンテンツへスキップ',
  'a11y.menu_toggle': 'メニュー切り替え',
  'a11y.close_dialog': 'ダイアログを閉じる',
  'a11y.font_size_increase': 'フォントサイズを大きく',
  'a11y.font_size_decrease': 'フォントサイズを小さく',
  'a11y.high_contrast': 'ハイコントラストモード',
  'a11y.screen_reader_only': 'スクリーンリーダー専用',
};

// Translation collections
const translations = {
  ko: translations_ko,
  en: translations_en,
  zh: translations_zh,
  ja: translations_ja,
} as const;

// I18n manager class
export class BuddhistI18nManager {
  private currentLanguage: SupportedLanguage = 'ko';
  private translations = translations;
  
  constructor() {
    this.loadSavedLanguage();
  }
  
  private loadSavedLanguage() {
    const saved = localStorage.getItem('buddhist_language') as SupportedLanguage;
    if (saved && this.isValidLanguage(saved)) {
      this.currentLanguage = saved;
    } else {
      // Detect browser language
      const browserLang = navigator.language.substring(0, 2) as SupportedLanguage;
      if (this.isValidLanguage(browserLang)) {
        this.currentLanguage = browserLang;
      }
    }
    
    // Update document language
    document.documentElement.lang = this.currentLanguage;
  }
  
  private isValidLanguage(lang: string): lang is SupportedLanguage {
    return ['ko', 'en', 'zh', 'ja'].includes(lang);
  }
  
  public setLanguage(language: SupportedLanguage) {
    this.currentLanguage = language;
    localStorage.setItem('buddhist_language', language);
    document.documentElement.lang = language;
    
    // Dispatch language change event
    window.dispatchEvent(new CustomEvent('languagechange', { 
      detail: { language } 
    }));
  }
  
  public getCurrentLanguage(): SupportedLanguage {
    return this.currentLanguage;
  }
  
  public translate(key: keyof TranslationKeys, params?: Record<string, string>): string {
    let translation = this.translations[this.currentLanguage][key];
    
    // Fallback to Korean if translation is missing
    if (!translation) {
      translation = this.translations.ko[key];
    }
    
    // Fallback to key if still missing
    if (!translation) {
      translation = key;
    }
    
    // Replace parameters
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(`{{${param}}}`, value);
      });
    }
    
    return translation;
  }
  
  public getAvailableLanguages(): Array<{
    code: SupportedLanguage;
    name: string;
    nativeName: string;
  }> {
    return [
      { code: 'ko', name: 'Korean', nativeName: '한국어' },
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'zh', name: 'Chinese', nativeName: '中文' },
      { code: 'ja', name: 'Japanese', nativeName: '日本語' },
    ];
  }
  
  public isRTL(): boolean {
    // None of our supported languages are RTL, but this could be extended
    return false;
  }
  
  public formatNumber(num: number): string {
    try {
      return new Intl.NumberFormat(this.getLocaleCode()).format(num);
    } catch {
      return num.toString();
    }
  }
  
  public formatDate(date: Date): string {
    try {
      return new Intl.DateTimeFormat(this.getLocaleCode(), {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(date);
    } catch {
      return date.toLocaleDateString();
    }
  }
  
  public formatTime(date: Date): string {
    try {
      return new Intl.DateTimeFormat(this.getLocaleCode(), {
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return date.toLocaleTimeString();
    }
  }
  
  private getLocaleCode(): string {
    const localeMap = {
      ko: 'ko-KR',
      en: 'en-US',
      zh: 'zh-CN',
      ja: 'ja-JP',
    };
    return localeMap[this.currentLanguage];
  }
}

// Accessibility manager
export class AccessibilityManager {
  private fontSize: 'small' | 'medium' | 'large' | 'extra-large' = 'medium';
  private highContrast: boolean = false;
  private reducedMotion: boolean = false;
  
  constructor() {
    this.loadAccessibilitySettings();
    this.detectSystemPreferences();
    this.initializeAccessibility();
  }
  
  private loadAccessibilitySettings() {
    const fontSize = localStorage.getItem('buddhist_font_size') as typeof this.fontSize;
    if (fontSize) {
      this.fontSize = fontSize;
    }
    
    this.highContrast = localStorage.getItem('buddhist_high_contrast') === 'true';
    this.reducedMotion = localStorage.getItem('buddhist_reduced_motion') === 'true';
  }
  
  private detectSystemPreferences() {
    // Detect system reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.reducedMotion = true;
    }
    
    // Detect system high contrast preference
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      this.highContrast = true;
    }
    
    // Listen for changes
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      this.reducedMotion = e.matches;
      this.applyAccessibilitySettings();
    });
    
    window.matchMedia('(prefers-contrast: high)').addEventListener('change', (e) => {
      this.highContrast = e.matches;
      this.applyAccessibilitySettings();
    });
  }
  
  private initializeAccessibility() {
    this.applyAccessibilitySettings();
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
  }
  
  private applyAccessibilitySettings() {
    const root = document.documentElement;
    
    // Font size
    root.setAttribute('data-font-size', this.fontSize);
    
    // High contrast
    root.setAttribute('data-high-contrast', this.highContrast.toString());
    
    // Reduced motion
    root.setAttribute('data-reduced-motion', this.reducedMotion.toString());
    
    // Apply CSS custom properties
    const fontSizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px',
      'extra-large': '20px'
    };
    
    root.style.setProperty('--base-font-size', fontSizeMap[this.fontSize]);
  }
  
  private setupKeyboardNavigation() {
    // Skip to content link
    this.createSkipLink();
    
    // Escape key handler for dialogs
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        const activeDialog = document.querySelector('[role="dialog"][aria-hidden="false"]');
        if (activeDialog) {
          this.closeDialog(activeDialog as HTMLElement);
        }
      }
    });
    
    // Tab trapping for modals
    document.addEventListener('keydown', this.handleTabTrapping.bind(this));
  }
  
  private createSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = i18n.translate('a11y.skip_to_content');
    skipLink.className = 'skip-link sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded';
    
    document.body.insertBefore(skipLink, document.body.firstChild);
  }
  
  private setupFocusManagement() {
    // Visible focus indicators
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Tab') {
        document.body.setAttribute('data-focus-source', 'keyboard');
      }
    });
    
    document.addEventListener('mousedown', () => {
      document.body.setAttribute('data-focus-source', 'mouse');
    });
  }
  
  private handleTabTrapping(event: KeyboardEvent) {
    if (event.key !== 'Tab') return;
    
    const activeModal = document.querySelector('[role="dialog"][aria-hidden="false"]');
    if (!activeModal) return;
    
    const focusableElements = activeModal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }
  
  private closeDialog(dialog: HTMLElement) {
    dialog.setAttribute('aria-hidden', 'true');
    
    // Return focus to trigger element
    const triggerElement = document.querySelector('[data-dialog-trigger]') as HTMLElement;
    if (triggerElement) {
      triggerElement.focus();
    }
  }
  
  public setFontSize(size: typeof this.fontSize) {
    this.fontSize = size;
    localStorage.setItem('buddhist_font_size', size);
    this.applyAccessibilitySettings();
    
    // Announce change to screen readers
    this.announceToScreenReader(`Font size changed to ${size}`);
  }
  
  public toggleHighContrast() {
    this.highContrast = !this.highContrast;
    localStorage.setItem('buddhist_high_contrast', this.highContrast.toString());
    this.applyAccessibilitySettings();
    
    this.announceToScreenReader(
      this.highContrast ? 'High contrast enabled' : 'High contrast disabled'
    );
  }
  
  public toggleReducedMotion() {
    this.reducedMotion = !this.reducedMotion;
    localStorage.setItem('buddhist_reduced_motion', this.reducedMotion.toString());
    this.applyAccessibilitySettings();
    
    this.announceToScreenReader(
      this.reducedMotion ? 'Reduced motion enabled' : 'Reduced motion disabled'
    );
  }
  
  private announceToScreenReader(message: string) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }
  
  public getSettings() {
    return {
      fontSize: this.fontSize,
      highContrast: this.highContrast,
      reducedMotion: this.reducedMotion,
    };
  }
}

// Global instances
export const i18n = new BuddhistI18nManager();
export const a11y = new AccessibilityManager();

// Hook for React components
export const useTranslation = () => {
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);
  
  React.useEffect(() => {
    const handleLanguageChange = () => forceUpdate();
    window.addEventListener('languagechange', handleLanguageChange);
    return () => window.removeEventListener('languagechange', handleLanguageChange);
  }, []);
  
  return {
    t: (key: keyof TranslationKeys, params?: Record<string, string>) => 
      i18n.translate(key, params),
    language: i18n.getCurrentLanguage(),
    setLanguage: i18n.setLanguage.bind(i18n),
    availableLanguages: i18n.getAvailableLanguages(),
  };
};

export default {
  i18n,
  a11y,
  useTranslation,
  BuddhistI18nManager,
  AccessibilityManager,
};