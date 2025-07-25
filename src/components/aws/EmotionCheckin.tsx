import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EmotionService, EmotionCheckin as EmotionCheckinType, EmotionStats, CreateEmotionData } from '../../services/EmotionService';
import { User } from '../../services/AuthService';

interface EmotionCheckinProps {
  user: User | null;
  onBack: () => void;
}

export const EmotionCheckin: React.FC<EmotionCheckinProps> = ({ user, onBack }) => {
  const [currentView, setCurrentView] = useState<'checkin' | 'history' | 'stats'>('checkin');
  const [todaysEmotion, setTodaysEmotion] = useState<EmotionCheckinType | null>(null);
  const [emotionHistory, setEmotionHistory] = useState<EmotionCheckinType[]>([]);
  const [emotionStats, setEmotionStats] = useState<EmotionStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [checkinData, setCheckinData] = useState<CreateEmotionData>({
    emotion: '',
    intensity: 5,
    description: '',
    note: ''
  });

  const buddhistEmotions = EmotionService.getBuddhistEmotions();

  useEffect(() => {
    if (user) {
      loadTodaysEmotion();
      loadEmotionHistory();
      loadEmotionStats();
    }
  }, [user]);

  const loadTodaysEmotion = async () => {
    try {
      const emotion = await EmotionService.getTodaysEmotion();
      setTodaysEmotion(emotion);
    } catch (error) {
      console.error('오늘의 감정 로드 실패:', error);
    }
  };

  const loadEmotionHistory = async () => {
    try {
      const response = await EmotionService.getEmotionHistory({ limit: 30 });
      setEmotionHistory(response.checkins);
    } catch (error) {
      console.error('감정 기록 로드 실패:', error);
    }
  };

  const loadEmotionStats = async () => {
    try {
      const response = await EmotionService.getEmotionStats('30d');
      setEmotionStats(response.stats);
    } catch (error) {
      console.error('감정 통계 로드 실패:', error);
    }
  };

  const handleEmotionCheckin = async () => {
    if (!user || !checkinData.emotion) {
      alert('감정을 선택해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      await EmotionService.createEmotionCheckin(checkinData);
      alert('오늘의 감정이 기록되었습니다 🙏');
      
      // 초기화 및 새로고침
      setCheckinData({
        emotion: '',
        intensity: 5,
        description: '',
        note: ''
      });
      
      await loadTodaysEmotion();
      await loadEmotionHistory();
      await loadEmotionStats();
      
    } catch (error) {
      console.error('감정 체크인 실패:', error);
      alert('감정 체크인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const getEmotionIcon = (emotion: string): string => {
    const iconMap: Record<string, string> = {
      '평화로운': '🕊️',
      '감사한': '🙏',
      '기쁜': '😊',
      '차분한': '😌',
      '희망찬': '🌟',
      '고요한': '🧘‍♀️',
      '자비로운': '💚',
      '집중된': '🎯',
      '불안한': '😰',
      '슬픈': '😢',
      '화난': '😤',
      '혼란스러운': '😵',
      '두려운': '😨',
      '성찰적인': '🤔',
      '겸손한': '🙇‍♀️'
    };
    
    return iconMap[emotion] || '💙';
  };

  const getIntensityColor = (intensity: number): string => {
    if (intensity <= 3) return 'text-blue-500';
    if (intensity <= 6) return 'text-yellow-500';
    return 'text-red-500';
  };

  const renderCheckinView = () => (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-3xl mx-auto mb-4 flex items-center justify-center lotus-bloom">
          <span className="text-white text-3xl">🧘‍♀️</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">나의 마음</h1>
        <p className="text-gray-600">오늘 당신의 마음은 어떤가요?</p>
      </div>

      {/* 오늘의 감정 체크인 */}
      {todaysEmotion ? (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 mb-8 text-center">
          <span className="text-6xl mb-4 block">{getEmotionIcon(todaysEmotion.emotion)}</span>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
            오늘은 <span className="text-blue-600">{todaysEmotion.emotion}</span> 마음이네요
          </h3>
          <p className="text-gray-600 mb-4">강도: {todaysEmotion.intensity}/10</p>
          {todaysEmotion.description && (
            <p className="text-gray-700 italic">"{todaysEmotion.description}"</p>
          )}
          <div className="flex justify-center space-x-4 mt-6">
            <button
              onClick={() => setCurrentView('history')}
              className="bg-blue-100 text-blue-700 px-6 py-2 rounded-lg hover:bg-blue-200 transition-colors"
            >
              기록 보기
            </button>
            <button
              onClick={() => setCurrentView('stats')}
              className="bg-purple-100 text-purple-700 px-6 py-2 rounded-lg hover:bg-purple-200 transition-colors"
            >
              통계 보기
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            오늘의 감정을 체크인해보세요
          </h3>

          {/* 감정 선택 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              지금 느끼고 있는 감정을 선택해주세요
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {buddhistEmotions.map((emotion) => (
                <button
                  key={emotion.name}
                  onClick={() => setCheckinData({ ...checkinData, emotion: emotion.name })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    checkinData.emotion === emotion.name
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-3xl mb-2">{getEmotionIcon(emotion.name)}</div>
                  <div className="text-sm font-medium text-gray-900">{emotion.name}</div>
                  <div className={`text-xs mt-1 ${
                    emotion.category === 'positive' ? 'text-green-600' :
                    emotion.category === 'negative' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {emotion.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 감정 강도 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              감정의 강도는 어느 정도인가요? ({checkinData.intensity}/10)
            </label>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">약함</span>
              <input
                type="range"
                min="1"
                max="10"
                value={checkinData.intensity}
                onChange={(e) => setCheckinData({ ...checkinData, intensity: parseInt(e.target.value) })}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm text-gray-500">강함</span>
            </div>
            <div className="flex justify-center mt-2">
              <span className={`text-2xl font-bold ${getIntensityColor(checkinData.intensity)}`}>
                {checkinData.intensity}
              </span>
            </div>
          </div>

          {/* 상세 설명 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              오늘의 감정에 대해 더 자세히 설명해주세요 (선택사항)
            </label>
            <textarea
              value={checkinData.description}
              onChange={(e) => setCheckinData({ ...checkinData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="어떤 상황에서 이런 감정을 느꼈는지, 무엇이 영향을 주었는지 자유롭게 적어보세요"
            />
          </div>

          {/* 개인 메모 */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              개인적인 메모 (선택사항)
            </label>
            <textarea
              value={checkinData.note}
              onChange={(e) => setCheckinData({ ...checkinData, note: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="자신만 볼 수 있는 개인적인 메모를 작성하세요"
            />
          </div>

          {/* 체크인 버튼 */}
          <div className="text-center">
            <button
              onClick={handleEmotionCheckin}
              disabled={!checkinData.emotion || isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              {isLoading ? '기록 중...' : '감정 체크인'}
            </button>
          </div>
        </div>
      )}

      {/* 마음챙김 추천 */}
      <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl p-6 text-center">
        <span className="text-4xl mb-4 block">🌸</span>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">오늘의 마음챙김</h3>
        <p className="text-gray-700 mb-4 italic">
          "모든 감정은 구름과 같아서 결국 지나간다"
        </p>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors">
          명상 시작하기
        </button>
      </div>
    </div>
  );

  const renderHistoryView = () => (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">감정 기록</h1>
        <button
          onClick={() => setCurrentView('checkin')}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
        >
          ← 체크인
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50">
        {emotionHistory.length > 0 ? (
          <div className="space-y-4">
            {emotionHistory.map((emotion) => (
              <div key={emotion.date} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl">{getEmotionIcon(emotion.emotion)}</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">{emotion.emotion}</h4>
                    <p className="text-sm text-gray-500">{emotion.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${getIntensityColor(emotion.intensity)}`}>
                    {emotion.intensity}/10
                  </div>
                  {emotion.description && (
                    <p className="text-sm text-gray-600 max-w-xs truncate">
                      {emotion.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">📖</span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">아직 기록이 없습니다</h3>
            <p className="text-gray-600">감정 체크인을 시작해보세요!</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderStatsView = () => (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">감정 통계</h1>
        <button
          onClick={() => setCurrentView('checkin')}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
        >
          ← 체크인
        </button>
      </div>

      {emotionStats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 평균 강도 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">평균 감정 강도</h3>
            <div className="text-center">
              <div className={`text-4xl font-bold ${getIntensityColor(emotionStats.averageIntensity)}`}>
                {emotionStats.averageIntensity.toFixed(1)}/10
              </div>
              <p className="text-gray-600 mt-2">최근 30일 평균</p>
            </div>
          </div>

          {/* 연속 체크인 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">연속 체크인</h3>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600">
                {emotionStats.checkinStreak}일
              </div>
              <p className="text-gray-600 mt-2">연속으로 체크인</p>
            </div>
          </div>

          {/* 긍정 감정 비율 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">긍정 감정 비율</h3>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">
                {emotionStats.positiveEmotionRate}%
              </div>
              <p className="text-gray-600 mt-2">긍정적인 마음</p>
            </div>
          </div>

          {/* 감정 분포 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">감정 분포</h3>
            <div className="space-y-3">
              {Object.entries(emotionStats.emotionDistribution)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([emotion, count]) => (
                <div key={emotion} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getEmotionIcon(emotion)}</span>
                    <span className="font-medium">{emotion}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(count / Math.max(...Object.values(emotionStats.emotionDistribution))) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{count}회</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 인사이트 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">인사이트</h3>
            <div className="space-y-3">
              {emotionStats.insights.slice(0, 3).map((insight, index) => (
                <div key={index} className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-900">{insight.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 text-center">
          <span className="text-6xl mb-4 block">📊</span>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">통계를 준비하고 있습니다</h3>
          <p className="text-gray-600">더 많은 감정 기록이 쌓이면 자세한 통계를 제공합니다</p>
        </div>
      )}
    </div>
  );

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 text-center">
        <span className="text-6xl mb-4 block">🔒</span>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">로그인이 필요합니다</h1>
        <p className="text-gray-600 mb-8">감정 체크인을 위해서는 로그인이 필요합니다.</p>
        <button
          onClick={onBack}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen lotus-gradient">
      {/* 네비게이션 */}
      <div className="bg-white/70 backdrop-blur-lg border-b border-gray-200/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
            >
              <span>← 홈으로</span>
            </button>
            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentView('checkin')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'checkin'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                체크인
              </button>
              <button
                onClick={() => setCurrentView('history')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'history'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                기록
              </button>
              <button
                onClick={() => setCurrentView('stats')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'stats'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                통계
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentView === 'checkin' && renderCheckinView()}
          {currentView === 'history' && renderHistoryView()}
          {currentView === 'stats' && renderStatsView()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};