/**
 * 🏛️ Dharma Gallery - "법문 갤러리"
 * 3D 회전 효과가 있는 법문 카드 갤러리 컴포넌트
 */

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface DharmaTeaching {
  id: string
  title: string
  teacher: string
  temple: string
  excerpt: string
  date: string
  duration: string
  category: 'wisdom' | 'compassion' | 'meditation' | 'sutra'
  image: string
  audioUrl?: string
  likes: number
  views: number
}

interface DharmaGalleryProps {
  className?: string
}

export const DharmaGallery: React.FC<DharmaGalleryProps> = ({ 
  className = '' 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const teachings: DharmaTeaching[] = [
    {
      id: '1',
      title: '자비명상의 실천과 일상 적용',
      teacher: '혜민 스님',
      temple: '조계사',
      excerpt: '모든 존재에 대한 자비심을 기르는 것이 얼마나 중요한지, 그리고 일상생활에서 어떻게 실천할 수 있는지에 대해 말씀드리겠습니다.',
      date: '2024.07.20',
      duration: '45분',
      category: 'compassion',
      image: '/images/dharma1.jpg',
      likes: 234,
      views: 1567
    },
    {
      id: '2',
      title: '법화경의 지혜 - 일승의 진리',
      teacher: '법륜 스님',
      temple: '정토회',
      excerpt: '법화경에서 말하는 일승의 진리란 무엇인지, 그리고 우리 삶에 어떤 의미를 주는지 함께 살펴보겠습니다.',
      date: '2024.07.18',
      duration: '52분',
      category: 'sutra',
      image: '/images/dharma2.jpg',
      likes: 189,
      views: 982
    },
    {
      id: '3',
      title: '호흡명상 - 마음의 안정을 찾는 길',
      teacher: '현각 스님',
      temple: '화계사',
      excerpt: '바쁜 일상 속에서도 실천할 수 있는 호흡명상법을 통해 마음의 평안을 찾아보세요.',
      date: '2024.07.15',
      duration: '38분',
      category: 'meditation',
      image: '/images/dharma3.jpg',
      likes: 312,
      views: 2134
    },
    {
      id: '4',
      title: '반야심경의 공(空) 사상',
      teacher: '자현 스님',
      temple: '중앙승가대',
      excerpt: '반야심경에서 말하는 공의 의미를 현대적 관점에서 이해하고, 실생활에 적용하는 방법을 배워보겠습니다.',
      date: '2024.07.12',
      duration: '41분',
      category: 'wisdom',
      image: '/images/dharma4.jpg',
      likes: 278,
      views: 1456
    }
  ]

  const categories = [
    { id: 'all', label: '전체', icon: '📿', color: 'lotus' },
    { id: 'wisdom', label: '지혜', icon: '🧠', color: 'spiritual' },
    { id: 'compassion', label: '자비', icon: '💝', color: 'lotus' },
    { id: 'meditation', label: '명상', icon: '🧘‍♂️', color: 'natural' },
    { id: 'sutra', label: '경전', icon: '📜', color: 'saffron' }
  ]

  const filteredTeachings = selectedCategory === 'all' 
    ? teachings 
    : teachings.filter(t => t.category === selectedCategory)

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      rotateX: -15
    },
    visible: (index: number) => ({ 
      opacity: 1, 
      y: 0,
      rotateX: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.6,
        ease: "easeOut"
      }
    }),
    hover: {
      y: -10,
      rotateX: 5,
      rotateY: 5,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category)
    return cat ? cat.icon : '📿'
  }

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id === category)
    return cat ? cat.color : 'lotus'
  }

  return (
    <section className={`py-20 px-6 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* 📿 섹션 헤더 */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="mandala-spin text-4xl">
              📿
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gradient-lotus text-sutra">
              법문 갤러리
            </h2>
            <div className="mandala-spin text-4xl" style={{ animationDirection: 'reverse' }}>
              📿
            </div>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto text-dharma">
            깨달은 스승들의 지혜로운 가르침을 통해 
            <br className="hidden md:block" />
            마음의 평화와 깨달음을 찾아보세요
          </p>
        </motion.div>

        {/* 🏷️ 카테고리 필터 */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? `bg-${category.color} text-white shadow-lg`
                  : 'zen-glass hover:bg-white/30'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.id)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <span className="text-lg">{category.icon}</span>
              <span>{category.label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* 🎭 법문 카드 그리드 */}
        <motion.div className="mandala-grid gap-8">
          <AnimatePresence mode="wait">
            {filteredTeachings.map((teaching, index) => (
              <motion.div
                key={teaching.id}
                className="zen-glass-organic overflow-hidden zen-interactive group cursor-pointer"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                custom={index}
                onHoverStart={() => setHoveredCard(teaching.id)}
                onHoverEnd={() => setHoveredCard(null)}
                style={{
                  transformStyle: 'preserve-3d',
                  perspective: '1000px'
                }}
              >
                {/* 🖼️ 카드 이미지 영역 */}
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-meditation-gradient opacity-80" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl opacity-60">
                      {getCategoryIcon(teaching.category)}
                    </div>
                  </div>
                  
                  {/* 재생 버튼 */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredCard === teaching.id ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-2xl ml-1">▶️</span>
                    </div>
                  </motion.div>

                  {/* 카테고리 배지 */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${getCategoryColor(teaching.category)} text-white`}>
                      {getCategoryIcon(teaching.category)} {categories.find(c => c.id === teaching.category)?.label}
                    </span>
                  </div>

                  {/* 재생시간 */}
                  <div className="absolute bottom-4 right-4">
                    <span className="px-2 py-1 bg-black/50 text-white text-sm rounded">
                      {teaching.duration}
                    </span>
                  </div>
                </div>

                {/* 📝 카드 콘텐츠 */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-gradient-spiritual mb-1 text-sutra">
                        {teaching.title}
                      </h3>
                      <p className="text-sm text-gray-600 text-dharma">
                        {teaching.teacher} · {teaching.temple}
                      </p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      {teaching.date}
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm leading-relaxed mb-4 text-dharma">
                    {teaching.excerpt}
                  </p>

                  {/* 📊 통계 */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        ❤️ {teaching.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        👁️ {teaching.views}
                      </span>
                    </div>
                    <motion.button
                      className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/50 hover:bg-white/70 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      🔖 저장
                    </motion.button>
                  </div>
                </div>

                {/* ✨ 호버 글로우 효과 */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  animate={{
                    boxShadow: hoveredCard === teaching.id 
                      ? `0 0 30px rgba(248, 187, 217, 0.4)` 
                      : `0 0 0px rgba(248, 187, 217, 0)`
                  }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* 📚 더보기 버튼 */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <button className="lotus-btn text-lg px-12 py-4">
            <span className="flex items-center gap-3">
              📚 더 많은 법문 보기
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  )
}