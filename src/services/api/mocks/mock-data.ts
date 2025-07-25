/**
 * Mock Data for API Clients
 * Comprehensive mock data for development and testing
 */

import {
  User,
  Post,
  Comment,
  MediaFile,
  Group,
  Event,
  Notification,
  Metric,
  AnalyticsReport,
  SearchResult,
  AdminUser,
  ModerationAction,
  SystemSettings
} from '../types'

// ============================================================================
// User Mock Data
// ============================================================================

export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'lama.tenzin@temple.com',
    username: 'lama_tenzin',
    displayName: 'Lama Tenzin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    bio: 'Tibetan Buddhist monk and meditation teacher. Sharing the path to inner peace.',
    location: 'Dharamshala, India',
    website: 'https://dharma-teachings.org',
    isVerified: true,
    isActive: true,
    role: 'moderator',
    preferences: {
      theme: 'light',
      language: 'en',
      notifications: {
        email: true,
        push: true,
        mentions: true,
        comments: true,
        groups: true,
        events: true
      },
      privacy: {
        profileVisibility: 'public',
        showEmail: false,
        showLocation: true,
        allowMessages: true
      }
    },
    stats: {
      postsCount: 127,
      commentsCount: 450,
      groupsCount: 8,
      eventsAttended: 23,
      reputation: 950,
      level: 15
    },
    createdAt: '2023-01-15T08:30:00Z',
    updatedAt: '2025-01-22T10:15:00Z'
  },
  {
    id: 'user-2',
    email: 'sara.mindful@gmail.com',
    username: 'mindful_sara',
    displayName: 'Sara Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b3f2?w=150',
    bio: 'Mindfulness practitioner and meditation student. Finding peace in daily practice.',
    location: 'San Francisco, CA',
    isVerified: false,
    isActive: true,
    role: 'user',
    preferences: {
      theme: 'dark',
      language: 'en',
      notifications: {
        email: true,
        push: false,
        mentions: true,
        comments: true,
        groups: false,
        events: true
      },
      privacy: {
        profileVisibility: 'friends',
        showEmail: false,
        showLocation: false,
        allowMessages: true
      }
    },
    stats: {
      postsCount: 34,
      commentsCount: 128,
      groupsCount: 3,
      eventsAttended: 7,
      reputation: 280,
      level: 5
    },
    createdAt: '2024-03-22T14:20:00Z',
    updatedAt: '2025-01-21T16:45:00Z'
  },
  {
    id: 'user-3',
    email: 'admin@buddhist-community.org',
    username: 'community_admin',
    displayName: 'Community Admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    bio: 'Platform administrator and community facilitator.',
    isVerified: true,
    isActive: true,
    role: 'admin',
    preferences: {
      theme: 'system',
      language: 'en',
      notifications: {
        email: true,
        push: true,
        mentions: true,
        comments: false,
        groups: true,
        events: true
      },
      privacy: {
        profileVisibility: 'public',
        showEmail: false,
        showLocation: false,
        allowMessages: true
      }
    },
    stats: {
      postsCount: 89,
      commentsCount: 234,
      groupsCount: 12,
      eventsAttended: 45,
      reputation: 1200,
      level: 20
    },
    createdAt: '2022-11-01T09:00:00Z',
    updatedAt: '2025-01-22T08:30:00Z'
  }
]

export const mockAdminUsers: AdminUser[] = mockUsers.map(user => ({
  ...user,
  lastLoginAt: '2025-01-22T09:15:00Z',
  loginCount: Math.floor(Math.random() * 500) + 50,
  isBlocked: false,
  moderationHistory: []
}))

// ============================================================================
// Post Mock Data
// ============================================================================

export const mockPosts: Post[] = [
  {
    id: 'post-1',
    authorId: 'user-1',
    author: mockUsers[0],
    title: 'The Practice of Mindful Breathing',
    content: 'Mindful breathing is the foundation of meditation practice. By focusing on the natural rhythm of our breath, we cultivate present-moment awareness and inner peace...',
    excerpt: 'Discover the transformative power of mindful breathing in daily meditation practice.',
    slug: 'practice-of-mindful-breathing',
    status: 'published',
    visibility: 'public',
    type: 'text',
    category: 'meditation',
    tags: ['mindfulness', 'breathing', 'meditation', 'practice'],
    media: [],
    metadata: {
      readTime: 5,
      wordCount: 850,
      language: 'en',
      mentions: [],
      externalLinks: []
    },
    stats: {
      views: 1247,
      likes: 89,
      shares: 23,
      comments: 15,
      bookmarks: 34
    },
    createdAt: '2025-01-20T10:30:00Z',
    updatedAt: '2025-01-20T10:30:00Z',
    publishedAt: '2025-01-20T10:30:00Z'
  },
  {
    id: 'post-2',
    authorId: 'user-2',
    author: mockUsers[1],
    title: 'My Journey with Meditation',
    content: 'Starting meditation seemed daunting at first, but with patience and consistent practice, it has transformed my daily life. Here\'s what I\'ve learned...',
    excerpt: 'A personal story of transformation through meditation practice.',
    slug: 'my-journey-with-meditation',
    status: 'published',
    visibility: 'public',
    type: 'text',
    category: 'personal-stories',
    tags: ['meditation', 'journey', 'transformation', 'beginners'],
    media: [],
    metadata: {
      readTime: 3,
      wordCount: 520,
      language: 'en',
      mentions: ['user-1'],
      externalLinks: []
    },
    stats: {
      views: 892,
      likes: 67,
      shares: 12,
      comments: 8,
      bookmarks: 19
    },
    createdAt: '2025-01-21T15:45:00Z',
    updatedAt: '2025-01-21T15:45:00Z',
    publishedAt: '2025-01-21T15:45:00Z'
  }
]

// ============================================================================
// Comment Mock Data
// ============================================================================

export const mockComments: Comment[] = [
  {
    id: 'comment-1',
    postId: 'post-1',
    authorId: 'user-2',
    author: mockUsers[1],
    content: 'Thank you for sharing this wisdom. I\'ve been struggling with my breathing practice and this really helps.',
    status: 'active',
    likes: 12,
    isLiked: false,
    createdAt: '2025-01-20T14:20:00Z',
    updatedAt: '2025-01-20T14:20:00Z'
  },
  {
    id: 'comment-2',
    postId: 'post-1',
    authorId: 'user-3',
    author: mockUsers[2],
    content: 'Wonderful explanation! This is exactly what our community needs to see more of.',
    status: 'active',
    likes: 8,
    isLiked: true,
    createdAt: '2025-01-20T16:10:00Z',
    updatedAt: '2025-01-20T16:10:00Z'
  }
]

// ============================================================================
// Media Mock Data
// ============================================================================

export const mockMediaFiles: MediaFile[] = [
  {
    id: 'media-1',
    filename: 'meditation-guide.pdf',
    originalName: 'Beginner\'s Meditation Guide.pdf',
    mimeType: 'application/pdf',
    size: 2485760, // ~2.4MB
    url: 'https://example.com/media/meditation-guide.pdf',
    altText: 'Comprehensive meditation guide for beginners',
    metadata: {
      format: 'PDF'
    },
    uploadedAt: '2025-01-19T12:00:00Z'
  },
  {
    id: 'media-2',
    filename: 'temple-sunset.jpg',
    originalName: 'Beautiful Temple at Sunset.jpg',
    mimeType: 'image/jpeg',
    size: 1547832, // ~1.5MB
    url: 'https://images.unsplash.com/photo-1544737151-6e4b4b6b5f7a?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544737151-6e4b4b6b5f7a?w=300',
    altText: 'Peaceful temple at sunset',
    metadata: {
      width: 1920,
      height: 1080,
      quality: 'high',
      format: 'JPEG'
    },
    uploadedAt: '2025-01-18T08:30:00Z'
  }
]

// ============================================================================
// Group Mock Data
// ============================================================================

export const mockGroups: Group[] = [
  {
    id: 'group-1',
    name: 'Meditation Circle',
    description: 'A supportive community for meditation practitioners of all levels. Share experiences, ask questions, and grow together.',
    slug: 'meditation-circle',
    type: 'public',
    category: 'meditation',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    avatar: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150',
    ownerId: 'user-1',
    owner: mockUsers[0],
    moderators: [mockUsers[2]],
    members: mockUsers,
    stats: {
      membersCount: 127,
      postsCount: 89,
      eventsCount: 12,
      activeMembers: 45
    },
    settings: {
      allowInvites: true,
      requireApproval: false,
      allowPosts: true,
      allowEvents: true,
      visibility: 'public'
    },
    createdAt: '2023-06-15T10:00:00Z',
    updatedAt: '2025-01-22T09:30:00Z'
  },
  {
    id: 'group-2',
    name: 'Buddhist Philosophy Study',
    description: 'Deep dive into Buddhist teachings and philosophical discussions. Weekly study sessions and thoughtful conversations.',
    slug: 'buddhist-philosophy-study',
    type: 'private',
    category: 'study',
    coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    ownerId: 'user-3',
    owner: mockUsers[2],
    moderators: [mockUsers[0]],
    members: [mockUsers[0], mockUsers[2]],
    stats: {
      membersCount: 34,
      postsCount: 156,
      eventsCount: 8,
      activeMembers: 18
    },
    settings: {
      allowInvites: false,
      requireApproval: true,
      allowPosts: true,
      allowEvents: true,
      visibility: 'members'
    },
    createdAt: '2024-02-20T14:15:00Z',
    updatedAt: '2025-01-21T16:20:00Z'
  }
]

// ============================================================================
// Event Mock Data
// ============================================================================

export const mockEvents: Event[] = [
  {
    id: 'event-1',
    title: 'Weekly Meditation Session',
    description: 'Join us for our weekly group meditation session. All levels welcome. We\'ll practice mindfulness meditation followed by tea and discussion.',
    slug: 'weekly-meditation-session-jan-25',
    type: 'hybrid',
    status: 'published',
    organizerId: 'user-1',
    organizer: mockUsers[0],
    groupId: 'group-1',
    group: mockGroups[0],
    startDate: '2025-01-25T18:00:00Z',
    endDate: '2025-01-25T19:30:00Z',
    timezone: 'America/Los_Angeles',
    location: {
      name: 'Community Center',
      address: '123 Main St, San Francisco, CA 94102',
      coordinates: { lat: 37.7749, lng: -122.4194 },
      virtualLink: 'https://zoom.us/j/123456789'
    },
    capacity: 30,
    attendees: [mockUsers[1], mockUsers[2]],
    waitlist: [],
    tags: ['meditation', 'mindfulness', 'community'],
    stats: {
      attendeesCount: 18,
      waitlistCount: 0,
      interestedCount: 25,
      views: 156
    },
    createdAt: '2025-01-15T12:00:00Z',
    updatedAt: '2025-01-22T10:00:00Z'
  },
  {
    id: 'event-2',
    title: 'Introduction to Buddhism Workshop',
    description: 'A comprehensive introduction to Buddhist principles and practices. Perfect for beginners or those looking to deepen their understanding.',
    slug: 'introduction-to-buddhism-workshop',
    type: 'online',
    status: 'published',
    organizerId: 'user-3',
    organizer: mockUsers[2],
    startDate: '2025-02-01T15:00:00Z',
    endDate: '2025-02-01T17:00:00Z',
    timezone: 'America/Los_Angeles',
    location: {
      name: 'Online Workshop',
      address: 'Virtual Event',
      virtualLink: 'https://zoom.us/j/987654321'
    },
    capacity: 100,
    attendees: [mockUsers[0], mockUsers[1]],
    waitlist: [],
    tags: ['buddhism', 'workshop', 'beginners', 'education'],
    stats: {
      attendeesCount: 67,
      waitlistCount: 0,
      interestedCount: 89,
      views: 234
    },
    createdAt: '2025-01-10T09:00:00Z',
    updatedAt: '2025-01-20T14:30:00Z'
  }
]

// ============================================================================
// Notification Mock Data
// ============================================================================

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-2',
    type: 'post_like',
    title: 'Your post was liked',
    message: 'Lama Tenzin liked your post "My Journey with Meditation"',
    data: {
      postId: 'post-2',
      likerId: 'user-1'
    },
    isRead: false,
    actionUrl: '/posts/my-journey-with-meditation',
    createdAt: '2025-01-22T11:30:00Z'
  },
  {
    id: 'notif-2',
    userId: 'user-1',
    type: 'comment_reply',
    title: 'New comment on your post',
    message: 'Sara Chen commented on your post "The Practice of Mindful Breathing"',
    data: {
      postId: 'post-1',
      commentId: 'comment-1',
      commenterId: 'user-2'
    },
    isRead: true,
    actionUrl: '/posts/practice-of-mindful-breathing#comment-1',
    createdAt: '2025-01-20T14:21:00Z'
  },
  {
    id: 'notif-3',
    userId: 'user-2',
    type: 'event_reminder',
    title: 'Event reminder',
    message: 'Weekly Meditation Session starts in 2 hours',
    data: {
      eventId: 'event-1'
    },
    isRead: false,
    actionUrl: '/events/weekly-meditation-session-jan-25',
    createdAt: '2025-01-25T16:00:00Z'
  }
]

// ============================================================================
// Analytics Mock Data
// ============================================================================

export const mockMetrics: Metric[] = [
  {
    id: 'metric-1',
    name: 'page_views',
    value: 1247,
    unit: 'count',
    category: 'engagement',
    tags: { page: 'posts', user_type: 'registered' },
    timestamp: '2025-01-22T10:00:00Z'
  },
  {
    id: 'metric-2',
    name: 'user_sessions',
    value: 89,
    unit: 'count',
    category: 'activity',
    tags: { device: 'mobile', location: 'US' },
    timestamp: '2025-01-22T10:15:00Z'
  },
  {
    id: 'metric-3',
    name: 'meditation_posts_created',
    value: 5,
    unit: 'count',
    category: 'content',
    tags: { category: 'meditation', quality: 'high' },
    timestamp: '2025-01-22T09:30:00Z'
  }
]

export const mockAnalyticsReports: AnalyticsReport[] = [
  {
    id: 'report-1',
    name: 'Weekly Community Engagement',
    description: 'Weekly overview of community activity and engagement metrics',
    type: 'engagement',
    config: {
      metrics: ['page_views', 'user_sessions', 'posts_created'],
      timeframe: '7d',
      groupBy: 'day'
    },
    schedule: {
      frequency: 'weekly',
      recipients: ['admin@buddhist-community.org']
    },
    createdAt: '2024-12-01T10:00:00Z',
    updatedAt: '2025-01-15T14:30:00Z'
  }
]

// ============================================================================
// Search Mock Data
// ============================================================================

export const mockSearchResults: SearchResult[] = [
  {
    id: 'post-1',
    type: 'post',
    title: 'The Practice of Mindful Breathing',
    description: 'Mindful breathing is the foundation of meditation practice. By focusing on the natural rhythm of our breath...',
    url: '/posts/practice-of-mindful-breathing',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300',
    metadata: {
      author: 'Lama Tenzin',
      category: 'meditation',
      publishedAt: '2025-01-20T10:30:00Z'
    },
    score: 0.95,
    highlights: {
      title: ['The Practice of <em>Mindful</em> <em>Breathing</em>'],
      content: ['<em>Mindful</em> <em>breathing</em> is the foundation of meditation practice']
    }
  },
  {
    id: 'user-1',
    type: 'user',
    title: 'Lama Tenzin',
    description: 'Tibetan Buddhist monk and meditation teacher. Sharing the path to inner peace.',
    url: '/users/lama_tenzin',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    metadata: {
      username: 'lama_tenzin',
      verified: true,
      reputation: 950
    },
    score: 0.88
  },
  {
    id: 'group-1',
    type: 'group',
    title: 'Meditation Circle',
    description: 'A supportive community for meditation practitioners of all levels. Share experiences, ask questions, and grow together.',
    url: '/groups/meditation-circle',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150',
    metadata: {
      memberCount: 127,
      type: 'public',
      category: 'meditation'
    },
    score: 0.82
  }
]

// ============================================================================
// Moderation Mock Data
// ============================================================================

export const mockModerationActions: ModerationAction[] = [
  {
    id: 'mod-1',
    type: 'approve',
    reason: 'Content reviewed and approved for community guidelines compliance',
    moderatorId: 'user-3',
    moderator: mockUsers[2],
    targetType: 'post',
    targetId: 'post-1',
    createdAt: '2025-01-20T11:00:00Z'
  },
  {
    id: 'mod-2',
    type: 'warn',
    reason: 'Comment contained inappropriate language',
    moderatorId: 'user-1',
    moderator: mockUsers[0],
    targetType: 'comment',
    targetId: 'comment-3',
    createdAt: '2025-01-19T16:30:00Z'
  }
]

// ============================================================================
// System Settings Mock Data
// ============================================================================

export const mockSystemSettings: SystemSettings = {
  general: {
    siteName: 'Buddhist Community',
    siteDescription: 'A peaceful place for Buddhist practitioners to connect, learn, and grow together',
    siteUrl: 'https://buddhist-community.org',
    adminEmail: 'admin@buddhist-community.org',
    maintenanceMode: false
  },
  authentication: {
    allowRegistration: true,
    requireEmailVerification: true,
    passwordMinLength: 8,
    sessionTimeout: 7200 // 2 hours
  },
  content: {
    allowUploads: true,
    maxFileSize: 10485760, // 10MB
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    moderationEnabled: true,
    autoModeration: false
  },
  community: {
    allowGroupCreation: true,
    allowEventCreation: true,
    maxGroupMembers: 500,
    requireGroupApproval: false
  }
}

// ============================================================================
// Export Collections
// ============================================================================

export const mockData = {
  users: mockUsers,
  adminUsers: mockAdminUsers,
  posts: mockPosts,
  comments: mockComments,
  mediaFiles: mockMediaFiles,
  groups: mockGroups,
  events: mockEvents,
  notifications: mockNotifications,
  metrics: mockMetrics,
  analyticsReports: mockAnalyticsReports,
  searchResults: mockSearchResults,
  moderationActions: mockModerationActions,
  systemSettings: mockSystemSettings
} as const

export default mockData