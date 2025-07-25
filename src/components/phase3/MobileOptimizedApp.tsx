import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { EnhancedReviewSpace } from './EnhancedReviewSpace';
import { EnhancedCommunityChat } from './EnhancedCommunityChat';

type ViewState = 'home' | 'review' | 'community';

interface MobileOptimizedAppProps {
  className?: string;
}

// 스와이프 감지를 위한 커스텀 훅
const useSwipeGesture = (onSwipeLeft?: () => void, onSwipeRight?: () => void) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragStart = () => setIsDragging(true);
  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);
    const swipeThreshold = 100;
    
    if (Math.abs(info.offset.x) > swipeThreshold) {
      if (info.offset.x > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (info.offset.x < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    }
  };
  
  return { isDragging, handleDragStart, handleDragEnd };
};

// 음성 입력을 위한 커스텀 훅
const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // 음성 인식 API 체크 (브라우저 지원 여부)
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'ko-KR';

      recognitionRef.current.onresult = (event: any) => {
        const result = event.results[0][0].transcript;
        setTranscript(result);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return { isListening, transcript, startListening, stopListening };
};

// 글자 크기 조절 훅
const useFontSizeControl = () => {
  const [fontSize, setFontSize] = useState(16);
  
  useEffect(() => {
    const savedFontSize = localStorage.getItem('buddhist-app-font-size');
    if (savedFontSize) {
      setFontSize(parseInt(savedFontSize));
    }
  }, []);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
    localStorage.setItem('buddhist-app-font-size', fontSize.toString());
  }, [fontSize]);

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 2, 24));
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 12));
  };

  const resetFontSize = () => {
    setFontSize(16);
  };

  return { fontSize, increaseFontSize, decreaseFontSize, resetFontSize };
};

// 모바일 홈 선택 컴포넌트
const MobileHomeChoice: React.FC<{
  onReviewSelect: () => void;
  onCommunitySelect: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}> = ({ onReviewSelect, onCommunitySelect, onSwipeLeft, onSwipeRight }) => {
  const [hoveredChoice, setHoveredChoice] = useState<'review' | 'community' | null>(null);
  const { isDragging, handleDragStart, handleDragEnd } = useSwipeGesture(onSwipeLeft, onSwipeRight);

  return (
    <motion.div 
      className="min-h-screen bg-white flex flex-col touch-manipulation"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* 헤더 - 모바일 최적화 */}
      <motion.header 
        className="text-center py-8 px-4"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          className="text-6xl sm:text-7xl mb-4"
          animate={{ 
            scale: [1, 1.08, 1],
            rotateZ: [0, 2, -2, 0]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        >
          🪷
        </motion.div>
        <h1 className="text-2xl sm:text-3xl font-light text-gray-700 mb-2 dharma-text">
          불교 커뮤니티
        </h1>
        <p className="text-base sm:text-lg text-gray-500 dharma-text">
          두 가지 길 중 하나를 선택하세요
        </p>
        
        {/* 스와이프 안내 */}
        <motion.div 
          className="mt-4 text-sm text-gray-400 flex items-center justify-center space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <span>←</span>
          <span className="dharma-text">좌우로 스와이프하여 이동</span>
          <span>→</span>
        </motion.div>
      </motion.header>

      {/* 메인 2-Choice 영역 - 모바일 최적화 */}
      <main className="flex-1 flex flex-col sm:flex-row relative">
        {/* 법회 리뷰 영역 */}
        <motion.section
          className={`flex-1 relative cursor-pointer transition-all duration-700 ease-out min-h-[300px] sm:min-h-auto ${
            hoveredChoice === 'review' ? 'flex-[1.15]' : 'flex-1'
          }`}
          style={{ 
            background: 'linear-gradient(135deg, #D4A574 0%, #E6B885 100%)',
            minHeight: window.innerWidth < 640 ? '50vh' : 'auto'
          }}
          onTouchStart={() => setHoveredChoice('review')}
          onTouchEnd={() => setHoveredChoice(null)}
          onClick={onReviewSelect}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* 터치 친화적 배경 패턴 */}
          <div className="absolute inset-0 opacity-15">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 20% 30%, rgba(255,255,255,0.4) 3px, transparent 3px),
                  radial-gradient(circle at 70% 80%, rgba(255,255,255,0.3) 3px, transparent 3px)
                `,
                backgroundSize: '60px 60px, 80px 80px'
              }}
            />
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center h-full text-white p-6 sm:p-12">
            <motion.div
              className="text-7xl sm:text-9xl mb-6 sm:mb-8"
              animate={{ 
                y: hoveredChoice === 'review' ? [-8, 8, -8] : [0],
                rotateX: hoveredChoice === 'review' ? [0, 5, -5, 0] : [0]
              }}
              transition={{ 
                duration: 3, 
                repeat: hoveredChoice === 'review' ? Infinity : 0,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            >
              📿
            </motion.div>

            <h2 className="text-3xl sm:text-5xl font-light mb-4 sm:mb-6 text-center leading-tight dharma-text">
              법회 리뷰
            </h2>
            
            <p className="text-lg sm:text-2xl text-white/90 text-center max-w-sm leading-relaxed mb-6 sm:mb-8 dharma-text">
              사찰별 법회 경험을<br />
              나누고 기록합니다
            </p>

            {/* 터치 영역 확대를 위한 버튼 */}
            <motion.div
              className="bg-white/25 backdrop-blur-md rounded-full px-6 py-4 text-base sm:text-lg font-medium border border-white/30 min-h-[44px] flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              법회 리뷰 시작하기 →
            </motion.div>
          </div>
        </motion.section>

        {/* 가운데 구분선 - 모바일에서는 가로선 */}
        <div className="w-full h-2 sm:w-2 sm:h-auto bg-gray-100 relative z-20 flex sm:block items-center justify-center">
          <motion.div
            className="w-8 h-8 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-gray-50"
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 30, repeat: Infinity, ease: "linear" },
              scale: { duration: 4, repeat: Infinity, repeatType: "reverse" }
            }}
          >
            <span className="text-gray-600 text-base sm:text-xl">🕉️</span>
          </motion.div>
        </div>

        {/* 불자 소통 영역 */}
        <motion.section
          className={`flex-1 relative cursor-pointer transition-all duration-700 ease-out min-h-[300px] sm:min-h-auto ${
            hoveredChoice === 'community' ? 'flex-[1.15]' : 'flex-1'
          }`}
          style={{ 
            background: 'linear-gradient(135deg, #6B9DC2 0%, #7BADD4 100%)',
            minHeight: window.innerWidth < 640 ? '50vh' : 'auto'
          }}
          onTouchStart={() => setHoveredChoice('community')}
          onTouchEnd={() => setHoveredChoice(null)}
          onClick={onCommunitySelect}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* 터치 친화적 배경 패턴 */}
          <div className="absolute inset-0 opacity-15">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 80% 20%, rgba(255,255,255,0.4) 3px, transparent 3px),
                  radial-gradient(circle at 30% 70%, rgba(255,255,255,0.3) 3px, transparent 3px)
                `,
                backgroundSize: '70px 70px, 90px 90px'
              }}
            />
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center h-full text-white p-6 sm:p-12">
            <motion.div
              className="text-7xl sm:text-9xl mb-6 sm:mb-8"
              animate={{ 
                y: hoveredChoice === 'community' ? [-8, 8, -8] : [0],
                rotateX: hoveredChoice === 'community' ? [0, -5, 5, 0] : [0]
              }}
              transition={{ 
                duration: 3, 
                repeat: hoveredChoice === 'community' ? Infinity : 0,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            >
              🙏
            </motion.div>

            <h2 className="text-3xl sm:text-5xl font-light mb-4 sm:mb-6 text-center leading-tight dharma-text">
              불자 소통
            </h2>
            
            <p className="text-lg sm:text-2xl text-white/90 text-center max-w-sm leading-relaxed mb-6 sm:mb-8 dharma-text">
              동참들과 함께<br />
              마음을 나눕니다
            </p>

            {/* 터치 영역 확대를 위한 버튼 */}
            <motion.div
              className="bg-white/25 backdrop-blur-md rounded-full px-6 py-4 text-base sm:text-lg font-medium border border-white/30 min-h-[44px] flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              불자 소통 시작하기 →
            </motion.div>
          </div>
        </motion.section>
      </main>

      {/* 하단 안내 */}
      <motion.footer 
        className="text-center py-6 px-4 bg-gray-50/80 backdrop-blur-sm"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <div className="flex items-center justify-center space-x-3 text-gray-500">
          <span className="text-xl sm:text-2xl">🕊️</span>
          <span className="text-base sm:text-lg font-light dharma-text">마음 편하신 곳으로 들어가세요</span>
          <span className="text-xl sm:text-2xl">🕊️</span>
        </div>
      </motion.footer>
    </motion.div>
  );
};

// 접근성 도구 모음
const AccessibilityToolbar: React.FC<{
  fontSize: number;
  onIncreaseFontSize: () => void;
  onDecreaseFontSize: () => void;
  onResetFontSize: () => void;
  isListening: boolean;
  onStartVoice: () => void;
  onStopVoice: () => void;
}> = ({ 
  fontSize, 
  onIncreaseFontSize, 
  onDecreaseFontSize, 
  onResetFontSize,
  isListening,
  onStartVoice,
  onStopVoice
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* 접근성 도구 토글 버튼 */}
      <motion.button
        onClick={() => setIsVisible(!isVisible)}
        className="w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center mb-2"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <span className="text-lg">♿</span>
      </motion.button>

      {/* 접근성 도구 패널 */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-gray-200 space-y-3"
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* 글자 크기 조절 */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">글자 크기</p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={onDecreaseFontSize}
                  className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center text-gray-700 hover:bg-gray-300"
                >
                  A-
                </button>
                <span className="text-sm text-gray-600 min-w-[40px] text-center">{fontSize}px</span>
                <button
                  onClick={onIncreaseFontSize}
                  className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center text-gray-700 hover:bg-gray-300"
                >
                  A+
                </button>
                <button
                  onClick={onResetFontSize}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs hover:bg-blue-200"
                >
                  초기화
                </button>
              </div>
            </div>

            {/* 음성 입력 */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">음성 입력</p>
              <button
                onClick={isListening ? onStopVoice : onStartVoice}
                className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isListening 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {isListening ? '🎤 녹음 중지' : '🎤 음성 입력'}
              </button>
            </div>

            {/* 고대비 모드 토글 (미래 확장용) */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">화면 모드</p>
              <button className="w-full py-2 px-3 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">
                🌙 명상 모드
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const MobileOptimizedApp: React.FC<MobileOptimizedAppProps> = ({
  className = ""
}) => {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const { fontSize, increaseFontSize, decreaseFontSize, resetFontSize } = useFontSizeControl();
  const { isListening, transcript, startListening, stopListening } = useSpeechRecognition();

  // 스와이프로 네비게이션
  const handleSwipeNavigation = (direction: 'left' | 'right') => {
    if (currentView === 'home') return;
    
    if (direction === 'right' && currentView !== 'home') {
      setCurrentView('home');
    }
  };

  const handleViewChange = (view: ViewState) => {
    setCurrentView(view);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'review':
        return (
          <EnhancedReviewSpace 
            onBack={handleBackToHome}
            key="review"
          />
        );
      case 'community':
        return (
          <EnhancedCommunityChat 
            onBack={handleBackToHome}
            key="community"
          />
        );
      default:
        return (
          <MobileHomeChoice
            onReviewSelect={() => handleViewChange('review')}
            onCommunitySelect={() => handleViewChange('community')}
            onSwipeLeft={() => handleSwipeNavigation('left')}
            onSwipeRight={() => handleSwipeNavigation('right')}
            key="home"
          />
        );
    }
  };

  return (
    <div className={`relative min-h-screen bg-white ${className}`}>
      {/* 접근성 도구모음 */}
      <AccessibilityToolbar
        fontSize={fontSize}
        onIncreaseFontSize={increaseFontSize}
        onDecreaseFontSize={decreaseFontSize}
        onResetFontSize={resetFontSize}
        isListening={isListening}
        onStartVoice={startListening}
        onStopVoice={stopListening}
      />

      {/* 메인 컨텐츠 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ 
            duration: 0.4,
            ease: "easeInOut"
          }}
          className="w-full h-full"
        >
          {renderCurrentView()}
        </motion.div>
      </AnimatePresence>

      {/* 모바일 네비게이션 바 (홈이 아닐 때만) */}
      {currentView !== 'home' && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-3 safe-area-pb z-40"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between max-w-md mx-auto">
            {/* 홈 버튼 */}
            <motion.button
              onClick={handleBackToHome}
              className="flex flex-col items-center space-y-1 p-3 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-colors duration-200 min-h-[60px] min-w-[60px]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-2xl">🪷</span>
              <span className="text-xs font-medium text-gray-600">홈</span>
            </motion.button>

            {/* 현재 위치 표시 */}
            <div className="flex flex-col items-center space-y-1 p-3">
              <motion.span 
                className="text-3xl"
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                {currentView === 'review' ? '📿' : '🙏'}
              </motion.span>
              <span className="text-xs font-medium text-gray-700 dharma-text">
                {currentView === 'review' ? '법회 리뷰' : '불자 소통'}
              </span>
            </div>

            {/* 다른 페이지로 가기 */}
            <motion.button
              onClick={() => handleViewChange(currentView === 'review' ? 'community' : 'review')}
              className="flex flex-col items-center space-y-1 p-3 rounded-2xl bg-blue-100 hover:bg-blue-200 transition-colors duration-200 min-h-[60px] min-w-[60px]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-2xl">
                {currentView === 'review' ? '🙏' : '📿'}
              </span>
              <span className="text-xs font-medium text-blue-700">
                {currentView === 'review' ? '소통' : '법회'}
              </span>
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* 음성 입력 결과 표시 */}
      {transcript && (
        <motion.div
          className="fixed top-20 left-4 right-4 bg-blue-100 text-blue-800 p-4 rounded-2xl shadow-lg z-50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className="flex items-start space-x-2">
            <span className="text-lg">🎤</span>
            <div>
              <p className="text-sm font-medium">음성 인식 결과:</p>
              <p className="text-base dharma-text">{transcript}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MobileOptimizedApp;