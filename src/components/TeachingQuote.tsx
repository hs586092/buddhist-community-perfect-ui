/**
 * TeachingQuote - 법문 인용구 컴포넌트
 * Elegant typography와 부드러운 애니메이션 적용
 */

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Quote, RefreshCw, Heart, Share2, Bookmark } from 'lucide-react'

interface Teaching {
  quote: string
  author: string
  source?: string
  category: 'wisdom' | 'compassion' | 'mindfulness' | 'liberation'
}

interface TeachingQuoteProps {
  teachings?: Teaching[]
  autoRotate?: boolean
  rotateInterval?: number
  showControls?: boolean
  className?: string
}

const DEFAULT_TEACHINGS: Teaching[] = [
  {
    quote: "모든 존재가 행복하고 평안하기를. 모든 존재가 괴로움에서 벗어나기를.",
    author: "붓다",
    source: "자애경",
    category: 'compassion'
  },
  {
    quote: "마음은 모든 것의 주인이다. 마음이 일어나면 모든 것이 일어나고, 마음이 멸하면 모든 것이 멸한다.",
    author: "붓다",
    source: "법구경",
    category: 'wisdom'
  },
  {
    quote: "지금 이 순간에 완전히 깨어있으라. 이것이 유일한 실재이다.",
    author: "틱낫한",
    category: 'mindfulness'
  },
  {
    quote: "집착을 버리면 자유를 얻고, 자유를 얻으면 평화를 얻는다.",
    author: "붓다",
    source: "중아함경",
    category: 'liberation'
  },
  {
    quote: "자신의 구원은 자신에게 달려있다. 다른 누구도 그것을 할 수 없다.",
    author: "붓다",
    source: "법구경",
    category: 'wisdom'
  }
]

const CATEGORY_CONFIG = {
  wisdom: { color: 'from-amber-400 to-orange-400', emoji: '💡', name: '지혜' },
  compassion: { color: 'from-pink-400 to-rose-400', emoji: '💕', name: '자비' },
  mindfulness: { color: 'from-teal-400 to-cyan-400', emoji: '🧘', name: '마음챙김' },
  liberation: { color: 'from-purple-400 to-indigo-400', emoji: '🕊️', name: '해탈' }
}

export const TeachingQuote: React.FC<TeachingQuoteProps> = ({
  teachings = DEFAULT_TEACHINGS,
  autoRotate = true,
  rotateInterval = 8000,
  showControls = true,
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const currentTeaching = teachings[currentIndex]
  const categoryConfig = CATEGORY_CONFIG[currentTeaching.category]

  // Auto-rotate logic
  useEffect(() => {
    if (!autoRotate || isPaused) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % teachings.length)
    }, rotateInterval)

    return () => clearInterval(interval)
  }, [autoRotate, isPaused, rotateInterval, teachings.length])

  const nextQuote = () => {
    setCurrentIndex((prev) => (prev + 1) % teachings.length)
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
        staggerChildren: 0.2
      }
    }
  }

  const quoteVariants = {
    hidden: { opacity: 0, y: 30, rotateX: -15 },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const
      }
    },
    exit: { 
      opacity: 0, 
      y: -30, 
      rotateX: 15,
      transition: { duration: 0.4 }
    }
  }

  const authorVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.5,
        delay: 0.3,
        ease: "easeOut" as const
      }
    }
  }

  const controlsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        delay: 0.5
      }
    }
  }

  return (
    <motion.div
      className={`glass-organic p-8 max-w-2xl mx-auto relative overflow-hidden ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      onHoverStart={() => setIsPaused(true)}
      onHoverEnd={() => setIsPaused(false)}
    >
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="text-9xl absolute top-4 left-4 text-gray-400">
          <Quote />
        </div>
      </div>

      {/* Category Badge */}
      <motion.div
        className={`
          inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white mb-6
          bg-gradient-to-r ${categoryConfig.color}
        `}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <span>{categoryConfig.emoji}</span>
        <span>{categoryConfig.name}</span>
      </motion.div>

      {/* Quote Content */}
      <div className="relative z-10 mb-6">
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={currentIndex}
            className="text-heading-md text-gray-800 leading-relaxed mb-6 relative"
            variants={quoteVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Opening Quote */}
            <span className="absolute -top-4 -left-2 text-4xl text-orange-300 font-serif">
              "
            </span>
            
            <div className="pl-6 pr-4">
              {currentTeaching.quote}
            </div>
            
            {/* Closing Quote */}
            <span className="absolute -bottom-6 -right-2 text-4xl text-orange-300 font-serif">
              "
            </span>
          </motion.blockquote>
        </AnimatePresence>

        {/* Author Attribution */}
        <motion.div
          className="text-right"
          variants={authorVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="inline-flex flex-col items-end">
            <span className="text-body font-semibold text-gray-700 mb-1">
              — {currentTeaching.author}
            </span>
            {currentTeaching.source && (
              <span className="text-body-sm text-gray-500 italic">
                {currentTeaching.source}
              </span>
            )}
          </div>
        </motion.div>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center mb-6">
        <div className="prayer-beads">
          {teachings.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`prayer-bead cursor-pointer ${
                index === currentIndex ? 'active' : ''
              }`}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 1.1 }}
            />
          ))}
        </div>
      </div>

      {/* Controls */}
      {showControls && (
        <motion.div
          className="flex items-center justify-between"
          variants={controlsVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => setIsLiked(!isLiked)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                transition-all duration-200
                ${isLiked 
                  ? 'bg-red-100 text-red-600' 
                  : 'hover:bg-white/30 text-gray-600 hover:text-red-600'
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{isLiked ? '좋아함' : '좋아요'}</span>
            </motion.button>

            <motion.button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`
                p-2 rounded-lg transition-all duration-200
                ${isBookmarked 
                  ? 'bg-yellow-100 text-yellow-600' 
                  : 'hover:bg-white/30 text-gray-600 hover:text-yellow-600'
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </motion.button>

            <motion.button
              className="p-2 rounded-lg hover:bg-white/30 text-gray-600 hover:text-green-600 
                       transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Share2 className="w-4 h-4" />
            </motion.button>
          </div>

          <motion.button
            onClick={nextQuote}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-400 to-yellow-400
                     text-white rounded-lg font-medium hover:shadow-lg transition-shadow duration-200"
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 8px 25px rgba(244, 162, 97, 0.3)'
            }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw className="w-4 h-4" />
            <span>다음 법문</span>
          </motion.button>
        </motion.div>
      )}

      {/* Gentle Breathing Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent 
                 pointer-events-none rounded-inherit"
        animate={{
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.005, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      />
    </motion.div>
  )
}

export default TeachingQuote