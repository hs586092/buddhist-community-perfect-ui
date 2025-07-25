/**
 * WebSocket Client Implementation
 * Robust, production-ready WebSocket client with comprehensive features
 */

import {
  WebSocketConfig,
  WebSocketState,
  ConnectionInfo,
  BaseMessage,
  MessageType,
  WebSocketMessage,
  EventSubscription,
  RoomSubscription,
  QueuedMessage,
  PerformanceMetrics,
  AuthPayload,
  AuthResponse,
  WebSocketError,
  WebSocketErrorCode,
  MessageHandler,
  ErrorHandler,
  StateChangeHandler,
  ConnectionHandler
} from './types'

export class WebSocketClient {
  private socket: WebSocket | null = null
  private config: WebSocketConfig
  private connectionInfo: ConnectionInfo
  private subscriptions: Map<string, EventSubscription> = new Map()
  private rooms: Map<string, RoomSubscription> = new Map()
  private messageQueue: QueuedMessage[] = []
  private metrics: PerformanceMetrics
  
  // Event handlers
  private onConnect?: ConnectionHandler
  private onDisconnect?: ConnectionHandler
  private onError?: ErrorHandler
  private onStateChange?: StateChangeHandler
  private onMessage?: MessageHandler
  
  // Internal state management
  private reconnectTimer?: NodeJS.Timeout
  private heartbeatTimer?: NodeJS.Timeout
  private connectionTimeout?: NodeJS.Timeout
  private isReconnecting = false
  private messageIdCounter = 0
  
  constructor(config: WebSocketConfig) {
    this.config = {
      reconnectInterval: 5000,
      maxReconnectAttempts: 10,
      heartbeatInterval: 30000,
      connectionTimeout: 10000,
      messageQueueSize: 1000,
      enableLogging: false,
      autoReconnect: true,
      ...config
    }
    
    this.connectionInfo = {
      state: WebSocketState.DISCONNECTED,
      reconnectAttempts: 0,
      isAuthenticated: false
    }
    
    this.metrics = {
      messagesReceived: 0,
      messagesSent: 0,
      averageLatency: 0,
      connectionUptime: 0,
      reconnectionCount: 0,
      errorCount: 0,
      lastUpdate: new Date()
    }
    
    this.log('debug', 'WebSocket client initialized', { config: this.config })
  }

  /**
   * Establish WebSocket connection
   */
  async connect(): Promise<void> {
    if (this.socket?.readyState === WebSocket.CONNECTING) {
      this.log('warn', 'Connection already in progress')
      return
    }
    
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.log('warn', 'Already connected')
      return
    }

    return new Promise((resolve, reject) => {
      try {
        this.updateConnectionState(WebSocketState.CONNECTING)
        
        // Construct WebSocket URL
        const wsUrl = this.buildWebSocketUrl()
        this.log('info', 'Connecting to WebSocket', { url: wsUrl })
        
        // Create WebSocket connection
        this.socket = new WebSocket(wsUrl, this.config.protocols)
        
        // Connection timeout
        this.connectionTimeout = setTimeout(() => {
          if (this.socket?.readyState === WebSocket.CONNECTING) {
            this.socket.close()
            const error = this.createError(
              WebSocketErrorCode.TIMEOUT,
              'Connection timeout',
              'connect'
            )
            this.handleError(error)
            reject(error)
          }
        }, this.config.connectionTimeout)

        // Event handlers
        this.socket.onopen = () => {
          this.clearConnectionTimeout()
          this.connectionInfo.connectedAt = new Date()
          this.updateConnectionState(WebSocketState.CONNECTED)
          this.connectionInfo.reconnectAttempts = 0
          this.isReconnecting = false
          
          // Start heartbeat
          this.startHeartbeat()
          
          // Process queued messages
          this.processMessageQueue()
          
          // Authenticate if token provided
          if (this.config.authToken) {
            this.authenticate(this.config.authToken)
          }
          
          this.log('info', 'WebSocket connected successfully')
          this.onConnect?.(this.connectionInfo)
          resolve()
        }

        this.socket.onmessage = (event) => {
          this.handleIncomingMessage(event)
        }

        this.socket.onclose = (event) => {
          this.handleConnectionClose(event)
          if (!this.isReconnecting) {
            reject(new Error(`Connection closed: ${event.code} ${event.reason}`))
          }
        }

        this.socket.onerror = (event) => {
          this.clearConnectionTimeout()
          const error = this.createError(
            WebSocketErrorCode.CONNECTION_FAILED,
            'WebSocket connection error',
            'connect'
          )
          this.handleError(error)
          reject(error)
        }

      } catch (error) {
        this.clearConnectionTimeout()
        const wsError = this.createError(
          WebSocketErrorCode.CONNECTION_FAILED,
          `Failed to create WebSocket connection: ${error}`,
          'connect'
        )
        this.handleError(wsError)
        reject(wsError)
      }
    })
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect(): void {
    this.log('info', 'Disconnecting WebSocket')
    
    // Clear timers
    this.clearReconnectTimer()
    this.clearHeartbeatTimer()
    this.clearConnectionTimeout()
    
    // Close socket
    if (this.socket) {
      this.socket.close(1000, 'Client disconnect')
      this.socket = null
    }
    
    this.updateConnectionState(WebSocketState.DISCONNECTED)
    this.connectionInfo.isAuthenticated = false
    this.isReconnecting = false
    
    this.onDisconnect?.(this.connectionInfo)
  }

  /**
   * Manual reconnection
   */
  async reconnect(): Promise<void> {
    this.log('info', 'Manual reconnection requested')
    this.disconnect()
    await this.connect()
  }

  /**
   * Send message through WebSocket
   */
  async sendMessage(message: Partial<BaseMessage>): Promise<boolean> {
    if (!this.isConnected()) {
      return this.queueMessage(message)
    }

    try {
      const completeMessage: BaseMessage = {
        id: message.id || this.generateMessageId(),
        type: message.type || MessageType.CHAT_MESSAGE,
        timestamp: message.timestamp || Date.now(),
        userId: message.userId || this.connectionInfo.userId,
        room: message.room,
        data: message.data
      }

      const messageString = JSON.stringify(completeMessage)
      this.socket!.send(messageString)
      
      this.metrics.messagesSent++
      this.updateMetrics()
      
      this.log('debug', 'Message sent', { message: completeMessage })
      return true
      
    } catch (error) {
      this.log('error', 'Failed to send message', { error, message })
      return this.queueMessage(message)
    }
  }

  /**
   * Authenticate with JWT token
   */
  private async authenticate(token: string): Promise<boolean> {
    const authPayload: AuthPayload = { token }
    
    return new Promise((resolve) => {
      const subscriptionId = this.subscribe([MessageType.AUTH_SUCCESS, MessageType.AUTH_FAILURE], (message) => {
        this.unsubscribe(subscriptionId)
        
        if (message.type === MessageType.AUTH_SUCCESS) {
          this.connectionInfo.isAuthenticated = true
          const authData = message.data as AuthResponse
          this.connectionInfo.userId = authData.userId
          this.log('info', 'Authentication successful', { userId: authData.userId })
          resolve(true)
        } else {
          this.connectionInfo.isAuthenticated = false
          const error = this.createError(
            WebSocketErrorCode.AUTHENTICATION_FAILED,
            'Authentication failed',
            'authenticate'
          )
          this.handleError(error)
          resolve(false)
        }
      }, undefined, true)
      
      // Send auth message
      this.sendMessage({
        type: MessageType.AUTH,
        data: authPayload
      })
    })
  }

  /**
   * Subscribe to message types
   */
  subscribe(
    types: MessageType | MessageType[],
    handler: MessageHandler,
    room?: string,
    once = false
  ): string {
    const subscriptionId = this.generateSubscriptionId()
    const subscription: EventSubscription = {
      id: subscriptionId,
      type: Array.isArray(types) ? types : [types],
      room,
      handler,
      once
    }
    
    this.subscriptions.set(subscriptionId, subscription)
    this.log('debug', 'Subscription added', { subscriptionId, types, room })
    
    return subscriptionId
  }

  /**
   * Unsubscribe from events
   */
  unsubscribe(subscriptionId: string): boolean {
    const removed = this.subscriptions.delete(subscriptionId)
    if (removed) {
      this.log('debug', 'Subscription removed', { subscriptionId })
    }
    return removed
  }

  /**
   * Join a room
   */
  async joinRoom(roomId: string): Promise<boolean> {
    if (this.rooms.has(roomId)) {
      this.log('warn', 'Already in room', { roomId })
      return true
    }

    return new Promise((resolve) => {
      const subscriptionId = this.subscribe(MessageType.ROOM_JOINED, (message) => {
        this.unsubscribe(subscriptionId)
        
        if (message.room === roomId) {
          const roomSubscription: RoomSubscription = {
            roomId,
            joinedAt: new Date(),
            messageTypes: [MessageType.CHAT_MESSAGE, MessageType.EVENT_UPDATE],
            isActive: true
          }
          this.rooms.set(roomId, roomSubscription)
          this.log('info', 'Joined room', { roomId })
          resolve(true)
        }
      }, undefined, true)
      
      this.sendMessage({
        type: MessageType.JOIN_ROOM,
        room: roomId
      })
    })
  }

  /**
   * Leave a room
   */
  async leaveRoom(roomId: string): Promise<boolean> {
    if (!this.rooms.has(roomId)) {
      this.log('warn', 'Not in room', { roomId })
      return true
    }

    return new Promise((resolve) => {
      const subscriptionId = this.subscribe(MessageType.ROOM_LEFT, (message) => {
        this.unsubscribe(subscriptionId)
        
        if (message.room === roomId) {
          this.rooms.delete(roomId)
          this.log('info', 'Left room', { roomId })
          resolve(true)
        }
      }, undefined, true)
      
      this.sendMessage({
        type: MessageType.LEAVE_ROOM,
        room: roomId
      })
    })
  }

  /**
   * Get connection state
   */
  getConnectionState(): WebSocketState {
    return this.connectionInfo.state
  }

  /**
   * Get connection info
   */
  getConnectionInfo(): ConnectionInfo {
    return { ...this.connectionInfo }
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN && 
           this.connectionInfo.state === WebSocketState.CONNECTED
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }

  /**
   * Get rooms
   */
  getRooms(): RoomSubscription[] {
    return Array.from(this.rooms.values())
  }

  /**
   * Get queued messages
   */
  getQueuedMessages(): QueuedMessage[] {
    return [...this.messageQueue]
  }

  /**
   * Clear message queue
   */
  clearMessageQueue(): void {
    this.messageQueue = []
    this.log('info', 'Message queue cleared')
  }

  /**
   * Set event handlers
   */
  setEventHandlers(handlers: {
    onConnect?: ConnectionHandler
    onDisconnect?: ConnectionHandler
    onError?: ErrorHandler
    onStateChange?: StateChangeHandler
    onMessage?: MessageHandler
  }): void {
    this.onConnect = handlers.onConnect
    this.onDisconnect = handlers.onDisconnect
    this.onError = handlers.onError
    this.onStateChange = handlers.onStateChange
    this.onMessage = handlers.onMessage
  }

  // Private methods

  private buildWebSocketUrl(): string {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const port = this.config.port ? `:${this.config.port}` : ''
    return `${protocol}//${this.config.url}${port}`
  }

  private handleIncomingMessage(event: MessageEvent): void {
    try {
      const message: WebSocketMessage = JSON.parse(event.data)
      
      this.metrics.messagesReceived++
      this.updateMetrics()
      
      // Handle heartbeat
      if (message.type === MessageType.PONG) {
        this.handlePong(message)
        return
      }
      
      // Update latency if message has timestamp
      if (message.timestamp) {
        const latency = Date.now() - message.timestamp
        this.updateLatency(latency)
      }
      
      // Notify global message handler
      this.onMessage?.(message)
      
      // Process subscriptions
      this.processSubscriptions(message)
      
      this.log('debug', 'Message received', { message })
      
    } catch (error) {
      this.log('error', 'Failed to parse incoming message', { error, data: event.data })
      this.metrics.errorCount++
    }
  }

  private processSubscriptions(message: WebSocketMessage): void {
    const subscriptionsToRemove: string[] = []
    
    for (const [id, subscription] of this.subscriptions) {
      // Check if message type matches
      const typeMatch = subscription.type.includes(message.type)
      
      // Check room filter
      const roomMatch = !subscription.room || subscription.room === message.room
      
      if (typeMatch && roomMatch) {
        try {
          subscription.handler(message)
          
          if (subscription.once) {
            subscriptionsToRemove.push(id)
          }
        } catch (error) {
          this.log('error', 'Error in subscription handler', { error, subscriptionId: id })
        }
      }
    }
    
    // Remove one-time subscriptions
    subscriptionsToRemove.forEach(id => this.subscriptions.delete(id))
  }

  private handleConnectionClose(event: CloseEvent): void {
    this.log('info', 'WebSocket connection closed', { code: event.code, reason: event.reason })
    
    this.clearHeartbeatTimer()
    this.updateConnectionState(WebSocketState.DISCONNECTED)
    
    // Auto-reconnect if enabled and not a clean close
    if (this.config.autoReconnect && event.code !== 1000 && !this.isReconnecting) {
      this.scheduleReconnect()
    }
    
    this.onDisconnect?.(this.connectionInfo)
  }

  private scheduleReconnect(): void {
    if (this.connectionInfo.reconnectAttempts >= this.config.maxReconnectAttempts!) {
      this.log('error', 'Max reconnection attempts reached')
      this.updateConnectionState(WebSocketState.ERROR)
      return
    }

    this.isReconnecting = true
    this.updateConnectionState(WebSocketState.RECONNECTING)
    
    const delay = this.config.reconnectInterval! * Math.pow(2, this.connectionInfo.reconnectAttempts)
    
    this.log('info', 'Scheduling reconnect', { 
      attempt: this.connectionInfo.reconnectAttempts + 1,
      delay 
    })
    
    this.reconnectTimer = setTimeout(async () => {
      this.connectionInfo.reconnectAttempts++
      this.metrics.reconnectionCount++
      
      try {
        await this.connect()
      } catch (error) {
        this.log('error', 'Reconnection failed', { error })
        this.scheduleReconnect()
      }
    }, delay)
  }

  private startHeartbeat(): void {
    if (!this.config.heartbeatInterval) return
    
    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected()) {
        const pingMessage: BaseMessage = {
          id: this.generateMessageId(),
          type: MessageType.PING,
          timestamp: Date.now()
        }
        
        this.connectionInfo.lastPingTime = new Date()
        this.socket!.send(JSON.stringify(pingMessage))
      }
    }, this.config.heartbeatInterval)
  }

  private handlePong(message: BaseMessage): void {
    this.connectionInfo.lastPongTime = new Date()
    
    if (this.connectionInfo.lastPingTime && message.timestamp) {
      const latency = Date.now() - message.timestamp
      this.updateLatency(latency)
    }
  }

  private queueMessage(message: Partial<BaseMessage>): boolean {
    if (this.messageQueue.length >= this.config.messageQueueSize!) {
      this.log('warn', 'Message queue full, dropping oldest message')
      this.messageQueue.shift()
    }
    
    const queuedMessage: QueuedMessage = {
      id: this.generateMessageId(),
      message,
      attempts: 0,
      queuedAt: new Date(),
      priority: 'normal',
      maxAttempts: 3
    }
    
    this.messageQueue.push(queuedMessage)
    this.log('debug', 'Message queued', { messageId: queuedMessage.id })
    
    return true
  }

  private processMessageQueue(): void {
    if (this.messageQueue.length === 0) return
    
    this.log('info', 'Processing message queue', { count: this.messageQueue.length })
    
    const messagesToProcess = [...this.messageQueue]
    this.messageQueue = []
    
    messagesToProcess.forEach(async (queuedMessage) => {
      try {
        const success = await this.sendMessage(queuedMessage.message)
        if (!success) {
          queuedMessage.attempts++
          if (queuedMessage.attempts < queuedMessage.maxAttempts) {
            this.messageQueue.push(queuedMessage)
          }
        }
      } catch (error) {
        this.log('error', 'Failed to process queued message', { error, messageId: queuedMessage.id })
      }
    })
  }

  private updateConnectionState(newState: WebSocketState): void {
    const oldState = this.connectionInfo.state
    this.connectionInfo.state = newState
    this.onStateChange?.(newState, oldState)
  }

  private updateLatency(latency: number): void {
    this.connectionInfo.latency = latency
    
    // Calculate moving average
    const alpha = 0.1 // Smoothing factor
    this.metrics.averageLatency = this.metrics.averageLatency * (1 - alpha) + latency * alpha
  }

  private updateMetrics(): void {
    this.metrics.lastUpdate = new Date()
    
    if (this.connectionInfo.connectedAt) {
      this.metrics.connectionUptime = Date.now() - this.connectionInfo.connectedAt.getTime()
    }
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = undefined
    }
  }

  private clearHeartbeatTimer(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = undefined
    }
  }

  private clearConnectionTimeout(): void {
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout)
      this.connectionTimeout = undefined
    }
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${++this.messageIdCounter}`
  }

  private generateSubscriptionId(): string {
    return `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private createError(code: WebSocketErrorCode, message: string, context?: string): WebSocketError {
    const error = new Error(message) as WebSocketError
    error.code = code
    error.context = context
    error.timestamp = new Date()
    error.retry = [
      WebSocketErrorCode.CONNECTION_FAILED,
      WebSocketErrorCode.NETWORK_ERROR,
      WebSocketErrorCode.TIMEOUT
    ].includes(code)
    
    return error
  }

  private handleError(error: WebSocketError): void {
    this.metrics.errorCount++
    this.log('error', 'WebSocket error', { error })
    this.onError?.(error, error.context)
  }

  private log(level: 'debug' | 'info' | 'warn' | 'error', message: string, data?: any): void {
    if (!this.config.enableLogging) return
    
    const logMessage = `[WebSocket] ${message}`
    switch (level) {
      case 'debug':
        console.debug(logMessage, data)
        break
      case 'info':
        console.info(logMessage, data)
        break
      case 'warn':
        console.warn(logMessage, data)
        break
      case 'error':
        console.error(logMessage, data)
        break
    }
  }
}