/**
 * Analytics Service API Client
 * Handles Metrics, Monitoring, Reporting, and Analytics operations
 */

import { BaseApiClient } from '../base/base-client'
import {
  ApiResponse,
  PaginatedResponse,
  Metric,
  MetricSeries,
  DashboardWidget,
  AnalyticsReport,
  MetricsQuery,
  CreateReportRequest,
  ApiClientConfig
} from '../types'

export class AnalyticsServiceClient extends BaseApiClient {
  constructor(config: Partial<ApiClientConfig> = {}) {
    super('analytics', {
      ...config,
      defaultHeaders: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...config.defaultHeaders
      }
    })
  }

  // ============================================================================
  // Metrics Collection and Retrieval
  // ============================================================================

  /**
   * Record a single metric
   */
  async recordMetric(metric: Omit<Metric, 'id' | 'timestamp'>): Promise<ApiResponse<Metric>> {
    // Validate required fields
    if (!metric.name?.trim()) {
      throw new Error('Metric name is required')
    }
    if (typeof metric.value !== 'number') {
      throw new Error('Metric value must be a number')
    }
    if (!metric.category?.trim()) {
      throw new Error('Metric category is required')
    }

    return this.post<Metric>('/metrics', {
      ...metric,
      name: metric.name.trim(),
      category: metric.category.trim(),
      tags: metric.tags || {}
    })
  }

  /**
   * Record multiple metrics in batch
   */
  async recordMetrics(metrics: Array<Omit<Metric, 'id' | 'timestamp'>>): Promise<ApiResponse<{
    recorded: number
    failed: number
    errors: Array<{ index: number; error: string }>
  }>> {
    if (!metrics.length) {
      throw new Error('At least one metric is required')
    }

    // Validate all metrics
    metrics.forEach((metric, index) => {
      if (!metric.name?.trim()) {
        throw new Error(`Metric at index ${index}: name is required`)
      }
      if (typeof metric.value !== 'number') {
        throw new Error(`Metric at index ${index}: value must be a number`)
      }
    })

    return this.post<{
      recorded: number
      failed: number
      errors: Array<{ index: number; error: string }>
    }>('/metrics/batch', { metrics })
  }

  /**
   * Get metrics with filtering
   */
  async getMetrics(params?: {
    name?: string
    category?: string
    tags?: Record<string, string>
    startDate?: string
    endDate?: string
    page?: number
    limit?: number
    sort?: 'timestamp' | 'value' | 'name'
    order?: 'asc' | 'desc'
  }): Promise<PaginatedResponse<Metric>> {
    // Convert tags object to query parameters
    const queryParams = { ...params }
    if (params?.tags) {
      Object.entries(params.tags).forEach(([key, value]) => {
        queryParams[`tag_${key}`] = value
      })
      delete queryParams.tags
    }

    return this.getPaginated<Metric>('/metrics', queryParams, { cache: 30000 })
  }

  /**
   * Get metric by ID
   */
  async getMetricById(metricId: string): Promise<ApiResponse<Metric>> {
    return this.get<Metric>(`/metrics/${metricId}`, undefined, { cache: 60000 })
  }

  /**
   * Query metrics for time series data
   */
  async queryMetrics(query: MetricsQuery): Promise<ApiResponse<{
    series: MetricSeries[]
    query: MetricsQuery
    executionTime: number
    cached: boolean
  }>> {
    // Validate query parameters
    if (!query.metrics?.length) {
      throw new Error('At least one metric name is required')
    }
    if (!query.startDate) {
      throw new Error('Start date is required')
    }
    if (!query.endDate) {
      throw new Error('End date is required')
    }

    const startDate = new Date(query.startDate)
    const endDate = new Date(query.endDate)

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error('Invalid date format')
    }
    if (endDate <= startDate) {
      throw new Error('End date must be after start date')
    }

    return this.post<{
      series: MetricSeries[]
      query: MetricsQuery
      executionTime: number
      cached: boolean
    }>('/metrics/query', query, { cache: 60000 })
  }

  /**
   * Get metric aggregations
   */
  async getMetricAggregations(
    metricName: string,
    params?: {
      aggregation?: 'sum' | 'avg' | 'min' | 'max' | 'count'
      groupBy?: string[]
      startDate?: string
      endDate?: string
      interval?: 'minute' | 'hour' | 'day' | 'week' | 'month'
      filters?: Record<string, unknown>
    }
  ): Promise<ApiResponse<{
    aggregation: string
    result: number | Record<string, number>
    groupedBy?: string[]
    period: { start: string; end: string }
  }>> {
    return this.get<{
      aggregation: string
      result: number | Record<string, number>
      groupedBy?: string[]
      period: { start: string; end: string }
    }>(`/metrics/${metricName}/aggregations`, params, { cache: 300000 })
  }

  // ============================================================================
  // Real-time Analytics
  // ============================================================================

  /**
   * Get real-time metrics dashboard
   */
  async getRealTimeMetrics(categories?: string[]): Promise<ApiResponse<{
    metrics: Array<{
      name: string
      value: number
      change: number
      trend: 'up' | 'down' | 'stable'
      unit: string
      category: string
    }>
    lastUpdated: string
    updateInterval: number
  }>> {
    return this.get<{
      metrics: Array<{
        name: string
        value: number
        change: number
        trend: 'up' | 'down' | 'stable'
        unit: string
        category: string
      }>
      lastUpdated: string
      updateInterval: number
    }>('/metrics/realtime', { categories: categories?.join(',') }, { cache: 10000 }) // 10s cache
  }

  /**
   * Get live activity feed
   */
  async getLiveActivity(params?: {
    types?: string[]
    limit?: number
    since?: string
  }): Promise<ApiResponse<Array<{
    id: string
    type: string
    description: string
    metadata: Record<string, unknown>
    timestamp: string
    severity?: 'info' | 'warning' | 'error' | 'critical'
  }>>> {
    return this.get<Array<{
      id: string
      type: string
      description: string
      metadata: Record<string, unknown>
      timestamp: string
      severity?: 'info' | 'warning' | 'error' | 'critical'
    }>>('/activity/live', params, { cache: 5000 }) // 5s cache
  }

  // ============================================================================
  // Dashboard Management
  // ============================================================================

  /**
   * Get user dashboards
   */
  async getDashboards(): Promise<ApiResponse<Array<{
    id: string
    name: string
    description?: string
    isDefault: boolean
    widgets: DashboardWidget[]
    layout: 'grid' | 'masonry' | 'list'
    createdAt: string
    updatedAt: string
  }>>> {
    return this.get<Array<{
      id: string
      name: string
      description?: string
      isDefault: boolean
      widgets: DashboardWidget[]
      layout: 'grid' | 'masonry' | 'list'
      createdAt: string
      updatedAt: string
    }>>('/dashboards', undefined, { cache: 60000 })
  }

  /**
   * Get dashboard by ID
   */
  async getDashboardById(dashboardId: string): Promise<ApiResponse<{
    id: string
    name: string
    description?: string
    widgets: DashboardWidget[]
    layout: 'grid' | 'masonry' | 'list'
    settings: Record<string, unknown>
    createdAt: string
    updatedAt: string
  }>> {
    return this.get<{
      id: string
      name: string
      description?: string
      widgets: DashboardWidget[]
      layout: 'grid' | 'masonry' | 'list'
      settings: Record<string, unknown>
      createdAt: string
      updatedAt: string
    }>(`/dashboards/${dashboardId}`, undefined, { cache: 60000 })
  }

  /**
   * Create dashboard
   */
  async createDashboard(dashboard: {
    name: string
    description?: string
    layout?: 'grid' | 'masonry' | 'list'
    widgets?: DashboardWidget[]
    settings?: Record<string, unknown>
  }): Promise<ApiResponse<{ id: string; name: string }>> {
    if (!dashboard.name?.trim()) {
      throw new Error('Dashboard name is required')
    }

    return this.post<{ id: string; name: string }>('/dashboards', {
      ...dashboard,
      name: dashboard.name.trim()
    })
  }

  /**
   * Update dashboard
   */
  async updateDashboard(
    dashboardId: string,
    updates: {
      name?: string
      description?: string
      layout?: 'grid' | 'masonry' | 'list'
      widgets?: DashboardWidget[]
      settings?: Record<string, unknown>
    }
  ): Promise<ApiResponse<{ id: string; name: string }>> {
    return this.patch<{ id: string; name: string }>(`/dashboards/${dashboardId}`, updates)
  }

  /**
   * Delete dashboard
   */
  async deleteDashboard(dashboardId: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/dashboards/${dashboardId}`)
  }

  /**
   * Add widget to dashboard
   */
  async addWidget(
    dashboardId: string,
    widget: Omit<DashboardWidget, 'id'>
  ): Promise<ApiResponse<DashboardWidget>> {
    if (!widget.type || !widget.title?.trim()) {
      throw new Error('Widget type and title are required')
    }

    return this.post<DashboardWidget>(`/dashboards/${dashboardId}/widgets`, {
      ...widget,
      title: widget.title.trim()
    })
  }

  /**
   * Update widget
   */
  async updateWidget(
    dashboardId: string,
    widgetId: string,
    updates: Partial<DashboardWidget>
  ): Promise<ApiResponse<DashboardWidget>> {
    return this.patch<DashboardWidget>(`/dashboards/${dashboardId}/widgets/${widgetId}`, updates)
  }

  /**
   * Remove widget from dashboard
   */
  async removeWidget(dashboardId: string, widgetId: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/dashboards/${dashboardId}/widgets/${widgetId}`)
  }

  // ============================================================================
  // Reporting
  // ============================================================================

  /**
   * Get reports
   */
  async getReports(params?: {
    type?: AnalyticsReport['type']
    status?: 'active' | 'inactive'
    page?: number
    limit?: number
  }): Promise<PaginatedResponse<AnalyticsReport>> {
    return this.getPaginated<AnalyticsReport>('/reports', params, { cache: 60000 })
  }

  /**
   * Get report by ID
   */
  async getReportById(reportId: string): Promise<ApiResponse<AnalyticsReport>> {
    return this.get<AnalyticsReport>(`/reports/${reportId}`, undefined, { cache: 60000 })
  }

  /**
   * Create report
   */
  async createReport(reportData: CreateReportRequest): Promise<ApiResponse<AnalyticsReport>> {
    if (!reportData.name?.trim()) {
      throw new Error('Report name is required')
    }
    if (!reportData.type) {
      throw new Error('Report type is required')
    }
    if (!reportData.config || Object.keys(reportData.config).length === 0) {
      throw new Error('Report configuration is required')
    }

    return this.post<AnalyticsReport>('/reports', {
      ...reportData,
      name: reportData.name.trim(),
      description: reportData.description?.trim()
    })
  }

  /**
   * Update report
   */
  async updateReport(
    reportId: string,
    updates: Partial<CreateReportRequest>
  ): Promise<ApiResponse<AnalyticsReport>> {
    const cleanUpdates = Object.entries(updates).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === 'string' && value.trim()) {
          acc[key] = value.trim()
        } else if (typeof value !== 'string') {
          acc[key] = value
        }
      }
      return acc
    }, {} as Record<string, unknown>)

    return this.patch<AnalyticsReport>(`/reports/${reportId}`, cleanUpdates)
  }

  /**
   * Delete report
   */
  async deleteReport(reportId: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/reports/${reportId}`)
  }

  /**
   * Generate report
   */
  async generateReport(
    reportId: string,
    params?: {
      startDate?: string
      endDate?: string
      format?: 'json' | 'csv' | 'pdf'
      email?: boolean
    }
  ): Promise<ApiResponse<{
    reportId: string
    jobId: string
    status: 'queued' | 'processing' | 'completed' | 'failed'
    downloadUrl?: string
    estimatedCompletionTime?: string
  }>> {
    return this.post<{
      reportId: string
      jobId: string
      status: 'queued' | 'processing' | 'completed' | 'failed'
      downloadUrl?: string
      estimatedCompletionTime?: string
    }>(`/reports/${reportId}/generate`, params)
  }

  /**
   * Get report generation status
   */
  async getReportStatus(jobId: string): Promise<ApiResponse<{
    jobId: string
    status: 'queued' | 'processing' | 'completed' | 'failed'
    progress: number
    downloadUrl?: string
    error?: string
    completedAt?: string
  }>> {
    return this.get<{
      jobId: string
      status: 'queued' | 'processing' | 'completed' | 'failed'
      progress: number
      downloadUrl?: string
      error?: string
      completedAt?: string
    }>(`/reports/jobs/${jobId}`, undefined, { cache: 5000 })
  }

  /**
   * Get scheduled reports
   */
  async getScheduledReports(): Promise<ApiResponse<Array<AnalyticsReport & {
    nextRun?: string
    lastRun?: string
    status: 'active' | 'paused' | 'error'
  }>>> {
    return this.get<Array<AnalyticsReport & {
      nextRun?: string
      lastRun?: string
      status: 'active' | 'paused' | 'error'
    }>>('/reports/scheduled', undefined, { cache: 60000 })
  }

  // ============================================================================
  // Performance Monitoring
  // ============================================================================

  /**
   * Get system performance metrics
   */
  async getSystemPerformance(params?: {
    service?: string
    timeframe?: '1h' | '24h' | '7d' | '30d'
    metrics?: string[]
  }): Promise<ApiResponse<{
    service: string
    timeframe: string
    metrics: {
      cpu: MetricSeries
      memory: MetricSeries
      disk: MetricSeries
      network: MetricSeries
      requests: MetricSeries
      errors: MetricSeries
      responseTime: MetricSeries
    }
    alerts: Array<{
      level: 'warning' | 'critical'
      metric: string
      threshold: number
      current: number
      message: string
    }>
  }>> {
    return this.get<{
      service: string
      timeframe: string
      metrics: {
        cpu: MetricSeries
        memory: MetricSeries
        disk: MetricSeries
        network: MetricSeries
        requests: MetricSeries
        errors: MetricSeries
        responseTime: MetricSeries
      }
      alerts: Array<{
        level: 'warning' | 'critical'
        metric: string
        threshold: number
        current: number
        message: string
      }>
    }>('/monitoring/performance', params, { cache: 30000 })
  }

  /**
   * Get application health status
   */
  async getHealthStatus(): Promise<ApiResponse<{
    status: 'healthy' | 'degraded' | 'unhealthy'
    services: Record<string, {
      status: 'up' | 'down' | 'degraded'
      responseTime: number
      lastCheck: string
      uptime: number
      version?: string
    }>
    checks: Array<{
      name: string
      status: 'pass' | 'fail' | 'warn'
      message?: string
      duration: number
    }>
    timestamp: string
  }>> {
    return this.get<{
      status: 'healthy' | 'degraded' | 'unhealthy'
      services: Record<string, {
        status: 'up' | 'down' | 'degraded'
        responseTime: number
        lastCheck: string
        uptime: number
        version?: string
      }>
      checks: Array<{
        name: string
        status: 'pass' | 'fail' | 'warn'
        message?: string
        duration: number
      }>
      timestamp: string
    }>('/monitoring/health', undefined, { cache: 10000 }) // 10s cache
  }

  /**
   * Get error tracking data
   */
  async getErrorTracking(params?: {
    service?: string
    level?: 'error' | 'warning' | 'info'
    startDate?: string
    endDate?: string
    page?: number
    limit?: number
  }): Promise<PaginatedResponse<{
    id: string
    service: string
    level: 'error' | 'warning' | 'info'
    message: string
    stack?: string
    context: Record<string, unknown>
    count: number
    firstSeen: string
    lastSeen: string
    resolved: boolean
  }>> {
    return this.getPaginated<{
      id: string
      service: string
      level: 'error' | 'warning' | 'info'
      message: string
      stack?: string
      context: Record<string, unknown>
      count: number
      firstSeen: string
      lastSeen: string
      resolved: boolean
    }>('/monitoring/errors', params, { cache: 30000 })
  }

  // ============================================================================
  // User Behavior Analytics
  // ============================================================================

  /**
   * Track user event
   */
  async trackEvent(event: {
    name: string
    userId?: string
    sessionId?: string
    properties?: Record<string, unknown>
    context?: Record<string, unknown>
  }): Promise<ApiResponse<{ eventId: string; tracked: boolean }>> {
    if (!event.name?.trim()) {
      throw new Error('Event name is required')
    }

    return this.post<{ eventId: string; tracked: boolean }>('/events/track', {
      ...event,
      name: event.name.trim()
    })
  }

  /**
   * Get user behavior analytics
   */
  async getUserBehaviorAnalytics(params?: {
    userId?: string
    events?: string[]
    startDate?: string
    endDate?: string
    granularity?: 'hour' | 'day' | 'week'
  }): Promise<ApiResponse<{
    userId?: string
    period: { start: string; end: string }
    events: Record<string, {
      count: number
      uniqueUsers: number
      timeline: Array<{ timestamp: string; count: number }>
    }>
    funnels: Array<{
      name: string
      steps: Array<{ event: string; users: number; dropoff: number }>
    }>
    cohorts: Array<{
      name: string
      size: number
      retention: number[]
    }>
  }>> {
    return this.get<{
      userId?: string
      period: { start: string; end: string }
      events: Record<string, {
        count: number
        uniqueUsers: number
        timeline: Array<{ timestamp: string; count: number }>
      }>
      funnels: Array<{
        name: string
        steps: Array<{ event: string; users: number; dropoff: number }>
      }>
      cohorts: Array<{
        name: string
        size: number
        retention: number[]
      }>
    }>('/analytics/behavior', params, { cache: 300000 })
  }

  /**
   * Get conversion analytics
   */
  async getConversionAnalytics(params?: {
    funnel?: string
    startDate?: string
    endDate?: string
    segmentBy?: string[]
  }): Promise<ApiResponse<{
    funnel: string
    conversionRate: number
    totalUsers: number
    conversions: number
    steps: Array<{
      name: string
      users: number
      conversionRate: number
      dropoffRate: number
      averageTime: number
    }>
    segments?: Record<string, {
      conversionRate: number
      users: number
    }>
  }>> {
    return this.get<{
      funnel: string
      conversionRate: number
      totalUsers: number
      conversions: number
      steps: Array<{
        name: string
        users: number
        conversionRate: number
        dropoffRate: number
        averageTime: number
      }>
      segments?: Record<string, {
        conversionRate: number
        users: number
      }>
    }>('/analytics/conversions', params, { cache: 300000 })
  }

  // ============================================================================
  // Data Export and Integration
  // ============================================================================

  /**
   * Export metrics data
   */
  async exportMetrics(params: {
    metrics: string[]
    startDate: string
    endDate: string
    format: 'json' | 'csv' | 'xlsx'
    email?: boolean
  }): Promise<ApiResponse<{
    exportId: string
    status: 'queued' | 'processing' | 'completed'
    downloadUrl?: string
    estimatedSize: number
  }>> {
    return this.post<{
      exportId: string
      status: 'queued' | 'processing' | 'completed'
      downloadUrl?: string
      estimatedSize: number
    }>('/exports/metrics', params)
  }

  /**
   * Get export status
   */
  async getExportStatus(exportId: string): Promise<ApiResponse<{
    exportId: string
    status: 'queued' | 'processing' | 'completed' | 'failed'
    progress: number
    downloadUrl?: string
    error?: string
    expiresAt?: string
  }>> {
    return this.get<{
      exportId: string
      status: 'queued' | 'processing' | 'completed' | 'failed'
      progress: number
      downloadUrl?: string
      error?: string
      expiresAt?: string
    }>(`/exports/${exportId}`, undefined, { cache: 5000 })
  }
}