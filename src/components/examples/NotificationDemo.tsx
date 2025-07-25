/**
 * Notification Demo Component
 * 
 * Demonstration of the real-time notification and toast systems.
 */

import React from 'react';
import { GlassButton } from '../ui';
import { useToast } from '../notifications/ToastProvider';

/**
 * Notification Demo
 * 
 * Shows examples of different notification types and toast messages.
 */
export const NotificationDemo: React.FC = () => {
  const { showToast } = useToast();

  const showSuccessToast = () => {
    showToast({
      type: 'success',
      title: 'Success!',
      message: 'Your profile has been updated successfully.',
      duration: 4000,
    });
  };

  const showErrorToast = () => {
    showToast({
      type: 'error',
      title: 'Error',
      message: 'Failed to save changes. Please try again.',
      duration: 5000,
      actions: [
        {
          label: 'Retry',
          onClick: () => console.log('Retrying...'),
          variant: 'primary',
        },
        {
          label: 'Cancel',
          onClick: () => console.log('Cancelled'),
          variant: 'secondary',
        },
      ],
    });
  };

  const showWarningToast = () => {
    showToast({
      type: 'warning',
      title: 'Warning',
      message: 'Your session will expire in 5 minutes.',
      duration: 7000,
      position: 'top-center',
    });
  };

  const showInfoToast = () => {
    showToast({
      type: 'info',
      title: 'New Feature',
      message: 'Check out our new community chat feature!',
      duration: 6000,
      position: 'bottom-right',
      actions: [
        {
          label: 'Learn More',
          onClick: () => window.location.href = '/chat',
          variant: 'primary',
        },
      ],
    });
  };

  const showLoadingToast = () => {
    showToast({
      type: 'loading',
      title: 'Processing',
      message: 'Uploading your files...',
      duration: 0, // Permanent until dismissed
      dismissible: true,
    });
  };

  const showPersistentToast = () => {
    showToast({
      type: 'info',
      title: 'Persistent Message',
      message: 'This notification will stay until you dismiss it.',
      duration: 0,
      position: 'bottom-left',
      dismissible: true,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold gradient-text mb-2">
          Notification System Demo
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Click the buttons below to see different types of notifications and toast messages.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <GlassButton
          variant="primary"
          onClick={showSuccessToast}
          className="w-full"
          leftIcon="✅"
        >
          Success Toast
        </GlassButton>

        <GlassButton
          variant="secondary"
          onClick={showErrorToast}
          className="w-full"
          leftIcon="❌"
        >
          Error Toast
        </GlassButton>

        <GlassButton
          variant="ghost"
          onClick={showWarningToast}
          className="w-full"
          leftIcon="⚠️"
        >
          Warning Toast
        </GlassButton>

        <GlassButton
          variant="primary"
          onClick={showInfoToast}
          className="w-full"
          leftIcon="ℹ️"
        >
          Info Toast
        </GlassButton>

        <GlassButton
          variant="secondary"
          onClick={showLoadingToast}
          className="w-full"
          leftIcon="⏳"
        >
          Loading Toast
        </GlassButton>

        <GlassButton
          variant="ghost"
          onClick={showPersistentToast}
          className="w-full"
          leftIcon="📌"
        >
          Persistent Toast
        </GlassButton>
      </div>

      <div className="mt-8 p-6 bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-xl border border-white/20 dark:border-white/5">
        <h3 className="text-lg font-semibold mb-4 gradient-text">
          Real-time Notifications
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          The notification center in the header shows real-time updates and simulates WebSocket connectivity.
          It includes:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
          <li>Live notification streaming with WebSocket simulation</li>
          <li>Toast notifications with multiple variants and positions</li>
          <li>Sound alerts and browser notifications (with permission)</li>
          <li>Notification history with filtering and search</li>
          <li>Action buttons and interactive content</li>
          <li>Auto-dismiss with hover pause functionality</li>
          <li>Mobile-responsive design with accessibility support</li>
        </ul>
      </div>
    </div>
  );
};