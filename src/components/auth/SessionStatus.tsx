import React, { useState, useEffect } from 'react';
import { useMockAuth } from './MockAuthProvider';

/**
 * SessionStatus Component
 * 
 * Shows session information and expiration status.
 * Useful for development and debugging authentication.
 */
export const SessionStatus: React.FC = () => {
  const { user, token, isAuthenticated } = useMockAuth();
  const [showStatus, setShowStatus] = useState(false);
  const [timeUntilExpiry, setTimeUntilExpiry] = useState<string>('');

  useEffect(() => {
    if (!token || !isAuthenticated) {
      setTimeUntilExpiry('');
      return;
    }

    const updateExpiryTime = () => {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp) {
          const expiryTime = payload.exp * 1000;
          const now = Date.now();
          const timeLeft = expiryTime - now;
          
          if (timeLeft > 0) {
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            if (hours > 0) {
              setTimeUntilExpiry(`${hours}h ${minutes}m`);
            } else if (minutes > 0) {
              setTimeUntilExpiry(`${minutes}m ${seconds}s`);
            } else {
              setTimeUntilExpiry(`${seconds}s`);
            }
          } else {
            setTimeUntilExpiry('Expired');
          }
        }
      } catch {
        setTimeUntilExpiry('Invalid');
      }
    };

    updateExpiryTime();
    const interval = setInterval(updateExpiryTime, 1000);
    
    return () => clearInterval(interval);
  }, [token, isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative">
        <button
          onClick={() => setShowStatus(!showStatus)}
          className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          title="Session Status"
        >
          <span className="text-xs">🔐</span>
        </button>
        
        {showStatus && (
          <div className="absolute bottom-14 right-0 w-64 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border border-white/20 dark:border-white/10 rounded-lg shadow-lg p-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Status:</span>
                <span className="text-green-600 dark:text-green-400 font-medium">
                  Authenticated
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">User:</span>
                <span className="font-medium text-gray-900 dark:text-white truncate ml-2">
                  {user?.name}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Role:</span>
                <span className="font-medium text-primary-600 dark:text-primary-400">
                  {user?.role}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Expires in:</span>
                <span className={`font-mono text-xs ${
                  timeUntilExpiry === 'Expired' 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-orange-600 dark:text-orange-400'
                }`}>
                  {timeUntilExpiry || 'Unknown'}
                </span>
              </div>
              
              <div className="pt-2 border-t border-white/10">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Token ID: {token?.split('.')[2]?.substring(0, 8) || 'N/A'}...
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};