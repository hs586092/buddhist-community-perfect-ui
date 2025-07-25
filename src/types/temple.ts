// 🏛️ 사찰 및 법회 리뷰 타입 정의

export interface Temple {
  id: string;
  name: string;
  location: {
    address: string;
    city: string;
    district: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  description: string;
  sect: '조계종' | '천태종' | '진각종' | '태고종' | '기타';
  established?: number;
  mainBuddha?: string;
  contact: {
    phone?: string;
    website?: string;
    email?: string;
  };
  facilities: string[];
  rating: {
    average: number;
    count: number;
  };
  images: string[];
  services: {
    dharmaHall: boolean;
    templestay: boolean;
    meditation: boolean;
    ceremony: boolean;
    education: boolean;
  };
}

export interface DharmaSession {
  id: string;
  templeId: string;
  title: string;
  type: '법회' | '예불' | '선원' | '법문' | '템플스테이' | '기타';
  schedule: {
    dayOfWeek: string[];
    time: string;
    duration?: number; // minutes
  };
  description: string;
  teacher?: string;
  capacity?: number;
  cost?: number;
  requirements?: string[];
}

export interface Review {
  id: string;
  templeId: string;
  sessionId?: string;
  author: {
    name: string;
    avatar?: string;
    level: '초심자' | '수행자' | '오랜 신자';
  };
  rating: {
    overall: number; // 1-5
    facility: number;
    teaching: number;
    atmosphere: number;
  };
  content: {
    title: string;
    text: string;
    pros: string[];
    cons: string[];
  };
  visitDate: string;
  createdAt: string;
  helpful: number;
  tags: string[];
  verified: boolean;
}

export interface ReviewFilter {
  rating?: number;
  type?: DharmaSession['type'];
  sect?: Temple['sect'];
  city?: string;
  tags?: string[];
  sortBy: 'latest' | 'rating' | 'helpful';
}

export interface TempleStats {
  totalTemples: number;
  totalReviews: number;
  averageRating: number;
  popularSects: Array<{
    sect: Temple['sect'];
    count: number;
  }>;
  popularCities: Array<{
    city: string;
    count: number;
  }>;
}