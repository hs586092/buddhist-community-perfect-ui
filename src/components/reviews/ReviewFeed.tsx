/**
 * Review Feed - Instagram/TikTok Level Social Experience
 *
 * Features:
 * - Masonry grid layout (Pinterest-style)
 * - Infinite scroll with intersection observer
 * - Story-style highlights at top
 * - Floating compose button (Material Design 3)
 * - Real-time updates with optimistic UI
 * - Virtual scrolling for performance
 * - Dark/light mode with system preference
 */

import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { useTheme } from '../../hooks/useTheme';
import { useVirtualScroll } from '../../hooks/useVirtualScroll';

// Components
import { FloatingActionButton } from './FloatingActionButton';
import { ReviewCard } from './ReviewCard';
import { ReviewComposer } from './ReviewComposer';
import { ReviewSkeleton } from './ReviewSkeleton';
import { StoryHighlights } from './StoryHighlights';
import { VirtualMasonryGrid } from './VirtualMasonryGrid';

// Types
import type {
    DharmaReview,
    FeedAlgorithm,
    PerformanceMetrics,
    ReviewFilter
} from '../../types/review-system';

interface ReviewFeedProps {
  userId?: string;
  filter?: ReviewFilter;
  algorithm?: FeedAlgorithm;
  showComposer?: boolean;
  enableInfiniteScroll?: boolean;
  enableVirtualScrolling?: boolean;
  onReviewSelect?: (review: DharmaReview) => void;
  onCreateReview?: () => void;
}

export const ReviewFeed: React.FC<ReviewFeedProps> = ({
  userId,
  filter,
  algorithm,
  showComposer = false,
  enableInfiniteScroll = true,
  enableVirtualScrolling = true,
  onReviewSelect,
  onCreateReview,
}) => {
  // State management
  const [reviews, setReviews] = useState<DharmaReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [showComposerModal, setShowComposerModal] = useState(showComposer);

  // Performance tracking
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    cumulativeLayoutShift: 0,
    lighthouseScore: 0,
    memoryUsage: 0,
    networkRequests: 0,
  });

  // Theme and preferences
  const { theme, toggleTheme } = useTheme();

  // Refs
  const feedRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const performanceObserver = useRef<PerformanceObserver | null>(null);

  // Intersection observer for infinite scroll
  const { isIntersecting: shouldLoadMore } = useIntersectionObserver(loadMoreRef, {
    threshold: 0.1,
    rootMargin: '100px',
  });

  // Virtual scrolling for performance
  const virtualScrollData = useVirtualScroll({
    items: reviews,
    itemHeight: (index) => {
      // Dynamic height calculation based on content
      const review = reviews[index];
      if (!review) return 400; // fallback height

      let height = 200; // base height
      if (review.media.length > 0) height += 300; // media height
      if (review.content.length > 100) height += 100; // long content
      if (review.voiceNote) height += 80; // voice note

      return height;
    },
    containerHeight: window.innerHeight,
    enabled: enableVirtualScrolling,
  });

  // Mock data - in real app this would come from API
  const mockReviews: DharmaReview[] = useMemo(() => [
    {
      id: '1',
      eventTitle: 'Morning Meditation Session',
      eventDate: '2025-01-20T06:00:00Z',
      content: [
        { type: 'text', content: 'Such a profound experience this morning! ' },
        { type: 'emoji', content: '🪷' },
        { type: 'text', content: ' The guided meditation helped me find deep inner peace.' },
      ],
      media: [
        {
          id: 'img1',
          type: 'image',
          url: '/images/meditation-hall.jpg',
          thumbnail: '/images/meditation-hall-thumb.jpg',
          dimensions: { width: 800, height: 600 },
          size: 245760,
          mimeType: 'image/jpeg',
        },
      ],
      temple: {
        id: 'temple1',
        name: 'Peaceful Mind Temple',
        avatar: '/images/temple-avatar.jpg',
        verified: true,
      },
      teacher: {
        id: 'teacher1',
        name: 'Venerable Thich Mindful Heart',
        title: 'Senior Monk',
        avatar: '/images/teacher-avatar.jpg',
        verified: true,
      },
      author: {
        id: 'user1',
        username: 'mindful_seeker',
        displayName: 'Sarah Chen',
        avatar: '/images/user-avatar-1.jpg',
        verified: false,
        karma: 1250,
        wisdomLevel: 'practitioner',
      },
      metrics: {
        gratitude: 47,
        comments: 12,
        shares: 8,
        views: 234,
        readingTime: 45,
        wisdomPoints: 23,
        accessibilityScore: 95,
      },
      userInteractions: {
        hasGratitude: false,
        hasBookmarked: false,
        hasShared: false,
        hasReported: false,
      },
      moderationStatus: 'approved',
      qualityScore: 92,
      tags: ['meditation', 'morning-practice', 'mindfulness'],
      hashtags: ['#meditation', '#mindfulness', '#dharma'],
      mentions: ['@temple1', '@teacher1'],
      createdAt: '2025-01-20T07:30:00Z',
      updatedAt: '2025-01-20T07:30:00Z',
      visibility: 'public',
      allowComments: true,
      allowShares: true,
      isFeatured: false,
      isHighlight: true,
      highlightCategory: 'wisdom',
    },
    // Add more mock reviews...
  ], []);

  // Performance monitoring
  useEffect(() => {
    if ('PerformanceObserver' in window) {
      performanceObserver.current = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'paint') {
            if (entry.name === 'first-contentful-paint') {
              setPerformanceMetrics(prev => ({
                ...prev,
                firstContentfulPaint: entry.startTime,
              }));
            }
          } else if (entry.entryType === 'largest-contentful-paint') {
            setPerformanceMetrics(prev => ({
              ...prev,
              largestContentfulPaint: entry.startTime,
            }));
          } else if (entry.entryType === 'layout-shift') {
            setPerformanceMetrics(prev => ({
              ...prev,
              cumulativeLayoutShift: prev.cumulativeLayoutShift + (entry as any).value,
            }));
          }
        });
      });

      performanceObserver.current.observe({
        entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift']
      });
    }

    return () => {
      performanceObserver.current?.disconnect();
    };
  }, []);

  // Load initial reviews
  useEffect(() => {
    loadReviews(0);
  }, [filter, algorithm]);

  // Infinite scroll trigger
  useEffect(() => {
    if (shouldLoadMore && !loadingMore && hasMore && enableInfiniteScroll) {
      loadMoreReviews();
    }
  }, [shouldLoadMore, loadingMore, hasMore, enableInfiniteScroll]);

  // Load reviews function
  const loadReviews = async (pageNumber: number) => {
    try {
      if (pageNumber === 0) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newReviews = mockReviews.map((review, index) => ({
        ...review,
        id: `${review.id}-${pageNumber}-${index}`,
      }));

      if (pageNumber === 0) {
        setReviews(newReviews);
      } else {
        setReviews(prev => [...prev, ...newReviews]);
      }

      setPage(pageNumber);
      setHasMore(pageNumber < 5); // Limit to 5 pages for demo

    } catch (err) {
      setError('Failed to load reviews. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreReviews = useCallback(() => {
    loadReviews(page + 1);
  }, [page]);

  // Handle review interactions
  const handleGratitude = useCallback(async (reviewId: string) => {
    // Optimistic update
    setReviews(prev => prev.map(review => {
      if (review.id === reviewId) {
        const hasGratitude = !review.userInteractions.hasGratitude;
        return {
          ...review,
          userInteractions: {
            ...review.userInteractions,
            hasGratitude,
          },
          metrics: {
            ...review.metrics,
            gratitude: review.metrics.gratitude + (hasGratitude ? 1 : -1),
          },
        };
      }
      return review;
    }));

    // TODO: API call to update gratitude
    try {
      // await api.updateGratitude(reviewId);
    } catch (error) {
      // Revert optimistic update on error
      setReviews(prev => prev.map(review => {
        if (review.id === reviewId) {
          const hasGratitude = review.userInteractions.hasGratitude;
          return {
            ...review,
            userInteractions: {
              ...review.userInteractions,
              hasGratitude: !hasGratitude,
            },
            metrics: {
              ...review.metrics,
              gratitude: review.metrics.gratitude + (hasGratitude ? -1 : 1),
            },
          };
        }
        return review;
      }));
    }
  }, []);

  const handleComment = useCallback((reviewId: string) => {
    // Navigate to review detail with comment focus
    onReviewSelect?.(reviews.find(r => r.id === reviewId)!);
  }, [reviews, onReviewSelect]);

  const handleShare = useCallback(async (reviewId: string) => {
    const review = reviews.find(r => r.id === reviewId);
    if (!review) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `Dharma Review by ${review.author.displayName}`,
          text: review.content.map(c => c.content).join(''),
          url: `${window.location.origin}/reviews/${reviewId}`,
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(`${window.location.origin}/reviews/${reviewId}`);
        // Show toast notification
      }

      // Update share count optimistically
      setReviews(prev => prev.map(r =>
        r.id === reviewId
          ? { ...r, metrics: { ...r.metrics, shares: r.metrics.shares + 1 } }
          : r
      ));

    } catch (error) {
      console.error('Failed to share:', error);
    }
  }, [reviews]);

  // Render review items for virtual or regular scrolling
  const renderReviewItem = useCallback((review: DharmaReview, index: number) => (
    <motion.div
      key={review.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="break-inside-avoid mb-6"
    >
      <ReviewCard
        review={review}
        onGratitude={() => handleGratitude(review.id)}
        onComment={() => handleComment(review.id)}
        onShare={() => handleShare(review.id)}
        onSelect={() => onReviewSelect?.(review)}
      />
    </motion.div>
  ), [handleGratitude, handleComment, handleShare, onReviewSelect]);

  if (loading && reviews.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Story highlights skeleton */}
          <div className="mb-8">
            <div className="flex space-x-4 overflow-x-auto pb-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse mb-2" />
                  <div className="w-12 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto" />
                </div>
              ))}
            </div>
          </div>

          {/* Review cards skeleton */}
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <ReviewSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={feedRef}
      className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Story Highlights */}
        <StoryHighlights className="mb-8" />

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center">
              <span className="text-red-500 mr-2">⚠️</span>
              <span className="text-red-700 dark:text-red-200">{error}</span>
              <button
                onClick={() => loadReviews(0)}
                className="ml-auto text-red-600 dark:text-red-400 hover:underline"
              >
                Retry
              </button>
            </div>
          </motion.div>
        )}

        {/* Main Feed Content */}
        {enableVirtualScrolling ? (
          <VirtualMasonryGrid
            items={reviews}
            renderItem={renderReviewItem}
            itemHeight={(index) => virtualScrollData.getItemHeight(index)}
            columns={{ sm: 1, md: 2, lg: 3, xl: 4 }}
            gap={24}
          />
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6">
            {reviews.map((review, index) => renderReviewItem(review, index))}
          </div>
        )}

        {/* Loading More */}
        {loadingMore && (
          <div className="flex justify-center py-8">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-purple-500 rounded-full animate-pulse" />
              <div className="w-4 h-4 bg-purple-500 rounded-full animate-pulse animation-delay-150" />
              <div className="w-4 h-4 bg-purple-500 rounded-full animate-pulse animation-delay-300" />
            </div>
          </div>
        )}

        {/* Load More Trigger */}
        {enableInfiniteScroll && hasMore && (
          <div ref={loadMoreRef} className="h-10" />
        )}

        {/* End of Feed */}
        {!hasMore && reviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="inline-flex items-center px-6 py-3 bg-white dark:bg-gray-800 rounded-full shadow-lg">
              <span className="text-2xl mr-2">🙏</span>
              <span className="text-gray-600 dark:text-gray-300">
                You've reached the end. Thank you for your mindful scrolling.
              </span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton
        onClick={() => {
          if (onCreateReview) {
            onCreateReview();
          } else {
            setShowComposerModal(true);
          }
        }}
        icon="✍️"
        label="Share Experience"
        className="fixed bottom-6 right-6 z-40"
      />

      {/* Review Composer Modal */}
      <AnimatePresence>
        {showComposerModal && (
          <ReviewComposer
            onClose={() => setShowComposerModal(false)}
            onSubmit={(review) => {
              // Add to top of feed optimistically
              setReviews(prev => [review, ...prev]);
              setShowComposerModal(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Performance Debug (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 bg-black/80 text-white p-2 rounded text-xs z-50">
          <div>FCP: {performanceMetrics.firstContentfulPaint.toFixed(0)}ms</div>
          <div>LCP: {performanceMetrics.largestContentfulPaint.toFixed(0)}ms</div>
          <div>CLS: {performanceMetrics.cumulativeLayoutShift.toFixed(3)}</div>
        </div>
      )}
    </div>
  );
};
