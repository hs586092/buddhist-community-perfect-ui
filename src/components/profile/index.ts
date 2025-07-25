/**
 * Profile Components Barrel Export
 * 
 * Centralized exports for all profile-related components
 */

export { ProfileCard } from './ProfileCard'
export { ActivityChart } from './ActivityChart'
export { BadgeCollection } from './BadgeCollection'

// Re-export types for convenience
export type {
  UserProfile,
  UserRole,
  UserStats,
  ActivityType,
  BadgeType,
  Activity,
  UserBadge,
  Achievement,
  ActivityChartData,
  StatsPeriod,
  ProfileCardVariant,
  ActivityChartConfig,
  BadgeDisplayConfig,
  SocialConnection,
  FriendRequest,
  PrivacySettings,
  UserPreferences
} from '../../types/profile'