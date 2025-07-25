/**
 * Dharma Quote Widget - Today's Wisdom with Flip Card Animation
 *
 * Features:
 * - iOS-style card design with subtle shadows
 * - Flip animation to reveal quote details
 * - Buddhist-themed gradient overlays
 * - Responsive typography and spacing
 * - Accessibility support
 */

import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import type { Breakpoint, DharmaQuote, MaterialYouTheme } from '../../types/dashboard';

interface DharmaQuoteWidgetProps {
  id: string;
  title: string;
  size: { width: number; height: number };
  theme: MaterialYouTheme;
  breakpoint: Breakpoint;
  className?: string;
}

// Mock dharma quotes
const mockQuotes: DharmaQuote[] = [
  {
    id: '1',
    text: 'Peace comes from within. Do not seek it without.',
    author: 'Buddha',
    source: 'Dhammapada',
    category: 'wisdom',
    language: 'en',
    isDaily: true,
  },
  {
    id: '2',
    text: 'The mind is everything. What you think you become.',
    author: 'Buddha',
    category: 'mindfulness',
    language: 'en',
    isDaily: false,
  },
  {
    id: '3',
    text: 'Hatred does not cease by hatred, but only by love; this is the eternal rule.',
    author: 'Buddha',
    source: 'Dhammapada',
    category: 'compassion',
    language: 'en',
    isDaily: false,
  },
];

export const DharmaQuoteWidget: React.FC<DharmaQuoteWidgetProps> = ({
  id,
  title,
  size,
  theme,
  breakpoint,
  className = '',
}) => {
  const [currentQuote, setCurrentQuote] = useState<DharmaQuote>(mockQuotes[0]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load daily quote
  useEffect(() => {
    const loadDailyQuote = async () => {
      setIsLoading(true);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      // Select quote based on current date
      const today = new Date().getDate();
      const quoteIndex = today % mockQuotes.length;
      setCurrentQuote(mockQuotes[quoteIndex]);

      setIsLoading(false);
    };

    loadDailyQuote();
  }, []);

  // Get category color
  const getCategoryGradient = (category: string) => {
    const gradients = {
      wisdom: `linear-gradient(135deg, ${theme.wisdom}20, ${theme.primary}20)`,
      compassion: `linear-gradient(135deg, ${theme.compassion}20, ${theme.secondary}20)`,
      mindfulness: `linear-gradient(135deg, ${theme.lotus}20, ${theme.tertiary}20)`,
      enlightenment: `linear-gradient(135deg, ${theme.dharma}20, ${theme.wisdom}20)`,
    };
    return gradients[category as keyof typeof gradients] || gradients.wisdom;
  };

  // Handle card flip
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
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
          minHeight: '200px',
        }}
      >
        {/* Loading state */}
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
          <motion.div
            className="w-12 h-12 text-4xl"
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 3, repeat: Infinity, ease: 'linear' },
              scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            🪷
          </motion.div>

          <div className="space-y-2">
            <div className="w-32 h-3 bg-surfaceVariant rounded animate-pulse" />
            <div className="w-24 h-3 bg-surfaceVariant rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={`relative cursor-pointer ${className}`}
      onClick={handleFlip}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      style={{ perspective: '1000px' }}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          transformStyle: 'preserve-3d',
          minHeight: '200px',
        }}
      >
        {/* Front of card */}
        <div
          className="
            absolute inset-0 w-full h-full rounded-2xl overflow-hidden
            shadow-lg border border-outline/20 backdrop-blur-sm
          "
          style={{
            backfaceVisibility: 'hidden',
            background: getCategoryGradient(currentQuote.category),
            borderColor: `var(--md-sys-color-outline)`,
          }}
        >
          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${theme.surface}E6, ${theme.surface}CC)`,
            }}
          />

          {/* Content */}
          <div className="relative h-full p-6 flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🧘‍♂️</span>
                <h3
                  className="font-semibold text-lg"
                  style={{ color: `var(--md-sys-color-on-surface)` }}
                >
                  Today's Dharma
                </h3>
              </div>

              <motion.div
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `var(--md-sys-color-primary)` }}
                animate={{ rotate: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <span
                  className="text-xs"
                  style={{ color: `var(--md-sys-color-on-primary)` }}
                >
                  ↻
                </span>
              </motion.div>
            </div>

            {/* Quote */}
            <div className="flex-1 flex items-center">
              <blockquote className="text-center">
                <p
                  className={`
                    leading-relaxed font-medium
                    ${breakpoint === 'mobile' ? 'text-base' : 'text-lg'}
                  `}
                  style={{ color: `var(--md-sys-color-on-surface)` }}
                >
                  "{currentQuote.text}"
                </p>
              </blockquote>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="font-semibold text-sm"
                  style={{ color: `var(--md-sys-color-primary)` }}
                >
                  — {currentQuote.author}
                </p>
                {currentQuote.source && (
                  <p
                    className="text-xs opacity-75"
                    style={{ color: `var(--md-sys-color-on-surface-variant)` }}
                  >
                    {currentQuote.source}
                  </p>
                )}
              </div>

              {/* Category indicator */}
              <div
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: `${theme[currentQuote.category as keyof MaterialYouTheme]}20`,
                  color: theme[currentQuote.category as keyof MaterialYouTheme],
                }}
              >
                {currentQuote.category}
              </div>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div
          className="
            absolute inset-0 w-full h-full rounded-2xl overflow-hidden
            shadow-lg border border-outline/20 backdrop-blur-sm
          "
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: `linear-gradient(135deg, ${theme.primaryContainer}, ${theme.secondaryContainer})`,
            borderColor: `var(--md-sys-color-outline)`,
          }}
        >
          {/* Content */}
          <div className="relative h-full p-6 flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3
                className="font-semibold text-lg"
                style={{ color: `var(--md-sys-color-on-primary-container)` }}
              >
                Reflection
              </h3>

              <motion.button
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `var(--md-sys-color-surface)` }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <span
                  className="text-xs"
                  style={{ color: `var(--md-sys-color-on-surface)` }}
                >
                  ✕
                </span>
              </motion.button>
            </div>

            {/* Reflection content */}
            <div className="flex-1 flex flex-col justify-center space-y-4">
              <div
                className="text-center space-y-3"
                style={{ color: `var(--md-sys-color-on-primary-container)` }}
              >
                <p className="text-sm opacity-90">
                  Take a moment to reflect on today's teaching
                </p>

                <div className="flex items-center justify-center space-x-2">
                  <span className="text-3xl">🧘‍♂️</span>
                  <span className="text-3xl">💭</span>
                  <span className="text-3xl">🪷</span>
                </div>

                <p className="text-xs opacity-75 max-w-xs mx-auto leading-relaxed">
                  How can you apply this wisdom to your daily practice and interactions with others?
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center space-x-3">
              <button
                className="
                  px-4 py-2 rounded-full text-xs font-medium transition-all duration-200
                  hover:scale-105 active:scale-95
                "
                style={{
                  backgroundColor: `var(--md-sys-color-surface)`,
                  color: `var(--md-sys-color-on-surface)`,
                }}
              >
                💾 Save
              </button>

              <button
                className="
                  px-4 py-2 rounded-full text-xs font-medium transition-all duration-200
                  hover:scale-105 active:scale-95
                "
                style={{
                  backgroundColor: `var(--md-sys-color-surface)`,
                  color: `var(--md-sys-color-on-surface)`,
                }}
              >
                📤 Share
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Subtle shine effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
        }}
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 5,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  );
};
