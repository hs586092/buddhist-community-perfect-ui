// 💬 불자 소통 커뮤니티 타입 정의

export interface User {
  id: string;
  nickname: string;
  avatar: string;
  level: '초심자' | '수행자' | '오랜 신자';
  joinDate: string;
  isOnline: boolean;
}

export interface Message {
  id: string;
  author: User;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'emoji';
  replyTo?: string; // 답글일 경우 원본 메시지 ID
  reactions: {
    emoji: string;
    count: number;
    users: string[]; // 반응한 사용자 ID 목록
  }[];
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  emoji: string;
  color: string;
  messageCount: number;
  onlineUsers: number;
  lastActivity: string;
}

export interface ChatRoom {
  id: string;
  topic: Topic;
  messages: Message[];
  onlineUsers: User[];
  isActive: boolean;
}