/**
 * 🏛️ Enlightenment Hero Section - "깨달음의 문"
 * 대형 캘리그래피와 연꽃잎 파티클 애니메이션이 있는 메인 히어로 섹션
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { LotusPetals } from './LotusPetals'

interface EnlightenmentHeroProps {
  className?: string
}

export const EnlightenmentHero: React.FC<EnlightenmentHeroProps> = ({ 
  className = '' 
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const titleVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.1
      }
    }
  }

  const letterVariants = {
    hidden: { 
      opacity: 0, 
      y: 30 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  }

  const ctaVariants = {
    idle: {
      scale: 1,
      boxShadow: "0 0 20px rgba(248, 187, 217, 0.3)"
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 0 40px rgba(248, 187, 217, 0.6), 0 0 80px rgba(139, 92, 246, 0.3)",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    tap: {
      scale: 0.98
    }
  }

  const meditationQuotes = [
    "마음의 평화를 찾아서",
    "내면의 고요함 속에서",
    "지혜와 자비가 만나는 곳",
    "깨달음의 길을 걸어가며"
  ]

  const [currentQuote, setCurrentQuote] = useState(0)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % meditationQuotes.length)
    }, 4000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <section className={`relative min-h-screen flex items-center justify-center overflow-hidden ${className}`}>
      {/* 🌅 명상적 그라데이션 배경 */}
      <div className="absolute inset-0 bg-meditation bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" />
      
      {/* 🌸 연꽃잎 파티클 애니메이션 */}
      <LotusPetals count={25} />
      
      {/* 🪷 메인 콘텐츠 */}
      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        {/* 🎭 상단 만다라 심볼 */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, rotate: -180 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <div className="mandala-spin text-8xl opacity-60">
            ☸️
          </div>
        </motion.div>

        {/* 📖 메인 캘리그래피 제목 */}
        <motion.h1
          className="text-sutra mb-8"
          variants={titleVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="text-6xl md:text-8xl lg:text-9xl font-bold text-gradient-lotus leading-tight">
            {meditationQuotes[currentQuote].split('').map((char, index) => (
              <motion.span
                key={`${currentQuote}-${index}`}
                variants={letterVariants}
                className="inline-block"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </div>
        </motion.h1>

        {/* 🧘‍♂️ 서브타이틀 */}
        <motion.p
          className="text-dharma text-xl md:text-2xl mb-12 text-gray-600 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          함께 명상하고, 법문을 나누며, 깨달음의 여정을 걸어가는 
          <br className="hidden md:block" />
          평화로운 불교 커뮤니티입니다
        </motion.p>

        {/* 🪷 메인 CTA 버튼 */}
        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <motion.button
            className="lotus-btn text-lg px-12 py-4 relative overflow-hidden"
            variants={ctaVariants}
            initial="idle"
            whileHover="hover"
            whileTap="tap"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            <span className="relative z-10 flex items-center gap-3">
              🧘‍♂️ 명상 시작하기
            </span>
            
            {/* 연꽃 펼치기 효과 */}
            <motion.div
              className="absolute inset-0 bg-white opacity-20"
              initial={{ scale: 0, borderRadius: '50%' }}
              animate={isHovered ? { 
                scale: 2, 
                borderRadius: '0%',
                transition: { duration: 0.6, ease: "easeOut" }
              } : {}}
            />
          </motion.button>

          <motion.button
            className="saffron-btn text-lg px-12 py-4"
            variants={ctaVariants}
            initial="idle"
            whileHover="hover"
            whileTap="tap"
          >
            <span className="flex items-center gap-3">
              📿 커뮤니티 둘러보기
            </span>
          </motion.button>
        </motion.div>

        {/* 🕯️ 하단 장식 요소 */}
        <motion.div
          className="mt-16 flex justify-center items-center gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          {[...Array(5)].map((_, index) => (
            <motion.div
              key={index}
              className="mandala-circle w-3 h-3 bg-lotus rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                delay: index * 0.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* 🌊 하단 웨이브 효과 */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-24 fill-white opacity-80"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
          />
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
          />
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" />
        </svg>
      </div>
    </section>
  )
}