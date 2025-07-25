import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SteppingStone {
  id: string;
  content: string;
  author: string;
  timestamp: Date;
  emotionalWeight: number; // 0-1: 가벼운 내용부터 무거운 내용
  connections: string[];   // 연결된 다른 돌들의 ID
  stability: number;       // 0-1: 논란이 있는 내용(미끄러운 돌) vs 안전한 내용
  size: 'small' | 'medium' | 'large';
}

interface RiverPath {
  stones: SteppingStone[];
  riverWidth: number;
  flowDirection: 'left-to-right' | 'right-to-left' | 'meandering';
}

interface SteppingStoneLayoutProps {
  stones: SteppingStone[];
  onStoneClick?: (stone: SteppingStone) => void;
  onStoneHover?: (stone: SteppingStone | null) => void;
  className?: string;
}

export const SteppingStoneLayout: React.FC<SteppingStoneLayoutProps> = ({
  stones,
  onStoneClick,
  onStoneHover,
  className = ""
}) => {
  const [hoveredStone, setHoveredStone] = useState<string | null>(null);
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const [userPosition, setUserPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // 징검다리 위치 계산 알고리즘
  const calculateStonePositions = (stones: SteppingStone[]) => {
    const positions = new Map<string, { x: number; y: number; rotation: number }>();
    const containerWidth = 800; // 강의 폭
    const containerHeight = 600; // 강의 길이

    stones.forEach((stone, index) => {
      // 자연스러운 지그재그 패턴으로 배치
      const progressRatio = index / (stones.length - 1);
      const baseX = progressRatio * (containerWidth - 100) + 50;
      
      // 사인파를 이용한 자연스러운 굴곡
      const amplitude = 150;
      const frequency = 2;
      const yOffset = Math.sin(progressRatio * Math.PI * frequency) * amplitude;
      const baseY = containerHeight / 2 + yOffset;

      // 감정적 무게에 따른 위치 조정
      const emotionalOffset = (stone.emotionalWeight - 0.5) * 100;
      
      // 안정성에 따른 랜덤 변이 (불안정한 돌은 더 불규칙하게)
      const stabilityFactor = stone.stability;
      const randomOffsetX = (Math.random() - 0.5) * 50 * (1 - stabilityFactor);
      const randomOffsetY = (Math.random() - 0.5) * 50 * (1 - stabilityFactor);

      // 크기에 따른 간격 조정
      const sizeSpacing = stone.size === 'large' ? 20 : stone.size === 'medium' ? 10 : 0;

      positions.set(stone.id, {
        x: baseX + randomOffsetX + sizeSpacing,
        y: baseY + emotionalOffset + randomOffsetY,
        rotation: (Math.random() - 0.5) * 10 * (1 - stabilityFactor) // 불안정할수록 더 기울어짐
      });
    });

    return positions;
  };

  const stonePositions = calculateStonePositions(stones);

  // 돌의 크기 계산
  const getStoneSize = (stone: SteppingStone) => {
    const baseSize = {
      small: { width: 60, height: 40 },
      medium: { width: 90, height: 60 },
      large: { width: 120, height: 80 }
    };
    
    // 감정적 무게에 따른 크기 조정
    const weightMultiplier = 0.8 + (stone.emotionalWeight * 0.4);
    const size = baseSize[stone.size];
    
    return {
      width: size.width * weightMultiplier,
      height: size.height * weightMultiplier
    };
  };

  // 돌의 스타일 계산
  const getStoneStyle = (stone: SteppingStone) => {
    const position = stonePositions.get(stone.id);
    const size = getStoneSize(stone);
    const isHovered = hoveredStone === stone.id;
    const isInPath = selectedPath.includes(stone.id);

    // 안정성에 따른 색상
    const stabilityColor = stone.stability > 0.7 
      ? 'from-slate-300 to-slate-400' // 안전한 돌
      : stone.stability > 0.4 
        ? 'from-yellow-200 to-yellow-300' // 보통 돌
        : 'from-red-200 to-red-300'; // 미끄러운 돌

    return {
      position: 'absolute' as const,
      left: position?.x || 0,
      top: position?.y || 0,
      width: size.width,
      height: size.height,
      transform: `rotate(${position?.rotation || 0}deg) ${isHovered ? 'scale(1.1)' : 'scale(1)'}`,
      background: `linear-gradient(135deg, ${stabilityColor})`,
      borderRadius: '50% 30% 50% 30%', // 자연스러운 돌 모양
      boxShadow: isHovered 
        ? '0 8px 32px rgba(0,0,0,0.2), 0 0 0 3px rgba(34, 197, 94, 0.3)'
        : '0 4px 16px rgba(0,0,0,0.1)',
      cursor: 'pointer',
      zIndex: isHovered ? 10 : isInPath ? 5 : 1
    };
  };

  // 연결선 그리기
  const renderConnections = () => {
    return stones.map(stone => 
      stone.connections.map(connectedId => {
        const startPos = stonePositions.get(stone.id);
        const endPos = stonePositions.get(connectedId);
        
        if (!startPos || !endPos) return null;

        const startSize = getStoneSize(stone);
        const connectedStone = stones.find(s => s.id === connectedId);
        const endSize = connectedStone ? getStoneSize(connectedStone) : { width: 0, height: 0 };

        return (
          <motion.svg
            key={`${stone.id}-${connectedId}`}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{ duration: 1, delay: Math.random() * 2 }}
          >
            <motion.path
              d={`M ${startPos.x + startSize.width/2} ${startPos.y + startSize.height/2} 
                  Q ${(startPos.x + endPos.x)/2} ${Math.min(startPos.y, endPos.y) - 30} 
                  ${endPos.x + endSize.width/2} ${endPos.y + endSize.height/2}`}
              stroke="rgba(34, 197, 94, 0.4)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5,5"
              className="animate-pulse"
            />
          </motion.svg>
        );
      })
    ).flat();
  };

  const handleStoneClick = (stone: SteppingStone) => {
    // 경로 선택 로직
    const newPath = [...selectedPath];
    const stoneIndex = newPath.indexOf(stone.id);
    
    if (stoneIndex === -1) {
      newPath.push(stone.id);
    } else {
      newPath.splice(stoneIndex + 1); // 해당 돌 이후의 경로 제거
    }
    
    setSelectedPath(newPath);
    onStoneClick?.(stone);
  };

  const handleStoneHover = (stone: SteppingStone | null) => {
    setHoveredStone(stone?.id || null);
    onStoneHover?.(stone);
  };

  return (
    <div className={`relative w-full h-[600px] overflow-hidden ${className}`}>
      {/* 강물 배경 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
        {/* 물결 효과 */}
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 40% 30%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 60% 70%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 40%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)'
            ]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* 연결선 */}
      <div className="absolute inset-0">
        {renderConnections()}
      </div>

      {/* 징검다리들 */}
      <div ref={containerRef} className="relative w-full h-full">
        <AnimatePresence>
          {stones.map((stone, index) => (
            <motion.div
              key={stone.id}
              style={getStoneStyle(stone)}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                scale: 1.1,
                rotateZ: hoveredStone === stone.id ? 2 : 0,
                transition: { duration: 0.2 }
              }}
              onClick={() => handleStoneClick(stone)}
              onMouseEnter={() => handleStoneHover(stone)}
              onMouseLeave={() => handleStoneHover(null)}
              className="flex items-center justify-center group"
            >
              {/* 돌 표면 텍스처 */}
              <div className="absolute inset-0 rounded-full opacity-20">
                <div className="w-full h-full bg-gradient-to-br from-white via-transparent to-black rounded-full" />
              </div>

              {/* 내용 미리보기 */}
              <div className="relative z-10 p-2 text-center">
                <div className="text-xs font-medium text-gray-700 truncate max-w-[80px]">
                  {stone.content.slice(0, 20)}...
                </div>
                <div className="text-[10px] text-gray-500 mt-1">
                  {stone.author}
                </div>
              </div>

              {/* 호버 시 전체 내용 표시 */}
              <AnimatePresence>
                {hoveredStone === stone.id && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.9 }}
                    animate={{ opacity: 1, y: -50, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.9 }}
                    className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 max-w-[300px] z-20 border-2 border-green-200"
                  >
                    <div className="text-sm text-gray-800 mb-2">
                      {stone.content}
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{stone.author}</span>
                      <span>{stone.timestamp.toLocaleDateString()}</span>
                    </div>
                    <div className="mt-2 flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        stone.stability > 0.7 ? 'bg-green-400' : 
                        stone.stability > 0.4 ? 'bg-yellow-400' : 'bg-red-400'
                      }`} />
                      <span className="text-xs">
                        {stone.stability > 0.7 ? '안전한 돌' : 
                         stone.stability > 0.4 ? '조심스런 돌' : '미끄러운 돌'}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 선택된 경로 표시 */}
              {selectedPath.includes(stone.id) && (
                <motion.div
                  className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {selectedPath.indexOf(stone.id) + 1}
                </motion.div>
              )}

              {/* 안정성 경고 */}
              {stone.stability < 0.4 && (
                <motion.div
                  className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 text-red-500"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ⚠️
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 경로 정보 */}
      {selectedPath.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg"
        >
          <div className="text-sm font-medium text-gray-700 mb-2">
            선택한 경로: {selectedPath.length}개의 돌
          </div>
          <button
            onClick={() => setSelectedPath([])}
            className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors"
          >
            경로 초기화
          </button>
        </motion.div>
      )}

      {/* 범례 */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="text-sm font-medium text-gray-700 mb-2">징검다리 안내</div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-2 bg-gradient-to-r from-slate-300 to-slate-400 rounded-full" />
            <span>안전한 돌</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-2 bg-gradient-to-r from-yellow-200 to-yellow-300 rounded-full" />
            <span>조심스런 돌</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-2 bg-gradient-to-r from-red-200 to-red-300 rounded-full" />
            <span>미끄러운 돌</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SteppingStoneLayout;