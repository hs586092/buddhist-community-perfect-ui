// 사찰 및 리뷰 관리 서비스 (간소화 버전)

export interface Temple {
  templeId: string;
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  description?: string;
  imageUrl?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  website?: string;
  phone?: string;
  traditions?: string[];
  programs?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  reviewId: string;
  templeId: string;
  userId: string;
  username: string;
  rating: number;
  title: string;
  content: string;
  visitDate: string;
  isAnonymous: boolean;
  helpfulCount: number;
  reportCount: number;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  images?: string[];
}

export interface CreateReviewData {
  templeId: string;
  rating: number;
  title: string;
  content: string;
  visitDate: string;
  isAnonymous: boolean;
  tags?: string[];
}

export interface SearchParams {
  query?: string;
  location?: string;
  rating?: number;
  traditions?: string[];
  limit?: number;
  offset?: number;
}

// 임시 데이터
const sampleTemples: Temple[] = [
  {
    templeId: 'temple-1',
    name: '조계사',
    location: '서울 종로구',
    rating: 4.8,
    reviewCount: 156,
    description: '한국 불교 조계종 총본산',
    traditions: ['조계종'],
    programs: ['새벽 예불', '정기 법회', '불교 강좌'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    templeId: 'temple-2',
    name: '봉은사',
    location: '서울 강남구',
    rating: 4.6,
    reviewCount: 89,
    description: '도심 속 전통 사찰',
    traditions: ['조계종'],
    programs: ['차명상', '템플스테이', '도심 수행'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    templeId: 'temple-3',
    name: '불국사',
    location: '경주시',
    rating: 4.9,
    reviewCount: 234,
    description: '유네스코 세계문화유산',
    traditions: ['조계종'],
    programs: ['문화재 탐방', '역사 교육', '정기 법회'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

const sampleReviews: Review[] = [
  {
    reviewId: 'review-1',
    templeId: 'temple-1',
    userId: 'user-1',
    username: '평화로운마음',
    rating: 5,
    title: '새벽 예불이 정말 좋았습니다',
    content: '조계사 새벽 예불에 참석했는데, 정말 마음이 평온해졌습니다. 도심에서 이런 고요함을 느낄 수 있다는 것이 감사했어요.',
    visitDate: '2024-01-15',
    isAnonymous: false,
    helpfulCount: 12,
    reportCount: 0,
    tags: ['새벽예불', '마음평온', '추천'],
    createdAt: '2024-01-16T00:00:00Z',
    updatedAt: '2024-01-16T00:00:00Z'
  },
  {
    reviewId: 'review-2',
    templeId: 'temple-2',
    userId: 'user-2',
    username: '차명상수행자',
    rating: 5,
    title: '봉은사 차명상 프로그램 후기',
    content: '봉은사 차명상 프로그램에 참여했는데, 한 잔의 차에 담긴 깊은 의미를 깨달을 수 있었습니다. 강남 한복판에서 이런 수행을 할 수 있다니!',
    visitDate: '2024-01-10',
    isAnonymous: false,
    helpfulCount: 8,
    reportCount: 0,
    tags: ['차명상', '수행', '도심사찰'],
    createdAt: '2024-01-11T00:00:00Z',
    updatedAt: '2024-01-11T00:00:00Z'
  }
];

export class TempleService {
  // 🏛️ 사찰 목록 조회
  static async getTemples(params?: SearchParams): Promise<{ temples: Temple[]; total: number }> {
    console.log('사찰 목록 조회:', params);
    
    let filteredTemples = [...sampleTemples];
    
    // 검색 필터링 (간단한 구현)
    if (params?.query) {
      filteredTemples = filteredTemples.filter(temple => 
        temple.name.includes(params.query!) || 
        temple.location.includes(params.query!)
      );
    }
    
    if (params?.rating) {
      filteredTemples = filteredTemples.filter(temple => temple.rating >= params.rating!);
    }
    
    return {
      temples: filteredTemples,
      total: filteredTemples.length
    };
  }

  // 🏛️ 특정 사찰 조회
  static async getTemple(templeId: string): Promise<Temple | null> {
    console.log('사찰 조회:', templeId);
    return sampleTemples.find(temple => temple.templeId === templeId) || null;
  }

  // 📝 리뷰 목록 조회
  static async getReviews(templeId: string): Promise<{ reviews: Review[]; total: number }> {
    console.log('리뷰 목록 조회:', templeId);
    const templeReviews = sampleReviews.filter(review => review.templeId === templeId);
    
    return {
      reviews: templeReviews,
      total: templeReviews.length
    };
  }

  // 📝 리뷰 작성
  static async createReview(reviewData: CreateReviewData): Promise<Review> {
    console.log('리뷰 작성:', reviewData);
    
    const newReview: Review = {
      reviewId: `review-${Date.now()}`,
      ...reviewData,
      userId: 'current-user-id',
      username: reviewData.isAnonymous ? '익명' : '현재사용자',
      helpfulCount: 0,
      reportCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // 메모리에 추가 (실제로는 서버에 저장)
    sampleReviews.push(newReview);
    
    return newReview;
  }

  // 👍 리뷰 도움됨 표시
  static async markReviewHelpful(reviewId: string): Promise<boolean> {
    console.log('리뷰 도움됨:', reviewId);
    const review = sampleReviews.find(r => r.reviewId === reviewId);
    if (review) {
      review.helpfulCount++;
      return true;
    }
    return false;
  }

  // 🚨 리뷰 신고
  static async reportReview(reviewId: string, reason: string): Promise<boolean> {
    console.log('리뷰 신고:', reviewId, reason);
    const review = sampleReviews.find(r => r.reviewId === reviewId);
    if (review) {
      review.reportCount++;
      return true;
    }
    return false;
  }

  // 🔍 사찰 검색
  static async searchTemples(query: string): Promise<Temple[]> {
    console.log('사찰 검색:', query);
    return sampleTemples.filter(temple => 
      temple.name.includes(query) || 
      temple.location.includes(query) ||
      temple.description?.includes(query)
    );
  }

  // 📊 인기 사찰 조회
  static async getPopularTemples(limit: number = 5): Promise<Temple[]> {
    console.log('인기 사찰 조회');
    return [...sampleTemples]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  // 🗺️ 근처 사찰 조회
  static async getNearbyTemples(lat: number, lng: number, radius: number = 10): Promise<Temple[]> {
    console.log('근처 사찰 조회:', lat, lng, radius);
    // 임시로 모든 사찰 반환
    return sampleTemples;
  }
}

export default TempleService;