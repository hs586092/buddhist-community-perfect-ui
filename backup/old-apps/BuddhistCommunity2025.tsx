/**
 * 🏛️ Buddhist Community 2025 - Main Application
 * 2025년 트렌드를 반영한 불교 커뮤니티 플랫폼 메인 컴포넌트
 */

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// 컴포넌트 임포트
import { EnlightenmentHero } from './components/EnlightenmentHero'
import { ZenNavigation } from './components/ZenNavigation'
import { DharmaGallery } from './components/DharmaGallery'
import { MeditationCircle } from './components/MeditationCircle'
import { CommunityFeed } from './components/CommunityFeed'
import { LotusPetals } from './components/LotusPetals'

// 스타일 임포트
import './styles/buddhist-theme-2025.css'

export const BuddhistCommunity2025: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [currentSection, setCurrentSection] = useState('hero')

  // 🌙 테마 토글 핸들러
  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode)
    document.body.classList.toggle('theme-night', !isDarkMode)
    document.body.classList.toggle('theme-dawn', isDarkMode)
  }

  // 📜 스크롤 진행률 추적
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (window.scrollY / totalHeight) * 100
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 🎯 섹션 관찰자 (네비게이션 활성화용)
  useEffect(() => {
    const sections = ['hero', 'dharma', 'meditation', 'community']
    const observers: IntersectionObserver[] = []

    sections.forEach(section => {
      const element = document.getElementById(section)
      if (element) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setCurrentSection(section)
            }
          },
          { threshold: 0.3 }
        )
        observer.observe(element)
        observers.push(observer)
      }
    })

    return () => {
      observers.forEach(observer => observer.disconnect())
    }
  }, [])

  return (
    <div className={`min-h-screen ${isDarkMode ? 'theme-night' : 'theme-dawn'}`}>
      {/* 🌸 배경 연꽃잎 파티클 */}
      <LotusPetals count={30} />

      {/* 🧭 네비게이션 */}
      <ZenNavigation 
        onThemeToggle={handleThemeToggle}
        isDarkMode={isDarkMode}
      />

      {/* 📊 스크롤 진행률 표시 (연꽃 펼치기) */}
      <div className="fixed top-0 left-0 right-0 z-40 h-1">
        <motion.div
          className="h-full bg-lotus-gradient"
          initial={{ width: '0%' }}
          animate={{ width: `${scrollProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* 🏛️ 메인 콘텐츠 */}
      <main>
        {/* 🚪 Hero Section - "깨달음의 문" */}
        <section id="hero">
          <EnlightenmentHero />
        </section>

        {/* 📿 Dharma Gallery - "법문 갤러리" */}
        <section id="dharma" className="bg-sacred">
          <DharmaGallery />
        </section>

        {/* 🧘‍♂️ Meditation Circle - "명상 센터" */}
        <section id="meditation" className="bg-meditation">
          <MeditationCircle />
        </section>

        {/* 🤝 Community Feed - "커뮤니티" */}
        <section id="community" className="bg-natural">
          <CommunityFeed />
        </section>

        {/* 🏮 Footer - "회향" */}
        <footer className="bg-zen-stone-dark text-white py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              {/* 로고 및 소개 */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="mandala-spin text-3xl">
                    🪷
                  </div>
                  <h3 className="text-2xl font-bold text-gradient-lotus text-sutra">
                    평화로운 상가
                  </h3>
                </div>
                <p className="text-gray-300 leading-relaxed text-dharma mb-4">
                  모든 존재의 행복과 깨달음을 위해 함께하는 
                  불교 커뮤니티 플랫폼입니다. 
                  법문과 명상, 지혜를 나누며 평화로운 세상을 만들어가요.
                </p>
                <div className="flex gap-4">
                  <button className="text-2xl hover:scale-110 transition-transform">
                    📱
                  </button>
                  <button className="text-2xl hover:scale-110 transition-transform">
                    💬
                  </button>
                  <button className="text-2xl hover:scale-110 transition-transform">
                    📧
                  </button>
                </div>
              </div>

              {/* 링크 섹션들 */}
              <div>
                <h4 className="font-semibold mb-4 text-gradient-saffron">
                  법문 & 수행
                </h4>
                <ul className="space-y-2 text-gray-300">
                  <li><a href="#" className="hover:text-white transition-colors">오늘의 법문</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">명상 가이드</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">경전 읽기</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">수행 일기</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4 text-gradient-spiritual">
                  커뮤니티
                </h4>
                <ul className="space-y-2 text-gray-300">
                  <li><a href="#" className="hover:text-white transition-colors">자유게시판</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">질문 & 답변</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">모임 일정</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">온라인 법회</a></li>
                </ul>
              </div>
            </div>

            {/* 🙏 하단 회향 */}
            <div className="border-t border-gray-600 pt-8 text-center">
              <div className="flex items-center justify-center gap-8 mb-6">
                {[...Array(7)].map((_, index) => (
                  <motion.div
                    key={index}
                    className="w-2 h-2 bg-lotus rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 2,
                      delay: index * 0.3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>
              
              <motion.div
                className="text-center"
                animate={{
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <p className="text-lg mb-2 text-gradient-lotus text-sutra">
                  원력이 깊고 넓어져서 모든 중생이 함께 성불하기를
                </p>
                <p className="text-sm text-gray-400">
                  May all beings be happy and find peace through wisdom and compassion
                </p>
              </motion.div>

              <div className="mt-8 text-sm text-gray-500">
                <p>&copy; 2025 평화로운 상가. All rights reserved.</p>
                <p className="mt-2">Made with 🙏 and ❤️ for all sentient beings</p>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* 🪷 플로팅 액션 버튼 */}
      <motion.div
        className="fixed bottom-8 right-8 z-50"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 2, duration: 0.8, ease: "easeOut" }}
      >
        <motion.button
          className="w-16 h-16 bg-lotus-gradient rounded-full shadow-lg flex items-center justify-center text-2xl"
          whileHover={{ 
            scale: 1.1,
            boxShadow: "0 0 30px rgba(248, 187, 217, 0.6)"
          }}
          whileTap={{ scale: 0.95 }}
          animate={{
            y: [0, -10, 0]
          }}
          transition={{
            y: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          🪷
        </motion.button>
      </motion.div>

      {/* 🎭 테마 전환 애니메이션 */}
      <AnimatePresence>
        {isDarkMode && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            {/* 별들 */}
            {[...Array(50)].map((_, index) => (
              <motion.div
                key={index}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [1, 1.5, 1]
                }}
                transition={{
                  duration: 2 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default BuddhistCommunity2025