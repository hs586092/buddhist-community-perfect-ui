/**
 * Chat Example Component
 * Demonstrates real-time chat functionality using WebSocket hooks
 */

import React, { useState, useRef, useEffect } from 'react'
import { useWebSocketContext } from '@/providers/WebSocketProvider'
import { useChat, usePresence, WebSocketUtils } from '@/services/websocket'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface ChatExampleProps {
  roomId: string
  currentUserId: string
  className?: string
}

export function ChatExample({ roomId, currentUserId, className = '' }: ChatExampleProps) {
  const { websocket } = useWebSocketContext()
  const [messageInput, setMessageInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Chat hook for messaging functionality
  const chat = useChat(websocket, roomId, {
    maxMessages: 100,
    enableTypingIndicators: true,
    typingTimeout: 3000
  })

  // Presence hook for user status
  const presence = usePresence(websocket)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat.messages])

  // Join room on mount
  useEffect(() => {
    websocket.joinRoom(roomId)
    
    return () => {
      websocket.leaveRoom(roomId)
    }
  }, [websocket, roomId])

  // Handle message sending
  const handleSendMessage = async () => {
    const content = messageInput.trim()
    if (!content) return

    if (!WebSocketUtils.validateMessage(content)) {
      alert('Message is too long or empty')
      return
    }

    const success = await chat.sendMessage(content)
    if (success) {
      setMessageInput('')
      inputRef.current?.focus()
    } else {
      alert('Failed to send message. It will be queued and sent when connection is restored.')
    }
  }

  // Handle typing indicators
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value)
    
    if (!isTyping) {
      setIsTyping(true)
      chat.startTyping()
    }
  }

  const handleInputBlur = () => {
    if (isTyping) {
      setIsTyping(false)
      chat.stopTyping()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Format message time
  const formatTime = (timestamp: number) => {
    return WebSocketUtils.formatTimestamp(timestamp)
  }

  // Get user status indicator
  const getUserStatusIcon = (userId: string) => {
    const status = presence.userStatuses[userId]
    switch (status) {
      case 'online': return '🟢'
      case 'away': return '🟡'
      case 'busy': return '🔴'
      default: return '⚫'
    }
  }

  return (
    <div className={`flex flex-col h-96 border border-gray-300 rounded-lg bg-white ${className}`}>
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div>
          <h3 className="font-semibold text-gray-800">Room: {roomId}</h3>
          <div className="text-sm text-gray-600">
            {presence.onlineUsers.length} users online
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Connection status */}
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${
              websocket.isConnected ? 'bg-green-500' : 
              websocket.isConnecting ? 'bg-yellow-500' : 
              'bg-red-500'
            }`} />
            <span className="text-xs text-gray-600">
              {websocket.connectionState}
            </span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {chat.messages.length === 0 ? (
          <div className="text-center text-gray-500 text-sm">
            No messages yet. Start the conversation!
          </div>
        ) : (
          chat.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.userId === currentUserId ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                  message.userId === currentUserId
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {message.userId !== currentUserId && (
                  <div className="flex items-center space-x-1 mb-1">
                    <span className="text-xs font-semibold">
                      {getUserStatusIcon(message.userId || '')} {message.userId || 'Unknown'}
                    </span>
                  </div>
                )}
                
                <div className="text-sm">{message.data.content}</div>
                
                <div className={`text-xs mt-1 ${
                  message.userId === currentUserId ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))
        )}
        
        {/* Typing indicators */}
        {chat.typingUsers.length > 0 && (
          <div className="text-sm text-gray-500 italic">
            {chat.typingUsers.map(user => user.userName).join(', ')} 
            {chat.typingUsers.length === 1 ? ' is' : ' are'} typing...
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex space-x-2">
          <Input
            ref={inputRef}
            value={messageInput}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={!websocket.isConnected}
            className="flex-1"
            maxLength={4000}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!websocket.isConnected || !messageInput.trim()}
            variant="primary"
          >
            Send
          </Button>
        </div>
        
        {!websocket.isConnected && (
          <div className="text-xs text-red-500 mt-1">
            Disconnected. Messages will be queued and sent when connection is restored.
          </div>
        )}
        
        <div className="text-xs text-gray-500 mt-1">
          {messageInput.length}/4000 characters
        </div>
      </div>
    </div>
  )
}

export default ChatExample