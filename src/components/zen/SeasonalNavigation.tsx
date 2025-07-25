import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Season = 'spring' | 'summer' | 'autumn' | 'winter';

interface UserGrowthStage {
  spiritualLevel: number; // 0-100: 영성적 성숙도
  participationDays: number; // 참여 일수
  contributionScore: number; // 기여도 점수
  contemplationDepth: number; // 성찰의 깊이
}

interface SeasonalFeature {
  id: string;
  title: string;
  icon: string;
  description: string;
  minLevel: number; // 필요한 최소 영성적 레벨
  season: Season;
  category: 'reflection' | 'community' | 'practice' | 'wisdom';
}

interface SeasonalNavigationProps {
  userStage: UserGrowthStage;
  onFeatureSelect?: (feature: SeasonalFeature) => void;
  className?: string;
}

const seasonalFeatures: SeasonalFeature[] = [
  // 봄 - 새로운 시작
  { id: 'first-thought', title: '첫 마음', icon: '🌱', description: '처음 떠오르는 생각을 기록하세요', minLevel: 0, season: 'spring', category: 'reflection' },
  { id: 'welcome-circle', title: '환영의 원', icon: '🤗', description: '새로운 분들을 따뜻하게 맞이하세요', minLevel: 5, season: 'spring', category: 'community' },
  { id: 'morning-prayer', title: '새벽 기도', icon: '🌅', description: '하루를 시작하는 마음가짐', minLevel: 10, season: 'spring', category: 'practice' },
  
  // 여름 - 활발한 교류
  { id: 'dharma-discussion', title: '법담', icon: '💬', description: '깊이 있는 가르침을 나누세요', minLevel: 25, season: 'summer', category: 'wisdom' },
  { id: 'community-garden', title: '공동체 정원', icon: '🌻', description: '함께 키우는 마음의 정원', minLevel: 30, season: 'summer', category: 'community' },
  { id: 'walking-meditation', title: '행선', icon: '🚶‍♂️', description: '걸으며 하는 명상 여정', minLevel: 35, season: 'summer', category: 'practice' },
  
  // 가을 - 성찰과 감사  
  { id: 'gratitude-journal', title: '감사 일기', icon: '🍂', description: '지나온 여정에 감사하며', minLevel: 50, season: 'autumn', category: 'reflection' },
  { id: 'wisdom-sharing', title: '지혜 나눔', icon: '🧘‍♀️', description: '깨달은 바를 후배들과 나누세요', minLevel: 60, season: 'autumn', category: 'wisdom' },
  { id: 'silent-retreat', title: '고요한 정진', icon: '🤫', description: '침묵 속에서 마음을 돌아보세요', minLevel: 65, season: 'autumn', category: 'practice' },
  
  // 겨울 - 깊은 명상
  { id: 'inner-silence', title: '내적 고요', icon: '❄️', description: '마음 깊은 곳의 평화를 찾아가세요', minLevel: 75, season: 'winter', category: 'reflection' },
  { id: 'compassion-practice', title: '자비 수행', icon: '💝', description: '모든 존재를 향한 자비를 기르세요', minLevel: 85, season: 'winter', category: 'practice' },
  { id: 'enlightenment-path', title: '깨달음의 길', icon: '✨', description: '궁극의 진리를 향한 여정', minLevel: 95, season: 'winter', category: 'wisdom' }
];

export const SeasonalNavigation: React.FC<SeasonalNavigationProps> = ({
  userStage,
  onFeatureSelect,
  className = ""
}) => {
  const [currentSeason, setCurrentSeason] = useState<Season>('spring');
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);
  const [transitioningToSeason, setTransitioningToSeason] = useState<Season | null>(null);

  // 사용자 레벨에 따른 계절 자동 결정
  useEffect(() => {
    const { spiritualLevel } = userStage;
    let newSeason: Season;
    
    if (spiritualLevel < 25) newSeason = 'spring';
    else if (spiritualLevel < 50) newSeason = 'summer';
    else if (spiritualLevel < 75) newSeason = 'autumn';
    else newSeason = 'winter';

    if (newSeason !== currentSeason) {
      setTransitioningToSeason(newSeason);
      setTimeout(() => {
        setCurrentSeason(newSeason);
        setTransitioningToSeason(null);
      }, 1000);
    }
  }, [userStage.spiritualLevel, currentSeason]);

  // 현재 계절에 맞는 기능들 필터링
  const availableFeatures = seasonalFeatures.filter(
    feature => feature.season === currentSseason && feature.minLevel <= userStage.spiritualLevel
  );

  const upcomingFeatures = seasonalFeatures.filter(
    feature => feature.season === currentSeason && feature.minLevel > userStage.spiritualLevel
  );

  // 계절별 테마 색상
  const seasonalThemes = {
    spring: {
      primary: 'from-green-400 to-emerald-500',
      secondary: 'from-green-50 to-emerald-50',
      accent: 'text-green-600',
      background: 'bg-gradient-to-br from-green-50 via-emerald-50 to-green-100'
    },
    summer: {
      primary: 'from-yellow-400 to-orange-500',
      secondary: 'from-yellow-50 to-orange-50',
      accent: 'text-yellow-600',
      background: 'bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-100'
    },
    autumn: {
      primary: 'from-amber-400 to-red-500',
      secondary: 'from-amber-50 to-red-50',
      accent: 'text-amber-600',
      background: 'bg-gradient-to-br from-amber-50 via-red-50 to-amber-100'
    },
    winter: {
      primary: 'from-blue-400 to-indigo-500',
      secondary: 'from-blue-50 to-indigo-50',
      accent: 'text-blue-600',
      background: 'bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100'
    }
  };

  const theme = seasonalThemes[currentSeason];

  // 계절 이름과 설명
  const seasonalInfo = {
    spring: { name: '봄 - 새로운 시작', description: '마음의 새싹이 돋아나는 시기입니다' },
    summer: { name: '여름 - 활발한 교류', description: '공동체와 함께 성장하는 시기입니다' },
    autumn: { name: '가을 - 성찰과 감사', description: '지나온 여정을 돌아보는 시기입니다' },
    winter: { name: '겨울 - 깊은 명상', description: '내면 깊숙한 평화를 찾는 시기입니다' }
  };

  const handleFeatureClick = (feature: SeasonalFeature) => {
    if (feature.minLevel <= userStage.spiritualLevel) {
      onFeatureSelect?.(feature);
    }
  };

  return (
    <motion.div 
      className={`relative min-h-screen ${theme.background} ${className}`}
      key={currentSeason}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* 계절 전환 효과 */}
      <AnimatePresence>
        {transitioningToSeason && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="text-center"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-6xl mb-4">
                {transitioningToSeason === 'spring' && '🌸'}
                {transitioningToSeason === 'summer' && '🌻'}
                {transitioningToSeason === 'autumn' && '🍂'}
                {transitioningToSeason === 'winter' && '❄️'}
              </div>
              <h2 className="text-2xl font-light text-gray-700">
                {seasonalInfo[transitioningToSeason].name}
              </h2>
              <p className="text-gray-500 mt-2">
                새로운 계절이 시작됩니다...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 헤더 영역 */}
      <motion.header 
        className="relative overflow-hidden py-16 px-6"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            className="text-8xl mb-6"
            animate={{ 
              scale: [1, 1.05, 1],
              rotateZ: [0, 1, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
          >
            {currentSeason === 'spring' && '🌸'}
            {currentSeason === 'summer' && '🌻'}
            {currentSeason === 'autumn' && '🍂'}
            {currentSeason === 'winter' && '❄️'}
          </motion.div>
          
          <h1 className="text-4xl font-light text-gray-800 mb-4">
            {seasonalInfo[currentSeason].name}
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            {seasonalInfo[currentSeason].description}
          </p>

          {/* 영성적 성장 지표 */}
          <motion.div 
            className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">영성적 성장</span>
              <span className="text-sm font-medium text-gray-800">
                Level {userStage.spiritualLevel}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className={`h-2 rounded-full bg-gradient-to-r ${theme.primary}`}
                initial={{ width: 0 }}
                animate={{ width: `${userStage.spiritualLevel}%` }}
                transition={{ duration: 1.5, delay: 0.6 }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>참여 {userStage.participationDays}일</span>
              <span>성찰 깊이 {userStage.contemplationDepth}/10</span>
            </div>
          </motion.div>
        </div>
      </motion.header>

      {/* 이용 가능한 기능들 */}
      <section className="px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-2xl font-light text-gray-800 mb-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            현재 이용할 수 있는 길
          </motion.h2>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, staggerChildren: 0.1 }}
          >
            {availableFeatures.map((feature, index) => (
              <motion.div
                key={feature.id}
                className="group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                onClick={() => handleFeatureClick(feature)}
                onMouseEnter={() => setHoveredFeature(feature.id)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 h-full shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <div className="text-4xl mb-4 text-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 text-center mb-4">
                    {feature.description}
                  </p>
                  
                  <div className="flex justify-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs ${theme.secondary} ${theme.accent}`}>
                      {feature.category === 'reflection' && '성찰'}
                      {feature.category === 'community' && '공동체'}
                      {feature.category === 'practice' && '수행'}
                      {feature.category === 'wisdom' && '지혜'}
                    </span>
                  </div>

                  {/* 호버 시 추가 정보 */}
                  <AnimatePresence>
                    {hoveredFeature === feature.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-gray-200"
                      >
                        <div className="text-xs text-gray-500 text-center">
                          클릭하여 시작하세요 🚪
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* 다음 단계 미리보기 */}
          {upcomingFeatures.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <h3 className="text-xl font-light text-gray-600 mb-6 text-center">
                앞으로 열릴 길들 🌱
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingFeatures.slice(0, 3).map((feature, index) => (
                  <motion.div
                    key={feature.id}
                    className="bg-white/40 backdrop-blur-sm rounded-xl p-4 text-center opacity-60"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 0.6, scale: 1 }}
                    transition={{ delay: 1.7 + index * 0.1 }}
                  >
                    <div className="text-2xl mb-2">{feature.icon}</div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-xs text-gray-500 mb-2">
                      Level {feature.minLevel} 필요
                    </p>
                    <div className="text-xs text-gray-400">
                      {feature.minLevel - userStage.spiritualLevel}만큼 더 성장하시면 열립니다
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* 계절 변경 버튼 (디버깅용) */}
      <div className="fixed bottom-4 right-4 flex space-x-2">
        {(['spring', 'summer', 'autumn', 'winter'] as Season[]).map(season => (
          <motion.button
            key={season}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-lg ${
              currentSeason === season 
                ? 'bg-white shadow-xl scale-110' 
                : 'bg-white/70 hover:bg-white/90'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentSeason(season)}
          >
            {season === 'spring' && '🌸'}
            {season === 'summer' && '🌻'}
            {season === 'autumn' && '🍂'}
            {season === 'winter' && '❄️'}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default SeasonalNavigation;