import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface HomeChoiceProps {
  onReviewSelect: () => void;
  onCommunitySelect: () => void;
  className?: string;
}

export const HomeChoice: React.FC<HomeChoiceProps> = ({
  onReviewSelect,
  onCommunitySelect,
  className = ""
}) => {
  const [hoveredChoice, setHoveredChoice] = useState<'review' | 'community' | null>(null);

  return (
    <div className={`min-h-screen bg-white flex flex-col ${className}`}>
      {/* 헤더 - 극도로 단순 */}
      <motion.header 
        className="text-center py-12"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          className="text-7xl mb-6"
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
        <h1 className="text-3xl font-light text-gray-700 mb-2">
          불교 커뮤니티
        </h1>
        <p className="text-lg text-gray-500">
          두 가지 길 중 하나를 선택하세요
        </p>
      </motion.header>

      {/* 메인 2-Choice 영역 */}
      <main className="flex-1 flex relative">
        {/* 왼쪽: 법회 리뷰 */}
        <motion.section
          className={`flex-1 relative cursor-pointer transition-all duration-700 ease-out ${
            hoveredChoice === 'review' ? 'flex-[1.15]' : 'flex-1'
          }`}
          style={{ 
            background: 'linear-gradient(135deg, #D4A574 0%, #E6B885 100%)'
          }}
          onMouseEnter={() => setHoveredChoice('review')}
          onMouseLeave={() => setHoveredChoice(null)}
          onClick={onReviewSelect}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          whileHover={{ 
            scale: 1.01,
            transition: { duration: 0.4 }
          }}
          whileTap={{ 
            scale: 0.99,
            transition: { duration: 0.1 }
          }}
        >
          {/* 배경 패턴 */}
          <div className="absolute inset-0 opacity-15">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 20% 30%, rgba(255,255,255,0.4) 2px, transparent 2px),
                  radial-gradient(circle at 70% 80%, rgba(255,255,255,0.3) 2px, transparent 2px)
                `,
                backgroundSize: '80px 80px, 120px 120px'
              }}
            />
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center h-full text-white p-12">
            <motion.div
              className="text-9xl mb-8"
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

            <h2 className="text-5xl font-light mb-6 text-center leading-tight">
              법회 리뷰
            </h2>
            
            <p className="text-2xl text-white/90 text-center max-w-sm leading-relaxed mb-8">
              사찰별 법회 경험을<br />
              나누고 기록합니다
            </p>

            {/* 호버 시 추가 정보 */}
            <motion.div
              initial={{ opacity: 0, height: 0, y: 20 }}
              animate={{ 
                opacity: hoveredChoice === 'review' ? 1 : 0,
                height: hoveredChoice === 'review' ? 'auto' : 0,
                y: hoveredChoice === 'review' ? 0 : 20
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="text-center overflow-hidden"
            >
              <div className="w-20 h-0.5 bg-white/60 mx-auto mb-6" />
              <div className="text-lg text-white/85 space-y-3">
                <div className="flex items-center justify-center space-x-2">
                  <span>🏛️</span>
                  <span>템플스테이 후기</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span>🙏</span>
                  <span>법문 감상</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span>🌸</span>
                  <span>사찰 분위기</span>
                </div>
              </div>
            </motion.div>

            {/* 진입 버튼 */}
            <motion.div
              className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0.7, y: 10 }}
              animate={{ 
                opacity: hoveredChoice === 'review' ? 1 : 0.8,
                y: hoveredChoice === 'review' ? 0 : 10,
                scale: hoveredChoice === 'review' ? 1.05 : 1
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white/25 backdrop-blur-md rounded-full px-8 py-3 text-lg font-medium border border-white/30">
                {hoveredChoice === 'review' ? '법회 리뷰 시작하기 →' : '클릭하여 진입'}
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* 가운데 구분선과 로고 */}
        <div className="w-2 bg-gray-100 relative z-20">
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-gray-50"
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 30, repeat: Infinity, ease: "linear" },
              scale: { duration: 4, repeat: Infinity, repeatType: "reverse" }
            }}
          >
            <span className="text-gray-600 text-xl">🕉️</span>
          </motion.div>
        </div>

        {/* 오른쪽: 불자 소통 */}
        <motion.section
          className={`flex-1 relative cursor-pointer transition-all duration-700 ease-out ${
            hoveredChoice === 'community' ? 'flex-[1.15]' : 'flex-1'
          }`}
          style={{ 
            background: 'linear-gradient(135deg, #6B9DC2 0%, #7BADD4 100%)'
          }}
          onMouseEnter={() => setHoveredChoice('community')}
          onMouseLeave={() => setHoveredChoice(null)}
          onClick={onCommunitySelect}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          whileHover={{ 
            scale: 1.01,
            transition: { duration: 0.4 }
          }}
          whileTap={{ 
            scale: 0.99,
            transition: { duration: 0.1 }
          }}
        >
          {/* 배경 패턴 */}
          <div className="absolute inset-0 opacity-15">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 80% 20%, rgba(255,255,255,0.4) 2px, transparent 2px),
                  radial-gradient(circle at 30% 70%, rgba(255,255,255,0.3) 2px, transparent 2px)
                `,
                backgroundSize: '90px 90px, 110px 110px'
              }}
            />
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center h-full text-white p-12">
            <motion.div
              className="text-9xl mb-8"
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

            <h2 className="text-5xl font-light mb-6 text-center leading-tight">
              불자 소통
            </h2>
            
            <p className="text-2xl text-white/90 text-center max-w-sm leading-relaxed mb-8">
              동참들과 함께<br />
              마음을 나눕니다
            </p>

            {/* 호버 시 추가 정보 */}
            <motion.div
              initial={{ opacity: 0, height: 0, y: 20 }}
              animate={{ 
                opacity: hoveredChoice === 'community' ? 1 : 0,
                height: hoveredChoice === 'community' ? 'auto' : 0,
                y: hoveredChoice === 'community' ? 0 : 20
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="text-center overflow-hidden"
            >
              <div className="w-20 h-0.5 bg-white/60 mx-auto mb-6" />
              <div className="text-lg text-white/85 space-y-3">
                <div className="flex items-center justify-center space-x-2">
                  <span>💬</span>
                  <span>수행 고민 상담</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span>🤝</span>
                  <span>일상 나눔</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span>❓</span>
                  <span>불교 질문답변</span>
                </div>
              </div>
            </motion.div>

            {/* 진입 버튼 */}
            <motion.div
              className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0.7, y: 10 }}
              animate={{ 
                opacity: hoveredChoice === 'community' ? 1 : 0.8,
                y: hoveredChoice === 'community' ? 0 : 10,
                scale: hoveredChoice === 'community' ? 1.05 : 1
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white/25 backdrop-blur-md rounded-full px-8 py-3 text-lg font-medium border border-white/30">
                {hoveredChoice === 'community' ? '불자 소통 시작하기 →' : '클릭하여 진입'}
              </div>
            </motion.div>
          </div>
        </motion.section>
      </main>

      {/* 하단 안내 */}
      <motion.footer 
        className="text-center py-8 bg-gray-50/80 backdrop-blur-sm"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <div className="flex items-center justify-center space-x-3 text-gray-500">
          <span className="text-2xl">🕊️</span>
          <span className="text-lg font-light">마음 편하신 곳으로 들어가세요</span>
          <span className="text-2xl">🕊️</span>
        </div>
      </motion.footer>
    </div>
  );
};

export default HomeChoice;