import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HomeChoice } from './HomeChoice';
import { ReviewSpace } from './ReviewSpace';
import { CommunityChat } from './CommunityChat';

type ViewState = 'home' | 'review' | 'community';

interface UltraMinimalAppProps {
  className?: string;
}

export const UltraMinimalApp: React.FC<UltraMinimalAppProps> = ({
  className = ""
}) => {
  const [currentView, setCurrentView] = useState<ViewState>('home');

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
          <ReviewSpace 
            onBack={handleBackToHome}
            key="review"
          />
        );
      case 'community':
        return (
          <CommunityChat 
            onBack={handleBackToHome}
            key="community"
          />
        );
      default:
        return (
          <HomeChoice
            onReviewSelect={() => handleViewChange('review')}
            onCommunitySelect={() => handleViewChange('community')}
            key="home"
          />
        );
    }
  };

  return (
    <div className={`relative min-h-screen bg-white ${className}`}>
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

      {/* 글로벌 네비게이션 (홈이 아닐 때만 표시) */}
      {currentView !== 'home' && (
        <motion.div
          className="fixed top-1/2 right-8 transform -translate-y-1/2 z-50"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex flex-col space-y-3">
            {/* 홈 버튼 */}
            <motion.button
              onClick={handleBackToHome}
              className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex flex-col items-center justify-center shadow-lg border border-white/60 text-gray-600 hover:text-gray-800 transition-all duration-300"
              whileHover={{ 
                scale: 1.1,
                backgroundColor: 'rgba(255,255,255,0.95)',
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-2xl mb-0.5">🪷</span>
              <span className="text-[10px] font-medium">홈</span>
            </motion.button>

            {/* 현재 위치 표시 */}
            <motion.button
              className={`w-14 h-14 rounded-full flex flex-col items-center justify-center shadow-lg border-2 text-white transition-all duration-300 ${
                currentView === 'review' 
                  ? 'bg-gradient-to-br from-amber-500 to-orange-500 border-amber-300' 
                  : 'bg-gradient-to-br from-blue-500 to-cyan-500 border-blue-300'
              }`}
              whileHover={{ scale: 1.05 }}
              disabled
            >
              <motion.span 
                className="text-2xl mb-0.5"
                animate={{ 
                  rotate: [0, 5, -5, 0],
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
              <span className="text-[10px] font-medium">
                {currentView === 'review' ? '법회' : '소통'}
              </span>
            </motion.button>

            {/* 다른 페이지로 가기 */}
            <motion.button
              onClick={() => handleViewChange(currentView === 'review' ? 'community' : 'review')}
              className={`w-14 h-14 rounded-full flex flex-col items-center justify-center shadow-lg border border-white/60 text-white transition-all duration-300 ${
                currentView === 'review' 
                  ? 'bg-blue-400/80 hover:bg-blue-500/80' 
                  : 'bg-amber-400/80 hover:bg-amber-500/80'
              }`}
              whileHover={{ 
                scale: 1.1,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-2xl mb-0.5">
                {currentView === 'review' ? '🙏' : '📿'}
              </span>
              <span className="text-[10px] font-medium">
                {currentView === 'review' ? '소통' : '법회'}
              </span>
            </motion.button>

            {/* 구분선 */}
            <div className="w-8 h-px bg-gray-300 mx-auto my-2" />

            {/* 현재 상태 표시 */}
            <motion.div
              className="text-center text-xs text-gray-500 px-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 border border-gray-200">
                {currentView === 'review' ? '법회 리뷰' : '불자 소통'}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* 로딩 상태 표시 (필요시) */}
      <AnimatePresence>
        {false && ( // 로딩 상태를 관리하는 state가 있다면 여기에 연결
          <motion.div
            className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center">
              <motion.div
                className="text-6xl mb-4"
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                  scale: { duration: 1, repeat: Infinity, repeatType: "reverse" }
                }}
              >
                🪷
              </motion.div>
              <p className="text-lg text-gray-600 font-light">마음을 준비하는 중...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UltraMinimalApp;