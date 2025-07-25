/**
 * Mock Response Generator
 * Utilities for generating realistic API responses for development and testing
 */

import {
  ApiResponse,
  PaginatedResponse,
  ApiError
} from '../types'
import mockData from './mock-data'

// ============================================================================
// Response Generators
// ============================================================================

/**
 * Create a successful API response
 */
export function createApiResponse<T>(
  data: T,
  message?: string,
  timestamp?: string
): ApiResponse<T> {
  return {
    data,
    message,
    success: true,
    timestamp: timestamp || new Date().toISOString()
  }
}

/**
 * Create a paginated API response
 */
export function createPaginatedResponse<T>(
  items: T[],
  page = 1,
  limit = 20,
  total?: number
): PaginatedResponse<T> {
  const actualTotal = total || items.length
  const startIndex = (page - 1) * limit
  const endIndex = Math.min(startIndex + limit, items.length)
  const paginatedItems = items.slice(startIndex, endIndex)
  const totalPages = Math.ceil(actualTotal / limit)

  return {
    data: paginatedItems,
    success: true,
    timestamp: new Date().toISOString(),
    pagination: {
      page,
      limit,
      total: actualTotal,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  }
}

/**
 * Create an API error response
 */
export function createApiError(
  code: string,
  message: string,
  details?: Record<string, unknown>,
  path?: string
): ApiError {
  return {
    code,
    message,
    details,
    timestamp: new Date().toISOString(),
    path
  }
}

// ============================================================================
// Mock Response Scenarios
// ============================================================================

/**
 * Simulate network delay
 */
export function withDelay<T>(response: T, delayMs = 500): Promise<T> {
  return new Promise(resolve => {
    setTimeout(() => resolve(response), delayMs)
  })
}

/**
 * Simulate random network failure
 */
export function withRandomFailure<T>(
  response: T,
  failureRate = 0.1,
  errorCode = 'NETWORK_ERROR',
  errorMessage = 'Network request failed'
): Promise<T> {
  if (Math.random() < failureRate) {
    return Promise.reject(createApiError(errorCode, errorMessage))
  }
  return Promise.resolve(response)
}

/**
 * Simulate authentication error
 */
export function withAuthCheck<T>(response: T, isAuthenticated = true): Promise<T> {
  if (!isAuthenticated) {
    return Promise.reject(createApiError(
      'UNAUTHORIZED',
      'Authentication required to access this resource'
    ))
  }
  return Promise.resolve(response)
}

/**
 * Simulate rate limiting
 */
export function withRateLimit<T>(
  response: T,
  isRateLimited = false,
  resetTime = 60
): Promise<T> {
  if (isRateLimited) {
    return Promise.reject(createApiError(
      'RATE_LIMITED',
      `Too many requests. Try again in ${resetTime} seconds.`,
      { resetTime }
    ))
  }
  return Promise.resolve(response)
}

// ============================================================================
// Content Service Mock Responses
// ============================================================================

export const contentMockResponses = {
  // User responses
  getCurrentUser: () => createApiResponse(mockData.users[0]),
  getUserById: (userId: string) => {
    const user = mockData.users.find(u => u.id === userId)
    return user 
      ? createApiResponse(user)
      : Promise.reject(createApiError('NOT_FOUND', 'User not found'))
  },
  getUserPosts: (userId: string, page = 1, limit = 20) => {
    const userPosts = mockData.posts.filter(p => p.authorId === userId)
    return createPaginatedResponse(userPosts, page, limit)
  },

  // Post responses
  getPosts: (page = 1, limit = 20) => createPaginatedResponse(mockData.posts, page, limit),
  getPostById: (postId: string) => {
    const post = mockData.posts.find(p => p.id === postId)
    return post
      ? createApiResponse(post)
      : Promise.reject(createApiError('NOT_FOUND', 'Post not found'))
  },
  createPost: (postData: any) => createApiResponse({
    ...mockData.posts[0],
    id: `post-${Date.now()}`,
    ...postData,
    createdAt: new Date().toISOString()
  }),
  togglePostLike: () => createApiResponse({ isLiked: true, likesCount: 90 }),

  // Comment responses
  getPostComments: (postId: string, page = 1, limit = 20) => {
    const comments = mockData.comments.filter(c => c.postId === postId)
    return createPaginatedResponse(comments, page, limit)
  },
  createComment: (commentData: any) => createApiResponse({
    ...mockData.comments[0],
    id: `comment-${Date.now()}`,
    ...commentData,
    createdAt: new Date().toISOString()
  }),

  // Media responses
  getMediaFiles: (page = 1, limit = 20) => createPaginatedResponse(mockData.mediaFiles, page, limit),
  uploadMediaFile: (file: File) => createApiResponse({
    ...mockData.mediaFiles[0],
    id: `media-${Date.now()}`,
    filename: file.name,
    originalName: file.name,
    size: file.size,
    mimeType: file.type,
    uploadedAt: new Date().toISOString()
  }),

  // Feed responses
  getFeed: (page = 1, limit = 20) => createPaginatedResponse(mockData.posts, page, limit),
  getTrendingPosts: () => createApiResponse(mockData.posts.slice(0, 5)),
  getPopularCategories: () => createApiResponse([
    { name: 'Meditation', slug: 'meditation', postsCount: 45, trending: true },
    { name: 'Philosophy', slug: 'philosophy', postsCount: 32, trending: false },
    { name: 'Personal Stories', slug: 'personal-stories', postsCount: 28, trending: true }
  ])
}

// ============================================================================
// Community Service Mock Responses
// ============================================================================

export const communityMockResponses = {
  // Group responses
  getGroups: (page = 1, limit = 20) => createPaginatedResponse(mockData.groups, page, limit),
  getGroupById: (groupId: string) => {
    const group = mockData.groups.find(g => g.id === groupId)
    return group
      ? createApiResponse(group)
      : Promise.reject(createApiError('NOT_FOUND', 'Group not found'))
  },
  createGroup: (groupData: any) => createApiResponse({
    ...mockData.groups[0],
    id: `group-${Date.now()}`,
    ...groupData,
    createdAt: new Date().toISOString()
  }),
  joinGroup: () => createApiResponse({ status: 'joined' as const }),

  // Event responses
  getEvents: (page = 1, limit = 20) => createPaginatedResponse(mockData.events, page, limit),
  getEventById: (eventId: string) => {
    const event = mockData.events.find(e => e.id === eventId)
    return event
      ? createApiResponse(event)
      : Promise.reject(createApiError('NOT_FOUND', 'Event not found'))
  },
  createEvent: (eventData: any) => createApiResponse({
    ...mockData.events[0],
    id: `event-${Date.now()}`,
    ...eventData,
    createdAt: new Date().toISOString()
  }),
  rsvpToEvent: () => createApiResponse({ status: 'attending' as const }),

  // Notification responses
  getNotifications: (page = 1, limit = 20) => createPaginatedResponse(mockData.notifications, page, limit),
  markNotificationAsRead: (notificationId: string) => {
    const notification = mockData.notifications.find(n => n.id === notificationId)
    return notification
      ? createApiResponse({ ...notification, isRead: true })
      : Promise.reject(createApiError('NOT_FOUND', 'Notification not found'))
  },
  getUnreadNotificationsCount: () => createApiResponse({ 
    count: mockData.notifications.filter(n => !n.isRead).length 
  }),

  // Social features
  followUser: () => createApiResponse({ isFollowing: true }),
  getUserFollowers: (userId: string, page = 1, limit = 20) => {
    const followers = mockData.users.slice(0, 2).map(user => ({
      ...user,
      followedAt: new Date().toISOString()
    }))
    return createPaginatedResponse(followers, page, limit)
  },
  getSuggestedGroups: () => createApiResponse(mockData.groups.map(group => ({
    ...group,
    suggestionReason: 'similar_interests' as const,
    matchScore: 0.85
  }))),

  // Activity feed
  getActivityFeed: (page = 1, limit = 20) => {
    const activities = [
      {
        id: 'activity-1',
        type: 'post_created' as const,
        actor: mockData.users[0],
        target: {
          id: 'post-1',
          type: 'post' as const,
          title: 'The Practice of Mindful Breathing',
          url: '/posts/practice-of-mindful-breathing'
        },
        createdAt: '2025-01-20T10:30:00Z'
      },
      {
        id: 'activity-2',
        type: 'group_joined' as const,
        actor: mockData.users[1],
        target: {
          id: 'group-1',
          type: 'group' as const,
          title: 'Meditation Circle',
          url: '/groups/meditation-circle'
        },
        createdAt: '2025-01-19T15:20:00Z'
      }
    ]
    return createPaginatedResponse(activities, page, limit)
  }
}

// ============================================================================
// Analytics Service Mock Responses
// ============================================================================

export const analyticsMockResponses = {
  // Metrics
  recordMetric: (metric: any) => createApiResponse({
    ...mockData.metrics[0],
    id: `metric-${Date.now()}`,
    ...metric,
    timestamp: new Date().toISOString()
  }),
  getMetrics: (page = 1, limit = 20) => createPaginatedResponse(mockData.metrics, page, limit),
  queryMetrics: (query: any) => createApiResponse({
    series: [
      {
        name: 'page_views',
        data: Array.from({ length: 7 }, (_, i) => ({
          timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
          value: Math.floor(Math.random() * 1000) + 500
        })),
        metadata: { unit: 'count', aggregation: 'sum' as const, interval: 'day' }
      }
    ],
    query,
    executionTime: 150,
    cached: false
  }),

  // Real-time metrics
  getRealTimeMetrics: () => createApiResponse({
    metrics: [
      { name: 'active_users', value: 234, change: 5.2, trend: 'up' as const, unit: 'count', category: 'activity' },
      { name: 'page_views', value: 1247, change: -2.1, trend: 'down' as const, unit: 'count', category: 'engagement' },
      { name: 'new_posts', value: 12, change: 15.3, trend: 'up' as const, unit: 'count', category: 'content' }
    ],
    lastUpdated: new Date().toISOString(),
    updateInterval: 30
  }),

  // Dashboards
  getDashboards: () => createApiResponse([
    {
      id: 'dashboard-1',
      name: 'Community Overview',
      description: 'Main community metrics and activity',
      isDefault: true,
      widgets: [],
      layout: 'grid' as const,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: new Date().toISOString()
    }
  ]),

  // Reports
  getReports: (page = 1, limit = 20) => createPaginatedResponse(mockData.analyticsReports, page, limit),
  createReport: (reportData: any) => createApiResponse({
    ...mockData.analyticsReports[0],
    id: `report-${Date.now()}`,
    ...reportData,
    createdAt: new Date().toISOString()
  }),
  generateReport: () => createApiResponse({
    reportId: 'report-1',
    jobId: `job-${Date.now()}`,
    status: 'queued' as const,
    estimatedCompletionTime: new Date(Date.now() + 5 * 60 * 1000).toISOString()
  }),

  // Performance monitoring
  getSystemPerformance: () => createApiResponse({
    service: 'content',
    timeframe: '24h',
    metrics: {
      cpu: { name: 'CPU Usage', data: [], metadata: { unit: '%', aggregation: 'avg' as const, interval: 'hour' } },
      memory: { name: 'Memory Usage', data: [], metadata: { unit: 'MB', aggregation: 'avg' as const, interval: 'hour' } },
      disk: { name: 'Disk Usage', data: [], metadata: { unit: 'GB', aggregation: 'avg' as const, interval: 'hour' } },
      network: { name: 'Network I/O', data: [], metadata: { unit: 'MB/s', aggregation: 'avg' as const, interval: 'hour' } },
      requests: { name: 'Requests', data: [], metadata: { unit: 'count', aggregation: 'sum' as const, interval: 'hour' } },
      errors: { name: 'Errors', data: [], metadata: { unit: 'count', aggregation: 'sum' as const, interval: 'hour' } },
      responseTime: { name: 'Response Time', data: [], metadata: { unit: 'ms', aggregation: 'avg' as const, interval: 'hour' } }
    },
    alerts: []
  }),

  getHealthStatus: () => createApiResponse({
    status: 'healthy' as const,
    services: {
      content: { status: 'up' as const, responseTime: 120, lastCheck: new Date().toISOString(), uptime: 99.9 },
      community: { status: 'up' as const, responseTime: 95, lastCheck: new Date().toISOString(), uptime: 99.8 },
      analytics: { status: 'up' as const, responseTime: 200, lastCheck: new Date().toISOString(), uptime: 99.5 }
    },
    checks: [
      { name: 'Database', status: 'pass' as const, duration: 50 },
      { name: 'Redis', status: 'pass' as const, duration: 25 },
      { name: 'External APIs', status: 'pass' as const, duration: 150 }
    ],
    timestamp: new Date().toISOString()
  })
}

// ============================================================================
// Admin Service Mock Responses
// ============================================================================

export const adminMockResponses = {
  // User management
  getUsers: (page = 1, limit = 20) => createPaginatedResponse(mockData.adminUsers, page, limit),
  getUserById: (userId: string) => {
    const user = mockData.adminUsers.find(u => u.id === userId)
    return user
      ? createApiResponse({
          ...user,
          loginHistory: [
            { timestamp: '2025-01-22T09:15:00Z', ip: '192.168.1.100', userAgent: 'Chrome/120.0', location: 'San Francisco, CA' },
            { timestamp: '2025-01-21T14:30:00Z', ip: '192.168.1.100', userAgent: 'Chrome/120.0', location: 'San Francisco, CA' }
          ],
          activitySummary: {
            postsLastMonth: 5,
            commentsLastMonth: 12,
            groupsJoined: 2,
            eventsAttended: 3
          }
        })
      : Promise.reject(createApiError('NOT_FOUND', 'User not found'))
  },
  updateUser: (userId: string, updates: any) => {
    const user = mockData.adminUsers.find(u => u.id === userId)
    return user
      ? createApiResponse({ ...user, ...updates, updatedAt: new Date().toISOString() })
      : Promise.reject(createApiError('NOT_FOUND', 'User not found'))
  },
  blockUser: () => createApiResponse({ blocked: true }),
  resetUserPassword: () => createApiResponse({ resetTokenSent: true }),

  // Moderation
  getModerationQueue: (page = 1, limit = 20) => {
    const queueItems = [
      {
        id: 'queue-1',
        type: 'reported' as const,
        contentType: 'post' as const,
        contentId: 'post-1',
        content: {
          title: 'Reported post title',
          excerpt: 'Post content preview...',
          author: mockData.users[1],
          url: '/posts/reported-post'
        },
        reports: [
          {
            id: 'report-1',
            reason: 'Inappropriate content',
            reportedBy: mockData.users[0],
            reportedAt: '2025-01-22T10:30:00Z'
          }
        ],
        priority: 'medium' as const,
        status: 'pending' as const,
        createdAt: '2025-01-22T10:30:00Z'
      }
    ]
    return createPaginatedResponse(queueItems, page, limit)
  },
  takeModerationAction: (action: any) => createApiResponse({
    ...mockData.moderationActions[0],
    id: `mod-${Date.now()}`,
    ...action,
    createdAt: new Date().toISOString()
  }),
  getModerationHistory: (page = 1, limit = 20) => {
    const historyItems = mockData.moderationActions.map(action => ({
      ...action,
      target: {
        id: action.targetId,
        title: 'Target content title',
        author: mockData.users[1]
      }
    }))
    return createPaginatedResponse(historyItems, page, limit)
  },

  // System settings
  getSystemSettings: () => createApiResponse(mockData.systemSettings),
  updateSystemSettings: (updates: any) => createApiResponse({
    ...mockData.systemSettings,
    ...updates
  }),

  // System overview
  getSystemOverview: () => createApiResponse({
    users: { total: 1245, active: 892, new: 23, blocked: 5 },
    content: { posts: 3420, comments: 8931, groups: 156, events: 89 },
    moderation: { queueSize: 12, actionsToday: 7, averageResponseTime: 1800 },
    performance: { uptime: 99.9, responseTime: 120, errorRate: 0.1, activeConnections: 234 },
    storage: { used: 15.6, available: 84.4, mediaFiles: 2341, backupSize: 5.2 }
  }),

  // System operations
  createBackup: () => createApiResponse({
    backupId: `backup-${Date.now()}`,
    status: 'queued' as const,
    estimatedSize: 1024 * 1024 * 500, // 500MB
    estimatedTime: 300 // 5 minutes
  }),
  getBackups: () => createApiResponse([
    {
      id: 'backup-1',
      type: 'full' as const,
      size: 1024 * 1024 * 450,
      status: 'completed' as const,
      createdAt: '2025-01-20T02:00:00Z',
      downloadUrl: 'https://backups.example.com/backup-1.tar.gz',
      expiresAt: '2025-02-20T02:00:00Z'
    }
  ]),
  clearCache: () => createApiResponse({ cleared: true, type: 'all', itemsCleared: 1234 }),
  toggleMaintenanceMode: (enabled: boolean) => createApiResponse({
    maintenanceMode: enabled,
    enabledAt: enabled ? new Date().toISOString() : undefined
  })
}

// ============================================================================
// Search Service Mock Responses
// ============================================================================

export const searchMockResponses = {
  search: (query: any) => createApiResponse({
    data: mockData.searchResults,
    query,
    took: 45,
    pagination: {
      page: query.page || 1,
      limit: query.limit || 20,
      total: mockData.searchResults.length,
      totalPages: Math.ceil(mockData.searchResults.length / (query.limit || 20)),
      hasNext: false,
      hasPrev: false
    },
    suggestions: ['mindfulness', 'meditation', 'buddhism'],
    facets: {
      type: [
        { value: 'post', count: 15 },
        { value: 'user', count: 8 },
        { value: 'group', count: 3 }
      ]
    }
  }),

  getSuggestions: (query: string) => createApiResponse({
    query,
    suggestions: [
      { text: 'mindfulness meditation', type: 'query' as const, count: 234 },
      { text: 'Lama Tenzin', type: 'user' as const, highlighted: `Lama <em>Tenzin</em>` },
      { text: 'meditation', type: 'tag' as const, count: 156 }
    ],
    recent: ['buddhism', 'meditation', 'peace'],
    popular: ['mindfulness', 'zen', 'dharma']
  }),

  getAutoComplete: (field: string, query: string) => createApiResponse([
    { value: 'meditation', label: 'Meditation', count: 156, category: 'practice' },
    { value: 'mindfulness', label: 'Mindfulness', count: 89, category: 'practice' },
    { value: 'zen', label: 'Zen', count: 67, category: 'tradition' }
  ]),

  getTrending: () => createApiResponse({
    queries: [
      { query: 'mindfulness meditation', count: 234, growth: 15.3 },
      { query: 'buddhist philosophy', count: 156, growth: 8.7 }
    ],
    content: [
      { id: 'post-1', type: 'post', title: 'The Practice of Mindful Breathing', score: 0.95, engagement: 89 }
    ],
    tags: [
      { name: 'meditation', count: 156, trend: 'rising' as const },
      { name: 'mindfulness', count: 134, trend: 'stable' as const }
    ],
    timeframe: '24h',
    generatedAt: new Date().toISOString()
  }),

  getRecommendations: () => createApiResponse({
    posts: [
      {
        id: 'rec-1',
        type: 'trending' as const,
        title: 'Trending Meditation Posts',
        items: mockData.searchResults.filter(r => r.type === 'post'),
        score: 0.88,
        createdAt: new Date().toISOString()
      }
    ],
    generatedAt: new Date().toISOString(),
    refreshInterval: 600
  }),

  recordSearchInteraction: () => createApiResponse({ recorded: true }),

  getSearchAnalytics: () => createApiResponse({
    overview: {
      totalSearches: 12450,
      uniqueSearchers: 3420,
      averageResultsClicked: 2.3,
      zeroResultsRate: 8.5
    },
    topQueries: [
      { query: 'meditation', count: 1234, clickThroughRate: 0.78, zeroResults: 12 },
      { query: 'buddhism', count: 892, clickThroughRate: 0.65, zeroResults: 45 }
    ],
    queryTrends: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      searches: Math.floor(Math.random() * 500) + 200,
      uniqueSearchers: Math.floor(Math.random() * 200) + 100
    })),
    contentPerformance: [
      { id: 'post-1', title: 'Mindful Breathing', type: 'post', impressions: 1234, clicks: 234, ctr: 0.19 }
    ],
    noResultsQueries: [
      { query: 'advanced tantric practices', count: 23, suggestions: ['tantric meditation', 'advanced practices'] }
    ]
  })
}

// ============================================================================
// Consolidated Mock Responses
// ============================================================================

export const mockResponses = {
  content: contentMockResponses,
  community: communityMockResponses,
  analytics: analyticsMockResponses,
  admin: adminMockResponses,
  search: searchMockResponses
}

export default mockResponses