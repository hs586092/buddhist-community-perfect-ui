import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '../../services/AuthService';

interface Message {
  messageId: string;
  userId: string;
  username: string;
  content: string;
  messageType: 'question' | 'sharing' | 'advice' | 'discussion' | 'meditation';
  isAnonymous: boolean;
  timestamp: string;
  reactions: Record<string, number>;
}

interface CommunityChatProps {
  user: User | null;
  onBack: () => void;
}

export const CommunityChat: React.FC<CommunityChatProps> = ({ user, onBack }) => {
  const [currentRoom, setCurrentRoom] = useState<string>('general');
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [messageType, setMessageType] = useState<Message['messageType']>('discussion');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Array<{ userId: string; username: string; status: string }>>([]);
  const [isTyping, setIsTyping] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const rooms = [
    { id: 'general', name: '일반', icon: '💬', description: '자유로운 대화' },
    { id: 'meditation', name: '명상', icon: '🧘‍♀️', description: '명상과 수행' },
    { id: 'dharma', name: '법문', icon: '📿', description: '법문과 가르침' },
    { id: 'beginners', name: '초심자', icon: '🌱', description: '불교 입문' },
    { id: 'temple-reviews', name: '사찰 후기', icon: '🏛️', description: '사찰 경험 공유' }
  ];

  const messageTypes = [
    { value: 'discussion', label: '일반 대화', icon: '💬' },
    { value: 'question', label: '질문', icon: '❓' },
    { value: 'sharing', label: '경험 나눔', icon: '🤝' },
    { value: 'advice', label: '조언 구함', icon: '💡' },
    { value: 'meditation', label: '명상 관련', icon: '🧘‍♀️' }
  ];

  // 초기 샘플 메시지
  useEffect(() => {
    const sampleMessages: Message[] = [
      {
        messageId: '1',
        userId: 'sample1',
        username: '평화로운마음',
        content: '안녕하세요! 오늘 처음 명상을 시작해보려는데, 어떤 방법이 좋을까요?',
        messageType: 'question',
        isAnonymous: false,
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        reactions: { '🙏': 3, '💚': 1 }
      },
      {
        messageId: '2',
        userId: 'sample2',
        username: '명상의달인',
        content: '호흡에 집중하는 것부터 시작해보세요. 코로 들이쉬고 입으로 내쉬면서 마음을 고요히 해보세요. 처음에는 5분부터 시작하시면 됩니다.',
        messageType: 'advice',
        isAnonymous: false,
        timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
        reactions: { '🙏': 5, '💡': 2, '❤️': 1 }
      },
      {
        messageId: '3',
        userId: 'sample3',
        username: '익명',
        content: '저도 비슷한 고민이 있었는데, 매일 조금씩이라도 꾸준히 하는 것이 중요한 것 같아요. 완벽하지 않아도 괜찮습니다.',
        messageType: 'sharing',
        isAnonymous: true,
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        reactions: { '🙏': 2, '💚': 3 }
      }
    ];
    
    setMessages(sampleMessages);
  }, [currentRoom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!user || !newMessage.trim()) return;

    const message: Message = {
      messageId: Date.now().toString(),
      userId: user.userId,
      username: isAnonymous ? '익명' : user.username,
      content: newMessage.trim(),
      messageType,
      isAnonymous,
      timestamp: new Date().toISOString(),
      reactions: {}
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleReaction = (messageId: string, reaction: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.messageId === messageId) {
        const currentCount = msg.reactions[reaction] || 0;
        return {
          ...msg,
          reactions: {
            ...msg.reactions,
            [reaction]: currentCount + 1
          }
        };
      }
      return msg;
    }));
  };

  const getMessageTypeIcon = (type: Message['messageType']) => {
    const typeMap = {
      'discussion': '💬',
      'question': '❓',
      'sharing': '🤝',
      'advice': '💡',
      'meditation': '🧘‍♀️'
    };
    return typeMap[type];
  };

  const getMessageTypeColor = (type: Message['messageType']) => {
    const colorMap = {
      'discussion': 'bg-gray-100 text-gray-700',
      'question': 'bg-blue-100 text-blue-700',
      'sharing': 'bg-green-100 text-green-700',
      'advice': 'bg-yellow-100 text-yellow-700',
      'meditation': 'bg-purple-100 text-purple-700'
    };
    return colorMap[type];
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return '방금 전';
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`;
    return date.toLocaleDateString();
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 text-center">
        <span className="text-6xl mb-4 block">🔒</span>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">로그인이 필요합니다</h1>
        <p className="text-gray-600 mb-8">불자 소통을 위해서는 로그인이 필요합니다.</p>
        <button
          onClick={onBack}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen lotus-gradient">
      {/* 네비게이션 */}
      <div className="bg-white/70 backdrop-blur-lg border-b border-gray-200/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="text-gray-700 hover:text-gray-900"
              >
                ← 홈으로
              </button>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">💬</span>
                <h1 className="text-lg font-semibold text-gray-900">불자 소통</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user.username}님 ({user.buddhistLevel})
              </span>
              <div className="flex items-center space-x-1 text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>온라인</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex gap-8">
        {/* 사이드바 - 방 목록 */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 sticky top-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">대화방</h3>
            <div className="space-y-2">
              {rooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => setCurrentRoom(room.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    currentRoom === room.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{room.icon}</span>
                    <div>
                      <div className="font-medium">{room.name}</div>
                      <div className="text-xs text-gray-500">{room.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* 온라인 사용자 */}
            <div className="mt-8">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">온라인 불자 (3)</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>평화로운마음</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>명상의달인</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>{user.username}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 메인 채팅 영역 */}
        <div className="flex-1 flex flex-col">
          {/* 현재 방 헤더 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-t-2xl p-6 border border-gray-200/50 border-b-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{rooms.find(r => r.id === currentRoom)?.icon}</span>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {rooms.find(r => r.id === currentRoom)?.name}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {rooms.find(r => r.id === currentRoom)?.description}
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                온라인 3명
              </div>
            </div>
          </div>

          {/* 메시지 영역 */}
          <div className="flex-1 bg-white/60 backdrop-blur-sm border border-gray-200/50 border-t-0 border-b-0 p-6 overflow-y-auto max-h-96">
            <div className="space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.messageId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`flex ${message.userId === user.userId ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md ${
                      message.userId === user.userId ? 'chat-message own' : 'chat-message'
                    } p-4`}>
                      {/* 메시지 헤더 */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">
                            {message.isAnonymous ? '익명' : message.username}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${getMessageTypeColor(message.messageType)}`}>
                            {getMessageTypeIcon(message.messageType)}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>

                      {/* 메시지 내용 */}
                      <p className="text-gray-800 mb-3">{message.content}</p>

                      {/* 반응 버튼 */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {Object.entries(message.reactions).map(([reaction, count]) => (
                            <button
                              key={reaction}
                              onClick={() => handleReaction(message.messageId, reaction)}
                              className="flex items-center space-x-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full px-2 py-1 transition-colors"
                            >
                              <span>{reaction}</span>
                              <span>{count}</span>
                            </button>
                          ))}
                        </div>
                        <div className="flex space-x-1">
                          {['🙏', '💚', '💡', '❤️'].map((reaction) => (
                            <button
                              key={reaction}
                              onClick={() => handleReaction(message.messageId, reaction)}
                              className="text-sm hover:scale-110 transition-transform"
                            >
                              {reaction}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* 메시지 입력 영역 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-b-2xl p-6 border border-gray-200/50">
            {/* 메시지 타입 선택 */}
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-sm text-gray-600">메시지 타입:</span>
              <select
                value={messageType}
                onChange={(e) => setMessageType(e.target.value as Message['messageType'])}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {messageTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
              <div className="flex items-center space-x-2 ml-4">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="anonymous" className="text-sm text-gray-600">
                  익명으로 전송
                </label>
              </div>
            </div>

            {/* 메시지 입력 */}
            <div className="flex space-x-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="따뜻한 마음으로 메시지를 입력하세요..."
                className="flex-1 px-4 py-3 bg-white/70 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                전송
              </button>
            </div>

            {/* 채팅 안내 */}
            <div className="mt-4 text-xs text-gray-500 text-center">
              🙏 불자님들과 따뜻하고 자비로운 대화를 나누어 주세요
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};