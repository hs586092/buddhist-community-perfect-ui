/**
 * FloatingActionButton - 연꽃 아이콘이 있는 플로팅 액션 버튼
 * Framer Motion 애니메이션과 마이크로 인터랙션 적용
 */

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit3, Camera, Mic, X } from 'lucide-react'

interface FloatingActionButtonProps {
  onNewPost?: () => void
  onNewReview?: () => void
  onNewPhoto?: () => void
  onNewVoice?: () => void
  className?: string
}

const actionItems = [
  { 
    icon: Edit3, 
    label: '글 작성', 
    action: 'newPost',
    gradient: 'from-orange-400 to-yellow-400',
    delay: 0.1 
  },
  { 
    icon: Camera, 
    label: '사진 공유', 
    action: 'newPhoto',
    gradient: 'from-teal-400 to-cyan-400',
    delay: 0.2 
  },
  { 
    icon: Mic, 
    label: '음성 메모', 
    action: 'newVoice',
    gradient: 'from-purple-400 to-pink-400',
    delay: 0.3 
  }
]

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onNewPost,
  onNewReview,
  onNewPhoto,
  onNewVoice,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleAction = (action: string) => {
    switch (action) {
      case 'newPost':
        onNewPost?.()
        break
      case 'newPhoto':
        onNewPhoto?.()
        break
      case 'newVoice':
        onNewVoice?.()
        break
      default:
        onNewReview?.()
    }
    setIsOpen(false)
  }

  const mainButtonVariants = {
    idle: { 
      scale: 1,
      rotate: 0,
      boxShadow: '0 8px 32px rgba(244, 162, 97, 0.3)'
    },
    hover: { 
      scale: 1.1,
      rotate: 0,
      boxShadow: '0 12px 40px rgba(244, 162, 97, 0.4)'
    },
    tap: { 
      scale: 1.05,
      rotate: 0
    },
    open: {
      scale: 1.1,
      rotate: 45,
      boxShadow: '0 12px 40px rgba(233, 196, 106, 0.5)'
    }
  }

  const overlayVariants = {
    closed: { opacity: 0 },
    open: { 
      opacity: 1,
      transition: { duration: 0.2 }
    }
  }

  const actionItemVariants = {
    closed: (i: number) => ({
      opacity: 0,
      scale: 0,
      y: 20,
      x: 0,
      transition: {
        delay: i * 0.05
      }
    }),
    open: (i: number) => ({
      opacity: 1,
      scale: 1,
      y: -(60 + i * 60),
      x: 0,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 15,
        delay: i * 0.1
      }
    })
  }

  const labelVariants = {
    closed: { opacity: 0, x: 20, scale: 0.8 },
    open: { 
      opacity: 1, 
      x: -8, 
      scale: 1,
      transition: { delay: 0.3, duration: 0.2 }
    }
  }

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        {/* Action Items */}
        <AnimatePresence>
          {isOpen && (
            <div className="absolute bottom-0 right-0">
              {actionItems.map((item, index) => (
                <motion.div
                  key={item.action}
                  className="absolute bottom-0 right-0 flex items-center"
                  custom={index}
                  variants={actionItemVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                >
                  {/* Label */}
                  <motion.div
                    className="mr-4 bg-white rounded-lg px-3 py-2 shadow-lg"
                    variants={labelVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                  >
                    <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                      {item.label}
                    </span>
                  </motion.div>

                  {/* Action Button */}
                  <motion.button
                    onClick={() => handleAction(item.action)}
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center text-white
                      bg-gradient-to-r ${item.gradient} shadow-lg
                      hover:shadow-xl transition-shadow duration-200
                    `}
                    whileHover={{ 
                      scale: 1.1,
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <item.icon className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Main FAB */}
        <motion.button
          className="w-14 h-14 bg-gradient-to-r from-orange-400 to-yellow-400 
                   rounded-full flex items-center justify-center text-white
                   relative overflow-hidden"
          variants={mainButtonVariants}
          initial="idle"
          animate={isOpen ? "open" : isHovered ? "hover" : "idle"}
          whileTap="tap"
          onClick={() => setIsOpen(!isOpen)}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          {/* Breathing Background Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          />

          {/* Lotus Icon */}
          <motion.div
            className="relative z-10 text-2xl"
            animate={{
              rotate: isOpen ? 45 : 0
            }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            {isOpen ? <X className="w-6 h-6" /> : '🪷'}
          </motion.div>

          {/* Ripple Effect on Click */}
          <motion.div
            className="absolute inset-0 bg-white rounded-full"
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 0, opacity: 0.5 }}
            whileTap={{
              scale: [0, 1.5],
              opacity: [0.5, 0],
              transition: { duration: 0.4 }
            }}
          />

          {/* Glow Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-orange-400 to-yellow-400 
                     rounded-full blur-lg opacity-30"
            animate={{
              scale: isHovered ? 1.3 : 1,
              opacity: isHovered ? 0.5 : 0.3
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>

        {/* Floating Particles */}
        <AnimatePresence>
          {isHovered && (
            <>
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                  initial={{
                    opacity: 0,
                    scale: 0,
                    x: 28,
                    y: 28
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    x: 28 + (Math.random() - 0.5) * 60,
                    y: 28 + (Math.random() - 0.5) * 60
                  }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.2,
                    ease: "easeOut"
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

export default FloatingActionButton