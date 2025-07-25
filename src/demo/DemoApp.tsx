/**
 * Demo Application Component
 * 
 * Demonstrates the Buddhist Community Platform with sample data
 */

import React from 'react'
import { PostFeed } from '../components/post/PostFeed'
import { ProfileCard } from '../components/profile/ProfileCard'
import { ActivityChart } from '../components/profile/ActivityChart'
import { BadgeCollection } from '../components/profile/BadgeCollection'
import { sampleData } from '../data/sampleData'
import type { StatsPeriod } from '../types/profile'

// Sample activity data for charts
const sampleActivityData: StatsPeriod = {
  period: 'month',
  startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  endDate: new Date().toISOString(),
  data: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
    postsCount: Math.floor(Math.random() * 5),
    commentsCount: Math.floor(Math.random() * 8),
    reactionsCount: Math.floor(Math.random() * 12),
    meditationMinutes: Math.floor(Math.random() * 60) + 15,
    eventsCount: Math.floor(Math.random() * 2),
    totalActivity: 0
  })).map(day => ({
    ...day,
    totalActivity: day.postsCount + day.commentsCount + day.reactionsCount + Math.floor(day.meditationMinutes / 10)
  })),
  summary: {
    totalPosts: 42,
    totalComments: 89,
    totalReactions: 156,
    totalMeditation: 1260, // minutes
    totalEvents: 8,
    averageDaily: 12.5,
    peakDay: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    improvement: 15.3
  }
}

export const DemoApp: React.FC = () => {
  const currentUser = sampleData.currentUser
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🪷 Buddhist Community Platform Demo
          </h1>
          <p className="text-lg text-gray-300">
            A comprehensive platform for mindful community connection
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Sidebar - User Profile */}
          <div className="space-y-6">
            <ProfileCard 
              profile={currentUser}
              variant={{
                size: 'detailed',
                showStats: true,
                showBadges: true,
                showActivity: true,
                showActions: false
              }}
              currentUserId={currentUser.id}
            />
            
            <BadgeCollection
              badges={currentUser.badges}
              achievements={currentUser.achievements}
              showProgress={true}
              interactive={true}
            />
          </div>

          {/* Main Content - Post Feed */}
          <div>
            <PostFeed
              posts={sampleData.posts}
              currentUserId={currentUser.id}
              showCreatePost={true}
              onCreatePost={async (content, type, visibility) => {
                console.log('Creating post:', { content, type, visibility })
                // Demo: would normally save to backend
              }}
              onReact={async (postId, reactionType) => {
                console.log('Reacting to post:', postId, reactionType)
                // Demo: would normally save reaction
              }}
              onComment={async (postId, content, parentId) => {
                console.log('Adding comment:', { postId, content, parentId })
                // Demo: would normally save comment
              }}
              onShare={async (postId) => {
                console.log('Sharing post:', postId)
                // Demo: would normally handle sharing
              }}
            />
          </div>

          {/* Right Sidebar - Activity & Stats */}
          <div className="space-y-6">
            <ActivityChart
              data={sampleActivityData}
              onPeriodChange={(period) => {
                console.log('Changing period to:', period)
                // Demo: would normally fetch new data
              }}
            />
            
            <div className="bg-white/5 dark:bg-black/20 rounded-lg border border-white/20 p-4">
              <h3 className="text-lg font-medium text-white mb-4">
                Community Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Active Members</span>
                  <span className="text-white font-medium">1,247</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Posts This Week</span>
                  <span className="text-white font-medium">89</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Meditation Hours</span>
                  <span className="text-white font-medium">2,156</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Upcoming Events</span>
                  <span className="text-white font-medium">12</span>
                </div>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="bg-white/5 dark:bg-black/20 rounded-lg border border-white/20 p-4">
              <h3 className="text-lg font-medium text-white mb-4">
                Recent Activity
              </h3>
              <div className="space-y-3">
                {currentUser.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs">📝</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-200">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(activity.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <footer className="text-center mt-12 text-gray-400">
          <p>Buddhist Community Platform - Demo Version</p>
          <p className="text-sm mt-2">
            Built with React, TypeScript, and mindful design principles
          </p>
        </footer>
      </div>
    </div>
  )
}