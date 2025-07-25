/**
 * 영성 커뮤니티 API 서비스
 * 백엔드 API와의 통신을 담당하는 서비스 레이어
 */

import { 
  Temple, 
  Gathering, 
  TempleReview, 
  GatheringReview, 
  SpiritualPost,
  User,
  Comment,
  Notification,
  ApiResponse,
  PaginatedResponse,
  SearchFilters,
  CreatePostFormData,
  CreateReviewFormData,
  CreateGatheringFormData,
  SpiritualStats
} from '../types/spiritual';

// API 기본 설정
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('authToken');
  }

  // 인증 토큰 설정
  setAuthToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  // 인증 토큰 제거
  clearAuthToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  // HTTP 요청 기본 설정
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET 요청
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST 요청
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT 요청
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE 요청
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // 파일 업로드 요청
  async upload<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {};

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('File upload failed:', error);
      throw error;
    }
  }
}

// API 클라이언트 인스턴스
const apiClient = new ApiClient(API_BASE_URL);

// 🏛️ 사찰 관련 API
export const templeApi = {
  // 모든 사찰 조회
  getAll: async (filters?: SearchFilters): Promise<ApiResponse<PaginatedResponse<Temple>>> => {
    const params = new URLSearchParams();
    if (filters?.query) params.append('q', filters.query);
    if (filters?.location) params.append('location', filters.location);
    if (filters?.sortBy) params.append('sort', filters.sortBy);
    
    const endpoint = `/temples${params.toString() ? `?${params.toString()}` : ''}`;
    return apiClient.get<PaginatedResponse<Temple>>(endpoint);
  },

  // 특정 사찰 조회
  getById: async (id: string): Promise<ApiResponse<Temple>> => {
    return apiClient.get<Temple>(`/temples/${id}`);
  },

  // 사찰 검색
  search: async (query: string): Promise<ApiResponse<Temple[]>> => {
    return apiClient.get<Temple[]>(`/temples/search?q=${encodeURIComponent(query)}`);
  },

  // 인근 사찰 조회
  getNearby: async (lat: number, lng: number, radius: number = 10): Promise<ApiResponse<Temple[]>> => {
    return apiClient.get<Temple[]>(`/temples/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
  },
};

// 🙏 집회/모임 관련 API
export const gatheringApi = {
  // 모든 모임 조회
  getAll: async (filters?: SearchFilters): Promise<ApiResponse<PaginatedResponse<Gathering>>> => {
    const params = new URLSearchParams();
    if (filters?.query) params.append('q', filters.query);
    if (filters?.category) params.append('type', filters.category);
    if (filters?.location) params.append('location', filters.location);
    if (filters?.dateRange) {
      params.append('start_date', filters.dateRange.start);
      params.append('end_date', filters.dateRange.end);
    }
    
    const endpoint = `/gatherings${params.toString() ? `?${params.toString()}` : ''}`;
    return apiClient.get<PaginatedResponse<Gathering>>(endpoint);
  },

  // 특정 모임 조회
  getById: async (id: string): Promise<ApiResponse<Gathering>> => {
    return apiClient.get<Gathering>(`/gatherings/${id}`);
  },

  // 모임 생성
  create: async (data: CreateGatheringFormData): Promise<ApiResponse<Gathering>> => {
    return apiClient.post<Gathering>('/gatherings', data);
  },

  // 모임 수정
  update: async (id: string, data: Partial<CreateGatheringFormData>): Promise<ApiResponse<Gathering>> => {
    return apiClient.put<Gathering>(`/gatherings/${id}`, data);
  },

  // 모임 삭제
  delete: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/gatherings/${id}`);
  },

  // 모임 참가 신청
  join: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.post<void>(`/gatherings/${id}/join`);
  },

  // 모임 참가 취소
  leave: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/gatherings/${id}/join`);
  },

  // 내가 참가한 모임 조회
  getMyGatherings: async (): Promise<ApiResponse<Gathering[]>> => {
    return apiClient.get<Gathering[]>('/gatherings/me');
  },
};

// ⭐ 리뷰 관련 API
export const reviewApi = {
  // 사찰 리뷰 조회
  getTempleReviews: async (templeId: string, page: number = 1): Promise<ApiResponse<PaginatedResponse<TempleReview>>> => {
    return apiClient.get<PaginatedResponse<TempleReview>>(`/temples/${templeId}/reviews?page=${page}`);
  },

  // 모임 리뷰 조회
  getGatheringReviews: async (gatheringId: string, page: number = 1): Promise<ApiResponse<PaginatedResponse<GatheringReview>>> => {
    return apiClient.get<PaginatedResponse<GatheringReview>>(`/gatherings/${gatheringId}/reviews?page=${page}`);
  },

  // 사찰 리뷰 작성
  createTempleReview: async (templeId: string, data: CreateReviewFormData): Promise<ApiResponse<TempleReview>> => {
    return apiClient.post<TempleReview>(`/temples/${templeId}/reviews`, data);
  },

  // 모임 리뷰 작성
  createGatheringReview: async (gatheringId: string, data: Omit<CreateReviewFormData, 'visitDate'> & { attendedAt: string }): Promise<ApiResponse<GatheringReview>> => {
    return apiClient.post<GatheringReview>(`/gatherings/${gatheringId}/reviews`, data);
  },

  // 리뷰 수정
  updateReview: async (reviewId: string, data: Partial<CreateReviewFormData>): Promise<ApiResponse<TempleReview | GatheringReview>> => {
    return apiClient.put<TempleReview | GatheringReview>(`/reviews/${reviewId}`, data);
  },

  // 리뷰 삭제
  deleteReview: async (reviewId: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/reviews/${reviewId}`);
  },

  // 리뷰 도움됨 표시
  markHelpful: async (reviewId: string): Promise<ApiResponse<void>> => {
    return apiClient.post<void>(`/reviews/${reviewId}/helpful`);
  },

  // 내가 작성한 리뷰 조회
  getMyReviews: async (): Promise<ApiResponse<(TempleReview | GatheringReview)[]>> => {
    return apiClient.get<(TempleReview | GatheringReview)[]>('/reviews/me');
  },
};

// ✍️ 영성 포스팅 관련 API
export const postApi = {
  // 모든 포스트 조회
  getAll: async (filters?: SearchFilters): Promise<ApiResponse<PaginatedResponse<SpiritualPost>>> => {
    const params = new URLSearchParams();
    if (filters?.query) params.append('q', filters.query);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.tags?.length) params.append('tags', filters.tags.join(','));
    if (filters?.sortBy) params.append('sort', filters.sortBy);
    
    const endpoint = `/posts${params.toString() ? `?${params.toString()}` : ''}`;
    return apiClient.get<PaginatedResponse<SpiritualPost>>(endpoint);
  },

  // 특정 포스트 조회
  getById: async (id: string): Promise<ApiResponse<SpiritualPost>> => {
    return apiClient.get<SpiritualPost>(`/posts/${id}`);
  },

  // 포스트 생성
  create: async (data: CreatePostFormData): Promise<ApiResponse<SpiritualPost>> => {
    return apiClient.post<SpiritualPost>('/posts', data);
  },

  // 포스트 수정
  update: async (id: string, data: Partial<CreatePostFormData>): Promise<ApiResponse<SpiritualPost>> => {
    return apiClient.put<SpiritualPost>(`/posts/${id}`, data);
  },

  // 포스트 삭제
  delete: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/posts/${id}`);
  },

  // 포스트 좋아요
  like: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.post<void>(`/posts/${id}/like`);
  },

  // 포스트 좋아요 취소
  unlike: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/posts/${id}/like`);
  },

  // 포스트 북마크
  bookmark: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.post<void>(`/posts/${id}/bookmark`);
  },

  // 포스트 북마크 취소
  unbookmark: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/posts/${id}/bookmark`);
  },

  // 내가 작성한 포스트 조회
  getMyPosts: async (): Promise<ApiResponse<SpiritualPost[]>> => {
    return apiClient.get<SpiritualPost[]>('/posts/me');
  },

  // 인기 포스트 조회
  getPopular: async (period: 'week' | 'month' | 'year' = 'week'): Promise<ApiResponse<SpiritualPost[]>> => {
    return apiClient.get<SpiritualPost[]>(`/posts/popular?period=${period}`);
  },
};

// 💬 댓글 관련 API
export const commentApi = {
  // 댓글 조회
  getByPostId: async (postId: string): Promise<ApiResponse<Comment[]>> => {
    return apiClient.get<Comment[]>(`/posts/${postId}/comments`);
  },

  // 댓글 작성
  create: async (postId: string, content: string, parentId?: string): Promise<ApiResponse<Comment>> => {
    return apiClient.post<Comment>(`/posts/${postId}/comments`, { content, parentId });
  },

  // 댓글 수정
  update: async (commentId: string, content: string): Promise<ApiResponse<Comment>> => {
    return apiClient.put<Comment>(`/comments/${commentId}`, { content });
  },

  // 댓글 삭제
  delete: async (commentId: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/comments/${commentId}`);
  },

  // 댓글 좋아요
  like: async (commentId: string): Promise<ApiResponse<void>> => {
    return apiClient.post<void>(`/comments/${commentId}/like`);
  },
};

// 👤 사용자 관련 API
export const userApi = {
  // 내 프로필 조회
  getMe: async (): Promise<ApiResponse<User>> => {
    return apiClient.get<User>('/users/me');
  },

  // 프로필 수정
  updateProfile: async (data: Partial<User>): Promise<ApiResponse<User>> => {
    return apiClient.put<User>('/users/me', data);
  },

  // 사용자 프로필 조회
  getById: async (id: string): Promise<ApiResponse<User>> => {
    return apiClient.get<User>(`/users/${id}`);
  },

  // 사용자 검색
  search: async (query: string): Promise<ApiResponse<User[]>> => {
    return apiClient.get<User[]>(`/users/search?q=${encodeURIComponent(query)}`);
  },
};

// 🔔 알림 관련 API
export const notificationApi = {
  // 내 알림 조회
  getAll: async (page: number = 1): Promise<ApiResponse<PaginatedResponse<Notification>>> => {
    return apiClient.get<PaginatedResponse<Notification>>(`/notifications?page=${page}`);
  },

  // 알림 읽음 처리
  markAsRead: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.put<void>(`/notifications/${id}/read`);
  },

  // 모든 알림 읽음 처리
  markAllAsRead: async (): Promise<ApiResponse<void>> => {
    return apiClient.put<void>('/notifications/read-all');
  },

  // 알림 삭제
  delete: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/notifications/${id}`);
  },
};

// 📊 통계 관련 API
export const statsApi = {
  // 전체 커뮤니티 통계
  getCommunityStats: async (): Promise<ApiResponse<SpiritualStats>> => {
    return apiClient.get<SpiritualStats>('/stats/community');
  },

  // 내 활동 통계
  getMyStats: async (): Promise<ApiResponse<SpiritualStats>> => {
    return apiClient.get<SpiritualStats>('/stats/me');
  },
};

// 🔍 검색 관련 API
export const searchApi = {
  // 통합 검색
  search: async (query: string, type?: 'all' | 'posts' | 'temples' | 'gatherings' | 'users'): Promise<ApiResponse<any>> => {
    const params = new URLSearchParams({ q: query });
    if (type && type !== 'all') params.append('type', type);
    
    return apiClient.get<any>(`/search?${params.toString()}`);
  },

  // 인기 검색어
  getPopularTags: async (): Promise<ApiResponse<Array<{ tag: string; count: number }>>> => {
    return apiClient.get<Array<{ tag: string; count: number }>>('/search/popular-tags');
  },
};

// 인증 관련 API
export const authApi = {
  // 로그인
  login: async (email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await apiClient.post<{ user: User; token: string }>('/auth/login', { email, password });
    if (response.success && response.data.token) {
      apiClient.setAuthToken(response.data.token);
    }
    return response;
  },

  // 회원가입
  register: async (userData: {
    email: string;
    password: string;
    username: string;
    displayName: string;
  }): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await apiClient.post<{ user: User; token: string }>('/auth/register', userData);
    if (response.success && response.data.token) {
      apiClient.setAuthToken(response.data.token);
    }
    return response;
  },

  // 로그아웃
  logout: async (): Promise<void> => {
    apiClient.clearAuthToken();
  },

  // 토큰 갱신
  refreshToken: async (): Promise<ApiResponse<{ token: string }>> => {
    return apiClient.post<{ token: string }>('/auth/refresh');
  },
};

// API 클라이언트 내보내기
export { apiClient };
export default apiClient;