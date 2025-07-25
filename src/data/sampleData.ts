/**
 * Sample Data for Production Demo
 * 
 * Comprehensive sample data for Buddhist Community Platform
 * with realistic content for demonstration purposes
 */

import type { Post, PostType, PostVisibility, ReactionType } from '../types/post'
import type { UserProfile, UserRole, ActivityType, BadgeType } from '../types/profile'

// Sample Users
export const sampleUsers: UserProfile[] = [
  {
    id: '1',
    username: 'mindful_sarah',
    displayName: 'Sarah Chen',
    email: 'sarah@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=200&fit=crop',
    bio: 'Buddhist practitioner for 15 years. Teaching mindfulness and meditation in San Francisco. 🧘‍♀️ Always learning on the path of compassion.',
    location: 'San Francisco, CA',
    website: 'https://mindfulnessjourney.com',
    spiritualName: 'Dharma Mitra',
    tradition: 'Zen Buddhism',
    meditationExperience: 15,
    favoriteTeachings: ['Heart Sutra', 'Tao Te Ching', 'Dhammapada'],
    practiceGoals: ['Daily meditation', 'Mindful living', 'Compassionate action'],
    role: UserRole.TEACHER,
    isVerified: true,
    joinedAt: '2022-01-15T00:00:00Z',
    lastActiveAt: new Date().toISOString(),
    stats: {
      postsCount: 142,
      commentsCount: 389,
      reactionsGiven: 567,
      reactionsReceived: 892,
      meditationMinutes: 18750, // ~312 hours
      teachingsShared: 28,
      eventsAttended: 45,
      groupsJoined: 12,
      helpfulVotes: 234,
      streakDays: 89
    },
    followersCount: 1247,
    followingCount: 89,
    friendsCount: 45,
    privacySettings: {
      profileVisibility: 'public',
      activityVisibility: 'public',
      statisticsVisibility: 'public',
      contactInfoVisibility: 'friends',
      showOnlineStatus: true,
      allowDirectMessages: true,
      allowFollows: true
    },
    badges: [
      {
        id: 'b1',
        type: BadgeType.TEACHING_GURU,
        name: 'Teaching Guru',
        description: 'Shared wisdom with 50+ community posts',
        icon: '📚',
        color: '#F59E0B',
        earnedAt: '2023-06-15T00:00:00Z',
        isVisible: true,
        requirements: [
          { type: 'posts', count: 50, description: 'Create 50 teaching posts' }
        ]
      },
      {
        id: 'b2',
        type: BadgeType.MEDITATION_MASTER,
        name: 'Meditation Master',
        description: 'Completed 300+ hours of meditation',
        icon: '🧘',
        color: '#8B5CF6',
        earnedAt: '2023-09-22T00:00:00Z',
        isVisible: true
      }
    ],
    achievements: [
      {
        id: 'a1',
        title: 'Wisdom Keeper',
        description: 'Share 100 inspiring posts with the community',
        icon: '🌟',
        category: 'teaching',
        progress: 142,
        target: 100,
        completedAt: '2023-08-10T00:00:00Z',
        isVisible: true
      }
    ],
    recentActivity: [
      {
        id: 'act1',
        type: ActivityType.POST_CREATED,
        title: 'Shared a teaching about mindful breathing',
        description: 'Posted: "The Art of Conscious Breathing"',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        isPublic: true
      }
    ],
    contributionLevel: 94,
    reputation: 2847,
    preferences: {
      theme: 'auto',
      language: 'en',
      timezone: 'America/Los_Angeles',
      notifications: {
        email: true,
        push: true,
        inApp: true,
        newFollower: true,
        postReaction: true,
        commentReply: true,
        eventReminder: true,
        groupActivity: false,
        teachingUpdate: true,
        meditationReminder: true
      },
      meditation: {
        defaultDuration: 20,
        reminderTime: '07:00',
        reminderDays: [1, 2, 3, 4, 5, 6, 0],
        soundTheme: 'singing_bowl',
        backgroundMusic: true
      },
      accessibility: {
        fontSize: 'medium',
        highContrast: false,
        reduceMotion: false,
        screenReader: false,
        keyboardNavigation: false
      }
    },
    isOnline: true,
    currentStatus: {
      text: 'In meditation retreat 🧘‍♀️',
      emoji: '🧘‍♀️',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      isCustom: true
    }
  },
  {
    id: '2',
    username: 'zen_walker',
    displayName: 'Michael Torres',
    email: 'michael@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    bio: 'Walking the Middle Path. Software engineer by day, dharma student always. Finding peace in the present moment.',
    location: 'Portland, OR',
    spiritualName: 'Bodhi Sattva',
    tradition: 'Theravada Buddhism',
    meditationExperience: 8,
    favoriteTeachings: ['Four Noble Truths', 'Noble Eightfold Path'],
    practiceGoals: ['Right mindfulness', 'Loving kindness practice'],
    role: UserRole.MEMBER,
    isVerified: false,
    joinedAt: '2022-08-20T00:00:00Z',
    lastActiveAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 min ago
    stats: {
      postsCount: 67,
      commentsCount: 145,
      reactionsGiven: 234,
      reactionsReceived: 189,
      meditationMinutes: 9600, // 160 hours
      teachingsShared: 5,
      eventsAttended: 23,
      groupsJoined: 8,
      helpfulVotes: 78,
      streakDays: 42
    },
    followersCount: 234,
    followingCount: 156,
    friendsCount: 18,
    privacySettings: {
      profileVisibility: 'public',
      activityVisibility: 'friends',
      statisticsVisibility: 'public',
      contactInfoVisibility: 'private',
      showOnlineStatus: true,
      allowDirectMessages: true,
      allowFollows: true
    },
    badges: [
      {
        id: 'b3',
        type: BadgeType.ACTIVE_MEMBER,
        name: 'Active Member',
        description: 'Contributed consistently for 6 months',
        icon: '⭐',
        color: '#F59E0B',
        earnedAt: '2023-03-15T00:00:00Z',
        isVisible: true
      }
    ],
    achievements: [],
    recentActivity: [],
    contributionLevel: 67,
    reputation: 1456,
    preferences: {
      theme: 'dark',
      language: 'en',
      timezone: 'America/Los_Angeles',
      notifications: {
        email: false,
        push: true,
        inApp: true,
        newFollower: true,
        postReaction: false,
        commentReply: true,
        eventReminder: true,
        groupActivity: true,
        teachingUpdate: true,
        meditationReminder: false
      },
      meditation: {
        defaultDuration: 15,
        soundTheme: 'nature',
        backgroundMusic: false
      },
      accessibility: {
        fontSize: 'medium',
        highContrast: false,
        reduceMotion: false,
        screenReader: false,
        keyboardNavigation: false
      }
    },
    isOnline: true
  },
  {
    id: '3',
    username: 'lotus_bloom',
    displayName: 'Emma Watson',
    email: 'emma@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    bio: 'New to Buddhism, eager to learn. Finding solace in meditation and community support. 🪷',
    location: 'Austin, TX',
    tradition: 'Insight Meditation',
    meditationExperience: 1,
    practiceGoals: ['Daily meditation', 'Study Buddhist texts'],
    role: UserRole.MEMBER,
    isVerified: false,
    joinedAt: '2023-11-01T00:00:00Z',
    lastActiveAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    stats: {
      postsCount: 12,
      commentsCount: 34,
      reactionsGiven: 89,
      reactionsReceived: 45,
      meditationMinutes: 720, // 12 hours
      teachingsShared: 0,
      eventsAttended: 3,
      groupsJoined: 4,
      helpfulVotes: 8,
      streakDays: 15
    },
    followersCount: 23,
    followingCount: 67,
    friendsCount: 5,
    privacySettings: {
      profileVisibility: 'public',
      activityVisibility: 'public',
      statisticsVisibility: 'friends',
      contactInfoVisibility: 'private',
      showOnlineStatus: false,
      allowDirectMessages: true,
      allowFollows: true
    },
    badges: [
      {
        id: 'b4',
        type: BadgeType.NEWCOMER,
        name: 'Newcomer',
        description: 'Welcome to the community!',
        icon: '🌱',
        color: '#10B981',
        earnedAt: '2023-11-01T00:00:00Z',
        isVisible: true
      }
    ],
    achievements: [],
    recentActivity: [],
    contributionLevel: 23,
    reputation: 156,
    preferences: {
      theme: 'light',
      language: 'en',
      timezone: 'America/Chicago',
      notifications: {
        email: true,
        push: true,
        inApp: true,
        newFollower: true,
        postReaction: true,
        commentReply: true,
        eventReminder: true,
        groupActivity: true,
        teachingUpdate: true,
        meditationReminder: true
      },
      meditation: {
        defaultDuration: 10,
        reminderTime: '06:30',
        reminderDays: [1, 3, 5],
        soundTheme: 'bell',
        backgroundMusic: true
      },
      accessibility: {
        fontSize: 'large',
        highContrast: false,
        reduceMotion: false,
        screenReader: false,
        keyboardNavigation: true
      }
    },
    isOnline: false
  }
]

// Sample Posts
export const samplePosts: Post[] = [
  {
    id: 'p1',
    type: PostType.TEXT,
    content: {
      html: '<p>Just finished a beautiful morning meditation session overlooking the Golden Gate Bridge. 🌅</p><p>There\'s something profound about watching the sunrise while sitting in stillness. The way the light gradually illuminates the world mirrors how awareness slowly brightens our understanding.</p><p>As the Buddha taught: <em>"Three things cannot be long hidden: the sun, the moon, and the truth."</em></p><p>What moments of natural beauty have deepened your practice recently? 🧘‍♀️ #MorningMeditation #Mindfulness #SanFrancisco</p>',
      text: 'Just finished a beautiful morning meditation session overlooking the Golden Gate Bridge. 🌅\n\nThere\'s something profound about watching the sunrise while sitting in stillness. The way the light gradually illuminates the world mirrors how awareness slowly brightens our understanding.\n\nAs the Buddha taught: "Three things cannot be long hidden: the sun, the moon, and the truth."\n\nWhat moments of natural beauty have deepened your practice recently? 🧘‍♀️ #MorningMeditation #Mindfulness #SanFrancisco',
      wordCount: 67,
      characterCount: 412,
      mentions: [],
      hashtags: ['MorningMeditation', 'Mindfulness', 'SanFrancisco']
    },
    author: {
      id: '1',
      name: 'Sarah Chen',
      username: 'mindful_sarah',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      role: 'Teacher',
      isVerified: true
    },
    visibility: PostVisibility.PUBLIC,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    stats: {
      likes: 34,
      comments: 8,
      shares: 5,
      views: 156,
      reactions: {
        like: 12,
        love: 8,
        gratitude: 10,
        wisdom: 3,
        peace: 1,
        compassion: 0
      }
    },
    reactions: [
      {
        id: 'r1',
        type: ReactionType.GRATITUDE,
        userId: '2',
        userName: 'Michael Torres',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      }
    ],
    comments: [
      {
        id: 'c1',
        postId: 'p1',
        content: 'Thank you for this beautiful reflection, Sarah. Your words always bring such clarity and peace to my day. 🙏',
        author: {
          id: '2',
          name: 'Michael Torres',
          username: 'zen_walker',
          role: 'Member'
        },
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isEdited: false,
        likes: 5,
        reactions: [],
        replies: [
          {
            id: 'c2',
            postId: 'p1',
            parentId: 'c1',
            content: 'So grateful we can share this journey together, Michael. Your practice inspires me too! ❤️',
            author: {
              id: '1',
              name: 'Sarah Chen',
              username: 'mindful_sarah',
              role: 'Teacher'
            },
            createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
            isEdited: false,
            likes: 3,
            reactions: [],
            replies: [],
            isHidden: false,
            reportCount: 0
          }
        ],
        isHidden: false,
        reportCount: 0
      }
    ],
    isEdited: false,
    isPinned: false,
    isArchived: false,
    tags: ['meditation', 'mindfulness', 'morning-practice', 'nature'],
    category: 'Practice Sharing'
  },
  {
    id: 'p2',
    type: PostType.TEXT,
    content: {
      html: '<p>Today marks my 42-day meditation streak! 🎉</p><p>Some days were easier than others, but I\'ve learned that consistency matters more than perfection. Even just 5 minutes of mindfulness can transform your entire day.</p><p>For anyone starting their meditation journey, here are a few things that helped me:</p><ul><li>Start small - even 2 minutes counts</li><li>Same time, same place builds habit</li><li>Be gentle with yourself on difficult days</li><li>Focus on the breath when mind wanders</li></ul><p>What\'s your longest meditation streak? Any tips to share? 🧘‍♂️</p>',
      text: 'Today marks my 42-day meditation streak! 🎉\n\nSome days were easier than others, but I\'ve learned that consistency matters more than perfection. Even just 5 minutes of mindfulness can transform your entire day.\n\nFor anyone starting their meditation journey, here are a few things that helped me:\n\n• Start small - even 2 minutes counts\n• Same time, same place builds habit\n• Be gentle with yourself on difficult days\n• Focus on the breath when mind wanders\n\nWhat\'s your longest meditation streak? Any tips to share? 🧘‍♂️',
      wordCount: 89,
      characterCount: 467,
      mentions: [],
      hashtags: []
    },
    author: {
      id: '2',
      name: 'Michael Torres',
      username: 'zen_walker',
      role: 'Member'
    },
    visibility: PostVisibility.PUBLIC,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    stats: {
      likes: 28,
      comments: 12,
      shares: 3,
      views: 89,
      reactions: {
        like: 15,
        love: 4,
        gratitude: 7,
        wisdom: 2,
        peace: 0,
        compassion: 0
      }
    },
    reactions: [],
    comments: [],
    isEdited: false,
    isPinned: false,
    isArchived: false,
    tags: ['streak', 'consistency', 'beginner-tips', 'motivation'],
    category: 'Personal Journey'
  },
  {
    id: 'p3',
    type: PostType.TEACHING,
    content: {
      html: '<h3>The Four Noble Truths: A Beginner\'s Guide</h3><p>As someone new to Buddhism, I wanted to share what I\'ve learned about the Four Noble Truths in simple terms:</p><ol><li><strong>Life contains suffering (Dukkha)</strong> - We all experience pain, loss, and dissatisfaction</li><li><strong>Suffering has a cause</strong> - Our attachment and craving lead to suffering</li><li><strong>Suffering can end</strong> - There is hope! Enlightenment is possible</li><li><strong>There\'s a path to end suffering</strong> - The Noble Eightfold Path shows us how</li></ol><p>This teaching has been so comforting to me. It doesn\'t promise life will be easy, but it offers a way forward. 💙</p><p>What Buddhist teaching has resonated most with you in your journey?</p>',
      text: 'The Four Noble Truths: A Beginner\'s Guide\n\nAs someone new to Buddhism, I wanted to share what I\'ve learned about the Four Noble Truths in simple terms:\n\n1. Life contains suffering (Dukkha) - We all experience pain, loss, and dissatisfaction\n2. Suffering has a cause - Our attachment and craving lead to suffering  \n3. Suffering can end - There is hope! Enlightenment is possible\n4. There\'s a path to end suffering - The Noble Eightfold Path shows us how\n\nThis teaching has been so comforting to me. It doesn\'t promise life will be easy, but it offers a way forward. 💙\n\nWhat Buddhist teaching has resonated most with you in your journey?',
      wordCount: 112,
      characterCount: 678,
      mentions: [],
      hashtags: []
    },
    author: {
      id: '3',
      name: 'Emma Watson',
      username: 'lotus_bloom',
      role: 'Member'
    },
    visibility: PostVisibility.PUBLIC,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    stats: {
      likes: 45,
      comments: 18,
      shares: 8,
      views: 234,
      reactions: {
        like: 12,
        love: 8,
        gratitude: 15,
        wisdom: 9,
        peace: 1,
        compassion: 0
      }
    },
    reactions: [],
    comments: [],
    isEdited: false,
    isPinned: true,
    isArchived: false,
    tags: ['four-noble-truths', 'beginner', 'teachings', 'dharma'],
    category: 'Buddhist Teachings'
  }
]

// Export everything
export const sampleData = {
  users: sampleUsers,
  posts: samplePosts,
  currentUser: sampleUsers[0] // Sarah Chen as current user for demo
}