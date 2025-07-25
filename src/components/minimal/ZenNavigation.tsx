import React from 'react';
import { motion } from 'framer-motion';

type NavigationState = 'home' | 'review' | 'chat';

interface ZenNavigationProps {
  currentState: NavigationState;
  onNavigate: (state: NavigationState) => void;
  className?: string;
}

export const ZenNavigation: React.FC<ZenNavigationProps> = ({
  currentState,
  onNavigate,
  className = ""
}) => {
  const navItems = [
    {
      id: 'home' as NavigationState,
      icon: '🪷',
      label: '홈',
      color: '#FEFEFE', // zen-white
      hoverColor: '#F0F0F0'
    },
    {
      id: 'review' as NavigationState,
      icon: '📿',
      label: '법회',
      color: '#D4A574', // dharma-gold
      hoverColor: '#C69A6B'
    },
    {
      id: 'chat' as NavigationState,
      icon: '🙏',
      label: '소통',
      color: '#6B9DC2', // sangha-blue  
      hoverColor: '#5B8AB0'
    }
  ];

  return (
    <motion.nav
      className={`fixed top-1/2 right-8 transform -translate-y-1/2 z-50 ${className}`}
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      <div className="flex flex-col space-y-3">
        {navItems.map((item, index) => (
          <motion.button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`
              w-14 h-14 rounded-full flex flex-col items-center justify-center
              backdrop-blur-sm border border-white/20 shadow-lg
              text-white text-xs font-medium
              transition-all duration-300
              ${currentState === item.id ? 'scale-110 shadow-xl' : 'hover:scale-105'}
            `}
            style={{
              backgroundColor: currentState === item.id ? item.color : item.color + '80',
            }}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              duration: 0.5, 
              delay: 0.7 + index * 0.1,
              type: "spring",
              stiffness: 200
            }}
            whileHover={{ 
              scale: currentState === item.id ? 1.1 : 1.05,
              backgroundColor: item.hoverColor,
              transition: { duration: 0.2 }
            }}
            whileTap={{ 
              scale: 0.95,
              transition: { duration: 0.1 }
            }}
          >
            <motion.div
              className="text-lg mb-0.5"
              animate={currentState === item.id ? {
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              } : {}}
              transition={{ 
                duration: 2, 
                repeat: currentState === item.id ? Infinity : 0,
                repeatType: "reverse"
              }}
            >
              {item.icon}
            </motion.div>
            <span className="text-[10px] leading-none">{item.label}</span>

            {/* 활성 상태 인디케이터 */}
            {currentState === item.id && (
              <motion.div
                className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              />
            )}
          </motion.button>
        ))}

        {/* 구분선 */}
        <motion.div
          className="w-8 h-px bg-meditation-gray/30 mx-auto my-2"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.2 }}
        />

        {/* 현재 위치 표시 */}
        <motion.div
          className="text-center text-xs text-meditation-gray/70 px-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-full px-2 py-1">
            {currentState === 'home' && '선택'}
            {currentState === 'review' && '법회'}
            {currentState === 'chat' && '소통'}
          </div>
        </motion.div>
      </div>

      {/* 도움말 툴팁 (처음 방문 시) */}
      <motion.div
        className="absolute right-16 top-0 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg text-xs text-meditation-gray max-w-[200px]"
        initial={{ opacity: 0, x: 10, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ delay: 2 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div className="flex items-start space-x-2">
          <span className="text-lg">💡</span>
          <div>
            <div className="font-medium mb-1">간편한 이동</div>
            <div className="text-xs leading-relaxed">
              우측 버튼으로 홈, 법회 리뷰, 불자 소통 간을 자유롭게 이동하세요
            </div>
          </div>
        </div>
        
        {/* 화살표 */}
        <div className="absolute left-[-6px] top-4 w-0 h-0 border-t-[6px] border-b-[6px] border-r-[6px] border-transparent border-r-white/95" />
      </motion.div>
    </motion.nav>
  );
};

export default ZenNavigation;