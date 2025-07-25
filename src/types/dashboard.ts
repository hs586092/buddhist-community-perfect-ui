/**
 * Dashboard Types - Apple/Material You Design System
 *
 * Features:
 * - Dynamic color theming (Material You)
 * - iOS-style component architecture
 * - Buddhist community data structures
 * - Performance monitoring
 * - Responsive design system
 */

export interface DharmaQuote {
  id: string;
  text: string;
  author: string;
  source?: string;
  category: 'wisdom' | 'compassion' | 'mindfulness' | 'enlightenment';
  language: string;
  isDaily?: boolean;
  imageUrl?: string;
  audioUrl?: string;
}

export interface MeditationSession {
  id: string;
  duration: number; // minutes
  type: 'guided' | 'silent' | 'walking' | 'loving-kindness' | 'vipassana';
  completedAt: string;
  rating?: number; // 1-5
  notes?: string;
  teacher?: {
    id: string;
    name: string;
    avatar: string;
  };
}

export interface MeditationStreak {
  currentStreak: number;
  longestStreak: number;
  totalSessions: number;
  streakStartDate: string;
  lastSessionDate: string;
  weeklyGoal: number;
  monthlyGoal: number;
  streakHistory: Array<{
    date: string;
    completed: boolean;
    duration?: number;
  }>;
}

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  type: 'meditation' | 'teaching' | 'ceremony' | 'retreat' | 'discussion';
  startDate: string;
  endDate: string;
  location: {
    type: 'physical' | 'virtual' | 'hybrid';
    name: string;
    address?: string;
    coordinates?: { lat: number; lng: number };
    virtualLink?: string;
  };
  capacity: number;
  registered: number;
  waitlist: number;
  teacher?: {
    id: string;
    name: string;
    title: string;
    avatar: string;
    bio: string;
  };
  temple: {
    id: string;
    name: string;
    avatar: string;
  };
  price?: {
    amount: number;
    currency: string;
    isDonation: boolean;
  };
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'all-levels';
  language: string;
  isRecurring: boolean;
  recurringPattern?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    daysOfWeek?: number[];
    endDate?: string;
  };
  registrationDeadline?: string;
  cancellationPolicy?: string;
  materials?: string[];
  prerequisites?: string[];
}

export interface ActivityFeedItem {
  id: string;
  type: 'meditation' | 'event' | 'review' | 'achievement' | 'milestone' | 'teaching';
  title: string;
  description: string;
  timestamp: string;
  user: {
    id: string;
    name: string;
    avatar: string;
    wisdomLevel: 'novice' | 'practitioner' | 'adept' | 'master';
  };
  relatedEntity?: {
    id: string;
    type: 'event' | 'temple' | 'teacher' | 'course';
    name: string;
  };
  metrics?: {
    likes: number;
    comments: number;
    shares: number;
  };
  media?: {
    type: 'image' | 'video' | 'audio';
    url: string;
    thumbnail?: string;
  };
  isPrivate: boolean;
  reactions: Array<{
    type: 'gratitude' | 'inspiration' | 'joy' | 'peace';
    count: number;
    userReacted: boolean;
  }>;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'meditation' | 'learning' | 'community' | 'wisdom' | 'service';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirements: {
    type: 'streak' | 'count' | 'duration' | 'level' | 'special';
    value: number;
    description: string;
  };
  rewards: {
    points: number;
    badge: string;
    title?: string;
  };
  unlockedAt?: string;
  progress?: {
    current: number;
    total: number;
    percentage: number;
  };
  isSecret: boolean;
}

export interface PracticeProgress {
  userId: string;
  totalMeditationTime: number; // minutes
  sessionsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  favoriteTimeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  favoriteType: string;
  weeklyGoal: number;
  monthlyGoal: number;
  yearlyGoal: number;

  // Weekly/Monthly statistics
  weeklyStats: {
    week: string; // ISO week
    sessions: number;
    totalTime: number;
    averageRating: number;
  }[];

  monthlyStats: {
    month: string; // YYYY-MM
    sessions: number;
    totalTime: number;
    averageRating: number;
    achievements: string[];
  }[];

  // Mindfulness journey stages
  journeyStage: {
    current: 'beginner' | 'developing' | 'established' | 'deepening' | 'integrated';
    startedAt: string;
    milestones: Array<{
      stage: string;
      achievedAt: string;
      description: string;
    }>;
  };
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: 'meditate' | 'journal' | 'read' | 'connect' | 'learn' | 'practice';
  shortcut?: string;
  color: string;
  isCustomizable: boolean;
  order: number;
  isVisible: boolean;
  estimatedTime?: number; // minutes
  href?: string;
  onClick?: () => void;
}

// Material You Dynamic Color System
export interface MaterialYouTheme {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;

  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;

  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;

  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;

  background: string;
  onBackground: string;
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;

  outline: string;
  outlineVariant: string;
  shadow: string;
  scrim: string;

  // Buddhist-specific colors
  lotus: string;
  dharma: string;
  sangha: string;
  karma: string;
  wisdom: string;
  compassion: string;
}

// Dashboard Layout Configuration
export interface DashboardConfig {
  layout: {
    breakpoints: {
      mobile: number;    // 320px
      tablet: number;    // 768px
      desktop: number;   // 1024px
      wide: number;      // 1440px
    };
    grid: {
      columns: number;
      gap: number;
      margin: number;
    };
    containerQueries: boolean;
  };

  widgets: {
    enabled: string[];
    positions: Record<string, {
      column: number;
      row: number;
      width: number;
      height: number;
    }>;
    customizable: boolean;
  };

  animations: {
    reduceMotion: boolean;
    duration: 'fast' | 'normal' | 'slow';
    easing: string;
  };

  accessibility: {
    highContrast: boolean;
    largeText: boolean;
    screenReader: boolean;
    keyboardNavigation: boolean;
  };
}

// Widget Types
export interface Widget {
  id: string;
  type: 'dharma-quote' | 'meditation-streak' | 'events' | 'activity-feed' | 'progress' | 'quick-actions' | 'achievements';
  title: string;
  isResizable: boolean;
  isMovable: boolean;
  isRemovable: boolean;
  minSize: { width: number; height: number };
  maxSize?: { width: number; height: number };
  defaultSize: { width: number; height: number };
  refreshInterval?: number; // seconds
  lastUpdated?: string;
  data?: any;
  settings?: Record<string, any>;
}

// Performance Monitoring
export interface PerformanceMetrics {
  coreWebVitals: {
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    firstInputDelay: number;
    cumulativeLayoutShift: number;
    timeToInteractive: number;
  };

  customMetrics: {
    widgetLoadTime: Record<string, number>;
    apiResponseTime: Record<string, number>;
    renderTime: number;
    bundleSize: number;
    memoryUsage: number;
  };

  userExperience: {
    errorRate: number;
    bounceRate: number;
    sessionDuration: number;
    pageViews: number;
    userSatisfaction: number; // 1-5 rating
  };
}

// Responsive Design Types
export type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'wide';

export interface ResponsiveValue<T> {
  mobile?: T;
  tablet?: T;
  desktop?: T;
  wide?: T;
}

export interface ComponentSize {
  padding: ResponsiveValue<string>;
  margin: ResponsiveValue<string>;
  borderRadius: ResponsiveValue<string>;
  fontSize: ResponsiveValue<string>;
}

// Animation Configuration
export interface AnimationConfig {
  type: 'spring' | 'tween' | 'keyframes';
  duration?: number;
  delay?: number;
  ease?: string | number[];
  repeat?: number | boolean;
  repeatType?: 'loop' | 'reverse' | 'mirror';
  repeatDelay?: number;
}

// Data Visualization Types
export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'heatmap' | 'timeline' | 'radial';
  data: any[];
  dimensions: {
    width: number;
    height: number;
  };
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  colors: string[];
  animate: boolean;
  interactive: boolean;
  responsive: boolean;
  accessibility: {
    title: string;
    description: string;
    labelledBy?: string;
    describedBy?: string;
  };
}
