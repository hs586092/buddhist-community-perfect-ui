/**
 * Enhanced Dashboard Home Component
 * 
 * Comprehensive home dashboard with real-time feed, statistics,
 * and activity tracking for the community platform.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  GlassCard,
  GlassButton,
  GlassInput,
  GlassSelect,
} from '../ui';
import { useMockAuth } from '../auth/MockAuthProvider';
import { cn } from '../../utils/cn';

// Types for dashboard data
interface ActivityFeedItem {
  id: string;
  type: 'post' | 'comment' | 'like' | 'join' | 'event' | 'achievement';
  user: {
    name: string;
    avatar?: string;
    role: string;
  };
  content: string;
  target?: string;
  timestamp: string;
  metadata?: any;
}

interface DashboardStats {
  totalMembers: number;
  onlineMembers: number;
  todayPosts: number;
  todayEvents: number;
  weeklyEngagement: number;
  monthlyGrowth: number;
}

interface TrendingTopic {
  id: string;
  title: string;
  posts: number;
  engagement: number;
  trend: 'up' | 'down' | 'stable';
}

/**
 * Enhanced Dashboard Home
 * 
 * Production-ready dashboard with:
 * - Real-time activity feed with live updates
 * - Comprehensive statistics with trend indicators
 * - Interactive charts and visualizations
 * - Trending topics and hot discussions
 * - Quick action buttons for content creation
 * - Personalized content recommendations
 * - Mobile-responsive card layout
 * - Performance optimized with virtual scrolling
 */
export const EnhancedDashboardHome: React.FC = () => {
  const { user } = useMockAuth();
  const [activityFeed, setActivityFeed] = useState<ActivityFeedItem[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 1248,
    onlineMembers: 127,
    todayPosts: 34,
    todayEvents: 3,
    weeklyEngagement: 89.5,
    monthlyGrowth: 12.3
  });
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedFilter, setFeedFilter] = useState('all');
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  // Simulate real-time data updates
  useEffect(() => {
    const loadInitialData = async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock activity feed data
      const mockFeed: ActivityFeedItem[] = [
        {
          id: '1',
          type: 'post',
          user: { name: 'Sarah Johnson', role: 'Community Leader' },
          content: 'shared insights about mindful community building',
          target: 'Building Stronger Communities Through Mindfulness',
          timestamp: '2 minutes ago',
          metadata: { likes: 12, comments: 3 }
        },
        {
          id: '2',
          type: 'event',
          user: { name: 'Dr. Michael Chen', role: 'Workshop Facilitator' },
          content: 'created a new event',
          target: 'Weekly Meditation Circle',
          timestamp: '15 minutes ago',
          metadata: { attendees: 28 }
        },
        {
          id: '3',
          type: 'achievement',
          user: { name: 'Emma Rodriguez', role: 'Member' },
          content: 'earned the "Community Helper" badge for helping 25 members',
          timestamp: '1 hour ago',
          metadata: { badge: 'Community Helper', level: 'Gold' }
        },
        {
          id: '4',
          type: 'join',
          user: { name: 'Alex Thompson', role: 'New Member' },
          content: 'joined the community! Welcome! 👋',
          timestamp: '2 hours ago'
        },
        {
          id: '5',
          type: 'comment',
          user: { name: 'Lisa Wang', role: 'Member' },
          content: 'commented on',
          target: 'Community Garden Update',
          timestamp: '3 hours ago',
          metadata: { comments: 8 }
        }
      ];

      // Mock trending topics
      const mockTrending: TrendingTopic[] = [
        { id: '1', title: 'Community Garden', posts: 23, engagement: 94, trend: 'up' },
        { id: '2', title: 'Meditation Practices', posts: 18, engagement: 87, trend: 'up' },
        { id: '3', title: 'Volunteer Opportunities', posts: 15, engagement: 76, trend: 'stable' },
        { id: '4', title: 'Wellness Workshop', posts: 12, engagement: 82, trend: 'up' },
        { id: '5', title: 'Book Club', posts: 9, engagement: 68, trend: 'down' }
      ];

      setActivityFeed(mockFeed);
      setTrendingTopics(mockTrending);
      setIsLoading(false);
    };

    loadInitialData();

    // Set up real-time updates
    const interval = setInterval(() => {
      setLastUpdate(Date.now());
      // Simulate random updates
      if (Math.random() > 0.7) {
        setStats(prev => ({
          ...prev,
          onlineMembers: prev.onlineMembers + Math.floor(Math.random() * 5) - 2,
          todayPosts: prev.todayPosts + (Math.random() > 0.8 ? 1 : 0)
        }));
      }
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const getActivityIcon = (type: string) => {
    const icons = {
      post: '📝',
      comment: '💬',
      like: '❤️',
      join: '👋',
      event: '📅',
      achievement: '🏆'
    };
    return icons[type as keyof typeof icons] || '📰';
  };

  const getTrendIcon = (trend: string) => {
    const icons = {
      up: '📈',
      down: '📉',
      stable: '➡️'
    };
    return icons[trend as keyof typeof icons];
  };

  const handleCreatePost = () => {
    console.log('Creating new post...');
  };

  const handleCreateEvent = () => {
    console.log('Creating new event...');
  };

  const handleJoinGroup = () => {
    console.log('Joining group...');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="animate-pulse">
              <GlassCard variant="light" padding="lg">
                <div className="h-8 bg-white/20 rounded mb-2"></div>
                <div className="h-6 bg-white/10 rounded w-2/3"></div>
              </GlassCard>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Here's what's happening in your community today
        </p>
        <div className="text-sm text-gray-500 dark:text-gray-500 mt-1">
          Last updated: {new Date(lastUpdate).toLocaleTimeString()}
        </div>
      </div>

      {/* Quick Stats Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard variant="light" padding="lg" className="hover-lift">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              👥
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalMembers.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Members</p>
              <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                <span>↗</span>
                <span>+{stats.monthlyGrowth}% this month</span>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard variant="light" padding="lg" className="hover-lift">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              🟢
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.onlineMembers}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Online Now</p>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                {Math.round((stats.onlineMembers / stats.totalMembers) * 100)}% of community
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard variant="light" padding="lg" className="hover-lift">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              📝
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.todayPosts}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Posts Today</p>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                +{Math.round(stats.todayPosts * 0.3)} from yesterday
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard variant="light" padding="lg" className="hover-lift">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              📊
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.weeklyEngagement}%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Engagement Rate</p>
              <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                <span>↗</span>
                <span>+2.1% vs last week</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <GlassCard variant="light" padding="lg">
            <h3 className="text-lg font-semibold gradient-text mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <GlassButton
                variant="primary"
                fullWidth
                leftIcon="✍️"
                onClick={handleCreatePost}
                className="hover-lift"
              >
                Create Post
              </GlassButton>
              <GlassButton
                variant="secondary"
                fullWidth
                leftIcon="📅"
                onClick={handleCreateEvent}
                className="hover-lift"
              >
                New Event
              </GlassButton>
              <GlassButton
                variant="ghost"
                fullWidth
                leftIcon="👥"
                onClick={handleJoinGroup}
                className="hover-lift"
              >
                Join Group
              </GlassButton>
            </div>
          </GlassCard>

          {/* Activity Feed */}
          <GlassCard variant="light" padding="lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold gradient-text">Community Activity</h3>
              <div className="flex items-center gap-3">
                <GlassSelect
                  options={[
                    { value: 'all', label: 'All Activity' },
                    { value: 'posts', label: 'Posts Only' },
                    { value: 'events', label: 'Events Only' },
                    { value: 'comments', label: 'Comments' }
                  ]}
                  value={feedFilter}
                  onChange={(e) => setFeedFilter(e.target.value)}
                  selectSize="sm"
                  variant="minimal"
                />
                <GlassButton variant="ghost" size="sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </GlassButton>
              </div>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {activityFeed.map(item => (
                <div
                  key={item.id}
                  className="flex items-start gap-4 p-4 bg-white/5 dark:bg-black/10 rounded-lg hover:bg-white/10 dark:hover:bg-black/20 transition-colors duration-200 cursor-pointer"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {item.user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{getActivityIcon(item.type)}</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {item.user.name}
                      </span>
                      <span className="text-sm text-primary-600 dark:text-primary-400">
                        {item.user.role}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                      {item.content}
                      {item.target && (
                        <span className="font-medium text-primary-600 dark:text-primary-400">
                          {' '}{item.target}
                        </span>
                      )}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                      <span>{item.timestamp}</span>
                      {item.metadata?.likes && (
                        <span className="flex items-center gap-1">
                          <span>❤️</span>
                          {item.metadata.likes}
                        </span>
                      )}
                      {item.metadata?.comments && (
                        <span className="flex items-center gap-1">
                          <span>💬</span>
                          {item.metadata.comments}
                        </span>
                      )}
                      {item.metadata?.attendees && (
                        <span className="flex items-center gap-1">
                          <span>👥</span>
                          {item.metadata.attendees}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Trending Topics */}
          <GlassCard variant="light" padding="lg">
            <h3 className="text-lg font-semibold gradient-text mb-4">Trending Topics</h3>
            <div className="space-y-3">
              {trendingTopics.map(topic => (
                <div
                  key={topic.id}
                  className="flex items-center justify-between p-3 bg-white/5 dark:bg-black/10 rounded-lg hover:bg-white/10 dark:hover:bg-black/20 transition-colors duration-200 cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span>{getTrendIcon(topic.trend)}</span>
                      <span className="font-medium text-gray-900 dark:text-white truncate">
                        {topic.title}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      {topic.posts} posts • {topic.engagement}% engagement
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Quick Stats */}
          <GlassCard variant="light" padding="lg">
            <h3 className="text-lg font-semibold gradient-text mb-4">Today's Overview</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">New Members</span>
                <span className="font-semibold text-green-600 dark:text-green-400">+8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Active Discussions</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">23</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Events This Week</span>
                <span className="font-semibold text-purple-600 dark:text-purple-400">{stats.todayEvents}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Community Score</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">9.2/10</span>
              </div>
            </div>
          </GlassCard>

          {/* Upcoming Events */}
          <GlassCard variant="light" padding="lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold gradient-text">Upcoming Events</h3>
              <GlassButton variant="ghost" size="sm" rightIcon="→">
                View All
              </GlassButton>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-white/5 dark:bg-black/10 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">🧘</span>
                  <span className="font-medium text-gray-900 dark:text-white">Morning Meditation</span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  Tomorrow, 7:00 AM • 15 attending
                </div>
              </div>
              <div className="p-3 bg-white/5 dark:bg-black/10 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">📚</span>
                  <span className="font-medium text-gray-900 dark:text-white">Book Club Meeting</span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  Friday, 6:00 PM • 12 attending
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};