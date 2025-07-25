import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BuddhistCommunityLanding: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 간단한 인터랙션 추가
    const cards = document.querySelectorAll('.card-hover');
    cards.forEach(card => {
      const handleMouseEnter = () => {
        (card as HTMLElement).style.transform = 'translateY(-4px)';
      };
      const handleMouseLeave = () => {
        (card as HTMLElement).style.transform = 'translateY(0)';
      };
      
      card.addEventListener('mouseenter', handleMouseEnter);
      card.addEventListener('mouseleave', handleMouseLeave);
      
      // Clean up function will be called when component unmounts
      return () => {
        card.removeEventListener('mouseenter', handleMouseEnter);
        card.removeEventListener('mouseleave', handleMouseLeave);
      };
    });
  }, []);

  const simulateMessage = () => {
    const messageInput = document.querySelector('input[placeholder*="메시지"]') as HTMLInputElement;
    if (messageInput && messageInput.value.trim()) {
      messageInput.value = '';
      // 간단한 피드백
      const notification = document.createElement('div');
      notification.textContent = '메시지가 전송되었습니다 🙏';
      notification.className = 'fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg text-sm z-50';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      simulateMessage();
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap');
        
        body {
            font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .lotus-gradient {
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 25%, #bae6fd 50%, #7dd3fc 75%, #38bdf8 100%);
        }
        
        .sage-gradient {
            background: linear-gradient(135deg, #f6f7f6 0%, #e8ebe8 50%, #d4d9d4 100%);
        }
        
        .card-hover {
            transition: all 0.3s ease;
        }
        
        .card-hover:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        
        .lotus-bloom {
            animation: lotus-pulse 4s ease-in-out infinite;
        }
        
        @keyframes lotus-pulse {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.05); opacity: 1; }
        }
        
        .peaceful-fade {
            animation: peaceful-fade 2s ease-in-out;
        }
        
        @keyframes peaceful-fade {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      
      <div className="min-h-screen lotus-gradient">
        {/* 상단 네비게이션 */}
        <nav className="bg-white/70 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center lotus-bloom">
                  <span className="text-white text-xl">🪷</span>
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">불교 커뮤니티</h1>
                  <p className="text-xs text-gray-500">선원 - 디지털 법당</p>
                </div>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                로그인
              </button>
            </div>
          </div>
        </nav>

        {/* 메인 콘텐츠 - 새로운 2분할 레이아웃 */}
        <main className="min-h-[calc(100vh-4rem)] flex">
          {/* 왼쪽 절반 - 불교 그림과 이모티콘 */}
          <div className="w-1/2 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex flex-col items-center justify-center p-12 relative overflow-hidden">
            {/* 배경 장식 이모티콘들 */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-10 left-10 text-6xl opacity-20 lotus-bloom">🪷</div>
              <div className="absolute top-20 right-16 text-4xl opacity-15">🕉️</div>
              <div className="absolute top-1/3 left-16 text-5xl opacity-10">☸️</div>
              <div className="absolute bottom-1/3 right-12 text-7xl opacity-25">🧘‍♀️</div>
              <div className="absolute bottom-20 left-20 text-5xl opacity-20">📿</div>
              <div className="absolute top-1/2 right-1/4 text-3xl opacity-15">🏛️</div>
              <div className="absolute bottom-40 right-20 text-4xl opacity-20">🌸</div>
              <div className="absolute top-40 left-1/3 text-6xl opacity-15">🙏</div>
              <div className="absolute bottom-1/4 left-1/3 text-4xl opacity-25">🍵</div>
              <div className="absolute top-2/3 right-1/3 text-5xl opacity-20">✨</div>
            </div>

            {/* 메인 불교 아트워크 */}
            <div className="relative z-10 text-center">
              {/* 중앙 큰 연꽃 */}
              <div className="w-48 h-48 mx-auto mb-8 relative">
                <div className="w-full h-full bg-gradient-to-br from-pink-200 via-orange-200 to-yellow-200 rounded-full flex items-center justify-center lotus-bloom shadow-2xl">
                  <span className="text-8xl">🪷</span>
                </div>
                {/* 주변 작은 이모티콘들 */}
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-2xl">☸️</span>
                </div>
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-2xl">🕉️</span>
                </div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-2xl">📿</span>
                </div>
                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-2xl">🙏</span>
                </div>
              </div>

              {/* 불교 예술 패턴 */}
              <div className="flex justify-center space-x-6 mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-200 to-indigo-200 rounded-full flex items-center justify-center">
                  <span className="text-3xl">🧘‍♀️</span>
                </div>
                <div className="w-20 h-20 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full flex items-center justify-center">
                  <span className="text-3xl">🏛️</span>
                </div>
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full flex items-center justify-center">
                  <span className="text-3xl">🌸</span>
                </div>
              </div>

              {/* 하단 장식 */}
              <div className="flex justify-center space-x-4">
                <span className="text-3xl opacity-70">🍵</span>
                <span className="text-3xl opacity-70">✨</span>
                <span className="text-3xl opacity-70">🌙</span>
                <span className="text-3xl opacity-70">⭐</span>
                <span className="text-3xl opacity-70">🕯️</span>
              </div>
            </div>
          </div>

          {/* 오른쪽 절반 - 텍스트, 링크, 실시간 소통 */}
          <div className="w-1/2 bg-white flex flex-col">
            {/* 상단 환영 섹션 */}
            <div className="p-12 pb-6">
              <div className="mb-8">
                <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
                  선원에 오신 것을<br />환영합니다
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  전국 불자들이 모여 수행 경험을 나누고,<br />
                  지혜를 함께 키워가는 평화로운 디지털 법당입니다
                </p>

                {/* 주요 기능 링크들 */}
                <div className="space-y-4 mb-8">
                  <button 
                    className="w-full text-left p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 group"
                    onClick={() => navigate('/temple-reviews')}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <span className="text-2xl">🏛️</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">법회 리뷰</h3>
                        <p className="text-sm text-gray-600">전국 사찰의 법회와 수행 프로그램 후기</p>
                      </div>
                      <span className="text-blue-600 font-medium">→</span>
                    </div>
                  </button>

                  <button 
                    className="w-full text-left p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-all duration-300 group"
                    onClick={() => navigate('/community')}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                        <span className="text-2xl">💬</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">불자 소통</h3>
                        <p className="text-sm text-gray-600">다른 불자들과 수행 경험과 일상 나누기</p>
                      </div>
                      <span className="text-purple-600 font-medium">→</span>
                    </div>
                  </button>
                </div>

                {/* 오늘의 법문 */}
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-6 mb-6">
                  <div className="text-center">
                    <span className="text-3xl mb-3 block">🌸</span>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">오늘의 법문</h3>
                    <p className="text-gray-700 italic mb-3">
                      "마음이 평온하면 세상도 평온하다"
                    </p>
                    <p className="text-sm text-gray-600">
                      잠시 멈춰서 호흡에 집중해보세요
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 실시간 불자 소통 섹션 */}
            <div className="flex-1 px-12 pb-12">
              <div className="bg-gray-50 rounded-2xl p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">실시간 불자 소통</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600">12명 접속중</span>
                  </div>
                </div>

                {/* 채팅 메시지들 */}
                <div className="flex-1 space-y-3 mb-4 overflow-y-auto">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs">📿</span>
                    </div>
                    <div className="bg-white rounded-lg px-3 py-2 shadow-sm">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900 text-sm">지혜를찾는자</span>
                        <span className="text-xs text-gray-500">방금 전</span>
                      </div>
                      <p className="text-sm text-gray-800">오늘 처음 명상을 시작해보려는데, 어떤 방법이 좋을까요?</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs">🕉️</span>
                    </div>
                    <div className="bg-blue-50 rounded-lg px-3 py-2 shadow-sm">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900 text-sm">명상의달인</span>
                        <span className="text-xs text-gray-500">1분 전</span>
                      </div>
                      <p className="text-sm text-gray-800">호흡에 집중하는 것부터 시작해보세요. 처음에는 5분부터요 🙏</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs">🪷</span>
                    </div>
                    <div className="bg-white rounded-lg px-3 py-2 shadow-sm">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900 text-sm">연꽃길</span>
                        <span className="text-xs text-gray-500">2분 전</span>
                      </div>
                      <p className="text-sm text-gray-800">저도 처음에는 어려웠는데 매일 조금씩 하다보니 마음이 평온해졌어요 ✨</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs">🍵</span>
                    </div>
                    <div className="bg-white rounded-lg px-3 py-2 shadow-sm">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900 text-sm">차명상수행자</span>
                        <span className="text-xs text-gray-500">3분 전</span>
                      </div>
                      <p className="text-sm text-gray-800">차명상도 추천드려요. 차 한 잔의 향과 맛에 집중하면서 현재에 머무는 연습을 해보세요</p>
                    </div>
                  </div>
                </div>

                {/* 메시지 입력 */}
                <div className="flex space-x-2">
                  <input 
                    type="text" 
                    placeholder="따뜻한 마음으로 메시지를 입력하세요..."
                    className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={handleKeyPress}
                  />
                  <button 
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                    onClick={simulateMessage}
                  >
                    전송
                  </button>
                </div>

                {/* 채팅 참여 버튼 */}
                <div className="mt-4 text-center">
                  <button 
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                    onClick={() => navigate('/community')}
                  >
                    채팅방 입장하기 →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* 하단 푸터 */}
        <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200/50">
          <div className="px-6 py-4">
            <div className="flex justify-center items-center space-x-2">
              <span className="text-lg">🪷</span>
              <span className="text-sm font-medium text-gray-700">불교 커뮤니티</span>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-gray-500">모든 중생이 고통에서 벗어나 진정한 행복을 얻기를</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default BuddhistCommunityLanding;