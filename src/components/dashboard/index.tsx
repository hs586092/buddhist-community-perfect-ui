/**
 * Dashboard Components Barrel Exports
 */

import React from 'react';

export { DharmaQuoteWidget } from './DharmaQuoteWidget';
export { MeditationStreakWidget } from './MeditationStreakWidget';
export { QuickActionsWidget } from './QuickActionsWidget';
export { WelcomeHeader } from './WelcomeHeader';

// Stub exports for components not yet implemented
export const EventsCarouselWidget: React.FC<any> = () => (
  <div className="bg-surface rounded-2xl p-6 border border-outline/20 shadow-lg">
    <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--md-sys-color-on-surface)' }}>
      📅 Upcoming Events
    </h3>
    <p className="text-sm opacity-75" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
      Events carousel coming soon...
    </p>
  </div>
);

export const ActivityFeedWidget: React.FC<any> = () => (
  <div className="bg-surface rounded-2xl p-6 border border-outline/20 shadow-lg">
    <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--md-sys-color-on-surface)' }}>
      👥 Community Activity
    </h3>
    <p className="text-sm opacity-75" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
      Activity feed coming soon...
    </p>
  </div>
);

export const ProgressChartWidget: React.FC<any> = () => (
  <div className="bg-surface rounded-2xl p-6 border border-outline/20 shadow-lg">
    <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--md-sys-color-on-surface)' }}>
      📊 Practice Progress
    </h3>
    <p className="text-sm opacity-75" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
      Progress charts coming soon...
    </p>
  </div>
);

export const AchievementsWidget: React.FC<any> = () => (
  <div className="bg-surface rounded-2xl p-6 border border-outline/20 shadow-lg">
    <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--md-sys-color-on-surface)' }}>
      🏆 Recent Achievements
    </h3>
    <p className="text-sm opacity-75" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
      Achievements coming soon...
    </p>
  </div>
);
