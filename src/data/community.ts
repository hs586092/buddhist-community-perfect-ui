// 💬 불자 소통 커뮤니티 샘플 데이터

import { User, Message, Topic, ChatRoom } from '../types/community';

export const users: User[] = [
  {
    id: 'user1',
    nickname: '지혜를찾는자',
    avatar: '📿',
    level: '초심자',
    joinDate: '2024-01-01',
    isOnline: true
  },
  {
    id: 'user2',
    nickname: '명상의달인',
    avatar: '🕉️',
    level: '오랜 신자',
    joinDate: '2023-06-15',
    isOnline: true
  },
  {
    id: 'user3',
    nickname: '평화로운마음',
    avatar: '🧘‍♀️',
    level: '수행자',
    joinDate: '2023-11-20',
    isOnline: false
  },
  {
    id: 'user4',
    nickname: '차명상수행자',
    avatar: '🍵',
    level: '오랜 신자',
    joinDate: '2023-03-10',
    isOnline: true
  },
  {
    id: 'user5',
    nickname: '연꽃길',
    avatar: '🪷',
    level: '수행자',
    joinDate: '2024-01-10',
    isOnline: true
  },
  {
    id: 'user6',
    nickname: '선방나그네',
    avatar: '🏔️',
    level: '수행자',
    joinDate: '2023-08-05',
    isOnline: false
  }
];

export const topics: Topic[] = [
  {
    id: 'general',
    title: '자유로운 대화',
    description: '불자들의 일상 이야기와 자유로운 소통',
    emoji: '💬',
    color: 'bg-blue-100 text-blue-800',
    messageCount: 245,
    onlineUsers: 12,
    lastActivity: '방금 전'
  },
  {
    id: 'meditation',
    title: '명상과 수행',
    description: '명상 경험과 수행 방법을 나누는 공간',
    emoji: '🧘‍♀️',
    color: 'bg-purple-100 text-purple-800',
    messageCount: 156,
    onlineUsers: 8,
    lastActivity: '2분 전'
  },
  {
    id: 'dharma',
    title: '법문과 가르침',
    description: '부처님의 가르침과 법문에 대한 토론',
    emoji: '📿',
    color: 'bg-amber-100 text-amber-800',
    messageCount: 89,
    onlineUsers: 5,
    lastActivity: '5분 전'
  },
  {
    id: 'temple-life',
    title: '사찰 생활',
    description: '템플스테이, 법회 참여 경험 공유',
    emoji: '🏛️',
    color: 'bg-green-100 text-green-800',
    messageCount: 67,
    onlineUsers: 3,
    lastActivity: '10분 전'
  },
  {
    id: 'daily-wisdom',
    title: '일상의 지혜',
    description: '불교적 관점에서 바라본 일상 이야기',
    emoji: '🌸',
    color: 'bg-pink-100 text-pink-800',
    messageCount: 123,
    onlineUsers: 7,
    lastActivity: '1분 전'
  }
];

export const messages: Message[] = [
  {
    id: 'msg1',
    author: users[0],
    content: '오늘 처음 명상을 시작해보려는데, 어떤 방법이 좋을까요?',
    timestamp: '2024-01-25T10:30:00Z',
    type: 'text',
    reactions: [
      {
        emoji: '🙏',
        count: 3,
        users: ['user2', 'user4', 'user5']
      }
    ]
  },
  {
    id: 'msg2',
    author: users[1],
    content: '호흡에 집중하는 것부터 시작해보세요. 코로 들이쉬고 입으로 내쉬면서, 그 과정을 관찰하는 것이 좋습니다. 처음에는 5분부터 시작하세요.',
    timestamp: '2024-01-25T10:31:00Z',
    type: 'text',
    replyTo: 'msg1',
    reactions: [
      {
        emoji: '👍',
        count: 5,
        users: ['user1', 'user3', 'user4', 'user5', 'user6']
      },
      {
        emoji: '🙏',
        count: 2,
        users: ['user1', 'user3']
      }
    ]
  },
  {
    id: 'msg3',
    author: users[4],
    content: '저도 처음에는 정말 어려웠는데, 매일 조금씩 하다 보니 마음이 많이 평온해졌어요. 포기하지 마시고 꾸준히 해보세요! 🪷',
    timestamp: '2024-01-25T10:32:00Z',
    type: 'text',
    reactions: [
      {
        emoji: '💪',
        count: 4,
        users: ['user1', 'user2', 'user3', 'user6']
      }
    ]
  },
  {
    id: 'msg4',
    author: users[3],
    content: '차명상도 좋은 방법이에요. 차 한 잔을 우리고 마시는 과정에서 현재 순간에 집중할 수 있습니다. 차의 향, 맛, 따뜻함을 느끼면서 마음을 비우는 연습을 해보세요.',
    timestamp: '2024-01-25T10:35:00Z',
    type: 'text',
    reactions: [
      {
        emoji: '🍵',
        count: 6,
        users: ['user1', 'user2', 'user4', 'user5', 'user6']
      },
      {
        emoji: '😌',
        count: 3,
        users: ['user1', 'user2', 'user5']
      }
    ]
  },
  {
    id: 'msg5',
    author: users[2],
    content: '오늘 조계사에서 새벽예불에 참여했는데, 정말 마음이 깨끗해지는 느낌이었어요. 도심 속에서도 이런 평온함을 느낄 수 있다니 감사합니다.',
    timestamp: '2024-01-25T10:40:00Z',
    type: 'text',
    reactions: [
      {
        emoji: '🙏',
        count: 8,
        users: ['user1', 'user2', 'user3', 'user4', 'user5', 'user6']
      },
      {
        emoji: '✨',
        count: 4,
        users: ['user1', 'user3', 'user4', 'user6']
      }
    ]
  },
  {
    id: 'msg6',
    author: users[5],
    content: '좋은 경험이셨네요. 저는 어제 해인사에서 템플스테이를 마쳤는데, 자연 속에서 하는 수행이 정말 특별했습니다. 팔만대장경의 역사도 배우고, 스님들의 지혜로운 말씀도 들을 수 있어서 소중한 시간이었어요.',
    timestamp: '2024-01-25T10:42:00Z',
    type: 'text',
    reactions: [
      {
        emoji: '🏔️',
        count: 5,
        users: ['user1', 'user2', 'user3', 'user4', 'user5']
      },
      {
        emoji: '📚',
        count: 3,
        users: ['user2', 'user3', 'user4']
      }
    ]
  },
  {
    id: 'msg7',
    author: users[1],
    content: '"마음이 평온하면 세상도 평온하다" - 오늘의 법문에서 들은 말씀입니다. 간단한 말이지만 정말 깊은 의미가 있는 것 같아요.',
    timestamp: '2024-01-25T10:45:00Z',
    type: 'text',
    reactions: [
      {
        emoji: '💭',
        count: 7,
        users: ['user1', 'user2', 'user3', 'user4', 'user5', 'user6']
      },
      {
        emoji: '🧘‍♀️',
        count: 4,
        users: ['user1', 'user3', 'user5', 'user6']
      }
    ]
  },
  {
    id: 'msg8',
    author: users[0],
    content: '모든 분들께 감사드려요! 덕분에 명상에 대해 많이 배웠습니다. 오늘 저녁부터 5분씩 시작해보겠습니다. 🙏',
    timestamp: '2024-01-25T10:50:00Z',
    type: 'text',
    reactions: [
      {
        emoji: '👏',
        count: 6,
        users: ['user2', 'user3', 'user4', 'user5', 'user6']
      },
      {
        emoji: '💪',
        count: 4,
        users: ['user2', 'user4', 'user5', 'user6']
      }
    ]
  }
];

export const chatRooms: ChatRoom[] = [
  {
    id: 'general-room',
    topic: topics[0],
    messages: messages,
    onlineUsers: users.filter(u => u.isOnline),
    isActive: true
  }
];

// 현재 로그인한 사용자 (시뮬레이션)
export const currentUser: User = {
  id: 'current-user',
  nickname: '새로운불자',
  avatar: '🌟',
  level: '초심자',
  joinDate: '2024-01-25',
  isOnline: true
};