/**
 * ReactionButton Component
 * 
 * Handles post reactions with Buddhist-themed reaction types:
 * - Like, Love, Gratitude, Wisdom, Peace, Compassion
 * - Animated reaction picker
 * - Real-time reaction counts
 * - Accessible keyboard navigation
 */

import React, { useState, useRef, useEffect } from 'react'
import { cn } from '../../utils/cn'
import { GlassButton } from '../ui/GlassButton'
import { ReactionType } from '../../types/post'
import type { PostReaction } from '../../types/post'

interface ReactionButtonProps {
  reactions: PostReaction[]
  userReaction?: PostReaction
  onReact: (reactionType: ReactionType) => Promise<void>
  disabled?: boolean
  className?: string
}

// Buddhist-themed reaction definitions
const reactionConfig = {
  like: { emoji: '👍', label: 'Like', color: 'text-blue-500' },
  love: { emoji: '❤️', label: 'Love', color: 'text-red-500' },
  gratitude: { emoji: '🙏', label: 'Gratitude', color: 'text-yellow-500' },
  wisdom: { emoji: '🧠', label: 'Wisdom', color: 'text-purple-500' },
  peace: { emoji: '☮️', label: 'Peace', color: 'text-green-500' },
  compassion: { emoji: '🤗', label: 'Compassion', color: 'text-pink-500' }
} as const

/**
 * Reaction button with dropdown picker for Buddhist-themed reactions
 */
export const ReactionButton: React.FC<ReactionButtonProps> = ({
  reactions,
  userReaction,
  onReact,
  disabled = false,
  className
}) => {
  const [showPicker, setShowPicker] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Calculate reaction counts by type
  const reactionCounts = reactions.reduce((acc, reaction) => {
    acc[reaction.type] = (acc[reaction.type] || 0) + 1
    return acc
  }, {} as Record<ReactionType, number>)

  // Get total reaction count
  const totalReactions = reactions.length

  // Get the most common reaction type
  const popularReaction = Object.entries(reactionCounts).reduce(
    (a, b) => reactionCounts[a[0] as ReactionType] > (reactionCounts[b[0] as ReactionType] || 0) ? a : b,
    ['like', 0]
  )[0] as ReactionType

  // Handle reaction selection
  const handleReaction = async (reactionType: ReactionType) => {
    if (disabled || isProcessing) return
    
    setIsProcessing(true)
    setShowPicker(false)
    
    try {
      await onReact(reactionType)
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle quick reaction (click main button)
  const handleQuickReaction = async () => {
    if (userReaction) {
      // If user already reacted, remove reaction
      await handleReaction(userReaction.type)
    } else {
      // Default to like reaction
      await handleReaction(ReactionType.LIKE)
    }
  }

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current && 
        !pickerRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setShowPicker(false)
      }
    }

    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showPicker])

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setShowPicker(false)
      buttonRef.current?.focus()
    }
  }

  return (
    <div className={cn("relative", className)}>
      {/* Main reaction button */}
      <div className="flex items-center">
        <GlassButton
          ref={buttonRef}
          variant={userReaction ? "primary" : "ghost"}
          size="sm"
          onClick={handleQuickReaction}
          disabled={disabled || isProcessing}
          className={cn(
            "flex items-center gap-1.5 min-w-[3rem]",
            userReaction && reactionConfig[userReaction.type].color
          )}
          title={userReaction ? `Remove ${reactionConfig[userReaction.type].label}` : "React to post"}
        >
          <span className="text-base">
            {userReaction 
              ? reactionConfig[userReaction.type].emoji
              : (totalReactions > 0 ? reactionConfig[popularReaction].emoji : '👍')
            }
          </span>
          
          {totalReactions > 0 && (
            <span className="text-sm font-medium">
              {totalReactions}
            </span>
          )}
        </GlassButton>

        {/* Dropdown arrow */}
        <button
          onClick={() => setShowPicker(!showPicker)}
          disabled={disabled || isProcessing}
          className={cn(
            "ml-1 p-1 rounded-md text-gray-500 dark:text-gray-400",
            "hover:text-primary-600 hover:bg-white/10 transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-primary-500/50",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          title="Choose reaction"
          aria-expanded={showPicker}
          aria-haspopup="menu"
        >
          <span className="text-xs">▼</span>
        </button>
      </div>

      {/* Reaction picker */}
      {showPicker && (
        <div
          ref={pickerRef}
          className={cn(
            "absolute bottom-full left-0 mb-2 z-50",
            "bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-lg shadow-lg border border-white/20",
            "p-2 flex items-center gap-1",
            "animate-in fade-in slide-in-from-bottom-2 duration-200"
          )}
          role="menu"
          onKeyDown={handleKeyDown}
        >
          {Object.entries(reactionConfig).map(([type, config]) => (
            <button
              key={type}
              onClick={() => handleReaction(type as ReactionType)}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-lg min-w-[3rem]",
                "hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-primary-500/50",
                userReaction?.type === type && "bg-primary-500/20"
              )}
              title={`${config.label}${reactionCounts[type as ReactionType] ? ` (${reactionCounts[type as ReactionType]})` : ''}`}
              role="menuitem"
            >
              <span className="text-lg">{config.emoji}</span>
              {reactionCounts[type as ReactionType] && (
                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                  {reactionCounts[type as ReactionType]}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Reaction details tooltip */}
      {totalReactions > 0 && (
        <div className="sr-only">
          {Object.entries(reactionCounts)
            .filter(([, count]) => count > 0)
            .map(([type, count]) => `${count} ${reactionConfig[type as ReactionType].label}`)
            .join(', ')}
        </div>
      )}
    </div>
  )
}

ReactionButton.displayName = 'ReactionButton'