/**
 * ProfileCard Component
 * 
 * Displays user profile information in various formats:
 * - Compact card for lists and search results
 * - Standard card for general use
 * - Detailed card for full profile views
 * - Stats, badges, and activity integration
 * - Social action buttons (follow, message, etc.)
 */

import React, { useState, useCallback } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '../../utils/cn'
import { GlassButton } from '../ui/GlassButton'
import { UserRole } from '../../types/profile'
import type { UserProfile, ProfileCardVariant, BadgeType } from '../../types/profile'

interface ProfileCardProps {
  profile: UserProfile
  variant?: ProfileCardVariant
  currentUserId?: string
  onFollow?: (userId: string) => Promise<void>
  onUnfollow?: (userId: string) => Promise<void>
  onMessage?: (userId: string) => void
  onBlock?: (userId: string) => Promise<void>
  className?: string
  interactive?: boolean
  showOnlineStatus?: boolean
}

/**
 * Role-based styling configuration
 */
const roleStyles = {
  [UserRole.ADMIN]: {
    badge: 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30',
    icon: '👑',
    label: 'Admin'
  },
  [UserRole.MODERATOR]: {
    badge: 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30',
    icon: '🛡️',
    label: 'Moderator'
  },
  [UserRole.TEACHER]: {
    badge: 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30',
    icon: '📿',
    label: 'Teacher'
  },
  [UserRole.MEMBER]: {
    badge: 'bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-500/30',
    icon: '👤',
    label: 'Member'
  }
}

/**
 * Badge configuration for display
 */
const badgeConfig = {
  newcomer: { emoji: '🌱', color: 'text-green-500' },
  active_member: { emoji: '⭐', color: 'text-yellow-500' },
  wisdom_seeker: { emoji: '🔍', color: 'text-blue-500' },
  compassionate_heart: { emoji: '💝', color: 'text-pink-500' },
  meditation_master: { emoji: '🧘', color: 'text-purple-500' },
  teaching_guru: { emoji: '📚', color: 'text-orange-500' },
  community_builder: { emoji: '🏛️', color: 'text-indigo-500' },
  peaceful_warrior: { emoji: '☮️', color: 'text-green-600' }
}

/**
 * Profile card component with multiple variants
 */
export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  variant = { size: 'standard', showStats: true, showBadges: true, showActivity: true, showActions: true },
  currentUserId,
  onFollow,
  onUnfollow,
  onMessage,
  onBlock,
  className,
  interactive = true,
  showOnlineStatus = true
}) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [showMore, setShowMore] = useState(false)

  const isOwnProfile = currentUserId === profile.id
  const isCompact = variant.size === 'compact'
  const isDetailed = variant.size === 'detailed'

  // Handle follow/unfollow
  const handleFollowToggle = useCallback(async () => {
    if (!currentUserId || isOwnProfile || isProcessing) return

    setIsProcessing(true)
    try {
      // This would need to check current follow status
      // For now, assuming we need to implement follow status tracking
      await onFollow?.(profile.id)
    } finally {
      setIsProcessing(false)
    }
  }, [currentUserId, isOwnProfile, isProcessing, onFollow, profile.id])

  // Handle message
  const handleMessage = useCallback(() => {
    if (!currentUserId || isOwnProfile) return
    onMessage?.(profile.id)
  }, [currentUserId, isOwnProfile, onMessage, profile.id])

  // Format join date
  const joinedDate = formatDistanceToNow(new Date(profile.joinedAt), { addSuffix: true })
  const lastActiveDate = formatDistanceToNow(new Date(profile.lastActiveAt), { addSuffix: true })

  // Role configuration
  const roleConfig = roleStyles[profile.role]

  // Visible badges (limit for compact view)
  const visibleBadges = variant.showBadges 
    ? profile.badges.filter(badge => badge.isVisible).slice(0, isCompact ? 3 : 6)
    : []

  return (
    <div 
      className={cn(
        "relative rounded-lg border border-white/20 bg-white/5 dark:bg-black/20 backdrop-blur-sm",
        interactive && "hover:border-primary-500/30 transition-all duration-200",
        isCompact ? "p-3" : "p-4",
        className
      )}
    >
      {/* Online status indicator */}
      {showOnlineStatus && profile.isOnline && (
        <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-black" />
      )}

      {/* Header section */}
      <div className={cn("flex gap-3", isCompact ? "items-center" : "items-start")}>
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt={`${profile.displayName}'s avatar`}
              className={cn(
                "rounded-full border border-white/20",
                isCompact ? "w-10 h-10" : isDetailed ? "w-16 h-16" : "w-12 h-12"
              )}
            />
          ) : (
            <div 
              className={cn(
                "rounded-full border border-white/20 bg-primary-500/20 flex items-center justify-center",
                isCompact ? "w-10 h-10" : isDetailed ? "w-16 h-16" : "w-12 h-12"
              )}
            >
              <span className={cn(
                "font-medium text-primary-600 dark:text-primary-400",
                isCompact ? "text-sm" : isDetailed ? "text-xl" : "text-base"
              )}>
                {profile.displayName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {/* Verification badge */}
          {profile.isVerified && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white dark:border-black">
              <span className="text-white text-xs">✓</span>
            </div>
          )}
        </div>

        {/* Profile info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className={cn(
              "font-medium text-gray-900 dark:text-gray-100 truncate",
              isCompact ? "text-sm" : "text-base"
            )}>
              {profile.displayName}
            </h3>
            
            {profile.spiritualName && !isCompact && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({profile.spiritualName})
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span className={cn(
              "text-gray-500 dark:text-gray-400",
              isCompact ? "text-xs" : "text-sm"
            )}>
              @{profile.username}
            </span>

            {/* Role badge */}
            <span className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full border",
              roleConfig.badge
            )}>
              <span>{roleConfig.icon}</span>
              {!isCompact && <span>{roleConfig.label}</span>}
            </span>
          </div>

          {/* Bio */}
          {profile.bio && !isCompact && (
            <p className={cn(
              "mt-2 text-gray-700 dark:text-gray-300",
              isDetailed ? "text-sm" : "text-sm line-clamp-2"
            )}>
              {profile.bio}
            </p>
          )}

          {/* Location and tradition */}
          {(profile.location || profile.tradition) && !isCompact && (
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
              {profile.location && (
                <span className="flex items-center gap-1">
                  <span>📍</span>
                  {profile.location}
                </span>
              )}
              {profile.tradition && (
                <span className="flex items-center gap-1">
                  <span>📿</span>
                  {profile.tradition}
                </span>
              )}
            </div>
          )}

          {/* Badges */}
          {variant.showBadges && visibleBadges.length > 0 && (
            <div className="flex flex-wrap items-center gap-1 mt-2">
              {visibleBadges.map((badge) => {
                const config = badgeConfig[badge.type as keyof typeof badgeConfig]
                return (
                  <span
                    key={badge.id}
                    className={cn(
                      "inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full bg-white/10 dark:bg-black/20 border border-white/20",
                      config?.color
                    )}
                    title={`${badge.name}: ${badge.description}`}
                  >
                    <span>{config?.emoji || '🏆'}</span>
                    {!isCompact && <span>{badge.name}</span>}
                  </span>
                )
              })}
              
              {profile.badges.length > visibleBadges.length && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  +{profile.badges.length - visibleBadges.length} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stats section */}
      {variant.showStats && !isCompact && (
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/10">
          <div className="text-center">
            <div className="font-medium text-gray-900 dark:text-gray-100">
              {profile.stats.postsCount.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Posts</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-900 dark:text-gray-100">
              {profile.followersCount.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Followers</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-900 dark:text-gray-100">
              {profile.reputation.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Reputation</div>
          </div>
        </div>
      )}

      {/* Additional stats for detailed view */}
      {variant.showStats && isDetailed && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Meditation:</span>
              <span className="font-medium">{Math.floor(profile.stats.meditationMinutes / 60)}h</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Streak:</span>
              <span className="font-medium">{profile.stats.streakDays} days</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Events:</span>
              <span className="font-medium">{profile.stats.eventsAttended}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Comments:</span>
              <span className="font-medium">{profile.stats.commentsCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Helpful:</span>
              <span className="font-medium">{profile.stats.helpfulVotes}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Groups:</span>
              <span className="font-medium">{profile.stats.groupsJoined}</span>
            </div>
          </div>
        </div>
      )}

      {/* Activity info */}
      {variant.showActivity && !isCompact && (
        <div className="mt-4 pt-4 border-t border-white/10 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex justify-between items-center">
            <span>Joined {joinedDate}</span>
            <span>Active {lastActiveDate}</span>
          </div>
        </div>
      )}

      {/* Action buttons */}
      {variant.showActions && !isOwnProfile && currentUserId && (
        <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
          <GlassButton
            variant="primary"
            size="sm"
            onClick={handleFollowToggle}
            disabled={isProcessing}
            loading={isProcessing}
            className="flex-1"
          >
            Follow
          </GlassButton>
          
          <GlassButton
            variant="ghost"
            size="sm"
            onClick={handleMessage}
            className="flex-1"
          >
            Message
          </GlassButton>

          {/* More options */}
          <GlassButton
            variant="ghost"
            size="sm"
            onClick={() => setShowMore(!showMore)}
            className="px-3"
            title="More options"
          >
            •••
          </GlassButton>
        </div>
      )}

      {/* More options menu */}
      {showMore && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 p-2 z-50">
          <button
            onClick={() => {
              setShowMore(false)
              // Handle report
            }}
            className="w-full text-left px-3 py-2 text-sm hover:bg-white/20 dark:hover:bg-white/10 rounded-md transition-colors"
          >
            Report User
          </button>
          <button
            onClick={() => {
              setShowMore(false)
              onBlock?.(profile.id)
            }}
            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-500/10 rounded-md transition-colors"
          >
            Block User
          </button>
        </div>
      )}
    </div>
  )
}

ProfileCard.displayName = 'ProfileCard'