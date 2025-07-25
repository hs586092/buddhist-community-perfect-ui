/**
 * WebSocket Provider for React Application
 * Manages WebSocket connection at the application level
 */

import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import {
  useWebSocket,
  createDefaultConfig,
  WebSocketUtils,
  DevHelpers,
  WebSocketState
} from '@/services/websocket'
import type {
  UseWebSocketReturn,
  WebSocketConfig,
  ConnectionInfo,
  WebSocketError
} from '@/services/websocket'

interface WebSocketContextValue {
  websocket: UseWebSocketReturn
  connectionHealth: number
  lastError?: WebSocketError | undefined
  isOnline: boolean
}

const WebSocketContext = createContext<WebSocketContextValue | null>(null)

interface WebSocketProviderProps {
  children: ReactNode
  config?: Partial<WebSocketConfig>
  authToken?: string
  userId?: string
  enableDevMode?: boolean
}

export function WebSocketProvider({
  children,
  config = {},
  authToken,
  enableDevMode = process.env.NODE_ENV === 'development'
}: WebSocketProviderProps) {
  // State for connection health and errors
  const [connectionHealth, setConnectionHealth] = useState<number>(0)
  const [lastError, setLastError] = useState<WebSocketError>()
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine)

  // Create WebSocket configuration
  const wsConfig = createDefaultConfig({
    url: process.env.REACT_APP_WS_URL || 'localhost',
    port: parseInt(process.env.REACT_APP_WS_PORT || '3000'),
    ...(authToken ? { authToken } : {}),
    enableLogging: enableDevMode,
    ...config
  })

  // Initialize WebSocket connection
  const websocket = useWebSocket(wsConfig, {
    autoConnect: true,
    onConnect: (info: ConnectionInfo) => {
      console.log('🔗 WebSocket connected:', info)
      setLastError(undefined)
      
      if (enableDevMode) {
        console.log('📊 Connection Info:', info)
      }
    },
    onDisconnect: (info: ConnectionInfo) => {
      console.log('❌ WebSocket disconnected:', info)
      
      if (enableDevMode) {
        console.log('📊 Disconnection Info:', info)
      }
    },
    onError: (error: Error, context?: string) => {
      console.error('⚠️ WebSocket error:', error, 'Context:', context)
      setLastError(error as WebSocketError)
    },
    onStateChange: (newState: WebSocketState, oldState: WebSocketState) => {
      if (enableDevMode) {
        console.log('🔄 WebSocket state change:', { from: oldState, to: newState })
      }
    },
    ...(enableDevMode ? DevHelpers.createDebugLogger() : {})
  })

  // Monitor network connectivity
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      if (websocket.connectionState === WebSocketState.DISCONNECTED) {
        websocket.reconnect().catch(console.error)
      }
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [websocket])

  // Update connection health periodically
  useEffect(() => {
    const updateHealth = () => {
      if (websocket.isConnected) {
        const metrics = websocket.getPerformanceMetrics()
        const health = WebSocketUtils.calculateHealthScore(metrics)
        setConnectionHealth(health)
      } else {
        setConnectionHealth(0)
      }
    }

    // Update health every 30 seconds
    const interval = setInterval(updateHealth, 30000)
    
    // Initial update
    updateHealth()

    return () => clearInterval(interval)
  }, [websocket])

  // Auto-reconnect on auth token change
  useEffect(() => {
    if (authToken && websocket.isConnected && !websocket.connectionInfo.isAuthenticated) {
      // Reconnect with new token
      websocket.reconnect().catch(console.error)
    }
  }, [authToken, websocket])

  // Context value
  const contextValue: WebSocketContextValue = {
    websocket,
    connectionHealth,
    lastError,
    isOnline
  }

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
      
      {/* Development tools */}
      {enableDevMode && <WebSocketDevTools />}
    </WebSocketContext.Provider>
  )
}

/**
 * Hook to use WebSocket context
 */
export function useWebSocketContext(): WebSocketContextValue {
  const context = useContext(WebSocketContext)
  
  if (!context) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider')
  }
  
  return context
}

/**
 * Development tools component
 */
function WebSocketDevTools() {
  const { websocket, connectionHealth, lastError, isOnline } = useWebSocketContext()
  const [isVisible, setIsVisible] = useState(false)

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          zIndex: 9999,
          background: '#333',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          padding: '8px',
          cursor: 'pointer'
        }}
      >
        WS Debug
      </button>
    )
  }

  const metrics = websocket.getPerformanceMetrics()
  const queuedMessages = websocket.getQueuedMessages()

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.9)',
        color: 'white',
        padding: '16px',
        borderRadius: '8px',
        fontSize: '12px',
        fontFamily: 'monospace',
        minWidth: '300px',
        maxHeight: '400px',
        overflow: 'auto'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <h3 style={{ margin: 0 }}>WebSocket Debug</h3>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          ×
        </button>
      </div>

      <div style={{ marginBottom: '8px' }}>
        <strong>Connection Status:</strong> {websocket.connectionState}
      </div>

      <div style={{ marginBottom: '8px' }}>
        <strong>Health Score:</strong> {connectionHealth}/100
      </div>

      <div style={{ marginBottom: '8px' }}>
        <strong>Network:</strong> {isOnline ? '🟢 Online' : '🔴 Offline'}
      </div>

      <div style={{ marginBottom: '8px' }}>
        <strong>Authenticated:</strong> {websocket.connectionInfo.isAuthenticated ? '✅' : '❌'}
      </div>

      <div style={{ marginBottom: '8px' }}>
        <strong>Latency:</strong> {websocket.connectionInfo.latency || 0}ms
      </div>

      <div style={{ marginBottom: '8px' }}>
        <strong>Messages:</strong> ↑{metrics.messagesSent} ↓{metrics.messagesReceived}
      </div>

      <div style={{ marginBottom: '8px' }}>
        <strong>Reconnects:</strong> {metrics.reconnectionCount}
      </div>

      <div style={{ marginBottom: '8px' }}>
        <strong>Errors:</strong> {metrics.errorCount}
      </div>

      <div style={{ marginBottom: '8px' }}>
        <strong>Queued:</strong> {queuedMessages.length}
      </div>

      <div style={{ marginBottom: '8px' }}>
        <strong>Rooms:</strong> {websocket.getRooms().length}
      </div>

      {lastError && (
        <div style={{ marginBottom: '8px', color: '#ff6b6b' }}>
          <strong>Last Error:</strong> {lastError.message}
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        <button
          onClick={() => websocket.connect()}
          disabled={websocket.isConnected}
          style={{
            background: websocket.isConnected ? '#555' : '#4CAF50',
            border: 'none',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            cursor: websocket.isConnected ? 'not-allowed' : 'pointer'
          }}
        >
          Connect
        </button>

        <button
          onClick={() => websocket.disconnect()}
          disabled={!websocket.isConnected}
          style={{
            background: !websocket.isConnected ? '#555' : '#f44336',
            border: 'none',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            cursor: !websocket.isConnected ? 'not-allowed' : 'pointer'
          }}
        >
          Disconnect
        </button>

        <button
          onClick={() => websocket.clearMessageQueue()}
          style={{
            background: '#2196F3',
            border: 'none',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Clear Queue
        </button>
      </div>

      <div style={{ marginTop: '8px' }}>
        <button
          onClick={() => {
            websocket.sendMessage({
              type: 'chat_message' as any,
              data: { content: 'Test message from dev tools' }
            })
          }}
          disabled={!websocket.isConnected}
          style={{
            background: websocket.isConnected ? '#9C27B0' : '#555',
            border: 'none',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            cursor: websocket.isConnected ? 'pointer' : 'not-allowed',
            width: '100%'
          }}
        >
          Send Test Message
        </button>
      </div>
    </div>
  )
}

export default WebSocketProvider