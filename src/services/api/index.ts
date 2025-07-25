/**
 * API Services Entry Point
 * Unified exports for all API client functionality
 */

// Core types and interfaces
export type * from './types'

// Base client infrastructure
export { BaseApiClient } from './base/base-client'
export { HttpClientImpl } from './base/http-client'

// Service-specific clients
export { ContentServiceClient } from './clients/content-service'
export { CommunityServiceClient } from './clients/community-service'
export { AnalyticsServiceClient } from './clients/analytics-service'
export { AdminServiceClient } from './clients/admin-service'
export { SearchServiceClient } from './clients/search-service'

// Client factory and management
export {
  ApiClientFactory,
  apiClientFactory,
  apiClients,
  contentApi,
  communityApi,
  analyticsApi,
  adminApi,
  searchApi,
  auth,
  health,
  cache
} from './client-factory'

export type {
  ApiClientsConfig,
  ApiClients,
  ClientStatus
} from './client-factory'

// ============================================================================
// Convenience Re-exports of Common Types
// ============================================================================

export type {
  // Core API types
  ApiResponse,
  PaginatedResponse,
  ApiError,
  RequestConfig,
  
  // Authentication
  AuthToken,
  User,
  UserPreferences,
  
  // Content types
  Post,
  Comment,
  MediaFile,
  CreatePostRequest,
  UpdatePostRequest,
  CreateCommentRequest,
  
  // Community types
  Group,
  Event,
  Notification,
  CreateGroupRequest,
  CreateEventRequest,
  NotificationType,
  
  // Analytics types
  Metric,
  MetricSeries,
  AnalyticsReport,
  DashboardWidget,
  MetricsQuery,
  
  // Admin types
  AdminUser,
  ModerationAction,
  SystemSettings,
  UpdateUserRequest,
  ModerationRequest,
  
  // Search types
  SearchQuery,
  SearchResponse,
  SearchResult,
  SearchRecommendation
} from './types'

// ============================================================================
// Quick Access Utilities
// ============================================================================

/**
 * Initialize API clients with custom configuration
 */
export function initializeApi(config?: Parameters<typeof ApiClientFactory.getInstance>[0]) {
  return ApiClientFactory.getInstance(config)
}

/**
 * Quick authentication helper
 */
export function authenticateApi(token: string) {
  auth.setToken(token)
  return auth.getStatus()
}

/**
 * Quick health check helper
 */
export async function checkApiHealth() {
  return health.getSystem()
}

/**
 * Performance monitoring helper
 */
export function getApiStats() {
  return health.getStats()
}

/**
 * Cache management helper
 */
export function clearApiCache() {
  cache.clear()
  return 'Cache cleared successfully'
}

// ============================================================================
// Development Utilities
// ============================================================================

/**
 * Development mode helpers (only available in dev environment)
 */
export const dev = {
  /**
   * Reset all clients (useful for hot reloading)
   */
  reset: () => {
    if (process.env.NODE_ENV === 'development') {
      ApiClientFactory.reset()
      return 'API clients reset successfully'
    }
    throw new Error('Reset is only available in development mode')
  },

  /**
   * Get detailed configuration
   */
  getConfig: () => {
    if (process.env.NODE_ENV === 'development') {
      return apiClientFactory.getConfigSummary()
    }
    throw new Error('Config details only available in development mode')
  },

  /**
   * Test all service endpoints
   */
  testEndpoints: async () => {
    if (process.env.NODE_ENV === 'development') {
      const results = await apiClientFactory.checkHealth()
      return {
        timestamp: new Date().toISOString(),
        results,
        summary: {
          healthy: Object.values(results).filter(r => r.healthy).length,
          total: Object.values(results).length
        }
      }
    }
    throw new Error('Endpoint testing only available in development mode')
  }
}

// ============================================================================
// Error Handling Utilities
// ============================================================================

/**
 * Check if error is an API error
 */
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    'timestamp' in error
  )
}

/**
 * Extract user-friendly message from API error
 */
export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.message
  }
  
  if (error instanceof Error) {
    return error.message
  }
  
  return 'An unexpected error occurred'
}

/**
 * Check if error is a network/connectivity error
 */
export function isNetworkError(error: unknown): boolean {
  if (isApiError(error)) {
    return ['NETWORK_ERROR', 'TIMEOUT', 'REQUEST_FAILED'].includes(error.code)
  }
  return false
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: unknown): boolean {
  if (isApiError(error)) {
    return ['UNAUTHORIZED', 'FORBIDDEN', 'HTTP_401', 'HTTP_403'].includes(error.code)
  }
  return false
}

/**
 * Retry helper for failed API calls
 */
export async function retryApiCall<T>(
  apiCall: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error | null = null
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall()
    } catch (error) {
      lastError = error as Error
      
      // Don't retry auth errors or client errors
      if (isAuthError(error) || (isApiError(error) && error.code.startsWith('HTTP_4'))) {
        throw error
      }
      
      // Wait before retry (with exponential backoff)
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt - 1)))
      }
    }
  }
  
  throw lastError
}

// ============================================================================
// Default Export
// ============================================================================

export default {
  // Factory and clients
  factory: apiClientFactory,
  clients: apiClients,
  
  // Individual services
  content: contentApi,
  community: communityApi,
  analytics: analyticsApi,
  admin: adminApi,
  search: searchApi,
  
  // Utilities
  auth,
  health,
  cache,
  dev,
  
  // Helpers
  initialize: initializeApi,
  authenticate: authenticateApi,
  checkHealth: checkApiHealth,
  getStats: getApiStats,
  clearCache: clearApiCache,
  
  // Error handling
  isApiError,
  getErrorMessage,
  isNetworkError,
  isAuthError,
  retry: retryApiCall
}