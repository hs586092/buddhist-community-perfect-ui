/**
 * WebSocket Client Types and Interfaces
 * Comprehensive type definitions for real-time communication
 */

// Connection states
export enum WebSocketState {
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  RECONNECTING = 'reconnecting',
  ERROR = 'error',
  CLOSED = 'closed'
}

// WebSocket configuration
export interface WebSocketConfig {
  url: string
  port?: number
  protocols?: string[]
  reconnectInterval?: number
  maxReconnectAttempts?: number
  heartbeatInterval?: number
  connectionTimeout?: number
  messageQueueSize?: number
  enableLogging?: boolean
  authToken?: string
  autoReconnect?: boolean
}

// Connection info and health
export interface ConnectionInfo {
  state: WebSocketState
  connectedAt?: Date
  lastPingTime?: Date
  lastPongTime?: Date
  reconnectAttempts: number
  latency?: number
  isAuthenticated: boolean
  userId?: string
}

// Message types and structures
export enum MessageType {
  // Connection management
  PING = 'ping',
  PONG = 'pong',
  AUTH = 'auth',
  AUTH_SUCCESS = 'auth_success',
  AUTH_FAILURE = 'auth_failure',
  
  // Room management
  JOIN_ROOM = 'join_room',
  LEAVE_ROOM = 'leave_room',
  ROOM_JOINED = 'room_joined',
  ROOM_LEFT = 'room_left',
  
  // Chat and messaging
  CHAT_MESSAGE = 'chat_message',
  DIRECT_MESSAGE = 'direct_message',
  MESSAGE_DELIVERED = 'message_delivered',
  MESSAGE_READ = 'message_read',
  TYPING_START = 'typing_start',
  TYPING_STOP = 'typing_stop',
  
  // Events and notifications
  EVENT_UPDATE = 'event_update',
  EVENT_REMINDER = 'event_reminder',
  NOTIFICATION = 'notification',
  ANNOUNCEMENT = 'announcement',
  
  // User presence
  USER_ONLINE = 'user_online',
  USER_OFFLINE = 'user_offline',
  USER_STATUS_CHANGE = 'user_status_change',
  PRESENCE_UPDATE = 'presence_update',
  
  // Collaborative features
  DOCUMENT_EDIT = 'document_edit',
  CURSOR_POSITION = 'cursor_position',
  SELECTION_CHANGE = 'selection_change',
  
  // System messages
  SYSTEM_ALERT = 'system_alert',
  SERVER_MAINTENANCE = 'server_maintenance',
  ERROR = 'error'
}

// Base message structure
export interface BaseMessage {
  id: string
  type: MessageType
  timestamp: number
  userId?: string
  room?: string
  data?: any
}

// Specific message payloads
export interface ChatMessage extends BaseMessage {
  type: MessageType.CHAT_MESSAGE
  data: {
    content: string
    replyTo?: string
    mentions?: string[]
    attachments?: Array<{
      id: string
      type: 'image' | 'file' | 'link'
      url: string
      name: string
      size?: number
    }>
  }
}

export interface DirectMessage extends BaseMessage {
  type: MessageType.DIRECT_MESSAGE
  data: {
    content: string
    recipientId: string
    encrypted?: boolean
  }
}

export interface EventUpdate extends BaseMessage {
  type: MessageType.EVENT_UPDATE
  data: {
    eventId: string
    action: 'created' | 'updated' | 'cancelled' | 'reminder'
    eventData: {
      title: string
      startDate: string
      endDate?: string
      location?: string
      description?: string
      attendees?: string[]
    }
  }
}

export interface NotificationMessage extends BaseMessage {
  type: MessageType.NOTIFICATION
  data: {
    title: string
    body: string
    category: 'info' | 'warning' | 'error' | 'success'
    actionUrl?: string
    dismissible: boolean
    persistent: boolean
    read?: boolean
  }
}

export interface PresenceUpdate extends BaseMessage {
  type: MessageType.PRESENCE_UPDATE
  data: {
    userId: string
    status: 'online' | 'offline' | 'away' | 'busy'
    lastSeen?: string
    customStatus?: string
  }
}

export interface TypingIndicator extends BaseMessage {
  type: MessageType.TYPING_START | MessageType.TYPING_STOP
  data: {
    userId: string
    userName: string
  }
}

export interface SystemAlert extends BaseMessage {
  type: MessageType.SYSTEM_ALERT
  data: {
    severity: 'low' | 'medium' | 'high' | 'critical'
    title: string
    message: string
    actionRequired?: boolean
    maintenanceMode?: boolean
  }
}

// Union type for all message types
export type WebSocketMessage = 
  | ChatMessage 
  | DirectMessage 
  | EventUpdate 
  | NotificationMessage 
  | PresenceUpdate 
  | TypingIndicator 
  | SystemAlert 
  | BaseMessage

// Event handlers and callbacks
export type MessageHandler<T = WebSocketMessage> = (message: T) => void
export type ErrorHandler = (error: Error, context?: string) => void
export type StateChangeHandler = (newState: WebSocketState, oldState: WebSocketState) => void
export type ConnectionHandler = (connectionInfo: ConnectionInfo) => void

// Event subscription system
export interface EventSubscription {
  id: string
  type: MessageType | MessageType[]
  room?: string
  handler: MessageHandler
  once?: boolean
}

export interface RoomSubscription {
  roomId: string
  joinedAt: Date
  messageTypes: MessageType[]
  isActive: boolean
}

// Message queue for offline scenarios
export interface QueuedMessage {
  id: string
  message: Partial<BaseMessage>
  attempts: number
  queuedAt: Date
  priority: 'low' | 'normal' | 'high' | 'urgent'
  maxAttempts: number
}

// Performance monitoring
export interface PerformanceMetrics {
  messagesReceived: number
  messagesSent: number
  averageLatency: number
  connectionUptime: number
  reconnectionCount: number
  errorCount: number
  lastUpdate: Date
}

// Authentication
export interface AuthPayload {
  token: string
  refreshToken?: string
  userId?: string
  permissions?: string[]
}

export interface AuthResponse {
  success: boolean
  userId?: string
  permissions?: string[]
  sessionId?: string
  error?: string
}

// Room management
export interface Room {
  id: string
  name: string
  type: 'public' | 'private' | 'direct'
  members: string[]
  metadata?: Record<string, any>
  permissions?: {
    canRead: boolean
    canWrite: boolean
    canInvite: boolean
    canManage: boolean
  }
}

// Error types
export enum WebSocketErrorCode {
  CONNECTION_FAILED = 'CONNECTION_FAILED',
  AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  RATE_LIMITED = 'RATE_LIMITED',
  SERVER_ERROR = 'SERVER_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  INVALID_MESSAGE = 'INVALID_MESSAGE',
  ROOM_ACCESS_DENIED = 'ROOM_ACCESS_DENIED',
  USER_NOT_FOUND = 'USER_NOT_FOUND'
}

export interface WebSocketError extends Error {
  code: WebSocketErrorCode
  context?: string
  retry?: boolean
  timestamp: Date
}

// Client configuration and options
export interface WebSocketClientOptions {
  config: WebSocketConfig
  onConnect?: ConnectionHandler
  onDisconnect?: ConnectionHandler
  onError?: ErrorHandler
  onStateChange?: StateChangeHandler
  onMessage?: MessageHandler
  enablePerformanceMetrics?: boolean
  enableMessageQueue?: boolean
  customLogger?: (level: 'debug' | 'info' | 'warn' | 'error', message: string, data?: any) => void
}

// Hook return types for React integration
export interface UseWebSocketReturn {
  // Connection state
  connectionState: WebSocketState
  connectionInfo: ConnectionInfo
  isConnected: boolean
  isConnecting: boolean
  
  // Core functionality
  connect: () => Promise<void>
  disconnect: () => void
  reconnect: () => Promise<void>
  
  // Messaging
  sendMessage: (message: Partial<BaseMessage>) => Promise<boolean>
  sendChatMessage: (content: string, room?: string) => Promise<boolean>
  sendDirectMessage: (content: string, recipientId: string) => Promise<boolean>
  
  // Room management
  joinRoom: (roomId: string) => Promise<boolean>
  leaveRoom: (roomId: string) => Promise<boolean>
  getRooms: () => RoomSubscription[]
  
  // Event handling
  subscribe: (type: MessageType | MessageType[], handler: MessageHandler, room?: string) => string
  unsubscribe: (subscriptionId: string) => boolean
  
  // Utilities
  getPerformanceMetrics: () => PerformanceMetrics
  clearMessageQueue: () => void
  getQueuedMessages: () => QueuedMessage[]
}

// Specific hooks for different features
export interface UseChatReturn {
  messages: ChatMessage[]
  sendMessage: (content: string, replyTo?: string) => Promise<boolean>
  markAsRead: (messageId: string) => void
  deleteMessage: (messageId: string) => Promise<boolean>
  editMessage: (messageId: string, newContent: string) => Promise<boolean>
  startTyping: () => void
  stopTyping: () => void
  typingUsers: Array<{ userId: string; userName: string }>
}

export interface UsePresenceReturn {
  onlineUsers: string[]
  userStatuses: Record<string, 'online' | 'offline' | 'away' | 'busy'>
  setStatus: (status: 'online' | 'away' | 'busy') => void
  setCustomStatus: (customStatus: string) => void
  subscribeToUser: (userId: string) => void
  unsubscribeFromUser: (userId: string) => void
}

export interface UseNotificationsReturn {
  notifications: NotificationMessage[]
  unreadCount: number
  markAsRead: (notificationId: string) => void
  markAllAsRead: () => void
  dismiss: (notificationId: string) => void
  clearAll: () => void
}

export interface UseEventsReturn {
  upcomingEvents: EventUpdate[]
  subscribeToEvents: () => void
  unsubscribeFromEvents: () => void
  getEventById: (eventId: string) => EventUpdate | undefined
}