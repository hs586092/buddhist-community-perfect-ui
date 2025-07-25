import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 명상 모드 컴포넌트
interface MeditationModeProps {
  isActive: boolean;
  onToggle: () => void;
  className?: string;
}

export const MeditationMode: React.FC<MeditationModeProps> = ({
  isActive,
  onToggle,
  className = ""
}) => {
  const [meditationTimer, setMeditationTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(10); // 분
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const meditationDurations = [5, 10, 15, 20, 30, 60]; // 분 단위

  useEffect(() => {
    if (isTimerActive && meditationTimer > 0) {
      intervalRef.current = setInterval(() => {
        setMeditationTimer(prev => {
          if (prev <= 1) {
            setIsTimerActive(false);
            // 명상 완료 알림
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('🧘‍♀️ 명상이 완료되었습니다', {
                body: '수고하셨습니다. 마음이 평안하시길 바랍니다.',
                icon: '🪷'
              });
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isTimerActive, meditationTimer]);

  useEffect(() => {
    if (isActive) {
      // 명상 모드 활성화 시 다크 테마 적용
      document.body.style.backgroundColor = '#1a1a1a';
      document.body.style.color = '#e0e0e0';
      
      // 알림 권한 요청
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    } else {
      // 명상 모드 비활성화 시 원래 테마로 복원
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
    }

    return () => {
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
    };
  }, [isActive]);

  const startMeditation = () => {
    setMeditationTimer(selectedDuration * 60);
    setIsTimerActive(true);
  };

  const stopMeditation = () => {
    setIsTimerActive(false);
    setMeditationTimer(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isActive) {
    return (
      <motion.button
        onClick={onToggle}
        className="fixed top-4 left-4 w-12 h-12 bg-purple-600 text-white rounded-full shadow-lg flex items-center justify-center z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="명상 모드"
      >
        <span className="text-lg">🧘‍♀️</span>
      </motion.button>
    );
  }

  return (
    <motion.div
      className={`fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 z-50 flex items-center justify-center ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 배경 만다라 패턴 */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(147, 51, 234, 0.1) 2px, transparent 2px),
              radial-gradient(circle at 80% 70%, rgba(147, 51, 234, 0.05) 3px, transparent 3px),
              radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: '150px 150px, 200px 200px, 100px 100px'
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* 명상 컨트롤 패널 */}
      <motion.div
        className="relative z-10 text-center text-white max-w-md mx-auto p-8"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-light dharma-text">명상 모드</h2>
          <motion.button
            onClick={onToggle}
            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="text-lg">✕</span>
          </motion.button>
        </div>

        {/* 연꽃 중앙 디스플레이 */}
        <motion.div
          className="relative mb-8"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 360]
          }}
          transition={{ 
            scale: { duration: 4, repeat: Infinity, repeatType: "reverse" },
            rotate: { duration: 20, repeat: Infinity, ease: "linear" }
          }}
        >
          <div className="text-8xl mb-4">🪷</div>
          
          {/* 타이머 표시 */}
          {meditationTimer > 0 && (
            <motion.div
              className="text-4xl font-light mb-4"
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {formatTime(meditationTimer)}
            </motion.div>
          )}
        </motion.div>

        {/* 명상 시간 선택 */}
        {!isTimerActive && meditationTimer === 0 && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-lg mb-4 dharma-text">명상 시간을 선택하세요</p>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {meditationDurations.map((duration) => (
                <motion.button
                  key={duration}
                  onClick={() => setSelectedDuration(duration)}
                  className={`py-3 px-4 rounded-2xl border border-white/30 backdrop-blur-sm transition-all duration-200 dharma-text ${
                    selectedDuration === duration
                      ? 'bg-white/30 text-white'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {duration}분
                </motion.button>
              ))}
            </div>
            
            <motion.button
              onClick={startMeditation}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl text-lg font-medium hover:from-purple-700 hover:to-purple-900 transition-all duration-200 dharma-text"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              🧘‍♀️ 명상 시작
            </motion.button>
          </motion.div>
        )}

        {/* 명상 진행 중 컨트롤 */}
        {isTimerActive && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-6">
              <div className="w-full bg-white/20 rounded-full h-2 mb-4">
                <motion.div
                  className="bg-gradient-to-r from-purple-400 to-purple-600 h-full rounded-full"
                  style={{ 
                    width: `${((selectedDuration * 60 - meditationTimer) / (selectedDuration * 60)) * 100}%` 
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-sm text-white/80 dharma-text">
                차분하게 호흡에 집중하세요
              </p>
            </div>
            
            <motion.button
              onClick={stopMeditation}
              className="py-3 px-8 bg-red-500/80 hover:bg-red-600/80 rounded-2xl transition-all duration-200 dharma-text"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              명상 종료
            </motion.button>
          </motion.div>
        )}

        {/* 명상 완료 */}
        {!isTimerActive && meditationTimer === 0 && selectedDuration > 0 && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-6xl mb-4">🙏</div>
            <p className="text-lg mb-4 dharma-text">명상이 완료되었습니다</p>
            <p className="text-sm text-white/80 dharma-text">
              마음이 평안하시길 바랍니다
            </p>
          </motion.div>
        )}

        {/* 호흡 가이드 */}
        <motion.div
          className="text-center"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <p className="text-sm text-white/60 dharma-text">
            들숨... 머무름... 날숨...
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// 감정 상태 체크인 컴포넌트
interface EmotionalCheckInProps {
  onComplete: (emotion: EmotionalState) => void;
  className?: string;
}

interface EmotionalState {
  emotion: string;
  intensity: number; // 1-5
  description: string;
  timestamp: Date;
  note?: string;
}

export const EmotionalCheckIn: React.FC<EmotionalCheckInProps> = ({
  onComplete,
  className = ""
}) => {
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');
  const [intensity, setIntensity] = useState<number>(3);
  const [note, setNote] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);

  const emotions = [
    { 
      name: '평화로운', 
      icon: '🕊️', 
      color: 'bg-blue-100 text-blue-700',
      description: '마음이 고요하고 안정된 상태'
    },
    { 
      name: '감사한', 
      icon: '🙏', 
      color: 'bg-amber-100 text-amber-700',
      description: '깊은 감사함을 느끼는 상태'
    },
    { 
      name: '자비로운', 
      icon: '💙', 
      color: 'bg-green-100 text-green-700',
      description: '모든 존재에 대한 자비심'
    },
    { 
      name: '지혜로운', 
      icon: '🧘‍♀️', 
      color: 'bg-purple-100 text-purple-700',
      description: '깨달음과 지혜를 체험하는 상태'
    },
    { 
      name: '고민중인', 
      icon: '💭', 
      color: 'bg-gray-100 text-gray-700',
      description: '마음에 번뇌나 고민이 있는 상태'
    },
    { 
      name: '불안한', 
      icon: '😰', 
      color: 'bg-red-100 text-red-700',
      description: '마음이 불안하고 어수선한 상태'
    },
    { 
      name: '희망적인', 
      icon: '✨', 
      color: 'bg-yellow-100 text-yellow-700',
      description: '미래에 대한 희망과 기대감'
    },
    { 
      name: '겸손한', 
      icon: '🙇‍♀️', 
      color: 'bg-indigo-100 text-indigo-700',
      description: '겸손하고 낮은 마음의 상태'
    }
  ];

  const getIntensityLabel = (level: number) => {
    const labels = ['약함', '조금', '보통', '강함', '매우 강함'];
    return labels[level - 1] || '보통';
  };

  const handleSubmit = () => {
    if (!selectedEmotion) return;

    const emotionalState: EmotionalState = {
      emotion: selectedEmotion,
      intensity,
      description: emotions.find(e => e.name === selectedEmotion)?.description || '',
      timestamp: new Date(),
      note: note.trim() || undefined
    };

    onComplete(emotionalState);
    setIsVisible(false);
    
    // 초기화
    setSelectedEmotion('');
    setIntensity(3);
    setNote('');
  };

  return (
    <>
      {/* 트리거 버튼 */}
      <motion.button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 left-4 w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-full shadow-lg flex items-center justify-center z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="마음 상태 체크인"
      >
        <span className="text-xl">💝</span>
      </motion.button>

      {/* 감정 체크인 모달 */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsVisible(false)}
          >
            <motion.div
              className={`bg-white rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto ${className}`}
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 헤더 */}
              <div className="text-center mb-8">
                <motion.div
                  className="text-6xl mb-4"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                >
                  💝
                </motion.div>
                <h2 className="text-2xl font-light text-gray-800 mb-2 dharma-text">
                  마음 상태 체크인
                </h2>
                <p className="text-gray-600 dharma-text">
                  지금 이 순간의 마음을 살펴보세요
                </p>
              </div>

              {/* 감정 선택 */}
              <div className="mb-8">
                <p className="text-lg font-medium text-gray-700 mb-4 dharma-text">
                  현재 어떤 감정을 느끼고 계시나요?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {emotions.map((emotion) => (
                    <motion.button
                      key={emotion.name}
                      onClick={() => setSelectedEmotion(emotion.name)}
                      className={`p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                        selectedEmotion === emotion.name
                          ? `${emotion.color} border-current`
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-2xl">{emotion.icon}</span>
                        <span className="font-medium dharma-text">{emotion.name}</span>
                      </div>
                      <p className="text-xs opacity-80 dharma-text">
                        {emotion.description}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* 강도 선택 */}
              {selectedEmotion && (
                <motion.div
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <p className="text-lg font-medium text-gray-700 mb-4 dharma-text">
                    그 감정의 강도는 어느 정도인가요?
                  </p>
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={intensity}
                      onChange={(e) => setIntensity(parseInt(e.target.value))}
                      className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${(intensity - 1) * 25}%, #e5e7eb ${(intensity - 1) * 25}%, #e5e7eb 100%)`
                      }}
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>약함</span>
                      <span>조금</span>
                      <span>보통</span>
                      <span>강함</span>
                      <span>매우 강함</span>
                    </div>
                    <div className="text-center">
                      <span className="inline-block bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-lg font-medium">
                        {getIntensityLabel(intensity)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 메모 작성 */}
              {selectedEmotion && (
                <motion.div
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <p className="text-lg font-medium text-gray-700 mb-4 dharma-text">
                    추가로 나누고 싶은 마음이 있다면 적어보세요 (선택사항)
                  </p>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="지금 이 감정에 대해 더 자세히 표현해보세요..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-amber-200 focus:border-amber-400 transition-all duration-300 resize-none dharma-text"
                  />
                </motion.div>
              )}

              {/* 버튼 영역 */}
              <div className="flex space-x-3">
                <motion.button
                  onClick={() => setIsVisible(false)}
                  className="flex-1 py-3 px-6 bg-gray-100 text-gray-700 rounded-2xl font-medium hover:bg-gray-200 transition-colors duration-200 dharma-text"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  취소
                </motion.button>
                <motion.button
                  onClick={handleSubmit}
                  disabled={!selectedEmotion}
                  className={`flex-1 py-3 px-6 rounded-2xl font-medium transition-all duration-200 dharma-text ${
                    selectedEmotion
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                  whileHover={{ scale: selectedEmotion ? 1.02 : 1 }}
                  whileTap={{ scale: selectedEmotion ? 0.98 : 1 }}
                >
                  기록하기
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// 자비로운 언어 필터
export const CompassionateLanguageFilter = {
  // 부정적 표현을 자비로운 표현으로 순화
  filterText: (text: string): string => {
    const negativeWords = [
      { negative: '싫다', positive: '마음에 맞지 않네요' },
      { negative: '짜증', positive: '약간 어려움을 느껴요' },
      { negative: '화나', positive: '마음이 불편해요' },
      { negative: '스트레스', positive: '마음의 부담' },
      { negative: '우울', positive: '마음이 무거워요' },
      { negative: '절망', positive: '희망을 찾고 있어요' },
      { negative: '못하겠', positive: '조금 더 시간이 필요해요' },
      { negative: '포기', positive: '잠시 쉬어가려 해요' },
      { negative: '바보', positive: '아직 배우는 중이에요' },
      { negative: '실패', positive: '다른 방법을 찾아볼게요' }
    ];

    let filteredText = text;
    negativeWords.forEach(({ negative, positive }) => {
      const regex = new RegExp(negative, 'gi');
      filteredText = filteredText.replace(regex, positive);
    });

    return filteredText;
  },

  // 자비로운 표현 제안
  suggestCompassionatePhrase: (emotion: string): string => {
    const suggestions: { [key: string]: string } = {
      '화난': '마음이 어수선하시군요. 잠시 깊게 숨을 고르시면 어떨까요?',
      '슬픈': '마음이 무거우시네요. 이 또한 지나갈 것입니다.',
      '불안': '마음이 불안하시군요. 현재 순간에 집중해보세요.',
      '외로운': '혼자가 아니에요. 많은 동참들이 함께하고 있어요.',
      '절망': '어둠 속에서도 희망의 씨앗은 자라납니다.',
      '스트레스': '마음의 부담을 조금씩 내려놓으세요.',
      '피곤': '충분한 휴식을 취하시길 바랍니다.'
    };

    return suggestions[emotion] || '모든 감정은 자연스러운 것입니다. 자비롭게 받아들이세요.';
  }
};

// 알림 최소화 시스템
export const MindfulNotificationManager = {
  // 불교적 시간대에 맞춘 알림 스케줄
  getOptimalNotificationTime: (): string[] => {
    return [
      '05:30', // 새벽 예불 시간
      '12:00', // 정오 - 마음챙김 시간
      '18:00', // 저녁 - 하루 성찰 시간
      '21:00'  // 밤 - 감사 인사 시간
    ];
  },

  // 알림 빈도 제한 (하루 최대 3개)
  shouldShowNotification: (lastNotificationTime?: Date): boolean => {
    if (!lastNotificationTime) return true;
    
    const now = new Date();
    const diffHours = (now.getTime() - lastNotificationTime.getTime()) / (1000 * 60 * 60);
    
    return diffHours >= 4; // 최소 4시간 간격
  },

  // 자비로운 알림 메시지
  getCompassionateMessage: (type: 'meditation' | 'gratitude' | 'mindfulness'): string => {
    const messages = {
      meditation: [
        '🧘‍♀️ 잠시 마음을 고요히 하는 시간은 어떠세요?',
        '🪷 5분간의 명상으로 마음의 평화를 찾아보세요.',
        '🕊️ 호흡에 집중하며 현재 순간을 느껴보세요.'
      ],
      gratitude: [
        '🙏 오늘 감사한 일들을 떠올려보세요.',
        '✨ 작은 것에도 감사할 수 있는 마음을 기려보세요.',
        '💙 주변의 소중한 것들에 감사를 표현해보세요.'
      ],
      mindfulness: [
        '🌸 지금 이 순간에 온전히 집중해보세요.',
        '🍃 마음챙김으로 하루를 마무리해보세요.',
        '🌅 새로운 시작에 마음을 열어보세요.'
      ]
    };

    const typeMessages = messages[type];
    return typeMessages[Math.floor(Math.random() * typeMessages.length)];
  }
};

export default {
  MeditationMode,
  EmotionalCheckIn,
  CompassionateLanguageFilter,
  MindfulNotificationManager
};