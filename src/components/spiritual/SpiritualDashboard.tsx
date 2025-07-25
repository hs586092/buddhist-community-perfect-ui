/**
 * 영성 커뮤니티 메인 대시보드
 * 집회 리뷰, 절 리뷰, 영성 포스팅을 통합한 메인 허브
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Card, 
  TempleCard, 
  ReviewCard, 
  PostCard 
} from '../ui/Card';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';
import { 
  Temple, 
  TempleReview, 
  SpiritualPost,
  Gathering 
} from '../../types/spiritual';
import { LotusBloom, LotusIcon } from '../lotus';

// 샘플 데이터 (실제로는 API에서 가져옴)
const SAMPLE_TEMPLES: Temple[] = [
  {
    id: '1',
    name: '조계사',
    fullName: '대한불교조계종 조계사',
    address: '서울특별시 종로구 우정국로 55',
    city: '서울',
    province: '서울특별시',
    description: '한국 불교의 중심 사찰로, 도심 속 마음의 안식처를 제공합니다.',
    denomination: 'jogye',
    features: ['meditation', 'dharma_talk', 'templestay', 'cultural_programs'],
    images: ['/images/jogye-temple.jpg'],
    rating: 4.8,
    reviewCount: 156
  },
  {
    id: '2', 
    name: '봉은사',
    fullName: '대한불교조계종 봉은사',
    address: '서울특별시 강남구 봉은사로 531',
    city: '서울',
    province: '서울특별시',
    description: '강남의 대표 사찰로, 현대인을 위한 다양한 수행 프로그램을 제공합니다.',
    denomination: 'jogye',
    features: ['meditation', 'tea_ceremony', 'study_groups', 'walking_meditation'],
    images: ['/images/bongeun-temple.jpg'],
    rating: 4.6,
    reviewCount: 89
  }
];

const SAMPLE_REVIEWS: TempleReview[] = [
  {
    id: '1',
    temple: SAMPLE_TEMPLES[0],
    author: {
      id: '1',
      username: 'peaceful_mind',
      displayName: '평화로운마음',
      email: 'user@example.com',
      avatar: '🧘‍♀️',
      isVerified: true,
      spiritualLevel: 'intermediate',
      joinedAt: '2024-01-01T00:00:00Z'
    },
    title: '고요한 아침 명상',
    content: '새벽 명상이 일상의 평온을 가져다주었습니다. 스님의 지도로 깊은 통찰을 얻었어요.',
    rating: 5,
    category: 'meditation',
    visitDate: '2024-01-15',
    isRecommended: true,
    helpfulCount: 24,
    tags: ['명상', '평온', '통찰'],
    createdAt: '2시간 전',
    updatedAt: '2시간 전',
    createdBy: '1'
  },
  {
    id: '2',
    temple: SAMPLE_TEMPLES[1],
    author: {
      id: '2',
      username: 'dharma_seeker',
      displayName: '법구상구',
      email: 'user2@example.com',
      avatar: '🍵',
      isVerified: true,
      spiritualLevel: 'advanced',
      joinedAt: '2023-12-01T00:00:00Z'
    },
    title: '차명상의 깊은 여운',
    content: '한 잔의 차에 담긴 마음챙김의 순간들. 현재에 온전히 머무르는 법을 배웠습니다.',
    rating: 5,
    category: 'experience',
    visitDate: '2024-01-12',
    isRecommended: true,
    helpfulCount: 18,
    tags: ['차명상', '마음챙김', '현재'],
    createdAt: '1일 전',
    updatedAt: '1일 전',
    createdBy: '2'
  }
];

const SAMPLE_POSTS: SpiritualPost[] = [
  {
    id: '1',
    author: {
      id: '1',
      username: 'wisdom_seeker',
      displayName: '지혜를찾는자',
      email: 'wisdom@example.com',
      avatar: '📿',
      isVerified: false,
      spiritualLevel: 'intermediate',
      joinedAt: '2024-01-01T00:00:00Z'
    },
    title: '일상 속 작은 깨달음들',
    content: '바쁜 현대 생활 속에서도 순간순간 찾아오는 작은 깨달음들에 대한 성찰...',
    excerpt: '바쁜 현대 생활 속에서도 순간순간 찾아오는 작은 깨달음들에 대한 성찰',
    type: 'reflection',
    category: 'daily_practice',
    tags: ['깨달음', '일상', '성찰'],
    isPublished: true,
    publishedAt: '2024-01-15T00:00:00Z',
    likeCount: 32,
    commentCount: 8,
    shareCount: 5,
    readingTime: 3,
    createdAt: '3일 전',
    updatedAt: '3일 전',
    createdBy: '1'
  },
  {
    id: '2',
    author: {
      id: '2',
      username: 'meditation_master',
      displayName: '명상의달인',
      email: 'master@example.com',
      avatar: '🕉️',
      isVerified: true,
      spiritualLevel: 'teacher',
      joinedAt: '2023-06-01T00:00:00Z'
    },
    title: '호흡명상의 올바른 자세',
    content: '호흡명상을 시작하는 분들을 위한 기초 가이드. 자세부터 마음가짐까지...',
    excerpt: '호흡명상을 시작하는 분들을 위한 기초 가이드. 자세부터 마음가짐까지',
    type: 'guide',
    category: 'meditation',
    tags: ['호흡명상', '가이드', '자세'],
    isPublished: true,
    publishedAt: '2024-01-14T00:00:00Z',
    likeCount: 45,
    commentCount: 12,
    shareCount: 18,
    readingTime: 5,
    createdAt: '4일 전',
    updatedAt: '4일 전',
    createdBy: '2'
  }
];

// 탭 타입 정의
type TabType = 'overview' | 'temples' | 'reviews' | 'posts' | 'gatherings';

export default function SpiritualDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');

  // 탭 데이터
  const tabs = [
    { id: 'overview', label: '둘러보기', icon: '🌸' },
    { id: 'temples', label: '사찰', icon: '🏛️' },
    { id: 'reviews', label: '후기', icon: '⭐' },
    { id: 'posts', label: '영성글', icon: '✍️' },
    { id: 'gatherings', label: '모임', icon: '🙏' }
  ] as const;

  return (
    <div className="min-h-screen bg-sage-50" style={{
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Noto Sans KR', system-ui, sans-serif"
    }}>
      {/* 네비게이션 */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-xl border-b border-sage-100 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 5 }}
                className="w-8 h-8 bg-gradient-to-br from-sage-500 to-serenity-500 rounded-lg flex items-center justify-center"
              >
                <LotusIcon size={20} color="white" />
              </motion.div>
              <span className="text-lg font-medium text-sage-900">
                영성 커뮤니티
              </span>
            </div>

            <Button variant="primary" size="sm">
              로그인
            </Button>
          </div>
        </div>
      </nav>

      {/* 탭 네비게이션 */}
      <div className="pt-16 pb-6 bg-white border-b border-sage-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all',
                  activeTab === tab.id
                    ? 'bg-sage-100 text-sage-800 border border-sage-200'
                    : 'text-sage-600 hover:bg-sage-50 hover:text-sage-800'
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* 둘러보기 탭 */}
            {activeTab === 'overview' && (
              <div className="space-y-12">
                {/* 환영 섹션 */}
                <div className="text-center py-12">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-20 h-20 bg-gradient-to-br from-sage-500 to-serenity-500 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                  >
                    <LotusBloom size={48} color="white" animate={true} />
                  </motion.div>
                  
                  <h1 className="text-4xl font-bold text-sage-900 mb-4">
                    영성 커뮤니티에 오신 것을 환영합니다
                  </h1>
                  
                  <p className="text-lg text-sage-600 mb-8 max-w-2xl mx-auto">
                    전국 사찰의 수행 경험을 나누고, 깊은 통찰을 함께 만들어가는 평화로운 공간입니다
                  </p>

                  <div className="flex items-center justify-center gap-4">
                    <Button variant="primary" size="lg">
                      둘러보기 시작
                    </Button>
                    <Button variant="outline" size="lg">
                      커뮤니티 가입
                    </Button>
                  </div>
                </div>

                {/* 최근 사찰 */}
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-sage-900">인기 사찰</h2>
                    <Button variant="ghost" onClick={() => setActiveTab('temples')}>
                      모두 보기 →
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {SAMPLE_TEMPLES.map((temple) => (
                      <TempleCard
                        key={temple.id}
                        name={temple.name}
                        location={temple.city}
                        rating={temple.rating}
                        reviewCount={temple.reviewCount}
                        features={temple.features.map(f => {
                          const featureMap: Record<string, string> = {
                            meditation: '명상',
                            dharma_talk: '법문',
                            templestay: '템플스테이',
                            tea_ceremony: '차명상',
                            cultural_programs: '문화체험',
                            walking_meditation: '걸음명상'
                          };
                          return featureMap[f] || f;
                        })}
                      />
                    ))}
                  </div>
                </section>

                {/* 최근 후기 */}
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-sage-900">최근 후기</h2>
                    <Button variant="ghost" onClick={() => setActiveTab('reviews')}>
                      모두 보기 →
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {SAMPLE_REVIEWS.map((review) => (
                      <ReviewCard
                        key={review.id}
                        title={review.title}
                        author={review.author.displayName}
                        avatar={review.author.avatar!}
                        rating={review.rating}
                        content={review.content}
                        date={review.createdAt}
                        temple={review.temple.name}
                        category={review.category}
                        likes={review.helpfulCount}
                        isVerified={review.author.isVerified}
                      />
                    ))}
                  </div>
                </section>

                {/* 영성 포스트 */}
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-sage-900">영성 글</h2>
                    <Button variant="ghost" onClick={() => setActiveTab('posts')}>
                      모두 보기 →
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {SAMPLE_POSTS.map((post) => (
                      <PostCard
                        key={post.id}
                        title={post.title}
                        excerpt={post.excerpt!}
                        author={post.author.displayName}
                        publishedAt={post.createdAt}
                        readingTime={post.readingTime}
                        category={post.category}
                        tags={post.tags}
                        likeCount={post.likeCount}
                        commentCount={post.commentCount}
                      />
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* 사찰 탭 */}
            {activeTab === 'temples' && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-semibold text-sage-900">전국 사찰</h2>
                  <Button variant="primary">
                    새 사찰 등록
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {SAMPLE_TEMPLES.map((temple) => (
                    <TempleCard
                      key={temple.id}
                      name={temple.name}
                      location={`${temple.city}, ${temple.province}`}
                      rating={temple.rating}
                      reviewCount={temple.reviewCount}
                      features={temple.features.slice(0, 3).map(f => {
                        const featureMap: Record<string, string> = {
                          meditation: '명상',
                          dharma_talk: '법문',
                          templestay: '템플스테이',
                          tea_ceremony: '차명상',
                          cultural_programs: '문화체험',
                          walking_meditation: '걸음명상'
                        };
                        return featureMap[f] || f;
                      })}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 후기 탭 */}
            {activeTab === 'reviews' && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-semibold text-sage-900">수행 후기</h2>
                  <Button variant="primary">
                    후기 작성
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {SAMPLE_REVIEWS.map((review) => (
                    <ReviewCard
                      key={review.id}
                      title={review.title}
                      author={review.author.displayName}
                      avatar={review.author.avatar!}
                      rating={review.rating}
                      content={review.content}
                      date={review.createdAt}
                      temple={review.temple.name}
                      category={review.category}
                      likes={review.helpfulCount}
                      isVerified={review.author.isVerified}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 영성글 탭 */}
            {activeTab === 'posts' && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-semibold text-sage-900">영성 글</h2>
                  <Button variant="primary">
                    글 작성
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {SAMPLE_POSTS.map((post) => (
                    <PostCard
                      key={post.id}
                      title={post.title}
                      excerpt={post.excerpt!}
                      author={post.author.displayName}
                      publishedAt={post.createdAt}
                      readingTime={post.readingTime}
                      category={post.category}
                      tags={post.tags}
                      likeCount={post.likeCount}
                      commentCount={post.commentCount}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 모임 탭 */}
            {activeTab === 'gatherings' && (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-sage-100 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <LotusBloom size={48} color="#6b7280" animate={false} />
                </div>
                <h3 className="text-xl font-semibold text-sage-900 mb-4">
                  모임 기능 준비 중입니다
                </h3>
                <p className="text-sage-600 mb-8">
                  곧 다양한 영성 모임을 만나보실 수 있습니다
                </p>
                <Button variant="outline">
                  알림 받기
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}