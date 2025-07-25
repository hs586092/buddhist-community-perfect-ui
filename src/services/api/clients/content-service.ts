/**
 * Content Service API Client
 * Handles User, Post, Comment, and Media management operations
 */

import { BaseApiClient } from '../base/base-client'
import {
  ApiResponse,
  PaginatedResponse,
  User,
  Post,
  Comment,
  MediaFile,
  CreatePostRequest,
  UpdatePostRequest,
  CreateCommentRequest,
  UpdateCommentRequest,
  ApiClientConfig
} from '../types'

export class ContentServiceClient extends BaseApiClient {
  constructor(config: Partial<ApiClientConfig> = {}) {
    super('content', {
      ...config,
      defaultHeaders: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...config.defaultHeaders
      }
    })
  }

  // ============================================================================
  // User Management
  // ============================================================================

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.get<User>('/users/me', undefined, { cache: 30000 }) // 30s cache
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<ApiResponse<User>> {
    return this.get<User>(`/users/${userId}`, undefined, { cache: 60000 }) // 1min cache
  }

  /**
   * Get user by username
   */
  async getUserByUsername(username: string): Promise<ApiResponse<User>> {
    return this.get<User>(`/users/username/${username}`, undefined, { cache: 60000 })
  }

  /**
   * Update current user profile
   */
  async updateCurrentUser(updates: Partial<User>): Promise<ApiResponse<User>> {
    return this.patch<User>('/users/me', updates)
  }

  /**
   * Update user avatar
   */
  async updateUserAvatar(file: File): Promise<ApiResponse<{ avatarUrl: string }>> {
    return this.upload<{ avatarUrl: string }>('/users/me/avatar', file, {
      filename: `avatar-${Date.now()}.${file.name.split('.').pop()}`
    })
  }

  /**
   * Get user posts
   */
  async getUserPosts(
    userId: string,
    params?: {
      status?: Post['status']
      type?: Post['type']
      page?: number
      limit?: number
      sort?: 'latest' | 'popular' | 'oldest'
    }
  ): Promise<PaginatedResponse<Post>> {
    return this.getPaginated<Post>(`/users/${userId}/posts`, params, { cache: 30000 })
  }

  /**
   * Get user statistics
   */
  async getUserStats(userId: string): Promise<ApiResponse<User['stats']>> {
    return this.get<User['stats']>(`/users/${userId}/stats`, undefined, { cache: 300000 }) // 5min cache
  }

  // ============================================================================
  // Post Management
  // ============================================================================

  /**
   * Get all posts with filtering and pagination
   */
  async getPosts(params?: {
    category?: string
    tags?: string[]
    type?: Post['type']
    status?: Post['status']
    authorId?: string
    page?: number
    limit?: number
    sort?: 'latest' | 'popular' | 'trending' | 'oldest'
  }): Promise<PaginatedResponse<Post>> {
    return this.getPaginated<Post>('/posts', {
      ...params,
      tags: params?.tags?.join(',') // Convert array to comma-separated string
    }, { cache: 30000 })
  }

  /**
   * Get post by ID
   */
  async getPostById(postId: string): Promise<ApiResponse<Post>> {
    return this.get<Post>(`/posts/${postId}`, undefined, { cache: 60000 })
  }

  /**
   * Get post by slug
   */
  async getPostBySlug(slug: string): Promise<ApiResponse<Post>> {
    return this.get<Post>(`/posts/slug/${slug}`, undefined, { cache: 60000 })
  }

  /**
   * Create new post
   */
  async createPost(postData: CreatePostRequest): Promise<ApiResponse<Post>> {
    // Validate required fields
    if (!postData.title?.trim()) {
      throw new Error('Post title is required')
    }
    if (!postData.content?.trim()) {
      throw new Error('Post content is required')
    }
    if (!postData.category?.trim()) {
      throw new Error('Post category is required')
    }

    return this.post<Post>('/posts', {
      ...postData,
      title: postData.title.trim(),
      content: postData.content.trim(),
      category: postData.category.trim(),
      tags: postData.tags?.filter(tag => tag.trim()).map(tag => tag.trim()) || []
    })
  }

  /**
   * Update post
   */
  async updatePost(postId: string, updates: Partial<UpdatePostRequest>): Promise<ApiResponse<Post>> {
    // Remove empty values and trim strings
    const cleanUpdates = Object.entries(updates).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (typeof value === 'string') {
          acc[key] = value.trim()
        } else if (Array.isArray(value) && key === 'tags') {
          acc[key] = value.filter(tag => tag.trim()).map(tag => tag.trim())
        } else {
          acc[key] = value
        }
      }
      return acc
    }, {} as Record<string, unknown>)

    return this.patch<Post>(`/posts/${postId}`, cleanUpdates)
  }

  /**
   * Delete post
   */
  async deletePost(postId: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/posts/${postId}`)
  }

  /**
   * Publish post
   */
  async publishPost(postId: string): Promise<ApiResponse<Post>> {
    return this.patch<Post>(`/posts/${postId}`, { status: 'published' })
  }

  /**
   * Archive post
   */
  async archivePost(postId: string): Promise<ApiResponse<Post>> {
    return this.patch<Post>(`/posts/${postId}`, { status: 'archived' })
  }

  /**
   * Like/unlike post
   */
  async togglePostLike(postId: string): Promise<ApiResponse<{ isLiked: boolean; likesCount: number }>> {
    return this.post<{ isLiked: boolean; likesCount: number }>(`/posts/${postId}/like`)
  }

  /**
   * Bookmark/unbookmark post
   */
  async togglePostBookmark(postId: string): Promise<ApiResponse<{ isBookmarked: boolean }>> {
    return this.post<{ isBookmarked: boolean }>(`/posts/${postId}/bookmark`)
  }

  /**
   * Share post
   */
  async sharePost(postId: string, platform?: string): Promise<ApiResponse<{ shareUrl: string; shareCount: number }>> {
    return this.post<{ shareUrl: string; shareCount: number }>(`/posts/${postId}/share`, { platform })
  }

  /**
   * Get post analytics
   */
  async getPostAnalytics(postId: string): Promise<ApiResponse<{
    views: number
    uniqueViews: number
    likes: number
    shares: number
    comments: number
    bookmarks: number
    engagement: number
    viewsTimeline: Array<{ date: string; views: number }>
  }>> {
    return this.get<{
      views: number
      uniqueViews: number
      likes: number
      shares: number
      comments: number
      bookmarks: number
      engagement: number
      viewsTimeline: Array<{ date: string; views: number }>
    }>(`/posts/${postId}/analytics`, undefined, { cache: 300000 }) // 5min cache
  }

  // ============================================================================
  // Comment Management
  // ============================================================================

  /**
   * Get comments for a post
   */
  async getPostComments(
    postId: string,
    params?: {
      parentId?: string // For threaded comments
      page?: number
      limit?: number
      sort?: 'newest' | 'oldest' | 'popular'
    }
  ): Promise<PaginatedResponse<Comment>> {
    return this.getPaginated<Comment>(`/posts/${postId}/comments`, params, { cache: 30000 })
  }

  /**
   * Get comment by ID
   */
  async getCommentById(commentId: string): Promise<ApiResponse<Comment>> {
    return this.get<Comment>(`/comments/${commentId}`, undefined, { cache: 60000 })
  }

  /**
   * Create comment
   */
  async createComment(commentData: CreateCommentRequest): Promise<ApiResponse<Comment>> {
    // Validate required fields
    if (!commentData.postId?.trim()) {
      throw new Error('Post ID is required')
    }
    if (!commentData.content?.trim()) {
      throw new Error('Comment content is required')
    }

    return this.post<Comment>('/comments', {
      ...commentData,
      postId: commentData.postId.trim(),
      content: commentData.content.trim()
    })
  }

  /**
   * Update comment
   */
  async updateComment(commentId: string, updates: UpdateCommentRequest): Promise<ApiResponse<Comment>> {
    if (!updates.content?.trim()) {
      throw new Error('Comment content is required')
    }

    return this.patch<Comment>(`/comments/${commentId}`, {
      content: updates.content.trim()
    })
  }

  /**
   * Delete comment
   */
  async deleteComment(commentId: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/comments/${commentId}`)
  }

  /**
   * Like/unlike comment
   */
  async toggleCommentLike(commentId: string): Promise<ApiResponse<{ isLiked: boolean; likesCount: number }>> {
    return this.post<{ isLiked: boolean; likesCount: number }>(`/comments/${commentId}/like`)
  }

  /**
   * Get comment replies (for threaded comments)
   */
  async getCommentReplies(
    commentId: string,
    params?: { page?: number; limit?: number; sort?: 'newest' | 'oldest' }
  ): Promise<PaginatedResponse<Comment>> {
    return this.getPaginated<Comment>(`/comments/${commentId}/replies`, params, { cache: 30000 })
  }

  // ============================================================================
  // Media Management
  // ============================================================================

  /**
   * Get media files with filtering
   */
  async getMediaFiles(params?: {
    type?: 'image' | 'video' | 'audio' | 'document'
    postId?: string
    authorId?: string
    page?: number
    limit?: number
    sort?: 'newest' | 'oldest' | 'largest' | 'smallest'
  }): Promise<PaginatedResponse<MediaFile>> {
    return this.getPaginated<MediaFile>('/media', params, { cache: 60000 })
  }

  /**
   * Get media file by ID
   */
  async getMediaFileById(mediaId: string): Promise<ApiResponse<MediaFile>> {
    return this.get<MediaFile>(`/media/${mediaId}`, undefined, { cache: 300000 }) // 5min cache
  }

  /**
   * Upload media file
   */
  async uploadMediaFile(
    file: File,
    options?: {
      altText?: string
      postId?: string
      quality?: 'low' | 'medium' | 'high' | 'original'
      generateThumbnail?: boolean
      onProgress?: (progress: number) => void
    }
  ): Promise<ApiResponse<MediaFile>> {
    // Validate file
    if (!file) {
      throw new Error('File is required')
    }

    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      throw new Error('File size must be less than 10MB')
    }

    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/webm',
      'audio/mp3', 'audio/wav', 'audio/ogg',
      'application/pdf'
    ]

    if (!allowedTypes.includes(file.type)) {
      throw new Error('File type not supported')
    }

    return this.upload<MediaFile>('/media/upload', file, {
      filename: file.name,
      additionalData: {
        altText: options?.altText || '',
        postId: options?.postId || '',
        quality: options?.quality || 'high',
        generateThumbnail: options?.generateThumbnail !== false
      },
      onProgress: options?.onProgress
    })
  }

  /**
   * Update media file metadata
   */
  async updateMediaFile(mediaId: string, updates: {
    altText?: string
    filename?: string
  }): Promise<ApiResponse<MediaFile>> {
    return this.patch<MediaFile>(`/media/${mediaId}`, updates)
  }

  /**
   * Delete media file
   */
  async deleteMediaFile(mediaId: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/media/${mediaId}`)
  }

  /**
   * Get media file usage statistics
   */
  async getMediaUsage(): Promise<ApiResponse<{
    totalFiles: number
    totalSize: number
    usedStorage: number
    storageLimit: number
    filesByType: Record<string, number>
    recentUploads: MediaFile[]
  }>> {
    return this.get<{
      totalFiles: number
      totalSize: number
      usedStorage: number
      storageLimit: number
      filesByType: Record<string, number>
      recentUploads: MediaFile[]
    }>('/media/usage', undefined, { cache: 60000 })
  }

  // ============================================================================
  // Feed and Discovery
  // ============================================================================

  /**
   * Get personalized feed
   */
  async getFeed(params?: {
    type?: 'following' | 'trending' | 'recent' | 'recommended'
    category?: string
    page?: number
    limit?: number
  }): Promise<PaginatedResponse<Post>> {
    return this.getPaginated<Post>('/feed', params, { cache: 30000 })
  }

  /**
   * Get trending posts
   */
  async getTrendingPosts(params?: {
    timeframe?: '1h' | '24h' | '7d' | '30d'
    category?: string
    limit?: number
  }): Promise<ApiResponse<Post[]>> {
    return this.get<Post[]>('/posts/trending', params, { cache: 300000 }) // 5min cache
  }

  /**
   * Get popular categories
   */
  async getPopularCategories(): Promise<ApiResponse<Array<{
    name: string
    slug: string
    postsCount: number
    trending: boolean
  }>>> {
    return this.get<Array<{
      name: string
      slug: string
      postsCount: number
      trending: boolean
    }>>('/categories/popular', undefined, { cache: 600000 }) // 10min cache
  }

  /**
   * Get trending tags
   */
  async getTrendingTags(limit = 20): Promise<ApiResponse<Array<{
    name: string
    count: number
    trend: 'rising' | 'stable' | 'falling'
  }>>> {
    return this.get<Array<{
      name: string
      count: number
      trend: 'rising' | 'stable' | 'falling'
    }>>('/tags/trending', { limit }, { cache: 300000 }) // 5min cache
  }

  // ============================================================================
  // Batch Operations
  // ============================================================================

  /**
   * Bulk delete posts
   */
  async bulkDeletePosts(postIds: string[]): Promise<ApiResponse<{ deletedCount: number }>> {
    if (!postIds.length) {
      throw new Error('Post IDs are required')
    }

    return this.post<{ deletedCount: number }>('/posts/bulk-delete', { postIds })
  }

  /**
   * Bulk update posts
   */
  async bulkUpdatePosts(updates: Array<{
    id: string
    updates: Partial<UpdatePostRequest>
  }>): Promise<ApiResponse<{ updatedCount: number }>> {
    if (!updates.length) {
      throw new Error('Updates are required')
    }

    return this.post<{ updatedCount: number }>('/posts/bulk-update', { updates })
  }

  /**
   * Export user content
   */
  async exportUserContent(format: 'json' | 'csv' = 'json'): Promise<ApiResponse<{ exportUrl: string; expiresAt: string }>> {
    return this.post<{ exportUrl: string; expiresAt: string }>('/users/me/export', { format })
  }
}