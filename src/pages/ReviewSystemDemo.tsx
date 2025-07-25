/**
 * Review System Demo Page
 *
 * Showcases the complete Instagram/TikTok level review system
 * with all social features and modern UX patterns.
 */

import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

// Components
import { ReviewFeed } from '../components/reviews/ReviewFeed';
import { GlassButton, GlassCard } from '../components/ui';

// Types
import type { DharmaReview, User } from '../types/review-system';

// Mock current user
const mockCurrentUser: User = {
  id: 'current-user',
  username: 'mindful_seeker',
  displayName: 'Sarah Chen',
  avatar: '/images/user-avatar.jpg',
  bio: 'Seeking wisdom through daily practice 🙏',
  verified: false,
  wisdomLevel: 'practitioner',
  practiceInterests: ['meditation', 'mindfulness', 'dharma-study'],
  favoriteTeachers: ['teacher1', 'teacher2'],
  followedTemples: ['temple1', 'temple2'],
  meditationStreak: 42,
  followers: 156,
  following: 89,
  karma: 1250,
  totalWisdomPoints: 340,
  reviewsCount: 23,
  preferences: {
    language: 'en',
    theme: 'system',
    notifications: {
      gratitude: true,
      comments: true,
      follows: true,
      highlights: true,
    },
    privacy: {
      showActivity: true,
      showFollowers: true,
      allowMentions: true,
    },
  },
  badges: [
    {
      id: 'early-adopter',
      name: 'Early Adopter',
      description: 'Joined during beta',
      icon: '🌟',
      rarity: 'rare',
      unlockedAt: '2025-01-01T00:00:00Z',
    },
    {
      id: 'meditation-streak',
      name: '30-Day Streak',
      description: 'Meditated for 30 consecutive days',
      icon: '🧘‍♀️',
      rarity: 'common',
      unlockedAt: '2025-01-15T00:00:00Z',
    },
  ],
  achievements: [
    {
      id: 'first-review',
      title: 'First Review',
      description: 'Shared your first dharma experience',
      icon: '✍️',
      category: 'reviews',
      points: 50,
      unlockedAt: '2025-01-05T00:00:00Z',
    },
  ],
  lastActive: new Date().toISOString(),
  joinedAt: '2024-12-01T00:00:00Z',
};

export const ReviewSystemDemo: React.FC = () => {
  const [showStats, setShowStats] = useState(false);
  const [selectedReview, setSelectedReview] = useState<DharmaReview | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    cumulativeLayoutShift: 0,
  });

  // Performance monitoring
  useEffect(() => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
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

      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift'] });
      return () => observer.disconnect();
    }
  }, []);

  // Handle review selection
  const handleReviewSelect = (review: DharmaReview) => {
    setSelectedReview(review);
  };

  // Handle create review
  const handleCreateReview = () => {
    console.log('Create new review');
    // In a real app, this would open the review composer
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.h1
                className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                🪷 Dharma Reviews
              </motion.h1>
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-sm rounded-full font-medium">
                Instagram/TikTok Level
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <GlassButton
                variant={showStats ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setShowStats(!showStats)}
              >
                📊 Performance
              </GlassButton>

              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {mockCurrentUser.displayName.charAt(0)}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {mockCurrentUser.displayName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    🧘‍♀️ {mockCurrentUser.wisdomLevel} • {mockCurrentUser.karma} karma
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Performance Stats */}
      <AnimatePresence>
        {showStats && (
          <motion.div
            className="sticky top-16 z-30 bg-gradient-to-r from-blue-500 to-purple-600 text-white"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="max-w-6xl mx-auto px-4 py-3">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold">
                    {performanceMetrics.firstContentfulPaint.toFixed(0)}ms
                  </div>
                  <div className="opacity-75">First Contentful Paint</div>
                  <div className="text-xs opacity-50">Target: &lt; 1.5s</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">
                    {performanceMetrics.largestContentfulPaint.toFixed(0)}ms
                  </div>
                  <div className="opacity-75">Largest Contentful Paint</div>
                  <div className="text-xs opacity-50">Target: &lt; 2.5s</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">
                    {performanceMetrics.cumulativeLayoutShift.toFixed(3)}
                  </div>
                  <div className="opacity-75">Cumulative Layout Shift</div>
                  <div className="text-xs opacity-50">Target: &lt; 0.1</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="relative">
        {/* Feature Highlights */}
        <div className="max-w-6xl mx-auto px-4 py-6">
          <motion.div
            className="grid md:grid-cols-4 gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="p-4 text-center">
              <div className="text-2xl mb-2">🪷</div>
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                Gratitude Animation
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Falling lotus petals
              </p>
            </GlassCard>

            <GlassCard className="p-4 text-center">
              <div className="text-2xl mb-2">📱</div>
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                Mobile Optimized
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Touch gestures & swipes
              </p>
            </GlassCard>

            <GlassCard className="p-4 text-center">
              <div className="text-2xl mb-2">♾️</div>
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                Infinite Scroll
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Virtual scrolling performance
              </p>
            </GlassCard>

            <GlassCard className="p-4 text-center">
              <div className="text-2xl mb-2">🎨</div>
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                Masonry Layout
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Pinterest-style grid
              </p>
            </GlassCard>
          </motion.div>
        </div>

        {/* Review Feed */}
        <ReviewFeed
          userId={mockCurrentUser.id}
          onReviewSelect={handleReviewSelect}
          onCreateReview={handleCreateReview}
          enableInfiniteScroll={true}
          enableVirtualScrolling={false} // Disabled for demo to show all content
        />
      </main>

      {/* Review Detail Modal */}
      <AnimatePresence>
        {selectedReview && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedReview(null)}
          >
            <motion.div
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Review Details
                  </h2>
                  <button
                    onClick={() => setSelectedReview(null)}
                    className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {selectedReview.eventTitle}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      by {selectedReview.author.displayName} • {selectedReview.temple.name}
                    </p>
                  </div>

                  <div className="prose dark:prose-invert">
                    <p>{selectedReview.content.map(c => c.content).join('')}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center py-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <div className="text-lg font-semibold text-orange-600">
                        {selectedReview.metrics.gratitude}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Gratitude
                      </div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-blue-600">
                        {selectedReview.metrics.comments}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Comments
                      </div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-purple-600">
                        {selectedReview.metrics.wisdomPoints}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Wisdom Points
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
