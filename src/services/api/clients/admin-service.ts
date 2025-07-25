/**
 * Admin Service API Client
 * Handles User Management, System Operations, and Administrative functions
 */

import { BaseApiClient } from '../base/base-client'
import {
  ApiResponse,
  PaginatedResponse,
  AdminUser,
  User,
  ModerationAction,
  SystemSettings,
  UpdateUserRequest,
  ModerationRequest,
  UpdateSystemSettingsRequest,
  ApiClientConfig
} from '../types'

export class AdminServiceClient extends BaseApiClient {
  constructor(config: Partial<ApiClientConfig> = {}) {
    super('admin', {
      ...config,
      defaultHeaders: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Admin-Client': 'true',
        ...config.defaultHeaders
      }
    })
  }

  // ============================================================================
  // User Management
  // ============================================================================

  /**
   * Get all users with admin details
   */
  async getUsers(params?: {
    role?: User['role']
    status?: 'active' | 'inactive' | 'blocked'
    search?: string
    sortBy?: 'createdAt' | 'lastLoginAt' | 'displayName' | 'email'
    sortOrder?: 'asc' | 'desc'
    page?: number
    limit?: number
    includeStats?: boolean
  }): Promise<PaginatedResponse<AdminUser>> {
    return this.getPaginated<AdminUser>('/users', params, { cache: 30000 })
  }

  /**
   * Get user by ID with admin details
   */
  async getUserById(userId: string, includeHistory = false): Promise<ApiResponse<AdminUser & {
    loginHistory?: Array<{
      timestamp: string
      ip: string
      userAgent: string
      location?: string
    }>
    activitySummary?: {
      postsLastMonth: number
      commentsLastMonth: number
      groupsJoined: number
      eventsAttended: number
    }
  }>> {
    return this.get<AdminUser & {
      loginHistory?: Array<{
        timestamp: string
        ip: string
        userAgent: string
        location?: string
      }>
      activitySummary?: {
        postsLastMonth: number
        commentsLastMonth: number
        groupsJoined: number
        eventsAttended: number
      }
    }>(`/users/${userId}`, { includeHistory }, { cache: 60000 })
  }

  /**
   * Update user information
   */
  async updateUser(userId: string, updates: UpdateUserRequest['updates']): Promise<ApiResponse<AdminUser>> {
    // Validate role assignment
    if (updates.role && !['user', 'moderator', 'admin'].includes(updates.role)) {
      throw new Error('Invalid role specified')
    }

    // Clean string fields
    const cleanUpdates = Object.entries(updates).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === 'string' && key !== 'role') {
          acc[key] = value.trim()
        } else {
          acc[key] = value
        }
      }
      return acc
    }, {} as Record<string, unknown>)

    return this.patch<AdminUser>(`/users/${userId}`, cleanUpdates)
  }

  /**
   * Block user
   */
  async blockUser(
    userId: string,
    reason: string,
    duration?: number
  ): Promise<ApiResponse<{ blocked: boolean; blockedUntil?: string }>> {
    if (!reason?.trim()) {
      throw new Error('Reason for blocking is required')
    }

    return this.post<{ blocked: boolean; blockedUntil?: string }>(`/users/${userId}/block`, {
      reason: reason.trim(),
      duration
    })
  }

  /**
   * Unblock user
   */
  async unblockUser(userId: string, reason?: string): Promise<ApiResponse<{ unblocked: boolean }>> {
    return this.post<{ unblocked: boolean }>(`/users/${userId}/unblock`, {
      reason: reason?.trim()
    })
  }

  /**
   * Delete user account
   */
  async deleteUser(
    userId: string,
    options?: {
      reason?: string
      hardDelete?: boolean
      transferContent?: boolean
      transferToUserId?: string
    }
  ): Promise<ApiResponse<{
    deleted: boolean
    transferredContent?: boolean
    backupCreated?: boolean
  }>> {
    return this.post<{
      deleted: boolean
      transferredContent?: boolean
      backupCreated?: boolean
    }>(`/users/${userId}/delete`, options)
  }

  /**
   * Restore deleted user
   */
  async restoreUser(userId: string): Promise<ApiResponse<{ restored: boolean }>> {
    return this.post<{ restored: boolean }>(`/users/${userId}/restore`)
  }

  /**
   * Reset user password
   */
  async resetUserPassword(userId: string, sendEmail = true): Promise<ApiResponse<{
    resetTokenSent: boolean
    temporaryPassword?: string
  }>> {
    return this.post<{
      resetTokenSent: boolean
      temporaryPassword?: string
    }>(`/users/${userId}/reset-password`, { sendEmail })
  }

  /**
   * Impersonate user (for support purposes)
   */
  async impersonateUser(userId: string, reason: string): Promise<ApiResponse<{
    impersonationToken: string
    expiresAt: string
    sessionId: string
  }>> {
    if (!reason?.trim()) {
      throw new Error('Reason for impersonation is required')
    }

    return this.post<{
      impersonationToken: string
      expiresAt: string
      sessionId: string
    }>(`/users/${userId}/impersonate`, { reason: reason.trim() })
  }

  /**
   * End impersonation session
   */
  async endImpersonation(sessionId: string): Promise<ApiResponse<{ ended: boolean }>> {
    return this.post<{ ended: boolean }>(`/impersonation/${sessionId}/end`)
  }

  // ============================================================================
  // Moderation Management
  // ============================================================================

  /**
   * Get moderation queue
   */
  async getModerationQueue(params?: {
    type?: 'pending' | 'reported' | 'flagged'
    contentType?: 'post' | 'comment' | 'user' | 'group'
    priority?: 'low' | 'medium' | 'high' | 'critical'
    assignedTo?: string
    page?: number
    limit?: number
    sortBy?: 'createdAt' | 'priority' | 'reportCount'
  }): Promise<PaginatedResponse<{
    id: string
    type: 'pending' | 'reported' | 'flagged'
    contentType: 'post' | 'comment' | 'user' | 'group'
    contentId: string
    content: {
      title?: string
      excerpt?: string
      author?: User
      url?: string
    }
    reports: Array<{
      id: string
      reason: string
      reportedBy: User
      reportedAt: string
    }>
    priority: 'low' | 'medium' | 'high' | 'critical'
    status: 'pending' | 'under_review' | 'resolved'
    assignedTo?: User
    createdAt: string
  }>> {
    return this.getPaginated<{
      id: string
      type: 'pending' | 'reported' | 'flagged'
      contentType: 'post' | 'comment' | 'user' | 'group'
      contentId: string
      content: {
        title?: string
        excerpt?: string
        author?: User
        url?: string
      }
      reports: Array<{
        id: string
        reason: string
        reportedBy: User
        reportedAt: string
      }>
      priority: 'low' | 'medium' | 'high' | 'critical'
      status: 'pending' | 'under_review' | 'resolved'
      assignedTo?: User
      createdAt: string
    }>('/moderation/queue', params, { cache: 30000 })
  }

  /**
   * Take moderation action
   */
  async takeModerationAction(action: ModerationRequest): Promise<ApiResponse<ModerationAction>> {
    // Validate required fields
    if (!action.type || !['warn', 'suspend', 'ban', 'delete', 'approve'].includes(action.type)) {
      throw new Error('Invalid moderation action type')
    }
    if (!action.targetType || !['user', 'post', 'comment', 'group'].includes(action.targetType)) {
      throw new Error('Invalid target type')
    }
    if (!action.targetId?.trim()) {
      throw new Error('Target ID is required')
    }
    if (!action.reason?.trim()) {
      throw new Error('Reason for action is required')
    }

    return this.post<ModerationAction>('/moderation/actions', {
      ...action,
      targetId: action.targetId.trim(),
      reason: action.reason.trim()
    })
  }

  /**
   * Get moderation actions history
   */
  async getModerationHistory(params?: {
    moderatorId?: string
    targetType?: ModerationAction['targetType']
    targetId?: string
    type?: ModerationAction['type']
    startDate?: string
    endDate?: string
    page?: number
    limit?: number
  }): Promise<PaginatedResponse<ModerationAction & {
    target?: {
      id: string
      title?: string
      author?: User
    }
  }>> {
    return this.getPaginated<ModerationAction & {
      target?: {
        id: string
        title?: string
        author?: User
      }
    }>('/moderation/history', params, { cache: 60000 })
  }

  /**
   * Assign moderation item
   */
  async assignModerationItem(
    itemId: string,
    moderatorId: string,
    priority?: 'low' | 'medium' | 'high' | 'critical'
  ): Promise<ApiResponse<{ assigned: boolean }>> {
    return this.post<{ assigned: boolean }>(`/moderation/queue/${itemId}/assign`, {
      moderatorId,
      priority
    })
  }

  /**
   * Get moderation statistics
   */
  async getModerationStats(params?: {
    moderatorId?: string
    timeframe?: '24h' | '7d' | '30d' | '90d'
  }): Promise<ApiResponse<{
    totalActions: number
    actionsByType: Record<ModerationAction['type'], number>
    averageResponseTime: number
    queueSize: number
    resolvedToday: number
    accuracy: number
    topModerators: Array<{
      moderator: User
      actionsCount: number
      accuracy: number
    }>
    trends: {
      actionsOverTime: Array<{ date: string; count: number }>
      queueSizeOverTime: Array<{ date: string; size: number }>
    }
  }>> {
    return this.get<{
      totalActions: number
      actionsByType: Record<ModerationAction['type'], number>
      averageResponseTime: number
      queueSize: number
      resolvedToday: number
      accuracy: number
      topModerators: Array<{
        moderator: User
        actionsCount: number
        accuracy: number
      }>
      trends: {
        actionsOverTime: Array<{ date: string; count: number }>
        queueSizeOverTime: Array<{ date: string; size: number }>
      }
    }>('/moderation/stats', params, { cache: 300000 })
  }

  // ============================================================================
  // System Settings Management
  // ============================================================================

  /**
   * Get system settings
   */
  async getSystemSettings(): Promise<ApiResponse<SystemSettings>> {
    return this.get<SystemSettings>('/settings', undefined, { cache: 300000 }) // 5min cache
  }

  /**
   * Update system settings
   */
  async updateSystemSettings(updates: UpdateSystemSettingsRequest['settings']): Promise<ApiResponse<SystemSettings>> {
    // Validate critical settings
    if (updates.general?.adminEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.general.adminEmail)) {
      throw new Error('Invalid admin email format')
    }

    if (updates.authentication?.passwordMinLength && updates.authentication.passwordMinLength < 6) {
      throw new Error('Password minimum length must be at least 6 characters')
    }

    if (updates.content?.maxFileSize && updates.content.maxFileSize > 100 * 1024 * 1024) {
      throw new Error('Maximum file size cannot exceed 100MB')
    }

    return this.patch<SystemSettings>('/settings', { settings: updates })
  }

  /**
   * Reset settings to defaults
   */
  async resetSettingsToDefaults(category?: keyof SystemSettings): Promise<ApiResponse<SystemSettings>> {
    return this.post<SystemSettings>('/settings/reset', { category })
  }

  /**
   * Export system settings
   */
  async exportSettings(): Promise<ApiResponse<{ exportUrl: string; expiresAt: string }>> {
    return this.post<{ exportUrl: string; expiresAt: string }>('/settings/export')
  }

  /**
   * Import system settings
   */
  async importSettings(file: File): Promise<ApiResponse<{
    imported: boolean
    changes: Record<string, { old: unknown; new: unknown }>
    warnings: string[]
  }>> {
    return this.upload<{
      imported: boolean
      changes: Record<string, { old: unknown; new: unknown }>
      warnings: string[]
    }>('/settings/import', file, {
      filename: 'settings.json'
    })
  }

  // ============================================================================
  // System Analytics and Monitoring
  // ============================================================================

  /**
   * Get system overview
   */
  async getSystemOverview(): Promise<ApiResponse<{
    users: {
      total: number
      active: number
      new: number
      blocked: number
    }
    content: {
      posts: number
      comments: number
      groups: number
      events: number
    }
    moderation: {
      queueSize: number
      actionsToday: number
      averageResponseTime: number
    }
    performance: {
      uptime: number
      responseTime: number
      errorRate: number
      activeConnections: number
    }
    storage: {
      used: number
      available: number
      mediaFiles: number
      backupSize: number
    }
  }>> {
    return this.get<{
      users: {
        total: number
        active: number
        new: number
        blocked: number
      }
      content: {
        posts: number
        comments: number
        groups: number
        events: number
      }
      moderation: {
        queueSize: number
        actionsToday: number
        averageResponseTime: number
      }
      performance: {
        uptime: number
        responseTime: number
        errorRate: number
        activeConnections: number
      }
      storage: {
        used: number
        available: number
        mediaFiles: number
        backupSize: number
      }
    }>('/overview', undefined, { cache: 30000 })
  }

  /**
   * Get user analytics
   */
  async getUserAnalytics(params?: {
    timeframe?: '24h' | '7d' | '30d' | '90d' | '1y'
    granularity?: 'hour' | 'day' | 'week' | 'month'
  }): Promise<ApiResponse<{
    registrations: {
      total: number
      growth: number
      timeline: Array<{ date: string; count: number }>
    }
    activity: {
      activeUsers: number
      sessionDuration: number
      pageViews: number
      bounceRate: number
    }
    engagement: {
      postsPerUser: number
      commentsPerUser: number
      groupParticipation: number
      eventAttendance: number
    }
    retention: {
      day1: number
      day7: number
      day30: number
      cohorts: Array<{
        period: string
        users: number
        retention: number[]
      }>
    }
  }>> {
    return this.get<{
      registrations: {
        total: number
        growth: number
        timeline: Array<{ date: string; count: number }>
      }
      activity: {
        activeUsers: number
        sessionDuration: number
        pageViews: number
        bounceRate: number
      }
      engagement: {
        postsPerUser: number
        commentsPerUser: number
        groupParticipation: number
        eventAttendance: number
      }
      retention: {
        day1: number
        day7: number
        day30: number
        cohorts: Array<{
          period: string
          users: number
          retention: number[]
        }>
      }
    }>('/analytics/users', params, { cache: 300000 })
  }

  /**
   * Get content analytics
   */
  async getContentAnalytics(params?: {
    type?: 'posts' | 'comments' | 'groups' | 'events'
    timeframe?: '24h' | '7d' | '30d' | '90d'
  }): Promise<ApiResponse<{
    creation: {
      total: number
      growth: number
      timeline: Array<{ date: string; count: number }>
    }
    engagement: {
      averageLikes: number
      averageComments: number
      averageShares: number
      topContent: Array<{
        id: string
        title: string
        author: User
        engagement: number
        type: string
      }>
    }
    quality: {
      moderatedContent: number
      averageQualityScore: number
      reportedContent: number
    }
  }>> {
    return this.get<{
      creation: {
        total: number
        growth: number
        timeline: Array<{ date: string; count: number }>
      }
      engagement: {
        averageLikes: number
        averageComments: number
        averageShares: number
        topContent: Array<{
          id: string
          title: string
          author: User
          engagement: number
          type: string
        }>
      }
      quality: {
        moderatedContent: number
        averageQualityScore: number
        reportedContent: number
      }
    }>('/analytics/content', params, { cache: 300000 })
  }

  // ============================================================================
  // System Operations
  // ============================================================================

  /**
   * Create system backup
   */
  async createBackup(options?: {
    type?: 'full' | 'database' | 'media' | 'settings'
    compress?: boolean
    email?: boolean
  }): Promise<ApiResponse<{
    backupId: string
    status: 'queued' | 'processing' | 'completed' | 'failed'
    estimatedSize?: number
    estimatedTime?: number
  }>> {
    return this.post<{
      backupId: string
      status: 'queued' | 'processing' | 'completed' | 'failed'
      estimatedSize?: number
      estimatedTime?: number
    }>('/backups/create', options)
  }

  /**
   * Get backups list
   */
  async getBackups(): Promise<ApiResponse<Array<{
    id: string
    type: 'full' | 'database' | 'media' | 'settings'
    size: number
    status: 'completed' | 'failed' | 'processing'
    createdAt: string
    downloadUrl?: string
    expiresAt?: string
  }>>> {
    return this.get<Array<{
      id: string
      type: 'full' | 'database' | 'media' | 'settings'
      size: number
      status: 'completed' | 'failed' | 'processing'
      createdAt: string
      downloadUrl?: string
      expiresAt?: string
    }>>('/backups', undefined, { cache: 60000 })
  }

  /**
   * Restore from backup
   */
  async restoreBackup(
    backupId: string,
    options?: { skipValidation?: boolean; email?: boolean }
  ): Promise<ApiResponse<{
    restoreId: string
    status: 'queued' | 'processing' | 'completed' | 'failed'
    estimatedTime?: number
  }>> {
    return this.post<{
      restoreId: string
      status: 'queued' | 'processing' | 'completed' | 'failed'
      estimatedTime?: number
    }>(`/backups/${backupId}/restore`, options)
  }

  /**
   * Clear cache
   */
  async clearCache(type?: 'all' | 'api' | 'page' | 'user'): Promise<ApiResponse<{
    cleared: boolean
    type: string
    itemsCleared: number
  }>> {
    return this.post<{
      cleared: boolean
      type: string
      itemsCleared: number
    }>('/cache/clear', { type: type || 'all' })
  }

  /**
   * Run maintenance tasks
   */
  async runMaintenance(tasks?: string[]): Promise<ApiResponse<{
    jobId: string
    status: 'queued' | 'processing' | 'completed'
    tasks: Array<{
      name: string
      status: 'pending' | 'running' | 'completed' | 'failed'
      progress: number
      message?: string
    }>
  }>> {
    return this.post<{
      jobId: string
      status: 'queued' | 'processing' | 'completed'
      tasks: Array<{
        name: string
        status: 'pending' | 'running' | 'completed' | 'failed'
        progress: number
        message?: string
      }>
    }>('/maintenance/run', { tasks })
  }

  /**
   * Get maintenance status
   */
  async getMaintenanceStatus(jobId?: string): Promise<ApiResponse<{
    isMaintenanceMode: boolean
    currentJobs: Array<{
      jobId: string
      status: 'queued' | 'processing' | 'completed' | 'failed'
      startedAt: string
      estimatedCompletion?: string
      tasks: Array<{
        name: string
        status: 'pending' | 'running' | 'completed' | 'failed'
        progress: number
      }>
    }>
    scheduledMaintenance?: {
      nextRun: string
      type: string
      estimatedDuration: number
    }
  }>> {
    return this.get<{
      isMaintenanceMode: boolean
      currentJobs: Array<{
        jobId: string
        status: 'queued' | 'processing' | 'completed' | 'failed'
        startedAt: string
        estimatedCompletion?: string
        tasks: Array<{
          name: string
          status: 'pending' | 'running' | 'completed' | 'failed'
          progress: number
        }>
      }>
      scheduledMaintenance?: {
        nextRun: string
        type: string
        estimatedDuration: number
      }
    }>('/maintenance/status', jobId ? { jobId } : undefined, { cache: 10000 })
  }

  /**
   * Toggle maintenance mode
   */
  async toggleMaintenanceMode(enabled: boolean, message?: string): Promise<ApiResponse<{
    maintenanceMode: boolean
    message?: string
    enabledAt?: string
  }>> {
    return this.post<{
      maintenanceMode: boolean
      message?: string
      enabledAt?: string
    }>('/maintenance/toggle', { enabled, message })
  }

  // ============================================================================
  // Audit Logging
  // ============================================================================

  /**
   * Get audit logs
   */
  async getAuditLogs(params?: {
    userId?: string
    action?: string
    resource?: string
    startDate?: string
    endDate?: string
    page?: number
    limit?: number
  }): Promise<PaginatedResponse<{
    id: string
    userId: string
    user: User
    action: string
    resource: string
    resourceId?: string
    details: Record<string, unknown>
    ipAddress: string
    userAgent: string
    timestamp: string
  }>> {
    return this.getPaginated<{
      id: string
      userId: string
      user: User
      action: string
      resource: string
      resourceId?: string
      details: Record<string, unknown>
      ipAddress: string
      userAgent: string
      timestamp: string
    }>('/audit/logs', params, { cache: 60000 })
  }

  /**
   * Export audit logs
   */
  async exportAuditLogs(params?: {
    startDate?: string
    endDate?: string
    format?: 'json' | 'csv'
    userId?: string
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
    }>('/audit/export', params)
  }
}