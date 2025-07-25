/**
 * API Client Factory
 * Unified factory for creating and managing all API service clients
 */

import { env, getConfig } from '../../utils/env'
import { ApiClientConfig } from './types'
import { ContentServiceClient } from './clients/content-service'
import { CommunityServiceClient } from './clients/community-service'
import { AnalyticsServiceClient } from './clients/analytics-service'
import { AdminServiceClient } from './clients/admin-service'
import { SearchServiceClient } from './clients/search-service'

// ============================================================================
// Configuration and Types
// ============================================================================

export interface ApiClientsConfig {
  baseURL?: string
  timeout?: number
  retries?: number
  retryDelay?: number
  enableCache?: boolean
  enableRateLimit?: boolean
  defaultHeaders?: Record<string, string>
  environment?: 'development' | 'staging' | 'production'
}

export interface ApiClients {
  content: ContentServiceClient
  community: CommunityServiceClient
  analytics: AnalyticsServiceClient
  admin: AdminServiceClient
  search: SearchServiceClient
}

export interface ClientStatus {
  serviceName: string
  healthy: boolean
  lastCheck: string
  responseTime?: number
  error?: string
}

// ============================================================================
// Client Factory Class
// ============================================================================

export class ApiClientFactory {
  private static instance: ApiClientFactory
  private clients: ApiClients
  private config: Required<ApiClientsConfig>
  private authToken?: string
  private healthCheckInterval?: number

  private constructor(config: ApiClientsConfig = {}) {
    this.config = this.buildConfig(config)
    this.clients = this.createClients()
    
    // Disable health checking for frontend-only mode
    // if (this.config.environment === 'development') {
    //   this.startHealthChecking()
    // }
  }

  /**
   * Get singleton instance of the factory
   */
  public static getInstance(config?: ApiClientsConfig): ApiClientFactory {
    if (!ApiClientFactory.instance) {
      ApiClientFactory.instance = new ApiClientFactory(config)
    }
    return ApiClientFactory.instance
  }

  /**
   * Build configuration with defaults
   */
  private buildConfig(config: ApiClientsConfig): Required<ApiClientsConfig> {
    const appConfig = getConfig()
    
    return {
      baseURL: config.baseURL || appConfig.API_BASE_URL || '/api',
      timeout: config.timeout || 10000,
      retries: config.retries || 3,
      retryDelay: config.retryDelay || 1000,
      enableCache: config.enableCache !== false, // enabled by default
      enableRateLimit: config.enableRateLimit || false,
      defaultHeaders: {
        'X-Client-Version': '1.0.0',
        'X-Platform': 'web',
        'X-Environment': appConfig.isProd ? 'production' : 'development',
        ...config.defaultHeaders
      },
      environment: config.environment || (appConfig.isProd ? 'production' : 'development')
    }
  }

  /**
   * Create all API service clients
   */
  private createClients(): ApiClients {
    const baseConfig: Partial<ApiClientConfig> = {
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      retries: this.config.retries,
      retryDelay: this.config.retryDelay,
      defaultHeaders: this.config.defaultHeaders,
      cache: {
        enabled: this.config.enableCache,
        ttl: 300000, // 5 minutes default
        maxSize: 100
      },
      rateLimit: {
        enabled: this.config.enableRateLimit,
        maxRequests: 100,
        windowMs: 60000 // 1 minute
      }
    }

    return {
      content: new ContentServiceClient(baseConfig),
      community: new CommunityServiceClient(baseConfig),
      analytics: new AnalyticsServiceClient({
        ...baseConfig,
        // Analytics service may have different rate limits
        rateLimit: {
          enabled: this.config.enableRateLimit,
          maxRequests: 200, // Higher limit for analytics
          windowMs: 60000
        }
      }),
      admin: new AdminServiceClient({
        ...baseConfig,
        // Admin service with stricter caching
        cache: {
          enabled: this.config.enableCache,
          ttl: 60000, // 1 minute cache for admin operations
          maxSize: 50
        }
      }),
      search: new SearchServiceClient({
        ...baseConfig,
        // Search service with optimized caching
        cache: {
          enabled: this.config.enableCache,
          ttl: 180000, // 3 minutes for search results
          maxSize: 200 // Larger cache for search
        }
      })
    }
  }

  // ============================================================================
  // Public API
  // ============================================================================

  /**
   * Get all API clients
   */
  public getClients(): ApiClients {
    return this.clients
  }

  /**
   * Get specific client by service name
   */
  public getClient<T extends keyof ApiClients>(serviceName: T): ApiClients[T] {
    return this.clients[serviceName]
  }

  /**
   * Set authentication token for all clients
   */
  public setAuthToken(token: string): void {
    this.authToken = token
    Object.values(this.clients).forEach(client => {
      client.setAuthToken(token)
    })
  }

  /**
   * Clear authentication token from all clients
   */
  public clearAuthToken(): void {
    this.authToken = undefined
    Object.values(this.clients).forEach(client => {
      client.clearAuthToken()
    })
  }

  /**
   * Check if any client is authenticated
   */
  public isAuthenticated(): boolean {
    return Object.values(this.clients).some(client => client.isAuthenticated())
  }

  /**
   * Get current authentication status
   */
  public getAuthStatus(): {
    hasToken: boolean
    services: Record<string, boolean>
  } {
    return {
      hasToken: !!this.authToken,
      services: Object.entries(this.clients).reduce((acc, [name, client]) => {
        acc[name] = client.isAuthenticated()
        return acc
      }, {} as Record<string, boolean>)
    }
  }

  // ============================================================================
  // Health Monitoring
  // ============================================================================

  /**
   * Check health of all services
   */
  public async checkHealth(): Promise<Record<string, ClientStatus>> {
    const healthChecks = await Promise.allSettled(
      Object.entries(this.clients).map(async ([name, client]) => {
        const startTime = Date.now()
        try {
          const result = await client.healthCheck()
          return {
            serviceName: name,
            healthy: result.status === 'ok',
            lastCheck: result.timestamp,
            responseTime: Date.now() - startTime
          }
        } catch (error) {
          return {
            serviceName: name,
            healthy: false,
            lastCheck: new Date().toISOString(),
            responseTime: Date.now() - startTime,
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        }
      })
    )

    return healthChecks.reduce((acc, result, index) => {
      const serviceName = Object.keys(this.clients)[index]
      acc[serviceName] = result.status === 'fulfilled' 
        ? result.value 
        : {
            serviceName,
            healthy: false,
            lastCheck: new Date().toISOString(),
            error: 'Health check failed'
          }
      return acc
    }, {} as Record<string, ClientStatus>)
  }

  /**
   * Get overall system health status
   */
  public async getSystemHealth(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy'
    services: Record<string, ClientStatus>
    summary: {
      total: number
      healthy: number
      unhealthy: number
      averageResponseTime: number
    }
  }> {
    const services = await this.checkHealth()
    const healthyCount = Object.values(services).filter(s => s.healthy).length
    const totalCount = Object.keys(services).length
    
    const averageResponseTime = Object.values(services)
      .filter(s => s.responseTime !== undefined)
      .reduce((sum, s) => sum + (s.responseTime || 0), 0) / totalCount

    let status: 'healthy' | 'degraded' | 'unhealthy'
    if (healthyCount === totalCount) {
      status = 'healthy'
    } else if (healthyCount >= totalCount * 0.5) {
      status = 'degraded'
    } else {
      status = 'unhealthy'
    }

    return {
      status,
      services,
      summary: {
        total: totalCount,
        healthy: healthyCount,
        unhealthy: totalCount - healthyCount,
        averageResponseTime: Math.round(averageResponseTime)
      }
    }
  }

  /**
   * Start periodic health checking (development only)
   */
  private startHealthChecking(): void {
    if (this.healthCheckInterval) return

    this.healthCheckInterval = window.setInterval(async () => {
      try {
        const health = await this.getSystemHealth()
        if (health.status !== 'healthy') {
          console.warn('API Health Check:', health)
        }
      } catch (error) {
        console.error('Health check failed:', error)
      }
    }, 60000) // Check every minute
  }

  /**
   * Stop health checking
   */
  public stopHealthChecking(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval)
      this.healthCheckInterval = undefined
    }
  }

  // ============================================================================
  // Performance and Monitoring
  // ============================================================================

  /**
   * Get performance statistics for all clients
   */
  public getPerformanceStats(): Record<string, {
    service: string
    cacheStats: { size: number; maxSize: number; hitRate: number }
    authenticated: boolean
  }> {
    return Object.entries(this.clients).reduce((acc, [name, client]) => {
      acc[name] = client.getStats()
      return acc
    }, {} as Record<string, ReturnType<typeof this.clients.content.getStats>>)
  }

  /**
   * Clear all client caches
   */
  public clearAllCaches(): void {
    Object.values(this.clients).forEach(client => {
      client.clearCache()
    })
  }

  /**
   * Reset rate limits for all clients
   */
  public resetAllRateLimits(): void {
    Object.values(this.clients).forEach(client => {
      client.resetRateLimits()
    })
  }

  /**
   * Get configuration summary
   */
  public getConfigSummary(): {
    config: Required<ApiClientsConfig>
    clients: string[]
    authenticated: boolean
    cacheEnabled: boolean
    rateLimitEnabled: boolean
  } {
    return {
      config: this.config,
      clients: Object.keys(this.clients),
      authenticated: this.isAuthenticated(),
      cacheEnabled: this.config.enableCache,
      rateLimitEnabled: this.config.enableRateLimit
    }
  }

  // ============================================================================
  // Error Recovery
  // ============================================================================

  /**
   * Reinitialize all clients (for error recovery)
   */
  public reinitialize(newConfig?: ApiClientsConfig): void {
    // Stop health checking
    this.stopHealthChecking()

    // Update config if provided
    if (newConfig) {
      this.config = this.buildConfig(newConfig)
    }

    // Recreate clients
    this.clients = this.createClients()

    // Restore auth token
    if (this.authToken) {
      this.setAuthToken(this.authToken)
    }

    // Restart health checking in development
    if (this.config.environment === 'development') {
      this.startHealthChecking()
    }
  }

  /**
   * Cleanup resources
   */
  public dispose(): void {
    this.stopHealthChecking()
    this.clearAllCaches()
    this.clearAuthToken()
  }

  // ============================================================================
  // Static Utilities
  // ============================================================================

  /**
   * Create a quick client instance without factory management
   */
  public static createClient<T extends keyof ApiClients>(
    serviceName: T,
    config?: ApiClientsConfig
  ): ApiClients[T] {
    const factory = new ApiClientFactory(config)
    return factory.getClient(serviceName)
  }

  /**
   * Reset factory instance (useful for testing)
   */
  public static reset(): void {
    if (ApiClientFactory.instance) {
      ApiClientFactory.instance.dispose()
      ApiClientFactory.instance = undefined as any
    }
  }
}

// ============================================================================
// Convenience Exports
// ============================================================================

/**
 * Default factory instance - lazy initialization to prevent auto-loading
 */
let _apiClientFactory: ApiClientFactory | undefined

export const getApiClientFactory = () => {
  if (!_apiClientFactory) {
    _apiClientFactory = ApiClientFactory.getInstance()
  }
  return _apiClientFactory
}

// Export for backward compatibility - but this will now be lazy
export const apiClientFactory = new Proxy({} as ApiClientFactory, {
  get(target, prop) {
    const factory = getApiClientFactory()
    return factory[prop as keyof ApiClientFactory]
  }
})

/**
 * Get all API clients - lazy loaded
 */
export const getApiClients = () => getApiClientFactory().getClients()

// Legacy export that will lazy load
export const apiClients = new Proxy({} as ApiClients, {
  get(target, prop) {
    const clients = getApiClients()
    return clients[prop as keyof ApiClients]
  }
})

/**
 * Individual client exports for convenience - lazy loaded
 */
export const getContentApi = () => getApiClients().content
export const getCommunityApi = () => getApiClients().community
export const getAnalyticsApi = () => getApiClients().analytics
export const getAdminApi = () => getApiClients().admin
export const getSearchApi = () => getApiClients().search

// Legacy exports - will lazy load when accessed
export const contentApi = new Proxy({} as ContentServiceClient, {
  get(target, prop) {
    const api = getContentApi()
    return api[prop as keyof ContentServiceClient]
  }
})

export const communityApi = new Proxy({} as CommunityServiceClient, {
  get(target, prop) {
    const api = getCommunityApi()
    return api[prop as keyof CommunityServiceClient]
  }
})

export const analyticsApi = new Proxy({} as AnalyticsServiceClient, {
  get(target, prop) {
    const api = getAnalyticsApi()
    return api[prop as keyof AnalyticsServiceClient]
  }
})

export const adminApi = new Proxy({} as AdminServiceClient, {
  get(target, prop) {
    const api = getAdminApi()
    return api[prop as keyof AdminServiceClient]
  }
})

export const searchApi = new Proxy({} as SearchServiceClient, {
  get(target, prop) {
    const api = getSearchApi()
    return api[prop as keyof SearchServiceClient]
  }
})

/**
 * Auth token management utilities - lazy loaded
 */
export const auth = {
  setToken: (token: string) => getApiClientFactory().setAuthToken(token),
  clearToken: () => getApiClientFactory().clearAuthToken(),
  isAuthenticated: () => getApiClientFactory().isAuthenticated(),
  getStatus: () => getApiClientFactory().getAuthStatus()
}

/**
 * Health monitoring utilities - lazy loaded
 */
export const health = {
  check: () => getApiClientFactory().checkHealth(),
  getSystem: () => getApiClientFactory().getSystemHealth(),
  getStats: () => getApiClientFactory().getPerformanceStats()
}

/**
 * Cache management utilities - lazy loaded
 */
export const cache = {
  clear: () => getApiClientFactory().clearAllCaches(),
  resetRateLimits: () => getApiClientFactory().resetAllRateLimits(),
  getStats: () => getApiClientFactory().getPerformanceStats()
}