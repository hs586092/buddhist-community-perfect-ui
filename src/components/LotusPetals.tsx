/**
 * 🌸 Lotus Petals Animation Component
 * 연꽃잎 파티클 효과로 평온한 배경 애니메이션 구현
 */

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Petal {
  id: number
  x: number
  y: number
  delay: number
  duration: number
  size: number
  opacity: number
}

interface LotusPetalsProps {
  count?: number
  className?: string
}

export const LotusPetals: React.FC<LotusPetalsProps> = ({ 
  count = 20, 
  className = '' 
}) => {
  const [petals, setPetals] = useState<Petal[]>([])

  useEffect(() => {
    const generatePetals = () => {
      const newPetals: Petal[] = []
      
      for (let i = 0; i < count; i++) {
        newPetals.push({
          id: i,
          x: Math.random() * 100, // 화면 너비의 %
          y: Math.random() * 100, // 화면 높이의 %
          delay: Math.random() * 8, // 0-8초 지연
          duration: 8 + Math.random() * 4, // 8-12초 지속
          size: 0.5 + Math.random() * 1.5, // 0.5-2배 크기
          opacity: 0.3 + Math.random() * 0.4 // 0.3-0.7 투명도
        })
      }
      
      setPetals(newPetals)
    }

    generatePetals()
  }, [count])

  const petalVariants = {
    initial: (custom: Petal) => ({
      x: `${custom.x}vw`,
      y: `${custom.y}vh`,
      rotate: 0,
      scale: custom.size,
      opacity: 0
    }),
    animate: (custom: Petal) => ({
      y: [`${custom.y}vh`, `${custom.y - 10}vh`, `${custom.y}vh`],
      rotate: [0, 180, 360],
      opacity: [0, custom.opacity, 0],
      transition: {
        duration: custom.duration,
        delay: custom.delay,
        repeat: Infinity,
        ease: "easeInOut"
      }
    })
  }

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}>
      <AnimatePresence>
        {petals.map((petal) => (
          <motion.div
            key={petal.id}
            custom={petal}
            variants={petalVariants}
            initial="initial"
            animate="animate"
            className="absolute"
            style={{
              filter: 'blur(1px)'
            }}
          >
            {/* 연꽃잎 모양 SVG */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 2C6 2 4 4 4 8C4 12 6 14 8 14C10 14 12 12 12 8C12 4 10 2 8 2Z"
                fill="url(#petalGradient)"
                fillOpacity={petal.opacity}
              />
              <defs>
                <linearGradient id="petalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F8BBD9" />
                  <stop offset="50%" stopColor="#E879F9" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {/* 추가 연꽃 이미지들 */}
      <div className="absolute top-10 left-10 text-6xl opacity-20 floating-petals">
        🪷
      </div>
      <div className="absolute top-32 right-20 text-4xl opacity-15 floating-petals" style={{ animationDelay: '2s' }}>
        🌸
      </div>
      <div className="absolute bottom-40 left-1/4 text-5xl opacity-25 floating-petals" style={{ animationDelay: '4s' }}>
        🪷
      </div>
      <div className="absolute bottom-20 right-10 text-3xl opacity-20 floating-petals" style={{ animationDelay: '6s' }}>
        🌺
      </div>
    </div>
  )
}