/**
 * Review Card - Instagram-style Social Review Component
 *
 * Features:
 * - Media carousel with swipe gestures
 * - Lotus petal falling animation for gratitude
 * - Double-tap to show gratitude
 * - Voice note playback with waveform
 * - Rich text rendering with mentions/hashtags
 * - Engagement metrics with Buddhist terminology
 * - Accessible keyboard navigation
 */

import { formatDistanceToNow, parseISO } from 'date-fns';
import { AnimatePresence, motion, useAnimation } from 'framer-motion';
import React, { useCallback, useEffect, useRef, useState } from 'react';

// Components
import { EngagementButton } from './EngagementButton';
import { GratitudeLotusAnimation } from './GratitudeLotusAnimation';
import { MediaCarousel } from './MediaCarousel';
import { RichTextRenderer } from './RichTextRenderer';
import { UserAvatar } from './UserAvatar';
import { VoiceNotePlayer } from './VoiceNotePlayer';

// Types
import type { DharmaReview } from '../../types/review-system';

// Utility functions
const getWisdomLevelColor = (level: string) => {
  switch (level) {
    case 'novice':
      return 'text-green-500';
    case 'practitioner':
      return 'text-blue-500';
    case 'adept':
      return 'text-purple-500';
    case 'master':
      return 'text-orange-500';
    default:
      return 'text-gray-500';
  }
};

const getEngagementEmoji = (type: string) => {
  switch (type) {
    case 'gratitude':
      return '🙏';
    case 'comment':
      return '💬';
    case 'share':
      return '🔗';
    default:
      return '👍';
  }
};

interface ReviewCardProps {
  review: DharmaReview;
  onGratitude: () => void;
  onComment: () => void;
  onShare: () => void;
  onSelect?: () => void;
  showFullContent?: boolean;
  className?: string;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  onGratitude,
  onComment,
  onShare,
  onSelect,
  showFullContent = false,
  className = '',
}) => {
  const [showGratitudeAnimation, setShowGratitudeAnimation] = useState(false);
  const [isExpanded, setIsExpanded] = useState(showFullContent);
  const [doubleTapTimer, setDoubleTapTimer] = useState<NodeJS.Timeout | null>(null);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const gratitudeControls = useAnimation();

  // Calculate reading time and content preview
  const fullContentText = review.content.map(c => c.content).join('');
  const previewText = fullContentText.length > 150
    ? fullContentText.substring(0, 150) + '...'
    : fullContentText;
  const estimatedReadingTime = Math.max(1, Math.ceil(fullContentText.length / 200)); // 200 chars per minute

  // Handle double tap for gratitude
  const handleDoubleTap = useCallback(() => {
    if (!review.userInteractions.hasGratitude) {
      setShowGratitudeAnimation(true);
      onGratitude();

      // Animate gratitude button
      gratitudeControls.start({
        scale: [1, 1.3, 1],
        transition: { duration: 0.3 }
      });

      // Hide animation after completion
      setTimeout(() => setShowGratitudeAnimation(false), 2000);
    }
  }, [review.userInteractions.hasGratitude, onGratitude, gratitudeControls]);

  // Handle single/double tap detection
  const handleTap = useCallback(() => {
    if (doubleTapTimer) {
      clearTimeout(doubleTapTimer);
      setDoubleTapTimer(null);
      handleDoubleTap();
    } else {
      const timer = setTimeout(() => {
        setDoubleTapTimer(null);
        // Single tap - could expand image or do nothing
      }, 300);
      setDoubleTapTimer(timer);
    }
  }, [doubleTapTimer, handleDoubleTap]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (doubleTapTimer) {
        clearTimeout(doubleTapTimer);
      }
    };
  }, [doubleTapTimer]);

  // Calculate reading progress
  useEffect(() => {
    const calculateProgress = () => {
      if (contentRef.current) {
        const scrollTop = window.scrollY;
        const elementTop = contentRef.current.offsetTop;
        const elementHeight = contentRef.current.offsetHeight;
        const windowHeight = window.innerHeight;

        const progress = Math.min(
          100,
          Math.max(0, ((scrollTop + windowHeight - elementTop) / elementHeight) * 100)
        );
        setReadingProgress(progress);
      }
    };

    window.addEventListener('scroll', calculateProgress);
    calculateProgress(); // Initial calculation

    return () => window.removeEventListener('scroll', calculateProgress);
  }, []);

  return (
    <motion.article
      ref={cardRef}
      className={`
        bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700
        overflow-hidden cursor-pointer group hover:shadow-xl transition-all duration-300
        ${className}
      `}
      onClick={onSelect}
      whileHover={{ y: -2 }}
      layout
    >
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <UserAvatar
              user={review.author}
              size="md"
              showWisdomLevel
              showVerified
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                  {review.author.displayName}
                </h3>
                {review.author.verified && (
                  <span className="text-blue-500">✓</span>
                )}
                <span className={`text-xs font-medium ${getWisdomLevelColor(review.author.wisdomLevel)}`}>
                  {review.author.wisdomLevel}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-2">
                <span>{formatDistanceToNow(parseISO(review.createdAt))} ago</span>
                <span>•</span>
                <span>{estimatedReadingTime} min read</span>
                {review.location && (
                  <>
                    <span>•</span>
                    <span className="flex items-center">
                      📍 {review.location.name}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMoreOptions(!showMoreOptions);
            }}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            ⋯
          </button>
        </div>

        {/* Event Context */}
        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
              {review.temple?.avatar ? (
                <img
                  src={review.temple.avatar}
                  alt={review.temple.name}
                  className="w-8 h-8 rounded-lg object-cover"
                />
              ) : (
                <span className="text-white text-sm">🏛️</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                {review.eventTitle}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                at {review.temple?.name}
                {review.teacher && ` • with ${review.teacher.name}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Media Content */}
      {review.media && review.media.length > 0 && (
        <div className="relative" onClick={handleTap}>
          <MediaCarousel
            media={review.media}
            onDoubleTap={handleDoubleTap}
            className="aspect-square md:aspect-video"
          />

          {/* Gratitude Animation Overlay */}
          <AnimatePresence>
            {showGratitudeAnimation && (
              <GratitudeLotusAnimation
                onComplete={() => setShowGratitudeAnimation(false)}
              />
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Voice Note */}
      {review.voiceNote && (
        <div className="px-4 py-3">
          <VoiceNotePlayer
            voiceNote={review.voiceNote}
            author={review.author}
          />
        </div>
      )}

      {/* Content */}
      <div ref={contentRef} className="px-4 py-3">
        <div className="relative">
          <RichTextRenderer
            content={isExpanded || showFullContent ? review.content : review.content.slice(0, 3)}
            mentions={review.mentions}
            hashtags={review.hashtags}
            maxLines={isExpanded || showFullContent ? undefined : 3}
          />

          {!showFullContent && !isExpanded && fullContentText.length > 150 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(true);
              }}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm mt-1"
            >
              Show more
            </button>
          )}
        </div>

        {/* Tags */}
        {review.hashtags && review.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {review.hashtags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800 cursor-pointer transition-colors"
              >
                {tag}
              </span>
            ))}
            {review.hashtags.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{review.hashtags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Engagement Bar */}
      <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700">
        {/* Metrics Display */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              🙏 {review.metrics.gratitude}
            </span>
            <span className="flex items-center">
              💬 {review.metrics.comments}
            </span>
            <span className="flex items-center">
              👁️ {review.metrics.views}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            {review.metrics.wisdomPoints > 0 && (
              <span className="flex items-center text-orange-500">
                ⭐ {review.metrics.wisdomPoints}
              </span>
            )}
            <span className="text-xs">
              Reading: {Math.round(readingProgress)}%
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <motion.div animate={gratitudeControls}>
              <EngagementButton
                icon={getEngagementEmoji('gratitude')}
                label={review.userInteractions.hasGratitude ? 'Grateful' : 'Show Gratitude'}
                count={review.metrics.gratitude}
                active={review.userInteractions.hasGratitude}
                onClick={(e) => {
                  e.stopPropagation();
                  onGratitude();
                }}
                color="orange"
              />
            </motion.div>

            <EngagementButton
              icon={getEngagementEmoji('comment')}
              label="Comment"
              count={review.metrics.comments}
              onClick={(e) => {
                e.stopPropagation();
                onComment();
              }}
              color="blue"
            />

            <EngagementButton
              icon={getEngagementEmoji('share')}
              label="Share"
              count={review.metrics.shares}
              onClick={(e) => {
                e.stopPropagation();
                onShare();
              }}
              color="green"
            />
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Handle bookmark
              }}
              className={`p-2 rounded-full transition-colors ${
                review.userInteractions.hasBookmarked
                  ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {review.userInteractions.hasBookmarked ? '🔖' : '📎'}
            </button>
          </div>
        </div>
      </div>

      {/* More Options Menu */}
      <AnimatePresence>
        {showMoreOptions && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute top-12 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-10"
          >
            <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center">
              📎 Save to Collection
            </button>
            <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center">
              🔗 Copy Link
            </button>
            <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center">
              🚫 Not Interested
            </button>
            <hr className="my-1 border-gray-200 dark:border-gray-700" />
            <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center text-red-600 dark:text-red-400">
              🚨 Report Content
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
};
