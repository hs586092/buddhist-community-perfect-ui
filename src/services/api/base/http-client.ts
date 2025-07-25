/**
 * HTTP Client Implementation
 * Robust HTTP client with retry logic, caching, rate limiting, and interceptors
 */

import { ApiClientConfig, RequestConfig, ApiError, HttpClient } from '../types'

export class HttpClientImpl implements HttpClient {
  private baseURL: string
  private defaultConfig: ApiClientConfig
  private authToken?: string
  private requestCache = new Map<string, { data: unknown; timestamp: number; ttl: number }>()
  private rateLimitCounters = new Map<string, { count: number; resetTime: number }>()

  constructor(config: ApiClientConfig) {
    this.baseURL = config.baseURL
    this.defaultConfig = {
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
        windowMs: 60000 // 1 minute
      },
      ...config
    }
  }

  setAuthToken(token: string): void {
    this.authToken = token
  }

  clearAuthToken(): void {
    this.authToken = undefined
  }

  isAuthenticated(): boolean {
    return !!this.authToken
  }

  async get<T = unknown>(url: string, config?: Partial<RequestConfig>): Promise<T> {
    // Frontend-only mode: prevent all API calls
    if (process.env.NODE_ENV === 'development' && url.includes('/health')) {
      return { status: 'ok', timestamp: new Date().toISOString() } as T
    }
    return this.request<T>({ method: 'GET', url, ...config })
  }

  async post<T = unknown>(url: string, data?: unknown, config?: Partial<RequestConfig>): Promise<T> {
    return this.request<T>({ method: 'POST', url, data, ...config })
  }

  async put<T = unknown>(url: string, data?: unknown, config?: Partial<RequestConfig>): Promise<T> {
    return this.request<T>({ method: 'PUT', url, data, ...config })
  }

  async patch<T = unknown>(url: string, data?: unknown, config?: Partial<RequestConfig>): Promise<T> {
    return this.request<T>({ method: 'PATCH', url, data, ...config })
  }

  async delete<T = unknown>(url: string, config?: Partial<RequestConfig>): Promise<T> {
    return this.request<T>({ method: 'DELETE', url, ...config })
  }

  async request<T = unknown>(config: RequestConfig): Promise<T> {
    // Build full request configuration
    const requestConfig = this.buildRequestConfig(config)
    
    // Check cache for GET requests
    if (requestConfig.method === 'GET' && requestConfig.cache !== false) {
      const cached = this.getCachedResponse<T>(requestConfig)
      if (cached) return cached
    }

    // Check rate limits
    this.checkRateLimit(requestConfig)

    // Execute request with retry logic
    const response = await this.executeWithRetry<T>(requestConfig)

    // Cache successful GET responses
    if (requestConfig.method === 'GET' && requestConfig.cache !== false) {
      this.setCachedResponse(requestConfig, response)
    }

    return response
  }

  private buildRequestConfig(config: RequestConfig): RequestConfig & { fullUrl: string } {
    const fullUrl = this.buildUrl(config.url, config.params)
    const headers = this.buildHeaders(config.headers)

    return {
      ...config,
      fullUrl,
      headers,
      timeout: config.timeout ?? this.defaultConfig.timeout,
      retries: config.retries ?? this.defaultConfig.retries
    }
  }

  private buildUrl(url: string, params?: Record<string, unknown>): string {
    const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`
    
    if (!params || Object.keys(params).length === 0) {
      return fullUrl
    }

    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value))
      }
    })

    const separator = fullUrl.includes('?') ? '&' : '?'
    return `${fullUrl}${separator}${searchParams.toString()}`
  }

  private buildHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...this.defaultConfig.defaultHeaders
    }

    if (this.authToken) {
      headers.Authorization = `Bearer ${this.authToken}`
    }

    if (customHeaders) {
      Object.assign(headers, customHeaders)
    }

    return headers
  }

  private getCacheKey(config: RequestConfig): string {
    const { method, url, params } = config
    return `${method}:${url}:${JSON.stringify(params || {})}`
  }

  private getCachedResponse<T>(config: RequestConfig): T | null {
    if (!this.defaultConfig.cache?.enabled) return null

    const cacheKey = this.getCacheKey(config)
    const cached = this.requestCache.get(cacheKey)

    if (!cached) return null

    const now = Date.now()
    const isExpired = now > cached.timestamp + cached.ttl

    if (isExpired) {
      this.requestCache.delete(cacheKey)
      return null
    }

    return cached.data as T
  }

  private setCachedResponse<T>(config: RequestConfig, data: T): void {
    if (!this.defaultConfig.cache?.enabled) return

    const cacheKey = this.getCacheKey(config)
    const ttl = typeof config.cache === 'number' ? config.cache : this.defaultConfig.cache!.ttl

    // Clean cache if it's getting too large
    if (this.requestCache.size >= this.defaultConfig.cache!.maxSize) {
      this.cleanCache()
    }

    this.requestCache.set(cacheKey, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  private cleanCache(): void {
    const now = Date.now()
    for (const [key, value] of this.requestCache.entries()) {
      if (now > value.timestamp + value.ttl) {
        this.requestCache.delete(key)
      }
    }

    // If still too large, remove oldest entries
    if (this.requestCache.size >= this.defaultConfig.cache!.maxSize) {
      const entries = Array.from(this.requestCache.entries())
        .sort(([, a], [, b]) => a.timestamp - b.timestamp)
        .slice(this.defaultConfig.cache!.maxSize / 2)
      
      this.requestCache.clear()
      entries.forEach(([key, value]) => {
        this.requestCache.set(key, value)
      })
    }
  }

  private checkRateLimit(config: RequestConfig): void {
    if (!this.defaultConfig.rateLimit?.enabled) return

    const key = this.getRateLimitKey(config)
    const now = Date.now()
    const counter = this.rateLimitCounters.get(key)

    if (!counter || now > counter.resetTime) {
      // Reset or initialize counter
      this.rateLimitCounters.set(key, {
        count: 1,
        resetTime: now + this.defaultConfig.rateLimit!.windowMs
      })
      return
    }

    if (counter.count >= this.defaultConfig.rateLimit!.maxRequests) {
      const resetIn = Math.ceil((counter.resetTime - now) / 1000)
      throw new Error(`Rate limit exceeded. Reset in ${resetIn} seconds.`)
    }

    counter.count++
  }

  private getRateLimitKey(config: RequestConfig): string {
    // Group by base URL path for rate limiting
    const url = new URL(config.fullUrl || config.url)
    return url.pathname.split('/').slice(0, 3).join('/')
  }

  private async executeWithRetry<T>(config: RequestConfig): Promise<T> {
    let lastError: Error | null = null
    const maxAttempts = (config.retries ?? 0) + 1

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        // Apply request interceptors
        const processedConfig = await this.applyRequestInterceptors(config)
        
        // Make the actual HTTP request
        const response = await this.makeHttpRequest<T>(processedConfig)
        
        // Apply response interceptors
        return await this.applyResponseInterceptors(response)
      } catch (error) {
        lastError = error as Error
        
        // Apply error interceptors
        const processedError = await this.applyErrorInterceptors(error as Error)
        
        // Don't retry on client errors (4xx) or on last attempt
        if (this.shouldNotRetry(processedError) || attempt === maxAttempts) {
          throw this.createApiError(processedError, config)
        }

        // Wait before retry with exponential backoff
        const delay = this.calculateRetryDelay(attempt)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }

    throw this.createApiError(lastError!, config)
  }

  private async applyRequestInterceptors(config: RequestConfig): Promise<RequestConfig> {
    let processedConfig = config

    if (this.defaultConfig.interceptors?.request) {
      for (const interceptor of this.defaultConfig.interceptors.request) {
        processedConfig = await interceptor(processedConfig)
      }
    }

    return processedConfig
  }

  private async applyResponseInterceptors<T>(response: T): Promise<T> {
    let processedResponse = response

    if (this.defaultConfig.interceptors?.response) {
      for (const interceptor of this.defaultConfig.interceptors.response) {
        processedResponse = await interceptor(processedResponse) as T
      }
    }

    return processedResponse
  }

  private async applyErrorInterceptors(error: Error): Promise<Error> {
    let processedError = error

    if (this.defaultConfig.interceptors?.error) {
      for (const interceptor of this.defaultConfig.interceptors.error) {
        const apiError = this.createApiError(processedError)
        processedError = await interceptor(apiError) as Error
      }
    }

    return processedError
  }

  private async makeHttpRequest<T>(config: RequestConfig): Promise<T> {
    // Frontend-only mode: completely prevent all API calls
    if (process.env.NODE_ENV === 'development' && !process.env.VITE_ENABLE_API) {
      // Silently block API calls - comment out for debugging
      // console.log(`[FRONTEND-ONLY] Blocked API call: ${config.method} ${config.fullUrl}`)
      
      // Return mock responses for different types of calls
      if (config.fullUrl?.includes('/health')) {
        return { status: 'ok', service: 'frontend-mock', timestamp: new Date().toISOString() } as T
      }
      
      // Return empty success response for other calls
      return { success: true, data: null, timestamp: new Date().toISOString() } as T
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(
      () => controller.abort(),
      config.timeout ?? this.defaultConfig.timeout
    )

    try {
      const fetchConfig: RequestInit = {
        method: config.method,
        headers: config.headers,
        signal: controller.signal
      }

      if (config.data && !['GET', 'HEAD'].includes(config.method)) {
        fetchConfig.body = JSON.stringify(config.data)
      }

      const response = await fetch(config.fullUrl, fetchConfig)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const contentType = response.headers.get('content-type')
      if (contentType?.includes('application/json')) {
        return await response.json()
      }

      return await response.text() as unknown as T
    } finally {
      clearTimeout(timeoutId)
    }
  }

  private shouldNotRetry(error: Error): boolean {
    // Don't retry client errors (4xx)
    const message = error.message.toLowerCase()
    return message.includes('400') || message.includes('401') || 
           message.includes('403') || message.includes('404') ||
           message.includes('422') || message.includes('429')
  }

  private calculateRetryDelay(attempt: number): number {
    const baseDelay = this.defaultConfig.retryDelay ?? 1000
    const backoffMultiplier = Math.pow(2, attempt - 1)
    const jitter = Math.random() * 1000
    
    return baseDelay * backoffMultiplier + jitter
  }

  private createApiError(error: Error, config?: RequestConfig): ApiError {
    const apiError: ApiError = {
      code: 'REQUEST_FAILED',
      message: error.message,
      timestamp: new Date().toISOString(),
      path: config?.url
    }

    // Extract HTTP status from error message
    const statusMatch = error.message.match(/HTTP (\d+)/)
    if (statusMatch) {
      apiError.code = `HTTP_${statusMatch[1]}`
    }

    // Add timeout-specific handling
    if (error.name === 'AbortError') {
      apiError.code = 'REQUEST_TIMEOUT'
      apiError.message = 'Request timed out'
    }

    return apiError
  }

  // Utility methods for cache management
  public clearCache(): void {
    this.requestCache.clear()
  }

  public getCacheStats(): { size: number; maxSize: number; hitRate: number } {
    return {
      size: this.requestCache.size,
      maxSize: this.defaultConfig.cache?.maxSize ?? 0,
      hitRate: 0 // Would need to track hits/misses to calculate
    }
  }

  public clearRateLimits(): void {
    this.rateLimitCounters.clear()
  }
}