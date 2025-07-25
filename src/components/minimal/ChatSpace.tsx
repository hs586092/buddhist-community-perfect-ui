import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  isAnonymous: boolean;
}

interface ChatSpaceProps {
  onBack: () => void;
  className?: string;
}

export const ChatSpace: React.FC<ChatSpaceProps> = ({
  onBack,
  className = ""
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      author: '구름',
      content: '안녕하세요. 처음 불교 공부를 시작하려고 하는데, 어떤 책부터 읽으면 좋을까요?',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), 
      isAnonymous: true
    },
    {
      id: '2',
      author: '바람',
      content: '법정 스님의 "무소유"를 추천드려요. 쉽게 읽히면서도 깊은 깨달음을 주는 책이에요.',
      timestamp: new Date(Date.now() - 1000 * 60 * 25),
      isAnonymous: true
    },
    {
      id: '3',
      author: '이슬',
      content: '저도 그 책으로 시작했어요! 현재 순간에 집중하는 법을 배울 수 있었습니다.',
      timestamp: new Date(Date.now() - 1000 * 60 * 20),
      isAnonymous: true
    },
    {
      id: '4',
      author: '달빛',
      content: '요즘 일상에서 화가 자주 나는데, 어떻게 마음을 다스려야 할까요?',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      isAnonymous: true
    },
    {
      id: '5', 
      author: '연꽃',
      content: '화가 날 때는 먼저 깊게 숨을 세 번 쉬어보세요. 그리고 "이 또한 지나가리"라고 마음속으로 외워보세요.',
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      isAnonymous: true  
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [myNickname] = useState('나무');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 새 메시지가 추가될 때 스크롤 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 컴포넌트 마운트 시 입력창 포커스
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        author: myNickname,
        content: newMessage.trim(),
        timestamp: new Date(),
        isAnonymous: true
      };

      setMessages(prev => [...prev, message]);
      setNewMessage('');
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return '방금 전';
    if (diffMinutes < 60) return `${diffMinutes}분 전`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}시간 전`;
    return date.toLocaleDateString();
  };

  const getAuthorColor = (author: string) => {
    const colors = [
      'text-blue-600', 'text-green-600', 'text-purple-600', 
      'text-amber-600', 'text-rose-600', 'text-teal-600'
    ];
    const index = author.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  return (
    <div className={`min-h-screen bg-zen-white flex flex-col ${className}`}>
      {/* 헤더 */}
      <motion.header 
        className="bg-sangha-blue text-white py-6 px-8 flex-shrink-0"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div
              className="text-3xl"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            >
              🙏
            </motion.div>
            <div>
              <h1 className="text-2xl font-light">불자 소통</h1>
              <p className="text-white/80 text-sm">동참들과 함께 마음을 나누는 공간</p>
            </div>
          </div>

          <button
            onClick={onBack}
            className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium hover:bg-white/30 transition-colors"
          >
            ← 홈으로
          </button>
        </div>
      </motion.header>

      {/* 메시지 영역 */}
      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="max-w-4xl mx-auto space-y-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  className={`flex ${message.author === myNickname ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className={`max-w-lg ${message.author === myNickname ? 'order-2' : 'order-1'}`}>
                    {/* 작성자 정보 */}
                    <div className={`flex items-center space-x-2 mb-1 ${
                      message.author === myNickname ? 'justify-end' : 'justify-start'
                    }`}>
                      <span className={`text-sm font-medium ${getAuthorColor(message.author)}`}>
                        {message.author}
                      </span>
                      <span className="text-xs text-meditation-gray/60">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>

                    {/* 메시지 내용 */}
                    <motion.div
                      className={`rounded-2xl px-4 py-3 ${
                        message.author === myNickname
                          ? 'bg-sangha-blue text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* 입력 영역 */}
        <motion.div 
          className="flex-shrink-0 border-t border-gray-200 bg-white/80 backdrop-blur-sm px-8 py-4"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-4">
              {/* 내 닉네임 표시 */}
              <div className="flex items-center space-x-2 flex-shrink-0">
                <div className="w-8 h-8 bg-sangha-blue/10 rounded-full flex items-center justify-center">
                  <span className="text-sangha-blue text-sm">🧘‍♀️</span>
                </div>
                <span className="text-sm font-medium text-sangha-blue">{myNickname}</span>
              </div>

              {/* 메시지 입력 */}
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="동참들과 나누고 싶은 마음을 적어보세요..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-sangha-blue/50 focus:border-sangha-blue focus:bg-white transition-all"
                />
                
                {newMessage.trim() && (
                  <motion.button
                    onClick={handleSendMessage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-sangha-blue text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-sangha-blue/90 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <span className="text-sm">→</span>
                  </motion.button>
                )}
              </div>
            </div>

            {/* 입력 안내 */}
            <div className="flex items-center justify-center mt-3 text-xs text-meditation-gray/60 space-x-4">
              <span>• Enter로 전송</span>
              <span>• 자비로운 마음으로 소통해요</span>
              <span>• 익명으로 대화됩니다</span>
            </div>
          </div>
        </motion.div>
      </main>

      {/* 참여 인원 표시 (하단 고정) */}
      <motion.div 
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center space-x-2 text-sm text-meditation-gray">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>{Math.floor(Math.random() * 15 + 8)}명</span>
          </div>
          <span>참여 중</span>
          <span className="text-xs">🕊️</span>
        </div>
      </motion.div>
    </div>
  );
};

export default ChatSpace;