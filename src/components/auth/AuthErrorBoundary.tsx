import React from 'react';

interface AuthErrorBoundaryState {
  hasError: boolean;
  error?: Error | null;
}

interface AuthErrorBoundaryProps {
  children: React.ReactNode;
}

/**
 * AuthErrorBoundary Component
 * 
 * Catches and handles authentication-related errors gracefully.
 * Provides fallback UI and recovery options for auth errors.
 */
export class AuthErrorBoundary extends React.Component<AuthErrorBoundaryProps, AuthErrorBoundaryState> {
  constructor(props: AuthErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): AuthErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Authentication Error Boundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    // Clear localStorage to ensure fresh start
    localStorage.removeItem('demo_auth_token');
    localStorage.removeItem('demo_user');
    // Reload the page
    window.location.reload();
  };

  override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border border-white/20 dark:border-white/10 rounded-2xl p-8 text-center shadow-xl">
            <div className="text-6xl mb-6">🚨</div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Authentication Error
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Something went wrong with the authentication system. This is usually a temporary issue.
            </p>
            
            {this.state.error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-left">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                  Error Details:
                </h3>
                <p className="text-xs text-red-700 dark:text-red-300 font-mono break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}
            
            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors duration-200"
              >
                🔄 Retry Authentication
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors duration-200"
              >
                🏠 Go to Home
              </button>
            </div>
            
            <p className="mt-6 text-xs text-gray-500 dark:text-gray-400">
              If the problem persists, please contact support or try again later.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}