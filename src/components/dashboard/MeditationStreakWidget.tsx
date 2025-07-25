/**
 * Meditation Streak Widget - Duolingo-style Gamified Tracker
 *
 * Features:
 * - Duolingo-inspired streak visualization
 * - Daily progress tracking with fire animations
 * - Achievement badges and milestones
 * - Weekly goal progress with dynamic ring
 * - Buddhist-themed achievement emojis
 */

import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useMemo, useState } from 'react';
import type { Breakpoint, MaterialYouTheme, MeditationStreak } from '../../types/dashboard';

interface MeditationStreakWidgetProps {
  id: string;
  title: string;
  size: { width: number; height: number };
  theme: MaterialYouTheme;
  breakpoint: Breakpoint;
  className?: string;
}

// Mock meditation streak data
const mockStreakData: MeditationStreak = {
  currentStreak: 14,
  longestStreak: 42,
  totalSessions: 127,
  streakStartDate: '2025-01-06T00:00:00Z',
  lastSessionDate: '2025-01-20T18:30:00Z',
  weeklyGoal: 5,
  monthlyGoal: 20,
  streakHistory: [
    { date: '2025-01-14', completed: true, duration: 15 },
    { date: '2025-01-15', completed: true, duration: 20 },
    { date: '2025-01-16', completed: false },
    { date: '2025-01-17', completed: true, duration: 10 },
    { date: '2025-01-18', completed: true, duration: 25 },
    { date: '2025-01-19', completed: true, duration: 15 },
    { date: '2025-01-20', completed: true, duration: 30 },
  ],
};

export const MeditationStreakWidget: React.FC<MeditationStreakWidgetProps> = ({
  id,
  title,
  size,
  theme,
  breakpoint,
  className = '',
}) => {
  const [streakData, setStreakData] = useState<MeditationStreak>(mockStreakData);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load streak data
  useEffect(() => {
    const loadStreakData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 600));
      setStreakData(mockStreakData);
      setIsLoading(false);
    };

    loadStreakData();
  }, []);

  // Calculate weekly progress
  const weeklyProgress = useMemo(() => {
    const thisWeek = streakData.streakHistory.slice(-7);
    const completedThisWeek = thisWeek.filter(day => day.completed).length;
    return Math.min(completedThisWeek / streakData.weeklyGoal, 1);
  }, [streakData]);

  // Get streak emoji based on length
  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return '🔥';
    if (streak >= 14) return '⭐';
    if (streak >= 7) return '🌟';
    if (streak >= 3) return '✨';
    return '🌱';
  };

  // Get achievement for current streak
  const getStreakAchievement = (streak: number) => {
    if (streak >= 30) return { title: 'Dharma Master', desc: '30+ day streak!' };
    if (streak >= 14) return { title: 'Dedicated Practitioner', desc: '2+ weeks strong!' };
    if (streak >= 7) return { title: 'Week Warrior', desc: 'One week down!' };
    if (streak >= 3) return { title: 'Getting Started', desc: 'Building the habit!' };
    return { title: 'New Journey', desc: 'Welcome to mindfulness!' };
  };

  // Animate celebration
  const triggerCelebration = () => {
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
  };

  if (isLoading) {
    return (
      <div
        className={`
          relative overflow-hidden rounded-2xl bg-surface shadow-lg border border-outline/20
          ${className}
        `}
        style={{
          backgroundColor: `var(--md-sys-color-surface)`,
          borderColor: `var(--md-sys-color-outline)`,
          minHeight: '300px',
        }}
      >
        {/* Loading skeleton */}
        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-surfaceVariant rounded-full animate-pulse" />
            <div className="w-32 h-4 bg-surfaceVariant rounded animate-pulse" />
          </div>
          <div className="w-16 h-16 bg-surfaceVariant rounded-full animate-pulse mx-auto" />
          <div className="space-y-2">
            <div className="w-full h-3 bg-surfaceVariant rounded animate-pulse" />
            <div className="w-3/4 h-3 bg-surfaceVariant rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const achievement = getStreakAchievement(streakData.currentStreak);

  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-2xl shadow-lg border border-outline/20
        ${className}
      `}
      style={{
        backgroundColor: `var(--md-sys-color-surface)`,
        borderColor: `var(--md-sys-color-outline)`,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.span
              className="text-2xl"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              🧘‍♂️
            </motion.span>
            <h3
              className="font-semibold text-lg"
              style={{ color: `var(--md-sys-color-on-surface)` }}
            >
              Meditation Journey
            </h3>
          </div>

          <button
            onClick={triggerCelebration}
            className="p-2 rounded-full hover:bg-primary/10 transition-colors"
          >
            <span className="text-sm">📊</span>
          </button>
        </div>
      </div>

      {/* Streak Display */}
      <div className="px-6 pb-4">
        <div className="text-center space-y-3">
          {/* Streak Fire */}
          <motion.div
            className="relative inline-block"
            animate={{
              scale: showCelebration ? [1, 1.3, 1] : 1,
            }}
            transition={{ duration: 0.5 }}
          >
            <motion.span
              className="text-6xl block"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {getStreakEmoji(streakData.currentStreak)}
            </motion.span>

            {/* Streak number */}
                          <motion.div
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-sm font-bold"
              style={{
                backgroundColor: `var(--md-sys-color-primary)`,
                color: `var(--md-sys-color-on-primary)`,
              }}
              animate={showCelebration ? {
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0],
              } : {}}
            >
              {streakData.currentStreak}
            </motion.div>
          </motion.div>

          {/* Achievement */}
          <div className="space-y-1">
            <p
              className="font-semibold"
              style={{ color: `var(--md-sys-color-primary)` }}
            >
              {achievement.title}
            </p>
            <p
              className="text-sm opacity-75"
              style={{ color: `var(--md-sys-color-on-surface-variant)` }}
            >
              {achievement.desc}
            </p>
          </div>
        </div>
      </div>

      {/* Weekly Progress Ring */}
      <div className="px-6 pb-4">
        <div className="relative w-32 h-32 mx-auto">
          {/* Background ring */}
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="var(--md-sys-color-surface-variant)"
              strokeWidth="8"
              fill="none"
              opacity="0.3"
            />
            {/* Progress ring */}
            <motion.circle
              cx="64"
              cy="64"
              r="56"
              stroke={`var(--md-sys-color-primary)`}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 56}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
              animate={{
                strokeDashoffset: 2 * Math.PI * 56 * (1 - weeklyProgress),
              }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="text-2xl font-bold"
              style={{ color: `var(--md-sys-color-primary)` }}
            >
              {Math.round(weeklyProgress * 100)}%
            </span>
            <span
              className="text-xs opacity-75"
              style={{ color: `var(--md-sys-color-on-surface-variant)` }}
            >
              Weekly Goal
            </span>
          </div>
        </div>
      </div>

      {/* Week Calendar */}
      <div className="px-6 pb-4">
        <div className="flex justify-between items-center mb-3">
          <span
            className="text-sm font-medium"
            style={{ color: `var(--md-sys-color-on-surface)` }}
          >
            This Week
          </span>
          <span
            className="text-xs"
            style={{ color: `var(--md-sys-color-on-surface-variant)` }}
          >
            {streakData.streakHistory.filter(d => d.completed).length}/{streakData.weeklyGoal}
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => {
            const dayData = streakData.streakHistory[index];
            const isCompleted = dayData?.completed;
            const isToday = index === streakData.streakHistory.length - 1;

            return (
              <motion.div
                key={index}
                className="aspect-square rounded-lg flex flex-col items-center justify-center text-xs"
                style={{
                  backgroundColor: isCompleted
                    ? `var(--md-sys-color-primary)`
                    : isToday
                    ? `var(--md-sys-color-primary-container)`
                    : `var(--md-sys-color-surface-variant)`,
                  color: isCompleted
                    ? `var(--md-sys-color-on-primary)`
                    : isToday
                    ? `var(--md-sys-color-on-primary-container)`
                    : `var(--md-sys-color-on-surface-variant)`,
                }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <span className="font-medium">{day}</span>
                {isCompleted && (
                  <motion.span
                    className="text-xs"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    ✓
                  </motion.span>
                )}
                {isToday && !isCompleted && (
                  <motion.div
                    className="w-1 h-1 rounded-full"
                    style={{ backgroundColor: `var(--md-sys-color-primary)` }}
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p
              className="text-lg font-bold"
              style={{ color: `var(--md-sys-color-primary)` }}
            >
              {streakData.longestStreak}
            </p>
            <p
              className="text-xs opacity-75"
              style={{ color: `var(--md-sys-color-on-surface-variant)` }}
            >
              Best Streak
            </p>
          </div>

          <div>
            <p
              className="text-lg font-bold"
              style={{ color: `var(--md-sys-color-secondary)` }}
            >
              {streakData.totalSessions}
            </p>
            <p
              className="text-xs opacity-75"
              style={{ color: `var(--md-sys-color-on-surface-variant)` }}
            >
              Total Sessions
            </p>
          </div>

          <div>
            <p
              className="text-lg font-bold"
              style={{ color: `var(--md-sys-color-tertiary)` }}
            >
              {Math.round(streakData.streakHistory.reduce((acc, day) => acc + (day.duration || 0), 0) / 60)}h
            </p>
            <p
              className="text-xs opacity-75"
              style={{ color: `var(--md-sys-color-on-surface-variant)` }}
            >
              This Week
            </p>
          </div>
        </div>
      </div>

      {/* Celebration Animation */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            className="absolute inset-0 pointer-events-none flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Confetti/Sparkles */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-lg"
                initial={{
                  scale: 0,
                  x: 0,
                  y: 0,
                  opacity: 0,
                }}
                animate={{
                  scale: [0, 1, 0],
                  x: Math.cos(i * 30 * Math.PI / 180) * 100,
                  y: Math.sin(i * 30 * Math.PI / 180) * 100,
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  ease: 'easeOut',
                }}
              >
                {['🌟', '✨', '🙏', '🪷'][i % 4]}
              </motion.div>
            ))}

            {/* Central celebration text */}
            <motion.div
              className="text-center"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              <div className="text-4xl mb-2">🎉</div>
              <p
                className="font-bold text-lg"
                style={{ color: `var(--md-sys-color-primary)` }}
              >
                Mindful Milestone!
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
