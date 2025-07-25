import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EnhancedBuddhistLanding: React.FC = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const simulateMessage = () => {
    const messageInput = document.querySelector('input[placeholder*="메시지"]') as HTMLInputElement;
    if (messageInput && messageInput.value.trim()) {
      messageInput.value = '';
      const notification = document.createElement('div');
      notification.textContent = '메시지가 전송되었습니다 🙏';
      notification.className = 'fixed top-20 right-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-lg text-sm z-50 shadow-lg transform transition-all duration-300';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
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
        
        .enhanced-lotus-gradient {
            background: radial-gradient(circle at 30% 70%, #fef3e7 0%, #fed7aa 25%, #fdba74 50%, #f59e0b 75%, #d97706 100%);
        }
        
        .sacred-gradient {
            background: linear-gradient(135deg, #fefbf3 0%, #fef3e7 25%, #fed7aa 50%, #fdba74 75%, #f59e0b 100%);
        }
        
        .floating-lotus {
            animation: float-lotus 6s ease-in-out infinite;
        }
        
        @keyframes float-lotus {
            0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
            25% { transform: translateY(-10px) rotate(1deg) scale(1.02); }
            50% { transform: translateY(-15px) rotate(-1deg) scale(1.05); }
            75% { transform: translateY(-10px) rotate(1deg) scale(1.02); }
        }
        
        .sacred-pulse {
            animation: sacred-pulse 4s ease-in-out infinite;
        }
        
        @keyframes sacred-pulse {
            0%, 100% { 
                transform: scale(1) rotate(0deg); 
                filter: brightness(1) drop-shadow(0 0 20px rgba(245, 158, 11, 0.3));
            }
            50% { 
                transform: scale(1.08) rotate(2deg); 
                filter: brightness(1.1) drop-shadow(0 0 30px rgba(245, 158, 11, 0.5));
            }
        }
        
        .mandala-bg {
            background-image: 
                radial-gradient(circle at 25% 25%, rgba(245, 158, 11, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 75% 75%, rgba(217, 119, 6, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 50% 50%, rgba(251, 191, 36, 0.05) 0%, transparent 70%);
        }
        
        .divine-fade {
            animation: divine-fade 1.5s ease-out forwards;
        }
        
        @keyframes divine-fade {
            from { 
                opacity: 0; 
                transform: translateY(30px) scale(0.95); 
                filter: blur(5px);
            }
            to { 
                opacity: 1; 
                transform: translateY(0) scale(1); 
                filter: blur(0px);
            }
        }
        
        .sacred-hover {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .sacred-hover:hover {
            transform: translateY(-8px) scale(1.03);
            box-shadow: 
                0 25px 50px -12px rgba(0, 0, 0, 0.25),
                0 0 0 1px rgba(245, 158, 11, 0.2),
                0 0 30px rgba(245, 158, 11, 0.3);
        }
        
        .chat-message-enter {
            animation: message-slide 0.5s ease-out;
        }
        
        @keyframes message-slide {
            from { 
                opacity: 0; 
                transform: translateX(-20px) scale(0.95); 
            }
            to { 
                opacity: 1; 
                transform: translateX(0) scale(1); 
            }
        }
        
        .golden-text {
            background: linear-gradient(135deg, #f59e0b, #d97706, #92400e);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .wisdom-glow {
            text-shadow: 0 0 20px rgba(245, 158, 11, 0.3);
        }
      `}</style>
      
      <div className="min-h-screen enhanced-lotus-gradient mandala-bg">
        {/* Enhanced Navigation */}
        <nav className="bg-white/90 backdrop-blur-xl border-b border-orange-200/50 sticky top-0 z-50 shadow-lg">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 rounded-xl flex items-center justify-center sacred-pulse shadow-lg">
                  <span className="text-white text-xl">🪷</span>
                </div>
                <div>
                  <h1 className="text-lg font-semibold golden-text">선원 - 디지털 법당</h1>
                  <p className="text-xs text-orange-600">마음과 마음이 만나는 곳</p>
                </div>
              </div>
              <button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-2 rounded-xl text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                🙏 입문하기
              </button>
            </div>
          </div>
        </nav>

        {/* Enhanced Main Content */}
        <main className="min-h-[calc(100vh-4rem)] flex">
          {/* Left Side - Enhanced Buddhist Artwork */}
          <div className="w-1/2 sacred-gradient flex flex-col items-center justify-center p-12 relative overflow-hidden">
            {/* Floating Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
              <div className={`absolute top-10 left-10 text-6xl opacity-20 floating-lotus ${isLoaded ? 'divine-fade' : ''}`} style={{animationDelay: '0.1s'}}>🪷</div>
              <div className={`absolute top-20 right-16 text-4xl opacity-15 floating-lotus ${isLoaded ? 'divine-fade' : ''}`} style={{animationDelay: '0.3s'}}>🕉️</div>
              <div className={`absolute top-1/3 left-16 text-5xl opacity-10 floating-lotus ${isLoaded ? 'divine-fade' : ''}`} style={{animationDelay: '0.5s'}}>☸️</div>
              <div className={`absolute bottom-1/3 right-12 text-7xl opacity-25 floating-lotus ${isLoaded ? 'divine-fade' : ''}`} style={{animationDelay: '0.7s'}}>🧘‍♀️</div>
              <div className={`absolute bottom-20 left-20 text-5xl opacity-20 floating-lotus ${isLoaded ? 'divine-fade' : ''}`} style={{animationDelay: '0.9s'}}>📿</div>
              <div className={`absolute top-1/2 right-1/4 text-3xl opacity-15 floating-lotus ${isLoaded ? 'divine-fade' : ''}`} style={{animationDelay: '1.1s'}}>🏛️</div>
              <div className={`absolute bottom-40 right-20 text-4xl opacity-20 floating-lotus ${isLoaded ? 'divine-fade' : ''}`} style={{animationDelay: '1.3s'}}>🌸</div>
              <div className={`absolute top-40 left-1/3 text-6xl opacity-15 floating-lotus ${isLoaded ? 'divine-fade' : ''}`} style={{animationDelay: '1.5s'}}>🙏</div>
              <div className={`absolute bottom-1/4 left-1/3 text-4xl opacity-25 floating-lotus ${isLoaded ? 'divine-fade' : ''}`} style={{animationDelay: '1.7s'}}>🍵</div>
              <div className={`absolute top-2/3 right-1/3 text-5xl opacity-20 floating-lotus ${isLoaded ? 'divine-fade' : ''}`} style={{animationDelay: '1.9s'}}>✨</div>
            </div>

            {/* Enhanced Central Lotus */}
            <div className={`relative z-10 text-center ${isLoaded ? 'divine-fade' : ''}`} style={{animationDelay: '0.5s'}}>
              <div className="w-56 h-56 mx-auto mb-10 relative">
                <div className="w-full h-full bg-gradient-to-br from-pink-300 via-orange-300 to-yellow-300 rounded-full flex items-center justify-center sacred-pulse shadow-2xl border-4 border-white/50">
                  <span className="text-9xl">🪷</span>
                </div>
                
                {/* Enhanced Surrounding Symbols */}
                <div className="absolute -top-6 -left-6 w-20 h-20 bg-gradient-to-br from-white to-orange-50 rounded-full flex items-center justify-center shadow-xl border-2 border-orange-200 sacred-hover">
                  <span className="text-3xl">☸️</span>
                </div>
                <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-white to-orange-50 rounded-full flex items-center justify-center shadow-xl border-2 border-orange-200 sacred-hover">
                  <span className="text-3xl">🕉️</span>
                </div>
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-white to-orange-50 rounded-full flex items-center justify-center shadow-xl border-2 border-orange-200 sacred-hover">
                  <span className="text-3xl">📿</span>
                </div>
                <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-gradient-to-br from-white to-orange-50 rounded-full flex items-center justify-center shadow-xl border-2 border-orange-200 sacred-hover">
                  <span className="text-3xl">🙏</span>
                </div>
              </div>

              {/* Enhanced Three Jewels */}
              <div className={`flex justify-center space-x-8 mb-10 ${isLoaded ? 'divine-fade' : ''}`} style={{animationDelay: '1s'}}>
                <div className="w-24 h-24 bg-gradient-to-br from-purple-300 to-indigo-300 rounded-full flex items-center justify-center sacred-hover shadow-xl">
                  <span className="text-4xl">🧘‍♀️</span>
                </div>
                <div className="w-24 h-24 bg-gradient-to-br from-green-300 to-emerald-300 rounded-full flex items-center justify-center sacred-hover shadow-xl">
                  <span className="text-4xl">🏛️</span>
                </div>
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-full flex items-center justify-center sacred-hover shadow-xl">
                  <span className="text-4xl">🌸</span>
                </div>
              </div>

              {/* Sacred Mantra */}
              <div className={`text-center ${isLoaded ? 'divine-fade' : ''}`} style={{animationDelay: '1.5s'}}>
                <div className="text-2xl golden-text wisdom-glow font-medium mb-4">옴 마니 반메 훔</div>
                <div className="flex justify-center space-x-6 text-4xl opacity-80">
                  <span className="floating-lotus">🍵</span>
                  <span className="floating-lotus" style={{animationDelay: '1s'}}>✨</span>
                  <span className="floating-lotus" style={{animationDelay: '2s'}}>🌙</span>
                  <span className="floating-lotus" style={{animationDelay: '3s'}}>⭐</span>
                  <span className="floating-lotus" style={{animationDelay: '4s'}}>🕯️</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Enhanced Content */}
          <div className="w-1/2 bg-white/95 backdrop-blur-sm flex flex-col">
            {/* Enhanced Welcome Section */}
            <div className="p-12 pb-6">
              <div className={`mb-8 ${isLoaded ? 'divine-fade' : ''}`} style={{animationDelay: '0.3s'}}>
                <h1 className="text-6xl font-bold mb-6 leading-tight">
                  <span className="golden-text wisdom-glow">선원</span>에<br />
                  <span className="text-gray-900">오신 것을 환영합니다</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  전국 불자들이 모여 수행 경험을 나누고,<br />
                  지혜를 함께 키워가는 평화로운 디지털 법당입니다
                </p>

                {/* Enhanced Action Cards */}
                <div className="space-y-6 mb-8">
                  <button 
                    className={`w-full text-left p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-500 group sacred-hover ${isLoaded ? 'divine-fade' : ''}`}
                    style={{animationDelay: '0.7s'}}
                    onClick={() => navigate('/temple-reviews')}
                    onMouseEnter={() => setHoveredCard('reviews')}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center transition-transform duration-300 ${hoveredCard === 'reviews' ? 'scale-110 rotate-3' : ''}`}>
                        <span className="text-3xl text-white">🏛️</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">법회 리뷰</h3>
                        <p className="text-gray-600">전국 사찰의 법회와 수행 프로그램 진솔한 후기</p>
                      </div>
                      <span className="text-2xl text-blue-600 group-hover:translate-x-2 transition-transform duration-300">→</span>
                    </div>
                  </button>

                  <button 
                    className={`w-full text-left p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl hover:from-purple-100 hover:to-pink-100 transition-all duration-500 group sacred-hover ${isLoaded ? 'divine-fade' : ''}`}
                    style={{animationDelay: '0.9s'}}
                    onClick={() => navigate('/community')}
                    onMouseEnter={() => setHoveredCard('community')}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center transition-transform duration-300 ${hoveredCard === 'community' ? 'scale-110 rotate-3' : ''}`}>
                        <span className="text-3xl text-white">💬</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">불자 소통</h3>
                        <p className="text-gray-600">다른 불자들과 수행 경험과 일상의 지혜 나누기</p>
                      </div>
                      <span className="text-2xl text-purple-600 group-hover:translate-x-2 transition-transform duration-300">→</span>
                    </div>
                  </button>
                </div>

                {/* Enhanced Daily Dharma */}
                <div className={`bg-gradient-to-r from-amber-100 via-orange-100 to-yellow-100 border-2 border-amber-300 rounded-2xl p-8 mb-6 sacred-hover ${isLoaded ? 'divine-fade' : ''}`} style={{animationDelay: '1.1s'}}>
                  <div className="text-center">
                    <div className="text-4xl mb-4 floating-lotus">🌸</div>
                    <h3 className="text-xl font-bold golden-text mb-3">오늘의 법문</h3>
                    <p className="text-lg text-gray-800 italic mb-4 wisdom-glow">
                      "마음이 평온하면 세상도 평온하다"
                    </p>
                    <p className="text-sm text-gray-700">
                      잠시 멈춰서 호흡에 집중해보세요. 지금 이 순간, 여기에 온전히 머물러보세요.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Real-time Chat */}
            <div className="flex-1 px-12 pb-12">
              <div className={`bg-gradient-to-br from-gray-50 to-orange-50 rounded-3xl p-8 h-full flex flex-col shadow-xl border border-orange-200 ${isLoaded ? 'divine-fade' : ''}`} style={{animationDelay: '1.3s'}}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold golden-text">🙏 실시간 불자 소통</h3>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
                    <span className="text-sm text-gray-600 font-medium">12명의 불자님이 접속중</span>
                  </div>
                </div>

                {/* Enhanced Chat Messages */}
                <div className="flex-1 space-y-4 mb-6 overflow-y-auto">
                  {[
                    { user: '지혜를찾는자', avatar: '📿', message: '오늘 처음 명상을 시작해보려는데, 어떤 방법이 좋을까요?', time: '방금 전', bg: 'from-purple-100 to-purple-50' },
                    { user: '명상의달인', avatar: '🕉️', message: '호흡에 집중하는 것부터 시작해보세요. 처음에는 5분부터요 🙏', time: '1분 전', bg: 'from-blue-100 to-blue-50' },
                    { user: '연꽃길', avatar: '🪷', message: '저도 처음에는 어려웠는데 매일 조금씩 하다보니 마음이 평온해졌어요 ✨', time: '2분 전', bg: 'from-green-100 to-green-50' },
                    { user: '차명상수행자', avatar: '🍵', message: '차명상도 추천드려요. 차 한 잔의 향과 맛에 집중하면서 현재에 머무는 연습을 해보세요', time: '3분 전', bg: 'from-orange-100 to-orange-50' }
                  ].map((msg, idx) => (
                    <div key={idx} className={`flex items-start space-x-3 chat-message-enter`} style={{animationDelay: `${1.5 + idx * 0.2}s`}}>
                      <div className="w-10 h-10 bg-gradient-to-br from-white to-gray-100 rounded-full flex items-center justify-center flex-shrink-0 shadow-md border-2 border-orange-200">
                        <span className="text-sm">{msg.avatar}</span>
                      </div>
                      <div className={`bg-gradient-to-r ${msg.bg} rounded-2xl px-4 py-3 shadow-lg border border-white/50 sacred-hover max-w-md`}>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-semibold text-gray-900 text-sm">{msg.user}</span>
                          <span className="text-xs text-gray-500">{msg.time}</span>
                        </div>
                        <p className="text-sm text-gray-800 leading-relaxed">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Enhanced Message Input */}
                <div className="space-y-4">
                  <div className="flex space-x-3">
                    <input 
                      type="text" 
                      placeholder="따뜻한 마음으로 메시지를 입력하세요... 🙏"
                      className="flex-1 px-4 py-3 bg-white/80 border-2 border-orange-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-300 shadow-lg"
                      onKeyPress={handleKeyPress}
                    />
                    <button 
                      className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl text-sm font-medium hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                      onClick={simulateMessage}
                    >
                      📤 전송
                    </button>
                  </div>

                  <div className="text-center">
                    <button 
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                      onClick={() => navigate('/community')}
                    >
                      🚪 채팅방 입장하기 → 불자들과 함께하기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Enhanced Footer */}
        <footer className="bg-gradient-to-r from-orange-100 to-amber-100 border-t-2 border-orange-200">
          <div className="px-8 py-6">
            <div className="flex justify-center items-center space-x-4">
              <span className="text-2xl floating-lotus">🪷</span>
              <span className="text-lg font-bold golden-text">선원 - 디지털 법당</span>
              <span className="text-sm text-orange-600">•</span>
              <span className="text-sm text-orange-600 italic">모든 중생이 고통에서 벗어나 진정한 행복을 얻기를 발원합니다</span>
              <div className="flex space-x-2 text-lg">
                <span className="floating-lotus">🙏</span>
                <span className="floating-lotus" style={{animationDelay: '1s'}}>☸️</span>
                <span className="floating-lotus" style={{animationDelay: '2s'}}>🕉️</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default EnhancedBuddhistLanding;