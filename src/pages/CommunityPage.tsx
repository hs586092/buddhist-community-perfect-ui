/**
 * Community Page Component
 * 
 * Full-page community hub interface.
 */

import React from 'react';
import { CommunityHub } from '../components/community';

/**
 * Community Page
 * 
 * Dedicated community page with full-height layout for optimal
 * community browsing experience.
 */
export const CommunityPage: React.FC = () => {
  return (
    <div className="min-h-full">
      <CommunityHub />
    </div>
  );
};