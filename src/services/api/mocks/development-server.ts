/**
 * Development Mock Server
 * In-memory mock server for development and testing
 */

import {
  ApiResponse,
  RequestConfig,
  ApiError
} from '../types'
import mockResponses, {
  createApiResponse,
  createApiError,
  withDelay,
  withRandomFailure,
  withAuthCheck,
  withRateLimit
} from './mock-responses'

// ============================================================================
// Mock Server Configuration
// ============================================================================

export interface MockServerConfig {
  enabled: boolean
  delay: number
  failureRate: number
  requireAuth: boolean
  rateLimitEnabled: boolean
  logRequests: boolean
  interceptors?: {
    request?: Array<(config: RequestConfig) => RequestConfig>
    response?: Array<(response: unknown) => unknown>
    error?: Array<(error: ApiError) => ApiError>
  }
}

export interface MockEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  path: string
  handler: (params: any, body?: any) => any
  requireAuth?: boolean
  delay?: number
}

// ============================================================================
// Mock Server Class
// ============================================================================

export class MockServer {
  private config: MockServerConfig
  private endpoints: Map<string, MockEndpoint[]> = new Map()
  private requestCount = 0
  private authTokens = new Set<string>(['mock-auth-token', 'dev-token-123'])

  constructor(config: Partial<MockServerConfig> = {}) {
    this.config = {
      enabled: true,
      delay: 500,
      failureRate: 0.05,
      requireAuth: false,
      rateLimitEnabled: false,
      logRequests: process.env.NODE_ENV === 'development',
      ...config
    }

    this.setupDefaultEndpoints()
  }

  /**
   * Setup default API endpoints with mock responses
   */
  private setupDefaultEndpoints(): void {
    // Content Service Endpoints
    this.registerEndpoint('GET', '/content/users/me', () => 
      mockResponses.content.getCurrentUser()
    )
    
    this.registerEndpoint('GET', '/content/users/:userId', (params) =>
      mockResponses.content.getUserById(params.userId)
    )

    this.registerEndpoint('GET', '/content/posts', (params) =>
      mockResponses.content.getPosts(params.page, params.limit)
    )

    this.registerEndpoint('GET', '/content/posts/:postId', (params) =>
      mockResponses.content.getPostById(params.postId)
    )

    this.registerEndpoint('POST', '/content/posts', (_, body) =>
      mockResponses.content.createPost(body), true
    )

    this.registerEndpoint('GET', '/content/posts/:postId/comments', (params) =>
      mockResponses.content.getPostComments(params.postId, params.page, params.limit)
    )

    this.registerEndpoint('POST', '/content/posts/:postId/comments', (_, body) =>
      mockResponses.content.createComment(body), true
    )

    this.registerEndpoint('POST', '/content/posts/:postId/like', () =>
      mockResponses.content.togglePostLike(), true
    )

    this.registerEndpoint('GET', '/content/media', (params) =>
      mockResponses.content.getMediaFiles(params.page, params.limit)
    )

    this.registerEndpoint('GET', '/content/feed', (params) =>
      mockResponses.content.getFeed(params.page, params.limit)
    )

    // Community Service Endpoints
    this.registerEndpoint('GET', '/community/groups', (params) =>
      mockResponses.community.getGroups(params.page, params.limit)
    )

    this.registerEndpoint('GET', '/community/groups/:groupId', (params) =>
      mockResponses.community.getGroupById(params.groupId)
    )

    this.registerEndpoint('POST', '/community/groups', (_, body) =>
      mockResponses.community.createGroup(body), true
    )

    this.registerEndpoint('POST', '/community/groups/:groupId/join', () =>
      mockResponses.community.joinGroup(), true
    )

    this.registerEndpoint('GET', '/community/events', (params) =>
      mockResponses.community.getEvents(params.page, params.limit)
    )

    this.registerEndpoint('GET', '/community/events/:eventId', (params) =>
      mockResponses.community.getEventById(params.eventId)
    )

    this.registerEndpoint('POST', '/community/events', (_, body) =>
      mockResponses.community.createEvent(body), true
    )

    this.registerEndpoint('POST', '/community/events/:eventId/rsvp', () =>
      mockResponses.community.rsvpToEvent(), true
    )

    this.registerEndpoint('GET', '/community/notifications', (params) =>
      mockResponses.community.getNotifications(params.page, params.limit), true
    )

    this.registerEndpoint('GET', '/community/notifications/unread-count', () =>
      mockResponses.community.getUnreadNotificationsCount(), true
    )

    // Analytics Service Endpoints
    this.registerEndpoint('POST', '/analytics/metrics', (_, body) =>
      mockResponses.analytics.recordMetric(body), true
    )

    this.registerEndpoint('GET', '/analytics/metrics', (params) =>
      mockResponses.analytics.getMetrics(params.page, params.limit), true
    )

    this.registerEndpoint('POST', '/analytics/metrics/query', (_, body) =>
      mockResponses.analytics.queryMetrics(body), true
    )

    this.registerEndpoint('GET', '/analytics/metrics/realtime', () =>
      mockResponses.analytics.getRealTimeMetrics(), true
    )

    this.registerEndpoint('GET', '/analytics/dashboards', () =>
      mockResponses.analytics.getDashboards(), true
    )

    this.registerEndpoint('GET', '/analytics/reports', (params) =>
      mockResponses.analytics.getReports(params.page, params.limit), true
    )

    this.registerEndpoint('POST', '/analytics/reports', (_, body) =>
      mockResponses.analytics.createReport(body), true
    )

    // Admin Service Endpoints
    this.registerEndpoint('GET', '/admin/users', (params) =>
      mockResponses.admin.getUsers(params.page, params.limit), true
    )

    this.registerEndpoint('GET', '/admin/users/:userId', (params) =>
      mockResponses.admin.getUserById(params.userId), true
    )

    this.registerEndpoint('PATCH', '/admin/users/:userId', (params, body) =>
      mockResponses.admin.updateUser(params.userId, body), true
    )

    this.registerEndpoint('GET', '/admin/moderation/queue', (params) =>
      mockResponses.admin.getModerationQueue(params.page, params.limit), true
    )

    this.registerEndpoint('POST', '/admin/moderation/actions', (_, body) =>
      mockResponses.admin.takeModerationAction(body), true
    )

    this.registerEndpoint('GET', '/admin/settings', () =>
      mockResponses.admin.getSystemSettings(), true
    )

    this.registerEndpoint('GET', '/admin/overview', () =>
      mockResponses.admin.getSystemOverview(), true
    )

    // Search Service Endpoints
    this.registerEndpoint('POST', '/search/search', (_, body) =>
      mockResponses.search.search(body)
    )

    this.registerEndpoint('GET', '/search/suggestions', (params) =>
      mockResponses.search.getSuggestions(params.q)
    )

    this.registerEndpoint('GET', '/search/trending', () =>
      mockResponses.search.getTrending()
    )

    this.registerEndpoint('GET', '/search/recommendations', () =>
      mockResponses.search.getRecommendations(), true
    )

    // Health check endpoints
    this.registerEndpoint('GET', '/content/health', () =>
      createApiResponse({ status: 'ok', service: 'content', timestamp: new Date().toISOString() })
    )

    this.registerEndpoint('GET', '/community/health', () =>
      createApiResponse({ status: 'ok', service: 'community', timestamp: new Date().toISOString() })
    )

    this.registerEndpoint('GET', '/analytics/health', () =>
      createApiResponse({ status: 'ok', service: 'analytics', timestamp: new Date().toISOString() })
    )

    this.registerEndpoint('GET', '/admin/health', () =>
      createApiResponse({ status: 'ok', service: 'admin', timestamp: new Date().toISOString() }), true
    )

    this.registerEndpoint('GET', '/search/health', () =>
      createApiResponse({ status: 'ok', service: 'search', timestamp: new Date().toISOString() })
    )
  }

  /**
   * Register a new mock endpoint
   */
  registerEndpoint(
    method: MockEndpoint['method'],
    path: string,
    handler: MockEndpoint['handler'],
    requireAuth = false,
    delay?: number
  ): void {
    const key = `${method} ${path}`
    
    if (!this.endpoints.has(key)) {
      this.endpoints.set(key, [])
    }

    this.endpoints.get(key)!.push({
      method,
      path,
      handler,
      requireAuth,
      delay
    })
  }

  /**
   * Handle mock request
   */
  async handleRequest(
    method: string,
    url: string,
    body?: any,
    headers: Record<string, string> = {}
  ): Promise<any> {
    if (!this.config.enabled) {
      throw createApiError('SERVICE_UNAVAILABLE', 'Mock server is disabled')
    }

    this.requestCount++

    // Log request in development
    if (this.config.logRequests) {
      console.log(`[MockServer] ${method} ${url}`, { body, headers })
    }

    // Find matching endpoint
    const endpoint = this.findMatchingEndpoint(method, url)
    if (!endpoint) {
      throw createApiError('NOT_FOUND', `Endpoint not found: ${method} ${url}`)
    }

    // Extract parameters from URL
    const params = this.extractParams(endpoint.path, url)
    
    // Add query parameters
    const urlObj = new URL(url, 'http://localhost')
    const queryParams = Object.fromEntries(urlObj.searchParams.entries())
    Object.assign(params, queryParams)

    // Check authentication
    const isAuthenticated = this.checkAuthentication(headers)
    const requireAuth = endpoint.requireAuth || this.config.requireAuth
    
    if (requireAuth && !isAuthenticated) {
      throw createApiError('UNAUTHORIZED', 'Authentication required')
    }

    // Apply request interceptors
    let processedBody = body
    if (this.config.interceptors?.request) {
      for (const interceptor of this.config.interceptors.request) {
        const config = interceptor({ method, url, data: processedBody } as RequestConfig)
        processedBody = config.data
      }
    }

    try {
      // Execute handler
      let response = await endpoint.handler(params, processedBody)

      // Apply response interceptors
      if (this.config.interceptors?.response) {
        for (const interceptor of this.config.interceptors.response) {
          response = await interceptor(response)
        }
      }

      // Apply middleware effects
      response = await this.applyMiddleware(response, isAuthenticated)

      return response

    } catch (error) {
      // Apply error interceptors
      let processedError = error as ApiError
      if (this.config.interceptors?.error) {
        for (const interceptor of this.config.interceptors.error) {
          processedError = await interceptor(processedError)
        }
      }

      throw processedError
    }
  }

  /**
   * Apply middleware effects (delay, failures, rate limiting)
   */
  private async applyMiddleware(response: any, isAuthenticated: boolean): Promise<any> {
    // Apply network delay
    const delay = this.config.delay
    if (delay > 0) {
      response = await withDelay(response, delay)
    }

    // Apply random failures
    if (this.config.failureRate > 0) {
      response = await withRandomFailure(response, this.config.failureRate)
    }

    // Apply authentication check (redundant but for middleware testing)
    response = await withAuthCheck(response, isAuthenticated)

    // Apply rate limiting
    if (this.config.rateLimitEnabled) {
      const isRateLimited = this.requestCount % 100 === 0 // Simple rate limiting
      response = await withRateLimit(response, isRateLimited)
    }

    return response
  }

  /**
   * Find matching endpoint for request
   */
  private findMatchingEndpoint(method: string, url: string): MockEndpoint | null {
    for (const [key, endpoints] of this.endpoints.entries()) {
      const [endpointMethod, pathPattern] = key.split(' ', 2)
      
      if (endpointMethod === method && this.matchPath(pathPattern, url)) {
        return endpoints[0] // Return first matching endpoint
      }
    }
    return null
  }

  /**
   * Check if URL matches path pattern
   */
  private matchPath(pattern: string, url: string): boolean {
    // Remove query string from URL
    const path = url.split('?')[0]
    
    // Convert pattern to regex
    const regexPattern = pattern
      .replace(/:[^/]+/g, '([^/]+)') // Replace :param with capture group
      .replace(/\//g, '\\/') // Escape slashes
    
    const regex = new RegExp(`^${regexPattern}$`)
    return regex.test(path)
  }

  /**
   * Extract parameters from URL based on pattern
   */
  private extractParams(pattern: string, url: string): Record<string, string> {
    const path = url.split('?')[0]
    const patternParts = pattern.split('/')
    const pathParts = path.split('/')
    const params: Record<string, string> = {}

    for (let i = 0; i < patternParts.length; i++) {
      const patternPart = patternParts[i]
      const pathPart = pathParts[i]

      if (patternPart.startsWith(':')) {
        const paramName = patternPart.slice(1)
        params[paramName] = pathPart
      }
    }

    return params
  }

  /**
   * Check if request is authenticated
   */
  private checkAuthentication(headers: Record<string, string>): boolean {
    const authHeader = headers.Authorization || headers.authorization
    if (!authHeader) return false

    const token = authHeader.replace('Bearer ', '')
    return this.authTokens.has(token)
  }

  // ============================================================================
  // Public API
  // ============================================================================

  /**
   * Add authentication token
   */
  addAuthToken(token: string): void {
    this.authTokens.add(token)
  }

  /**
   * Remove authentication token
   */
  removeAuthToken(token: string): void {
    this.authTokens.delete(token)
  }

  /**
   * Get server statistics
   */
  getStats(): {
    enabled: boolean
    requestCount: number
    endpointCount: number
    authTokensCount: number
  } {
    return {
      enabled: this.config.enabled,
      requestCount: this.requestCount,
      endpointCount: this.endpoints.size,
      authTokensCount: this.authTokens.size
    }
  }

  /**
   * Reset server state
   */
  reset(): void {
    this.requestCount = 0
    this.authTokens.clear()
    this.authTokens.add('mock-auth-token')
    this.authTokens.add('dev-token-123')
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<MockServerConfig>): void {
    this.config = { ...this.config, ...config }
  }

  /**
   * Enable/disable server
   */
  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled
  }

  /**
   * Get list of registered endpoints
   */
  getEndpoints(): Array<{
    method: string
    path: string
    requireAuth: boolean
  }> {
    return Array.from(this.endpoints.entries()).map(([key, endpoints]) => {
      const [method, path] = key.split(' ', 2)
      return {
        method,
        path,
        requireAuth: endpoints[0].requireAuth || false
      }
    })
  }
}

// ============================================================================
// Default Mock Server Instance
// ============================================================================

export const mockServer = new MockServer({
  enabled: process.env.NODE_ENV === 'development',
  delay: 300,
  failureRate: 0.02,
  requireAuth: false,
  rateLimitEnabled: false,
  logRequests: true
})

// ============================================================================
// Development Utilities
// ============================================================================

/**
 * Setup mock server for development
 */
export function setupMockServer(config?: Partial<MockServerConfig>): MockServer {
  const server = new MockServer(config)
  
  // Add development auth tokens
  server.addAuthToken('dev-token')
  server.addAuthToken('test-token')
  server.addAuthToken('admin-token')

  return server
}

/**
 * Create mock fetch function for testing
 */
export function createMockFetch(server: MockServer) {
  return async (url: string, init?: RequestInit): Promise<Response> => {
    try {
      const method = init?.method || 'GET'
      const headers = init?.headers ? 
        Object.fromEntries(Object.entries(init.headers)) : {}
      
      let body
      if (init?.body) {
        body = typeof init.body === 'string' ? JSON.parse(init.body) : init.body
      }

      const result = await server.handleRequest(method, url, body, headers)
      
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (error) {
      const apiError = error as ApiError
      return new Response(JSON.stringify(apiError), {
        status: apiError.code === 'NOT_FOUND' ? 404 : 
               apiError.code === 'UNAUTHORIZED' ? 401 :
               apiError.code === 'RATE_LIMITED' ? 429 : 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }
}

export default mockServer