/**
 * Mobile Bottom Sheet - Touch-optimized Registration Container
 *
 * Features:
 * - Smooth slide-up animation with native feel
 * - Drag-to-dismiss gesture support
 * - Safe area handling for modern phones
 * - Backdrop blur and modal overlay
 * - Keyboard-aware auto-resizing
 * - Haptic feedback (when available)
 * - iOS and Android gesture patterns
 */

import { AnimatePresence, motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface MobileBottomSheetProps {
  children: ReactNode;
  isOpen?: boolean;
  onClose: () => void;
  snapPoints?: number[]; // [0.3, 0.6, 0.9] - percentage of screen height
  initialSnapPoint?: number;
  allowDismiss?: boolean;
  showDragHandle?: boolean;
  enableHaptics?: boolean;
  title?: string;
  subtitle?: string;
}

export const MobileBottomSheet: React.FC<MobileBottomSheetProps> = ({
  children,
  isOpen = true,
  onClose,
  snapPoints = [0.9],
  initialSnapPoint = 0,
  allowDismiss = true,
  showDragHandle = true,
  enableHaptics = true,
  title,
  subtitle,
}) => {
  const [currentSnapPoint, setCurrentSnapPoint] = useState(initialSnapPoint);
  const [isDragging, setIsDragging] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Motion values for smooth dragging
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, 300], [1, 0]);
  const backdropOpacity = useTransform(y, [0, 300], [0.5, 0]);

  // Calculate sheet height based on snap point and keyboard
  const getSheetHeight = (snapPointIndex: number) => {
    const windowHeight = window.innerHeight;
    const safeAreaBottom = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--safe-area-inset-bottom') || '0');
    const baseHeight = windowHeight * snapPoints[snapPointIndex];
    return Math.min(baseHeight, windowHeight - keyboardHeight - safeAreaBottom - 20);
  };

  // Haptic feedback (when available)
  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!enableHaptics || !('vibrate' in navigator)) return;

    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30, 10, 30],
    };

    navigator.vibrate(patterns[type]);
  };

  // Keyboard handling for better mobile experience
  useEffect(() => {
    const handleResize = () => {
      const visualViewport = window.visualViewport;
      if (visualViewport) {
        const keyboardHeight = window.innerHeight - visualViewport.height;
        setKeyboardHeight(Math.max(0, keyboardHeight));
      }
    };

    window.visualViewport?.addEventListener('resize', handleResize);
    return () => window.visualViewport?.removeEventListener('resize', handleResize);
  }, []);

  // Handle drag gestures
  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!allowDismiss) return;

    const { offset, velocity } = info;

    // Only allow dragging down (positive y)
    if (offset.y < 0) return;

    setIsDragging(true);
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!allowDismiss) return;

    const { offset, velocity } = info;
    setIsDragging(false);

    // Dismiss threshold: drag down more than 150px or fast downward velocity
    const shouldDismiss = offset.y > 150 || (velocity.y > 500 && offset.y > 50);

    if (shouldDismiss) {
      triggerHaptic('medium');
      onClose();
    } else {
      // Snap back to current position
      y.set(0);
      triggerHaptic('light');
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && allowDismiss) {
      triggerHaptic('light');
      onClose();
    }
  };

  // Snap to different heights (for future enhancement)
  const handleSnapPointChange = (index: number) => {
    setCurrentSnapPoint(index);
    triggerHaptic('light');
  };

  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sheetContent = (
    <AnimatePresence mode="wait">
      <motion.div
        className="fixed inset-0 z-50 flex items-end"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={handleBackdropClick}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          style={{ opacity: backdropOpacity }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
        />

        {/* Bottom Sheet */}
        <motion.div
          ref={sheetRef}
          className="relative w-full bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl"
          style={{
            height: getSheetHeight(currentSnapPoint),
            y,
            opacity,
          }}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{
            type: 'spring',
            damping: 30,
            stiffness: 300,
            mass: 0.8,
          }}
          drag={allowDismiss ? 'y' : false}
          dragConstraints={{ top: 0, bottom: 300 }}
          dragElastic={{ top: 0, bottom: 0.2 }}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          whileDrag={{
            scale: 0.98,
            borderRadius: '24px 24px 32px 32px',
          }}
        >
          {/* Drag Handle */}
          {showDragHandle && (
            <div className="flex justify-center pt-3 pb-2">
              <motion.div
                className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full"
                animate={{
                  backgroundColor: isDragging ? '#9CA3AF' : '#D1D5DB',
                  scale: isDragging ? 1.2 : 1,
                }}
                transition={{ duration: 0.2 }}
              />
            </div>
          )}

          {/* Header */}
          {(title || subtitle) && (
            <div className="px-6 pb-4 border-b border-gray-100 dark:border-gray-800">
              {title && (
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {/* Content Area */}
          <div
            className="flex-1 overflow-y-auto overscroll-y-contain"
            style={{
              paddingBottom: Math.max(keyboardHeight, 20) + 'px',
              maxHeight: getSheetHeight(currentSnapPoint) - (title ? 80 : 20),
            }}
          >
            {children}
          </div>

          {/* Safe Area Bottom Padding */}
          <div
            className="w-full bg-white dark:bg-gray-900"
            style={{
              height: `max(20px, env(safe-area-inset-bottom))`,
            }}
          />

          {/* Snap Point Indicators (if multiple snap points) */}
          {snapPoints.length > 1 && (
            <div className="absolute right-4 top-6 flex flex-col gap-2">
              {snapPoints.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentSnapPoint
                      ? 'bg-purple-500'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  onClick={() => handleSnapPointChange(index)}
                  aria-label={`Snap to ${Math.round(snapPoints[index] * 100)}% height`}
                />
              ))}
            </div>
          )}

          {/* Scroll Shadow for long content */}
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white dark:from-gray-900 to-transparent pointer-events-none opacity-50" />
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-gray-900 to-transparent pointer-events-none opacity-50" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  // Render in portal for proper stacking
  return createPortal(sheetContent, document.body);
};

// Hook for detecting mobile and providing bottom sheet context
export const useMobileBottomSheet = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      const isSmallScreen = window.innerWidth < 768;
      setIsMobile(isMobileDevice || isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return { isMobile };
};

// Higher-order component for wrapping forms in bottom sheet on mobile
export const withMobileBottomSheet = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return (props: P & { onClose?: () => void; title?: string; subtitle?: string }) => {
    const { isMobile } = useMobileBottomSheet();
    const { onClose, title, subtitle, ...componentProps } = props;

    if (isMobile && onClose) {
      return (
        <MobileBottomSheet
          onClose={onClose}
          title={title}
          subtitle={subtitle}
          snapPoints={[0.9]}
          allowDismiss={true}
          showDragHandle={true}
          enableHaptics={true}
        >
          <Component {...(componentProps as P)} />
        </MobileBottomSheet>
      );
    }

    return <Component {...(componentProps as P)} />;
  };
};
