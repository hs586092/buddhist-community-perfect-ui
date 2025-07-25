/**
 * User Profile Types
 * 
 * Comprehensive type definitions for user profiles, activities, and social features
 */

// User profile enums
export enum UserRole {
  MEMBER = 'member',
  TEACHER = 'teacher',
  MODERATOR = 'moderator',
  ADMIN = 'admin'
}

export enum ActivityType {
  POST_CREATED = 'post_created',
  COMMENT_ADDED = 'comment_added',
  REACTION_GIVEN = 'reaction_given',
  EVENT_JOINED = 'event_joined',
  GROUP_JOINED = 'group_joined',
  MEDITATION_COMPLETED = 'meditation_completed',
  TEACHING_SHARED = 'teaching_shared',
  MILESTONE_REACHED = 'milestone_reached'
}

export enum BadgeType {
  NEWCOMER = 'newcomer',
  ACTIVE_MEMBER = 'active_member',
  WISDOM_SEEKER = 'wisdom_seeker',
  COMPASSIONATE_HEART = 'compassionate_heart',
  MEDITATION_MASTER = 'meditation_master',
  TEACHING_GURU = 'teaching_guru',
  COMMUNITY_BUILDER = 'community_builder',
  PEACEFUL_WARRIOR = 'peaceful_warrior'
}

export enum PrivacyLevel {
  PUBLIC = 'public',
  FRIENDS = 'friends',
  PRIVATE = 'private'
}

// Core user profile interface
export interface UserProfile {
  id: string
  username: string
  displayName: string
  email: string
  avatar?: string
  coverImage?: string
  bio?: string
  location?: string
  website?: string
  
  // Buddhist community specific
  spiritualName?: string
  tradition?: string
  meditationExperience?: number // years
  favoriteTeachings?: string[]
  practiceGoals?: string[]
  
  // Account info
  role: UserRole
  isVerified: boolean
  joinedAt: string
  lastActiveAt: string
  
  // Stats and metrics
  stats: UserStats
  
  // Social connections
  followersCount: number
  followingCount: number
  friendsCount: number
  
  // Privacy settings
  privacySettings: PrivacySettings
  
  // Badges and achievements
  badges: UserBadge[]
  achievements: Achievement[]
  
  // Activity and engagement
  recentActivity: Activity[]
  contributionLevel: number // 0-100
  reputation: number
  
  // Preferences
  preferences: UserPreferences
  
  // Status
  isOnline: boolean
  currentStatus?: UserStatus
}

export interface UserStats {
  postsCount: number
  commentsCount: number
  reactionsGiven: number
  reactionsReceived: number
  meditationMinutes: number
  teachingsShared: number
  eventsAttended: number
  groupsJoined: number
  helpfulVotes: number
  streakDays: number
}

export interface PrivacySettings {
  profileVisibility: PrivacyLevel
  activityVisibility: PrivacyLevel
  statisticsVisibility: PrivacyLevel
  contactInfoVisibility: PrivacyLevel
  showOnlineStatus: boolean
  allowDirectMessages: boolean
  allowFollows: boolean
}

export interface UserBadge {
  id: string
  type: BadgeType
  name: string
  description: string
  icon: string
  color: string
  earnedAt: string
  isVisible: boolean
  requirements?: BadgeRequirement[]
}

export interface BadgeRequirement {
  type: 'posts' | 'comments' | 'meditation' | 'events' | 'streak' | 'reactions'
  count: number
  description: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: 'social' | 'learning' | 'meditation' | 'community' | 'teaching'
  progress: number // 0-100
  target: number
  completedAt?: string
  isVisible: boolean
  rewards?: AchievementReward[]
}

export interface AchievementReward {
  type: 'badge' | 'title' | 'points' | 'unlock'
  value: string
  description: string
}

export interface Activity {
  id: string
  type: ActivityType
  title: string
  description: string
  timestamp: string
  metadata?: ActivityMetadata
  isPublic: boolean
  relatedUser?: {
    id: string
    name: string
    avatar?: string
  }
  relatedItem?: {
    id: string
    title: string
    type: 'post' | 'comment' | 'event' | 'group' | 'teaching'
  }
}

export interface ActivityMetadata {
  [key: string]: any
  duration?: number // for meditation
  location?: string // for events
  reaction?: string // for reactions
  groupName?: string // for group activities
}

export interface UserStatus {
  text: string
  emoji?: string
  expiresAt?: string
  isCustom: boolean
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto'
  language: string
  timezone: string
  notifications: NotificationPreferences
  meditation: MeditationPreferences
  accessibility: AccessibilityPreferences
}

export interface NotificationPreferences {
  email: boolean
  push: boolean
  inApp: boolean
  newFollower: boolean
  postReaction: boolean
  commentReply: boolean
  eventReminder: boolean
  groupActivity: boolean
  teachingUpdate: boolean
  meditationReminder: boolean
}

export interface MeditationPreferences {
  defaultDuration: number // minutes
  reminderTime?: string // HH:mm format
  reminderDays: number[] // 0-6, Sunday=0
  soundTheme: 'bell' | 'singing_bowl' | 'nature' | 'silence'
  guidedVoice?: string
  backgroundMusic: boolean
}

export interface AccessibilityPreferences {
  fontSize: 'small' | 'medium' | 'large' | 'xl'
  highContrast: boolean
  reduceMotion: boolean
  screenReader: boolean
  keyboardNavigation: boolean
}

// Social relationship types
export interface SocialConnection {
  id: string
  user: UserProfile
  type: 'follower' | 'following' | 'friend' | 'blocked'
  status: 'pending' | 'accepted' | 'declined'
  createdAt: string
  mutualConnections: number
}

export interface FriendRequest {
  id: string
  from: UserProfile
  to: UserProfile
  message?: string
  status: 'pending' | 'accepted' | 'declined'
  createdAt: string
  respondedAt?: string
}

// Activity chart data
export interface ActivityChartData {
  date: string
  postsCount: number
  commentsCount: number
  reactionsCount: number
  meditationMinutes: number
  eventsCount: number
  totalActivity: number
}

export interface StatsPeriod {
  period: 'week' | 'month' | 'quarter' | 'year'
  startDate: string
  endDate: string
  data: ActivityChartData[]
  summary: {
    totalPosts: number
    totalComments: number
    totalReactions: number
    totalMeditation: number
    totalEvents: number
    averageDaily: number
    peakDay: string
    improvement: number // percentage change from previous period
  }
}

// API request/response types
export interface UpdateProfileRequest {
  displayName?: string
  bio?: string
  location?: string
  website?: string
  spiritualName?: string
  tradition?: string
  meditationExperience?: number
  favoriteTeachings?: string[]
  practiceGoals?: string[]
  avatar?: File | string
  coverImage?: File | string
}

export interface UpdatePrivacyRequest {
  privacySettings: Partial<PrivacySettings>
}

export interface UpdatePreferencesRequest {
  preferences: Partial<UserPreferences>
}

export interface FollowUserRequest {
  userId: string
}

export interface SendFriendRequestRequest {
  userId: string
  message?: string
}

export interface ProfileSearchQuery {
  query: string
  role?: UserRole[]
  location?: string
  tradition?: string
  minExperience?: number
  maxExperience?: number
  badges?: BadgeType[]
  isOnline?: boolean
  sortBy?: 'relevance' | 'recent' | 'active' | 'reputation' | 'joined'
  limit?: number
  offset?: number
}

export interface ProfileSearchResult {
  users: UserProfile[]
  total: number
  hasMore: boolean
  suggestions?: string[]
}

// Component-specific types
export interface ProfileCardVariant {
  size: 'compact' | 'standard' | 'detailed'
  showStats: boolean
  showBadges: boolean
  showActivity: boolean
  showActions: boolean
}

export interface ActivityChartConfig {
  type: 'line' | 'bar' | 'area'
  period: 'week' | 'month' | 'quarter' | 'year'
  metrics: ('posts' | 'comments' | 'reactions' | 'meditation' | 'events')[]
  showComparison: boolean
  showTrend: boolean
  animated: boolean
}

export interface BadgeDisplayConfig {
  layout: 'grid' | 'list' | 'compact'
  showProgress: boolean
  showDescription: boolean
  filterVisible: boolean
  maxVisible?: number
}

export interface ReputationMetrics {
  current: number
  change: number
  rank: number
  percentile: number
  breakdown: {
    posts: number
    comments: number
    reactions: number
    helpful: number
    teaching: number
  }
  history: Array<{
    date: string
    value: number
    reason?: string
  }>
}