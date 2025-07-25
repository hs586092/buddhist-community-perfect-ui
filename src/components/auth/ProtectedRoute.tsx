import React from 'react';
import { Navigate } from 'react-router-dom';
import { useMockAuth } from './MockAuthProvider';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: string;
  fallback?: React.ReactNode;
}

/**
 * ProtectedRoute Component
 * 
 * Wraps routes that require authentication.
 * Redirects to login if user is not authenticated.
 * Optionally checks for specific user roles.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireRole,
  fallback 
}) => {
  const { isAuthenticated, user, isLoading } = useMockAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full"></div>
          <p className="text-gray-600 dark:text-gray-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role requirements
  if (requireRole && user?.role !== requireRole) {
    return fallback || (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You don't have permission to access this page.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Required role: {requireRole} | Your role: {user?.role}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

/**
 * PublicRoute Component
 * 
 * Wraps routes that should only be accessible when not authenticated.
 * Redirects to dashboard if user is already authenticated.
 */
export const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useMockAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};