// 🇰🇷 한국 불교 커뮤니티 전용 상수

export const KOREAN_DHARMA_CATEGORIES = {
  GENERAL_DHARMA: '일반 법회',
  MORNING_CHANTING: '아침 예불',
  EVENING_CHANTING: '저녁 예불',
  MEDITATION: '참선/명상',
  SUTRA_STUDY: '경전 공부',
  DHARMA_TALK: '법문',
  YOUTH_DHARMA: '청년 법회',
  CHILDREN_DHARMA: '어린이 법회',
  FAMILY_DHARMA: '가족 법회',
  SPECIAL_CEREMONY: '특별 의식',
  RETREAT: '수련회/템플스테이',
  COMMUNITY_SERVICE: '봉사 활동',
  CULTURAL_EVENT: '문화 행사',
  LOTUS_LANTERN: '연등 법회',
  BUDDHA_BIRTHDAY: '부처님 오신 날'
} as const;

export const KOREAN_REGIONS = [
  '서울특별시', '부산광역시', '대구광역시', '인천광역시',
  '광주광역시', '대전광역시', '울산광역시', '세종특별자치시',
  '경기도', '강원특별자치도', '충청북도', '충청남도',
  '전북특별자치도', '전라남도', '경상북도', '경상남도', '제주특별자치도'
] as const;

export const BUDDHIST_BRANCHES = [
  '조계종', '천태종', '진각종', '태고종', '법화종',
  '총지종', '관음종', '원효종', '일승종', '화엄종'
] as const;

export const SESSION_TIMES = {
  EARLY_MORNING: '새벽 (05:00-07:00)',
  MORNING: '오전 (09:00-12:00)',
  AFTERNOON: '오후 (14:00-17:00)',
  EVENING: '저녁 (19:00-21:00)',
  LATE_EVENING: '밤 (21:00-23:00)'
} as const;

export const DIFFICULTY_LEVELS = {
  BEGINNER: '초심자',
  INTERMEDIATE: '중급자', 
  ADVANCED: '숙련자',
  EXPERT: '전문가'
} as const;

export const AGE_GROUPS = {
  ALL_AGES: '전 연령',
  CHILDREN: '어린이 (6-12세)',
  YOUTH: '청소년 (13-19세)',
  YOUNG_ADULT: '청년 (20-35세)',
  ADULT: '성인 (36-64세)',
  SENIOR: '시니어 (65세+)'
} as const;
