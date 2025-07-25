// 감정 체크인 서비스 (간소화 버전)

export interface EmotionCheckin {
  checkinId: string;
  userId: string;
  emotion: string;
  intensity: number;
  description?: string;
  note?: string;
  date: string;
  createdAt: string;
}

export interface CreateEmotionData {
  emotion: string;
  intensity: number;
  description?: string;
  note?: string;
}

export interface EmotionStats {
  averageIntensity: number;
  checkinStreak: number;
  positiveEmotionRate: number;
  emotionDistribution: Record<string, number>;
  insights: Array<{
    type: string;
    message: string;
    severity: 'info' | 'warning' | 'success';
  }>;
}

export interface EmotionHistoryResponse {
  checkins: EmotionCheckin[];
  total: number;
  hasMore: boolean;
}

export interface EmotionStatsResponse {
  stats: EmotionStats;
  period: string;
}

// 불교 감정 목록
const buddhistEmotions = [
  { name: '평화로운', category: 'positive' as const, description: '고요하고 편안한' },
  { name: '감사한', category: 'positive' as const, description: '고마운 마음' },
  { name: '기쁜', category: 'positive' as const, description: '즐겁고 밝은' },
  { name: '차분한', category: 'positive' as const, description: '안정된 마음' },
  { name: '희망찬', category: 'positive' as const, description: '긍정적 기대' },
  { name: '고요한', category: 'neutral' as const, description: '잠잠하고 조용한' },
  { name: '자비로운', category: 'positive' as const, description: '자애로운 마음' },
  { name: '집중된', category: 'positive' as const, description: '몰입된 상태' },
  { name: '불안한', category: 'negative' as const, description: '마음이 편치 않은' },
  { name: '슬픈', category: 'negative' as const, description: '우울하고 서글픈' },
  { name: '화난', category: 'negative' as const, description: '분노하는 마음' },
  { name: '혼란스러운', category: 'negative' as const, description: '어지럽고 복잡한' },
  { name: '두려운', category: 'negative' as const, description: '무서움과 걱정' },
  { name: '성찰적인', category: 'neutral' as const, description: '깊이 생각하는' },
  { name: '겸손한', category: 'positive' as const, description: '낮춤과 경계의 마음' }
];

// 임시 데이터 저장소
let emotionCheckins: EmotionCheckin[] = [
  {
    checkinId: 'checkin-1',
    userId: 'user-1',
    emotion: '평화로운',
    intensity: 8,
    description: '아침 명상 후 마음이 고요해졌습니다',
    date: '2024-01-15',
    createdAt: '2024-01-15T06:30:00Z'
  },
  {
    checkinId: 'checkin-2',
    userId: 'user-1',
    emotion: '감사한',
    intensity: 9,
    description: '부처님의 가르침에 감사한 마음입니다',
    date: '2024-01-14',
    createdAt: '2024-01-14T19:20:00Z'
  }
];

export class EmotionService {
  // 🧘‍♀️ 불교 감정 목록 가져오기
  static getBuddhistEmotions() {
    return buddhistEmotions;
  }

  // 📝 감정 체크인 생성
  static async createEmotionCheckin(data: CreateEmotionData): Promise<EmotionCheckin> {
    console.log('감정 체크인 생성:', data);

    const today = new Date().toISOString().split('T')[0];
    const newCheckin: EmotionCheckin = {
      checkinId: `checkin-${Date.now()}`,
      userId: 'current-user-id',
      ...data,
      date: today,
      createdAt: new Date().toISOString()
    };

    // 오늘 날짜의 기존 체크인 제거 (하루에 하나만)
    emotionCheckins = emotionCheckins.filter(
      checkin => checkin.userId !== 'current-user-id' || checkin.date !== today
    );

    emotionCheckins.push(newCheckin);
    return newCheckin;
  }

  // 📅 오늘의 감정 체크인 조회
  static async getTodaysEmotion(): Promise<EmotionCheckin | null> {
    console.log('오늘의 감정 조회');
    
    const today = new Date().toISOString().split('T')[0];
    const todaysCheckin = emotionCheckins.find(
      checkin => checkin.userId === 'current-user-id' && checkin.date === today
    );

    return todaysCheckin || null;
  }

  // 📊 감정 기록 조회
  static async getEmotionHistory(params: {
    limit?: number;
    offset?: number;
    startDate?: string;
    endDate?: string;
  } = {}): Promise<EmotionHistoryResponse> {
    console.log('감정 기록 조회:', params);

    const { limit = 30, offset = 0 } = params;
    let userCheckins = emotionCheckins.filter(
      checkin => checkin.userId === 'current-user-id'
    );

    // 날짜 필터링
    if (params.startDate) {
      userCheckins = userCheckins.filter(checkin => checkin.date >= params.startDate!);
    }
    if (params.endDate) {
      userCheckins = userCheckins.filter(checkin => checkin.date <= params.endDate!);
    }

    // 최신순 정렬
    userCheckins.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const paginatedCheckins = userCheckins.slice(offset, offset + limit);

    return {
      checkins: paginatedCheckins,
      total: userCheckins.length,
      hasMore: offset + limit < userCheckins.length
    };
  }

  // 📈 감정 통계 조회
  static async getEmotionStats(period: '7d' | '30d' | '90d' = '30d'): Promise<EmotionStatsResponse> {
    console.log('감정 통계 조회:', period);

    const userCheckins = emotionCheckins.filter(
      checkin => checkin.userId === 'current-user-id'
    );

    if (userCheckins.length === 0) {
      return {
        stats: {
          averageIntensity: 0,
          checkinStreak: 0,
          positiveEmotionRate: 0,
          emotionDistribution: {},
          insights: []
        },
        period
      };
    }

    // 평균 강도 계산
    const averageIntensity = userCheckins.reduce((sum, checkin) => sum + checkin.intensity, 0) / userCheckins.length;

    // 연속 체크인 일수 계산 (간단히 총 체크인 수로 대체)
    const checkinStreak = userCheckins.length;

    // 긍정 감정 비율 계산
    const positiveEmotions = userCheckins.filter(checkin => {
      const emotion = buddhistEmotions.find(e => e.name === checkin.emotion);
      return emotion?.category === 'positive';
    });
    const positiveEmotionRate = Math.round((positiveEmotions.length / userCheckins.length) * 100);

    // 감정 분포 계산
    const emotionDistribution: Record<string, number> = {};
    userCheckins.forEach(checkin => {
      emotionDistribution[checkin.emotion] = (emotionDistribution[checkin.emotion] || 0) + 1;
    });

    // 인사이트 생성
    const insights = [];
    if (positiveEmotionRate >= 70) {
      insights.push({
        type: 'positive_trend',
        message: '긍정적인 감정이 많아 마음이 평온한 상태입니다 🙏',
        severity: 'success' as const
      });
    }
    if (averageIntensity >= 7) {
      insights.push({
        type: 'high_intensity',
        message: '감정의 강도가 높아 마음챙김 명상을 권합니다',
        severity: 'info' as const
      });
    }
    insights.push({
      type: 'streak',
      message: `${checkinStreak}일간 꾸준히 마음을 돌아보고 계시네요`,
      severity: 'success' as const
    });

    return {
      stats: {
        averageIntensity: Math.round(averageIntensity * 10) / 10,
        checkinStreak,
        positiveEmotionRate,
        emotionDistribution,
        insights
      },
      period
    };
  }

  // 🗑️ 감정 체크인 삭제
  static async deleteEmotionCheckin(checkinId: string): Promise<boolean> {
    console.log('감정 체크인 삭제:', checkinId);
    
    const initialLength = emotionCheckins.length;
    emotionCheckins = emotionCheckins.filter(
      checkin => checkin.checkinId !== checkinId || checkin.userId !== 'current-user-id'
    );
    
    return emotionCheckins.length < initialLength;
  }

  // 📝 감정 체크인 수정
  static async updateEmotionCheckin(checkinId: string, updates: Partial<CreateEmotionData>): Promise<EmotionCheckin | null> {
    console.log('감정 체크인 수정:', checkinId, updates);
    
    const checkinIndex = emotionCheckins.findIndex(
      checkin => checkin.checkinId === checkinId && checkin.userId === 'current-user-id'
    );
    
    if (checkinIndex === -1) {
      return null;
    }
    
    emotionCheckins[checkinIndex] = {
      ...emotionCheckins[checkinIndex],
      ...updates
    };
    
    return emotionCheckins[checkinIndex];
  }

  // 📊 감정 트렌드 분석
  static async getEmotionTrends(): Promise<Array<{ date: string; emotion: string; intensity: number }>> {
    console.log('감정 트렌드 분석');
    
    const userCheckins = emotionCheckins.filter(
      checkin => checkin.userId === 'current-user-id'
    );
    
    return userCheckins.map(checkin => ({
      date: checkin.date,
      emotion: checkin.emotion,
      intensity: checkin.intensity
    })).sort((a, b) => a.date.localeCompare(b.date));
  }
}

export default EmotionService;