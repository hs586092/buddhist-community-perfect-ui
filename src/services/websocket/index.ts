/**
 * WebSocket Service - Complete Real-Time Communication Solution
 * 
 * Features:
 * - Robust connection management with auto-reconnection
 * - JWT authentication with token refresh
 * - Room-based messaging and event subscription
 * - Heartbeat monitoring and health tracking
 * - Message queuing for offline scenarios
 * - React hooks for seamless integration
 * - Performance optimization and metrics
 * - Comprehensive error handling
 * 
 * Usage Example:
 * ```typescript
 * import { useWebSocket, useChat } from '@/services/websocket'
 * 
 * function ChatComponent() {
 *   const websocket = useWebSocket({
 *     url: 'localhost',
 *     port: 3000,
 *     authToken: 'your-jwt-token',
 *     enableLogging: true
 *   })
 * 
 *   const chat = useChat(websocket, 'room-id')
 * 
 *   return (
 *     <div>
 *       {chat.messages.map(msg => (
 *         <div key={msg.id}>{msg.data.content}</div>
 *       ))}
 *     </div>
 *   )
 * }
 * ```
 */

// Core client and types
export { WebSocketClient } from './client'
export * from './types'

// React hooks
export {
  useWebSocket,
  useChat,
  usePresence,
  useNotifications,
  useEvents
} from './hooks'

// Convenience factory for creating client instances
export function createWebSocketClient(config: import('./types').WebSocketConfig) {
  const { WebSocketClient } = require('./client')
  return new WebSocketClient(config)
}

// Default configuration factory
export function createDefaultConfig(overrides: Partial<import('./types').WebSocketConfig> = {}): import('./types').WebSocketConfig {
  return {
    url: 'localhost',
    port: 3000,
    reconnectInterval: 5000,
    maxReconnectAttempts: 10,
    heartbeatInterval: 30000,
    connectionTimeout: 10000,
    messageQueueSize: 1000,
    enableLogging: process.env.NODE_ENV === 'development',
    autoReconnect: true,
    ...overrides
  }
}

// Utility functions
export const WebSocketUtils = {
  /**
   * Generate a room ID for private conversations
   */
  generatePrivateRoomId: (userId1: string, userId2: string): string => {
    const sortedIds = [userId1, userId2].sort()
    return `private_${sortedIds.join('_')}`
  },

  /**
   * Generate a group room ID
   */
  generateGroupRoomId: (groupName: string): string => {
    return `group_${groupName.toLowerCase().replace(/\s+/g, '_')}`
  },

  /**
   * Validate message content
   */
  validateMessage: (content: string): boolean => {
    return content.trim().length > 0 && content.length <= 4000
  },

  /**
   * Format timestamp for display
   */
  formatTimestamp: (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString()
  },

  /**
   * Check if user has required permissions for room
   */
  hasRoomPermission: (
    room: import('./types').Room, 
    userId: string, 
    action: 'read' | 'write' | 'invite' | 'manage'
  ): boolean => {
    if (!room.members.includes(userId)) return false
    
    const permissions = room.permissions
    if (!permissions) return true // Default to allow if no permissions set
    
    switch (action) {
      case 'read':
        return permissions.canRead
      case 'write':
        return permissions.canWrite
      case 'invite':
        return permissions.canInvite
      case 'manage':
        return permissions.canManage
      default:
        return false
    }
  },

  /**
   * Calculate connection health score (0-100)
   */
  calculateHealthScore: (metrics: import('./types').PerformanceMetrics): number => {
    const latencyScore = Math.max(0, 100 - (metrics.averageLatency / 10)) // 1000ms = 0 score
    const errorScore = Math.max(0, 100 - (metrics.errorCount * 5)) // Each error -5 points
    const reconnectScore = Math.max(0, 100 - (metrics.reconnectionCount * 10)) // Each reconnect -10 points
    
    return Math.round((latencyScore + errorScore + reconnectScore) / 3)
  }
}

// Development helpers
export const DevHelpers = {
  /**
   * Create mock message for testing
   */
  createMockMessage: (overrides: Partial<import('./types').BaseMessage> = {}): import('./types').BaseMessage => {
    const { MessageType } = require('./types')
    return {
      id: `mock_${Date.now()}`,
      type: MessageType.CHAT_MESSAGE,
      timestamp: Date.now(),
      userId: 'mock-user',
      data: { content: 'Mock message content' },
      ...overrides
    }
  },

  /**
   * Create mock connection info for testing
   */
  createMockConnectionInfo: (): import('./types').ConnectionInfo => {
    const { WebSocketState } = require('./types')
    return {
      state: WebSocketState.CONNECTED,
      connectedAt: new Date(),
      lastPingTime: new Date(),
      lastPongTime: new Date(),
      reconnectAttempts: 0,
      latency: 50,
      isAuthenticated: true,
      userId: 'mock-user-id'
    }
  },

  /**
   * Log WebSocket events for debugging
   */
  createDebugLogger: () => ({
    onConnect: (info: import('./types').ConnectionInfo) => 
      console.log('🔗 WebSocket Connected:', info),
    onDisconnect: (info: import('./types').ConnectionInfo) => 
      console.log('❌ WebSocket Disconnected:', info),
    onError: (error: Error, context?: string) => 
      console.error('⚠️ WebSocket Error:', { error, context }),
    onStateChange: (newState: import('./types').WebSocketState, oldState: import('./types').WebSocketState) => 
      console.log('🔄 State Change:', { from: oldState, to: newState }),
    onMessage: (message: import('./types').WebSocketMessage) => 
      console.log('📨 Message Received:', message)
  })
}