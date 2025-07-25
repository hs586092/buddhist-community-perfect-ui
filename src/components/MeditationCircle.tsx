/**
 * 🧘‍♂️ Meditation Circle - "명상 타이머"
 * 인터랙티브 원형 프로그레스 바가 있는 명상 타이머
 */

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface MeditationCircleProps {
  className?: string
}

interface MeditationSession {
  id: string
  name: string
  duration: number // minutes
  description: string
  guidedAudio?: string
  icon: string
  color: string
}

export const MeditationCircle: React.FC<MeditationCircleProps> = ({ 
  className = '' 
}) => {
  const [selectedSession, setSelectedSession] = useState<MeditationSession | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0) // seconds
  const [progress, setProgress] = useState(0) // 0-100
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale')

  const meditationSessions: MeditationSession[] = [
    {
      id: 'mindfulness',
      name: '마음챙김 명상',
      duration: 10,
      description: '현재 순간에 집중하는 기본 명상',
      icon: '🧘‍♂️',
      color: 'spiritual'
    },
    {
      id: 'loving-kindness',
      name: '자비명상',
      duration: 15,
      description: '모든 존재에 대한 자비심을 기르는 명상',
      icon: '💝',
      color: 'lotus'
    },
    {
      id: 'breath',
      name: '호흡명상',
      duration: 20,
      description: '호흡에 집중하여 마음을 안정시키는 명상',
      icon: '🌬️',
      color: 'natural'
    },
    {
      id: 'walking',
      name: '걷기명상',
      duration: 25,
      description: '걸으면서 하는 동적 명상',
      icon: '🚶‍♂️',
      color: 'saffron'
    }
  ]

  // 타이머 로직
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          const newTime = time - 1
          if (selectedSession) {
            const totalSeconds = selectedSession.duration * 60
            setProgress(((totalSeconds - newTime) / totalSeconds) * 100)
          }
          return newTime
        })
      }, 1000)
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false)
      // 명상 완료 처리
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft, selectedSession])

  // 호흡 가이드 로직
  useEffect(() => {
    if (isActive) {
      const breathCycle = setInterval(() => {
        setBreathPhase(current => {
          switch (current) {
            case 'inhale': return 'hold'
            case 'hold': return 'exhale'
            case 'exhale': return 'inhale'
            default: return 'inhale'
          }
        })
      }, 4000) // 4초 주기

      return () => clearInterval(breathCycle)
    }
  }, [isActive])

  const startMeditation = useCallback((session: MeditationSession) => {
    setSelectedSession(session)
    setTimeLeft(session.duration * 60)
    setProgress(0)
    setIsActive(true)
  }, [])

  const pauseMeditation = useCallback(() => {
    setIsActive(!isActive)
  }, [isActive])

  const resetMeditation = useCallback(() => {
    setIsActive(false)
    setTimeLeft(0)
    setProgress(0)
    setSelectedSession(null)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getBreathInstruction = () => {
    switch (breathPhase) {
      case 'inhale': return '들이마시세요'
      case 'hold': return '잠시 멈추세요'
      case 'exhale': return '내쉬세요'
    }
  }

  const circleVariants = {
    inhale: {
      scale: 1.1,
      transition: { duration: 4, ease: "easeInOut" }
    },
    hold: {
      scale: 1.1,
      transition: { duration: 1, ease: "easeInOut" }
    },
    exhale: {
      scale: 1,
      transition: { duration: 4, ease: "easeInOut" }
    }
  }

  const radius = 120
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <section className={`py-20 px-6 ${className}`}>
      <div className="max-w-4xl mx-auto text-center">
        {/* 🧘‍♂️ 섹션 헤더 */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="mandala-spin text-4xl">
              🧘‍♂️
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gradient-spiritual text-sutra">
              명상 센터
            </h2>
            <div className="mandala-spin text-4xl" style={{ animationDirection: 'reverse' }}>
              🧘‍♀️
            </div>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto text-dharma">
            마음의 평안을 찾고 내면의 고요함을 경험하세요
          </p>
        </motion.div>

        {!selectedSession ? (
          /* 🎯 명상 세션 선택 */
          <motion.div
            className="mandala-grid gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {meditationSessions.map((session, index) => (
              <motion.div
                key={session.id}
                className="zen-glass-organic p-8 zen-interactive cursor-pointer group"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => startMeditation(session)}
              >
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {session.icon}
                </div>
                <h3 className="text-xl font-bold text-gradient-spiritual mb-2 text-sutra">
                  {session.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 text-dharma">
                  {session.description}
                </p>
                <div className="flex items-center justify-center gap-2 text-gray-500">
                  <span>⏱️</span>
                  <span>{session.duration}분</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* 🎯 명상 타이머 인터페이스 */
          <motion.div
            className="zen-glass-organic p-12 max-w-lg mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* 원형 프로그레스 바 */}
            <div className="relative mb-8">
              <motion.div
                className="relative w-80 h-80 mx-auto"
                variants={circleVariants}
                animate={isActive ? breathPhase : 'exhale'}
              >
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 280 280">
                  {/* 배경 원 */}
                  <circle
                    cx="140"
                    cy="140"
                    r={radius}
                    stroke="rgba(248, 187, 217, 0.2)"
                    strokeWidth="8"
                    fill="none"
                  />
                  
                  {/* 프로그레스 원 */}
                  <motion.circle
                    cx="140"
                    cy="140"
                    r={radius}
                    stroke="url(#progressGradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                  
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#F8BBD9" />
                      <stop offset="50%" stopColor="#E879F9" />
                      <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* 중앙 콘텐츠 */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-6xl mb-4">
                    {selectedSession.icon}
                  </div>
                  <div className="text-4xl font-bold text-gradient-spiritual mb-2">
                    {formatTime(timeLeft)}
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    {selectedSession.name}
                  </div>
                  
                  {/* 호흡 가이드 */}
                  <AnimatePresence mode="wait">
                    {isActive && (
                      <motion.div
                        key={breathPhase}
                        className="text-center"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="text-lg font-medium text-gradient-lotus mb-2">
                          {getBreathInstruction()}
                        </div>
                        <div className="flex justify-center gap-1">
                          {['inhale', 'hold', 'exhale'].map((phase) => (
                            <div
                              key={phase}
                              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                breathPhase === phase
                                  ? 'bg-lotus-pink scale-125'
                                  : 'bg-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>

            {/* 컨트롤 버튼들 */}
            <div className="flex justify-center gap-4">
              <motion.button
                className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'lotus-btn'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={pauseMeditation}
              >
                {isActive ? '⏸️ 일시정지' : '▶️ 시작'}
              </motion.button>

              <motion.button
                className="px-8 py-3 rounded-full font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetMeditation}
              >
                🔄 초기화
              </motion.button>
            </div>

            {/* 진행률 표시 */}
            <div className="mt-6 text-center">
              <div className="text-sm text-gray-500 mb-2">
                진행률: {Math.round(progress)}%
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-lotus h-2 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* 🌸 하단 가이드 */}
        <motion.div
          className="mt-16 zen-glass p-6 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <h3 className="text-lg font-semibold text-gradient-spiritual mb-4">
            명상 가이드
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="text-center">
              <div className="text-2xl mb-2">🧘‍♂️</div>
              <p className="text-dharma">편안한 자세로 앉아주세요</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🌬️</div>
              <p className="text-dharma">호흡에 집중하세요</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🧠</div>
              <p className="text-dharma">떠오르는 생각을 관찰하세요</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}