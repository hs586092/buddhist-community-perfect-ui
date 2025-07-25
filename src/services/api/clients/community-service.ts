/**
 * Community Service API Client
 * Handles Group, Event, Notification, and Collaboration operations
 */

import { BaseApiClient } from '../base/base-client'
import {
  ApiResponse,
  PaginatedResponse,
  Group,
  Event,
  Notification,
  User,
  CreateGroupRequest,
  UpdateGroupRequest,
  CreateEventRequest,
  UpdateEventRequest,
  NotificationType,
  ApiClientConfig
} from '../types'

export class CommunityServiceClient extends BaseApiClient {
  constructor(config: Partial<ApiClientConfig> = {}) {
    super('community', {
      ...config,
      defaultHeaders: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...config.defaultHeaders
      }
    })
  }

  // ============================================================================
  // Group Management
  // ============================================================================

  /**
   * Get all groups with filtering and pagination
   */
  async getGroups(params?: {
    type?: Group['type']
    category?: string
    search?: string
    membershipStatus?: 'all' | 'member' | 'owner' | 'moderator' | 'pending'
    page?: number
    limit?: number
    sort?: 'newest' | 'popular' | 'alphabetical' | 'mostActive'
  }): Promise<PaginatedResponse<Group>> {
    return this.getPaginated<Group>('/groups', params, { cache: 60000 }) // 1min cache
  }

  /**
   * Get group by ID
   */
  async getGroupById(groupId: string): Promise<ApiResponse<Group>> {
    return this.get<Group>(`/groups/${groupId}`, undefined, { cache: 300000 }) // 5min cache
  }

  /**
   * Get group by slug
   */
  async getGroupBySlug(slug: string): Promise<ApiResponse<Group>> {
    return this.get<Group>(`/groups/slug/${slug}`, undefined, { cache: 300000 })
  }

  /**
   * Create new group
   */
  async createGroup(groupData: CreateGroupRequest): Promise<ApiResponse<Group>> {
    // Validate required fields
    if (!groupData.name?.trim()) {
      throw new Error('Group name is required')
    }
    if (!groupData.description?.trim()) {
      throw new Error('Group description is required')
    }
    if (!groupData.category?.trim()) {
      throw new Error('Group category is required')
    }

    return this.post<Group>('/groups', {
      ...groupData,
      name: groupData.name.trim(),
      description: groupData.description.trim(),
      category: groupData.category.trim()
    })
  }

  /**
   * Update group
   */
  async updateGroup(groupId: string, updates: Partial<UpdateGroupRequest>): Promise<ApiResponse<Group>> {
    // Clean and validate updates
    const cleanUpdates = Object.entries(updates).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (typeof value === 'string') {
          acc[key] = value.trim()
        } else {
          acc[key] = value
        }
      }
      return acc
    }, {} as Record<string, unknown>)

    return this.patch<Group>(`/groups/${groupId}`, cleanUpdates)
  }

  /**
   * Delete group
   */
  async deleteGroup(groupId: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/groups/${groupId}`)
  }

  /**
   * Upload group cover image
   */
  async uploadGroupCover(groupId: string, file: File): Promise<ApiResponse<{ coverImageUrl: string }>> {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Only JPEG, PNG, and WebP images are allowed')
    }

    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      throw new Error('Image size must be less than 5MB')
    }

    return this.upload<{ coverImageUrl: string }>(`/groups/${groupId}/cover`, file, {
      filename: `cover-${Date.now()}.${file.name.split('.').pop()}`
    })
  }

  /**
   * Upload group avatar
   */
  async uploadGroupAvatar(groupId: string, file: File): Promise<ApiResponse<{ avatarUrl: string }>> {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Only JPEG, PNG, and WebP images are allowed')
    }

    const maxSize = 2 * 1024 * 1024 // 2MB
    if (file.size > maxSize) {
      throw new Error('Image size must be less than 2MB')
    }

    return this.upload<{ avatarUrl: string }>(`/groups/${groupId}/avatar`, file, {
      filename: `avatar-${Date.now()}.${file.name.split('.').pop()}`
    })
  }

  // ============================================================================
  // Group Membership Management
  // ============================================================================

  /**
   * Get group members
   */
  async getGroupMembers(
    groupId: string,
    params?: {
      role?: 'owner' | 'moderator' | 'member'
      search?: string
      page?: number
      limit?: number
      sort?: 'newest' | 'alphabetical' | 'mostActive'
    }
  ): Promise<PaginatedResponse<User & { membershipInfo: {
    role: 'owner' | 'moderator' | 'member'
    joinedAt: string
    isActive: boolean
  } }>> {
    return this.getPaginated<User & { membershipInfo: {
      role: 'owner' | 'moderator' | 'member'
      joinedAt: string
      isActive: boolean
    } }>(`/groups/${groupId}/members`, params, { cache: 60000 })
  }

  /**
   * Join group
   */
  async joinGroup(groupId: string, message?: string): Promise<ApiResponse<{ status: 'joined' | 'pending' | 'rejected' }>> {
    return this.post<{ status: 'joined' | 'pending' | 'rejected' }>(`/groups/${groupId}/join`, { message })
  }

  /**
   * Leave group
   */
  async leaveGroup(groupId: string): Promise<ApiResponse<void>> {
    return this.post<void>(`/groups/${groupId}/leave`)
  }

  /**
   * Invite user to group
   */
  async inviteToGroup(
    groupId: string,
    userId: string,
    message?: string
  ): Promise<ApiResponse<{ invitationId: string; status: 'sent' | 'pending' }>> {
    return this.post<{ invitationId: string; status: 'sent' | 'pending' }>(`/groups/${groupId}/invite`, {
      userId,
      message
    })
  }

  /**
   * Respond to group invitation
   */
  async respondToGroupInvitation(
    invitationId: string,
    response: 'accept' | 'decline'
  ): Promise<ApiResponse<{ status: 'accepted' | 'declined' }>> {
    return this.post<{ status: 'accepted' | 'declined' }>(`/groups/invitations/${invitationId}/respond`, {
      response
    })
  }

  /**
   * Remove member from group
   */
  async removeMember(groupId: string, userId: string, reason?: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/groups/${groupId}/members/${userId}`, { reason })
  }

  /**
   * Update member role
   */
  async updateMemberRole(
    groupId: string,
    userId: string,
    role: 'moderator' | 'member'
  ): Promise<ApiResponse<void>> {
    return this.patch<void>(`/groups/${groupId}/members/${userId}`, { role })
  }

  /**
   * Get pending membership requests
   */
  async getPendingRequests(groupId: string): Promise<ApiResponse<Array<{
    id: string
    user: User
    message?: string
    requestedAt: string
  }>>> {
    return this.get<Array<{
      id: string
      user: User
      message?: string
      requestedAt: string
    }>>(`/groups/${groupId}/requests`, undefined, { cache: 30000 })
  }

  /**
   * Approve/reject membership request
   */
  async handleMembershipRequest(
    requestId: string,
    action: 'approve' | 'reject',
    message?: string
  ): Promise<ApiResponse<{ status: 'approved' | 'rejected' }>> {
    return this.post<{ status: 'approved' | 'rejected' }>(`/groups/requests/${requestId}/${action}`, {
      message
    })
  }

  // ============================================================================
  // Group Analytics
  // ============================================================================

  /**
   * Get group statistics
   */
  async getGroupStats(groupId: string): Promise<ApiResponse<{
    members: {
      total: number
      active: number
      new: number
      growth: number
    }
    content: {
      posts: number
      comments: number
      events: number
    }
    engagement: {
      postsPerWeek: number
      commentsPerPost: number
      eventAttendance: number
    }
    trends: {
      membershipGrowth: Array<{ date: string; members: number }>
      activityTrend: Array<{ date: string; posts: number; comments: number }>
    }
  }>> {
    return this.get<{
      members: {
        total: number
        active: number
        new: number
        growth: number
      }
      content: {
        posts: number
        comments: number
        events: number
      }
      engagement: {
        postsPerWeek: number
        commentsPerPost: number
        eventAttendance: number
      }
      trends: {
        membershipGrowth: Array<{ date: string; members: number }>
        activityTrend: Array<{ date: string; posts: number; comments: number }>
      }
    }>(`/groups/${groupId}/stats`, undefined, { cache: 300000 }) // 5min cache
  }

  // ============================================================================
  // Event Management
  // ============================================================================

  /**
   * Get events with filtering and pagination
   */
  async getEvents(params?: {
    type?: Event['type']
    status?: Event['status']
    groupId?: string
    organizerId?: string
    startDate?: string
    endDate?: string
    location?: string
    tags?: string[]
    page?: number
    limit?: number
    sort?: 'upcoming' | 'newest' | 'popular' | 'alphabetical'
  }): Promise<PaginatedResponse<Event>> {
    return this.getPaginated<Event>('/events', {
      ...params,
      tags: params?.tags?.join(',')
    }, { cache: 60000 })
  }

  /**
   * Get event by ID
   */
  async getEventById(eventId: string): Promise<ApiResponse<Event>> {
    return this.get<Event>(`/events/${eventId}`, undefined, { cache: 300000 })
  }

  /**
   * Get event by slug
   */
  async getEventBySlug(slug: string): Promise<ApiResponse<Event>> {
    return this.get<Event>(`/events/slug/${slug}`, undefined, { cache: 300000 })
  }

  /**
   * Create new event
   */
  async createEvent(eventData: CreateEventRequest): Promise<ApiResponse<Event>> {
    // Validate required fields
    if (!eventData.title?.trim()) {
      throw new Error('Event title is required')
    }
    if (!eventData.description?.trim()) {
      throw new Error('Event description is required')
    }
    if (!eventData.startDate) {
      throw new Error('Event start date is required')
    }
    if (!eventData.endDate) {
      throw new Error('Event end date is required')
    }
    if (!eventData.timezone?.trim()) {
      throw new Error('Event timezone is required')
    }

    // Validate dates
    const startDate = new Date(eventData.startDate)
    const endDate = new Date(eventData.endDate)
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error('Invalid date format')
    }
    
    if (endDate <= startDate) {
      throw new Error('End date must be after start date')
    }

    return this.post<Event>('/events', {
      ...eventData,
      title: eventData.title.trim(),
      description: eventData.description.trim(),
      timezone: eventData.timezone.trim(),
      tags: eventData.tags?.filter(tag => tag.trim()).map(tag => tag.trim()) || []
    })
  }

  /**
   * Update event
   */
  async updateEvent(eventId: string, updates: Partial<UpdateEventRequest>): Promise<ApiResponse<Event>> {
    // Validate dates if provided
    if (updates.startDate && updates.endDate) {
      const startDate = new Date(updates.startDate)
      const endDate = new Date(updates.endDate)
      
      if (endDate <= startDate) {
        throw new Error('End date must be after start date')
      }
    }

    // Clean updates
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

    return this.patch<Event>(`/events/${eventId}`, cleanUpdates)
  }

  /**
   * Delete event
   */
  async deleteEvent(eventId: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/events/${eventId}`)
  }

  /**
   * Cancel event
   */
  async cancelEvent(eventId: string, reason?: string): Promise<ApiResponse<Event>> {
    return this.patch<Event>(`/events/${eventId}`, { 
      status: 'cancelled' as Event['status'],
      cancellationReason: reason 
    })
  }

  // ============================================================================
  // Event Attendance Management
  // ============================================================================

  /**
   * RSVP to event
   */
  async rsvpToEvent(
    eventId: string,
    response: 'attending' | 'maybe' | 'not_attending'
  ): Promise<ApiResponse<{ status: response; waitlisted?: boolean }>> {
    return this.post<{ status: typeof response; waitlisted?: boolean }>(`/events/${eventId}/rsvp`, {
      response
    })
  }

  /**
   * Get event attendees
   */
  async getEventAttendees(
    eventId: string,
    params?: {
      status?: 'attending' | 'maybe' | 'waitlisted'
      search?: string
      page?: number
      limit?: number
    }
  ): Promise<PaginatedResponse<User & { rsvpInfo: {
    status: 'attending' | 'maybe' | 'not_attending' | 'waitlisted'
    rsvpAt: string
    checkedIn?: boolean
  } }>> {
    return this.getPaginated<User & { rsvpInfo: {
      status: 'attending' | 'maybe' | 'not_attending' | 'waitlisted'
      rsvpAt: string
      checkedIn?: boolean
    } }>(`/events/${eventId}/attendees`, params, { cache: 30000 })
  }

  /**
   * Check in attendee
   */
  async checkInAttendee(eventId: string, userId?: string): Promise<ApiResponse<{ checkedIn: boolean }>> {
    return this.post<{ checkedIn: boolean }>(`/events/${eventId}/checkin`, userId ? { userId } : undefined)
  }

  /**
   * Invite user to event
   */
  async inviteToEvent(
    eventId: string,
    userId: string,
    message?: string
  ): Promise<ApiResponse<{ invitationId: string; status: 'sent' }>> {
    return this.post<{ invitationId: string; status: 'sent' }>(`/events/${eventId}/invite`, {
      userId,
      message
    })
  }

  /**
   * Get upcoming events for user
   */
  async getUserUpcomingEvents(userId?: string): Promise<ApiResponse<Event[]>> {
    const endpoint = userId ? `/users/${userId}/events/upcoming` : '/events/my-upcoming'
    return this.get<Event[]>(endpoint, undefined, { cache: 60000 })
  }

  // ============================================================================
  // Notification Management
  // ============================================================================

  /**
   * Get user notifications
   */
  async getNotifications(params?: {
    type?: NotificationType
    isRead?: boolean
    page?: number
    limit?: number
    sort?: 'newest' | 'oldest'
  }): Promise<PaginatedResponse<Notification>> {
    return this.getPaginated<Notification>('/notifications', params, { cache: 30000 })
  }

  /**
   * Get notification by ID
   */
  async getNotificationById(notificationId: string): Promise<ApiResponse<Notification>> {
    return this.get<Notification>(`/notifications/${notificationId}`)
  }

  /**
   * Mark notification as read
   */
  async markNotificationAsRead(notificationId: string): Promise<ApiResponse<Notification>> {
    return this.patch<Notification>(`/notifications/${notificationId}`, { isRead: true })
  }

  /**
   * Mark all notifications as read
   */
  async markAllNotificationsAsRead(): Promise<ApiResponse<{ markedCount: number }>> {
    return this.post<{ markedCount: number }>('/notifications/mark-all-read')
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/notifications/${notificationId}`)
  }

  /**
   * Get unread notifications count
   */
  async getUnreadNotificationsCount(): Promise<ApiResponse<{ count: number }>> {
    return this.get<{ count: number }>('/notifications/unread-count', undefined, { cache: 30000 })
  }

  /**
   * Update notification preferences
   */
  async updateNotificationPreferences(preferences: {
    email: boolean
    push: boolean
    mentions: boolean
    comments: boolean
    groups: boolean
    events: boolean
  }): Promise<ApiResponse<typeof preferences>> {
    return this.patch<typeof preferences>('/notifications/preferences', preferences)
  }

  /**
   * Get notification preferences
   */
  async getNotificationPreferences(): Promise<ApiResponse<{
    email: boolean
    push: boolean
    mentions: boolean
    comments: boolean
    groups: boolean
    events: boolean
  }>> {
    return this.get<{
      email: boolean
      push: boolean
      mentions: boolean
      comments: boolean
      groups: boolean
      events: boolean
    }>('/notifications/preferences', undefined, { cache: 300000 }) // 5min cache
  }

  // ============================================================================
  // Collaboration Features
  // ============================================================================

  /**
   * Get user's groups
   */
  async getUserGroups(
    userId?: string,
    params?: {
      role?: 'owner' | 'moderator' | 'member'
      status?: 'active' | 'pending'
      page?: number
      limit?: number
    }
  ): Promise<PaginatedResponse<Group & { membershipInfo: {
    role: 'owner' | 'moderator' | 'member'
    joinedAt: string
    status: 'active' | 'pending'
  } }>> {
    const endpoint = userId ? `/users/${userId}/groups` : '/groups/my-groups'
    return this.getPaginated<Group & { membershipInfo: {
      role: 'owner' | 'moderator' | 'member'
      joinedAt: string
      status: 'active' | 'pending'
    } }>(endpoint, params, { cache: 60000 })
  }

  /**
   * Get suggested groups for user
   */
  async getSuggestedGroups(limit = 10): Promise<ApiResponse<Array<Group & {
    suggestionReason: 'similar_interests' | 'mutual_friends' | 'popular' | 'location'
    matchScore: number
  }>>> {
    return this.get<Array<Group & {
      suggestionReason: 'similar_interests' | 'mutual_friends' | 'popular' | 'location'
      matchScore: number
    }>>('/groups/suggestions', { limit }, { cache: 300000 }) // 5min cache
  }

  /**
   * Follow user
   */
  async followUser(userId: string): Promise<ApiResponse<{ isFollowing: boolean }>> {
    return this.post<{ isFollowing: boolean }>(`/users/${userId}/follow`)
  }

  /**
   * Unfollow user
   */
  async unfollowUser(userId: string): Promise<ApiResponse<{ isFollowing: boolean }>> {
    return this.post<{ isFollowing: boolean }>(`/users/${userId}/unfollow`)
  }

  /**
   * Get user followers
   */
  async getUserFollowers(
    userId: string,
    params?: { page?: number; limit?: number }
  ): Promise<PaginatedResponse<User & { followedAt: string }>> {
    return this.getPaginated<User & { followedAt: string }>(`/users/${userId}/followers`, params, { cache: 60000 })
  }

  /**
   * Get user following
   */
  async getUserFollowing(
    userId: string,
    params?: { page?: number; limit?: number }
  ): Promise<PaginatedResponse<User & { followedAt: string }>> {
    return this.getPaginated<User & { followedAt: string }>(`/users/${userId}/following`, params, { cache: 60000 })
  }

  /**
   * Get activity feed for user's network
   */
  async getActivityFeed(params?: {
    type?: 'all' | 'posts' | 'events' | 'groups' | 'follows'
    timeframe?: '1h' | '24h' | '7d' | '30d'
    page?: number
    limit?: number
  }): Promise<PaginatedResponse<{
    id: string
    type: 'post_created' | 'event_created' | 'group_joined' | 'user_followed' | 'comment_added'
    actor: User
    target?: {
      id: string
      type: 'post' | 'event' | 'group' | 'user' | 'comment'
      title: string
      url: string
    }
    context?: Record<string, unknown>
    createdAt: string
  }>> {
    return this.getPaginated<{
      id: string
      type: 'post_created' | 'event_created' | 'group_joined' | 'user_followed' | 'comment_added'
      actor: User
      target?: {
        id: string
        type: 'post' | 'event' | 'group' | 'user' | 'comment'
        title: string
        url: string
      }
      context?: Record<string, unknown>
      createdAt: string
    }>('/activity', params, { cache: 30000 })
  }

  // ============================================================================
  // Discovery and Recommendations
  // ============================================================================

  /**
   * Get popular groups
   */
  async getPopularGroups(params?: {
    category?: string
    timeframe?: '7d' | '30d' | 'all'
    limit?: number
  }): Promise<ApiResponse<Array<Group & {
    popularity: {
      score: number
      membersGrowth: number
      activityLevel: 'low' | 'medium' | 'high'
    }
  }>>> {
    return this.get<Array<Group & {
      popularity: {
        score: number
        membersGrowth: number
        activityLevel: 'low' | 'medium' | 'high'
      }
    }>>('/groups/popular', params, { cache: 300000 })
  }

  /**
   * Get upcoming events feed
   */
  async getUpcomingEvents(params?: {
    location?: string
    radius?: number
    category?: string
    type?: Event['type']
    limit?: number
    includeFollowing?: boolean
  }): Promise<ApiResponse<Event[]>> {
    return this.get<Event[]>('/events/upcoming', params, { cache: 60000 })
  }

  /**
   * Get group categories
   */
  async getGroupCategories(): Promise<ApiResponse<Array<{
    id: string
    name: string
    slug: string
    description: string
    groupsCount: number
    isPopular: boolean
  }>>> {
    return this.get<Array<{
      id: string
      name: string
      slug: string
      description: string
      groupsCount: number
      isPopular: boolean
    }>>('/groups/categories', undefined, { cache: 600000 }) // 10min cache
  }
}