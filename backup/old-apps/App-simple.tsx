/**
 * Simple Buddhist Community App for Testing
 */

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { DharmaReview, ReviewFormData } from './types/review'
import './index.css'
import './styles/design-system-2025.css'

const App: React.FC = () => {
  const [reviews, setReviews] = useState<DharmaReview[]>([])

  // 로컬 스토리지에서 리뷰 데이터 로드
  useEffect(() => {
    const savedReviews = localStorage.getItem('dharmaReviews')
    if (savedReviews) {
      try {
        setReviews(JSON.parse(savedReviews))
      } catch (error) {
        console.error('리뷰 데이터 로드 실패:', error)
      }
    }
  }, [])

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Modern Buddhist Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-cream via-cream-light to-cream-dark" />
        
        <motion.div
          className="absolute top-20 left-10 text-6xl opacity-20"
          animate={{ 
            y: [-10, 10, -10],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        >
          🪷
        </motion.div>
        <motion.div
          className="absolute bottom-20 right-10 text-7xl opacity-10"
          animate={{ 
            rotate: [0, 360]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          ☸️
        </motion.div>
      </div>

      {/* Header */}
      <motion.header 
        className="relative z-10 py-12"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="glass-organic mx-4 max-w-5xl mx-auto p-8 md:p-12">
          <div className="text-center space-y-8">
            <motion.h1 
              className="text-heading-xl gradient-text flex items-center justify-center gap-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <motion.span
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🪷
              </motion.span>
              불교 커뮤니티 플랫폼
              <motion.span
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                ☸️
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-body-lg text-charcoal-light max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              2025년 최신 디자인 트렌드를 반영한 현대적인 불교 커뮤니티 플랫폼입니다.
              법문과 명상, 수행의 지혜를 나누는 평화로운 공간입니다.
            </motion.p>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <motion.div 
          className="glass p-8 text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <h2 className="text-heading-lg gradient-text mb-6">
            🎨 새로운 디자인 시스템이 적용되었습니다!
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass-organic p-6">
              <div className="text-4xl mb-4">🪷</div>
              <h3 className="text-heading-sm gradient-text mb-2">Glassmorphism</h3>
              <p className="text-body text-charcoal-light">
                유리질 효과로 현대적이고 우아한 디자인
              </p>
            </div>
            
            <div className="neumorphic p-6">
              <div className="text-4xl mb-4">🧘</div>
              <h3 className="text-heading-sm gradient-text mb-2">Neumorphism</h3>
              <p className="text-body text-charcoal-light">
                부드러운 입체감으로 편안한 사용자 경험
              </p>
            </div>
            
            <div className="glass p-6">
              <div className="text-4xl mb-4">🎭</div>
              <h3 className="text-heading-sm gradient-text mb-2">Animations</h3>
              <p className="text-body text-charcoal-light">
                부드러운 애니메이션으로 자연스러운 상호작용
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-8">
            <div className="space-y-2">
              <p className="text-heading-lg gradient-text">
                {reviews.length}
              </p>
              <p className="text-body text-charcoal-light">총 후기</p>
            </div>
            <div className="text-6xl">📊</div>
            <div className="space-y-2">
              <p className="text-heading-lg gradient-text">6</p>
              <p className="text-body text-charcoal-light">새 컴포넌트</p>
            </div>
          </div>
        </motion.div>

        {/* Feature Showcase */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <div className="glass-organic p-8">
            <h3 className="text-heading-md gradient-text mb-4">
              ✨ 구현된 컴포넌트들
            </h3>
            <ul className="space-y-3 text-body text-charcoal">
              <li className="flex items-center gap-3">
                <span className="text-xl">🪷</span>
                <span>DharmaCard - 법회 정보 카드</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-xl">🧘</span>
                <span>MeditationTimer - 명상 타이머</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-xl">💬</span>
                <span>SanghaThread - 커뮤니티 게시글</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-xl">📿</span>
                <span>TeachingQuote - 법문 인용구</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-xl">⭕</span>
                <span>FloatingActionButton - 플로팅 버튼</span>
              </li>
            </ul>
          </div>

          <div className="glass p-8">
            <h3 className="text-heading-md gradient-text mb-4">
              🎨 디자인 시스템
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-body font-semibold mb-2">컬러 팔레트</h4>
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-saffron rounded-full"></div>
                  <div className="w-8 h-8 bg-meditation-blue rounded-full"></div>
                  <div className="w-8 h-8 bg-lotus-pink rounded-full"></div>
                  <div className="w-8 h-8 bg-charcoal rounded-full"></div>
                </div>
              </div>
              <div>
                <h4 className="text-body font-semibold mb-2">타이포그래피</h4>
                <p className="font-serif text-lg">Playfair Display (제목)</p>
                <p className="font-sans">Inter (본문)</p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer 
        className="relative z-10 mt-20 pb-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <div className="glass-organic mx-4 mb-4 max-w-5xl mx-auto p-8">
          <div className="text-center space-y-6">
            <motion.h3 
              className="text-heading-sm gradient-text"
            >
              🪷 불교 커뮤니티 플랫폼 ☸️
            </motion.h3>
            
            <p className="text-body text-charcoal-light max-w-2xl mx-auto">
              평화와 지혜를 나누는 디지털 상가(승가)입니다. 
              모든 존재의 행복과 깨달음을 위해 함께 걸어가요.
            </p>
            
            <div className="flex items-center justify-center gap-6 text-sm text-charcoal-light">
              <span>지혜와 자비로</span>
              <motion.span 
                className="text-2xl"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              >
                ☸️
              </motion.span>
              <span>만든 평화로운 공간</span>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}

export default App