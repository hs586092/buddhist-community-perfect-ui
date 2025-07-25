/**
 * 🤝 Community Feed - "커뮤니티 피드"
 * 인스타그램 스타일 + 불교 감성의 커뮤니티 피드
 */

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Post {
  id: string
  author: {
    name: string
    avatar: string
    rank: 'novice' | 'practitioner' | 'teacher' | 'master'
    temple?: string
  }
  content: string
  images?: string[]
  timestamp: string
  likes: number
  comments: number
  tags: string[]
  category: 'sharing' | 'question' | 'teaching' | 'event'
  isLiked: boolean
  isBookmarked: boolean
}

interface CommunityFeedProps {
  className?: string
}

export const CommunityFeed: React.FC<CommunityFeedProps> = ({ 
  className = '' 
}) => {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: {
        name: '지혜로운마음',
        avatar: '🧘‍♀️',
        rank: 'practitioner',
        temple: '조계사'
      },
      content: '오늘 새벽 명상 중에 문득 깨달았습니다. 마음의 평화는 바깥에서 찾는 것이 아니라 내 안에 이미 있다는 것을... 모든 존재가 행복하기를 🙏',
      images: ['/images/meditation1.jpg'],
      timestamp: '2시간 전',
      likes: 42,
      comments: 8,
      tags: ['명상', '깨달음', '평화'],
      category: 'sharing',
      isLiked: false,
      isBookmarked: false
    },
    {
      id: '2',
      author: {
        name: '혜민스님',
        avatar: '👨‍🦲',
        rank: 'master',
        temple: '백련사'
      },
      content: '"물이 바위를 뚫는 것은 힘이 세기 때문이 아니라 끊이지 않기 때문이다." - 수행도 마찬가지입니다. 작은 실천이라도 꾸준히 하는 것이 중요합니다.',
      timestamp: '4시간 전',
      likes: 156,
      comments: 23,
      tags: ['법문', '수행', '지혜'],
      category: 'teaching',
      isLiked: true,
      isBookmarked: true
    },
    {
      id: '3',
      author: {
        name: '새싹수행자',
        avatar: '🌱',
        rank: 'novice'
      },
      content: '불교를 처음 접하는 초보자인데요, 명상할 때 자꾸 잡념이 들어서 집중이 안됩니다. 어떻게 하면 좋을까요? 좋은 방법이 있다면 공유해주세요 🙏',
      timestamp: '6시간 전',
      likes: 28,
      comments: 15,
      tags: ['질문', '명상', '초보자'],
      category: 'question',
      isLiked: false,
      isBookmarked: false
    }
  ])

  const [showNewPost, setShowNewPost] = useState(false)
  const [filter, setFilter] = useState<string>('all')

  const filters = [
    { id: 'all', label: '전체', icon: '📿' },
    { id: 'sharing', label: '나눔', icon: '💝' },
    { id: 'question', label: '질문', icon: '❓' },
    { id: 'teaching', label: '법문', icon: '📜' },
    { id: 'event', label: '행사', icon: '🎉' }
  ]

  const getRankIcon = (rank: string) => {
    switch (rank) {
      case 'novice': return '🌱'
      case 'practitioner': return '🧘‍♂️'
      case 'teacher': return '📿'
      case 'master': return '☸️'
      default: return '🙏'
    }
  }

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'novice': return 'text-green-600'
      case 'practitioner': return 'text-blue-600'
      case 'teacher': return 'text-purple-600'
      case 'master': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  const toggleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ))
  }

  const toggleBookmark = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    ))
  }

  const filteredPosts = filter === 'all' 
    ? posts 
    : posts.filter(post => post.category === filter)

  const postVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: (index: number) => ({ 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        delay: index * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  }

  return (
    <section className={`py-20 px-6 ${className}`}>
      <div className="max-w-2xl mx-auto">
        {/* 🤝 섹션 헤더 */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="mandala-spin text-4xl">
              🤝
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gradient-lotus text-sutra">
              커뮤니티
            </h2>
            <div className="mandala-spin text-4xl" style={{ animationDirection: 'reverse' }}>
              🤝
            </div>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto text-dharma">
            수행자들이 서로의 경험과 지혜를 나누는 공간
          </p>
        </motion.div>

        {/* 🏷️ 필터 */}
        <motion.div
          className="flex justify-center gap-2 mb-8 overflow-x-auto pb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {filters.map((filterItem) => (
            <motion.button
              key={filterItem.id}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 whitespace-nowrap ${
                filter === filterItem.id
                  ? 'bg-lotus text-white shadow-lg'
                  : 'zen-glass hover:bg-white/30'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(filterItem.id)}
            >
              <span>{filterItem.icon}</span>
              <span>{filterItem.label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* ✍️ 새 글 작성 */}
        <motion.div
          className="zen-glass-organic p-4 mb-8 cursor-pointer hover:bg-white/20 transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          onClick={() => setShowNewPost(true)}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-lotus-gradient rounded-full flex items-center justify-center">
              <span className="text-white">🧘‍♂️</span>
            </div>
            <div className="flex-1 text-gray-500 text-dharma">
              오늘의 수행 경험을 나누어주세요...
            </div>
            <button className="text-2xl">✨</button>
          </div>
        </motion.div>

        {/* 📱 피드 */}
        <div className="space-y-6">
          <AnimatePresence>
            {filteredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                className="zen-glass-organic overflow-hidden"
                variants={postVariants}
                initial="hidden"
                animate="visible"
                custom={index}
                layout
              >
                {/* 👤 헤더 */}
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-lotus-gradient rounded-full flex items-center justify-center text-xl">
                        {post.author.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-dharma">
                            {post.author.name}
                          </h3>
                          <span className={`text-sm ${getRankColor(post.author.rank)}`}>
                            {getRankIcon(post.author.rank)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          {post.author.temple && (
                            <span>{post.author.temple}</span>
                          )}
                          <span>•</span>
                          <span>{post.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      ⋯
                    </button>
                  </div>
                </div>

                {/* 📝 콘텐츠 */}
                <div className="p-4">
                  <p className="text-gray-800 leading-relaxed mb-4 text-dharma">
                    {post.content}
                  </p>

                  {/* 🏷️ 태그 */}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-white/30 text-sm rounded-full text-gray-600 hover:bg-white/40 cursor-pointer transition-colors"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 🖼️ 이미지 */}
                  {post.images && post.images.length > 0 && (
                    <div className="mb-4 rounded-lg overflow-hidden">
                      <div className="aspect-video bg-meditation-gradient flex items-center justify-center">
                        <span className="text-6xl opacity-50">🧘‍♂️</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 🎯 액션 바 */}
                <div className="p-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <motion.button
                        className={`flex items-center gap-2 ${
                          post.isLiked ? 'text-red-500' : 'text-gray-500'
                        } hover:text-red-500 transition-colors`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleLike(post.id)}
                      >
                        <span className="text-lg">
                          {post.isLiked ? '❤️' : '🤍'}
                        </span>
                        <span className="text-sm font-medium">
                          {post.likes}
                        </span>
                      </motion.button>

                      <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors">
                        <span className="text-lg">💬</span>
                        <span className="text-sm font-medium">
                          {post.comments}
                        </span>
                      </button>

                      <button className="text-gray-500 hover:text-green-500 transition-colors">
                        <span className="text-lg">🔄</span>
                      </button>
                    </div>

                    <motion.button
                      className={`${
                        post.isBookmarked ? 'text-yellow-500' : 'text-gray-500'
                      } hover:text-yellow-500 transition-colors`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleBookmark(post.id)}
                    >
                      <span className="text-lg">
                        {post.isBookmarked ? '🔖' : '📑'}
                      </span>
                    </motion.button>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {/* 🌸 로딩 더 많은 게시글 */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <button className="lotus-btn text-lg px-8 py-3">
            <span className="flex items-center gap-3">
              📜 더 많은 게시글 보기
            </span>
          </button>
        </motion.div>
      </div>

      {/* ✍️ 새 글 작성 모달 */}
      <AnimatePresence>
        {showNewPost && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowNewPost(false)}
          >
            <motion.div
              className="zen-glass-organic p-6 w-full max-w-lg"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gradient-lotus text-sutra">
                  새 글 작성
                </h3>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setShowNewPost(false)}
                >
                  ✕
                </button>
              </div>

              <textarea
                className="w-full h-32 p-4 border border-white/20 rounded-lg bg-white/10 backdrop-blur-sm resize-none focus:outline-none focus:ring-2 focus:ring-lotus-pink text-dharma"
                placeholder="오늘의 수행 경험이나 깨달음을 나누어주세요..."
              />

              <div className="flex items-center justify-between mt-4">
                <div className="flex gap-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                    📷
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                    🏷️
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                    😊
                  </button>
                </div>
                <button className="lotus-btn px-6 py-2">
                  게시하기
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}