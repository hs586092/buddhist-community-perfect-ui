/**
 * Buddhist Community Platform - Demo Version
 * 새로 만든 컴포넌트들만 사용하는 데모 버전
 */

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DharmaCard } from './components/DharmaCard'
import { MeditationTimer } from './components/MeditationTimer'
import { SanghaThread } from './components/SanghaThread'
import { TeachingQuote } from './components/TeachingQuote'
import { FloatingActionButton } from './components/FloatingActionButton'
import type { DharmaReview, ReviewFormData } from './types/review'
import './index.css'
import './styles/design-system-2025.css'

const App: React.FC = () => {
  const [reviews, setReviews] = useState<DharmaReview[]>([])
  const [activeTab, setActiveTab] = useState<'reviews' | 'community' | 'meditation'>('reviews')
  const [showNewPostForm, setShowNewPostForm] = useState(false)

  // 샘플 법회 후기 데이터
  const sampleReviews: DharmaReview[] = [
    {
      id: '1',
      dharmaName: '조계사 법회 - 자비명상의 실천',
      date: '2024-07-20',
      location: '조계사 대웅전',
      reviewContent: '오늘 법회에서 스님께서 자비명상에 대해 깊이 있게 말씀해주셨습니다. 모든 존재에 대한 자비심을 기르는 것이 얼마나 중요한지 다시 한번 깨달았습니다. 특히 호흡과 함께하는 자비명상 실습이 매우 도움이 되었습니다.',
      createdAt: new Date().toISOString(),
      authorName: '지혜로운마음'
    },
    {
      id: '2', 
      dharmaName: '봉은사 초심자 법회',
      date: '2024-07-18',
      location: '봉은사 법당',
      reviewContent: '처음 참석한 법회였는데 스님께서 초심자도 이해하기 쉽게 설명해주셔서 감사했습니다. 불교의 기본 가르침부터 차근차근 설명해주시니 마음이 편안해졌습니다.',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      authorName: '평화구도자'
    },
    {
      id: '3',
      dharmaName: '화계사 명상 수행 모임',
      date: '2024-07-15',
      location: '화계사 명상실',
      reviewContent: '매주 참석하고 있는 명상 모임입니다. 함께 앉아서 명상하는 시간이 주는 평화로움은 말로 표현할 수 없습니다. 일상의 번잡함을 잊고 내면의 고요함을 찾을 수 있어서 좋습니다.',
      createdAt: new Date(Date.now() - 172800000).toISOString()
    }
  ]

  // 샘플 커뮤니티 게시글 데이터
  const sampleThreads = [
    {
      id: '1',
      title: '초보자를 위한 명상 가이드 - 호흡명상부터 시작하기',
      content: '명상을 처음 시작하는 분들을 위한 기본적인 호흡법과 자세에 대해 나누고 싶습니다. 명상은 마음의 평안을 찾는 중요한 수행법입니다. 가장 기본이 되는 호흡명상부터 천천히 시작해보세요. 처음에는 5분 정도만 하시고, 점차 시간을 늘려가시면 됩니다. 중요한 것은 꾸준함입니다.',
      author: { name: '지혜로운_수행자', rank: 'teacher' as const },
      category: 'meditation' as const,
      createdAt: new Date().toISOString(),
      stats: { likes: 24, comments: 8, views: 156, bookmarks: 12 },
      tags: ['명상', '초보자', '호흡법']
    },
    {
      id: '2', 
      title: '오늘 참석한 조계사 법회에서 느낀 점',
      content: '오늘 조계사에서 열린 법회에 참석했습니다. 스님의 법문을 들으며 많은 깨달음을 얻었습니다. 특히 "모든 것은 마음에서 나온다"는 말씀이 깊게 와닿았습니다. 일상생활에서 마음을 다스리는 것이 얼마나 중요한지 다시 한번 생각하게 되었습니다.',
      author: { name: '평화로운_마음', rank: 'practitioner' as const },
      category: 'dharma' as const,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      stats: { likes: 18, comments: 5, views: 89, bookmarks: 7 },
      tags: ['법회', '조계사', '법문']
    },
    {
      id: '3',
      title: '불교 입문자를 위한 추천 도서는?',
      content: '불교를 처음 접하게 되어 관련 서적을 찾고 있습니다. 어떤 책부터 읽으면 좋을까요? 너무 어렵지 않으면서도 불교의 핵심 가르침을 잘 담고 있는 책을 추천해주시면 감사하겠습니다.',
      author: { name: '새싹구도자', rank: 'novice' as const },
      category: 'question' as const,
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      stats: { likes: 12, comments: 15, views: 203, bookmarks: 8 },
      tags: ['입문서', '추천도서', '초보자']
    }
  ]

  useEffect(() => {
    setReviews(sampleReviews)
  }, [])

  const handleAddReview = (formData: ReviewFormData) => {
    const newReview: DharmaReview = {
      id: Date.now().toString(),
      dharmaName: formData.dharmaName,
      date: formData.date,
      location: formData.location,
      reviewContent: formData.reviewContent,
      createdAt: new Date().toISOString(),
      authorName: formData.authorName || undefined
    }

    setReviews(prev => [newReview, ...prev])
    setShowNewPostForm(false)
  }

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
          className="absolute top-40 right-20 text-4xl opacity-15"
          animate={{ 
            y: [10, -10, 10],
            x: [-5, 5, -5]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        >
          🕯️
        </motion.div>
        <motion.div
          className="absolute bottom-40 left-1/4 text-5xl opacity-25"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.25, 0.15]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          ⛩️
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

      {/* Modern Header */}
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
              불교 커뮤니티
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
              법문과 명상, 수행의 지혜를 나누는 평화로운 공간입니다. 
              함께 깨달음의 길을 걸어가며 서로를 돕고 성장해요.
            </motion.p>
            
            {/* Navigation Tabs */}
            <motion.div 
              className="flex items-center justify-center gap-4 flex-wrap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              {[
                { id: 'reviews', label: '법회 후기', emoji: '📿' },
                { id: 'community', label: '커뮤니티', emoji: '🤝' },
                { id: 'meditation', label: '명상', emoji: '🧘' }
              ].map((tab, index) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`
                    flex items-center gap-3 px-6 py-3 rounded-full font-medium transition-all duration-300
                    ${activeTab === tab.id 
                      ? 'bg-gradient-to-r from-saffron to-lotus-pink text-white shadow-lg' 
                      : 'bg-white/40 text-charcoal hover:bg-white/60'
                    }
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.3 }}
                >
                  <span className="text-lg">{tab.emoji}</span>
                  <span>{tab.label}</span>
                </motion.button>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Dynamic Content Based on Active Tab */}
      <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'reviews' && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {/* Teaching Quote */}
              <TeachingQuote className="mb-12" />
              
              {/* Stats Card */}
              <motion.div 
                className="glass p-6 text-center mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <div className="flex items-center justify-center gap-12">
                  <div className="space-y-2">
                    <p className="text-heading-lg gradient-text">
                      {reviews.length}
                    </p>
                    <p className="text-body text-charcoal-light">총 후기</p>
                  </div>
                  <div className="text-6xl">📊</div>
                  <div className="space-y-2">
                    <p className="text-heading-lg gradient-text">
                      {reviews.filter(r => r.authorName).length}
                    </p>
                    <p className="text-body text-charcoal-light">작성자 표시</p>
                  </div>
                </div>
              </motion.div>

              {/* Reviews Grid */}
              <div className="dharma-grid">
                {reviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                  >
                    <DharmaCard 
                      review={review}
                      variant={index === 0 ? 'featured' : 'default'}
                      showStats={true}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'community' && (
            <motion.div
              key="community"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div className="sangha-layout">
                <div className="space-y-8">
                  {sampleThreads.map((thread, index) => (
                    <motion.div
                      key={thread.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2, duration: 0.5 }}
                    >
                      <SanghaThread {...thread} />
                    </motion.div>
                  ))}
                </div>
                
                {/* Sidebar */}
                <motion.aside
                  className="space-y-6"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <div className="glass p-6">
                    <h3 className="text-heading-sm gradient-text mb-4">인기 주제</h3>
                    <div className="flex flex-wrap gap-2">
                      {['명상', '법문', '수행', '지혜', '자비', '깨달음'].map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-white/30 rounded-full text-sm cursor-pointer
                                   hover:bg-white/50 transition-colors"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="glass p-6">
                    <h3 className="text-heading-sm gradient-text mb-4">커뮤니티 통계</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-body-sm text-charcoal-light">총 게시글</span>
                        <span className="text-body-sm font-semibold gradient-text">127</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-body-sm text-charcoal-light">활성 회원</span>
                        <span className="text-body-sm font-semibold gradient-text">89</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-body-sm text-charcoal-light">오늘 방문</span>
                        <span className="text-body-sm font-semibold gradient-text">34</span>
                      </div>
                    </div>
                  </div>
                </motion.aside>
              </div>
            </motion.div>
          )}

          {activeTab === 'meditation' && (
            <motion.div
              key="meditation"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.4 }}
              className="max-w-4xl mx-auto space-y-12"
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <MeditationTimer 
                  onComplete={() => console.log('명상 완료!')}
                  className="mb-12"
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <TeachingQuote />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modern Footer */}
      <motion.footer 
        className="relative z-10 mt-20 pb-24"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
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
              <motion.span
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                지혜와 자비로
              </motion.span>
              <motion.span 
                className="text-2xl"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              >
                ☸️
              </motion.span>
              <motion.span
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                만든 평화로운 공간
              </motion.span>
            </div>
          </div>
        </div>
      </motion.footer>

      {/* Floating Action Button */}
      <FloatingActionButton 
        onNewReview={() => setShowNewPostForm(true)}
        onNewPost={() => console.log('새 글 작성')}
        onNewPhoto={() => console.log('사진 공유')}
        onNewVoice={() => console.log('음성 메모')}
      />
    </div>
  )
}

export default App