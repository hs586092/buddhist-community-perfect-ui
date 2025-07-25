import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface HomeChoiceProps {
  onChoiceSelect: (choice: 'review' | 'chat') => void;
  className?: string;
}

export const HomeChoice: React.FC<HomeChoiceProps> = ({
  onChoiceSelect,
  className = ""
}) => {
  const [hoveredChoice, setHoveredChoice] = useState<'review' | 'chat' | null>(null);

  return (
    <div className={`min-h-screen bg-zen-white flex flex-col ${className}`}>
      {/* 헤더 - 극도로 단순 */}
      <motion.header 
        className="text-center py-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="text-6xl mb-4"
          animate={{ 
            scale: [1, 1.05, 1],
            rotateZ: [0, 1, 0]
          }}
          transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
        >
          🪷
        </motion.div>
        <h1 className="text-2xl font-light text-meditation-gray">
          불교 커뮤니티
        </h1>
        <p className="text-sm text-meditation-gray/70 mt-2">
          두 가지 길 중 하나를 선택하세요
        </p>
      </motion.header>

      {/* 메인 2-Choice 영역 */}
      <main className="flex-1 flex">
        {/* 왼쪽: 법회 리뷰 */}
        <motion.div
          className={`flex-1 relative cursor-pointer transition-all duration-500 ${
            hoveredChoice === 'review' ? 'flex-[1.1]' : 'flex-1'
          }`}
          style={{ backgroundColor: '#D4A574' }} // dharma-gold
          onMouseEnter={() => setHoveredChoice('review')}
          onMouseLeave={() => setHoveredChoice(null)}
          onClick={() => onChoiceSelect('review')}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          whileHover={{ 
            scale: 1.02,
            transition: { duration: 0.3 }
          }}
        >
          {/* 배경 패턴 */}
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 2px, transparent 2px)`,
              backgroundSize: '50px 50px'
            }} />
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center h-full text-white p-8">
            <motion.div
              className="text-8xl mb-8"
              animate={{ 
                y: hoveredChoice === 'review' ? [-5, 5, -5] : [0],
                rotateY: hoveredChoice === 'review' ? [0, 5, 0] : [0]
              }}
              transition={{ 
                duration: 2, 
                repeat: hoveredChoice === 'review' ? Infinity : 0,
                repeatType: "reverse" 
              }}
            >
              📿
            </motion.div>

            <h2 className="text-4xl font-light mb-4 text-center">
              법회 리뷰
            </h2>
            
            <p className="text-xl text-white/90 text-center max-w-xs leading-relaxed">
              사찰별 법회 경험을<br />
              나누고 기록합니다
            </p>

            {/* 호버 시 추가 정보 */}
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ 
                opacity: hoveredChoice === 'review' ? 1 : 0,
                height: hoveredChoice === 'review' ? 'auto' : 0
              }}
              transition={{ duration: 0.3 }}
              className="mt-8 text-center overflow-hidden"
            >
              <div className="w-16 h-0.5 bg-white/50 mx-auto mb-4" />
              <div className="text-sm text-white/80 space-y-2">
                <div>• 템플스테이 후기</div>
                <div>• 법문 감상</div>
                <div>• 사찰 분위기</div>
              </div>
            </motion.div>

            {/* 진입 버튼 */}
            <motion.div
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: hoveredChoice === 'review' ? 1 : 0.7,
                y: hoveredChoice === 'review' ? 0 : 10
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 text-sm font-medium">
                {hoveredChoice === 'review' ? '진입하기 →' : '클릭'}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* 가운데 구분선 */}
        <div className="w-1 bg-meditation-gray/20 relative">
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-zen-white rounded-full flex items-center justify-center shadow-lg"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <span className="text-meditation-gray text-sm">🕉️</span>
          </motion.div>
        </div>

        {/* 오른쪽: 불자 소통 */}
        <motion.div
          className={`flex-1 relative cursor-pointer transition-all duration-500 ${
            hoveredChoice === 'chat' ? 'flex-[1.1]' : 'flex-1'
          }`}
          style={{ backgroundColor: '#6B9DC2' }} // sangha-blue
          onMouseEnter={() => setHoveredChoice('chat')}
          onMouseLeave={() => setHoveredChoice(null)}
          onClick={() => onChoiceSelect('chat')}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          whileHover={{ 
            scale: 1.02,
            transition: { duration: 0.3 }
          }}
        >
          {/* 배경 패턴 */}
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full" style={{
              backgroundImage: `radial-gradient(circle at 75% 75%, rgba(255,255,255,0.2) 2px, transparent 2px)`,
              backgroundSize: '50px 50px'
            }} />
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center h-full text-white p-8">
            <motion.div
              className="text-8xl mb-8"
              animate={{ 
                y: hoveredChoice === 'chat' ? [-5, 5, -5] : [0],
                rotateY: hoveredChoice === 'chat' ? [0, -5, 0] : [0]
              }}
              transition={{ 
                duration: 2, 
                repeat: hoveredChoice === 'chat' ? Infinity : 0,
                repeatType: "reverse" 
              }}
            >
              🙏
            </motion.div>

            <h2 className="text-4xl font-light mb-4 text-center">
              불자 소통
            </h2>
            
            <p className="text-xl text-white/90 text-center max-w-xs leading-relaxed">
              동참들과 함께<br />
              마음을 나눕니다
            </p>

            {/* 호버 시 추가 정보 */}
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ 
                opacity: hoveredChoice === 'chat' ? 1 : 0,
                height: hoveredChoice === 'chat' ? 'auto' : 0
              }}
              transition={{ duration: 0.3 }}
              className="mt-8 text-center overflow-hidden"
            >
              <div className="w-16 h-0.5 bg-white/50 mx-auto mb-4" />
              <div className="text-sm text-white/80 space-y-2">
                <div>• 수행 고민 상담</div>
                <div>• 일상 나눔</div>
                <div>• 불교 질문답변</div>
              </div>
            </motion.div>

            {/* 진입 버튼 */}
            <motion.div
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: hoveredChoice === 'chat' ? 1 : 0.7,
                y: hoveredChoice === 'chat' ? 0 : 10
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 text-sm font-medium">
                {hoveredChoice === 'chat' ? '진입하기 →' : '클릭'}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* 하단 안내 */}
      <motion.footer 
        className="text-center py-6 text-meditation-gray/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <div className="text-sm">
          마음 편하신 곳으로 들어가세요 🕊️
        </div>
      </motion.footer>
    </div>
  );
};

export default HomeChoice;