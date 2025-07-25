import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  isMine: boolean;
  category: 'question' | 'sharing' | 'discussion' | 'advice';
}

interface CommunityChatProps {
  onBack: () => void;
  className?: string;
}

const mockMessages: Message[] = [
  {
    id: '1',
    author: '구름',
    content: '안녕하세요. 처음 불교 공부를 시작하려고 하는데, 어떤 책부터 읽으면 좋을까요? 마음가짐이나 수행법에 대해 배우고 싶어요.',
    timestamp: '30분 전',
    isMine: false,
    category: 'question'
  },
  {
    id: '2',
    author: '바람',
    content: '법정 스님의 "무소유"를 추천드려요. 쉽게 읽히면서도 깊은 깨달음을 주는 책이에요. 일상에서 실천할 수 있는 지혜가 많이 담겨 있습니다.',
    timestamp: '25분 전',
    isMine: false,
    category: 'advice'
  },
  {
    id: '3',
    author: '이슬',
    content: '저도 그 책으로 시작했어요! 현재 순간에 집중하는 법을 배울 수 있었습니다. 틱낫한 스님의 "지금 이 순간이 바로 당신의 인생입니다"도 좋아요.',
    timestamp: '20분 전',
    isMine: false,
    category: 'sharing'
  },
  {
    id: '4',
    author: '연꽃',
    content: '요즘 명상을 시작했는데, 잡념이 너무 많아서 집중이 안돼요. 어떻게 하면 마음을 고요하게 만들 수 있을까요?',
    timestamp: '15분 전',
    isMine: false,
    category: 'question'
  },
  {
    id: '5',
    author: '나무',
    content: '명상은 잡념을 없애는 것이 목적이 아니라, 잡념을 알아차리는 것이 중요해요. 숨에 집중하다가 딴 생각이 나면, 그것을 알아차리고 다시 숨으로 돌아오세요.',
    timestamp: '10분 전',
    isMine: false,
    category: 'advice'
  }
];

export const CommunityChat: React.FC<CommunityChatProps> = ({
  onBack,
  className = ""
}) => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Message['category']>('discussion');
  const [myNickname] = useState('새싹');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 메시지 추가 시 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        author: myNickname,
        content: newMessage.trim(),
        timestamp: '방금 전',
        isMine: true,
        category: selectedCategory
      };

      setMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // 포커스 다시 설정
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getAuthorColor = (author: string): string => {
    const colors = [
      'text-blue-600',
      'text-green-600', 
      'text-purple-600',
      'text-amber-600',
      'text-rose-600',
      'text-indigo-600',
      'text-emerald-600'
    ];
    const index = author.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  const getCategoryIcon = (category: Message['category']): string => {
    switch (category) {
      case 'question': return '❓';
      case 'sharing': return '🌱';
      case 'discussion': return '💬';
      case 'advice': return '💡';
      default: return '💬';
    }
  };

  const getCategoryLabel = (category: Message['category']): string => {
    switch (category) {
      case 'question': return '질문';
      case 'sharing': return '나눔';
      case 'discussion': return '대화';
      case 'advice': return '조언';
      default: return '대화';
    }
  };

  const categories: Message['category'][] = ['question', 'sharing', 'discussion', 'advice'];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 flex flex-col ${className}`}>
      {/* 헤더 */}
      <motion.header 
        className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-8 px-8 shadow-lg flex-shrink-0"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <motion.div
              className="text-4xl"
              animate={{ 
                rotateY: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotateY: { duration: 6, repeat: Infinity, ease: "linear" },
                scale: { duration: 3, repeat: Infinity, repeatType: "reverse" }
              }}
            >
              🙏
            </motion.div>
            <div>
              <h1 className="text-3xl font-light mb-1">불자 소통</h1>
              <p className="text-white/90 text-lg">동참들과 함께 마음을 나누는 공간</p>
            </div>
          </div>

          <motion.button
            onClick={onBack}
            className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 text-lg font-medium hover:bg-white/30 transition-all duration-300 border border-white/30"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ← 홈으로 돌아가기
          </motion.button>
        </div>
      </motion.header>

      {/* 메시지 영역 */}
      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                className={`flex ${message.isMine ? 'justify-end' : 'justify-start'}`}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: index * 0.05,
                  duration: 0.4,
                  ease: "easeOut"
                }}
              >
                <div className="max-w-2xl">
                  <div className={`flex items-center space-x-3 mb-2 ${
                    message.isMine ? 'justify-end' : 'justify-start'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getCategoryIcon(message.category)}</span>
                      <span className="text-xs text-gray-500 bg-white/70 backdrop-blur-sm px-2 py-1 rounded-full">
                        {getCategoryLabel(message.category)}
                      </span>
                    </div>
                    <span className={`text-sm font-medium ${getAuthorColor(message.author)}`}>
                      {message.author}
                    </span>
                    <span className="text-xs text-gray-400">{message.timestamp}</span>
                  </div>
                  
                  <motion.div
                    className={`rounded-3xl px-6 py-4 shadow-sm border ${
                      message.isMine
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-blue-200'
                        : 'bg-white/90 backdrop-blur-sm text-gray-800 border-white/60'
                    }`}
                    whileHover={{ 
                      y: -2,
                      scale: 1.01,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <p className="text-base leading-relaxed">{message.content}</p>
                    
                    {/* 반응 영역 */}
                    {!message.isMine && (
                      <div className="flex items-center space-x-4 mt-4 pt-3 border-t border-gray-100">
                        <motion.button
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors duration-200"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span className="text-lg">🙏</span>
                          <span className="text-sm font-medium">공감</span>
                          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                            {Math.floor(Math.random() * 20 + 3)}
                          </span>
                        </motion.button>
                        <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors duration-200">
                          <span className="text-lg">💬</span>
                          <span className="text-sm font-medium">답글</span>
                        </button>
                      </div>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />

            {/* 빈 상태 */}
            {messages.length === 0 && (
              <motion.div
                className="text-center py-20"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-8xl mb-6">🙏</div>
                <h3 className="text-2xl font-light text-gray-600 mb-2">
                  아직 대화가 시작되지 않았어요
                </h3>
                <p className="text-lg text-gray-500">
                  첫 번째 메시지를 남겨보세요
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* 입력 영역 */}
        <motion.div 
          className="flex-shrink-0 border-t border-white/60 bg-white/80 backdrop-blur-sm px-8 py-6"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="max-w-6xl mx-auto">
            {/* 카테고리 선택 */}
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-sm font-medium text-gray-600">대화 유형:</span>
              <div className="flex space-x-2">
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                      selectedCategory === category
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>{getCategoryIcon(category)}</span>
                    <span>{getCategoryLabel(category)}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* 메시지 입력 */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center shadow-inner">
                  <span className="text-blue-600 text-lg">🧘‍♀️</span>
                </div>
                <span className="text-sm font-medium text-blue-600">{myNickname}</span>
              </div>

              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="동참들과 나누고 싶은 마음을 적어보세요..."
                  rows={2}
                  className="w-full px-6 py-4 bg-white/90 backdrop-blur-sm border border-white/60 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-300 resize-none text-base leading-relaxed"
                />
                
                {newMessage.trim() && (
                  <motion.button
                    onClick={handleSendMessage}
                    className="absolute right-3 bottom-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl w-10 h-10 flex items-center justify-center hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-md"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <span className="text-lg">→</span>
                  </motion.button>
                )}
              </div>
            </div>

            {/* 안내 메시지 */}
            <div className="flex items-center justify-center mt-4 text-xs text-gray-500 space-x-6">
              <div className="flex items-center space-x-1">
                <span>🌸</span>
                <span>Enter로 전송</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>🕊️</span>
                <span>자비로운 마음으로 소통해요</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>🤍</span>
                <span>모든 대화는 익명으로 진행됩니다</span>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* 참여 인원 표시 */}
      <motion.div
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-white/60"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <div className="flex items-center space-x-3 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <motion.div 
              className="w-2 h-2 bg-green-400 rounded-full"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [1, 0.7, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            <span className="font-medium">{Math.floor(Math.random() * 25 + 12)}명</span>
          </div>
          <span>참여 중</span>
          <span className="text-lg">🕊️</span>
        </div>
      </motion.div>
    </div>
  );
};

export default CommunityChat;