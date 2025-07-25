/**
 * Chat Page Component
 * 
 * Full-page chat interface for real-time community conversations.
 */

import React from 'react';
import { ChatSystem } from '../components/chat';

/**
 * Chat Page
 * 
 * Dedicated chat page with full-height layout for optimal
 * chat experience and real-time messaging.
 */
export const ChatPage: React.FC = () => {
  return (
    <div className="h-full min-h-[calc(100vh-4rem)] flex flex-col">
      <ChatSystem />
    </div>
  );
};