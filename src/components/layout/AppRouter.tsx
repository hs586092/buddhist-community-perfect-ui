/**
 * AppRouter Component
 * 
 * Main application router with React Router DOM integration,
 * layout management, and route protection.
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { NavigationProvider } from '../../contexts/NavigationContext';
import { MockAuthProvider } from '../auth/MockAuthProvider';
import { ToastProvider } from '../notifications/ToastProvider';
import { AppLayout } from './AppLayout';
import { LoginForm } from '../auth/LoginForm';
import { LoginPage, RegisterPage, ForgotPasswordPage, EmailVerificationPage } from '../auth';
import { DashboardHome } from '../dashboard/DashboardHome';
import { EnhancedDashboardHome } from '../dashboard/EnhancedDashboardHome';
import { ChatPage } from '../../pages/ChatPage';
import { ComprehensiveComponentShowcase } from '../examples/ComprehensiveComponentShowcase';
import { CommunityPage } from '../../pages/CommunityPage';

// Mock page components for demonstration
const CommunityFeed = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold gradient-text">Activity Feed</h1>
    <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-xl p-6 border border-white/20 dark:border-white/5">
      <p>Community activity feed will be displayed here.</p>
    </div>
  </div>
);

const Members = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold gradient-text">Community Members</h1>
    <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-xl p-6 border border-white/20 dark:border-white/5">
      <p>Community members directory will be displayed here.</p>
    </div>
  </div>
);

const Groups = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold gradient-text">Community Groups</h1>
    <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-xl p-6 border border-white/20 dark:border-white/5">
      <p>Community groups will be displayed here.</p>
    </div>
  </div>
);

const Events = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold gradient-text">Community Events</h1>
    <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-xl p-6 border border-white/20 dark:border-white/5">
      <p>Upcoming community events will be displayed here.</p>
    </div>
  </div>
);

const Articles = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold gradient-text">Articles</h1>
    <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-xl p-6 border border-white/20 dark:border-white/5">
      <p>Article content will be displayed here.</p>
    </div>
  </div>
);

const Resources = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold gradient-text">Resources</h1>
    <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-xl p-6 border border-white/20 dark:border-white/5">
      <p>Community resources will be displayed here.</p>
    </div>
  </div>
);

const Media = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold gradient-text">Media Library</h1>
    <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-xl p-6 border border-white/20 dark:border-white/5">
      <p>Media library will be displayed here.</p>
    </div>
  </div>
);

const Analytics = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold gradient-text">Analytics</h1>
    <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-xl p-6 border border-white/20 dark:border-white/5">
      <p>Analytics dashboard will be displayed here.</p>
    </div>
  </div>
);

const Notifications = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold gradient-text">Notifications</h1>
    <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-xl p-6 border border-white/20 dark:border-white/5">
      <p>Notification center will be displayed here.</p>
    </div>
  </div>
);

const Settings = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold gradient-text">Settings</h1>
    <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-xl p-6 border border-white/20 dark:border-white/5">
      <p>Application settings will be displayed here.</p>
    </div>
  </div>
);

const AdminDashboard = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold gradient-text">👑 Admin Dashboard</h1>
    <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-xl p-6 border border-white/20 dark:border-white/5">
      <p>Administrative dashboard will be displayed here.</p>
    </div>
  </div>
);

const Profile = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold gradient-text">Profile Settings</h1>
    <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-xl p-6 border border-white/20 dark:border-white/5">
      <p>User profile settings will be displayed here.</p>
    </div>
  </div>
);

const Preferences = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold gradient-text">Preferences</h1>
    <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-xl p-6 border border-white/20 dark:border-white/5">
      <p>User preferences will be displayed here.</p>
    </div>
  </div>
);

const ComponentShowcase = () => (
  <div className="space-y-6">
    <ComprehensiveComponentShowcase />
  </div>
);

// Not Found component
const NotFound = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
    <div className="text-center space-y-6">
      <div className="text-8xl font-bold text-gray-300 dark:text-gray-700">404</div>
      <h1 className="text-2xl font-bold gradient-text">Page Not Found</h1>
      <p className="text-gray-600 dark:text-gray-400 max-w-md">
        The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
      </p>
      <div className="flex gap-4 justify-center">
        <a
          href="/"
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
        >
          Go Home
        </a>
        <button
          onClick={() => window.history.back()}
          className="px-6 py-3 bg-white/10 dark:bg-black/20 backdrop-blur-lg border border-white/20 dark:border-white/5 rounded-lg hover:bg-white/20 dark:hover:bg-black/30 transition-colors duration-200"
        >
          Go Back
        </button>
      </div>
    </div>
  </div>
);

/**
 * AuthWrapper Component
 * 
 * Handles authentication state and redirects to login if needed
 */
const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = localStorage.getItem('demo_auth_token') !== null;

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};

/**
 * AppRouter Component
 * 
 * Main application router with comprehensive routing setup
 */
export const AppRouter: React.FC = () => {
  return (
    <Router>
      <MockAuthProvider>
        <ToastProvider>
          <NavigationProvider>
            <Routes>
            {/* Authentication Routes (Public) */}
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/auth/verify-email" element={<EmailVerificationPage />} />

            {/* Protected Routes */}
            <Route path="/*" element={
              <AuthWrapper>
                <Routes>
                  {/* Main Layout Routes */}
                  <Route path="/" element={<AppLayout />}>
                    <Route index element={<EnhancedDashboardHome />} />
                    
                    {/* Community Routes */}
                    <Route path="community">
                      <Route index element={<CommunityPage />} />
                      <Route path="feed" element={<CommunityFeed />} />
                      <Route path="members" element={<Members />} />
                      <Route path="groups" element={<Groups />} />
                      <Route path="events" element={<Events />} />
                    </Route>

                    {/* Content Routes */}
                    <Route path="content">
                      <Route path="articles" element={<Articles />} />
                      <Route path="resources" element={<Resources />} />
                      <Route path="media" element={<Media />} />
                    </Route>

                    {/* Tool Routes */}
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="notifications" element={<Notifications />} />
                    <Route path="chat" element={<ChatPage />} />
                    <Route path="settings" element={<Settings />} />

                    {/* Admin Routes */}
                    <Route path="admin" element={<AdminDashboard />} />

                    {/* Profile Routes */}
                    <Route path="profile" element={<Profile />} />
                    <Route path="preferences" element={<Preferences />} />

                    {/* Component Showcase */}
                    <Route path="showcase" element={<ComponentShowcase />} />
                  </Route>

                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AuthWrapper>
            } />
          </Routes>
          </NavigationProvider>
        </ToastProvider>
      </MockAuthProvider>
    </Router>
  );
};