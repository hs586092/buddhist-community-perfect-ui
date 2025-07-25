import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SanghaMessage {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  isMine: boolean;
  messageType: 'question' | 'sharing' | 'advice' | 'discussion';
  buddhistLevel: '입문자' | '수행자' | '오랜불자';
  topic?: '수행법' | '사찰생활' | '일상고민' | '경전공부' | '기타';
  isAnonymous: boolean;
  hasMonkApproval?: boolean; // 스님 검토 필요 시
  warmReactions: {
    gratitude: number;    // 감사 🙏
    empathy: number;      // 공감 💙
    encouragement: number; // 응원 ✨
    wisdom: number;       // 지혜 🧘‍♀️
  };
  isHelpful?: boolean;     // 도움되는 답변 표시
}

interface EnhancedCommunityChatProps {
  onBack: () => void;
  className?: string;
}

const mockMessages: SanghaMessage[] = [
  {
    id: '1',
    author: '구름',
    content: '안녕하세요. 처음 불교 공부를 시작하려고 하는데, 어떤 책부터 읽으면 좋을까요? 마음가짐이나 수행법에 대해 배우고 싶어요. 너무 어려운 것보다는 쉽게 이해할 수 있는 것으로 추천해주시면 감사하겠습니다.',
    timestamp: '30분 전',
    isMine: false,
    messageType: 'question',
    buddhistLevel: '입문자',
    topic: '경전공부',
    isAnonymous: false,
    warmReactions: { gratitude: 8, empathy: 12, encouragement: 5, wisdom: 3 },
    hasMonkApproval: false
  },
  {
    id: '2',
    author: '지혜로운바람',
    content: '법정 스님의 "무소유"를 추천드려요. 쉽게 읽히면서도 깊은 깨달음을 주는 책이에요. 일상에서 실천할 수 있는 지혜가 많이 담겨 있습니다. 저도 처음에 이 책으로 시작했는데, 불교적 사고방식을 이해하는 데 큰 도움이 되었어요.',
    timestamp: '25분 전',
    isMine: false,
    messageType: 'advice',
    buddhistLevel: '수행자',
    topic: '경전공부',
    isAnonymous: false,
    warmReactions: { gratitude: 15, empathy: 8, encouragement: 12, wisdom: 18 },
    isHelpful: true
  },
  {
    id: '3',
    author: '연꽃마음',
    content: '저도 그 책으로 시작했어요! 현재 순간에 집중하는 법을 배울 수 있었습니다. 틱낫한 스님의 "지금 이 순간이 바로 당신의 인생입니다"도 추천해요. 마음챙김 수행에 대해 알기 쉽게 설명되어 있어요.',
    timestamp: '20분 전',
    isMine: false,
    messageType: 'sharing',
    buddhistLevel: '수행자',
    topic: '수행법',
    isAnonymous: false,
    warmReactions: { gratitude: 11, empathy: 16, encouragement: 9, wisdom: 14 }
  },
  {
    id: '4',
    author: '새벽종소리',
    content: '요즘 명상을 시작했는데, 잡념이 너무 많아서 집중이 안돼요. 앉아서 5분도 제대로 못하겠어요. 어떻게 하면 마음을 고요하게 만들 수 있을까요? 혹시 초보자를 위한 좋은 방법이 있을까요?',
    timestamp: '15분 전',
    isMine: false,
    messageType: 'question',
    buddhistLevel: '입문자',
    topic: '수행법',
    isAnonymous: false,
    warmReactions: { gratitude: 6, empathy: 22, encouragement: 18, wisdom: 2 }
  },
  {
    id: '5',
    author: '자비로운길',
    content: '명상은 잡념을 없애는 것이 목적이 아니라, 잡념을 알아차리는 것이 중요해요. 숨에 집중하다가 딴 생각이 나면, 그것을 알아차리고 다시 숨으로 돌아오세요. 처음에는 5분도 어렵지만, 조금씩 늘려가시면 됩니다. 자신을 너무 비판하지 마세요.',
    timestamp: '10분 전',
    isMine: false,
    messageType: 'advice',
    buddhistLevel: '오랜불자',
    topic: '수행법',
    isAnonymous: false,
    warmReactions: { gratitude: 28, empathy: 15, encouragement: 25, wisdom: 32 },
    isHelpful: true,
    hasMonkApproval: true
  },
  {
    id: '6',
    author: '고요한마음',
    content: '오늘 사찰에서 108배를 하고 왔는데, 정말 마음이 맑아지는 느낌이었어요. 몸은 힘들었지만 마음은 한결 가벼워졌습니다. 여러분도 기회가 되시면 108배 수행을 해보세요.',
    timestamp: '5분 전',
    isMine: false,
    messageType: 'sharing',
    buddhistLevel: '수행자',
    topic: '사찰생활',
    isAnonymous: false,
    warmReactions: { gratitude: 9, empathy: 12, encouragement: 15, wisdom: 8 }
  }
];

// 불자 레벨별 아이콘과 색상
const getBuddhistLevelIcon = (level: string) => {
  switch (level) {
    case '입문자': return { icon: '🌱', color: 'text-green-600', bgColor: 'bg-green-100' };
    case '수행자': return { icon: '🧘‍♀️', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    case '오랜불자': return { icon: '🪷', color: 'text-purple-600', bgColor: 'bg-purple-100' };
    default: return { icon: '🙏', color: 'text-gray-600', bgColor: 'bg-gray-100' };
  }
};

// 메시지 타입별 아이콘
const getMessageTypeIcon = (type: string) => {
  switch (type) {
    case 'question': return '❓';
    case 'sharing': return '🌸';
    case 'advice': return '💡';
    case 'discussion': return '💬';
    default: return '💬';
  }
};

// 토픽별 아이콘
const getTopicIcon = (topic: string) => {
  switch (topic) {
    case '수행법': return '🧘‍♀️';
    case '사찰생활': return '🏛️';
    case '일상고민': return '💭';
    case '경전공부': return '📿';
    case '기타': return '💬';
    default: return '💬';
  }
};

export const EnhancedCommunityChat: React.FC<EnhancedCommunityChatProps> = ({
  onBack,
  className = ""
}) => {
  const [messages, setMessages] = useState<SanghaMessage[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [selectedMessageType, setSelectedMessageType] = useState<SanghaMessage['messageType']>('discussion');
  const [selectedTopic, setSelectedTopic] = useState<SanghaMessage['topic']>('기타');
  const [selectedBuddhistLevel, setSelectedBuddhistLevel] = useState<SanghaMessage['buddhistLevel']>('입문자');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [myNickname] = useState('새싹');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 메시지 추가 시 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: SanghaMessage = {
        id: Date.now().toString(),
        author: isAnonymous ? '익명의 불자' : myNickname,
        content: newMessage.trim(),
        timestamp: '방금 전',
        isMine: true,
        messageType: selectedMessageType,
        buddhistLevel: selectedBuddhistLevel,
        topic: selectedTopic,
        isAnonymous: isAnonymous,
        warmReactions: { gratitude: 0, empathy: 0, encouragement: 0, wisdom: 0 }
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
      'text-emerald-600',
      'text-orange-600'
    ];
    const index = author.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  const handleWarmReaction = (messageId: string, reactionType: keyof SanghaMessage['warmReactions']) => {
    setMessages(prev => prev.map(message => 
      message.id === messageId 
        ? { 
            ...message, 
            warmReactions: {
              ...message.warmReactions,
              [reactionType]: message.warmReactions[reactionType] + 1
            }
          }
        : message
    ));
  };

  const messageTypes: SanghaMessage['messageType'][] = ['question', 'sharing', 'advice', 'discussion'];
  const topics: (SanghaMessage['topic'])[] = ['수행법', '사찰생활', '일상고민', '경전공부', '기타'];
  const buddhistLevels: SanghaMessage['buddhistLevel'][] = ['입문자', '수행자', '오랜불자'];

  const getMessageTypeLabel = (type: SanghaMessage['messageType']) => {
    switch (type) {
      case 'question': return '질문';
      case 'sharing': return '나눔';
      case 'advice': return '조언';
      case 'discussion': return '대화';
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50/80 via-cyan-50/60 to-sky-50/40 flex flex-col ${className}`}>
      {/* 헤더 */}
      <motion.header 
        className="bg-gradient-to-r from-blue-600/90 to-cyan-500/90 backdrop-blur-md text-white py-8 px-8 shadow-xl border-b border-white/20 flex-shrink-0"
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
                rotateY: { duration: 8, repeat: Infinity, ease: "linear" },
                scale: { duration: 4, repeat: Infinity, repeatType: "reverse" }
              }}
            >
              🙏
            </motion.div>
            <div>
              <h1 className="text-3xl font-light mb-1 dharma-text">불자 소통</h1>
              <p className="text-white/90 text-lg dharma-text">동참들과 함께 마음을 나누는 자비로운 공간</p>
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

      {/* 소통 가이드라인 */}
      <motion.div 
        className="bg-gradient-to-r from-blue-100/60 to-cyan-100/60 backdrop-blur-sm border-b border-blue-200/50 px-8 py-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center space-x-8 text-sm text-blue-700">
            <div className="flex items-center space-x-2">
              <span>🤲</span>
              <span className="dharma-text">자비로운 마음으로</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🙏</span>
              <span className="dharma-text">예의바른 소통</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>💙</span>
              <span className="dharma-text">서로 격려하며</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🕊️</span>
              <span className="dharma-text">평화로운 대화</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 메시지 영역 */}
      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="max-w-6xl mx-auto space-y-8">
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
                <div className="max-w-3xl">
                  {/* 메시지 헤더 */}
                  <div className={`flex items-center space-x-3 mb-3 ${
                    message.isMine ? 'justify-end' : 'justify-start'
                  }`}>
                    {/* 불자 레벨 표시 */}
                    {!message.isMine && (
                      <div className={`flex items-center space-x-2 ${getBuddhistLevelIcon(message.buddhistLevel).bgColor} px-3 py-1 rounded-full`}>
                        <span className="text-lg">{getBuddhistLevelIcon(message.buddhistLevel).icon}</span>
                        <span className={`text-sm font-medium ${getBuddhistLevelIcon(message.buddhistLevel).color}`}>
                          {message.buddhistLevel}
                        </span>
                      </div>
                    )}

                    {/* 메시지 타입 및 토픽 */}
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getMessageTypeIcon(message.messageType)}</span>
                      <span className="text-xs text-white bg-blue-500/80 backdrop-blur-sm px-2 py-1 rounded-full">
                        {getMessageTypeLabel(message.messageType)}
                      </span>
                      {message.topic && (
                        <>
                          <span className="text-lg">{getTopicIcon(message.topic)}</span>
                          <span className="text-xs text-white bg-green-500/80 backdrop-blur-sm px-2 py-1 rounded-full">
                            {message.topic}
                          </span>
                        </>
                      )}
                    </div>

                    {/* 작성자 및 시간 */}
                    <span className={`text-sm font-medium ${getAuthorColor(message.author)}`}>
                      {message.author}
                    </span>
                    <span className="text-xs text-gray-400">{message.timestamp}</span>

                    {/* 스님 검토 마크 */}
                    {message.hasMonkApproval && (
                      <div className="flex items-center space-x-1 bg-amber-100 px-2 py-1 rounded-full">
                        <span className="text-xs">🏛️</span>
                        <span className="text-xs font-medium text-amber-700">스님 검토</span>
                      </div>
                    )}

                    {/* 도움되는 답변 표시 */}
                    {message.isHelpful && (
                      <div className="flex items-center space-x-1 bg-green-100 px-2 py-1 rounded-full">
                        <span className="text-xs">✨</span>
                        <span className="text-xs font-medium text-green-700">도움답변</span>
                      </div>
                    )}
                  </div>
                  
                  {/* 메시지 내용 */}
                  <motion.div
                    className={`rounded-3xl px-6 py-5 shadow-sm border zen-card ${
                      message.isMine
                        ? 'bg-gradient-to-r from-blue-500/90 to-cyan-500/90 backdrop-blur-md text-white border-blue-200'
                        : 'bg-white/90 backdrop-blur-sm text-gray-800 border-white/60'
                    }`}
                    whileHover={{ 
                      y: -2,
                      scale: 1.01,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <p className="text-base leading-relaxed dharma-text">{message.content}</p>
                    
                    {/* 따뜻한 반응 영역 (내 메시지가 아닐 때만) */}
                    {!message.isMine && (
                      <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-4">
                          {/* 감사 반응 */}
                          <motion.button
                            onClick={() => handleWarmReaction(message.id, 'gratitude')}
                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors duration-200 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-full"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <span className="text-lg">🙏</span>
                            <span className="text-sm font-medium">감사</span>
                            <span className="bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                              {message.warmReactions.gratitude}
                            </span>
                          </motion.button>

                          {/* 공감 반응 */}
                          <motion.button
                            onClick={() => handleWarmReaction(message.id, 'empathy')}
                            className="flex items-center space-x-1 text-green-600 hover:text-green-700 transition-colors duration-200 bg-green-50 hover:bg-green-100 px-3 py-2 rounded-full"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <span className="text-lg">💙</span>
                            <span className="text-sm font-medium">공감</span>
                            <span className="bg-green-200 text-green-800 px-2 py-0.5 rounded-full text-xs">
                              {message.warmReactions.empathy}
                            </span>
                          </motion.button>

                          {/* 응원 반응 */}
                          <motion.button
                            onClick={() => handleWarmReaction(message.id, 'encouragement')}
                            className="flex items-center space-x-1 text-amber-600 hover:text-amber-700 transition-colors duration-200 bg-amber-50 hover:bg-amber-100 px-3 py-2 rounded-full"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <span className="text-lg">✨</span>
                            <span className="text-sm font-medium">응원</span>
                            <span className="bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full text-xs">
                              {message.warmReactions.encouragement}
                            </span>
                          </motion.button>

                          {/* 지혜 반응 */}
                          <motion.button
                            onClick={() => handleWarmReaction(message.id, 'wisdom')}
                            className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 transition-colors duration-200 bg-purple-50 hover:bg-purple-100 px-3 py-2 rounded-full"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <span className="text-lg">🧘‍♀️</span>
                            <span className="text-sm font-medium">지혜</span>
                            <span className="bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full text-xs">
                              {message.warmReactions.wisdom}
                            </span>
                          </motion.button>
                        </div>

                        {/* 답글 버튼 */}
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
                <h3 className="text-2xl font-light text-gray-600 mb-2 dharma-text">
                  아직 대화가 시작되지 않았어요
                </h3>
                <p className="text-lg text-gray-500 dharma-text">
                  첫 번째 메시지를 남겨보세요
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* 입력 영역 */}
        <motion.div 
          className="flex-shrink-0 border-t border-white/60 bg-white/80 backdrop-blur-md px-8 py-6"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="max-w-6xl mx-auto">
            {/* 설정 영역 */}
            <div className="flex flex-wrap items-center gap-4 mb-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200">
              {/* 메시지 타입 */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-600">타입:</span>
                {messageTypes.map((type) => (
                  <motion.button
                    key={type}
                    onClick={() => setSelectedMessageType(type)}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                      selectedMessageType === type
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>{getMessageTypeIcon(type)}</span>
                    <span>{getMessageTypeLabel(type)}</span>
                  </motion.button>
                ))}
              </div>

              {/* 주제 */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-600">주제:</span>
                {topics.map((topic) => (
                  <motion.button
                    key={topic}
                    onClick={() => setSelectedTopic(topic)}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                      selectedTopic === topic
                        ? 'bg-green-500 text-white shadow-md'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>{getTopicIcon(topic)}</span>
                    <span>{topic}</span>
                  </motion.button>
                ))}
              </div>

              {/* 불자 레벨 */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-600">레벨:</span>
                {buddhistLevels.map((level) => (
                  <motion.button
                    key={level}
                    onClick={() => setSelectedBuddhistLevel(level)}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                      selectedBuddhistLevel === level
                        ? `${getBuddhistLevelIcon(level).bgColor} ${getBuddhistLevelIcon(level).color} shadow-md`
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>{getBuddhistLevelIcon(level).icon}</span>
                    <span>{level}</span>
                  </motion.button>
                ))}
              </div>

              {/* 익명 옵션 */}
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-sm font-medium text-gray-700">🤫 익명</span>
              </label>
            </div>

            {/* 메시지 입력 */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 flex-shrink-0">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${getBuddhistLevelIcon(selectedBuddhistLevel).bgColor}`}>
                  <span className="text-xl">{getBuddhistLevelIcon(selectedBuddhistLevel).icon}</span>
                </div>
                <span className="text-sm font-medium text-blue-600 dharma-text">
                  {isAnonymous ? '익명의 불자' : myNickname}
                </span>
              </div>

              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="동참들과 나누고 싶은 마음을 자비롭게 적어보세요..."
                  rows={2}
                  className="w-full px-6 py-4 bg-white/90 backdrop-blur-sm border border-white/60 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-300 resize-none text-base leading-relaxed dharma-text zen-textarea"
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
                <span className="dharma-text">Enter로 전송</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>🤲</span>
                <span className="dharma-text">자비로운 마음으로 소통해요</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>🙏</span>
                <span className="dharma-text">모든 대화는 예의를 지켜주세요</span>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* 참여 불자 현황 */}
      <motion.div
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-white/60"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <motion.div 
              className="w-2 h-2 bg-green-400 rounded-full"
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [1, 0.6, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            <span className="font-medium dharma-text">{Math.floor(Math.random() * 35 + 15)}명</span>
          </div>
          <span className="dharma-text">동참 중</span>
          <div className="flex items-center space-x-1">
            <span className="text-green-600">🌱</span>
            <span className="text-xs">{Math.floor(Math.random() * 8 + 3)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-blue-600">🧘‍♀️</span>
            <span className="text-xs">{Math.floor(Math.random() * 15 + 8)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-purple-600">🪷</span>
            <span className="text-xs">{Math.floor(Math.random() * 12 + 4)}</span>
          </div>
          <span className="text-lg">🕊️</span>
        </div>
      </motion.div>
    </div>
  );
};

export default EnhancedCommunityChat;