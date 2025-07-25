import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MobileOptimizedApp } from './MobileOptimizedApp';
import { MeditationMode, EmotionalCheckIn, CompassionateLanguageFilter, MindfulNotificationManager } from './BuddhistFeatures';

type ViewState = 'home' | 'review' | 'community';

interface EmotionalState {
  emotion: string;
  intensity: number;
  description: string;
  timestamp: Date;
  note?: string;
}

interface FinalBuddhistAppProps {
  className?: string;
}

export const FinalBuddhistApp: React.FC<FinalBuddhistAppProps> = ({
  className = ""
}) => {
  const [isMeditationMode, setIsMeditationMode] = useState(false);
  const [emotionalHistory, setEmotionalHistory] = useState<EmotionalState[]>([]);
  const [lastNotificationTime, setLastNotificationTime] = useState<Date | undefined>();
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  // 첫 방문 감지 및 환영 메시지
  useEffect(() => {
    const hasVisited = localStorage.getItem('buddhist-app-visited');
    if (!hasVisited) {
      setIsFirstVisit(true);
      localStorage.setItem('buddhist-app-visited', 'true');
    } else {
      setIsFirstVisit(false);
    }

    // 감정 기록 불러오기
    const savedEmotions = localStorage.getItem('buddhist-app-emotions');
    if (savedEmotions) {
      try {
        const parsed = JSON.parse(savedEmotions).map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
        setEmotionalHistory(parsed);
      } catch (error) {
        console.error('감정 기록 로드 실패:', error);
      }
    }

    // 마지막 알림 시간 불러오기
    const lastNotification = localStorage.getItem('buddhist-app-last-notification');
    if (lastNotification) {
      setLastNotificationTime(new Date(lastNotification));
    }
  }, []);

  // 감정 상태 기록 저장
  useEffect(() => {
    if (emotionalHistory.length > 0) {
      localStorage.setItem('buddhist-app-emotions', JSON.stringify(emotionalHistory));
    }
  }, [emotionalHistory]);

  // 마음챙김 알림 시스템
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isMeditationMode && MindfulNotificationManager.shouldShowNotification(lastNotificationTime)) {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
        
        const optimalTimes = MindfulNotificationManager.getOptimalNotificationTime();
        
        if (optimalTimes.includes(currentTime)) {
          const messageType = currentHour < 12 ? 'mindfulness' : 
                             currentHour < 18 ? 'meditation' : 'gratitude';
          
          const message = MindfulNotificationManager.getCompassionateMessage(messageType);
          
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('🪷 불교 커뮤니티', {
              body: message,
              icon: '🪷',
              silent: true, // 조용한 알림
              tag: 'buddhist-mindfulness'
            });
            
            setLastNotificationTime(now);
            localStorage.setItem('buddhist-app-last-notification', now.toISOString());
          }
        }
      }
    }, 60000); // 1분마다 체크

    return () => clearInterval(interval);
  }, [isMeditationMode, lastNotificationTime]);

  // 알림 권한 요청
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      // 사용자가 앱을 충분히 체험한 후 권한 요청
      setTimeout(() => {
        Notification.requestPermission();
      }, 30000); // 30초 후
    }
  }, []);

  const handleEmotionalCheckIn = (emotionalState: EmotionalState) => {
    setEmotionalHistory(prev => [emotionalState, ...prev.slice(0, 9)]); // 최근 10개만 보관
    
    // 감정에 따른 자비로운 메시지 표시
    const suggestion = CompassionateLanguageFilter.suggestCompassionatePhrase(emotionalState.emotion);
    
    // 토스트 알림으로 표시 (실제 구현에서는 토스트 라이브러리 사용)
    console.log('자비로운 메시지:', suggestion);
  };

  const getEmotionalInsight = (): string => {
    if (emotionalHistory.length === 0) return '';
    
    const recentEmotions = emotionalHistory.slice(0, 3);
    const positiveEmotions = ['평화로운', '감사한', '자비로운', '지혜로운', '희망적인'];
    const positiveCount = recentEmotions.filter(e => positiveEmotions.includes(e.emotion)).length;
    
    if (positiveCount >= 2) {
      return '최근 마음의 평화를 많이 느끼고 계시네요. 이 상태를 유지하시길 바랍니다.';
    } else if (positiveCount === 1) {
      return '조금씩 마음의 안정을 찾아가고 계시군요. 꾸준히 수행해보세요.';
    } else {
      return '마음이 어려우신 시기인 것 같네요. 명상이나 경전 읽기를 권해드립니다.';
    }
  };

  return (
    <div className={`relative min-h-screen ${className}`}>
      {/* Phase 3 CSS 적용 */}
      <style jsx global>{`
        @import url('/src/styles/phase3-buddhist.css');
      `}</style>

      {/* 첫 방문 환영 메시지 */}
      <AnimatePresence>
        {isFirstVisit && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFirstVisit(false)}
          >
            <motion.div
              className="bg-white rounded-3xl p-8 max-w-md w-full text-center"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                className="text-8xl mb-6"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                🪷
              </motion.div>
              
              <h2 className="text-2xl font-light text-gray-800 mb-4 dharma-text">
                불교 커뮤니티에 오신 것을 환영합니다
              </h2>
              
              <p className="text-gray-600 mb-6 leading-relaxed dharma-text">
                이곳은 법회 리뷰와 불자 소통을 위한 자비로운 공간입니다.<br />
                마음의 평화를 함께 나누어요.
              </p>

              <div className="space-y-4 mb-6 text-sm text-gray-500 dharma-text">
                <div className="flex items-center space-x-2">
                  <span>🧘‍♀️</span>
                  <span>명상 모드로 마음의 고요함을 경험하세요</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>💝</span>
                  <span>감정 체크인으로 마음 상태를 기록하세요</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🤲</span>
                  <span>자비로운 언어로 소통해주세요</span>
                </div>
              </div>
              
              <motion.button
                onClick={() => setIsFirstVisit(false)}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-200 dharma-text"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                🙏 시작하기
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 명상 모드 */}
      <MeditationMode
        isActive={isMeditationMode}
        onToggle={() => setIsMeditationMode(!isMeditationMode)}
      />

      {/* 감정 체크인 */}
      {!isMeditationMode && (
        <EmotionalCheckIn onComplete={handleEmotionalCheckIn} />
      )}

      {/* 메인 앱 (명상 모드가 아닐 때만) */}
      {!isMeditationMode && (
        <MobileOptimizedApp />
      )}

      {/* 감정 인사이트 표시 (하단) */}
      {!isMeditationMode && emotionalHistory.length > 0 && (
        <motion.div
          className="fixed bottom-20 right-4 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-200 max-w-xs z-30"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <div className="flex items-start space-x-3">
            <motion.span 
              className="text-2xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🌸
            </motion.span>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">마음 상태 인사이트</p>
              <p className="text-xs text-gray-600 leading-relaxed dharma-text">
                {getEmotionalInsight()}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* 개발자 정보 (우하단 작은 텍스트) */}
      <div className="fixed bottom-2 right-2 text-xs text-gray-400 z-10">
        <span className="dharma-text">🪷 Made with compassion</span>
      </div>
    </div>
  );
};

export default FinalBuddhistApp;