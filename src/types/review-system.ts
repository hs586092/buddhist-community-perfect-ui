/**
 * Review System Types - Instagram/TikTok Level Social Experience
 *
 * Features:
 * - Media-rich reviews with photos, videos, voice notes
 * - Social interactions (gratitude, comments, shares)
 * - Follow system for temples and teachers
 * - Personalized feed algorithm
 * - Engagement metrics and karma system
 */

export interface MediaAsset {
  id: string;
  type: 'image' | 'video' | 'audio';
  url: string;
  thumbnail?: string;
  duration?: number; // for video/audio in seconds
  dimensions?: { width: number; height: number };
  size: number; // file size in bytes
  mimeType: string;
  metadata?: {
    location?: string;
    capturedAt?: string;
    device?: string;
    filters?: string[];
  };
}

export interface VoiceNote {
  id: string;
  audioUrl: string;
  duration: number;
  waveform: number[]; // for visualization
  transcript?: string; // auto-generated or manual
  language: string;
  quality: 'low' | 'medium' | 'high';
}

export interface RichContent {
  type: 'text' | 'emoji' | 'mention' | 'hashtag' | 'quote';
  content: string;
  attributes?: {
    bold?: boolean;
    italic?: boolean;
    color?: string;
    size?: 'small' | 'medium' | 'large';
    link?: string;
  };
}

export interface DharmaReview {
  id: string;

  // Content
  title?: string;
  content: RichContent[];
  media: MediaAsset[];
  voiceNote?: VoiceNote;

  // Event Details
  eventId?: string;
  eventTitle: string;
  eventDate: string;
  temple: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
  };
  teacher?: {
    id: string;
    name: string;
    title: string;
    avatar: string;
    verified: boolean;
  };

  // Author
  author: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    verified: boolean;
    isFollowing?: boolean;
    karma: number;
    wisdomLevel: 'novice' | 'practitioner' | 'adept' | 'master';
  };

  // Engagement
  metrics: {
    gratitude: number; // instead of likes
    comments: number;
    shares: number;
    views: number;
    readingTime: number; // estimated in seconds
    wisdomPoints: number; // for helpful reviews
    accessibilityScore: number; // 0-100
  };

  // User Interactions
  userInteractions: {
    hasGratitude: boolean;
    hasBookmarked: boolean;
    hasShared: boolean;
    hasReported: boolean;
  };

  // Moderation & Quality
  moderationStatus: 'pending' | 'approved' | 'rejected' | 'flagged';
  qualityScore: number; // 0-100
  tags: string[];
  hashtags: string[];
  mentions: string[];

  // Metadata
  createdAt: string;
  updatedAt: string;
  editHistory?: {
    timestamp: string;
    changes: string[];
  }[];

  // Privacy & Visibility
  visibility: 'public' | 'followers' | 'private';
  allowComments: boolean;
  allowShares: boolean;

  // Location & Context
  location?: {
    name: string;
    coordinates?: { lat: number; lng: number };
    type: 'temple' | 'retreat_center' | 'home' | 'other';
  };

  // Featured Content
  isFeatured: boolean;
  isHighlight: boolean;
  highlightCategory?: 'wisdom' | 'inspiration' | 'teaching' | 'community';
}

export interface Comment {
  id: string;
  reviewId: string;
  content: RichContent[];
  author: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    verified: boolean;
    wisdomLevel: string;
  };

  // Threading
  parentId?: string; // for nested comments
  replies: Comment[];
  depth: number; // nesting level

  // Engagement
  gratitude: number;
  hasGratitude: boolean;

  // Moderation
  moderationStatus: 'pending' | 'approved' | 'hidden';
  reportCount: number;

  // Timestamps
  createdAt: string;
  editedAt?: string;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio?: string;

  // Verification & Status
  verified: boolean;
  wisdomLevel: 'novice' | 'practitioner' | 'adept' | 'master';

  // Practice Profile
  practiceInterests: string[];
  favoriteTeachers: string[];
  followedTemples: string[];
  meditationStreak: number; // days

  // Social Stats
  followers: number;
  following: number;
  karma: number;
  totalWisdomPoints: number;
  reviewsCount: number;

  // Preferences
  preferences: {
    language: string;
    theme: 'light' | 'dark' | 'system';
    notifications: {
      gratitude: boolean;
      comments: boolean;
      follows: boolean;
      highlights: boolean;
    };
    privacy: {
      showActivity: boolean;
      showFollowers: boolean;
      allowMentions: boolean;
    };
  };

  // Achievements
  badges: Badge[];
  achievements: Achievement[];

  // Activity
  lastActive: string;
  joinedAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: string;
  progress?: number; // 0-100 if still working towards it
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'reviews' | 'social' | 'practice' | 'wisdom' | 'community';
  points: number;
  unlockedAt: string;
}

export interface Temple {
  id: string;
  name: string;
  description: string;
  avatar: string;
  coverImage: string;
  verified: boolean;

  // Location
  address: string;
  coordinates: { lat: number; lng: number };
  timezone: string;

  // Social
  followers: number;
  reviews: number;
  rating: number; // average wisdom rating

  // Content
  highlights: ReviewHighlight[];
  events: TempleEvent[];
  teachers: Teacher[];

  // Contact
  website?: string;
  phone?: string;
  email?: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
}

export interface Teacher {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatar: string;
  verified: boolean;

  // Teaching
  specialties: string[];
  languages: string[];
  experience: number; // years

  // Social
  followers: number;
  wisdomRating: number;

  // Availability
  isActive: boolean;
  nextEvent?: {
    title: string;
    date: string;
    type: 'teaching' | 'meditation' | 'retreat';
  };
}

export interface TempleEvent {
  id: string;
  title: string;
  description: string;
  type: 'meditation' | 'teaching' | 'ceremony' | 'retreat';
  startDate: string;
  endDate: string;
  capacity: number;
  registered: number;
  image?: string;
  teacher?: Teacher;
}

export interface ReviewHighlight {
  id: string;
  title: string;
  reviews: DharmaReview[];
  coverImage: string;
  category: 'wisdom' | 'inspiration' | 'teaching' | 'community';
  createdAt: string;
  viewCount: number;
}

export interface FeedAlgorithm {
  userId: string;
  preferences: {
    practiceInterests: string[];
    followedUsers: string[];
    followedTemples: string[];
    interactionHistory: {
      reviewId: string;
      action: 'view' | 'gratitude' | 'comment' | 'share' | 'bookmark';
      timestamp: string;
      duration?: number; // time spent viewing
    }[];
  };

  // Personalization weights
  weights: {
    followedContent: number; // 0-1
    practiceMatch: number; // 0-1
    qualityScore: number; // 0-1
    recency: number; // 0-1
    engagement: number; // 0-1
    diversity: number; // 0-1
  };
}

export interface ReviewFilter {
  temples?: string[];
  teachers?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  tags?: string[];
  eventTypes?: string[];
  wisdomLevel?: string[];
  hasMedia?: boolean;
  hasVoiceNote?: boolean;
  minWisdomPoints?: number;
  language?: string;
  sortBy: 'recent' | 'popular' | 'wisdom' | 'gratitude';
}

export interface ReviewComposer {
  // Draft management
  draftId?: string;
  autoSaveEnabled: boolean;
  lastSaved?: string;

  // Content state
  content: RichContent[];
  media: MediaAsset[];
  voiceNote?: VoiceNote;

  // Event context
  eventId?: string;
  eventTitle?: string;

  // Settings
  visibility: 'public' | 'followers' | 'private';
  allowComments: boolean;
  allowShares: boolean;

  // Moderation
  contentWarnings: string[];
  needsReview: boolean;
}

export interface MediaUpload {
  file: File;
  id: string;
  progress: number; // 0-100
  status: 'uploading' | 'processing' | 'ready' | 'error';
  preview?: string; // data URL
  error?: string;

  // Instagram-style editing
  filters: ImageFilter[];
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
  };
  adjustments: {
    brightness: number; // -100 to 100
    contrast: number; // -100 to 100
    saturation: number; // -100 to 100
    warmth: number; // -100 to 100
    fade: number; // 0 to 100
    vignette: number; // 0 to 100
  };
}

export interface ImageFilter {
  id: string;
  name: string;
  displayName: string;
  preview: string;
  css: string; // CSS filter values
  intensity: number; // 0-100
}

export interface VoiceRecording {
  isRecording: boolean;
  duration: number;
  waveform: number[];
  audioData?: Blob;
  quality: 'low' | 'medium' | 'high';

  // Processing
  isProcessing: boolean;
  transcript?: string;
  error?: string;
}

// Performance and optimization types
export interface VirtualScrollItem {
  id: string;
  height: number;
  component: React.ComponentType<any>;
  data: any;
  index: number;
}

export interface PerformanceMetrics {
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  lighthouseScore: number;
  memoryUsage: number;
  networkRequests: number;
}

export interface PWAFeatures {
  isInstallable: boolean;
  isInstalled: boolean;
  isOnline: boolean;
  syncPending: boolean;
  cacheStatus: 'loading' | 'ready' | 'updating' | 'error';
  backgroundSync: {
    enabled: boolean;
    lastSync?: string;
    pendingActions: string[];
  };
}

// Accessibility features
export interface AccessibilityFeatures {
  highContrast: boolean;
  reducedMotion: boolean;
  largeText: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  voiceOver: boolean;
  colorBlindness: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
}

export interface ContentModeration {
  autoModeration: {
    enabled: boolean;
    sensitivity: 'low' | 'medium' | 'high';
    flaggedWords: string[];
    imageAnalysis: boolean;
    audioAnalysis: boolean;
  };

  humanReview: {
    required: boolean;
    reviewers: string[];
    escalationRules: {
      reportThreshold: number;
      autoAction: 'flag' | 'hide' | 'remove';
    };
  };

  communityModeration: {
    enabled: boolean;
    trustedUsers: string[];
    votingThreshold: number;
  };
}
