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

        {/* 메인 콘텐츠 */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {/* 환영 섹션 */}
          <div className="text-center py-12 peaceful-fade">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mx-auto mb-6 flex items-center justify-center lotus-bloom">
              <span className="text-white text-4xl">🪷</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              선원에 오신 것을 환영합니다
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              전국 불자들이 모여 수행 경험을 나누고, 지혜를 함께 키워가는 평화로운 디지털 법당입니다
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                둘러보기 시작
              </button>
              <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-lg font-medium transition-colors">
                회원가입
              </button>
            </div>
          </div>

          {/* 주요 기능 카드들 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* 법회 리뷰 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 card-hover peaceful-fade" style={{animationDelay: '0.2s'}}>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🏛️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">법회 리뷰</h3>
              <p className="text-gray-600 mb-4">전국 사찰의 법회와 수행 프로그램에 대한 진솔한 후기를 작성하고 읽어보세요.</p>
              <button 
                className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                onClick={() => navigate('/temple-reviews')}
              >
                리뷰 둘러보기 →
              </button>
            </div>

            {/* 불자 소통 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 card-hover peaceful-fade" style={{animationDelay: '0.4s'}}>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">불자 소통</h3>
              <p className="text-gray-600 mb-4">다른 불자들과 수행 경험을 나누고, 일상의 고민을 따뜻하게 상담받으세요.</p>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
                채팅 참여하기 →
              </button>
            </div>

            {/* 나의 마음 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 card-hover peaceful-fade" style={{animationDelay: '0.6s'}}>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🧘‍♀️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">나의 마음</h3>
              <p className="text-gray-600 mb-4">오늘의 감정 상태를 체크하고, 마음챙김 명상으로 평온을 찾아보세요.</p>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
                마음 체크하기 →
              </button>
            </div>
          </div>

          {/* 최근 활동 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 최근 법회 리뷰 */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 peaceful-fade" style={{animationDelay: '0.8s'}}>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">최근 법회 리뷰</h3>
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm">🧘‍♀️</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900">평화로운마음</span>
                        <span className="text-yellow-500">★★★★★</span>
                      </div>
                      <p className="text-gray-600 text-sm">조계사 새벽 명상이 정말 좋았습니다. 고요한 법당에서...</p>
                      <p className="text-gray-400 text-xs mt-1">2시간 전 • 조계사</p>
                    </div>
                  </div>
                </div>
                <div className="border-b border-gray-100 pb-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-sm">🍵</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900">차명상수행자</span>
                        <span className="text-yellow-500">★★★★★</span>
                      </div>
                      <p className="text-gray-600 text-sm">봉은사 차명상 프로그램에 참여했는데, 한 잔의 차에...</p>
                      <p className="text-gray-400 text-xs mt-1">1일 전 • 봉은사</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 실시간 소통 */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 peaceful-fade" style={{animationDelay: '1s'}}>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">실시간 불자 소통</h3>
              <div className="space-y-4 mb-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-xs">📿</span>
                  </div>
                  <div className="bg-gray-100 rounded-lg px-3 py-2 flex-1">
                    <p className="text-sm text-gray-800">오늘 처음 명상을 시작해보려는데, 어떤 방법이 좋을까요?</p>
                    <p className="text-xs text-gray-500 mt-1">지혜를찾는자 • 방금 전</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs">🕉️</span>
                  </div>
                  <div className="bg-blue-50 rounded-lg px-3 py-2 flex-1">
                    <p className="text-sm text-gray-800">호흡에 집중하는 것부터 시작해보세요. 코로 들이쉬고 입으로 내쉬면서...</p>
                    <p className="text-xs text-gray-500 mt-1">명상의달인 • 1분 전</p>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  placeholder="따뜻한 마음으로 메시지를 입력하세요..."
                  className="flex-1 px-3 py-2 bg-white/70 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={handleKeyPress}
                />
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                  onClick={simulateMessage}
                >
                  전송
                </button>
              </div>
            </div>
          </div>

          {/* 오늘의 마음챙김 */}
          <div className="mt-12 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl p-8 text-center peaceful-fade" style={{animationDelay: '1.2s'}}>
            <span className="text-4xl mb-4 block">🌸</span>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">오늘의 마음챙김</h3>
            <p className="text-lg text-gray-700 mb-6 italic">
              "마음이 평온하면 세상도 평온하다"
            </p>
            <p className="text-gray-600 mb-6">
              잠시 멈춰서 호흡에 집중해보세요. 지금 이 순간, 여기에 온전히 머물러보세요.
            </p>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              명상 시작하기
            </button>
          </div>
        </main>

        {/* 하단 */}
        <footer className="bg-white/50 backdrop-blur-sm border-t border-gray-200/50 mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            <div className="text-center">
              <div className="flex justify-center items-center space-x-2 mb-4">
                <span className="text-2xl">🪷</span>
                <span className="text-lg font-semibold text-gray-900">불교 커뮤니티</span>
              </div>
              <p className="text-gray-600 text-sm">
                모든 중생이 고통에서 벗어나 진정한 행복을 얻기를 발원합니다
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default BuddhistCommunityLanding;