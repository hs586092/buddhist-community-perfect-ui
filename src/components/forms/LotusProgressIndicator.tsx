/**
 * Lotus Progress Indicator - Zen-inspired Step Progress
 *
 * Features:
 * - Lotus petals that fill as progress advances
 * - Smooth CSS and Framer Motion animations
 * - Responsive design with touch-friendly interactions
 * - Accessibility-compliant with screen reader support
 * - Multiple animation speeds (gentle, moderate, dynamic)
 */

import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import type { RegistrationStep } from '../../types/event-registration';

interface LotusProgressIndicatorProps {
  steps: RegistrationStep[];
  currentStep: number;
  progress: number; // 0-100
  animationSpeed?: 'gentle' | 'moderate' | 'dynamic';
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  interactive?: boolean;
  onStepClick?: (stepIndex: number) => void;
}

export const LotusProgressIndicator: React.FC<LotusProgressIndicatorProps> = ({
  steps,
  currentStep,
  progress,
  animationSpeed = 'gentle',
  size = 'md',
  showLabels = true,
  interactive = false,
  onStepClick,
}) => {
  const [hoverStep, setHoverStep] = useState<number | null>(null);
  const [glowIntensity, setGlowIntensity] = useState(0);

  // Animation timing based on speed
  const timing = {
    gentle: { duration: 1.2, ease: 'easeInOut' },
    moderate: { duration: 0.8, ease: 'easeInOut' },
    dynamic: { duration: 0.5, ease: 'backOut' },
  }[animationSpeed];

  // Size configurations
  const sizeConfig = {
    sm: {
      lotus: 120,
      center: 60,
      petal: 45,
      text: 'text-xs',
      spacing: 'space-y-2',
      iconSize: 'text-lg'
    },
    md: {
      lotus: 160,
      center: 80,
      petal: 60,
      text: 'text-sm',
      spacing: 'space-y-3',
      iconSize: 'text-xl'
    },
    lg: {
      lotus: 200,
      center: 100,
      petal: 75,
      text: 'text-base',
      spacing: 'space-y-4',
      iconSize: 'text-2xl'
    },
  }[size];

  // Gentle breathing animation for the center
  useEffect(() => {
    const interval = setInterval(() => {
      setGlowIntensity(prev => (prev + 0.02) % (Math.PI * 2));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Calculate petal positions in a circle
  const getPetalPosition = (index: number, total: number) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2; // Start from top
    const radius = sizeConfig.lotus / 2 - sizeConfig.petal / 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return { x, y, angle };
  };

  // Colors and gradients
  const getStepColor = (step: RegistrationStep, index: number) => {
    if (step.status === 'completed') {
      return 'from-emerald-400 to-teal-500';
    } else if (step.status === 'current') {
      return 'from-purple-400 to-pink-500';
    } else if (step.status === 'error') {
      return 'from-red-400 to-rose-500';
    } else {
      return 'from-gray-300 to-gray-400';
    }
  };

  return (
    <div className={`flex flex-col items-center ${sizeConfig.spacing}`}>
      {/* Lotus Container */}
      <div
        className="relative flex items-center justify-center"
        style={{
          width: sizeConfig.lotus + sizeConfig.petal,
          height: sizeConfig.lotus + sizeConfig.petal
        }}
      >
        {/* Lotus Petals */}
        {steps.map((step, index) => {
          const position = getPetalPosition(index, steps.length);
          const isActive = index <= currentStep;
          const isHovered = hoverStep === index;

          return (
            <motion.div
              key={step.id}
              className={`absolute cursor-pointer ${interactive ? 'hover:scale-110' : ''}`}
              style={{
                left: sizeConfig.lotus / 2 + position.x,
                top: sizeConfig.lotus / 2 + position.y,
                width: sizeConfig.petal,
                height: sizeConfig.petal,
              }}
              initial={{ scale: 0, rotate: position.angle }}
              animate={{
                scale: isActive ? 1 : 0.7,
                rotate: position.angle + (isActive ? 0 : -20),
                filter: `drop-shadow(0 ${isActive ? '8px' : '4px'} ${isActive ? '20px' : '8px'} rgba(147, 51, 234, ${isActive ? 0.3 : 0.1}))`
              }}
              transition={timing}
              onHoverStart={() => interactive && setHoverStep(index)}
              onHoverEnd={() => setHoverStep(null)}
              onClick={() => interactive && onStepClick?.(index)}
            >
              {/* Petal Shape */}
              <motion.div
                className={`
                  w-full h-full rounded-full
                  bg-gradient-to-br ${getStepColor(step, index)}
                  border-2 border-white/20
                  flex items-center justify-center
                  shadow-lg
                  ${interactive ? 'hover:shadow-xl' : ''}
                `}
                animate={{
                  scale: isHovered ? 1.1 : 1,
                  opacity: step.status === 'pending' ? 0.6 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                {/* Step Icon */}
                <motion.span
                  className={`${sizeConfig.iconSize} ${
                    step.status === 'completed' ? 'text-white' :
                    step.status === 'current' ? 'text-white' :
                    step.status === 'error' ? 'text-white' :
                    'text-gray-600'
                  }`}
                  animate={{
                    rotate: step.status === 'completed' ? [0, 10, -10, 0] : 0,
                    scale: step.status === 'current' ? [1, 1.1, 1] : 1
                  }}
                  transition={{
                    duration: 2,
                    repeat: step.status === 'completed' ? 1 : 0,
                    ease: 'easeInOut'
                  }}
                >
                  {step.status === 'completed' ? '✓' : step.icon}
                </motion.span>

                {/* Progress Fill */}
                <motion.div
                  className="absolute inset-0 rounded-full opacity-30"
                  style={{
                    background: `conic-gradient(from 0deg,
                      rgba(255,255,255,0.3) 0%,
                      rgba(255,255,255,0.3) ${step.lotusProgress}%,
                      transparent ${step.lotusProgress}%)`
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                />
              </motion.div>

              {/* Petal Glow Effect */}
              <AnimatePresence>
                {(step.status === 'current' || isHovered) && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                      scale: [1, 1.2, 1]
                    }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                    style={{
                      background: `radial-gradient(circle,
                        rgba(147, 51, 234, 0.4) 0%,
                        rgba(147, 51, 234, 0.1) 50%,
                        transparent 100%)`
                    }}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {/* Center Lotus Core */}
        <motion.div
          className="absolute"
          style={{
            left: sizeConfig.lotus / 2 - sizeConfig.center / 2,
            top: sizeConfig.lotus / 2 - sizeConfig.center / 2,
            width: sizeConfig.center,
            height: sizeConfig.center,
          }}
          animate={{
            scale: [1, 1.05, 1],
            filter: `drop-shadow(0 0 ${20 + Math.sin(glowIntensity) * 10}px rgba(147, 51, 234, 0.4))`
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <div className="
            w-full h-full rounded-full
            bg-gradient-to-br from-yellow-200 via-orange-200 to-pink-200
            border-4 border-white/30
            flex items-center justify-center
            shadow-2xl
          ">
            {/* Sacred Om Symbol */}
            <motion.span
              className="text-2xl text-purple-800 font-bold"
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              ॐ
            </motion.span>

            {/* Breathing Ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-purple-300/50"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.2, 0.5]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          </div>
        </motion.div>

        {/* Progress Particles */}
        <AnimatePresence>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-purple-400/60"
              initial={{
                scale: 0,
                x: Math.random() * sizeConfig.lotus - sizeConfig.lotus / 2,
                y: Math.random() * sizeConfig.lotus - sizeConfig.lotus / 2,
              }}
              animate={{
                scale: [0, 1, 0],
                y: [0, -20, -40],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                delay: i * 0.3,
                repeat: Infinity,
                ease: 'easeOut'
              }}
              style={{
                left: sizeConfig.lotus / 2,
                top: sizeConfig.lotus / 2,
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Step Labels */}
      {showLabels && (
        <div className="flex flex-wrap justify-center gap-6 max-w-2xl">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className={`text-center ${sizeConfig.text} cursor-pointer`}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: index <= currentStep ? 1 : 0.6,
                y: 0,
                scale: index === currentStep ? 1.05 : 1
              }}
              transition={{ delay: index * 0.1, ...timing }}
              onClick={() => interactive && onStepClick?.(index)}
            >
              <div className={`font-medium ${
                step.status === 'completed' ? 'text-emerald-600 dark:text-emerald-400' :
                step.status === 'current' ? 'text-purple-600 dark:text-purple-400' :
                step.status === 'error' ? 'text-red-600 dark:text-red-400' :
                'text-gray-500 dark:text-gray-400'
              }`}>
                {step.title}
              </div>
              {step.description && (
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {step.description}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Overall Progress Bar */}
      <div className="w-full max-w-md">
        <motion.div
          className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            transition={timing}
          />
        </motion.div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
          <span>Start</span>
          <span>{Math.round((currentStep / (steps.length - 1)) * 100)}% Complete</span>
          <span>Complete</span>
        </div>
      </div>
    </div>
  );
};
