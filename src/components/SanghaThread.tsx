/**
 * SanghaThread - 상가(공동체) 게시글 컴포넌트
 * Modern typography와 2025년 디자인 트렌드 적용
 */

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreHorizontal, 
  User,
  Calendar,
  Eye,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

interface SanghaThreadProps {
  id: string
  title: string
  content: string
  author: {
    name: string
    avatar?: string
    rank?: 'novice' | 'practitioner' | 'teacher' | 'master'
  }
  category: 'dharma' | 'meditation' | 'community' | 'question' | 'sharing'
  createdAt: string
  stats: {
    likes: number
    comments: number
    views: number
    bookmarks: number
  }
  tags?: string[]
  isLiked?: boolean
  isBookmarked?: boolean
  className?: string
  onLike?: (id: string) => void
  onComment?: (id: string) => void
  onShare?: (id: string) => void
  onBookmark?: (id: string) => void
}

const CATEGORY_CONFIG = {
  dharma: { emoji: '📿', color: 'from-orange-400 to-yellow-400', name: '법문' },
  meditation: { emoji: '🧘', color: 'from-teal-400 to-cyan-400', name: '명상' },
  community: { emoji: '🤝', color: 'from-purple-400 to-pink-400', name: '공동체' },
  question: { emoji: '❓', color: 'from-blue-400 to-indigo-400', name: '질문' },
  sharing: { emoji: '💫', color: 'from-green-400 to-emerald-400', name: '나눔' }
}

const RANK_CONFIG = {
  novice: { emoji: '🌱', color: 'text-green-600', name: '초심자' },
  practitioner: { emoji: '🪷', color: 'text-blue-600', name: '수행자' },
  teacher: { emoji: '🕯️', color: 'text-orange-600', name: '지도자' },
  master: { emoji: '⛩️', color: 'text-purple-600', name: '스승' }
}

export const SanghaThread: React.FC<SanghaThreadProps> = ({
  id,
  title,
  content,
  author,
  category,
  createdAt,
  stats,
  tags = [],
  isLiked = false,
  isBookmarked = false,
  className = '',
  onLike,
  onComment,
  onShare,
  onBookmark
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showActions, setShowActions] = useState(false)
  const [liked, setLiked] = useState(isLiked)
  const [bookmarked, setBookmarked] = useState(isBookmarked)

  const categoryConfig = CATEGORY_CONFIG[category]
  const rankConfig = author.rank ? RANK_CONFIG[author.rank] : null

  const handleLike = () => {
    setLiked(!liked)
    onLike?.(id)
  }

  const handleBookmark = () => {
    setBookmarked(!bookmarked)
    onBookmark?.(id)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return '방금 전'
    if (diffInHours < 24) return `${diffInHours}시간 전`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}일 전`
    
    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric'
    })
  }

  const shouldTruncate = content.length > 200
  const displayContent = isExpanded || !shouldTruncate 
    ? content 
    : content.substring(0, 200) + '...'

  return (
    <motion.article
      className={`glass interactive glow relative ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      onHoverStart={() => setShowActions(true)}
      onHoverEnd={() => setShowActions(false)}
    >
      {/* Header */}
      <header className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          {/* Category Badge */}
          <motion.div
            className={`
              flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium text-white
              bg-gradient-to-r ${categoryConfig.color}
            `}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <span>{categoryConfig.emoji}</span>
            <span>{categoryConfig.name}</span>
          </motion.div>

          {/* More Actions */}
          <AnimatePresence>
            {showActions && (
              <motion.button
                className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <MoreHorizontal className="w-5 h-5 text-gray-600" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Title */}
        <motion.h2
          className="text-heading-md gradient-text mb-3 leading-tight"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          {title}
        </motion.h2>

        {/* Author Info */}
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            {author.avatar ? (
              <img
                src={author.avatar}
                alt={author.name}
                className="w-8 h-8 rounded-full border-2 border-white/30"
              />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-teal-400 
                           rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <span className="text-body font-medium text-gray-800">
                {author.name}
              </span>
              {rankConfig && (
                <div className={`flex items-center gap-1 ${rankConfig.color}`}>
                  <span className="text-sm">{rankConfig.emoji}</span>
                  <span className="text-xs font-medium">{rankConfig.name}</span>
                </div>
              )}
            </div>
          </motion.div>

          <div className="text-gray-400">•</div>
          
          <motion.div
            className="flex items-center gap-1 text-body-sm text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            <Calendar className="w-4 h-4" />
            <span>{formatDate(createdAt)}</span>
          </motion.div>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <motion.div
            className="flex flex-wrap gap-2 mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.3 }}
          >
            {tags.map((tag, index) => (
              <span
                key={tag}
                className="px-2 py-1 bg-white/30 rounded-md text-xs text-gray-700
                         hover:bg-white/40 transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </motion.div>
        )}
      </header>

      {/* Content */}
      <div className="px-6 pb-4">
        <motion.div
          className="text-body text-gray-700 leading-relaxed mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          <div className="prose max-w-none">
            {displayContent.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-3 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </motion.div>

        {/* Expand/Collapse Button */}
        {shouldTruncate && (
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700
                     font-medium transition-colors group"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.3 }}
          >
            <span>{isExpanded ? '접기' : '더보기'}</span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 group-hover:transform group-hover:-translate-y-0.5 
                                  transition-transform" />
            ) : (
              <ChevronDown className="w-4 h-4 group-hover:transform group-hover:translate-y-0.5 
                                   transition-transform" />
            )}
          </motion.button>
        )}
      </div>

      {/* Footer Actions */}
      <footer className="px-6 py-4 border-t border-white/20">
        <div className="flex items-center justify-between">
          {/* Stats */}
          <motion.div
            className="flex items-center gap-4 text-sm text-gray-600"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.3 }}
          >
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{stats.views.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span>{stats.comments}</span>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.3 }}
          >
            <motion.button
              onClick={handleLike}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                transition-all duration-200 group
                ${liked 
                  ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                  : 'hover:bg-white/30 text-gray-600 hover:text-red-600'
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Heart 
                className={`w-4 h-4 transition-all group-hover:scale-110 ${
                  liked ? 'fill-current' : ''
                }`} 
              />
              <span>{stats.likes + (liked && !isLiked ? 1 : 0)}</span>
            </motion.button>

            <motion.button
              onClick={() => onComment?.(id)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                       hover:bg-white/30 text-gray-600 hover:text-blue-600 transition-all duration-200 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>댓글</span>
            </motion.button>

            <motion.button
              onClick={handleBookmark}
              className={`
                p-2 rounded-lg transition-all duration-200 group
                ${bookmarked 
                  ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                  : 'hover:bg-white/30 text-gray-600 hover:text-yellow-600'
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bookmark 
                className={`w-4 h-4 group-hover:scale-110 transition-all ${
                  bookmarked ? 'fill-current' : ''
                }`} 
              />
            </motion.button>

            <motion.button
              onClick={() => onShare?.(id)}
              className="p-2 rounded-lg hover:bg-white/30 text-gray-600 hover:text-green-600 
                       transition-all duration-200 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
      </footer>

      {/* Decorative Elements */}
      <div className="absolute top-4 right-6 text-2xl opacity-20 pointer-events-none">
        {categoryConfig.emoji}
      </div>
    </motion.article>
  )
}

export default SanghaThread