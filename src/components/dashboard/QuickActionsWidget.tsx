/**
 * Quick Actions Widget - Figma-style Floating Palette
 *
 * Features:
 * - Figma-inspired floating action palette
 * - Expandable radial menu with smooth animations
 * - Buddhist-themed quick actions
 * - Customizable action shortcuts
 * - Haptic feedback on touch devices
 */

import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import type { MaterialYouTheme, QuickAction } from '../../types/dashboard';

interface QuickActionsWidgetProps {
  theme: MaterialYouTheme;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  className?: string;
}

// Default quick actions
const defaultActions: QuickAction[] = [
  {
    id: 'meditate',
    title: 'Quick Meditation',
    description: 'Start a 5-minute session',
    icon: '🧘‍♂️',
    action: 'meditate',
    color: '#6366F1',
    isCustomizable: true,
    order: 1,
    isVisible: true,
    estimatedTime: 5,
  },
  {
    id: 'journal',
    title: 'Mindful Journal',
    description: 'Record your thoughts',
    icon: '📝',
    action: 'journal',
    color: '#8B5CF6',
    isCustomizable: true,
    order: 2,
    isVisible: true,
    estimatedTime: 10,
  },
  {
    id: 'read',
    title: 'Dharma Reading',
    description: 'Continue your studies',
    icon: '📚',
    action: 'read',
    color: '#3B82F6',
    isCustomizable: true,
    order: 3,
    isVisible: true,
    estimatedTime: 15,
  },
  {
    id: 'connect',
    title: 'Connect',
    description: 'Join community discussion',
    icon: '💬',
    action: 'connect',
    color: '#10B981',
    isCustomizable: true,
    order: 4,
    isVisible: true,
  },
  {
    id: 'practice',
    title: 'Mindful Practice',
    description: 'Breathing exercises',
    icon: '🌬️',
    action: 'practice',
    color: '#F59E0B',
    isCustomizable: true,
    order: 5,
    isVisible: true,
    estimatedTime: 3,
  },
  {
    id: 'learn',
    title: 'Daily Learning',
    description: 'Explore new teachings',
    icon: '🪷',
    action: 'learn',
    color: '#EC4899',
    isCustomizable: true,
    order: 6,
    isVisible: true,
    estimatedTime: 20,
  },
];

export const QuickActionsWidget: React.FC<QuickActionsWidgetProps> = ({
  theme,
  position = 'bottom-right',
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [actions, setActions] = useState<QuickAction[]>(defaultActions);
  const [selectedAction, setSelectedAction] = useState<QuickAction | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle click outside to collapse
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Haptic feedback for touch devices
  const triggerHapticFeedback = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  // Handle action selection
  const handleActionSelect = (action: QuickAction) => {
    setSelectedAction(action);
    triggerHapticFeedback();

    // Simulate action execution
    setTimeout(() => {
      setSelectedAction(null);
      setIsExpanded(false);
    }, 1500);

    // Handle different action types
    switch (action.action) {
      case 'meditate':
        console.log('Starting meditation session...');
        break;
      case 'journal':
        console.log('Opening journal...');
        break;
      case 'read':
        console.log('Opening dharma library...');
        break;
      case 'connect':
        console.log('Joining community...');
        break;
      case 'practice':
        console.log('Starting breathing practice...');
        break;
      case 'learn':
        console.log('Opening learning module...');
        break;
    }
  };

  // Calculate action positions in radial menu
  const getActionPosition = (index: number, total: number) => {
    const radius = 80;
    const startAngle = -90; // Start from top
    const angleStep = 180 / (total - 1); // Semi-circle distribution
    const angle = (startAngle + (index * angleStep)) * (Math.PI / 180);

    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  };

  // Position classes
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
  };

  const visibleActions = actions.filter(action => action.isVisible);

  return (
    <div
      ref={containerRef}
      className={`fixed ${positionClasses[position]} z-50 ${className}`}
    >
      {/* Action Items */}
      <AnimatePresence>
        {isExpanded && (
          <>
            {visibleActions.map((action, index) => {
              const pos = getActionPosition(index, visibleActions.length);
              return (
                <motion.button
                  key={action.id}
                  className="absolute w-12 h-12 rounded-full shadow-lg backdrop-blur-sm border border-white/20 flex items-center justify-center text-lg font-medium transition-all duration-200"
                  style={{
                    backgroundColor: `${action.color}E6`,
                    color: 'white',
                    x: pos.x,
                    y: pos.y,
                  }}
                  initial={{
                    scale: 0,
                    opacity: 0,
                    x: 0,
                    y: 0,
                  }}
                  animate={{
                    scale: selectedAction?.id === action.id ? 1.2 : 1,
                    opacity: 1,
                    x: pos.x,
                    y: pos.y,
                  }}
                  exit={{
                    scale: 0,
                    opacity: 0,
                    x: 0,
                    y: 0,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 25,
                    delay: index * 0.05,
                  }}
                  onClick={() => handleActionSelect(action)}
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: action.color,
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {action.icon}
                </motion.button>
              );
            })}

            {/* Action labels */}
            {visibleActions.map((action, index) => {
              const pos = getActionPosition(index, visibleActions.length);
              const labelOffset = position.includes('right') ? -120 : 60;

              return (
                <motion.div
                  key={`label-${action.id}`}
                  className="absolute pointer-events-none"
                  style={{
                    x: pos.x + labelOffset,
                    y: pos.y - 10,
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <div
                    className="px-3 py-2 rounded-lg shadow-lg backdrop-blur-sm border border-white/20 whitespace-nowrap"
                    style={{
                      backgroundColor: `var(--md-sys-color-surface)E6`,
                      color: `var(--md-sys-color-on-surface)`,
                    }}
                  >
                    <p className="text-sm font-medium">{action.title}</p>
                    <p className="text-xs opacity-75">{action.description}</p>
                    {action.estimatedTime && (
                      <p className="text-xs opacity-60 mt-1">
                        ~{action.estimatedTime} min
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        className="w-14 h-14 rounded-full shadow-xl backdrop-blur-sm border border-white/20 flex items-center justify-center relative overflow-hidden"
        style={{
          backgroundColor: `var(--md-sys-color-primary)`,
          color: `var(--md-sys-color-on-primary)`,
        }}
        onClick={() => {
          setIsExpanded(!isExpanded);
          triggerHapticFeedback();
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          rotate: isExpanded ? 45 : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Background glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${theme.primary}40, transparent)`,
          }}
          animate={{
            scale: isExpanded ? 1.5 : 1,
            opacity: isExpanded ? 0.8 : 0.4,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Icon */}
        <motion.span
          className="text-xl relative z-10"
          animate={{
            rotate: isExpanded ? 45 : 0,
          }}
        >
          ✨
        </motion.span>

        {/* Ripple effect */}
        <motion.div
          className="absolute inset-0 rounded-full border-2"
          style={{ borderColor: `var(--md-sys-color-primary)` }}
          animate={{
            scale: [1, 2],
            opacity: [0.5, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      </motion.button>

      {/* Action execution feedback */}
      <AnimatePresence>
        {selectedAction && (
          <motion.div
            className="absolute bottom-16 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 min-w-48"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: selectedAction.color }}
              >
                <span className="text-white text-sm">{selectedAction.icon}</span>
              </div>
              <div>
                <p
                  className="font-medium text-sm"
                  style={{ color: `var(--md-sys-color-on-surface)` }}
                >
                  {selectedAction.title}
                </p>
                <p
                  className="text-xs opacity-75"
                  style={{ color: `var(--md-sys-color-on-surface-variant)` }}
                >
                  Starting...
                </p>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
              <motion.div
                className="h-1 rounded-full"
                style={{ backgroundColor: selectedAction.color }}
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.5 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard shortcut hint */}
      <AnimatePresence>
        {!isExpanded && (
          <motion.div
            className="absolute bottom-16 right-0 bg-black/80 text-white text-xs rounded px-2 py-1 whitespace-nowrap pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 2 }}
          >
            Press Space for quick actions
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard shortcut listener */}
      {typeof window !== 'undefined' && (
        <motion.div
          className="sr-only"
          onKeyDown={(e) => {
            if (e.code === 'Space' && !isExpanded) {
              e.preventDefault();
              setIsExpanded(true);
            } else if (e.code === 'Escape' && isExpanded) {
              setIsExpanded(false);
            }
          }}
          tabIndex={-1}
        />
      )}
    </div>
  );
};
