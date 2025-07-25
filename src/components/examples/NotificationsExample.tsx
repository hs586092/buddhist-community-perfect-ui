/**
 * Notifications Example Component
 * Demonstrates real-time notifications using WebSocket hooks
 */

import { useState } from 'react'
import { useWebSocketContext } from '@/providers/WebSocketProvider'
import { useNotifications, MessageType } from '@/services/websocket'
import { Button } from '@/components/ui/Button'

interface NotificationsExampleProps {
  className?: string
}

export function NotificationsExample({ className = '' }: NotificationsExampleProps) {
  const { websocket } = useWebSocketContext()
  const [isVisible, setIsVisible] = useState(true)

  // Notifications hook
  const notifications = useNotifications(websocket, {
    maxNotifications: 20,
    autoMarkRead: false
  })

  // Send test notification
  const sendTestNotification = () => {
    websocket.sendMessage({
      type: MessageType.NOTIFICATION,
      data: {
        title: 'Test Notification',
        body: 'This is a test notification sent at ' + new Date().toLocaleTimeString(),
        category: 'info' as const,
        dismissible: true,
        persistent: false
      }
    })
  }

  // Send system alert
  const sendSystemAlert = () => {
    websocket.sendMessage({
      type: MessageType.SYSTEM_ALERT,
      data: {
        severity: 'high' as const,
        title: 'System Alert',
        message: 'This is a high priority system alert',
        actionRequired: true
      }
    })
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'info': return 'ℹ️'
      case 'warning': return '⚠️'
      case 'error': return '❌'
      case 'success': return '✅'
      default: return '📢'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'info': return 'border-blue-200 bg-blue-50'
      case 'warning': return 'border-yellow-200 bg-yellow-50'
      case 'error': return 'border-red-200 bg-red-50'
      case 'success': return 'border-green-200 bg-green-50'
      default: return 'border-gray-200 bg-gray-50'
    }
  }

  if (!isVisible) {
    return (
      <div className={`fixed top-4 right-4 z-50 ${className}`}>
        <Button
          onClick={() => setIsVisible(true)}
          variant="outline"
          className="relative"
        >
          🔔 Notifications
          {notifications.unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {notifications.unreadCount}
            </span>
          )}
        </Button>
      </div>
    )
  }

  return (
    <div className={`fixed top-4 right-4 w-80 max-h-96 bg-white border border-gray-300 rounded-lg shadow-lg z-50 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold text-gray-800">Notifications</h3>
          {notifications.unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
              {notifications.unreadCount} unread
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {notifications.unreadCount > 0 && (
            <Button
              onClick={notifications.markAllAsRead}
              variant="outline"
              className="text-xs px-2 py-1"
            >
              Mark all read
            </Button>
          )}
          
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-500 hover:text-gray-700 text-lg font-bold"
          >
            ×
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-64 overflow-y-auto">
        {notifications.notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            No notifications
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {notifications.notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 ${getCategoryColor(notification.data.category)} ${
                  notification.data.read ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-lg">
                        {getCategoryIcon(notification.data.category)}
                      </span>
                      <h4 className="font-medium text-gray-800 text-sm">
                        {notification.data.title}
                      </h4>
                    </div>
                    
                    <p className="text-gray-600 text-xs mb-2">
                      {notification.data.body}
                    </p>
                    
                    <div className="text-xs text-gray-500">
                      {new Date(notification.timestamp).toLocaleString()}
                    </div>
                    
                    {notification.data.actionUrl && (
                      <a
                        href={notification.data.actionUrl}
                        className="text-blue-600 hover:text-blue-800 text-xs underline mt-1 inline-block"
                      >
                        View Details
                      </a>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-1 ml-2">
                    {!notification.data.read && (
                      <button
                        onClick={() => notifications.markAsRead(notification.id)}
                        className="text-blue-600 hover:text-blue-800 text-xs px-1"
                        title="Mark as read"
                      >
                        ✓
                      </button>
                    )}
                    
                    {notification.data.dismissible && (
                      <button
                        onClick={() => notifications.dismiss(notification.id)}
                        className="text-red-600 hover:text-red-800 text-xs px-1"
                        title="Dismiss"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="border-t border-gray-200 p-4 space-y-2">
        <div className="flex space-x-2">
          <Button
            onClick={sendTestNotification}
            variant="outline"
            className="flex-1 text-xs"
            disabled={!websocket.isConnected}
          >
            Test Notification
          </Button>
          
          <Button
            onClick={sendSystemAlert}
            variant="outline"
            className="flex-1 text-xs"
            disabled={!websocket.isConnected}
          >
            System Alert
          </Button>
        </div>
        
        {notifications.notifications.length > 0 && (
          <Button
            onClick={notifications.clearAll}
            variant="outline"
            className="w-full text-xs"
          >
            Clear All
          </Button>
        )}
        
        <div className="text-xs text-gray-500 text-center">
          Connection: {websocket.isConnected ? '🟢 Online' : '🔴 Offline'}
        </div>
      </div>
    </div>
  )
}

export default NotificationsExample