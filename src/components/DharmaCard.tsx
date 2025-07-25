/**
 * DharmaCard - 법회 정보를 보여주는 Glassmorphism 스타일 카드 컴포넌트
 * 2025년 최신 디자인 트렌드 적용
 */

import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, User, Clock, Heart, MessageCircle } from 'lucide-react'
import type { DharmaReview } from '../types/review'

interface DharmaCardProps {
  review: DharmaReview
  variant?: 'default' | 'featured' | 'compact'
  showStats?: boolean
  onLike?: (id: string) => void
  onComment?: (id: string) => void
  className?: string
}

export const DharmaCard: React.FC<DharmaCardProps> = ({
  review,
  variant = 'default',
  showStats = false,
  onLike,
  onComment,
  className = ''
}) => {
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const
      }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatCreatedAt = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getVariantClasses = () => {
    switch (variant) {
      case 'featured':
        return 'glass-organic p-8 md:p-10'
      case 'compact':
        return 'glass p-4'
      default:
        return 'glass p-6 md:p-8'
    }
  }

  return (
    <motion.article
      className={`
        ${getVariantClasses()}
        interactive glow relative overflow-hidden
        ${className}
      `}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      layout
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 text-6xl opacity-10 pointer-events-none">
        🪷
      </div>
      
      {/* Header */}
      <header className="mb-4">
        <motion.h3 
          className={`
            gradient-text font-serif font-semibold mb-2
            ${variant === 'featured' ? 'text-heading-lg' : 'text-heading-sm'}
          `}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {review.dharmaName}
        </motion.h3>
        
        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
          <motion.div 
            className="flex items-center gap-1 bg-white/30 px-3 py-1 rounded-full backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <Calendar className="w-4 h-4 text-orange-600" />
            <span>{formatDate(review.date)}</span>
          </motion.div>
          
          <motion.div 
            className="flex items-center gap-1 bg-white/30 px-3 py-1 rounded-full backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <MapPin className="w-4 h-4 text-teal-600" />
            <span>{review.location}</span>
          </motion.div>
          
          {review.authorName && (
            <motion.div 
              className="flex items-center gap-1 bg-white/30 px-3 py-1 rounded-full backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <User className="w-4 h-4 text-amber-600" />
              <span>{review.authorName}</span>
            </motion.div>
          )}
        </div>
      </header>

      {/* Content */}
      <motion.div 
        className="mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        <p className={`
          text-gray-700 leading-relaxed
          ${variant === 'compact' ? 'text-body-sm line-clamp-2' : 'text-body'}
        `}>
          {review.reviewContent}
        </p>
      </motion.div>

      {/* Footer */}
      <footer className="flex items-center justify-between pt-4 border-t border-white/20">
        <motion.div 
          className="flex items-center gap-1 text-xs text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.3 }}
        >
          <Clock className="w-3 h-3" />
          <span>{formatCreatedAt(review.createdAt)}</span>
        </motion.div>

        {showStats && (
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.3 }}
          >
            <button
              onClick={() => onLike?.(review.id)}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-500 
                       transition-colors duration-200 group"
            >
              <Heart className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>42</span>
            </button>
            
            <button
              onClick={() => onComment?.(review.id)}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-500 
                       transition-colors duration-200 group"
            >
              <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>12</span>
            </button>
          </motion.div>
        )}
      </footer>

      {/* Floating Lotus Icon for Featured Cards */}
      {variant === 'featured' && (
        <motion.div
          className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br 
                     from-orange-400 to-pink-400 rounded-full flex items-center 
                     justify-center text-white text-lg shadow-lg"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 1, duration: 0.5, ease: "backOut" }}
        >
          ⭐
        </motion.div>
      )}

      {/* Gentle Breathing Effect for Meditation Content */}
      {review.dharmaName.includes('명상') && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent 
                     via-white/5 to-transparent pointer-events-none rounded-inherit"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.01, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        />
      )}
    </motion.article>
  )
}

export default DharmaCard