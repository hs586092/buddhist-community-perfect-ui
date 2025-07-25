/**
 * React Hooks for WebSocket Integration
 * Seamless integration with React components and state management
 */

import { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import { WebSocketClient } from './client'
import { WebSocketState } from './types'
import type {
  WebSocketConfig,
  ConnectionInfo,
  BaseMessage,
  ChatMessage,
  DirectMessage,
  NotificationMessage,
  PresenceUpdate,
  EventUpdate,
  TypingIndicator,
  RoomSubscription,
  QueuedMessage,
  PerformanceMetrics,
  UseWebSocketReturn,
  UseChatReturn,
  UsePresenceReturn,
  UseNotificationsReturn,
  UseEventsReturn,
  MessageHandler,
  ErrorHandler,
  StateChangeHandler,
  ConnectionHandler
} from './types'
import { MessageType } from './types'

/**
 * Main WebSocket hook
 * Provides core WebSocket functionality with React integration
 */
export function useWebSocket(
  config: WebSocketConfig,
  options: {
    onConnect?: ConnectionHandler
    onDisconnect?: ConnectionHandler
    onError?: ErrorHandler
    onStateChange?: StateChangeHandler
    onMessage?: MessageHandler
    autoConnect?: boolean
  } = {}
): UseWebSocketReturn {
  const { autoConnect = true, ...handlers } = options
  
  // Client instance ref
  const clientRef = useRef<WebSocketClient | null>(null)
  
  // State management
  const [connectionState, setConnectionState] = useState<WebSocketState>(WebSocketState.DISCONNECTED)
  const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo>({
    state: WebSocketState.DISCONNECTED,
    reconnectAttempts: 0,
    isAuthenticated: false
  })

  // Initialize client
  useEffect(() => {
    if (!clientRef.current) {
      clientRef.current = new WebSocketClient(config)
      
      // Set up event handlers
      clientRef.current.setEventHandlers({
        onConnect: (info) => {
          setConnectionInfo(info)
          setConnectionState(info.state)
          handlers.onConnect?.(info)
        },
        onDisconnect: (info) => {
          setConnectionInfo(info)
          setConnectionState(info.state)
          handlers.onDisconnect?.(info)
        },
        onError: (error, context) => {
          handlers.onError?.(error, context)
        },
        onStateChange: (newState, oldState) => {
          setConnectionState(newState)
          handlers.onStateChange?.(newState, oldState)
        },
        ...(handlers.onMessage ? { onMessage: handlers.onMessage } : {})
      })
    }

    return () => {
      if (clientRef.current) {
        clientRef.current.disconnect()
        clientRef.current = null
      }
    }
  }, [config.url, config.port])

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect && clientRef.current && connectionState === WebSocketState.DISCONNECTED) {
      clientRef.current.connect().catch(console.error)
    }
  }, [autoConnect])

  // Connection management functions
  const connect = useCallback(async () => {
    if (clientRef.current) {
      await clientRef.current.connect()
    }
  }, [])

  const disconnect = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.disconnect()
    }
  }, [])

  const reconnect = useCallback(async () => {
    if (clientRef.current) {
      await clientRef.current.reconnect()
    }
  }, [])

  // Messaging functions
  const sendMessage = useCallback(async (message: Partial<BaseMessage>): Promise<boolean> => {
    if (clientRef.current) {
      return await clientRef.current.sendMessage(message)
    }
    return false
  }, [])

  const sendChatMessage = useCallback(async (content: string, room?: string): Promise<boolean> => {
    return await sendMessage({
      type: MessageType.CHAT_MESSAGE,
      ...(room ? { room } : {}),
      data: { content }
    })
  }, [sendMessage])

  const sendDirectMessage = useCallback(async (content: string, recipientId: string): Promise<boolean> => {
    return await sendMessage({
      type: MessageType.DIRECT_MESSAGE,
      data: { content, recipientId }
    })
  }, [sendMessage])

  // Room management
  const joinRoom = useCallback(async (roomId: string): Promise<boolean> => {
    if (clientRef.current) {
      return await clientRef.current.joinRoom(roomId)
    }
    return false
  }, [])

  const leaveRoom = useCallback(async (roomId: string): Promise<boolean> => {
    if (clientRef.current) {
      return await clientRef.current.leaveRoom(roomId)
    }
    return false
  }, [])

  const getRooms = useCallback((): RoomSubscription[] => {
    if (clientRef.current) {
      return clientRef.current.getRooms()
    }
    return []
  }, [])

  // Event subscription
  const subscribe = useCallback((
    type: MessageType | MessageType[],
    handler: MessageHandler,
    room?: string
  ): string => {
    if (clientRef.current) {
      return clientRef.current.subscribe(type, handler, room)
    }
    return ''
  }, [])

  const unsubscribe = useCallback((subscriptionId: string): boolean => {
    if (clientRef.current) {
      return clientRef.current.unsubscribe(subscriptionId)
    }
    return false
  }, [])

  // Utility functions
  const getPerformanceMetrics = useCallback((): PerformanceMetrics => {
    if (clientRef.current) {
      return clientRef.current.getPerformanceMetrics()
    }
    return {
      messagesReceived: 0,
      messagesSent: 0,
      averageLatency: 0,
      connectionUptime: 0,
      reconnectionCount: 0,
      errorCount: 0,
      lastUpdate: new Date()
    }
  }, [])

  const clearMessageQueue = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.clearMessageQueue()
    }
  }, [])

  const getQueuedMessages = useCallback((): QueuedMessage[] => {
    if (clientRef.current) {
      return clientRef.current.getQueuedMessages()
    }
    return []
  }, [])

  // Computed values
  const isConnected = useMemo(() => connectionState === WebSocketState.CONNECTED, [connectionState])
  const isConnecting = useMemo(() => connectionState === WebSocketState.CONNECTING, [connectionState])

  return {
    connectionState,
    connectionInfo,
    isConnected,
    isConnecting,
    connect,
    disconnect,
    reconnect,
    sendMessage,
    sendChatMessage,
    sendDirectMessage,
    joinRoom,
    leaveRoom,
    getRooms,
    subscribe,
    unsubscribe,
    getPerformanceMetrics,
    clearMessageQueue,
    getQueuedMessages
  }
}

/**
 * Chat hook for messaging functionality
 */
export function useChat(
  websocket: UseWebSocketReturn,
  roomId?: string,
  options: {
    maxMessages?: number
    enableTypingIndicators?: boolean
    typingTimeout?: number
  } = {}
): UseChatReturn {
  const { maxMessages = 100, enableTypingIndicators = true, typingTimeout = 3000 } = options
  
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [typingUsers, setTypingUsers] = useState<Array<{ userId: string; userName: string }>>([])
  
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastTypingTimeRef = useRef<number>(0)

  // Subscribe to chat messages
  useEffect(() => {
    const subscriptionId = websocket.subscribe(
      MessageType.CHAT_MESSAGE,
      (message) => {
        const chatMessage = message as ChatMessage
        setMessages(prev => {
          const newMessages = [...prev, chatMessage]
          return newMessages.slice(-maxMessages) // Keep only recent messages
        })
      },
      roomId
    )

    return () => {
      websocket.unsubscribe(subscriptionId)
    }
  }, [websocket, roomId, maxMessages])

  // Subscribe to typing indicators
  useEffect(() => {
    if (!enableTypingIndicators) return

    const startSubscription = websocket.subscribe(
      MessageType.TYPING_START,
      (message) => {
        const typingMessage = message as TypingIndicator
        if (typingMessage.data.userId !== websocket.connectionInfo.userId) {
          setTypingUsers(prev => {
            const exists = prev.some(user => user.userId === typingMessage.data.userId)
            if (!exists) {
              return [...prev, { userId: typingMessage.data.userId, userName: typingMessage.data.userName }]
            }
            return prev
          })
        }
      },
      roomId
    )

    const stopSubscription = websocket.subscribe(
      MessageType.TYPING_STOP,
      (message) => {
        const typingMessage = message as TypingIndicator
        setTypingUsers(prev => prev.filter(user => user.userId !== typingMessage.data.userId))
      },
      roomId
    )

    return () => {
      websocket.unsubscribe(startSubscription)
      websocket.unsubscribe(stopSubscription)
    }
  }, [websocket, roomId, enableTypingIndicators])

  // Send chat message
  const sendMessage = useCallback(async (content: string, replyTo?: string): Promise<boolean> => {
    return await websocket.sendMessage({
      type: MessageType.CHAT_MESSAGE,
      ...(roomId ? { room: roomId } : {}),
      data: { content, replyTo }
    })
  }, [websocket, roomId])

  // Mark message as read
  const markAsRead = useCallback((messageId: string) => {
    websocket.sendMessage({
      type: MessageType.MESSAGE_READ,
      ...(roomId ? { room: roomId } : {}),
      data: { messageId }
    })
  }, [websocket, roomId])

  // Delete message
  const deleteMessage = useCallback(async (messageId: string): Promise<boolean> => {
    // Implementation depends on server support
    return await websocket.sendMessage({
      type: MessageType.CHAT_MESSAGE, // Would be MESSAGE_DELETE in real implementation
      ...(roomId ? { room: roomId } : {}),
      data: { action: 'delete', messageId }
    })
  }, [websocket, roomId])

  // Edit message
  const editMessage = useCallback(async (messageId: string, newContent: string): Promise<boolean> => {
    // Implementation depends on server support
    return await websocket.sendMessage({
      type: MessageType.CHAT_MESSAGE, // Would be MESSAGE_EDIT in real implementation
      ...(roomId ? { room: roomId } : {}),
      data: { action: 'edit', messageId, content: newContent }
    })
  }, [websocket, roomId])

  // Typing indicators
  const startTyping = useCallback(() => {
    if (!enableTypingIndicators) return
    
    const now = Date.now()
    lastTypingTimeRef.current = now
    
    websocket.sendMessage({
      type: MessageType.TYPING_START,
      room: roomId || '',
      data: { userId: websocket.connectionInfo.userId || '', userName: 'Current User' }
    })

    // Auto-stop typing after timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      if (Date.now() - lastTypingTimeRef.current >= typingTimeout) {
        stopTyping()
      }
    }, typingTimeout)
  }, [websocket, roomId, enableTypingIndicators, typingTimeout])

  const stopTyping = useCallback(() => {
    if (!enableTypingIndicators) return
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    
    websocket.sendMessage({
      type: MessageType.TYPING_STOP,
      room: roomId || '',
      data: { userId: websocket.connectionInfo.userId || '', userName: 'Current User' }
    })
  }, [websocket, roomId, enableTypingIndicators])

  // Cleanup
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

  return {
    messages,
    sendMessage,
    markAsRead,
    deleteMessage,
    editMessage,
    startTyping,
    stopTyping,
    typingUsers
  }
}

/**
 * Presence hook for user status tracking
 */
export function usePresence(
  websocket: UseWebSocketReturn
): UsePresenceReturn {
  
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const [userStatuses, setUserStatuses] = useState<Record<string, 'online' | 'offline' | 'away' | 'busy'>>({})
  
  // Subscribe to presence updates
  useEffect(() => {
    const subscriptions = [
      websocket.subscribe(MessageType.USER_ONLINE, (message) => {
        const presenceMessage = message as PresenceUpdate
        setOnlineUsers(prev => [...new Set([...prev, presenceMessage.data.userId])])
        setUserStatuses(prev => ({ ...prev, [presenceMessage.data.userId]: 'online' }))
      }),
      
      websocket.subscribe(MessageType.USER_OFFLINE, (message) => {
        const presenceMessage = message as PresenceUpdate
        setOnlineUsers(prev => prev.filter(id => id !== presenceMessage.data.userId))
        setUserStatuses(prev => ({ ...prev, [presenceMessage.data.userId]: 'offline' }))
      }),
      
      websocket.subscribe(MessageType.PRESENCE_UPDATE, (message) => {
        const presenceMessage = message as PresenceUpdate
        setUserStatuses(prev => ({ ...prev, [presenceMessage.data.userId]: presenceMessage.data.status }))
      })
    ]

    return () => {
      subscriptions.forEach(id => websocket.unsubscribe(id))
    }
  }, [websocket])

  // Set current user status
  const setStatus = useCallback((status: 'online' | 'away' | 'busy') => {
    websocket.sendMessage({
      type: MessageType.USER_STATUS_CHANGE,
      data: { status }
    })
  }, [websocket])

  // Set custom status
  const setCustomStatus = useCallback((customStatus: string) => {
    websocket.sendMessage({
      type: MessageType.USER_STATUS_CHANGE,
      data: { customStatus }
    })
  }, [websocket])

  // Subscribe to specific user
  const subscribeToUser = useCallback((userId: string) => {
    websocket.sendMessage({
      type: MessageType.PRESENCE_UPDATE,
      data: { action: 'subscribe', userId }
    })
  }, [websocket])

  // Unsubscribe from user
  const unsubscribeFromUser = useCallback((userId: string) => {
    websocket.sendMessage({
      type: MessageType.PRESENCE_UPDATE,
      data: { action: 'unsubscribe', userId }
    })
  }, [websocket])

  return {
    onlineUsers,
    userStatuses,
    setStatus,
    setCustomStatus,
    subscribeToUser,
    unsubscribeFromUser
  }
}

/**
 * Notifications hook
 */
export function useNotifications(
  websocket: UseWebSocketReturn,
  options: {
    maxNotifications?: number
    autoMarkRead?: boolean
  } = {}
): UseNotificationsReturn {
  const { maxNotifications = 50, autoMarkRead = false } = options
  
  const [notifications, setNotifications] = useState<NotificationMessage[]>([])
  const [unreadCount, setUnreadCount] = useState<number>(0)

  // Subscribe to notifications
  useEffect(() => {
    const subscriptionId = websocket.subscribe(
      [MessageType.NOTIFICATION, MessageType.SYSTEM_ALERT],
      (message) => {
        const notificationMessage = message as NotificationMessage
        setNotifications(prev => {
          const newNotifications = [notificationMessage, ...prev].slice(0, maxNotifications)
          return newNotifications
        })
        
        if (!autoMarkRead) {
          setUnreadCount(prev => prev + 1)
        }
      }
    )

    return () => {
      websocket.unsubscribe(subscriptionId)
    }
  }, [websocket, maxNotifications, autoMarkRead])

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId 
          ? { ...n, data: { ...n.data, read: true } }
          : n
      )
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, data: { ...n.data, read: true } }))
    )
    setUnreadCount(0)
  }, [])

  const dismiss = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId))
    setUnreadCount(prev => Math.max(0, prev - 1))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
    setUnreadCount(0)
  }, [])

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    dismiss,
    clearAll
  }
}

/**
 * Events hook for event updates
 */
export function useEvents(websocket: UseWebSocketReturn): UseEventsReturn {
  const [upcomingEvents, setUpcomingEvents] = useState<EventUpdate[]>([])

  // Subscribe to event updates
  useEffect(() => {
    const subscriptionId = websocket.subscribe(
      [MessageType.EVENT_UPDATE, MessageType.EVENT_REMINDER],
      (message) => {
        const eventMessage = message as EventUpdate
        setUpcomingEvents(prev => {
          // Remove existing event with same ID and add updated one
          const filtered = prev.filter(event => event.data.eventId !== eventMessage.data.eventId)
          return [...filtered, eventMessage].sort((a, b) => 
            new Date(a.data.eventData.startDate).getTime() - new Date(b.data.eventData.startDate).getTime()
          )
        })
      }
    )

    return () => {
      websocket.unsubscribe(subscriptionId)
    }
  }, [websocket])

  const subscribeToEvents = useCallback(() => {
    websocket.sendMessage({
      type: MessageType.EVENT_UPDATE,
      data: { action: 'subscribe' }
    })
  }, [websocket])

  const unsubscribeFromEvents = useCallback(() => {
    websocket.sendMessage({
      type: MessageType.EVENT_UPDATE,
      data: { action: 'unsubscribe' }
    })
  }, [websocket])

  const getEventById = useCallback((eventId: string): EventUpdate | undefined => {
    return upcomingEvents.find(event => event.data.eventId === eventId)
  }, [upcomingEvents])

  return {
    upcomingEvents,
    subscribeToEvents,
    unsubscribeFromEvents,
    getEventById
  }
}