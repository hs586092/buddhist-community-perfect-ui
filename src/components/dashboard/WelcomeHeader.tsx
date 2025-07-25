/**
 * Welcome Header - Dashboard Header with Greeting & Controls
 *
 * Features:
 * - Time-aware greeting messages
 * - Timeframe selection controls
 * - Customization access button
 * - Buddhist-themed design
 */

import { motion } from 'framer-motion';
import React from 'react';
import type { MaterialYouTheme } from '../../types/dashboard';

interface WelcomeHeaderProps {
  userId: string;
  onCustomizeClick: () => void;
  onTimeframeChange: (timeframe: 'week' | 'month' | 'year') => void;
  selectedTimeframe: 'week' | 'month' | 'year';
  theme: MaterialYouTheme;
}

export const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({
  userId,
  onCustomizeClick,
  onTimeframeChange,
  selectedTimeframe,
  theme,
}) => {
  // Get time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good morning', emoji: '🌅' };
    if (hour < 17) return { text: 'Good afternoon', emoji: '☀️' };
    if (hour < 21) return { text: 'Good evening', emoji: '🌇' };
    return { text: 'Good night', emoji: '🌙' };
  };

  const greeting = getGreeting();

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          {/* Welcome Section */}
          <div className="flex items-center space-x-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{greeting.emoji}</span>
                <div>
                  <h1
                    className="text-2xl font-bold"
                    style={{ color: `var(--md-sys-color-on-surface)` }}
                  >
                    {greeting.text}, Mindful One
                  </h1>
                  <p
                    className="text-sm opacity-75"
                    style={{ color: `var(--md-sys-color-on-surface-variant)` }}
                  >
                    Continue your dharma journey today 🪷
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Timeframe Selector */}
            <div className="flex items-center bg-surfaceVariant rounded-lg p-1">
              {(['week', 'month', 'year'] as const).map((timeframe) => (
                <button
                  key={timeframe}
                  onClick={() => onTimeframeChange(timeframe)}
                  className={`
                    px-3 py-1 text-sm font-medium rounded-md transition-all duration-200
                    ${selectedTimeframe === timeframe
                      ? 'bg-primary text-onPrimary shadow-sm'
                      : 'hover:bg-primary/10 text-onSurfaceVariant'
                    }
                  `}
                >
                  {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
                </button>
              ))}
            </div>

            {/* Customize Button */}
            <motion.button
              onClick={onCustomizeClick}
              className="p-2 rounded-lg bg-surfaceVariant hover:bg-primary hover:text-onPrimary transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ⚙️
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
};
