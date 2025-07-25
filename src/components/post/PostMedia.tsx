/**
 * PostMedia Component
 * 
 * Displays media attachments in posts:
 * - Image galleries with lightbox
 * - Video players with controls
 * - Audio players
 * - Responsive grid layouts
 * - Accessibility features
 */

import React, { useState, useCallback } from 'react'
import { cn } from '../../utils/cn'
import type { MediaAttachment } from '../../types/post'

interface PostMediaProps {
  images?: MediaAttachment[]
  videos?: MediaAttachment[]
  audio?: MediaAttachment[]
  className?: string
}

interface MediaGridProps {
  media: MediaAttachment[]
  onItemClick?: (media: MediaAttachment, index: number) => void
  className?: string
}

interface LightboxProps {
  media: MediaAttachment[]
  currentIndex: number
  isOpen: boolean
  onClose: () => void
  onNext: () => void
  onPrev: () => void
}

/**
 * Lightbox modal for viewing media in full screen
 */
const Lightbox: React.FC<LightboxProps> = ({
  media,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrev
}) => {
  if (!isOpen || !media[currentIndex]) return null

  const currentMedia = media[currentIndex]
  const canGoPrev = currentIndex > 0
  const canGoNext = currentIndex < media.length - 1

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        onClose()
        break
      case 'ArrowLeft':
        if (canGoPrev) onPrev()
        break
      case 'ArrowRight':
        if (canGoNext) onNext()
        break
    }
  }, [canGoPrev, canGoNext, onClose, onNext, onPrev])

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      {/* Navigation buttons */}
      {canGoPrev && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onPrev()
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          aria-label="Previous image"
        >
          ←
        </button>
      )}
      
      {canGoNext && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onNext()
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          aria-label="Next image"
        >
          →
        </button>
      )}

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        aria-label="Close lightbox"
      >
        ✕
      </button>

      {/* Media content */}
      <div 
        className="max-w-[90vw] max-h-[90vh] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {currentMedia.type === 'image' && (
          <img
            src={currentMedia.url}
            alt={currentMedia.alt || 'Post image'}
            className="max-w-full max-h-full object-contain"
            style={{ 
              maxWidth: currentMedia.width ? `${currentMedia.width}px` : undefined,
              maxHeight: currentMedia.height ? `${currentMedia.height}px` : undefined
            }}
          />
        )}
        
        {currentMedia.type === 'video' && (
          <video
            src={currentMedia.url}
            controls
            className="max-w-full max-h-full"
            style={{ 
              maxWidth: currentMedia.width ? `${currentMedia.width}px` : undefined,
              maxHeight: currentMedia.height ? `${currentMedia.height}px` : undefined
            }}
          />
        )}
      </div>

      {/* Media info */}
      {media.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
          {currentIndex + 1} of {media.length}
        </div>
      )}
    </div>
  )
}

/**
 * Grid layout for media attachments
 */
const MediaGrid: React.FC<MediaGridProps> = ({ media, onItemClick, className }) => {
  if (!media.length) return null

  // Determine grid layout based on count
  const getGridLayout = (count: number) => {
    if (count === 1) return 'grid-cols-1'
    if (count === 2) return 'grid-cols-2'
    if (count === 3) return 'grid-cols-3'
    return 'grid-cols-2 grid-rows-2'
  }

  const gridClass = getGridLayout(media.length)
  const displayMedia = media.slice(0, 4) // Limit to 4 items in grid

  return (
    <div className={cn(`grid gap-2 ${gridClass}`, className)}>
      {displayMedia.map((item, index) => (
        <div
          key={item.id}
          className={cn(
            "relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer",
            "hover:opacity-90 transition-opacity",
            // Special layout for 3 items
            media.length === 3 && index === 0 && "row-span-2",
            // Last item overlay for more than 4 items
            media.length > 4 && index === 3 && "relative"
          )}
          onClick={() => onItemClick?.(item, index)}
          style={{
            aspectRatio: media.length === 1 
              ? (item.width && item.height ? `${item.width}/${item.height}` : '16/9')
              : '1/1'
          }}
        >
          {item.type === 'image' && (
            <img
              src={item.thumbnailUrl || item.url}
              alt={item.alt || `Post image ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          )}
          
          {item.type === 'video' && (
            <div className="relative w-full h-full">
              <video
                src={item.url}
                poster={item.thumbnailUrl}
                className="w-full h-full object-cover"
                muted
                preload="metadata"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/50 rounded-full p-3">
                  <div className="w-0 h-0 border-l-[12px] border-l-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1" />
                </div>
              </div>
            </div>
          )}
          
          {item.type === 'audio' && (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-blue-500/20">
              <div className="text-center">
                <div className="text-3xl mb-2">🎵</div>
                <p className="text-sm font-medium">Audio</p>
                {item.duration && (
                  <p className="text-xs text-gray-500">
                    {Math.floor(item.duration / 60)}:{(item.duration % 60).toString().padStart(2, '0')}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Overlay for excess items */}
          {media.length > 4 && index === 3 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white text-lg font-medium">
                +{media.length - 4}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

/**
 * Audio player component
 */
const AudioPlayer: React.FC<{ audio: MediaAttachment }> = ({ audio }) => {
  return (
    <div className="flex items-center gap-3 p-3 bg-white/5 dark:bg-black/20 rounded-lg">
      <div className="text-2xl">🎵</div>
      <div className="flex-1 min-w-0">
        <audio 
          src={audio.url} 
          controls 
          className="w-full"
          preload="metadata"
        />
        <div className="flex items-center justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
          <span>Audio</span>
          {audio.duration && (
            <span>
              {Math.floor(audio.duration / 60)}:{(audio.duration % 60).toString().padStart(2, '0')}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Main PostMedia component
 */
export const PostMedia: React.FC<PostMediaProps> = ({
  images = [],
  videos = [],
  audio = [],
  className
}) => {
  const [lightboxMedia, setLightboxMedia] = useState<MediaAttachment[]>([])
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  // Handle media click for lightbox
  const handleMediaClick = useCallback((media: MediaAttachment, index: number) => {
    // Only images and videos can be viewed in lightbox
    if (media.type === 'image' || media.type === 'video') {
      const viewableMedia = [...images, ...videos].filter(m => m.type === 'image' || m.type === 'video')
      const actualIndex = viewableMedia.findIndex(m => m.id === media.id)
      
      setLightboxMedia(viewableMedia)
      setLightboxIndex(actualIndex)
      setIsLightboxOpen(true)
    }
  }, [images, videos])

  // Lightbox navigation
  const handleLightboxNext = useCallback(() => {
    setLightboxIndex((prev) => (prev + 1) % lightboxMedia.length)
  }, [lightboxMedia.length])

  const handleLightboxPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev - 1 + lightboxMedia.length) % lightboxMedia.length)
  }, [lightboxMedia.length])

  const handleLightboxClose = useCallback(() => {
    setIsLightboxOpen(false)
  }, [])

  // Combine visual media (images + videos)
  const visualMedia = [...images, ...videos]

  return (
    <div className={cn("space-y-3", className)}>
      {/* Visual media grid */}
      {visualMedia.length > 0 && (
        <MediaGrid
          media={visualMedia}
          onItemClick={handleMediaClick}
        />
      )}

      {/* Audio players */}
      {audio.length > 0 && (
        <div className="space-y-2">
          {audio.map((audioItem) => (
            <AudioPlayer key={audioItem.id} audio={audioItem} />
          ))}
        </div>
      )}

      {/* Lightbox */}
      <Lightbox
        media={lightboxMedia}
        currentIndex={lightboxIndex}
        isOpen={isLightboxOpen}
        onClose={handleLightboxClose}
        onNext={handleLightboxNext}
        onPrev={handleLightboxPrev}
      />
    </div>
  )
}

PostMedia.displayName = 'PostMedia'