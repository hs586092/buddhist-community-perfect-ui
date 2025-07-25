# WebSocket Client - Real-Time Communication System

A comprehensive, production-ready WebSocket client for React applications with robust connection management, real-time features, and seamless integration.

## 🚀 Features

### Core Functionality
- **Robust Connection Management** - Auto-reconnection with exponential backoff
- **JWT Authentication** - Secure token-based authentication with refresh support
- **Room-Based Messaging** - Organized communication channels
- **Event Subscription System** - Type-safe event handling
- **Message Queuing** - Offline message persistence and delivery
- **Heartbeat Monitoring** - Connection health tracking
- **Performance Metrics** - Real-time connection statistics

### Real-Time Features
- **Live Chat & Messaging** - Instant communication with typing indicators
- **Event Updates** - Real-time event notifications and reminders
- **User Presence** - Online status and activity tracking
- **Notifications** - System alerts and user notifications
- **Collaborative Features** - Multi-user real-time editing support

### React Integration
- **Custom Hooks** - Purpose-built hooks for different features
- **Provider Pattern** - Application-level connection management  
- **TypeScript Support** - Full type safety and IntelliSense
- **Development Tools** - Built-in debugging and monitoring

## 📦 Installation & Setup

### 1. Environment Configuration

Add WebSocket configuration to your `.env` file:

```env
REACT_APP_WS_URL=localhost
REACT_APP_WS_PORT=3000
```

### 2. Provider Setup

Wrap your application with the WebSocket provider:

```tsx
// App.tsx
import { WebSocketProvider } from '@/providers/WebSocketProvider'

function App() {
  return (
    <WebSocketProvider
      authToken="your-jwt-token"
      userId="current-user-id"
      enableDevMode={process.env.NODE_ENV === 'development'}
    >
      <YourAppContent />
    </WebSocketProvider>
  )
}
```

### 3. Basic Usage

```tsx
// components/Chat.tsx
import { useWebSocketContext, useChat } from '@/services/websocket'

function ChatComponent() {
  const { websocket } = useWebSocketContext()
  const chat = useChat(websocket, 'room-id')

  const sendMessage = () => {
    chat.sendMessage('Hello, World!')
  }

  return (
    <div>
      {chat.messages.map(msg => (
        <div key={msg.id}>{msg.data.content}</div>
      ))}
      <button onClick={sendMessage}>Send Message</button>
    </div>
  )
}
```

## 🎯 Core API

### WebSocket Client

```typescript
import { WebSocketClient, createDefaultConfig } from '@/services/websocket'

const client = new WebSocketClient(createDefaultConfig({
  url: 'localhost',
  port: 3000,
  authToken: 'your-jwt-token',
  enableLogging: true,
  autoReconnect: true
}))

// Connection management
await client.connect()
client.disconnect()
await client.reconnect()

// Messaging
await client.sendMessage({
  type: MessageType.CHAT_MESSAGE,
  room: 'room-id',
  data: { content: 'Hello' }
})

// Room management
await client.joinRoom('room-id')
await client.leaveRoom('room-id')

// Event subscription
const subscriptionId = client.subscribe(
  MessageType.CHAT_MESSAGE,
  (message) => console.log('Received:', message),
  'room-id'
)
client.unsubscribe(subscriptionId)
```

### React Hooks

#### useWebSocket

Main hook for WebSocket functionality:

```typescript
const websocket = useWebSocket(config, {
  autoConnect: true,
  onConnect: (info) => console.log('Connected:', info),
  onDisconnect: (info) => console.log('Disconnected:', info),
  onError: (error) => console.error('Error:', error)
})

// Connection state
const isConnected = websocket.isConnected
const connectionState = websocket.connectionState

// Messaging
await websocket.sendMessage({ type: MessageType.CHAT_MESSAGE, data: { content: 'Hi' } })
await websocket.sendChatMessage('Hello', 'room-id')
await websocket.sendDirectMessage('Private message', 'user-id')

// Room management
await websocket.joinRoom('room-id')
await websocket.leaveRoom('room-id')
const rooms = websocket.getRooms()
```

#### useChat

Hook for chat functionality:

```typescript
const chat = useChat(websocket, 'room-id', {
  maxMessages: 100,
  enableTypingIndicators: true,
  typingTimeout: 3000
})

// Messages
const messages = chat.messages
await chat.sendMessage('Hello everyone!')
chat.markAsRead('message-id')

// Typing indicators
chat.startTyping()
chat.stopTyping()
const typingUsers = chat.typingUsers
```

#### usePresence

Hook for user presence tracking:

```typescript
const presence = usePresence(websocket)

// User status
const onlineUsers = presence.onlineUsers
const userStatuses = presence.userStatuses

// Status management
presence.setStatus('away')
presence.setCustomStatus('In a meeting')

// Subscriptions
presence.subscribeToUser('user-id')
presence.unsubscribeFromUser('user-id')
```

#### useNotifications

Hook for notifications:

```typescript
const notifications = useNotifications(websocket, {
  maxNotifications: 50,
  autoMarkRead: false
})

// Notifications
const allNotifications = notifications.notifications
const unreadCount = notifications.unreadCount

// Actions
notifications.markAsRead('notification-id')
notifications.markAllAsRead()
notifications.dismiss('notification-id')
notifications.clearAll()
```

#### useEvents

Hook for event updates:

```typescript
const events = useEvents(websocket)

// Events
const upcomingEvents = events.upcomingEvents
const event = events.getEventById('event-id')

// Subscriptions
events.subscribeToEvents()
events.unsubscribeFromEvents()
```

## 🔧 Configuration

### WebSocket Configuration

```typescript
interface WebSocketConfig {
  url: string                    // WebSocket server URL
  port?: number                 // Server port (default: 3000)
  protocols?: string[]          // WebSocket protocols
  reconnectInterval?: number    // Reconnection delay (default: 5000ms)
  maxReconnectAttempts?: number // Max reconnection attempts (default: 10)
  heartbeatInterval?: number    // Heartbeat interval (default: 30000ms)
  connectionTimeout?: number    // Connection timeout (default: 10000ms)
  messageQueueSize?: number     // Max queued messages (default: 1000)
  enableLogging?: boolean       // Enable debug logging
  authToken?: string           // JWT authentication token
  autoReconnect?: boolean      // Enable auto-reconnection (default: true)
}
```

### Default Configuration

```typescript
import { createDefaultConfig } from '@/services/websocket'

const config = createDefaultConfig({
  url: 'localhost',
  port: 3000,
  enableLogging: process.env.NODE_ENV === 'development',
  // ... other overrides
})
```

## 📨 Message Types

### Core Message Types

```typescript
enum MessageType {
  // Connection
  PING = 'ping',
  PONG = 'pong',
  AUTH = 'auth',
  
  // Chat
  CHAT_MESSAGE = 'chat_message',
  DIRECT_MESSAGE = 'direct_message',
  TYPING_START = 'typing_start',
  TYPING_STOP = 'typing_stop',
  
  // Events
  EVENT_UPDATE = 'event_update',
  NOTIFICATION = 'notification',
  
  // Presence
  USER_ONLINE = 'user_online',
  USER_OFFLINE = 'user_offline',
  PRESENCE_UPDATE = 'presence_update',
  
  // System
  SYSTEM_ALERT = 'system_alert',
  ERROR = 'error'
}
```

### Message Structure

```typescript
interface BaseMessage {
  id: string
  type: MessageType
  timestamp: number
  userId?: string
  room?: string
  data?: any
}

interface ChatMessage extends BaseMessage {
  type: MessageType.CHAT_MESSAGE
  data: {
    content: string
    replyTo?: string
    mentions?: string[]
    attachments?: Attachment[]
  }
}
```

## 🛡️ Error Handling

### Error Types

```typescript
enum WebSocketErrorCode {
  CONNECTION_FAILED = 'CONNECTION_FAILED',
  AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  RATE_LIMITED = 'RATE_LIMITED',
  SERVER_ERROR = 'SERVER_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT'
}
```

### Error Handling

```typescript
const websocket = useWebSocket(config, {
  onError: (error: WebSocketError, context?: string) => {
    console.error(`WebSocket error in ${context}:`, error)
    
    switch (error.code) {
      case WebSocketErrorCode.AUTHENTICATION_FAILED:
        // Refresh token or redirect to login
        break
      case WebSocketErrorCode.RATE_LIMITED:
        // Implement backoff strategy
        break
      default:
        // Generic error handling
    }
  }
})
```

## 📊 Performance & Monitoring

### Performance Metrics

```typescript
const metrics = websocket.getPerformanceMetrics()

interface PerformanceMetrics {
  messagesReceived: number
  messagesSent: number
  averageLatency: number
  connectionUptime: number
  reconnectionCount: number
  errorCount: number
  lastUpdate: Date
}
```

### Health Monitoring

```typescript
import { WebSocketUtils } from '@/services/websocket'

const healthScore = WebSocketUtils.calculateHealthScore(metrics)
// Returns 0-100 health score based on latency, errors, and reconnections
```

### Connection Health

```typescript
const connectionInfo = websocket.getConnectionInfo()

interface ConnectionInfo {
  state: WebSocketState
  connectedAt?: Date
  lastPingTime?: Date
  lastPongTime?: Date
  reconnectAttempts: number
  latency?: number
  isAuthenticated: boolean
  userId?: string
}
```

## 🔒 Security Features

### JWT Authentication

```typescript
// Automatic authentication with token
const websocket = useWebSocket({
  url: 'localhost',
  authToken: 'your-jwt-token'
})

// Manual authentication
await client.authenticate('new-token')
```

### Message Validation

```typescript
import { WebSocketUtils } from '@/services/websocket'

// Validate message content
const isValid = WebSocketUtils.validateMessage(content)

// Check room permissions
const canWrite = WebSocketUtils.hasRoomPermission(room, userId, 'write')
```

## 🛠️ Development Tools

### Debug Mode

Enable development tools by setting `enableDevMode: true`:

```tsx
<WebSocketProvider enableDevMode={true}>
  <App />
</WebSocketProvider>
```

Features:
- Real-time connection monitoring
- Message inspection
- Performance metrics
- Manual connection controls
- Test message sending

### Utilities

```typescript
import { WebSocketUtils, DevHelpers } from '@/services/websocket'

// Create mock data for testing
const mockMessage = DevHelpers.createMockMessage()
const mockConnection = DevHelpers.createMockConnectionInfo()

// Debug logging
const logger = DevHelpers.createDebugLogger()

// Utility functions
const roomId = WebSocketUtils.generatePrivateRoomId('user1', 'user2')
const healthScore = WebSocketUtils.calculateHealthScore(metrics)
```

## 📋 Example Components

The system includes complete example components demonstrating real-world usage:

- **ChatExample** - Full-featured chat interface with typing indicators
- **NotificationsExample** - Real-time notification center
- **PresenceExample** - User status and activity tracking
- **EventsExample** - Live event updates and reminders

## 🚀 Production Deployment

### Environment Variables

```env
# Production WebSocket server
REACT_APP_WS_URL=wss://your-domain.com
REACT_APP_WS_PORT=443

# Security
REACT_APP_WS_PROTOCOLS=["v1.api.your-domain.com"]

# Performance
REACT_APP_WS_RECONNECT_INTERVAL=10000
REACT_APP_WS_MAX_RECONNECT_ATTEMPTS=5
REACT_APP_WS_HEARTBEAT_INTERVAL=60000
```

### Performance Optimization

1. **Message Batching** - Group related messages for efficient transmission
2. **Connection Pooling** - Reuse connections across components
3. **Automatic Compression** - Built-in message compression for large payloads
4. **Memory Management** - Automatic cleanup of old messages and subscriptions
5. **Offline Support** - Message queuing and synchronization

### Monitoring

```typescript
// Monitor connection health
useEffect(() => {
  const interval = setInterval(() => {
    const health = WebSocketUtils.calculateHealthScore(websocket.getPerformanceMetrics())
    if (health < 50) {
      console.warn('Poor WebSocket connection health:', health)
    }
  }, 30000)
  
  return () => clearInterval(interval)
}, [websocket])
```

## 🤝 Contributing

This WebSocket client is designed to be extensible and maintainable. Key architectural decisions:

- **Backend Persona Reliability** - Prioritizes connection reliability and data integrity
- **Type Safety** - Comprehensive TypeScript coverage for all APIs
- **Error Recovery** - Graceful degradation and automatic recovery
- **Performance** - Optimized for high-frequency real-time updates
- **Testing** - Built-in development tools and mock data generators

For bug reports and feature requests, please follow the existing patterns and maintain the reliability-first approach.