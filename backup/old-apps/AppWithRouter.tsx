import { AuthErrorBoundary, SessionStatus } from './components/auth';
import { AppRouter } from './components/layout';
import './index.css';

/**
 * App Component with Full Router Integration
 * 
 * This demonstrates a complete authentication system with:
 * - Router-based navigation
 * - Protected routes
 * - Role-based access control
 * - Session monitoring
 * - Error boundaries
 */
function AppWithRouter() {
  return (
    <AuthErrorBoundary>
      <AppRouter />
      <SessionStatus />
    </AuthErrorBoundary>
  );
}

export default AppWithRouter;