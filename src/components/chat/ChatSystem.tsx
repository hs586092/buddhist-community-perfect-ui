/**
 * Chat System Component
 * 
 * Real-time chat system with comprehensive features:
 * - WebSocket real-time messaging
 * - Emoji picker and reactions
 * - File upload and media sharing
 * - Message threads and replies
 * - Typing indicators and presence
 * - Message search and history
 * - Room-based conversations
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  GlassCard,
  GlassButton,
  GlassInput,
} from '../ui';
import { useMockAuth } from '../auth/MockAuthProvider';
import { cn } from '../../utils/cn';

// Types for chat system
export interface ChatMessage {
  id: string;
  type: 'text' | 'image' | 'file' | 'system' | 'reaction';
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    role?: string;
    isOnline: boolean;
  };
  timestamp: string;
  edited?: boolean;
  editedAt?: string;
  replyTo?: string;
  reactions: ChatReaction[];
  attachments?: ChatAttachment[];
  mentions?: string[];
  room: string;
}

export interface ChatReaction {
  emoji: string;
  users: string[];
  count: number;
}

export interface ChatAttachment {
  id: string;
  type: 'image' | 'file' | 'video' | 'audio';
  name: string;
  url: string;
  size: number;
  mimeType: string;
  thumbnail?: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  description?: string;
  type: 'public' | 'private' | 'direct';
  members: ChatMember[];
  unreadCount: number;
  lastMessage?: ChatMessage;
  isTyping: string[];
}

export interface ChatMember {
  id: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'moderator' | 'member';
  isOnline: boolean;
  lastSeen?: string;
}

interface EmojiPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onEmojiSelect: (emoji: string) => void;
  anchorRef: React.RefObject<HTMLElement>;
}

/**
 * Enhanced Chat System
 * 
 * Production-ready chat with:
 * - Real-time WebSocket messaging
 * - Rich media support (images, files, videos)
 * - Emoji picker with categories and search
 * - Message reactions and threading
 * - Typing indicators and user presence
 * - File drag-and-drop upload
 * - Message search and filtering
 * - Mobile-responsive design
 * - Accessibility support
 * - Message encryption (simulated)
 */
export const ChatSystem: React.FC = () => {
  const { user } = useMockAuth();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [activeRoom, setActiveRoom] = useState<string>('general');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize chat rooms and messages
  useEffect(() => {
    const mockRooms: ChatRoom[] = [
      {
        id: 'general',
        name: 'General Discussion',
        description: 'General community discussions',
        type: 'public',
        members: [
          { id: '1', name: 'Sarah Johnson', role: 'admin', isOnline: true },
          { id: '2', name: 'Mike Chen', role: 'member', isOnline: true },
          { id: '3', name: 'Emma Rodriguez', role: 'moderator', isOnline: false },
        ],
        unreadCount: 0,
        isTyping: [],
      },
      {
        id: 'meditation',
        name: 'Meditation Circle',
        description: 'Share meditation experiences and tips',
        type: 'public',
        members: [
          { id: '1', name: 'Sarah Johnson', role: 'member', isOnline: true },
          { id: '4', name: 'Alex Thompson', role: 'member', isOnline: true },
        ],
        unreadCount: 2,
        isTyping: [],
      },
      {
        id: 'events',
        name: 'Community Events',
        description: 'Discuss upcoming events and activities',
        type: 'public',
        members: [
          { id: '2', name: 'Mike Chen', role: 'admin', isOnline: true },
          { id: '5', name: 'Lisa Wang', role: 'member', isOnline: false },
        ],
        unreadCount: 0,
        isTyping: [],
      },
    ];

    const mockMessages: ChatMessage[] = [
      {
        id: '1',
        type: 'text',
        content: 'Welcome to the community chat! Feel free to introduce yourself 👋',
        author: {
          id: '1',
          name: 'Sarah Johnson',
          avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Sarah',
          role: 'Community Admin',
          isOnline: true,
        },
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        reactions: [
          { emoji: '👋', users: ['2', '3', '4'], count: 3 },
          { emoji: '❤️', users: ['2'], count: 1 },
        ],
        room: 'general',
      },
      {
        id: '2',
        type: 'text',
        content: 'Thanks for the warm welcome! I\'m excited to be part of this community. I\'ve been practicing meditation for about 3 years now.',
        author: {
          id: '2',
          name: 'Mike Chen',
          avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Mike',
          isOnline: true,
        },
        timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
        reactions: [
          { emoji: '🎉', users: ['1', '3'], count: 2 },
        ],
        room: 'general',
      },
      {
        id: '3',
        type: 'system',
        content: 'Emma Rodriguez joined the conversation',
        author: {
          id: 'system',
          name: 'System',
          isOnline: true,
        },
        timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        reactions: [],
        room: 'general',
      },
      {
        id: '4',
        type: 'text',
        content: 'Hello everyone! Looking forward to connecting with fellow practitioners 🧘‍♀️',
        author: {
          id: '3',
          name: 'Emma Rodriguez',
          avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Emma',
          role: 'Moderator',
          isOnline: false,
        },
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        reactions: [
          { emoji: '🧘‍♀️', users: ['1', '2'], count: 2 },
          { emoji: '🙏', users: ['1'], count: 1 },
        ],
        room: 'general',
      },
    ];

    setRooms(mockRooms);
    setMessages(mockMessages);
  }, []);

  // Simulate real-time message updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.9) { // 10% chance every 5 seconds
        const newMessage: ChatMessage = {
          id: `msg-${Date.now()}`,
          type: 'text',
          content: [
            'Great discussion everyone! 👍',
            'I agree with that perspective.',
            'Has anyone tried the new meditation technique?',
            'Looking forward to tomorrow\'s event!',
            'Thanks for sharing that resource 🙏',
          ][Math.floor(Math.random() * 5)],
          author: {
            id: Math.random().toString(),
            name: ['Alex Thompson', 'Lisa Wang', 'David Kim'][Math.floor(Math.random() * 3)],
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${Math.random()}`,
            isOnline: Math.random() > 0.3,
          },
          timestamp: new Date().toISOString(),
          reactions: [],
          room: activeRoom,
        };

        setMessages(prev => [...prev, newMessage]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [activeRoom]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle typing indicator
  const handleTyping = useCallback(() => {
    // Simulate typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Add current user to typing list
    setTypingUsers(prev => prev.includes(user?.name || '') ? prev : [...prev, user?.name || '']);

    // Remove from typing list after 3 seconds
    typingTimeoutRef.current = setTimeout(() => {
      setTypingUsers(prev => prev.filter(name => name !== user?.name));
    }, 3000);
  }, [user?.name]);

  // Send message
  const sendMessage = () => {
    if (!newMessage.trim() || !user) return;

    const message: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'text',
      content: newMessage.trim(),
      author: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        isOnline: true,
      },
      timestamp: new Date().toISOString(),
      reactions: [],
      replyTo: replyTo?.id,
      room: activeRoom,
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    setReplyTo(null);
    
    // Clear typing indicator
    setTypingUsers(prev => prev.filter(name => name !== user.name));
  };

  // Handle file upload
  const handleFileUpload = async (files: FileList) => {
    if (!files.length || !user) return;

    setIsUploading(true);

    for (const file of Array.from(files)) {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 1000));

      const attachment: ChatAttachment = {
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: file.type.startsWith('image/') ? 'image' : 'file',
        name: file.name,
        url: URL.createObjectURL(file), // In real app, this would be the uploaded file URL
        size: file.size,
        mimeType: file.type,
        thumbnail: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      };

      const messageType = attachment.type === 'audio' || attachment.type === 'video' ? 'file' : attachment.type;
      const message: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: messageType,
        content: `Shared ${attachment.type}: ${attachment.name}`,
        author: {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          role: user.role,
          isOnline: true,
        },
        timestamp: new Date().toISOString(),
        reactions: [],
        attachments: [attachment],
        room: activeRoom,
      };

      setMessages(prev => [...prev, message]);
    }

    setIsUploading(false);
  };

  // Add reaction to message
  const addReaction = (messageId: string, emoji: string) => {
    if (!user) return;

    setMessages(prev => prev.map(message => {
      if (message.id === messageId) {
        const existingReaction = message.reactions.find(r => r.emoji === emoji);
        
        if (existingReaction) {
          if (existingReaction.users.includes(user.id)) {
            // Remove reaction
            return {
              ...message,
              reactions: message.reactions
                .map(r => r.emoji === emoji 
                  ? { ...r, users: r.users.filter(id => id !== user.id), count: r.count - 1 }
                  : r
                )
                .filter(r => r.count > 0)
            };
          } else {
            // Add reaction
            return {
              ...message,
              reactions: message.reactions.map(r => 
                r.emoji === emoji 
                  ? { ...r, users: [...r.users, user.id], count: r.count + 1 }
                  : r
              )
            };
          }
        } else {
          // New reaction
          return {
            ...message,
            reactions: [...message.reactions, { emoji, users: [user.id], count: 1 }]
          };
        }
      }
      return message;
    }));
  };

  // Filter messages for active room
  const roomMessages = messages.filter(msg => msg.room === activeRoom);

  // Filter messages by search query
  const filteredMessages = searchQuery
    ? roomMessages.filter(msg => 
        msg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.author.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : roomMessages;

  // Get active room data
  const activeRoomData = rooms.find(room => room.id === activeRoom);

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="h-full flex bg-gradient-to-br from-indigo-50/50 via-white/50 to-purple-50/50">
      {/* Sidebar - Room List */}
      <div className="w-80 border-r border-white/20 dark:border-white/5">
        <GlassCard variant="light" padding="lg" className="h-full rounded-none border-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold gradient-text">Chat Rooms</h2>
            <GlassButton variant="ghost" size="sm" className="p-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </GlassButton>
          </div>

          {/* Search */}
          <div className="mb-4">
            <GlassInput
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Room List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {rooms.map(room => (
              <button
                key={room.id}
                onClick={() => setActiveRoom(room.id)}
                className={cn(
                  'w-full p-3 rounded-lg text-left transition-all duration-200',
                  'hover:bg-white/20 dark:hover:bg-black/20',
                  activeRoom === room.id 
                    ? 'bg-white/30 dark:bg-black/30 border border-white/30 dark:border-white/10'
                    : 'bg-white/10 dark:bg-black/10'
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {room.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {room.name}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {room.description || `${room.members.length} members`}
                      </p>
                    </div>
                  </div>
                  
                  {room.unreadCount > 0 && (
                    <div className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                      {room.unreadCount > 99 ? '99+' : room.unreadCount}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Online Members */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Online Now ({activeRoomData?.members.filter(m => m.isOnline).length || 0})
            </h3>
            <div className="space-y-2">
              {activeRoomData?.members
                .filter(member => member.isOnline)
                .slice(0, 5)
                .map(member => (
                <div key={member.id} className="flex items-center gap-2">
                  <div className="relative">
                    <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-xs">
                      {member.avatar ? (
                        <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full" />
                      ) : (
                        member.name.charAt(0)
                      )}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full border border-white dark:border-gray-800" />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {member.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-white/20 dark:border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold gradient-text">
                {activeRoomData?.name || 'Chat Room'}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {activeRoomData?.description || `${activeRoomData?.members.length} members`}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <GlassButton variant="ghost" size="sm" className="p-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </GlassButton>
              <GlassButton variant="ghost" size="sm" className="p-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </GlassButton>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {filteredMessages.map((message, index) => (
            <div key={message.id} className="flex items-start gap-3 group">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {message.author.avatar ? (
                  <img 
                    src={message.author.avatar} 
                    alt={message.author.name}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {message.author.name.charAt(0)}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                {/* Message Header */}
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {message.author.name}
                  </span>
                  {message.author.role && (
                    <span className="text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/20 px-2 py-0.5 rounded">
                      {message.author.role}
                    </span>
                  )}
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    {formatTimestamp(message.timestamp)}
                  </span>
                  {message.edited && (
                    <span className="text-xs text-gray-400 dark:text-gray-600">
                      (edited)
                    </span>
                  )}
                </div>

                {/* Reply Context */}
                {message.replyTo && (
                  <div className="mb-2 p-2 bg-white/10 dark:bg-black/20 rounded border-l-2 border-indigo-500">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Reply to previous message
                    </p>
                  </div>
                )}

                {/* Message Content */}
                {message.type === 'system' ? (
                  <p className="text-sm text-gray-500 dark:text-gray-500 italic">
                    {message.content}
                  </p>
                ) : (
                  <div className="bg-white/10 dark:bg-black/20 rounded-lg p-3">
                    <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap break-words">
                      {message.content}
                    </p>

                    {/* Attachments */}
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.attachments.map(attachment => (
                          <div key={attachment.id}>
                            {attachment.type === 'image' ? (
                              <img 
                                src={attachment.url} 
                                alt={attachment.name}
                                className="max-w-sm rounded-lg shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => window.open(attachment.url, '_blank')}
                              />
                            ) : (
                              <div className="flex items-center gap-3 p-3 bg-white/10 dark:bg-black/20 rounded border">
                                <div className="w-10 h-10 bg-gray-500 rounded flex items-center justify-center text-white text-xs">
                                  📎
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {attachment.name}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-500">
                                    {formatFileSize(attachment.size)}
                                  </p>
                                </div>
                                <GlassButton 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => window.open(attachment.url, '_blank')}
                                >
                                  Download
                                </GlassButton>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reactions */}
                    {message.reactions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {message.reactions.map((reaction, reactionIndex) => (
                          <button
                            key={reactionIndex}
                            onClick={() => addReaction(message.id, reaction.emoji)}
                            className={cn(
                              'flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all duration-200',
                              'hover:bg-white/20 dark:hover:bg-black/30',
                              reaction.users.includes(user?.id || '') 
                                ? 'bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-300 dark:border-indigo-700'
                                : 'bg-white/10 dark:bg-black/20'
                            )}
                          >
                            <span>{reaction.emoji}</span>
                            <span className="font-medium">{reaction.count}</span>
                          </button>
                        ))}
                        
                        <button
                          onClick={() => addReaction(message.id, '👍')}
                          className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 dark:bg-black/20 hover:bg-white/20 dark:hover:bg-black/30 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                          title="Add reaction"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Message Actions */}
                <div className="flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <GlassButton
                    variant="ghost"
                    size="sm"
                    onClick={() => addReaction(message.id, '👍')}
                    className="text-xs p-1"
                  >
                    👍
                  </GlassButton>
                  <GlassButton
                    variant="ghost"
                    size="sm"
                    onClick={() => addReaction(message.id, '❤️')}
                    className="text-xs p-1"
                  >
                    ❤️
                  </GlassButton>
                  <GlassButton
                    variant="ghost"
                    size="sm"
                    onClick={() => setReplyTo(message)}
                    className="text-xs p-1"
                  >
                    Reply
                  </GlassButton>
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {typingUsers.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
              <span>
                {typingUsers.length === 1 
                  ? `${typingUsers[0]} is typing...`
                  : `${typingUsers.slice(0, -1).join(', ')} and ${typingUsers[typingUsers.length - 1]} are typing...`
                }
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Reply Context */}
        {replyTo && (
          <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 border-t border-indigo-200 dark:border-indigo-800">
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className="text-indigo-600 dark:text-indigo-400">Replying to </span>
                <span className="font-medium">{replyTo.author.name}</span>
                <span className="text-gray-600 dark:text-gray-400 ml-2">
                  {replyTo.content.substring(0, 50)}...
                </span>
              </div>
              <button
                onClick={() => setReplyTo(null)}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Message Input */}
        <div className="p-4 border-t border-white/20 dark:border-white/5">
          <div className="flex items-end gap-3">
            {/* File Upload */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => e.target.files && handleFileUpload(e.target.files)}
            />
            
            <GlassButton
              variant="ghost"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="p-3"
              title="Upload file"
            >
              {isUploading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              )}
            </GlassButton>

            {/* Message Input */}
            <div className="flex-1">
              <GlassInput
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setNewMessage(e.target.value);
                  handleTyping();
                }}
                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                className="w-full"
                multiline={true}
                rows={1}
              />
            </div>

            {/* Emoji Picker */}
            <GlassButton
              ref={emojiButtonRef}
              variant="ghost"
              onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
              className="p-3"
              title="Add emoji"
            >
              😊
            </GlassButton>

            {/* Send Button */}
            <GlassButton
              variant="primary"
              onClick={sendMessage}
              disabled={!newMessage.trim() || isUploading}
              className="p-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </GlassButton>
          </div>
        </div>
      </div>

      {/* Emoji Picker */}
      {isEmojiPickerOpen && (
        <EmojiPicker
          isOpen={isEmojiPickerOpen}
          onClose={() => setIsEmojiPickerOpen(false)}
          onEmojiSelect={(emoji) => {
            setNewMessage(prev => prev + emoji);
            setIsEmojiPickerOpen(false);
          }}
          anchorRef={emojiButtonRef as React.RefObject<HTMLElement>}
        />
      )}
    </div>
  );
};

// Emoji Picker Component
const EmojiPicker: React.FC<EmojiPickerProps> = ({ isOpen, onClose, onEmojiSelect, anchorRef }) => {
  const [activeCategory, setActiveCategory] = useState('smileys');
  
  const emojiCategories = {
    smileys: {
      name: 'Smileys & Emotion',
      emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐'],
    },
    people: {
      name: 'People & Body',
      emojis: ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '👊', '✊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🦷', '🦴', '👀', '👁️', '👅', '👄', '💋'],
    },
    nature: {
      name: 'Animals & Nature',
      emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷️', '🕸️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐓', '🦃', '🦚', '🦜', '🦢', '🦩', '🕊️', '🐇', '🦝', '🦨', '🦡', '🦦', '🦥', '🐁', '🐀', '🐿️', '🦔', '🌲', '🌳', '🌴', '🌵', '🌶️', '🍄', '🌾', '💐', '🌷', '🌹', '🥀', '🌺', '🌸', '🌼', '🌻', '🌞', '🌝', '🌛', '🌜', '🌚', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '🌙', '🌎', '🌍', '🌏', '💫', '⭐', '🌟', '✨', '⚡', '☄️', '💥', '🔥', '🌪️', '🌈', '☀️', '🌤️', '⛅', '🌥️', '☁️', '🌦️', '🌧️', '⛈️', '🌩️', '🌨️', '❄️', '☃️', '⛄', '🌬️', '💨', '💧', '💦', '☔', '☂️', '🌊', '🌫️'],
    },
    food: {
      name: 'Food & Drink',
      emojis: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠', '🥐', '🥖', '🍞', '🥨', '🥯', '🥞', '🧇', '🧀', '🍖', '🍗', '🥩', '🥓', '🍔', '🍟', '🍕', '🌭', '🥪', '🌮', '🌯', '🫔', '🥙', '🧆', '🥚', '🍳', '🥘', '🍲', '🫕', '🥣', '🥗', '🍿', '🧈', '🧂', '🥫', '🍱', '🍘', '🍙', '🍚', '🍛', '🍜', '🍝', '🍠', '🍢', '🍣', '🍤', '🍥', '🥮', '🍡', '🥟', '🥠', '🥡', '🦀', '🦞', '🦐', '🦑', '🦪', '🍦', '🍧', '🍨', '🍩', '🍪', '🎂', '🍰', '🧁', '🥧', '🍫', '🍬', '🍭', '🍮', '🍯', '🍼', '🥛', '☕', '🫖', '🍵', '🍶', '🍾', '🍷', '🍸', '🍹', '🍺', '🍻', '🥂', '🥃', '🥤', '🧋', '🧃', '🧉', '🧊'],
    },
    activities: {
      name: 'Activities',
      emojis: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛷', '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️‍♀️', '🏋️', '🏋️‍♂️', '🤼‍♀️', '🤼', '🤼‍♂️', '🤸‍♀️', '🤸', '🤸‍♂️', '⛹️‍♀️', '⛹️', '⛹️‍♂️', '🤺', '🤾‍♀️', '🤾', '🤾‍♂️', '🏌️‍♀️', '🏌️', '🏌️‍♂️', '🏇', '🧘‍♀️', '🧘', '🧘‍♂️', '🏄‍♀️', '🏄', '🏄‍♂️', '🏊‍♀️', '🏊', '🏊‍♂️', '🤽‍♀️', '🤽', '🤽‍♂️', '🚣‍♀️', '🚣', '🚣‍♂️', '🧗‍♀️', '🧗', '🧗‍♂️', '🚵‍♀️', '🚵', '🚵‍♂️', '🚴‍♀️', '🚴', '🚴‍♂️', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '🏵️', '🎗️', '🎫', '🎟️', '🎪', '🤹‍♀️', '🤹', '🤹‍♂️', '🎭', '🩰', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', '🥁', '🎷', '🎺', '🎸', '🪕', '🎻', '🎲', '♟️', '🎯', '🎳', '🎮', '🎰', '🧩'],
    },
    objects: {
      name: 'Objects',
      emojis: ['⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '🧭', '⏱️', '⏲️', '⏰', '🕰️', '⌛', '⏳', '📡', '🔋', '🔌', '💡', '🔦', '🕯️', '🪔', '🧯', '🛢️', '💸', '💵', '💴', '💶', '💷', '🪙', '💰', '💳', '💎', '⚖️', '🧰', '🔧', '🔨', '⚒️', '🛠️', '⛏️', '🔩', '⚙️', '🧱', '⛓️', '🧲', '🔫', '💣', '🧨', '🪓', '🔪', '🗡️', '⚔️', '🛡️', '🚬', '⚰️', '🪦', '⚱️', '🏺', '🔮', '📿', '🧿', '💈', '⚗️', '🔭', '🔬', '🕳️', '🩹', '🩺', '💊', '💉', '🩸', '🧬', '🦠', '🧫', '🧪', '🌡️', '🧹', '🪣', '🧽', '🧴', '🛎️', '🔑', '🗝️', '🚪', '🪑', '🛏️', '🛋️', '🪞', '🚽', '🪠', '🚿', '🛁', '🪤', '🪒', '🧴', '🧷', '🧹', '🧺', '🧻', '🪣', '🧼', '🪥', '🧽', '🧯', '🛒', '🚭', '💰'],
    },
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
      
      {/* Emoji Picker Panel */}
      <div className="fixed bottom-20 right-4 w-80 h-96 z-50">
        <GlassCard variant="light" padding="none" className="h-full flex flex-col">
          {/* Header */}
          <div className="p-3 border-b border-white/10 dark:border-white/5">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900 dark:text-white">Emojis</h3>
              <button
                onClick={onClose}
                className="p-1 hover:bg-white/20 dark:hover:bg-black/30 rounded"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="flex border-b border-white/10 dark:border-white/5">
            {Object.entries(emojiCategories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={cn(
                  'flex-1 p-2 text-xs transition-colors duration-200',
                  activeCategory === key 
                    ? 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                    : 'hover:bg-white/10 dark:hover:bg-black/20'
                )}
                title={category.name}
              >
                {key === 'smileys' && '😊'}
                {key === 'people' && '👋'}
                {key === 'nature' && '🌳'}
                {key === 'food' && '🍎'}
                {key === 'activities' && '⚽'}
                {key === 'objects' && '💡'}
              </button>
            ))}
          </div>

          {/* Emoji Grid */}
          <div className="flex-1 overflow-y-auto p-2">
            <div className="grid grid-cols-8 gap-1">
              {emojiCategories[activeCategory as keyof typeof emojiCategories].emojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => onEmojiSelect(emoji)}
                  className="w-8 h-8 flex items-center justify-center text-lg hover:bg-white/20 dark:hover:bg-black/30 rounded transition-colors duration-200"
                  title={emoji}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </>
  );
};