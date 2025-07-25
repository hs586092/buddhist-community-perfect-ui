// 🏛️ 한국 주요 사찰 샘플 데이터

import { Temple, DharmaSession, Review } from '../types/temple';

export const temples: Temple[] = [
  {
    id: 'jogyesa',
    name: '조계사',
    location: {
      address: '서울특별시 종로구 우정국로 55',
      city: '서울',
      district: '종로구',
      coordinates: { lat: 37.5734, lng: 126.9828 }
    },
    description: '조계종 총본산으로 도심 속 불교 문화의 중심지입니다.',
    sect: '조계종',
    established: 1395,
    mainBuddha: '석가모니불',
    contact: {
      phone: '02-768-8600',
      website: 'https://www.jogyesa.kr',
      email: 'info@jogyesa.kr'
    },
    facilities: ['대웅전', '극락전', '설법전', '템플스테이관', '카페'],
    rating: {
      average: 4.8,
      count: 156
    },
    images: [
      '/images/temples/jogyesa-main.jpg',
      '/images/temples/jogyesa-hall.jpg'
    ],
    services: {
      dharmaHall: true,
      templestay: true,
      meditation: true,
      ceremony: true,
      education: true
    }
  },
  {
    id: 'bulguksa',
    name: '불국사',
    location: {
      address: '경상북도 경주시 불국로 385',
      city: '경주',
      district: '경주시',
      coordinates: { lat: 35.7900, lng: 129.3320 }
    },
    description: '유네스코 세계문화유산으로 신라 불교 예술의 걸작입니다.',
    sect: '조계종',
    established: 751,
    mainBuddha: '석가모니불',
    contact: {
      phone: '054-746-9913',
      website: 'http://www.bulguksa.or.kr',
    },
    facilities: ['대웅전', '극락전', '비로전', '관음전', '문화재관'],
    rating: {
      average: 4.9,
      count: 243
    },
    images: [
      '/images/temples/bulguksa-main.jpg',
      '/images/temples/bulguksa-pagoda.jpg'
    ],
    services: {
      dharmaHall: true,
      templestay: false,
      meditation: true,
      ceremony: true,
      education: true
    }
  },
  {
    id: 'haeinsa',
    name: '해인사',
    location: {
      address: '경상남도 합천군 가야산면 해인사길 122',
      city: '합천',
      district: '가야산면',
      coordinates: { lat: 35.8014, lng: 128.0981 }
    },
    description: '팔만대장경이 보관된 법보사찰로 가야산에 위치한 고찰입니다.',
    sect: '조계종',
    established: 802,
    mainBuddha: '비로자나불',
    contact: {
      phone: '055-934-3000',
      website: 'http://www.haeinsa.or.kr',
    },
    facilities: ['대적광전', '장경판전', '명부전', '템플스테이관', '박물관'],
    rating: {
      average: 4.7,
      count: 189
    },
    images: [
      '/images/temples/haeinsa-main.jpg',
      '/images/temples/haeinsa-tripitaka.jpg'
    ],
    services: {
      dharmaHall: true,
      templestay: true,
      meditation: true,
      ceremony: true,
      education: true
    }
  },
  {
    id: 'bongeunsa',
    name: '봉은사',
    location: {
      address: '서울특별시 강남구 봉은사로 531',
      city: '서울',
      district: '강남구',
      coordinates: { lat: 37.5153, lng: 127.0570 }
    },
    description: '강남 도심 속 천년고찰로 현대적 수행공간을 제공합니다.',
    sect: '조계종',
    established: 794,
    mainBuddha: '미륵불',
    contact: {
      phone: '02-3218-4800',
      website: 'http://www.bongeunsa.org',
    },
    facilities: ['대웅전', '미륵대불', '판전', '명상센터', '카페'],
    rating: {
      average: 4.6,
      count: 124
    },
    images: [
      '/images/temples/bongeunsa-main.jpg',
      '/images/temples/bongeunsa-maitreya.jpg'
    ],
    services: {
      dharmaHall: true,
      templestay: true,
      meditation: true,
      ceremony: true,
      education: true
    }
  }
];

export const dharmaSessions: DharmaSession[] = [
  {
    id: 'jogyesa-morning-prayer',
    templeId: 'jogyesa',
    title: '새벽예불',
    type: '예불',
    schedule: {
      dayOfWeek: ['월', '화', '수', '목', '금', '토', '일'],
      time: '04:00',
      duration: 60
    },
    description: '매일 새벽 4시에 진행되는 예불입니다. 누구나 참여 가능합니다.',
    teacher: '주지스님',
    capacity: 100,
    cost: 0
  },
  {
    id: 'jogyesa-dharma-talk',
    templeId: 'jogyesa',
    title: '정기법회',
    type: '법회',
    schedule: {
      dayOfWeek: ['일'],
      time: '14:00',
      duration: 120
    },
    description: '매주 일요일 오후 2시 정기법회입니다.',
    teacher: '법륜스님',
    capacity: 200,
    cost: 0
  },
  {
    id: 'bongeunsa-meditation',
    templeId: 'bongeunsa',
    title: '도심 속 명상',
    type: '선원',
    schedule: {
      dayOfWeek: ['수', '토'],
      time: '19:00',
      duration: 90
    },
    description: '직장인들을 위한 저녁 명상 프로그램입니다.',
    teacher: '혜민스님',
    capacity: 50,
    cost: 0,
    requirements: ['편안한 복장', '양말 착용']
  },
  {
    id: 'haeinsa-templestay',
    templeId: 'haeinsa',
    title: '가야산 템플스테이',
    type: '템플스테이',
    schedule: {
      dayOfWeek: ['토', '일'],
      time: '14:00',
      duration: 1440 // 24 hours
    },
    description: '1박 2일 템플스테이 프로그램입니다.',
    teacher: '현각스님',
    capacity: 30,
    cost: 50000,
    requirements: ['사전예약 필수', '개인 세면도구', '편안한 복장']
  }
];

export const reviews: Review[] = [
  {
    id: 'review-1',
    templeId: 'jogyesa',
    sessionId: 'jogyesa-morning-prayer',
    author: {
      name: '평화로운마음',
      avatar: '🧘‍♀️',
      level: '수행자'
    },
    rating: {
      overall: 5,
      facility: 5,
      teaching: 5,
      atmosphere: 5
    },
    content: {
      title: '조계사 새벽예불, 정말 좋았습니다',
      text: '조계사 새벽 명상이 정말 좋았습니다. 고요한 법당에서 마음의 평안을 찾을 수 있었어요. 도심 속에서 이런 경험을 할 수 있다니 정말 감사합니다.',
      pros: ['접근성 좋음', '정성스러운 예불', '마음의 평안'],
      cons: ['주차 공간 부족']
    },
    visitDate: '2024-01-15',
    createdAt: '2024-01-16',
    helpful: 12,
    tags: ['새벽예불', '도심', '평안'],
    verified: true
  },
  {
    id: 'review-2',
    templeId: 'bongeunsa',
    sessionId: 'bongeunsa-meditation',
    author: {
      name: '차명상수행자',
      avatar: '🍵',
      level: '오랜 신자'
    },
    rating: {
      overall: 5,
      facility: 4,
      teaching: 5,
      atmosphere: 5
    },
    content: {
      title: '봉은사 명상 프로그램 추천합니다',
      text: '봉은사 차명상 프로그램에 참여했는데, 한 잔의 차에서 깨달음을 얻는 경험이었습니다. 스님의 지도가 정말 훌륭하셨어요.',
      pros: ['훌륭한 지도', '차분한 분위기', '접근성'],
      cons: ['인원이 많아서 아쉬움']
    },
    visitDate: '2024-01-10',
    createdAt: '2024-01-11',
    helpful: 8,
    tags: ['명상', '차명상', '강남'],
    verified: true
  },
  {
    id: 'review-3',
    templeId: 'bulguksa',
    author: {
      name: '문화재사랑',
      avatar: '🏛️',
      level: '초심자'
    },
    rating: {
      overall: 4,
      facility: 5,
      teaching: 4,
      atmosphere: 5
    },
    content: {
      title: '불국사의 아름다움에 감탄',
      text: '불국사는 정말 아름다운 곳입니다. 석가탑과 다보탑의 웅장함, 청운교와 백운교의 우아함이 마음을 정화시켜줍니다.',
      pros: ['역사적 가치', '아름다운 건축', '좋은 접근성'],
      cons: ['관광객이 많음', '입장료']
    },
    visitDate: '2024-01-05',
    createdAt: '2024-01-06',
    helpful: 15,
    tags: ['문화재', '건축', '경주'],
    verified: false
  },
  {
    id: 'review-4',
    templeId: 'haeinsa',
    sessionId: 'haeinsa-templestay',
    author: {
      name: '산사순례자',
      avatar: '🏔️',
      level: '수행자'
    },
    rating: {
      overall: 5,
      facility: 4,
      teaching: 5,
      atmosphere: 5
    },
    content: {
      title: '해인사 템플스테이, 인생을 바꾼 경험',
      text: '해인사 템플스테이는 정말 특별한 경험이었습니다. 팔만대장경의 역사와 함께, 자연 속에서 진정한 나를 찾을 수 있었어요.',
      pros: ['깊은 명상 체험', '자연환경', '역사적 의미'],
      cons: ['접근성이 다소 불편', '추운 새벽 예불']
    },
    visitDate: '2024-01-01',
    createdAt: '2024-01-02',
    helpful: 20,
    tags: ['템플스테이', '팔만대장경', '가야산'],
    verified: true
  }
];

// 통계 데이터
export const templeStats = {
  totalTemples: temples.length,
  totalReviews: reviews.length,
  averageRating: 4.75,
  popularSects: [
    { sect: '조계종' as const, count: 4 }
  ],
  popularCities: [
    { city: '서울', count: 2 },
    { city: '경주', count: 1 },
    { city: '합천', count: 1 }
  ]
};