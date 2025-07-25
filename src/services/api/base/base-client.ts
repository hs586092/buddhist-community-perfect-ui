/**
 * Base API Client
 * Foundation class for all service-specific API clients
 */

import { ApiClientConfig, ApiClientInterface, HttpClient, ApiResponse, PaginatedResponse, ApiError } from '../types'
import { HttpClientImpl } from './http-client'

export abstract class BaseApiClient implements ApiClientInterface {
  public readonly client: HttpClient
  public readonly config: ApiClientConfig
  protected serviceName: string

  constructor(serviceName: string, config: Partial<ApiClientConfig> = {}) {
    this.serviceName = serviceName
    this.config = {
      baseURL: '/api',
      timeout: 10000,
      retries: 3,
      retryDelay: 1000,
      cache: {
        enabled: true,
        ttl: 300000, // 5 minutes
        maxSize: 100
      },
      rateLimit: {
        enabled: false,
        maxRequests: 100,
        windowMs: 60000
      },
      ...config,
      // Merge headers properly
      defaultHeaders: {
        'X-Service': serviceName,
        'X-Client-Version': '1.0.0',
        ...config.defaultHeaders
      }
    }

    this.client = new HttpClientImpl(this.config)
    this.setupInterceptors()
  }

  setAuthToken(token: string): void {
    this.client.setAuthToken(token)
  }

  clearAuthToken(): void {
    this.client.clearAuthToken()
  }

  isAuthenticated(): boolean {
    return this.client.isAuthenticated()
  }

  /**
   * Setup default interceptors for error handling and logging
   */
  private setupInterceptors(): void {
    // Request interceptor for logging
    this.config.interceptors = {
      request: [
        (config) => {
          this.logRequest(config)
          return config
        }
      ],
      response: [
        (response) => {
          this.logResponse(response)
          return response
        }
      ],
      error: [
        (error) => {
          this.logError(error)
          return this.handleApiError(error)
        }
      ]
    }
  }

  /**
   * Generic GET method with response wrapping
   */
  protected async get<T>(
    endpoint: string, 
    params?: Record<string, unknown>,
    options?: { cache?: boolean | number }
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get<ApiResponse<T>>(`/${this.serviceName}${endpoint}`, {
        params,
        cache: options?.cache
      })
      return this.validateApiResponse(response)
    } catch (error) {
      throw this.handleError(error as Error, 'GET', endpoint)
    }
  }

  /**
   * Generic POST method with response wrapping
   */
  protected async post<T>(
    endpoint: string,
    data?: unknown,
    options?: { cache?: boolean }
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post<ApiResponse<T>>(`/${this.serviceName}${endpoint}`, data, {
        cache: options?.cache ?? false
      })
      return this.validateApiResponse(response)
    } catch (error) {
      throw this.handleError(error as Error, 'POST', endpoint)
    }
  }

  /**
   * Generic PUT method with response wrapping
   */
  protected async put<T>(
    endpoint: string,
    data?: unknown
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.put<ApiResponse<T>>(`/${this.serviceName}${endpoint}`, data)
      return this.validateApiResponse(response)
    } catch (error) {
      throw this.handleError(error as Error, 'PUT', endpoint)
    }
  }

  /**
   * Generic PATCH method with response wrapping
   */
  protected async patch<T>(
    endpoint: string,
    data?: unknown
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.patch<ApiResponse<T>>(`/${this.serviceName}${endpoint}`, data)
      return this.validateApiResponse(response)
    } catch (error) {
      throw this.handleError(error as Error, 'PATCH', endpoint)
    }
  }

  /**
   * Generic DELETE method with response wrapping
   */
  protected async delete<T>(
    endpoint: string,
    params?: Record<string, unknown>
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.delete<ApiResponse<T>>(`/${this.serviceName}${endpoint}`, {
        params
      })
      return this.validateApiResponse(response)
    } catch (error) {
      throw this.handleError(error as Error, 'DELETE', endpoint)
    }
  }

  /**
   * Get paginated results with standardized pagination handling
   */
  protected async getPaginated<T>(
    endpoint: string,
    params?: Record<string, unknown> & {
      page?: number
      limit?: number
      sort?: string
      order?: 'asc' | 'desc'
    },
    options?: { cache?: boolean | number }
  ): Promise<PaginatedResponse<T>> {
    try {
      const response = await this.client.get<PaginatedResponse<T>>(`/${this.serviceName}${endpoint}`, {
        params: {
          page: 1,
          limit: 20,
          ...params
        },
        cache: options?.cache
      })
      return this.validatePaginatedResponse(response)
    } catch (error) {
      throw this.handleError(error as Error, 'GET', endpoint)
    }
  }

  /**
   * Upload file with progress tracking
   */
  protected async upload<T>(
    endpoint: string,
    file: File | Blob,
    options?: {
      filename?: string
      additionalData?: Record<string, unknown>
      onProgress?: (progress: number) => void
    }
  ): Promise<ApiResponse<T>> {
    try {
      const formData = new FormData()
      
      if (file instanceof File) {
        formData.append('file', file, options?.filename || file.name)
      } else {
        formData.append('file', file, options?.filename || 'file')
      }

      if (options?.additionalData) {
        Object.entries(options.additionalData).forEach(([key, value]) => {
          formData.append(key, String(value))
        })
      }

      // Note: Progress tracking would require XMLHttpRequest in a real implementation
      const response = await this.client.post<ApiResponse<T>>(
        `/${this.serviceName}${endpoint}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      return this.validateApiResponse(response)
    } catch (error) {
      throw this.handleError(error as Error, 'POST', endpoint)
    }
  }

  /**
   * Validate API response structure
   */
  private validateApiResponse<T>(response: ApiResponse<T>): ApiResponse<T> {
    if (!response || typeof response !== 'object') {
      throw new Error('Invalid API response format')
    }

    if (!('data' in response) || !('success' in response) || !('timestamp' in response)) {
      throw new Error('API response missing required fields')
    }

    return response
  }

  /**
   * Validate paginated response structure
   */
  private validatePaginatedResponse<T>(response: PaginatedResponse<T>): PaginatedResponse<T> {
    this.validateApiResponse(response)

    if (!('pagination' in response) || !response.pagination) {
      throw new Error('Paginated response missing pagination data')
    }

    const { pagination } = response
    const requiredFields = ['page', 'limit', 'total', 'totalPages', 'hasNext', 'hasPrev']
    
    for (const field of requiredFields) {
      if (!(field in pagination)) {
        throw new Error(`Pagination missing required field: ${field}`)
      }
    }

    return response
  }

  /**
   * Enhanced error handling with context
   */
  private handleError(error: Error, method: string, endpoint: string): ApiError {
    const apiError: ApiError = {
      code: 'CLIENT_ERROR',
      message: error.message,
      timestamp: new Date().toISOString(),
      path: `${method} /${this.serviceName}${endpoint}`,
      details: {
        service: this.serviceName,
        method,
        endpoint,
        originalError: error.name
      }
    }

    // Categorize errors
    if (error.message.includes('timeout')) {
      apiError.code = 'TIMEOUT'
    } else if (error.message.includes('network')) {
      apiError.code = 'NETWORK_ERROR'
    } else if (error.message.includes('401')) {
      apiError.code = 'UNAUTHORIZED'
    } else if (error.message.includes('403')) {
      apiError.code = 'FORBIDDEN'
    } else if (error.message.includes('404')) {
      apiError.code = 'NOT_FOUND'
    } else if (error.message.includes('422')) {
      apiError.code = 'VALIDATION_ERROR'
    } else if (error.message.includes('429')) {
      apiError.code = 'RATE_LIMITED'
    } else if (error.message.includes('500')) {
      apiError.code = 'SERVER_ERROR'
    }

    return apiError
  }

  /**
   * Handle API error from interceptor
   */
  private handleApiError(error: ApiError): ApiError {
    // Add service-specific error handling logic here
    return {
      ...error,
      details: {
        ...error.details,
        service: this.serviceName,
        handledAt: new Date().toISOString()
      }
    }
  }

  /**
   * Logging methods for development and debugging
   */
  private logRequest(config: unknown): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${this.serviceName}] Request:`, config)
    }
  }

  private logResponse(response: unknown): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${this.serviceName}] Response:`, response)
    }
  }

  private logError(error: unknown): void {
    if (process.env.NODE_ENV === 'development') {
      console.error(`[${this.serviceName}] Error:`, error)
    }
  }

  /**
   * Health check endpoint for service monitoring
   * Disabled for frontend-only mode to prevent API calls
   */
  public async healthCheck(): Promise<{ status: 'ok' | 'error'; service: string; timestamp: string }> {
    // Return mock healthy status for frontend-only mode
    return {
      status: 'ok',
      service: this.serviceName,
      timestamp: new Date().toISOString()
    }
  }

  /**
   * Get client statistics and performance metrics
   */
  public getStats(): {
    service: string
    cacheStats: { size: number; maxSize: number; hitRate: number }
    authenticated: boolean
  } {
    return {
      service: this.serviceName,
      cacheStats: (this.client as HttpClientImpl).getCacheStats(),
      authenticated: this.isAuthenticated()
    }
  }

  /**
   * Clear all caches for this client
   */
  public clearCache(): void {
    (this.client as HttpClientImpl).clearCache()
  }

  /**
   * Reset rate limit counters
   */
  public resetRateLimits(): void {
    (this.client as HttpClientImpl).clearRateLimits()
  }
}