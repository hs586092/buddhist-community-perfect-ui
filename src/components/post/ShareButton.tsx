/**
 * ShareButton Component
 * 
 * Social sharing functionality for posts:
 * - Native Web Share API when available
 * - Custom share modal with multiple options
 * - Copy link functionality
 * - Social platform integration
 */

import React, { useState, useCallback } from 'react'
import { cn } from '../../utils/cn'
import { GlassButton } from '../ui/GlassButton'
import type { Post } from '../../types/post'

interface ShareButtonProps {
  post: Post
  onShare?: () => Promise<void>
  disabled?: boolean
  className?: string
}

interface ShareOption {
  id: string
  label: string
  icon: string
  action: (post: Post) => void | Promise<void>
}

/**
 * Share button with multiple sharing options
 */
export const ShareButton: React.FC<ShareButtonProps> = ({
  post,
  onShare,
  disabled = false,
  className
}) => {
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  // Generate share URL
  const shareUrl = `${window.location.origin}/posts/${post.id}`
  const shareTitle = `${post.author.name} shared a post`
  const shareText = post.content.text?.slice(0, 100) || 'Check out this post from the Buddhist Community'

  // Copy to clipboard
  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }, [])

  // Share options
  const shareOptions: ShareOption[] = [
    {
      id: 'copy',
      label: copySuccess ? 'Copied!' : 'Copy Link',
      icon: copySuccess ? '✅' : '🔗',
      action: () => copyToClipboard(shareUrl)
    },
    {
      id: 'twitter',
      label: 'Twitter',
      icon: '🐦',
      action: (post) => {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
        window.open(twitterUrl, '_blank', 'width=550,height=420')
      }
    },
    {
      id: 'facebook',
      label: 'Facebook',
      icon: '📘',
      action: (post) => {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        window.open(facebookUrl, '_blank', 'width=550,height=420')
      }
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      icon: '💼',
      action: (post) => {
        const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
        window.open(linkedinUrl, '_blank', 'width=550,height=420')
      }
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      icon: '📱',
      action: (post) => {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`
        window.open(whatsappUrl, '_blank')
      }
    }
  ]

  // Handle native share
  const handleNativeShare = useCallback(async () => {
    if (!navigator.share) return false

    try {
      await navigator.share({
        title: shareTitle,
        text: shareText,
        url: shareUrl
      })
      onShare?.()
      return true
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Error sharing:', err)
      }
      return false
    }
  }, [shareTitle, shareText, shareUrl, onShare])

  // Handle share click
  const handleShareClick = useCallback(async () => {
    if (disabled) return

    // Try native share first on mobile
    if (navigator.share && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      const shared = await handleNativeShare()
      if (shared) return
    }

    // Fallback to custom share menu
    setShowShareMenu(!showShareMenu)
  }, [disabled, handleNativeShare, showShareMenu])

  // Handle share option click
  const handleShareOption = useCallback(async (option: ShareOption) => {
    setShowShareMenu(false)
    await option.action(post)
    onShare?.()
  }, [post, onShare])

  return (
    <div className={cn("relative", className)}>
      {/* Share button */}
      <GlassButton
        variant="ghost"
        size="sm"
        onClick={handleShareClick}
        disabled={disabled}
        className="flex items-center gap-1.5"
        title="Share post"
      >
        <span className="text-base">📤</span>
        <span className="text-sm">Share</span>
      </GlassButton>

      {/* Share menu */}
      {showShareMenu && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowShareMenu(false)}
          />
          
          {/* Menu */}
          <div className={cn(
            "absolute bottom-full right-0 mb-2 z-50",
            "bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-lg shadow-lg border border-white/20",
            "py-2 min-w-[160px]",
            "animate-in fade-in slide-in-from-bottom-2 duration-200"
          )}>
            {shareOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleShareOption(option)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2 text-sm text-left",
                  "hover:bg-white/20 dark:hover:bg-white/10 transition-colors",
                  "focus:outline-none focus:bg-white/20 dark:focus:bg-white/10",
                  option.id === 'copy' && copySuccess && "text-green-600"
                )}
              >
                <span className="text-base">{option.icon}</span>
                <span>{option.label}</span>
              </button>
            ))}
            
            {/* Native share option (if available) */}
            {navigator.share && (
              <>
                <hr className="my-2 border-white/10" />
                <button
                  onClick={handleNativeShare}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2 text-sm text-left",
                    "hover:bg-white/20 dark:hover:bg-white/10 transition-colors",
                    "focus:outline-none focus:bg-white/20 dark:focus:bg-white/10"
                  )}
                >
                  <span className="text-base">🔄</span>
                  <span>More options...</span>
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}

ShareButton.displayName = 'ShareButton'