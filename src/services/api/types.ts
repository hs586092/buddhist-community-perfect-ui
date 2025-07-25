/**
 * Core API Types and Interfaces
 * TypeScript definitions for all API client functionality
 */

// ============================================================================
// Core API Types
// ============================================================================

export interface ApiResponse<T = unknown> {
  data: T
  message?: string
  success: boolean
  timestamp: string
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, unknown>
  timestamp: string
  path?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface ApiClientConfig {
  baseURL: string
  timeout?: number
  retries?: number
  retryDelay?: number
  defaultHeaders?: Record<string, string>
  interceptors?: {
    request?: Array<(config: RequestConfig) => RequestConfig | Promise<RequestConfig>>
    response?: Array<(response: unknown) => unknown | Promise<unknown>>
    error?: Array<(error: ApiError) => ApiError | Promise<ApiError>>
  }
  cache?: {
    enabled: boolean
    ttl: number
    maxSize: number
  }
  rateLimit?: {
    enabled: boolean
    maxRequests: number
    windowMs: number
  }
}

export interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  url: string
  headers?: Record<string, string>
  params?: Record<string, unknown>
  data?: unknown
  timeout?: number
  retries?: number
  cache?: boolean | number
}

// ============================================================================
// Authentication Types
// ============================================================================

export interface AuthToken {
  access: string
  refresh: string
  expiresAt: string
  tokenType: 'Bearer'
}

export interface User {
  id: string
  email: string
  username: string
  displayName: string
  avatar?: string
  bio?: string
  location?: string
  website?: string
  isVerified: boolean
  isActive: boolean
  role: 'user' | 'moderator' | 'admin'
  preferences: UserPreferences
  stats: UserStats
  createdAt: string
  updatedAt: string
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: string
  notifications: NotificationSettings
  privacy: PrivacySettings
}

export interface NotificationSettings {
  email: boolean
  push: boolean
  mentions: boolean
  comments: boolean
  groups: boolean
  events: boolean
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private'
  showEmail: boolean
  showLocation: boolean
  allowMessages: boolean
}

export interface UserStats {
  postsCount: number
  commentsCount: number
  groupsCount: number
  eventsAttended: number
  reputation: number
  level: number
}

// ============================================================================
// Content Service Types
// ============================================================================

export interface Post {
  id: string
  authorId: string
  author: User
  title: string
  content: string
  excerpt?: string
  slug: string
  status: 'draft' | 'published' | 'archived'
  visibility: 'public' | 'group' | 'private'
  type: 'text' | 'image' | 'video' | 'link' | 'poll'
  category: string
  tags: string[]
  media: MediaFile[]
  metadata: PostMetadata
  stats: PostStats
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

export interface PostMetadata {
  readTime: number
  wordCount: number
  language: string
  location?: string
  mentions: string[]
  externalLinks: string[]
}

export interface PostStats {
  views: number
  likes: number
  shares: number
  comments: number
  bookmarks: number
}

export interface Comment {
  id: string
  postId: string
  authorId: string
  author: User
  content: string
  parentId?: string
  replies?: Comment[]
  status: 'active' | 'hidden' | 'deleted'
  likes: number
  isLiked?: boolean
  createdAt: string
  updatedAt: string
}

export interface MediaFile {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  thumbnailUrl?: string
  altText?: string
  metadata: MediaMetadata
  uploadedAt: string
}

export interface MediaMetadata {
  width?: number
  height?: number
  duration?: number
  quality?: string
  format?: string
  compression?: string
}

// ============================================================================
// Community Service Types
// ============================================================================

export interface Group {
  id: string
  name: string
  description: string
  slug: string
  type: 'public' | 'private' | 'secret'
  category: string
  coverImage?: string
  avatar?: string
  ownerId: string
  owner: User
  moderators: User[]
  members: User[]
  stats: GroupStats
  settings: GroupSettings
  createdAt: string
  updatedAt: string
}

export interface GroupStats {
  membersCount: number
  postsCount: number
  eventsCount: number
  activeMembers: number
}

export interface GroupSettings {
  allowInvites: boolean
  requireApproval: boolean
  allowPosts: boolean
  allowEvents: boolean
  visibility: 'public' | 'members' | 'private'
}

export interface Event {
  id: string
  title: string
  description: string
  slug: string
  type: 'online' | 'offline' | 'hybrid'
  status: 'draft' | 'published' | 'cancelled' | 'completed'
  organizerId: string
  organizer: User
  groupId?: string
  group?: Group
  startDate: string
  endDate: string
  timezone: string
  location?: EventLocation
  capacity?: number
  attendees: User[]
  waitlist: User[]
  tags: string[]
  stats: EventStats
  createdAt: string
  updatedAt: string
}

export interface EventLocation {
  name: string
  address: string
  coordinates?: {
    lat: number
    lng: number
  }
  virtualLink?: string
}

export interface EventStats {
  attendeesCount: number
  waitlistCount: number
  interestedCount: number
  views: number
}

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  data?: Record<string, unknown>
  isRead: boolean
  actionUrl?: string
  createdAt: string
}

export type NotificationType = 
  | 'post_like' 
  | 'post_comment' 
  | 'comment_reply'
  | 'group_invite'
  | 'group_request'
  | 'event_invite'
  | 'event_reminder'
  | 'follow'
  | 'mention'
  | 'system'

// ============================================================================
// Analytics Service Types
// ============================================================================

export interface Metric {
  id: string
  name: string
  value: number
  unit: string
  category: string
  tags: Record<string, string>
  timestamp: string
}

export interface MetricSeries {
  name: string
  data: Array<{
    timestamp: string
    value: number
  }>
  metadata: {
    unit: string
    aggregation: 'sum' | 'avg' | 'min' | 'max' | 'count'
    interval: string
  }
}

export interface DashboardWidget {
  id: string
  type: 'metric' | 'chart' | 'table' | 'gauge'
  title: string
  description?: string
  config: Record<string, unknown>
  position: { x: number; y: number; width: number; height: number }
}

export interface AnalyticsReport {
  id: string
  name: string
  description: string
  type: 'user' | 'content' | 'engagement' | 'performance'
  config: Record<string, unknown>
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly'
    recipients: string[]
  }
  createdAt: string
  updatedAt: string
}

// ============================================================================
// Admin Service Types
// ============================================================================

export interface AdminUser extends User {
  lastLoginAt?: string
  loginCount: number
  isBlocked: boolean
  blockReason?: string
  moderationHistory: ModerationAction[]
}

export interface ModerationAction {
  id: string
  type: 'warn' | 'suspend' | 'ban' | 'delete' | 'approve'
  reason: string
  moderatorId: string
  moderator: User
  targetType: 'user' | 'post' | 'comment' | 'group'
  targetId: string
  duration?: number
  createdAt: string
}

export interface SystemSettings {
  general: {
    siteName: string
    siteDescription: string
    siteUrl: string
    adminEmail: string
    maintenanceMode: boolean
  }
  authentication: {
    allowRegistration: boolean
    requireEmailVerification: boolean
    passwordMinLength: number
    sessionTimeout: number
  }
  content: {
    allowUploads: boolean
    maxFileSize: number
    allowedFileTypes: string[]
    moderationEnabled: boolean
    autoModeration: boolean
  }
  community: {
    allowGroupCreation: boolean
    allowEventCreation: boolean
    maxGroupMembers: number
    requireGroupApproval: boolean
  }
}

// ============================================================================
// Search Service Types
// ============================================================================

export interface SearchQuery {
  q: string
  type?: 'all' | 'posts' | 'users' | 'groups' | 'events'
  filters?: SearchFilters
  sort?: 'relevance' | 'date' | 'popularity'
  page?: number
  limit?: number
}

export interface SearchFilters {
  category?: string[]
  tags?: string[]
  dateRange?: {
    from: string
    to: string
  }
  location?: {
    lat: number
    lng: number
    radius: number
  }
  author?: string
  group?: string
}

export interface SearchResult<T = unknown> {
  id: string
  type: 'post' | 'user' | 'group' | 'event'
  title: string
  description: string
  url: string
  thumbnail?: string
  metadata: T
  score: number
  highlights?: Record<string, string[]>
}

export interface SearchResponse<T = unknown> extends PaginatedResponse<SearchResult<T>> {
  query: SearchQuery
  took: number
  suggestions?: string[]
  facets?: Record<string, Array<{ value: string; count: number }>>
}

export interface SearchRecommendation {
  id: string
  type: 'trending' | 'related' | 'popular' | 'recent'
  title: string
  items: SearchResult[]
  score: number
  createdAt: string
}

// ============================================================================
// Request/Response Types for Each Service
// ============================================================================

// Content Service Requests
export interface CreatePostRequest {
  title: string
  content: string
  type?: Post['type']
  category: string
  tags?: string[]
  status?: Post['status']
  visibility?: Post['visibility']
  groupId?: string
  publishedAt?: string
}

export interface UpdatePostRequest extends Partial<CreatePostRequest> {
  id: string
}

export interface CreateCommentRequest {
  postId: string
  content: string
  parentId?: string
}

export interface UpdateCommentRequest {
  id: string
  content: string
}

// Community Service Requests
export interface CreateGroupRequest {
  name: string
  description: string
  type: Group['type']
  category: string
  coverImage?: string
}

export interface UpdateGroupRequest extends Partial<CreateGroupRequest> {
  id: string
}

export interface CreateEventRequest {
  title: string
  description: string
  type: Event['type']
  startDate: string
  endDate: string
  timezone: string
  location?: EventLocation
  capacity?: number
  groupId?: string
  tags?: string[]
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> {
  id: string
}

// Analytics Service Requests
export interface MetricsQuery {
  metrics: string[]
  startDate: string
  endDate: string
  granularity?: 'hour' | 'day' | 'week' | 'month'
  filters?: Record<string, unknown>
}

export interface CreateReportRequest {
  name: string
  description: string
  type: AnalyticsReport['type']
  config: Record<string, unknown>
  schedule?: AnalyticsReport['schedule']
}

// Admin Service Requests
export interface UpdateUserRequest {
  id: string
  updates: Partial<Pick<User, 'displayName' | 'bio' | 'isActive' | 'role'>>
}

export interface ModerationRequest {
  type: ModerationAction['type']
  targetType: ModerationAction['targetType']
  targetId: string
  reason: string
  duration?: number
}

export interface UpdateSystemSettingsRequest {
  settings: Partial<SystemSettings>
}

// ============================================================================
// HTTP Client Types
// ============================================================================

export interface HttpClient {
  get<T = unknown>(url: string, config?: Partial<RequestConfig>): Promise<T>
  post<T = unknown>(url: string, data?: unknown, config?: Partial<RequestConfig>): Promise<T>
  put<T = unknown>(url: string, data?: unknown, config?: Partial<RequestConfig>): Promise<T>
  patch<T = unknown>(url: string, data?: unknown, config?: Partial<RequestConfig>): Promise<T>
  delete<T = unknown>(url: string, config?: Partial<RequestConfig>): Promise<T>
  request<T = unknown>(config: RequestConfig): Promise<T>
}

export interface ApiClientInterface {
  client: HttpClient
  config: ApiClientConfig
  setAuthToken(token: string): void
  clearAuthToken(): void
  isAuthenticated(): boolean
}