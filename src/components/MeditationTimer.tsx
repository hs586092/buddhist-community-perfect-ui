/**
 * MeditationTimer - Neumorphism 스타일의 명상 타이머 컴포넌트
 * 2025년 최신 디자인 트렌드 적용 - 불교 명상을 위한 맞춤 타이머
 */

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, Bell, Volume2, VolumeX } from 'lucide-react'

interface MeditationTimerProps {
  className?: string
  onComplete?: () => void
}

interface TimerState {
  duration: number // in seconds
  remaining: number
  isRunning: boolean
  isCompleted: boolean
}

const PRESET_TIMES = [
  { label: '5분', value: 5 * 60, emoji: '🌱' },
  { label: '10분', value: 10 * 60, emoji: '🪷' },
  { label: '15분', value: 15 * 60, emoji: '🕯️' },
  { label: '20분', value: 20 * 60, emoji: '⛩️' },
  { label: '30분', value: 30 * 60, emoji: '🏔️' },
]

export const MeditationTimer: React.FC<MeditationTimerProps> = ({
  className = '',
  onComplete
}) => {
  const [timer, setTimer] = useState<TimerState>({
    duration: 5 * 60,
    remaining: 5 * 60,
    isRunning: false,
    isCompleted: false
  })
  const [isMuted, setIsMuted] = useState(false)
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'exhale'>('inhale')

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (timer.isRunning && timer.remaining > 0) {
      interval = setInterval(() => {
        setTimer(prev => ({
          ...prev,
          remaining: Math.max(0, prev.remaining - 1)
        }))
      }, 1000)
    } else if (timer.remaining === 0 && timer.isRunning) {
      setTimer(prev => ({ ...prev, isRunning: false, isCompleted: true }))
      if (!isMuted) {
        // Play completion bell sound (mock)
        console.log('🔔 명상 완료!')
      }
      onComplete?.()
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [timer.isRunning, timer.remaining, isMuted, onComplete])

  // Breathing guide animation
  useEffect(() => {
    if (timer.isRunning) {
      const breathingInterval = setInterval(() => {
        setBreathingPhase(prev => prev === 'inhale' ? 'exhale' : 'inhale')
      }, 4000) // 4 seconds inhale, 4 seconds exhale

      return () => clearInterval(breathingInterval)
    }
  }, [timer.isRunning])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleSetDuration = useCallback((duration: number) => {
    setTimer({
      duration,
      remaining: duration,
      isRunning: false,
      isCompleted: false
    })
  }, [])

  const handlePlayPause = useCallback(() => {
    setTimer(prev => ({
      ...prev,
      isRunning: !prev.isRunning,
      isCompleted: false
    }))
  }, [])

  const handleReset = useCallback(() => {
    setTimer(prev => ({
      ...prev,
      remaining: prev.duration,
      isRunning: false,
      isCompleted: false
    }))
  }, [])

  const progress = 1 - (timer.remaining / timer.duration)
  const circumference = 2 * Math.PI * 120 // radius = 120
  const strokeDashoffset = circumference * (1 - progress)

  return (
    <div className={`max-w-md mx-auto ${className}`}>
      {/* Main Timer Display */}
      <motion.div
        className="neumorphic p-8 text-center relative overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Breathing Guide Background */}
        <AnimatePresence>
          {timer.isRunning && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-orange-400/10 to-teal-400/10 rounded-xl"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: breathingPhase === 'inhale' ? 0.3 : 0.1,
                scale: breathingPhase === 'inhale' ? 1.02 : 0.98
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 4, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          )}
        </AnimatePresence>

        {/* Progress Circle */}
        <div className="relative w-64 h-64 mx-auto mb-6">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 256 256">
            {/* Background Circle */}
            <circle
              cx="128"
              cy="128"
              r="120"
              fill="none"
              stroke="rgba(38, 70, 83, 0.1)"
              strokeWidth="8"
            />
            {/* Progress Circle */}
            <motion.circle
              cx="128"
              cy="128"
              r="120"
              fill="none"
              stroke="url(#gradientProgress)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="gradientProgress" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F4A261" />
                <stop offset="50%" stopColor="#E9C46A" />
                <stop offset="100%" stopColor="#2A9D8F" />
              </linearGradient>
            </defs>
          </svg>

          {/* Timer Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              className="text-heading-xl gradient-text font-mono"
              key={timer.remaining}
              initial={{ scale: 1.1, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {formatTime(timer.remaining)}
            </motion.div>
            
            {timer.isRunning && (
              <motion.div
                className="text-body text-gray-600 mt-2"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {breathingPhase === 'inhale' ? '들이쉬세요 🌸' : '내쉬세요 🍃'}
              </motion.div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <motion.button
            onClick={handleReset}
            className="neumorphic-inset w-12 h-12 rounded-full flex items-center justify-center
                     text-gray-600 hover:text-orange-600 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={timer.remaining === timer.duration}
          >
            <RotateCcw className="w-5 h-5" />
          </motion.button>

          <motion.button
            onClick={handlePlayPause}
            className="neumorphic w-16 h-16 rounded-full flex items-center justify-center
                     bg-gradient-to-br from-orange-400 to-teal-400 text-white shadow-lg"
            whileHover={{ scale: 1.05, boxShadow: "0 12px 40px rgba(244, 162, 97, 0.3)" }}
            whileTap={{ scale: 0.95 }}
          >
            {timer.isRunning ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-1" />
            )}
          </motion.button>

          <motion.button
            onClick={() => setIsMuted(!isMuted)}
            className="neumorphic-inset w-12 h-12 rounded-full flex items-center justify-center
                     text-gray-600 hover:text-teal-600 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </motion.button>
        </div>

        {/* Completion Bell */}
        <AnimatePresence>
          {timer.isCompleted && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-white/90 rounded-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="text-center"
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5, ease: "backOut" }}
              >
                <motion.div
                  className="text-6xl mb-4"
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  🔔
                </motion.div>
                <h3 className="text-heading-sm gradient-text mb-2">명상 완료!</h3>
                <p className="text-body-sm text-gray-600">고생하셨습니다 🙏</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Preset Time Buttons */}
      <div className="mt-6 grid grid-cols-5 gap-2">
        {PRESET_TIMES.map((preset, index) => (
          <motion.button
            key={preset.value}
            onClick={() => handleSetDuration(preset.value)}
            className={`
              neumorphic-inset p-3 text-center transition-all duration-200
              ${timer.duration === preset.value 
                ? 'bg-gradient-to-br from-orange-400/20 to-teal-400/20 text-orange-600' 
                : 'text-gray-600 hover:text-orange-600'
              }
            `}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.3, duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={timer.isRunning}
          >
            <div className="text-2xl mb-1">{preset.emoji}</div>
            <div className="text-xs font-medium">{preset.label}</div>
          </motion.button>
        ))}
      </div>

      {/* Prayer Beads Progress */}
      <motion.div 
        className="prayer-beads justify-center mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className={`prayer-bead ${
              progress > index / 10 ? 'active' : ''
            }`}
          />
        ))}
      </motion.div>
    </div>
  )
}

export default MeditationTimer