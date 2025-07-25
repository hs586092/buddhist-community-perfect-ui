/**
 * 🏛️ Zen Navigation - "사천왕문"
 * 선 글래스모피즘 네비게이션 바
 */

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface NavItem {
  id: string
  label: string
  icon: string
  href: string
  description: string
}

interface ZenNavigationProps {
  className?: string
  onThemeToggle?: () => void
  isDarkMode?: boolean
}

export const ZenNavigation: React.FC<ZenNavigationProps> = ({ 
  className = '',
  onThemeToggle,
  isDarkMode = false
}) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeItem, setActiveItem] = useState('dharma')
  const [showNotifications, setShowNotifications] = useState(false)

  const navItems: NavItem[] = [
    {
      id: 'dharma',
      label: '법문',
      icon: '📿',
      href: '/dharma',
      description: '지혜로운 가르침'
    },
    {
      id: 'meditation',
      label: '명상',
      icon: '🧘‍♂️',
      href: '/meditation',
      description: '마음의 평화'
    },
    {
      id: 'community',
      label: '커뮤니티',
      icon: '🤝',
      href: '/community',
      description: '함께하는 수행'
    },
    {
      id: 'schedule',
      label: '일정',
      icon: '📅',
      href: '/schedule',
      description: '법회와 모임'
    },
    {
      id: 'prayer',
      label: '기도',
      icon: '🙏',
      href: '/prayer',
      description: '간구와 발원'
    }
  ]

  const notifications = [
    { id: 1, title: '오늘 저녁 7시 온라인 명상', time: '30분 전', type: 'meditation' },
    { id: 2, title: '새로운 법문이 등록되었습니다', time: '1시간 전', type: 'dharma' },
    { id: 3, title: '부처님 오신 날 특별 행사', time: '2시간 전', type: 'event' }
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navVariants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    },
    hidden: {
      opacity: 0,
      y: -50
    }
  }

  const itemVariants = {
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    },
    hidden: {
      opacity: 0,
      x: -20
    }
  }

  const notificationVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: -20
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: -20,
      transition: { duration: 0.2 }
    }
  }

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${className}`}
        variants={navVariants}
        initial="hidden"
        animate="visible"
      >
        <div 
          className={`zen-glass transition-all duration-500 ${
            isScrolled 
              ? 'backdrop-blur-xl bg-white/20 shadow-lg' 
              : 'backdrop-blur-sm bg-white/10'
          }`}
          style={{
            borderRadius: isScrolled ? '0 0 20px 20px' : '0',
            margin: isScrolled ? '0' : '1rem',
            marginBottom: 0
          }}
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* 🪷 로고 */}
              <motion.div
                className="flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="mandala-spin text-3xl">
                  🪷
                </div>
                <div>
                  <h1 className="text-gradient-lotus font-bold text-xl text-sutra">
                    평화로운 상가
                  </h1>
                  <p className="text-xs text-gray-500">Buddhist Community</p>
                </div>
              </motion.div>

              {/* 🧭 메인 네비게이션 */}
              <div className="hidden md:flex items-center gap-1">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    className={`relative px-4 py-2 rounded-full transition-all duration-300 group ${
                      activeItem === item.id
                        ? 'bg-white/30 text-purple-600'
                        : 'hover:bg-white/20 text-gray-600'
                    }`}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveItem(item.id)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{item.icon}</span>
                      <span className="font-medium text-dharma">{item.label}</span>
                    </div>
                    
                    {/* 툴팁 */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                      {item.description}
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* 🔔 우측 액션 버튼들 */}
              <div className="flex items-center gap-3">
                {/* 알림 버튼 */}
                <div className="relative">
                  <motion.button
                    className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 relative"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    <span className="text-xl">🔔</span>
                    {notifications.length > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-bold">
                          {notifications.length}
                        </span>
                      </div>
                    )}
                  </motion.button>

                  {/* 알림 드롭다운 */}
                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div
                        className="absolute top-full right-0 mt-2 w-80 zen-glass border border-white/20"
                        variants={notificationVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <div className="p-4">
                          <h3 className="text-gradient-lotus font-semibold mb-3">
                            알림
                          </h3>
                          <div className="space-y-3">
                            {notifications.map((notification) => (
                              <div
                                key={notification.id}
                                className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                              >
                                <div className="text-lg">
                                  {notification.type === 'meditation' ? '🧘‍♂️' : 
                                   notification.type === 'dharma' ? '📿' : '🎉'}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-800">
                                    {notification.title}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {notification.time}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 테마 토글 */}
                <motion.button
                  className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onThemeToggle}
                >
                  <span className="text-xl">
                    {isDarkMode ? '🌅' : '🌙'}
                  </span>
                </motion.button>

                {/* 프로필 */}
                <motion.button
                  className="flex items-center gap-2 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-8 h-8 rounded-full bg-lotus-gradient flex items-center justify-center">
                    <span className="text-white text-sm font-bold">평</span>
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    평화로운마음
                  </span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* 📱 모바일 메뉴 */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <div className="zen-glass border-t border-white/20">
          <div className="flex items-center justify-around py-2">
            {navItems.slice(0, 4).map((item) => (
              <motion.button
                key={item.id}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-300 ${
                  activeItem === item.id
                    ? 'text-purple-600'
                    : 'text-gray-600'
                }`}
                whileTap={{ scale: 0.9 }}
                onClick={() => setActiveItem(item.id)}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-xs font-medium">{item.label}</span>
              </motion.button>
            ))}
            <motion.button
              className="flex flex-col items-center gap-1 p-2 rounded-lg text-gray-600"
              whileTap={{ scale: 0.9 }}
            >
              <span className="text-lg">⋯</span>
              <span className="text-xs font-medium">더보기</span>
            </motion.button>
          </div>
        </div>
      </div>
    </>
  )
}