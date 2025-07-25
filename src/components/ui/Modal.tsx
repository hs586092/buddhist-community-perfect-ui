/**
 * 영성 커뮤니티를 위한 평화로운 모달 컴포넌트
 * 마음의 평안을 주는 디자인으로 제작
 */

import { forwardRef, HTMLAttributes, ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import { Button } from './Button';

// 모달 인터페이스
interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
}

// 모달 컴포넌트
const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ 
    isOpen,
    onClose,
    children,
    className,
    size = 'md',
    closeOnBackdrop = true,
    closeOnEscape = true,
    showCloseButton = true,
    ...props 
  }, ref) => {
    // ESC 키 핸들러
    useEffect(() => {
      if (!isOpen || !closeOnEscape) return;

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, closeOnEscape, onClose]);

    // 바디 스크롤 제어
    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }

      return () => {
        document.body.style.overflow = 'unset';
      };
    }, [isOpen]);

    const sizeClasses = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      full: 'max-w-full mx-4'
    };

    return (
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* 백드롭 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={closeOnBackdrop ? onClose : undefined}
            />

            {/* 모달 콘텐츠 */}
            <motion.div
              ref={ref}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                duration: 0.3 
              }}
              className={cn(
                'relative bg-white rounded-2xl shadow-2xl border border-sage-100',
                'max-h-[90vh] overflow-hidden z-10',
                'w-full',
                sizeClasses[size],
                className
              )}
              onClick={(e) => e.stopPropagation()}
              {...props}
            >
              {/* 닫기 버튼 */}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-20 p-2 rounded-lg text-sage-500 hover:text-sage-700 hover:bg-sage-50 transition-colors"
                  aria-label="닫기"
                >
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}

              {children}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  }
);

Modal.displayName = 'Modal';

// 모달 헤더 컴포넌트
interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-between p-6 border-b border-sage-100',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ModalHeader.displayName = 'ModalHeader';

// 모달 제목 컴포넌트
interface ModalTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const ModalTitle = forwardRef<HTMLHeadingElement, ModalTitleProps>(
  ({ children, className, as: Component = 'h2', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          'text-xl font-semibold text-sage-900 pr-8',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

ModalTitle.displayName = 'ModalTitle';

// 모달 콘텐츠 컴포넌트
interface ModalContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'p-6 overflow-y-auto max-h-[60vh]',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ModalContent.displayName = 'ModalContent';

// 모달 푸터 컴포넌트
interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-end gap-3 p-6 border-t border-sage-100 bg-sage-25',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ModalFooter.displayName = 'ModalFooter';

// 확인 모달 컴포넌트
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  variant = 'info'
}: ConfirmModalProps) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const variantStyles = {
    danger: {
      icon: '⚠️',
      confirmVariant: 'primary' as const,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600'
    },
    warning: {
      icon: '⚠️',
      confirmVariant: 'lotus' as const,
      iconBg: 'bg-warmth-100',
      iconColor: 'text-warmth-600'
    },
    info: {
      icon: 'ℹ️',
      confirmVariant: 'primary' as const,
      iconBg: 'bg-serenity-100',
      iconColor: 'text-serenity-600'
    }
  };

  const style = variantStyles[variant];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalContent>
        <div className="text-center">
          <div className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4',
            style.iconBg
          )}>
            <span className="text-2xl">{style.icon}</span>
          </div>
          
          <h3 className="text-lg font-semibold text-sage-900 mb-2">
            {title}
          </h3>
          
          <p className="text-sage-600 mb-6">
            {message}
          </p>
        </div>
      </ModalContent>

      <ModalFooter>
        <Button variant="ghost" onClick={onClose}>
          {cancelText}
        </Button>
        <Button variant={style.confirmVariant} onClick={handleConfirm}>
          {confirmText}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalContent,
  ModalFooter,
  ConfirmModal
};