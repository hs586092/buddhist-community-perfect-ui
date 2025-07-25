/**
 * BadgeCollection Component
 * 
 * Displays user badges and achievements with:
 * - Grid and list layout options
 * - Progress tracking for incomplete badges
 * - Detailed tooltips with requirements
 * - Category filtering and sorting
 * - Achievement celebration animations
 */

import React, { useState, useMemo } from 'react'
import { cn } from '../../utils/cn'
import { GlassButton } from '../ui/GlassButton'
import type { UserBadge, Achievement, BadgeDisplayConfig, BadgeType } from '../../types/profile'

interface BadgeCollectionProps {
  badges: UserBadge[]
  achievements: Achievement[]
  config?: Partial<BadgeDisplayConfig>
  className?: string
  showProgress?: boolean
  interactive?: boolean
}

interface BadgeItemProps {
  badge: UserBadge
  size?: 'sm' | 'md' | 'lg'
  showTooltip?: boolean
  onClick?: (badge: UserBadge) => void
}

interface AchievementItemProps {
  achievement: Achievement
  size?: 'sm' | 'md' | 'lg'
  showProgress?: boolean
  onClick?: (achievement: Achievement) => void
}

/**
 * Badge configuration for styling and display
 */
const badgeStyles = {
  newcomer: { 
    bg: 'from-green-400 to-green-600',
    border: 'border-green-500/30',
    glow: 'shadow-green-500/20'
  },
  active_member: { 
    bg: 'from-yellow-400 to-yellow-600',
    border: 'border-yellow-500/30',
    glow: 'shadow-yellow-500/20'
  },
  wisdom_seeker: { 
    bg: 'from-blue-400 to-blue-600',
    border: 'border-blue-500/30',
    glow: 'shadow-blue-500/20'
  },
  compassionate_heart: { 
    bg: 'from-pink-400 to-pink-600',
    border: 'border-pink-500/30',
    glow: 'shadow-pink-500/20'
  },
  meditation_master: { 
    bg: 'from-purple-400 to-purple-600',
    border: 'border-purple-500/30',
    glow: 'shadow-purple-500/20'
  },
  teaching_guru: { 
    bg: 'from-orange-400 to-orange-600',
    border: 'border-orange-500/30',
    glow: 'shadow-orange-500/20'
  },
  community_builder: { 
    bg: 'from-indigo-400 to-indigo-600',
    border: 'border-indigo-500/30',
    glow: 'shadow-indigo-500/20'
  },
  peaceful_warrior: { 
    bg: 'from-green-400 to-green-600',
    border: 'border-green-500/30',
    glow: 'shadow-green-500/20'
  }
}

/**
 * Achievement category colors
 */
const achievementCategoryStyles = {
  social: { color: 'text-blue-600', bg: 'bg-blue-500/20' },
  learning: { color: 'text-purple-600', bg: 'bg-purple-500/20' },
  meditation: { color: 'text-green-600', bg: 'bg-green-500/20' },
  community: { color: 'text-orange-600', bg: 'bg-orange-500/20' },
  teaching: { color: 'text-red-600', bg: 'bg-red-500/20' }
}

/**
 * Individual badge item component
 */
const BadgeItem: React.FC<BadgeItemProps> = ({
  badge,
  size = 'md',
  showTooltip = true,
  onClick
}) => {
  const [showDetails, setShowDetails] = useState(false)
  const style = badgeStyles[badge.type] || badgeStyles.newcomer

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base'
  }

  return (
    <div className="relative group">
      <button
        onClick={() => {
          onClick?.(badge)
          setShowDetails(!showDetails)
        }}
        className={cn(
          "relative flex items-center justify-center rounded-full border-2 transition-all duration-200",
          "hover:scale-110 hover:shadow-lg",
          style.bg,
          style.border,
          style.glow,
          sizeClasses[size],
          "bg-gradient-to-br"
        )}
        title={showTooltip ? badge.name : undefined}
      >
        <span className="text-white font-bold">{badge.icon}</span>
        
        {/* Badge glow effect */}
        <div className={cn(
          "absolute inset-0 rounded-full bg-gradient-to-br opacity-0 group-hover:opacity-30 transition-opacity",
          style.bg
        )} />
      </button>

      {/* Tooltip/Details */}
      {showDetails && showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10">
          <div className="bg-black/90 text-white p-3 rounded-lg shadow-lg min-w-[200px] max-w-[300px]">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{badge.icon}</span>
              <h4 className="font-medium">{badge.name}</h4>
            </div>
            <p className="text-sm text-gray-300 mb-3">{badge.description}</p>
            
            {badge.requirements && badge.requirements.length > 0 && (
              <div className="space-y-1">
                <h5 className="text-xs font-medium text-gray-400">Requirements:</h5>
                {badge.requirements.map((req, index) => (
                  <div key={index} className="text-xs text-gray-300 flex items-center gap-1">
                    <span>•</span>
                    <span>{req.description}</span>
                  </div>
                ))}
              </div>
            )}
            
            <div className="text-xs text-gray-400 mt-2">
              Earned {new Date(badge.earnedAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Individual achievement item component
 */
const AchievementItem: React.FC<AchievementItemProps> = ({
  achievement,
  size = 'md',
  showProgress = true,
  onClick
}) => {
  const categoryStyle = achievementCategoryStyles[achievement.category]
  const isCompleted = achievement.completedAt !== undefined
  const progressPercentage = Math.min(100, (achievement.progress / achievement.target) * 100)

  return (
    <div 
      className={cn(
        "p-3 rounded-lg border border-white/20 bg-white/5 dark:bg-black/20 transition-all duration-200",
        "hover:border-primary-500/30 cursor-pointer",
        isCompleted && "ring-2 ring-green-500/30"
      )}
      onClick={() => onClick?.(achievement)}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center",
          categoryStyle.bg,
          isCompleted ? "ring-2 ring-green-500/50" : ""
        )}>
          <span className="text-lg">{achievement.icon}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
              {achievement.title}
            </h4>
            {isCompleted && (
              <span className="text-green-500 text-sm">✓</span>
            )}
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
            {achievement.description}
          </p>

          {/* Progress bar */}
          {showProgress && !isCompleted && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>{achievement.progress} / {achievement.target}</span>
                <span>{progressPercentage.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    categoryStyle.bg
                  )}
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}

          {/* Completion date */}
          {isCompleted && achievement.completedAt && (
            <div className="text-xs text-green-600 mt-1">
              Completed {new Date(achievement.completedAt).toLocaleDateString()}
            </div>
          )}

          {/* Category */}
          <div className="mt-2">
            <span className={cn(
              "inline-flex items-center px-2 py-1 text-xs rounded-full capitalize",
              categoryStyle.color,
              categoryStyle.bg
            )}>
              {achievement.category}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Main BadgeCollection component
 */
export const BadgeCollection: React.FC<BadgeCollectionProps> = ({
  badges,
  achievements,
  config = {},
  className,
  showProgress = true,
  interactive = true
}) => {
  const [activeTab, setActiveTab] = useState<'badges' | 'achievements'>('badges')
  const [filter, setFilter] = useState<'all' | 'completed' | 'in-progress'>('all')
  const [selectedBadge, setSelectedBadge] = useState<UserBadge | null>(null)

  // Configuration with defaults
  const displayConfig: BadgeDisplayConfig = {
    layout: 'grid',
    showProgress: true,
    showDescription: true,
    filterVisible: true,
    maxVisible: undefined,
    ...config
  }

  // Filter badges
  const filteredBadges = useMemo(() => {
    return badges.filter(badge => {
      if (!displayConfig.filterVisible) return badge.isVisible
      return badge.isVisible
    }).slice(0, displayConfig.maxVisible)
  }, [badges, displayConfig])

  // Filter achievements
  const filteredAchievements = useMemo(() => {
    return achievements.filter(achievement => {
      if (!achievement.isVisible) return false
      
      switch (filter) {
        case 'completed':
          return achievement.completedAt !== undefined
        case 'in-progress':
          return achievement.completedAt === undefined && achievement.progress > 0
        case 'all':
        default:
          return true
      }
    })
  }, [achievements, filter])

  // Statistics
  const stats = useMemo(() => ({
    totalBadges: badges.length,
    earnedBadges: badges.filter(b => b.earnedAt).length,
    totalAchievements: achievements.length,
    completedAchievements: achievements.filter(a => a.completedAt).length,
    inProgressAchievements: achievements.filter(a => !a.completedAt && a.progress > 0).length
  }), [badges, achievements])

  return (
    <div className={cn("bg-white/5 dark:bg-black/20 rounded-lg border border-white/20 p-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab('badges')}
            className={cn(
              "px-3 py-1 text-sm font-medium rounded-lg transition-all",
              activeTab === 'badges'
                ? "bg-primary-500 text-white"
                : "hover:bg-white/20 dark:hover:bg-white/10"
            )}
          >
            Badges ({stats.earnedBadges})
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={cn(
              "px-3 py-1 text-sm font-medium rounded-lg transition-all",
              activeTab === 'achievements'
                ? "bg-primary-500 text-white"
                : "hover:bg-white/20 dark:hover:bg-white/10"
            )}
          >
            Achievements ({stats.completedAchievements})
          </button>
        </div>

        {/* Filter for achievements */}
        {activeTab === 'achievements' && (
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-1 text-sm rounded-md border border-white/20 bg-white/5 dark:bg-black/20"
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
          </select>
        )}
      </div>

      {/* Content */}
      {activeTab === 'badges' ? (
        <div className="space-y-4">
          {/* Badges grid */}
          <div className={cn(
            displayConfig.layout === 'grid' 
              ? "grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-3"
              : "flex flex-wrap gap-2"
          )}>
            {filteredBadges.map((badge) => (
              <BadgeItem
                key={badge.id}
                badge={badge}
                size="md"
                showTooltip={interactive}
                onClick={interactive ? setSelectedBadge : undefined}
              />
            ))}
          </div>

          {/* Empty state */}
          {filteredBadges.length === 0 && (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🏆</div>
              <p className="text-gray-500 dark:text-gray-400">No badges earned yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Keep participating in the community to earn badges!
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {/* Achievements list */}
          {filteredAchievements.map((achievement) => (
            <AchievementItem
              key={achievement.id}
              achievement={achievement}
              showProgress={showProgress}
              onClick={interactive ? () => {} : undefined}
            />
          ))}

          {/* Empty state */}
          {filteredAchievements.length === 0 && (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🎯</div>
              <p className="text-gray-500 dark:text-gray-400">
                {filter === 'completed' ? 'No achievements completed yet' :
                 filter === 'in-progress' ? 'No achievements in progress' :
                 'No achievements available'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-white/10">
        <div className="text-center">
          <div className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {stats.earnedBadges}/{stats.totalBadges}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Badges</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {stats.completedAchievements}/{stats.totalAchievements}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Achievements</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {stats.inProgressAchievements}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">In Progress</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {Math.round((stats.completedAchievements / stats.totalAchievements) * 100) || 0}%
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Completion</div>
        </div>
      </div>
    </div>
  )
}

BadgeCollection.displayName = 'BadgeCollection'