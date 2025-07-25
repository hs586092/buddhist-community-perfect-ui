/**
 * Zen Capacity Visualization - Garden Metaphor for Event Capacity
 *
 * Features:
 * - Zen garden with stones representing capacity
 * - Flowing water animation for dynamic feel
 * - Multiple patterns: zen-garden, lotus-grid, mandala, flowing-water
 * - Smooth transitions and gentle animations
 * - Real-time capacity updates
 * - Accessible with screen reader support
 */

import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useMemo, useState } from 'react';

interface ZenCapacityVisualizationProps {
  total: number;
  registered: number;
  pending?: number;
  waitlist?: number;
  pattern?: 'zen-garden' | 'lotus-grid' | 'mandala' | 'flowing-water';
  animationSpeed?: 'gentle' | 'moderate' | 'dynamic';
  size?: 'sm' | 'md' | 'lg';
  showNumbers?: boolean;
  showWaterFlow?: boolean;
  interactive?: boolean;
}

export const ZenCapacityVisualization: React.FC<ZenCapacityVisualizationProps> = ({
  total,
  registered,
  pending = 0,
  waitlist = 0,
  pattern = 'zen-garden',
  animationSpeed = 'gentle',
  size = 'md',
  showNumbers = true,
  showWaterFlow = true,
  interactive = false,
}) => {
  const [hoveredStone, setHoveredStone] = useState<number | null>(null);
  const [waterFlow, setWaterFlow] = useState(0);
  const [sparkles, setSparkles] = useState<Array<{ id: string; x: number; y: number; delay: number }>>([]);

  // Size configurations
  const sizeConfig = {
    sm: {
      container: 280,
      stone: 16,
      spacing: 20,
      text: 'text-xs',
      padding: 'p-4'
    },
    md: {
      container: 360,
      stone: 20,
      spacing: 24,
      text: 'text-sm',
      padding: 'p-6'
    },
    lg: {
      container: 440,
      stone: 24,
      spacing: 28,
      text: 'text-base',
      padding: 'p-8'
    },
  }[size];

  // Animation timing
  const timing = {
    gentle: { duration: 1.5, ease: 'easeInOut' },
    moderate: { duration: 1.0, ease: 'easeInOut' },
    dynamic: { duration: 0.6, ease: 'backOut' },
  }[animationSpeed];

  // Calculate remaining spots
  const remaining = total - registered - pending;
  const isNearCapacity = remaining <= total * 0.1; // Less than 10% remaining
  const isFull = remaining <= 0;

  // Generate stone positions based on pattern
  const stones = useMemo(() => {
    const stoneArray: Array<{
      id: number;
      x: number;
      y: number;
      status: 'registered' | 'pending' | 'available' | 'waitlist';
      delay: number;
    }> = [];

    const containerSize = sizeConfig.container - sizeConfig.padding.includes('4') ? 32 :
                         sizeConfig.padding.includes('6') ? 48 : 64;

    // Generate positions based on pattern
    switch (pattern) {
      case 'zen-garden':
        generateZenGardenPattern();
        break;
      case 'lotus-grid':
        generateLotusGridPattern();
        break;
      case 'mandala':
        generateMandalaPattern();
        break;
      case 'flowing-water':
        generateFlowingWaterPattern();
        break;
    }

    function generateZenGardenPattern() {
      const rows = Math.ceil(Math.sqrt(total));
      const cols = Math.ceil(total / rows);

      for (let i = 0; i < total; i++) {
        const row = Math.floor(i / cols);
        const col = i % cols;

        // Add gentle randomness for natural feel
        const offsetX = (Math.random() - 0.5) * 8;
        const offsetY = (Math.random() - 0.5) * 8;

        stoneArray.push({
          id: i,
          x: (col * sizeConfig.spacing) + (containerSize / cols) * (col + 0.5) + offsetX,
          y: (row * sizeConfig.spacing) + (containerSize / rows) * (row + 0.5) + offsetY,
          status: getStoneStatus(i),
          delay: i * 0.05,
        });
      }
    }

    function generateLotusGridPattern() {
      const center = containerSize / 2;
      const layers = Math.ceil(Math.sqrt(total / 8)); // 8 petals per layer
      let stoneIndex = 0;

      // Center stone
      if (stoneIndex < total) {
        stoneArray.push({
          id: stoneIndex,
          x: center,
          y: center,
          status: getStoneStatus(stoneIndex),
          delay: stoneIndex * 0.05,
        });
        stoneIndex++;
      }

      // Spiral outward
      for (let layer = 1; layer <= layers && stoneIndex < total; layer++) {
        const radius = layer * sizeConfig.spacing * 1.5;
        const petalCount = Math.min(8 * layer, total - stoneIndex);

        for (let i = 0; i < petalCount; i++) {
          const angle = (i / petalCount) * 2 * Math.PI;
          stoneArray.push({
            id: stoneIndex,
            x: center + Math.cos(angle) * radius,
            y: center + Math.sin(angle) * radius,
            status: getStoneStatus(stoneIndex),
            delay: stoneIndex * 0.05,
          });
          stoneIndex++;
        }
      }
    }

    function generateMandalaPattern() {
      const center = containerSize / 2;
      const rings = Math.ceil(Math.sqrt(total / 6));
      let stoneIndex = 0;

      for (let ring = 0; ring < rings && stoneIndex < total; ring++) {
        const radius = ring === 0 ? 0 : ring * sizeConfig.spacing * 1.2;
        const stonesInRing = ring === 0 ? 1 : Math.min(6 * ring, total - stoneIndex);

        for (let i = 0; i < stonesInRing && stoneIndex < total; i++) {
          if (ring === 0) {
            stoneArray.push({
              id: stoneIndex,
              x: center,
              y: center,
              status: getStoneStatus(stoneIndex),
              delay: stoneIndex * 0.05,
            });
          } else {
            const angle = (i / stonesInRing) * 2 * Math.PI;
            stoneArray.push({
              id: stoneIndex,
              x: center + Math.cos(angle) * radius,
              y: center + Math.sin(angle) * radius,
              status: getStoneStatus(stoneIndex),
              delay: stoneIndex * 0.05,
            });
          }
          stoneIndex++;
        }
      }
    }

    function generateFlowingWaterPattern() {
      // Organic flowing pattern like water
      for (let i = 0; i < total; i++) {
        const wave = Math.sin(i * 0.5) * 30;
        const flow = Math.cos(i * 0.3) * 20;

        stoneArray.push({
          id: i,
          x: (i % 8) * sizeConfig.spacing + wave + containerSize * 0.1,
          y: Math.floor(i / 8) * sizeConfig.spacing + flow + containerSize * 0.1,
          status: getStoneStatus(i),
          delay: i * 0.05,
        });
      }
    }

    function getStoneStatus(index: number): 'registered' | 'pending' | 'available' | 'waitlist' {
      if (index < registered) return 'registered';
      if (index < registered + pending) return 'pending';
      if (index < total) return 'available';
      return 'waitlist';
    }

    return stoneArray;
  }, [total, registered, pending, pattern, sizeConfig]);

  // Water flow animation
  useEffect(() => {
    if (!showWaterFlow) return;

    const interval = setInterval(() => {
      setWaterFlow(prev => (prev + 0.02) % (Math.PI * 2));
    }, 50);

    return () => clearInterval(interval);
  }, [showWaterFlow]);

  // Generate sparkles for full capacity celebration
  useEffect(() => {
    if (isFull && sparkles.length === 0) {
      const newSparkles = Array.from({ length: 12 }, (_, i) => ({
        id: `sparkle-${i}`,
        x: Math.random() * sizeConfig.container,
        y: Math.random() * sizeConfig.container,
        delay: i * 0.1,
      }));
      setSparkles(newSparkles);
    } else if (!isFull && sparkles.length > 0) {
      setSparkles([]);
    }
  }, [isFull, sparkles.length, sizeConfig.container]);

  // Stone colors based on status
  const getStoneColor = (status: string, isHovered: boolean) => {
    const colors = {
      registered: 'from-emerald-400 to-emerald-600',
      pending: 'from-amber-400 to-orange-500',
      available: 'from-gray-200 to-gray-400',
      waitlist: 'from-red-300 to-red-500',
    };

    return `bg-gradient-to-br ${colors[status as keyof typeof colors]} ${
      isHovered ? 'shadow-lg scale-110' : 'shadow-md'
    }`;
  };

  // Accessibility information
  const accessibilityText = `Event capacity: ${registered} registered, ${pending} pending, ${remaining} available spots out of ${total} total. ${waitlist > 0 ? `${waitlist} on waitlist.` : ''}`;

  return (
    <div className={`relative ${sizeConfig.padding} bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-xl overflow-hidden`}>
      {/* Accessibility */}
      <div className="sr-only" aria-live="polite">
        {accessibilityText}
      </div>

      {/* Header */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
          Event Capacity
        </h3>
        <div className="flex justify-center items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600"></div>
            <span>Registered</span>
          </div>
          {pending > 0 && (
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-amber-400 to-orange-500"></div>
              <span>Pending</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-gray-200 to-gray-400"></div>
            <span>Available</span>
          </div>
        </div>
      </div>

      {/* Zen Garden Visualization */}
      <div
        className="relative mx-auto bg-gradient-to-br from-sand-100 to-sand-200 dark:from-gray-700 dark:to-gray-800 rounded-lg overflow-hidden"
        style={{
          width: sizeConfig.container,
          height: sizeConfig.container * 0.8,
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(255,255,255,0.05) 0%, transparent 50%)`
        }}
      >
        {/* Water Flow Background */}
        {showWaterFlow && (
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={{
              backgroundPosition: `${Math.sin(waterFlow) * 100}px ${Math.cos(waterFlow) * 50}px`
            }}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ADD8E6' fill-opacity='0.3'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0-11.046 8.954-20 20-20s20 8.954 20 20-8.954 20-20 20-20-8.954-20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }}
          />
        )}

        {/* Zen Garden Stones */}
        <AnimatePresence>
          {stones.map((stone) => (
            <motion.div
              key={stone.id}
              className={`absolute rounded-full cursor-pointer transition-all duration-200 ${getStoneColor(stone.status, hoveredStone === stone.id)}`}
              style={{
                left: stone.x - sizeConfig.stone / 2,
                top: stone.y - sizeConfig.stone / 2,
                width: sizeConfig.stone,
                height: sizeConfig.stone,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                rotate: stone.status === 'registered' ? 0 : Math.sin(waterFlow + stone.id) * 5
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ delay: stone.delay, ...timing }}
              onHoverStart={() => interactive && setHoveredStone(stone.id)}
              onHoverEnd={() => setHoveredStone(null)}
              whileHover={interactive ? { scale: 1.2, zIndex: 10 } : {}}
            >
              {/* Stone inner glow */}
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  boxShadow: stone.status === 'registered'
                    ? `0 0 ${8 + Math.sin(waterFlow + stone.id) * 4}px rgba(16, 185, 129, 0.6)`
                    : stone.status === 'pending'
                    ? `0 0 ${6 + Math.sin(waterFlow + stone.id) * 3}px rgba(245, 158, 11, 0.5)`
                    : 'none'
                }}
              />

              {/* Ripple effect for interaction */}
              <AnimatePresence>
                {hoveredStone === stone.id && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-white/50"
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{ scale: 2, opacity: 0 }}
                    exit={{ scale: 1, opacity: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Celebration Sparkles */}
        <AnimatePresence>
          {sparkles.map((sparkle) => (
            <motion.div
              key={sparkle.id}
              className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full"
              style={{ left: sparkle.x, top: sparkle.y }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                rotate: [0, 180, 360],
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                duration: 2,
                delay: sparkle.delay,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          ))}
        </AnimatePresence>

        {/* Capacity Status Overlay */}
        {isNearCapacity && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className={`px-4 py-2 rounded-full text-white font-medium ${
                isFull ? 'bg-red-500' : 'bg-orange-500'
              }`}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {isFull ? '🙏 Event Full' : `⚡ Only ${remaining} spots left!`}
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Numerical Summary */}
      {showNumbers && (
        <motion.div
          className="mt-4 grid grid-cols-3 gap-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="space-y-1">
            <motion.div
              className="text-2xl font-bold text-emerald-600 dark:text-emerald-400"
              animate={{ scale: registered > 0 ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 0.5 }}
            >
              {registered}
            </motion.div>
            <div className={`${sizeConfig.text} text-gray-600 dark:text-gray-400`}>Registered</div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl font-bold text-gray-600 dark:text-gray-300">
              {remaining}
            </div>
            <div className={`${sizeConfig.text} text-gray-600 dark:text-gray-400`}>Available</div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl font-bold text-gray-500 dark:text-gray-400">
              {total}
            </div>
            <div className={`${sizeConfig.text} text-gray-600 dark:text-gray-400`}>Total</div>
          </div>
        </motion.div>
      )}

      {/* Waitlist Information */}
      {waitlist > 0 && (
        <motion.div
          className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
            <span className="text-lg">⏳</span>
            <span className={`${sizeConfig.text} font-medium`}>
              {waitlist} people on waitlist
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};
