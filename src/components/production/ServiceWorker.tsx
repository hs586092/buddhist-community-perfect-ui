// Service Worker management for Buddhist Community
// 오프라인 지원 및 캐싱 전략

import React, { useEffect, useState } from 'react';

interface ServiceWorkerState {
  isInstalled: boolean;
  isWaiting: boolean;
  hasUpdate: boolean;
  isOffline: boolean;
}

const ServiceWorkerManager: React.FC = () => {
  const [swState, setSwState] = useState<ServiceWorkerState>({
    isInstalled: false,
    isWaiting: false, 
    hasUpdate: false,
    isOffline: !navigator.onLine
  });

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      registerServiceWorker();
    }

    // Listen for online/offline events
    const handleOnline = () => setSwState(prev => ({ ...prev, isOffline: false }));
    const handleOffline = () => setSwState(prev => ({ ...prev, isOffline: true }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      
      setSwState(prev => ({ ...prev, isInstalled: true }));
      console.log('🪷 Service Worker 등록 성공:', registration);

      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          setSwState(prev => ({ ...prev, isWaiting: true }));
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setSwState(prev => ({ ...prev, hasUpdate: true, isWaiting: false }));
            }
          });
        }
      });

      // Check if there's already an update waiting
      if (registration.waiting) {
        setSwState(prev => ({ ...prev, hasUpdate: true }));
      }

    } catch (error) {
      console.error('Service Worker 등록 실패:', error);
    }
  };

  const updateServiceWorker = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(registration => {
        if (registration?.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          window.location.reload();
        }
      });
    }
  };

  // Don't render anything in development
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  return (
    <div className="service-worker-manager">
      {/* Offline indicator */}
      {swState.isOffline && (
        <div className="fixed top-0 left-0 right-0 bg-amber-100 border-b border-amber-200 p-2 text-center text-amber-800 z-50">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-lg">🪷</span>
            <span className="text-sm font-medium">
              오프라인 상태입니다. 일부 기능이 제한될 수 있습니다.
            </span>
          </div>
        </div>
      )}

      {/* Update available notification */}
      {swState.hasUpdate && (
        <div className="fixed bottom-4 right-4 bg-blue-100 border border-blue-200 rounded-lg shadow-lg p-4 max-w-sm z-50">
          <div className="flex items-start space-x-3">
            <span className="text-2xl">🌸</span>
            <div className="flex-1">
              <h4 className="font-medium text-blue-900 mb-1">
                새로운 버전이 있습니다
              </h4>
              <p className="text-sm text-blue-700 mb-3">
                더 나은 경험을 위해 페이지를 새로고침해주세요.
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={updateServiceWorker}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                >
                  새로고침
                </button>
                <button
                  onClick={() => setSwState(prev => ({ ...prev, hasUpdate: false }))}
                  className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors"
                >
                  나중에
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Installation success (temporary notification) */}
      {swState.isInstalled && !swState.hasUpdate && !swState.isOffline && (
        <div className="fixed bottom-4 left-4 bg-green-100 border border-green-200 rounded-lg shadow-lg p-3 z-50 animate-fade-in">
          <div className="flex items-center space-x-2">
            <span className="text-lg">✅</span>
            <span className="text-sm text-green-800">
              오프라인 지원이 활성화되었습니다
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceWorkerManager;