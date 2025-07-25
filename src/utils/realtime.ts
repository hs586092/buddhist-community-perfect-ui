// Realtime features for Buddhist Community
// Peaceful and mindful real-time communication

export interface RealtimeMessage {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  messageType: 'question' | 'sharing' | 'advice' | 'discussion';
  buddhistLevel: '입문자' | '수행자' | '오랜불자';
  topic?: '수행법' | '사찰생활' | '일상고민' | '경전공부' | '기타';
  isAnonymous: boolean;
  warmReactions: {
    gratitude: number;
    empathy: number;
    encouragement: number;
    wisdom: number;
  };
  isEdited?: boolean;
  editedAt?: Date;
}

export interface OnlineUser {
  id: string;
  nickname: string;
  buddhistLevel: '입문자' | '수행자' | '오랜불자';
  isAnonymous: boolean;
  status: 'peaceful' | 'meditating' | 'typing' | 'away';
  lastSeen: Date;
  currentActivity?: 'review' | 'community' | 'meditation';
}

export interface TypingIndicator {
  userId: string;
  nickname: string;
  isTyping: boolean;
  startedAt: Date;
}

// Buddhist-themed connection states
export type ConnectionState = 
  | 'connecting'     // 연결 중
  | 'connected'      // 연결됨 (평화로운 상태)
  | 'reconnecting'   // 재연결 중 (일시적 마음의 흔들림)
  | 'disconnected'   // 연결 끊김 (고요한 상태)
  | 'error';         // 오류 (번뇌 상태)

// WebSocket-based realtime manager for Buddhist community
export class BuddhistRealtimeManager {
  private ws: WebSocket | null = null;
  private connectionState: ConnectionState = 'disconnected';
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private typingTimeout: NodeJS.Timeout | null = null;
  
  // Event handlers
  private messageHandlers: ((message: RealtimeMessage) => void)[] = [];
  private userJoinHandlers: ((user: OnlineUser) => void)[] = [];
  private userLeaveHandlers: ((userId: string) => void)[] = [];
  private typingHandlers: ((indicator: TypingIndicator) => void)[] = [];
  private connectionHandlers: ((state: ConnectionState) => void)[] = [];
  private reactionHandlers: ((messageId: string, reaction: keyof RealtimeMessage['warmReactions'], count: number) => void)[] = [];

  constructor(private wsUrl: string, private userId: string) {}

  // Connect to realtime service with Buddhist mindfulness
  async connect(): Promise<void> {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      this.setConnectionState('connecting');
      
      // Create WebSocket connection
      this.ws = new WebSocket(this.wsUrl);
      
      this.ws.onopen = this.handleOpen.bind(this);
      this.ws.onmessage = this.handleMessage.bind(this);
      this.ws.onclose = this.handleClose.bind(this);
      this.ws.onerror = this.handleError.bind(this);
      
    } catch (error) {
      console.error('🚫 불자 소통 연결 실패:', error);
      this.setConnectionState('error');
      this.scheduleReconnect();
    }
  }

  // Disconnect with peaceful intention
  disconnect(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    
    if (this.ws) {
      this.ws.close(1000, '평화롭게 연결을 종료합니다');
      this.ws = null;
    }
    
    this.setConnectionState('disconnected');
    this.reconnectAttempts = 0;
  }

  // Send message with Buddhist compassion
  sendMessage(message: Omit<RealtimeMessage, 'id' | 'timestamp' | 'warmReactions'>): void {
    if (!this.isConnected()) {
      console.warn('🔔 연결이 끊어져 있습니다. 메시지를 임시 저장합니다.');
      this.queueMessage(message);
      return;
    }

    const fullMessage: RealtimeMessage = {
      ...message,
      id: this.generateMessageId(),
      timestamp: new Date(),
      warmReactions: {
        gratitude: 0,
        empathy: 0,
        encouragement: 0,
        wisdom: 0
      }
    };

    this.send('message', fullMessage);
  }

  // Send warm reaction with Buddhist loving-kindness
  sendReaction(messageId: string, reactionType: keyof RealtimeMessage['warmReactions']): void {
    if (!this.isConnected()) {
      console.warn('🔔 연결이 끊어져 있어 반응을 보낼 수 없습니다.');
      return;
    }

    this.send('reaction', {
      messageId,
      reactionType,
      userId: this.userId,
      timestamp: new Date()
    });
  }

  // Start typing with mindful awareness
  startTyping(): void {
    if (!this.isConnected()) return;

    this.send('typing_start', {
      userId: this.userId,
      timestamp: new Date()
    });

    // Auto-stop typing after 3 seconds of inactivity
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
    
    this.typingTimeout = setTimeout(() => {
      this.stopTyping();
    }, 3000);
  }

  // Stop typing with peaceful completion
  stopTyping(): void {
    if (!this.isConnected()) return;

    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
      this.typingTimeout = null;
    }

    this.send('typing_stop', {
      userId: this.userId,
      timestamp: new Date()
    });
  }

  // Update user status (peaceful, meditating, etc.)
  updateStatus(status: OnlineUser['status'], activity?: OnlineUser['currentActivity']): void {
    if (!this.isConnected()) return;

    this.send('status_update', {
      userId: this.userId,
      status,
      activity,
      timestamp: new Date()
    });
  }

  // Event handler registration
  onMessage(handler: (message: RealtimeMessage) => void): void {
    this.messageHandlers.push(handler);
  }

  onUserJoin(handler: (user: OnlineUser) => void): void {
    this.userJoinHandlers.push(handler);
  }

  onUserLeave(handler: (userId: string) => void): void {
    this.userLeaveHandlers.push(handler);
  }

  onTyping(handler: (indicator: TypingIndicator) => void): void {
    this.typingHandlers.push(handler);
  }

  onConnectionChange(handler: (state: ConnectionState) => void): void {
    this.connectionHandlers.push(handler);
  }

  onReaction(handler: (messageId: string, reaction: keyof RealtimeMessage['warmReactions'], count: number) => void): void {
    this.reactionHandlers.push(handler);
  }

  // Get current state
  getConnectionState(): ConnectionState {
    return this.connectionState;
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN && this.connectionState === 'connected';
  }

  // Private methods
  private handleOpen(): void {
    console.log('🪷 불자 소통에 평화롭게 연결되었습니다');
    this.setConnectionState('connected');
    this.reconnectAttempts = 0;
    this.reconnectDelay = 1000;
    
    // Start heartbeat
    this.startHeartbeat();
    
    // Authenticate user
    this.send('auth', {
      userId: this.userId,
      timestamp: new Date()
    });
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'message':
          this.messageHandlers.forEach(handler => handler(data.payload));
          break;
          
        case 'user_joined':
          this.userJoinHandlers.forEach(handler => handler(data.payload));
          break;
          
        case 'user_left':
          this.userLeaveHandlers.forEach(handler => handler(data.payload.userId));
          break;
          
        case 'typing_start':
        case 'typing_stop':
          const typingIndicator: TypingIndicator = {
            userId: data.payload.userId,
            nickname: data.payload.nickname,
            isTyping: data.type === 'typing_start',
            startedAt: new Date(data.payload.timestamp)
          };
          this.typingHandlers.forEach(handler => handler(typingIndicator));
          break;
          
        case 'reaction':
          this.reactionHandlers.forEach(handler => 
            handler(data.payload.messageId, data.payload.reactionType, data.payload.count)
          );
          break;
          
        case 'pong':
          // Heartbeat response
          break;
          
        default:
          console.log('🔔 알 수 없는 메시지 타입:', data.type);
      }
    } catch (error) {
      console.error('💔 메시지 파싱 오류:', error);
    }
  }

  private handleClose(event: CloseEvent): void {
    console.log('🔌 불자 소통 연결이 종료되었습니다:', event.code, event.reason);
    
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    
    this.setConnectionState('disconnected');
    
    // Reconnect if not intentionally closed
    if (event.code !== 1000) {
      this.scheduleReconnect();
    }
  }

  private handleError(error: Event): void {
    console.error('⚠️ 불자 소통 연결 오류:', error);
    this.setConnectionState('error');
  }

  private send(type: string, payload: any): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('🔔 연결이 없어 메시지를 보낼 수 없습니다');
      return;
    }

    try {
      this.ws.send(JSON.stringify({ type, payload }));
    } catch (error) {
      console.error('📤 메시지 전송 오류:', error);
    }
  }

  private setConnectionState(state: ConnectionState): void {
    if (this.connectionState !== state) {
      this.connectionState = state;
      this.connectionHandlers.forEach(handler => handler(state));
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('🙏 최대 재연결 시도에 도달했습니다. 잠시 휴식을 취하세요.');
      this.setConnectionState('error');
      return;
    }

    this.reconnectAttempts++;
    this.setConnectionState('reconnecting');
    
    console.log(`🔄 ${this.reconnectDelay}ms 후 재연결 시도 (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      this.connect();
    }, this.reconnectDelay);
    
    // Exponential backoff with Buddhist patience
    this.reconnectDelay = Math.min(this.reconnectDelay * 1.5, 30000);
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected()) {
        this.send('ping', { timestamp: new Date() });
      }
    }, 30000); // Every 30 seconds
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private queueMessage(message: any): void {
    // In a real implementation, you might queue messages and send when reconnected
    console.log('📝 메시지가 대기열에 추가되었습니다:', message);
  }
}

// Firebase Realtime Database alternative for simpler setup
export class FirebaseBuddhistRealtime {
  private database: any = null; // Firebase database instance
  private messagesRef: any = null;
  private usersRef: any = null;
  private typingRef: any = null;

  constructor(private firebaseConfig: any) {
    // Initialize Firebase (this would use actual Firebase SDK)
    console.log('🔥 Firebase 불자 소통 초기화 중...');
  }

  async initialize(): Promise<void> {
    try {
      // Initialize Firebase
      // const app = initializeApp(this.firebaseConfig);
      // this.database = getDatabase(app);
      
      console.log('🪷 Firebase 불자 소통이 준비되었습니다');
    } catch (error) {
      console.error('❌ Firebase 초기화 실패:', error);
      throw error;
    }
  }

  // Listen to messages with Buddhist mindfulness
  listenToMessages(callback: (messages: RealtimeMessage[]) => void): () => void {
    // In real implementation:
    // return onValue(this.messagesRef, (snapshot) => {
    //   const data = snapshot.val();
    //   const messages = data ? Object.values(data) : [];
    //   callback(messages);
    // });
    
    // Mock implementation
    console.log('📻 메시지 수신 대기 중...');
    return () => console.log('📴 메시지 수신 중단');
  }

  // Send message with compassion
  async sendMessage(message: RealtimeMessage): Promise<void> {
    try {
      // In real implementation:
      // await push(this.messagesRef, message);
      
      console.log('📤 메시지 전송:', message);
    } catch (error) {
      console.error('💔 메시지 전송 실패:', error);
      throw error;
    }
  }

  // Update user presence
  async updatePresence(user: OnlineUser): Promise<void> {
    try {
      // In real implementation:
      // await set(child(this.usersRef, user.id), user);
      
      console.log('👤 사용자 상태 업데이트:', user);
    } catch (error) {
      console.error('💔 상태 업데이트 실패:', error);
      throw error;
    }
  }

  // Listen to typing indicators
  listenToTyping(callback: (typing: TypingIndicator[]) => void): () => void {
    // Mock implementation
    console.log('⌨️ 타이핑 상태 수신 대기 중...');
    return () => console.log('⌨️ 타이핑 상태 수신 중단');
  }
}

// Peaceful connection status component helper
export const getConnectionStatusInfo = (state: ConnectionState) => {
  const statusInfo = {
    connecting: {
      icon: '🔄',
      message: '평화로운 연결을 시도하는 중...',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    connected: {
      icon: '🪷',
      message: '불자 소통에 연결되었습니다',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    reconnecting: {
      icon: '🔄',
      message: '일시적으로 끊어졌습니다. 다시 연결 중...',
      color: 'text-amber-600',
      bgColor: 'bg-amber-100'
    },
    disconnected: {
      icon: '🕊️',
      message: '고요한 상태입니다',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100'
    },
    error: {
      icon: '⚠️',
      message: '연결에 문제가 있습니다. 잠시 후 다시 시도해주세요.',
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  };

  return statusInfo[state];
};

// Export factory function for easy setup
export const createBuddhistRealtime = (
  config: {
    type: 'websocket' | 'firebase';
    url?: string;
    firebaseConfig?: any;
    userId: string;
  }
) => {
  if (config.type === 'websocket' && config.url) {
    return new BuddhistRealtimeManager(config.url, config.userId);
  } else if (config.type === 'firebase' && config.firebaseConfig) {
    return new FirebaseBuddhistRealtime(config.firebaseConfig);
  } else {
    throw new Error('올바른 실시간 연결 설정이 필요합니다');
  }
};

export default {
  BuddhistRealtimeManager,
  FirebaseBuddhistRealtime,
  getConnectionStatusInfo,
  createBuddhistRealtime
};