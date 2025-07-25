/**
 * Community Hub Component
 * 
 * Central hub for community features with grid layout, search, and filtering.
 * Provides access to groups, events, members, and activities.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GlassCard, GlassInput, GlassButton } from '../ui';
import { cn } from '../../utils/cn';

// Types for community data
interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  imageUrl?: string;
  category: 'meditation' | 'study' | 'practice' | 'discussion' | 'service';
  isPrivate: boolean;
  lastActivity: string;
  tags: string[];
}

interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  attendeeCount: number;
  maxAttendees?: number;
  imageUrl?: string;
  type: 'meditation' | 'teaching' | 'ceremony' | 'community' | 'online';
  isOnline: boolean;
  tags: string[];
}

interface CommunityMember {
  id: string;
  name: string;
  avatar?: string;
  role: 'member' | 'moderator' | 'teacher' | 'administrator';
  joinDate: string;
  lastSeen: string;
  contributions: number;
  specialties: string[];
  isOnline: boolean;
}

interface FilterOptions {
  category?: string;
  type?: string;
  status?: string;
  timeRange?: string;
}

/**
 * Community Hub Component
 * 
 * Main community interface with:
 * - Grid layout for groups, events, and members
 * - Real-time search functionality
 * - Advanced filtering options
 * - Activity feed integration
 * - Mobile-responsive design
 */
export const CommunityHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'groups' | 'events' | 'members' | 'activity'>('groups');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for demonstration
  const [groups] = useState<CommunityGroup[]>([
    {
      id: '1',
      name: 'Daily Meditation Circle',
      description: 'Join us for daily morning meditation sessions and mindfulness practice.',
      memberCount: 48,
      category: 'meditation',
      isPrivate: false,
      lastActivity: '2 hours ago',
      tags: ['meditation', 'morning', 'mindfulness']
    },
    {
      id: '2',
      name: 'Dharma Study Group',
      description: 'Weekly study sessions exploring Buddhist texts and teachings.',
      memberCount: 32,
      category: 'study',
      isPrivate: false,
      lastActivity: '1 day ago',
      tags: ['study', 'dharma', 'texts']
    },
    {
      id: '3',
      name: 'Community Service Team',
      description: 'Organizing volunteer activities and community outreach programs.',
      memberCount: 24,
      category: 'service',
      isPrivate: false,
      lastActivity: '3 hours ago',
      tags: ['service', 'volunteer', 'outreach']
    }
  ]);

  const [events] = useState<CommunityEvent[]>([
    {
      id: '1',
      title: 'Weekend Meditation Retreat',
      description: 'A peaceful two-day retreat focusing on mindfulness and inner peace.',
      date: '2024-02-15',
      time: '09:00',
      location: 'Mountain View Center',
      attendeeCount: 15,
      maxAttendees: 30,
      type: 'meditation',
      isOnline: false,
      tags: ['retreat', 'meditation', 'weekend']
    },
    {
      id: '2',
      title: 'Online Dharma Talk',
      description: 'Monthly dharma talk with visiting teacher on compassion and wisdom.',
      date: '2024-02-20',
      time: '19:00',
      location: 'Online',
      attendeeCount: 67,
      type: 'teaching',
      isOnline: true,
      tags: ['dharma', 'teaching', 'online']
    }
  ]);

  const [members] = useState<CommunityMember[]>([
    {
      id: '1',
      name: 'Sarah Chen',
      role: 'teacher',
      joinDate: '2023-01-15',
      lastSeen: '1 hour ago',
      contributions: 45,
      specialties: ['meditation', 'mindfulness'],
      isOnline: true
    },
    {
      id: '2',
      name: 'Michael Rodriguez',
      role: 'moderator',
      joinDate: '2023-03-22',
      lastSeen: '30 minutes ago',
      contributions: 32,
      specialties: ['dharma study', 'philosophy'],
      isOnline: true
    }
  ]);

  // Filter functions
  const filterGroups = (groups: CommunityGroup[]) => {
    return groups.filter(group => {
      const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           group.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = !filters.category || group.category === filters.category;
      
      return matchesSearch && matchesCategory;
    });
  };

  const filterEvents = (events: CommunityEvent[]) => {
    return events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesType = !filters.type || event.type === filters.type;
      
      return matchesSearch && matchesType;
    });
  };

  const filterMembers = (members: CommunityMember[]) => {
    return members.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           member.specialties.some(specialty => 
                             specialty.toLowerCase().includes(searchQuery.toLowerCase())
                           );
      
      const matchesStatus = !filters.status || 
                            (filters.status === 'online' && member.isOnline) ||
                            (filters.status === 'offline' && !member.isOnline);
      
      return matchesSearch && matchesStatus;
    });
  };

  // Tab content rendering
  const renderTabContent = () => {
    switch (activeTab) {
      case 'groups':
        return (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <GlassButton
                  variant={!filters.category ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setFilters(prev => ({ ...prev, category: undefined }))}
                >
                  All Categories
                </GlassButton>
                <GlassButton
                  variant={filters.category === 'meditation' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setFilters(prev => ({ ...prev, category: 'meditation' }))}
                >
                  Meditation
                </GlassButton>
                <GlassButton
                  variant={filters.category === 'study' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setFilters(prev => ({ ...prev, category: 'study' }))}
                >
                  Study
                </GlassButton>
                <GlassButton
                  variant={filters.category === 'service' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setFilters(prev => ({ ...prev, category: 'service' }))}
                >
                  Service
                </GlassButton>
              </div>
              <GlassButton variant="primary" leftIcon="+" size="sm">
                Create Group
              </GlassButton>
            </div>

            {/* Groups Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterGroups(groups).map(group => (
                <GlassCard key={group.id} variant="strong" padding="md" className="hover:shadow-lg transition-shadow duration-200">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                        {group.name}
                      </h3>
                      <span className={cn(
                        'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                        {
                          'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200': group.category === 'meditation',
                          'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200': group.category === 'study',
                          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': group.category === 'service',
                          'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200': group.category === 'discussion',
                          'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200': group.category === 'practice',
                        }
                      )}>
                        {group.category}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                      {group.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1">
                      {group.tags.map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          👥 {group.memberCount} members
                        </span>
                        <span>•</span>
                        <span>Active {group.lastActivity}</span>
                      </div>
                      {group.isPrivate && (
                        <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                          🔒 Private
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <GlassButton
                        as={Link}
                        to={`/community/groups/${group.id}`}
                        variant="primary"
                        size="sm"
                        className="flex-1"
                      >
                        View Group
                      </GlassButton>
                      <GlassButton
                        variant="secondary"
                        size="sm"
                        onClick={() => console.log('Join group:', group.id)}
                      >
                        Join
                      </GlassButton>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        );

      case 'events':
        return (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <GlassButton
                  variant={!filters.type ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setFilters(prev => ({ ...prev, type: undefined }))}
                >
                  All Events
                </GlassButton>
                <GlassButton
                  variant={filters.type === 'meditation' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setFilters(prev => ({ ...prev, type: 'meditation' }))}
                >
                  Meditation
                </GlassButton>
                <GlassButton
                  variant={filters.type === 'teaching' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setFilters(prev => ({ ...prev, type: 'teaching' }))}
                >
                  Teaching
                </GlassButton>
                <GlassButton
                  variant={filters.type === 'online' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setFilters(prev => ({ ...prev, type: 'online' }))}
                >
                  Online
                </GlassButton>
              </div>
              <GlassButton variant="primary" leftIcon="+" size="sm">
                Create Event
              </GlassButton>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterEvents(events).map(event => (
                <GlassCard key={event.id} variant="strong" padding="md" className="hover:shadow-lg transition-shadow duration-200">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                        {event.title}
                      </h3>
                      <span className={cn(
                        'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                        {
                          'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200': event.type === 'meditation',
                          'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200': event.type === 'teaching',
                          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': event.type === 'online',
                          'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200': event.type === 'ceremony',
                          'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200': event.type === 'community',
                        }
                      )}>
                        {event.type}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                      {event.description}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span>📅</span>
                        <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span>{event.isOnline ? '💻' : '📍'}</span>
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span>👥</span>
                        <span>
                          {event.attendeeCount} attending
                          {event.maxAttendees && ` / ${event.maxAttendees} max`}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {event.tags.map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <GlassButton
                        as={Link}
                        to={`/community/events/${event.id}`}
                        variant="primary"
                        size="sm"
                        className="flex-1"
                      >
                        View Details
                      </GlassButton>
                      <GlassButton
                        variant="secondary"
                        size="sm"
                        onClick={() => console.log('RSVP event:', event.id)}
                      >
                        RSVP
                      </GlassButton>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        );

      case 'members':
        return (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <GlassButton
                  variant={!filters.status ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setFilters(prev => ({ ...prev, status: undefined }))}
                >
                  All Members
                </GlassButton>
                <GlassButton
                  variant={filters.status === 'online' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setFilters(prev => ({ ...prev, status: 'online' }))}
                >
                  Online
                </GlassButton>
                <GlassButton
                  variant={filters.status === 'offline' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setFilters(prev => ({ ...prev, status: 'offline' }))}
                >
                  Offline
                </GlassButton>
              </div>
            </div>

            {/* Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filterMembers(members).map(member => (
                <GlassCard key={member.id} variant="strong" padding="md" className="hover:shadow-lg transition-shadow duration-200">
                  <div className="space-y-4 text-center">
                    <div className="relative mx-auto w-16 h-16">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      {member.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {member.name}
                      </h3>
                      <span className={cn(
                        'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize',
                        {
                          'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200': member.role === 'teacher',
                          'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200': member.role === 'moderator',
                          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': member.role === 'member',
                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': member.role === 'administrator',
                        }
                      )}>
                        {member.role}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div>Joined {new Date(member.joinDate).toLocaleDateString()}</div>
                      <div>Last seen: {member.lastSeen}</div>
                      <div>{member.contributions} contributions</div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 justify-center">
                      {member.specialties.map(specialty => (
                        <span
                          key={specialty}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <GlassButton
                        as={Link}
                        to={`/community/members/${member.id}`}
                        variant="primary"
                        size="sm"
                        className="flex-1"
                      >
                        View Profile
                      </GlassButton>
                      <GlassButton
                        variant="secondary"
                        size="sm"
                        onClick={() => console.log('Message member:', member.id)}
                      >
                        Message
                      </GlassButton>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        );

      case 'activity':
        return (
          <div className="space-y-6">
            <GlassCard variant="strong" padding="lg">
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📈</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Activity Feed
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Community activity feed is coming soon! This will show recent posts, comments, and member interactions.
                </p>
              </div>
            </GlassCard>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Community Hub</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Connect with fellow practitioners, join groups, and participate in events
          </p>
        </div>
      </div>

      {/* Search and Tabs */}
      <GlassCard variant="strong" padding="lg">
        <div className="space-y-6">
          {/* Search */}
          <div className="max-w-md">
            <GlassInput
              type="text"
              placeholder="Search groups, events, members..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              leftIcon="🔍"
              variant="glass"
              className="w-full"
            />
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-white/20 dark:border-white/5">
            {([
              { key: 'groups', label: 'Groups', icon: '👥' },
              { key: 'events', label: 'Events', icon: '📅' },
              { key: 'members', label: 'Members', icon: '🧑‍🤝‍🧑' },
              { key: 'activity', label: 'Activity', icon: '📈' },
            ] as const).map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200',
                  'border-b-2 -mb-px',
                  activeTab === key
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 border-primary-500'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border-transparent hover:bg-white/10 dark:hover:bg-white/5'
                )}
              >
                <span>{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Tab Content */}
      <div>
        {renderTabContent()}
      </div>
    </div>
  );
};