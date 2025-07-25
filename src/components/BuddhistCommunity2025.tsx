import React, { useState, useEffect } from 'react';
import { Heart, Users, Sparkles, Volume2, Moon, Sun, ArrowRight, Play } from 'lucide-react';

export default function BuddhistCommunity2025() {
  const [breathPhase, setBreathPhase] = useState('inhale');
  const [darkMode, setDarkMode] = useState(false);
  const [userMood, setUserMood] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  // 호흡 애니메이션
  useEffect(() => {
    const interval = setInterval(() => {
      setBreathPhase(prev => prev === 'inhale' ? 'exhale' : 'inhale');
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 text-gray-900'
    }`}>
      {/* 플로팅 요소들 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-6xl opacity-10 animate-float">🪷</div>
        <div className="absolute top-40 right-20 text-4xl opacity-10 animate-float-delayed">☸️</div>
        <div className="absolute bottom-20 left-1/3 text-5xl opacity-10 animate-float">🕉️</div>
      </div>

      {/* 헤더 with 다크모드 토글 */}
      <header className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🪷</span>
            <h1 className="text-2xl font-bold">마음챙김</h1>
          </div>
          
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* 인터랙티브 명상 인트로 */}
      <section className="relative z-10 text-center py-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* 호흡 서클 */}
          <div className="mb-12 flex justify-center">
            <div className={`w-32 h-32 rounded-full transition-all duration-[4000ms] ${
              breathPhase === 'inhale' 
                ? 'scale-125 bg-amber-400 shadow-2xl' 
                : 'scale-100 bg-orange-400 shadow-md'
            }`}>
              <div className="w-full h-full flex items-center justify-center text-white font-medium">
                {breathPhase === 'inhale' ? '들숨' : '날숨'}
              </div>
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            마음의 평화를 찾는 여정
          </h2>
          
          <p className="text-xl mb-8 opacity-80">
            디지털 시대의 따뜻한 불교 커뮤니티
          </p>

          {/* 기분 선택 */}
          <div className="mb-8">
            <p className="mb-4">오늘 기분은 어떠신가요?</p>
            <div className="flex justify-center gap-4 flex-wrap">
              {['평온해요 😌', '불안해요 😰', '감사해요 🙏', '궁금해요 🤔'].map((mood) => (
                <button
                  key={mood}
                  onClick={() => setUserMood(mood)}
                  className={`px-4 py-2 rounded-full transition-all ${
                    userMood === mood 
                      ? 'bg-amber-500 text-white scale-110' 
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>

          {userMood && (
            <div className="animate-fade-in bg-white/30 backdrop-blur-sm rounded-2xl p-6 mb-8">
              <p className="text-lg mb-4">
                {userMood.includes('평온') && "평온한 마음을 유지하는 것은 큰 축복입니다. 🪷"}
                {userMood.includes('불안') && "불안한 마음도 자연스러운 것입니다. 함께 평화를 찾아봐요. 🕊️"}
                {userMood.includes('감사') && "감사하는 마음은 더 많은 축복을 불러옵니다. ✨"}
                {userMood.includes('궁금') && "배움의 시작은 궁금증에서 시작됩니다. 📿"}
              </p>
              <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full hover:shadow-lg transition-all">
                맞춤 법회 추천받기 <ArrowRight className="inline w-4 h-4 ml-1" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 벤토 박스 레이아웃 */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
          {/* 오늘의 법문 - 큰 카드 */}
          <div className="col-span-2 row-span-2 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-3xl p-6 flex flex-col justify-between group hover:scale-[1.02] transition-transform">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                <h3 className="font-bold text-xl">오늘의 법문</h3>
              </div>
              <p className="text-lg italic mb-2">
                "물방울이 돌을 뚫는 것은 힘 때문이 아니라 꾸준함 때문이다"
              </p>
              <p className="text-sm opacity-70">- 법정 스님</p>
            </div>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2 text-purple-600 dark:text-purple-300 hover:underline"
            >
              {isPlaying ? <Volume2 className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              법문 듣기
            </button>
          </div>

          {/* 실시간 참여자 */}
          <div className="bg-green-100 dark:bg-green-900 rounded-3xl p-6 flex flex-col justify-center items-center hover:scale-[1.05] transition-transform">
            <Users className="w-8 h-8 mb-2 text-green-600 dark:text-green-300" />
            <div className="text-3xl font-bold">127</div>
            <div className="text-sm opacity-70">실시간 참여</div>
          </div>

          {/* 마음 날씨 */}
          <div className="bg-blue-100 dark:bg-blue-900 rounded-3xl p-6 flex flex-col justify-center items-center hover:scale-[1.05] transition-transform cursor-pointer">
            <div className="text-4xl mb-2">☀️</div>
            <div className="text-sm font-medium">마음 날씨</div>
            <div className="text-xs opacity-70">맑음</div>
          </div>

          {/* 이번 주 인기 법회 */}
          <div className="col-span-2 bg-amber-100 dark:bg-amber-900 rounded-3xl p-6 hover:scale-[1.02] transition-transform">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              이번 주 인기 법회
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">초보자 명상 입문</span>
                <span className="text-xs bg-amber-200 dark:bg-amber-800 px-2 py-1 rounded-full">234명</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">자비 명상 수행</span>
                <span className="text-xs bg-amber-200 dark:bg-amber-800 px-2 py-1 rounded-full">189명</span>
              </div>
            </div>
          </div>

          {/* 커뮤니티 활동 */}
          <div className="col-span-2 bg-gradient-to-br from-indigo-100 to-cyan-100 dark:from-indigo-900 dark:to-cyan-900 rounded-3xl p-6 hover:scale-[1.02] transition-transform">
            <h3 className="font-bold mb-3">실시간 커뮤니티</h3>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-indigo-300 dark:bg-indigo-700"></div>
                <div className="flex-1">
                  <p className="text-sm">명상 후 마음이 너무 편안해졌어요 🙏</p>
                  <p className="text-xs opacity-50">방금 전</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="relative z-10 text-center py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold mb-6">
            당신의 마음에도 평화가 깃들기를
          </h3>
          <p className="text-lg mb-8 opacity-80">
            전국 사찰의 법회 정보와 따뜻한 불자들의 이야기가 기다립니다
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-lg font-medium hover:shadow-xl transition-all transform hover:scale-105">
              법회 리뷰 둘러보기
            </button>
            <button className="px-8 py-4 bg-white/50 dark:bg-gray-800 backdrop-blur-sm rounded-full text-lg font-medium hover:bg-white/70 dark:hover:bg-gray-700 transition-all">
              불자 소통 참여하기
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}