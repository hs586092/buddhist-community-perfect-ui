/**
 * Search Service API Client
 * Handles Full-text Search, Filtering, and Recommendations
 */

import { BaseApiClient } from '../base/base-client'
import {
  ApiResponse,
  SearchQuery,
  SearchResponse,
  SearchResult,
  SearchRecommendation,
  ApiClientConfig
} from '../types'

export class SearchServiceClient extends BaseApiClient {
  constructor(config: Partial<ApiClientConfig> = {}) {
    super('search', {
      ...config,
      defaultHeaders: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...config.defaultHeaders
      }
    })
  }

  // ============================================================================
  // Core Search Functionality
  // ============================================================================

  /**
   * Perform comprehensive search across all content types
   */
  async search<T = unknown>(query: SearchQuery): Promise<SearchResponse<T>> {
    // Validate search query
    if (!query.q?.trim()) {
      throw new Error('Search query is required')
    }

    // Clean and normalize query parameters
    const normalizedQuery: SearchQuery = {
      ...query,
      q: query.q.trim(),
      type: query.type || 'all',
      sort: query.sort || 'relevance',
      page: Math.max(1, query.page || 1),
      limit: Math.min(100, Math.max(1, query.limit || 20))
    }

    // Build cache key based on query parameters
    const cacheKey = JSON.stringify(normalizedQuery)
    const cacheTime = this.getCacheTimeForQuery(normalizedQuery)

    return this.post<SearchResponse<T>>('/search', normalizedQuery, { 
      cache: cacheTime 
    })
  }

  /**
   * Search specific content type with optimized parameters
   */
  async searchPosts(
    query: string,
    options?: {
      category?: string
      tags?: string[]
      authorId?: string
      dateRange?: { from: string; to: string }
      sort?: 'relevance' | 'date' | 'popularity'
      page?: number
      limit?: number
    }
  ): Promise<SearchResponse<{
    id: string
    title: string
    content: string
    author: { id: string; displayName: string; avatar?: string }
    category: string
    tags: string[]
    stats: { views: number; likes: number; comments: number }
    publishedAt: string
  }>> {
    const searchQuery: SearchQuery = {
      q: query,
      type: 'posts',
      filters: {
        category: options?.category ? [options.category] : undefined,
        tags: options?.tags,
        dateRange: options?.dateRange,
        author: options?.authorId
      },
      sort: options?.sort || 'relevance',
      page: options?.page,
      limit: options?.limit
    }

    return this.search(searchQuery)
  }

  /**
   * Search users with profile information
   */
  async searchUsers(
    query: string,
    options?: {
      role?: 'user' | 'moderator' | 'admin'
      location?: { lat: number; lng: number; radius: number }
      sort?: 'relevance' | 'date' | 'popularity'
      page?: number
      limit?: number
    }
  ): Promise<SearchResponse<{
    id: string
    username: string
    displayName: string
    avatar?: string
    bio?: string
    location?: string
    stats: { posts: number; followers: number; groups: number }
    verified: boolean
    joinedAt: string
  }>> {
    const searchQuery: SearchQuery = {
      q: query,
      type: 'users',
      filters: {
        location: options?.location
      },
      sort: options?.sort || 'relevance',
      page: options?.page,
      limit: options?.limit
    }

    return this.search(searchQuery)
  }

  /**
   * Search groups with membership information
   */
  async searchGroups(
    query: string,
    options?: {
      category?: string
      type?: 'public' | 'private' | 'secret'
      location?: { lat: number; lng: number; radius: number }
      sort?: 'relevance' | 'date' | 'popularity'
      page?: number
      limit?: number
    }
  ): Promise<SearchResponse<{
    id: string
    name: string
    description: string
    type: 'public' | 'private' | 'secret'
    category: string
    memberCount: number
    isJoined?: boolean
    coverImage?: string
    createdAt: string
  }>> {
    const searchQuery: SearchQuery = {
      q: query,
      type: 'groups',
      filters: {
        category: options?.category ? [options.category] : undefined,
        location: options?.location
      },
      sort: options?.sort || 'relevance',
      page: options?.page,
      limit: options?.limit
    }

    return this.search(searchQuery)
  }

  /**
   * Search events with attendance information
   */
  async searchEvents(
    query: string,
    options?: {
      type?: 'online' | 'offline' | 'hybrid'
      dateRange?: { from: string; to: string }
      location?: { lat: number; lng: number; radius: number }
      tags?: string[]
      sort?: 'relevance' | 'date' | 'popularity'
      page?: number
      limit?: number
    }
  ): Promise<SearchResponse<{
    id: string
    title: string
    description: string
    type: 'online' | 'offline' | 'hybrid'
    startDate: string
    endDate: string
    location?: { name: string; address: string }
    organizer: { id: string; displayName: string }
    attendeeCount: number
    isRsvped?: boolean
    tags: string[]
  }>> {
    const searchQuery: SearchQuery = {
      q: query,
      type: 'events',
      filters: {
        dateRange: options?.dateRange,
        location: options?.location,
        tags: options?.tags
      },
      sort: options?.sort || 'relevance',
      page: options?.page,
      limit: options?.limit
    }

    return this.search(searchQuery)
  }

  // ============================================================================
  // Auto-complete and Suggestions
  // ============================================================================

  /**
   * Get search suggestions as user types
   */
  async getSuggestions(
    query: string,
    options?: {
      type?: 'all' | 'posts' | 'users' | 'groups' | 'events'
      limit?: number
      includeRecent?: boolean
      includePopular?: boolean
    }
  ): Promise<ApiResponse<{
    query: string
    suggestions: Array<{
      text: string
      type: 'query' | 'user' | 'group' | 'tag' | 'category'
      category?: string
      count?: number
      highlighted?: string
    }>
    recent?: string[]
    popular?: string[]
  }>> {
    if (!query?.trim() || query.trim().length < 2) {
      return {
        data: { query: query || '', suggestions: [], recent: [], popular: [] },
        success: true,
        timestamp: new Date().toISOString()
      }
    }

    return this.get<{
      query: string
      suggestions: Array<{
        text: string
        type: 'query' | 'user' | 'group' | 'tag' | 'category'
        category?: string
        count?: number
        highlighted?: string
      }>
      recent?: string[]
      popular?: string[]
    }>('/suggestions', {
      q: query.trim(),
      ...options
    }, { cache: 30000 })
  }

  /**
   * Get auto-complete results for specific fields
   */
  async getAutoComplete(
    field: 'tags' | 'categories' | 'locations' | 'skills',
    query: string,
    limit = 10
  ): Promise<ApiResponse<Array<{
    value: string
    label: string
    count: number
    category?: string
  }>>> {
    if (!query?.trim() || query.trim().length < 2) {
      return {
        data: [],
        success: true,
        timestamp: new Date().toISOString()
      }
    }

    return this.get<Array<{
      value: string
      label: string
      count: number
      category?: string
    }>>(`/autocomplete/${field}`, {
      q: query.trim(),
      limit: Math.min(50, Math.max(1, limit))
    }, { cache: 60000 })
  }

  // ============================================================================
  // Advanced Search Features
  // ============================================================================

  /**
   * Perform faceted search with filters and aggregations
   */
  async facetedSearch(
    query: string,
    options?: {
      type?: SearchQuery['type']
      facets?: string[]
      filters?: Record<string, string[]>
      sort?: SearchQuery['sort']
      page?: number
      limit?: number
    }
  ): Promise<ApiResponse<{
    results: SearchResult[]
    facets: Record<string, Array<{
      value: string
      count: number
      selected?: boolean
    }>>
    filters: Record<string, string[]>
    query: string
    total: number
    took: number
  }>> {
    const searchParams = {
      q: query.trim(),
      type: options?.type || 'all',
      facets: options?.facets?.join(','),
      sort: options?.sort || 'relevance',
      page: Math.max(1, options?.page || 1),
      limit: Math.min(100, Math.max(1, options?.limit || 20)),
      ...this.buildFilterParams(options?.filters)
    }

    return this.post<{
      results: SearchResult[]
      facets: Record<string, Array<{
        value: string
        count: number
        selected?: boolean
      }>>
      filters: Record<string, string[]>
      query: string
      total: number
      took: number
    }>('/faceted', searchParams, { cache: 30000 })
  }

  /**
   * Search similar content based on an item
   */
  async findSimilar(
    itemId: string,
    itemType: 'post' | 'user' | 'group' | 'event',
    options?: {
      limit?: number
      threshold?: number
      includeMetadata?: boolean
    }
  ): Promise<ApiResponse<Array<SearchResult & {
    similarity: number
    reason: string[]
    metadata?: Record<string, unknown>
  }>>> {
    return this.get<Array<SearchResult & {
      similarity: number
      reason: string[]
      metadata?: Record<string, unknown>
    }>>(`/similar/${itemType}/${itemId}`, {
      limit: Math.min(50, Math.max(1, options?.limit || 10)),
      threshold: options?.threshold || 0.5,
      includeMetadata: options?.includeMetadata || false
    }, { cache: 300000 }) // 5min cache
  }

  /**
   * Get trending searches and content
   */
  async getTrending(options?: {
    type?: 'queries' | 'content' | 'tags' | 'all'
    timeframe?: '1h' | '24h' | '7d' | '30d'
    category?: string
    limit?: number
  }): Promise<ApiResponse<{
    queries: Array<{
      query: string
      count: number
      growth: number
      category?: string
    }>
    content: Array<{
      id: string
      type: string
      title: string
      score: number
      engagement: number
    }>
    tags: Array<{
      name: string
      count: number
      trend: 'rising' | 'stable' | 'falling'
    }>
    timeframe: string
    generatedAt: string
  }>> {
    return this.get<{
      queries: Array<{
        query: string
        count: number
        growth: number
        category?: string
      }>
      content: Array<{
        id: string
        type: string
        title: string
        score: number
        engagement: number
      }>
      tags: Array<{
        name: string
        count: number
        trend: 'rising' | 'stable' | 'falling'
      }>
      timeframe: string
      generatedAt: string
    }>('/trending', {
      type: options?.type || 'all',
      timeframe: options?.timeframe || '24h',
      category: options?.category,
      limit: Math.min(100, Math.max(1, options?.limit || 20))
    }, { cache: 300000 }) // 5min cache
  }

  // ============================================================================
  // Personalized Recommendations
  // ============================================================================

  /**
   * Get personalized recommendations for the current user
   */
  async getRecommendations(options?: {
    types?: Array<'posts' | 'users' | 'groups' | 'events'>
    limit?: number
    categories?: string[]
    diversify?: boolean
  }): Promise<ApiResponse<{
    posts?: SearchRecommendation[]
    users?: SearchRecommendation[]
    groups?: SearchRecommendation[]
    events?: SearchRecommendation[]
    generatedAt: string
    refreshInterval: number
  }>> {
    return this.get<{
      posts?: SearchRecommendation[]
      users?: SearchRecommendation[]
      groups?: SearchRecommendation[]
      events?: SearchRecommendation[]
      generatedAt: string
      refreshInterval: number
    }>('/recommendations', {
      types: options?.types?.join(','),
      limit: Math.min(50, Math.max(1, options?.limit || 10)),
      categories: options?.categories?.join(','),
      diversify: options?.diversify !== false
    }, { cache: 600000 }) // 10min cache
  }

  /**
   * Get recommendations based on user interests
   */
  async getRecommendationsByInterests(
    interests: string[],
    options?: {
      type?: 'posts' | 'users' | 'groups' | 'events' | 'all'
      limit?: number
      excludeViewed?: boolean
    }
  ): Promise<ApiResponse<SearchRecommendation[]>> {
    if (!interests.length) {
      throw new Error('At least one interest is required')
    }

    return this.post<SearchRecommendation[]>('/recommendations/interests', {
      interests: interests.filter(i => i.trim()).map(i => i.trim()),
      type: options?.type || 'all',
      limit: Math.min(50, Math.max(1, options?.limit || 10)),
      excludeViewed: options?.excludeViewed !== false
    }, { cache: 300000 })
  }

  /**
   * Get collaborative filtering recommendations
   */
  async getCollaborativeRecommendations(options?: {
    type?: 'posts' | 'groups' | 'events'
    limit?: number
    algorithm?: 'user_based' | 'item_based' | 'matrix_factorization'
  }): Promise<ApiResponse<Array<SearchResult & {
    recommendationScore: number
    reason: 'similar_users' | 'similar_items' | 'trending' | 'category_match'
    confidence: number
  }>>> {
    return this.get<Array<SearchResult & {
      recommendationScore: number
      reason: 'similar_users' | 'similar_items' | 'trending' | 'category_match'
      confidence: number
    }>>('/recommendations/collaborative', {
      type: options?.type || 'posts',
      limit: Math.min(50, Math.max(1, options?.limit || 10)),
      algorithm: options?.algorithm || 'user_based'
    }, { cache: 600000 })
  }

  // ============================================================================
  // Search Analytics and Insights
  // ============================================================================

  /**
   * Record search interaction for analytics
   */
  async recordSearchInteraction(data: {
    query: string
    resultId?: string
    action: 'search' | 'click' | 'view' | 'share' | 'bookmark'
    position?: number
    sessionId?: string
    metadata?: Record<string, unknown>
  }): Promise<ApiResponse<{ recorded: boolean }>> {
    if (!data.query?.trim()) {
      throw new Error('Search query is required')
    }

    return this.post<{ recorded: boolean }>('/analytics/interaction', {
      ...data,
      query: data.query.trim(),
      timestamp: new Date().toISOString()
    })
  }

  /**
   * Get search analytics for admin users
   */
  async getSearchAnalytics(params?: {
    startDate?: string
    endDate?: string
    granularity?: 'hour' | 'day' | 'week' | 'month'
  }): Promise<ApiResponse<{
    overview: {
      totalSearches: number
      uniqueSearchers: number
      averageResultsClicked: number
      zeroResultsRate: number
    }
    topQueries: Array<{
      query: string
      count: number
      clickThroughRate: number
      zeroResults: number
    }>
    queryTrends: Array<{
      date: string
      searches: number
      uniqueSearchers: number
    }>
    contentPerformance: Array<{
      id: string
      title: string
      type: string
      impressions: number
      clicks: number
      ctr: number
    }>
    noResultsQueries: Array<{
      query: string
      count: number
      suggestions?: string[]
    }>
  }>> {
    return this.get<{
      overview: {
        totalSearches: number
        uniqueSearchers: number
        averageResultsClicked: number
        zeroResultsRate: number
      }
      topQueries: Array<{
        query: string
        count: number
        clickThroughRate: number
        zeroResults: number
      }>
      queryTrends: Array<{
        date: string
        searches: number
        uniqueSearchers: number
      }>
      contentPerformance: Array<{
        id: string
        title: string
        type: string
        impressions: number
        clicks: number
        ctr: number
      }>
      noResultsQueries: Array<{
        query: string
        count: number
        suggestions?: string[]
      }>
    }>('/analytics/search', params, { cache: 300000 })
  }

  // ============================================================================
  // Search Index Management (Admin)
  // ============================================================================

  /**
   * Trigger search index rebuild
   */
  async rebuildIndex(
    type?: 'posts' | 'users' | 'groups' | 'events' | 'all'
  ): Promise<ApiResponse<{
    jobId: string
    type: string
    status: 'queued' | 'processing' | 'completed' | 'failed'
    estimatedTime?: number
  }>> {
    return this.post<{
      jobId: string
      type: string
      status: 'queued' | 'processing' | 'completed' | 'failed'
      estimatedTime?: number
    }>('/admin/index/rebuild', { type: type || 'all' })
  }

  /**
   * Get index statistics
   */
  async getIndexStats(): Promise<ApiResponse<{
    indices: Record<string, {
      documentCount: number
      size: string
      lastUpdated: string
      health: 'green' | 'yellow' | 'red'
    }>
    performance: {
      averageSearchTime: number
      indexingRate: number
      searchRate: number
    }
    recentOperations: Array<{
      operation: string
      type: string
      status: string
      completedAt: string
    }>
  }>> {
    return this.get<{
      indices: Record<string, {
        documentCount: number
        size: string
        lastUpdated: string
        health: 'green' | 'yellow' | 'red'
      }>
      performance: {
        averageSearchTime: number
        indexingRate: number
        searchRate: number
      }
      recentOperations: Array<{
        operation: string
        type: string
        status: string
        completedAt: string
      }>
    }>('/admin/index/stats', undefined, { cache: 60000 })
  }

  // ============================================================================
  // Utility Methods
  // ============================================================================

  /**
   * Determine appropriate cache time based on query type
   */
  private getCacheTimeForQuery(query: SearchQuery): number {
    // Dynamic queries with filters cache for shorter time
    if (query.filters && Object.keys(query.filters).length > 0) {
      return 30000 // 30 seconds
    }
    
    // Simple queries can cache longer
    if (query.q.length < 10 && query.type === 'all') {
      return 300000 // 5 minutes
    }

    // Default cache time
    return 60000 // 1 minute
  }

  /**
   * Convert filters object to query parameters
   */
  private buildFilterParams(filters?: Record<string, string[]>): Record<string, string> {
    if (!filters) return {}

    const params: Record<string, string> = {}
    Object.entries(filters).forEach(([key, values]) => {
      if (values && values.length > 0) {
        params[`filter_${key}`] = values.join(',')
      }
    })

    return params
  }

  /**
   * Clear user's search cache (for privacy)
   */
  public clearUserSearchCache(): void {
    this.clearCache()
  }

  /**
   * Get search performance metrics
   */
  public getSearchPerformanceMetrics(): {
    cacheStats: { size: number; maxSize: number; hitRate: number }
    averageResponseTime: number
  } {
    return {
      cacheStats: this.getStats().cacheStats,
      averageResponseTime: 0 // Would need to track this separately
    }
  }
}