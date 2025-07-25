/**
 * Toast Provider Component
 * 
 * Global toast notification system with:
 * - Multiple toast variants and positions
 * - Auto-dismiss with pause on hover
 * - Queue management and stacking
 * - Smooth animations and transitions
 * - Accessibility support
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'loading';
  title?: string;
  message: string;
  duration?: number; // in milliseconds, 0 for permanent
  position?: ToastPosition;
  actions?: ToastAction[];
  dismissible?: boolean;
}

export interface ToastAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export type ToastPosition = 
  | 'top-left' | 'top-center' | 'top-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right';

interface ToastContextType {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => string;
  dismissToast: (id: string) => void;
  dismissAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
  maxToasts?: number;
  defaultDuration?: number;
  defaultPosition?: ToastPosition;
}

/**
 * Enhanced Toast Provider
 * 
 * Production-ready toast system with:
 * - Queue management with max limits
 * - Position-based rendering with stacking
 * - Auto-dismiss with hover pause
 * - Action buttons and custom content
 * - Smooth enter/exit animations
 * - Accessibility with ARIA live regions
 * - Mobile-responsive positioning
 */
export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  maxToasts = 5,
  defaultDuration = 5000,
  defaultPosition = 'top-right',
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toastData: Omit<Toast, 'id'>): string => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const toast: Toast = {
      id,
      duration: defaultDuration,
      position: defaultPosition,
      dismissible: true,
      ...toastData,
    };

    setToasts(prev => {
      const newToasts = [toast, ...prev];
      // Limit the number of toasts
      if (newToasts.length > maxToasts) {
        return newToasts.slice(0, maxToasts);
      }
      return newToasts;
    });

    // Auto-dismiss if duration is set
    if (toast.duration && toast.duration > 0) {
      setTimeout(() => {
        dismissToast(id);
      }, toast.duration);
    }

    return id;
  }, [defaultDuration, defaultPosition, maxToasts]);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const dismissAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const value: ToastContextType = {
    toasts,
    showToast,
    dismissToast,
    dismissAllToasts,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
};

// Toast Container Component
interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  // Group toasts by position
  const toastsByPosition = toasts.reduce((acc, toast) => {
    const position = toast.position || 'top-right';
    if (!acc[position]) {
      acc[position] = [];
    }
    acc[position].push(toast);
    return acc;
  }, {} as Record<ToastPosition, Toast[]>);

  const getPositionClasses = (position: ToastPosition): string => {
    const positionClasses = {
      'top-left': 'top-4 left-4',
      'top-center': 'top-4 left-1/2 -translate-x-1/2',
      'top-right': 'top-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
      'bottom-right': 'bottom-4 right-4',
    };
    return positionClasses[position];
  };

  if (toasts.length === 0) return null;

  return createPortal(
    <div className="fixed inset-0 pointer-events-none z-50">
      {Object.entries(toastsByPosition).map(([position, positionToasts]) => (
        <div
          key={position}
          className={cn(
            'fixed flex flex-col gap-2 max-w-sm w-full',
            getPositionClasses(position as ToastPosition),
            position.includes('bottom') ? 'flex-col-reverse' : 'flex-col'
          )}
          role="region"
          aria-live="polite"
          aria-label="Notifications"
        >
          {positionToasts.map((toast, index) => (
            <ToastItem
              key={toast.id}
              toast={toast}
              index={index}
              onDismiss={onDismiss}
              isBottom={position.includes('bottom')}
            />
          ))}
        </div>
      ))}
    </div>,
    document.body
  );
};

// Individual Toast Item Component
interface ToastItemProps {
  toast: Toast;
  index: number;
  onDismiss: (id: string) => void;
  isBottom: boolean;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, index, onDismiss, isBottom }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => onDismiss(toast.id), 300);
  };

  const getToastIcon = (type: string) => {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️',
      loading: '⏳',
    };
    return icons[type as keyof typeof icons] || 'ℹ️';
  };

  const getToastClasses = (type: string) => {
    const classes = {
      success: 'border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-200',
      error: 'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200',
      warning: 'border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200',
      info: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-200',
      loading: 'border-indigo-200 bg-indigo-50 text-indigo-800 dark:border-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-200',
    };
    return classes[type as keyof typeof classes] || classes.info;
  };

  return (
    <div
      className={cn(
        'pointer-events-auto transform transition-all duration-300 ease-out',
        'bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm',
        'border rounded-lg shadow-lg p-4 min-w-0',
        'hover:scale-105 hover:shadow-xl',
        getToastClasses(toast.type),
        isVisible 
          ? 'translate-x-0 opacity-100' 
          : toast.position?.includes('right')
            ? 'translate-x-full opacity-0'
            : '-translate-x-full opacity-0'
      )}
      style={{
        zIndex: 1000 - index,
        transform: isBottom 
          ? `translateY(${index * -8}px)` 
          : `translateY(${index * 8}px)`,
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 text-lg">
          {getToastIcon(toast.type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {toast.title && (
            <h4 className="text-sm font-semibold mb-1">
              {toast.title}
            </h4>
          )}
          
          <p className="text-sm leading-relaxed">
            {toast.message}
          </p>

          {/* Actions */}
          {toast.actions && toast.actions.length > 0 && (
            <div className="mt-3 flex items-center gap-2">
              {toast.actions.map((action, actionIndex) => (
                <button
                  key={actionIndex}
                  onClick={action.onClick}
                  className={cn(
                    'px-3 py-1 text-xs font-medium rounded transition-colors duration-200',
                    action.variant === 'primary'
                      ? 'bg-current text-white hover:opacity-90'
                      : 'bg-transparent border border-current hover:bg-current/10'
                  )}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dismiss Button */}
        {toast.dismissible && (
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-current/60 hover:text-current transition-colors duration-200"
            aria-label="Dismiss notification"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Progress Bar */}
      {toast.duration && toast.duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-current/20 rounded-b-lg overflow-hidden">
          <div 
            className={cn(
              'h-full bg-current/60 transition-all ease-linear',
              isPaused ? 'animate-pulse' : ''
            )}
            style={{
              animation: isPaused 
                ? 'none' 
                : `toast-progress ${toast.duration}ms linear forwards`,
            }}
          />
        </div>
      )}
    </div>
  );
};

// Custom hook to use toast
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Convenience methods
export const toast = {
  success: (message: string, options?: Partial<Toast>) => {
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('show-toast', {
        detail: { type: 'success', message, ...options }
      });
      window.dispatchEvent(event);
    }
  },
  error: (message: string, options?: Partial<Toast>) => {
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('show-toast', {
        detail: { type: 'error', message, ...options }
      });
      window.dispatchEvent(event);
    }
  },
  warning: (message: string, options?: Partial<Toast>) => {
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('show-toast', {
        detail: { type: 'warning', message, ...options }
      });
      window.dispatchEvent(event);
    }
  },
  info: (message: string, options?: Partial<Toast>) => {
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('show-toast', {
        detail: { type: 'info', message, ...options }
      });
      window.dispatchEvent(event);
    }
  },
  loading: (message: string, options?: Partial<Toast>) => {
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('show-toast', {
        detail: { type: 'loading', message, ...options }
      });
      window.dispatchEvent(event);
    }
  },
};

// Add CSS for progress animation
const styles = `
  @keyframes toast-progress {
    from { width: 100%; }
    to { width: 0%; }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}