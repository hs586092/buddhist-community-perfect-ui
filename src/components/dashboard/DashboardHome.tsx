import React, { useEffect, useState } from 'react';
import {
  GlassCard,
  GlassButton,
  GlassInput,
} from '../ui';
import { contentApi, communityApi } from '../../services/api';
import { useMockAuth } from '../auth/MockAuthProvider';

interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
  };
  createdAt: string;
  likes: number;
  comments: number;
}

interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  location: string;
  attendees: number;
}

/**
 * DashboardHome Component
 * 
 * Main dashboard content showing recent activity, posts, and events.
 * Integrates with content and community APIs for real-time data.
 */
export const DashboardHome: React.FC = () => {
  const { user } = useMockAuth();
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for development
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // In a real app, these would be actual API calls
        // const postsResponse = await contentApi.getArticles({ limit: 5 });
        // const eventsResponse = await communityApi.getEvents({ upcoming: true, limit: 4 });
        
        // Mock data for now
        setRecentPosts([
          {
            id: '1',
            title: 'Weekly Community Meditation Session',
            content: 'Join us for a peaceful meditation session this Thursday evening. All levels welcome!',
            author: { name: 'Sarah Johnson' },
            createdAt: '2024-01-15T10:30:00Z',
            likes: 24,
            comments: 8
          },
          {
            id: '2',
            title: 'New Resource: Mindfulness Guide',
            content: 'We\'ve published a comprehensive guide on mindfulness practices. Check it out in our resources section.',
            author: { name: 'Dr. Michael Chen' },
            createdAt: '2024-01-14T15:45:00Z',
            likes: 42,
            comments: 15
          },
          {
            id: '3',
            title: 'Community Garden Update',
            content: 'Great progress on our community garden! Thanks to everyone who participated in this weekend\'s planting session.',
            author: { name: 'Emily Rodriguez' },
            createdAt: '2024-01-13T09:20:00Z',
            likes: 38,
            comments: 12
          }
        ]);

        setUpcomingEvents([
          {
            id: '1',
            title: 'Monthly Community Meeting',
            description: 'Discuss upcoming projects and community initiatives',
            startDate: '2024-01-20T19:00:00Z',
            location: 'Community Center - Main Hall',
            attendees: 45
          },
          {
            id: '2',
            title: 'Yoga & Wellness Workshop',
            description: 'Beginner-friendly yoga session with wellness tips',
            startDate: '2024-01-22T10:00:00Z',
            location: 'Community Center - Studio A',
            attendees: 28
          },
          {
            id: '3',
            title: 'Book Club: "The Power of Now"',
            description: 'Monthly book discussion and sharing circle',
            startDate: '2024-01-25T18:30:00Z',
            location: 'Community Library',
            attendees: 16
          }
        ]);

      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <GlassCard variant="light" padding="lg">
            <div className="h-8 bg-white/20 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-white/10 rounded"></div>
              <div className="h-4 bg-white/10 rounded w-3/4"></div>
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <GlassCard variant="light" padding="lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-xl font-semibold gradient-text">
            Quick Actions
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <GlassButton
            variant="primary"
            size="md"
            fullWidth
            leftIcon="✏️"
          >
            Create Post
          </GlassButton>
          <GlassButton
            variant="secondary"
            size="md"
            fullWidth
            leftIcon="📅"
          >
            Schedule Event
          </GlassButton>
          <GlassButton
            variant="ghost"
            size="md"
            fullWidth
            leftIcon="👥"
          >
            Invite Members
          </GlassButton>
        </div>
      </GlassCard>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <GlassCard variant="light" padding="lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold gradient-text">
              Recent Posts
            </h2>
            <GlassButton variant="ghost" size="sm" rightIcon="→">
              View All
            </GlassButton>
          </div>

          <div className="space-y-4">
            {recentPosts.map((post) => (
              <div
                key={post.id}
                className="p-4 bg-white/5 dark:bg-black/10 rounded-lg border border-white/10 hover:bg-white/10 dark:hover:bg-black/20 transition-colors duration-200 cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                    {post.author.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1 truncate">
                      {post.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                      <span>{post.author.name}</span>
                      <span>•</span>
                      <span>{formatDate(post.createdAt)}</span>
                      <span>•</span>
                      <span>❤️ {post.likes}</span>
                      <span>💬 {post.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Upcoming Events */}
        <GlassCard variant="light" padding="lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold gradient-text">
              Upcoming Events
            </h2>
            <GlassButton variant="ghost" size="sm" rightIcon="→">
              View Calendar
            </GlassButton>
          </div>

          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="p-4 bg-white/5 dark:bg-black/10 rounded-lg border border-white/10 hover:bg-white/10 dark:hover:bg-black/20 transition-colors duration-200 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      {event.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {event.description}
                    </p>
                    <div className="flex flex-col gap-1 text-xs text-gray-500 dark:text-gray-500">
                      <div className="flex items-center gap-1">
                        <span>📅</span>
                        <span>{formatEventDate(event.startDate)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>📍</span>
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>👥</span>
                        <span>{event.attendees} attending</span>
                      </div>
                    </div>
                  </div>
                  <GlassButton variant="ghost" size="xs">
                    RSVP
                  </GlassButton>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Activity Feed */}
      <GlassCard variant="light" padding="lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold gradient-text">
            Community Activity
          </h2>
          <div className="flex gap-2">
            <GlassButton variant="ghost" size="sm">
              Filter
            </GlassButton>
            <GlassButton variant="ghost" size="sm">
              Refresh
            </GlassButton>
          </div>
        </div>

        {/* Activity Items */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-white/5 dark:bg-black/10 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm">
              <span className="font-medium">Sarah Johnson</span> joined the Weekly Meditation group
            </span>
            <span className="text-xs text-gray-500 ml-auto">2m ago</span>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-white/5 dark:bg-black/10 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm">
              <span className="font-medium">Book Club Event</span> has been updated with new location
            </span>
            <span className="text-xs text-gray-500 ml-auto">5m ago</span>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-white/5 dark:bg-black/10 rounded-lg">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-sm">
              <span className="font-medium">Community Garden</span> post received 10 new likes
            </span>
            <span className="text-xs text-gray-500 ml-auto">8m ago</span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};