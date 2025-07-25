import React, { useState } from 'react';
import { motion } from 'framer-motion';
import BreathingTextArea from '../components/zen/BreathingTextArea';
import SteppingStoneLayout from '../components/zen/SteppingStoneLayout';
import SeasonalNavigation from '../components/zen/SeasonalNavigation';

interface ZenGardenDemoProps {}

// 데모용 데이터
const mockStones = [
  {
    id: '1',
    content: '오늘 아침 예불을 드리며 마음이 한없이 평온해졌습니다. 부처님께서 주신 이 하루에 감사드립니다.',
    author: '구름',
    timestamp: new Date('2024-01-15'),
    emotionalWeight: 0.8,
    connections: ['2', '3'],
    stability: 0.9,
    size: 'large' as const
  },
  {
    id: '2', 
    content: '처음 템플스테이에 참가했는데, 디지털 없는 하루가 이렇게 소중할 줄 몰랐어요.',
    author: '바람',
    timestamp: new Date('2024-01-14'),
    emotionalWeight: 0.6,
    connections: ['1', '4'],
    stability: 0.8,
    size: 'medium' as const
  },
  {
    id: '3',
    content: '요즘 직장에서 스트레스가 많았는데, 법문을 들으니 마음이 한결 가벼워집니다.',
    author: '달빛',
    timestamp: new Date('2024-01-13'),
    emotionalWeight: 0.4,
    connections: ['1', '5'],
    stability: 0.7,
    size: 'medium' as const
  },
  {
    id: '4',
    content: '명상을 시작한 지 한 달이 되었어요. 조금씩 집중력이 늘어가는 게 느껴져요.',
    author: '이슬',
    timestamp: new Date('2024-01-12'),
    emotionalWeight: 0.7,
    connections: ['2', '6'],
    stability: 0.85,
    size: 'small' as const
  },
  {
    id: '5',
    content: '불교에 대해 아직 잘 모르지만, 이곳 분위기가 참 따뜻해서 자주 오게 되네요.',
    author: '새싹',
    timestamp: new Date('2024-01-11'),
    emotionalWeight: 0.3,
    connections: ['3'],
    stability: 0.6,
    size: 'small' as const
  },
  {
    id: '6',
    content: '코로나로 힘든 시기를 보내고 있지만, 온라인 법회라도 함께할 수 있어 감사합니다.',
    author: '연꽃',
    timestamp: new Date('2024-01-10'),
    emotionalWeight: 0.5,
    connections: ['4'],
    stability: 0.4,
    size: 'medium' as const
  }
];

const mockUserStage = {
  spiritualLevel: 35,
  participationDays: 42,
  contributionScore: 78,
  contemplationDepth: 6
};

export const ZenGardenDemo: React.FC<ZenGardenDemoProps> = () => {
  const [activeTab, setActiveTab] = useState<'breathing' | 'stones' | 'seasonal'>('breathing');
  const [submissions, setSubmissions] = useState<string[]>([]);

  const handleTextSubmission = (text: string) => {
    setSubmissions(prev => [text, ...prev]);
    // 실제 구현에서는 서버로 전송
  };

  const handleStoneClick = (stone: any) => {
    console.log('Selected stone:', stone);
    // 실제 구현에서는 상세 보기 모달 등 표시
  };

  const handleFeatureSelect = (feature: any) => {
    console.log('Selected feature:', feature);
    // 실제 구현에서는 해당 기능 페이지로 이동
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-50">
      {/* 헤더 */}
      <motion.header 
        className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">🪷</span>
              </div>
              <div>
                <h1 className="text-xl font-light text-gray-800">디지털 선원</h1>
                <p className="text-sm text-gray-500">Digital Zen Garden</p>
              </div>
            </motion.div>

            <nav className="flex items-center space-x-1">
              {[
                { id: 'breathing', label: '호흡하는 글쓰기', icon: '🫁' },
                { id: 'stones', label: '징검다리', icon: '🪨' },
                { id: 'seasonal', label: '계절의 길', icon: '🌸' }
              ].map((tab, index) => (
                <motion.button
                  key={tab.id}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-green-100 text-green-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab(tab.id as any)}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </motion.button>
              ))}
            </nav>
          </div>
        </div>
      </motion.header>

      {/* 메인 컨텐츠 */}
      <main className="relative">
        {/* 호흡하는 글쓰기 탭 */}
        {activeTab === 'breathing' && (
          <motion.section
            className="max-w-4xl mx-auto px-6 py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-12">
              <motion.div
                className="text-6xl mb-4"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
              >
                🫁
              </motion.div>
              <h2 className="text-3xl font-light text-gray-800 mb-4">
                호흡하는 글쓰기
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                당신의 호흡 리듬에 맞춰 천천히 마음 깊은 곳의 이야기를 들려주세요. 
                서두르지 않아도 괜찮습니다.
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
              <BreathingTextArea
                placeholder="깊은 숨을 들이마시며... 마음 속 깊은 곳에서 우러나오는 생각을 천천히 적어보세요."
                onSubmit={handleTextSubmission}
                className="mb-8"
              />

              {/* 제출된 글들 */}
              {submissions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 pt-8 border-t border-gray-200/50"
                >
                  <h3 className="text-lg font-medium text-gray-700 mb-4">
                    마음에서 흘러나온 이야기들 ✨
                  </h3>
                  <div className="space-y-4">
                    {submissions.slice(0, 3).map((text, index) => (
                      <motion.div
                        key={index}
                        className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border-l-4 border-green-300"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <p className="text-gray-700 leading-relaxed">
                          {text}
                        </p>
                        <div className="mt-2 text-sm text-gray-500">
                          방금 전 · 익명
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.section>
        )}

        {/* 징검다리 레이아웃 탭 */}
        {activeTab === 'stones' && (
          <motion.section
            className="py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <motion.div
                className="text-6xl mb-4"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 2, 0]
                }}
                transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
              >
                🪨
              </motion.div>
              <h2 className="text-3xl font-light text-gray-800 mb-4">
                마음의 징검다리
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                각자의 마음 이야기가 강물 위의 징검다리가 되어 서로를 이어줍니다. 
                안전한 돌을 밟으며 천천히 건너가세요.
              </p>
            </div>

            <div className="bg-white/40 backdrop-blur-sm rounded-3xl mx-6 overflow-hidden shadow-lg">
              <SteppingStoneLayout
                stones={mockStones}
                onStoneClick={handleStoneClick}
                onStoneHover={(stone) => console.log('Hovering:', stone)}
              />
            </div>

            <div className="max-w-4xl mx-auto px-6 mt-8">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6">
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  💡 징검다리 사용법
                </h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500">🟢</span>
                    <div>
                      <div className="font-medium">안전한 돌</div>
                      <div>평화롭고 위로가 되는 내용</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-yellow-500">🟡</span>
                    <div>
                      <div className="font-medium">조심스런 돌</div>
                      <div>깊은 성찰이 필요한 내용</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-red-500">🔴</span>
                    <div>
                      <div className="font-medium">미끄러운 돌</div>
                      <div>논란이 있거나 어려운 주제</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* 계절 네비게이션 탭 */}
        {activeTab === 'seasonal' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SeasonalNavigation
              userStage={mockUserStage}
              onFeatureSelect={handleFeatureSelect}
            />
          </motion.div>
        )}
      </main>

      {/* 플로팅 안내 */}
      <motion.div
        className="fixed bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg max-w-sm"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-start space-x-3">
          <div className="text-2xl">🧘‍♀️</div>
          <div>
            <div className="font-medium text-gray-800 text-sm">
              디지털 선원에 오신 것을 환영합니다
            </div>
            <div className="text-xs text-gray-600 mt-1">
              마음의 평화를 찾는 여정에 함께 해주세요. 
              각 탭을 클릭하여 다양한 기능을 체험해보세요.
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ZenGardenDemo;