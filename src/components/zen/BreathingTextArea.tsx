import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BreathingTextAreaProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  className?: string;
}

interface BreathingState {
  phase: 'inhale' | 'hold' | 'exhale' | 'rest';
  progress: number;
  cycle: number;
}

export const BreathingTextArea: React.FC<BreathingTextAreaProps> = ({
  placeholder = "마음 깊은 곳에서 우러나는 생각을 천천히 적어보세요...",
  value = "",
  onChange,
  onSubmit,
  className = ""
}) => {
  const [text, setText] = useState(value);
  const [isActive, setIsActive] = useState(false);
  const [breathingState, setBreathingState] = useState<BreathingState>({
    phase: 'rest',
    progress: 0,
    cycle: 0
  });
  const [typingPaused, setTypingPaused] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastTypingTime = useRef<number>(0);

  // 호흡 리듬 설정 (밀리초)
  const breathingTiming = {
    inhale: 4000,   // 4초 흡입
    hold: 2000,     // 2초 멈춤
    exhale: 6000,   // 6초 호기
    rest: 2000      // 2초 휴식
  };

  // 호흡 사이클 관리
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setBreathingState(prev => {
        const { phase, progress, cycle } = prev;
        const timing = breathingTiming[phase];
        const newProgress = progress + 100;

        if (newProgress >= timing) {
          // 다음 단계로 전환
          switch (phase) {
            case 'inhale':
              return { phase: 'hold', progress: 0, cycle };
            case 'hold':
              return { phase: 'exhale', progress: 0, cycle };
            case 'exhale':
              return { phase: 'rest', progress: 0, cycle };
            case 'rest':
              return { phase: 'inhale', progress: 0, cycle: cycle + 1 };
            default:
              return prev;
          }
        }

        return { ...prev, progress: newProgress };
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isActive]);

  // 타이핑 감지 및 일시정지 로직
  useEffect(() => {
    const checkTypingPause = () => {
      const now = Date.now();
      if (now - lastTypingTime.current > 3000 && text.length > 0) {
        setTypingPaused(true);
      } else {
        setTypingPaused(false);
      }
    };

    const interval = setInterval(checkTypingPause, 1000);
    return () => clearInterval(interval);
  }, [text]);

  // 글자 수 계산
  useEffect(() => {
    setWordCount(text.trim().split(/\s+/).filter(word => word.length > 0).length);
  }, [text]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setText(newValue);
    onChange?.(newValue);
    lastTypingTime.current = Date.now();
  };

  const handleFocus = () => {
    setIsActive(true);
  };

  const handleBlur = () => {
    setIsActive(false);
    setBreathingState({ phase: 'rest', progress: 0, cycle: 0 });
  };

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit?.(text);
      setText("");
      setWordCount(0);
    }
  };

  // 호흡 단계별 스타일
  const getBreathingStyles = () => {
    const { phase, progress } = breathingState;
    const progressRatio = progress / breathingTiming[phase];

    switch (phase) {
      case 'inhale':
        return {
          borderWidth: 1 + progressRatio * 2,
          borderColor: `rgba(34, 197, 94, ${0.3 + progressRatio * 0.4})`,
          backgroundColor: `rgba(240, 253, 244, ${progressRatio * 0.5})`,
          transform: `scale(${1 + progressRatio * 0.02})`
        };
      case 'hold':
        return {
          borderWidth: 3,
          borderColor: 'rgba(34, 197, 94, 0.7)',
          backgroundColor: 'rgba(240, 253, 244, 0.5)',
          transform: 'scale(1.02)'
        };
      case 'exhale':
        return {
          borderWidth: 3 - progressRatio * 2,
          borderColor: `rgba(34, 197, 94, ${0.7 - progressRatio * 0.4})`,
          backgroundColor: `rgba(240, 253, 244, ${0.5 - progressRatio * 0.3})`,
          transform: `scale(${1.02 - progressRatio * 0.02})`
        };
      default:
        return {
          borderWidth: 1,
          borderColor: 'rgba(209, 213, 219, 0.5)',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          transform: 'scale(1)'
        };
    }
  };

  const breathingStyles = getBreathingStyles();

  return (
    <div className={`relative ${className}`}>
      {/* 호흡 가이드 */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -top-12 left-0 right-0 text-center"
          >
            <div className="text-sm text-gray-500 font-light">
              {breathingState.phase === 'inhale' && '🌱 깊게 들이마시며 생각을 모아보세요'}
              {breathingState.phase === 'hold' && '🤲 잠깐 멈춰서 마음을 정리해보세요'}
              {breathingState.phase === 'exhale' && '🌸 천천히 내쉬며 글로 표현해보세요'}
              {breathingState.phase === 'rest' && '☁️ 잠시 쉬어가며 다음 문장을 생각해보세요'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 메인 텍스트 영역 */}
      <motion.div
        className="relative"
        animate={breathingStyles}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`
            w-full min-h-[200px] p-6 rounded-2xl resize-none
            bg-transparent backdrop-blur-sm
            text-gray-800 placeholder-gray-400
            font-light text-lg leading-relaxed
            focus:outline-none
            transition-all duration-300
            ${typingPaused ? 'bg-yellow-50' : ''}
          `}
          style={{
            letterSpacing: isActive ? '0.5px' : '0px',
            lineHeight: isActive ? '1.8' : '1.6',
            fontFamily: "'Noto Sans KR', sans-serif"
          }}
        />

        {/* 호흡 리듬 인디케이터 */}
        {isActive && (
          <motion.div
            className="absolute bottom-4 right-4 w-4 h-4 rounded-full"
            animate={{
              backgroundColor: [
                'rgba(34, 197, 94, 0.3)',
                'rgba(34, 197, 94, 0.7)',
                'rgba(34, 197, 94, 0.3)'
              ],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: breathingTiming[breathingState.phase] / 1000,
              ease: "easeInOut",
              repeat: Infinity
            }}
          />
        )}
      </motion.div>

      {/* 하단 정보 영역 */}
      <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <span>{wordCount}개의 단어</span>
          {isActive && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-1"
            >
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>호흡 중... ({breathingState.cycle}번째 사이클)</span>
            </motion.span>
          )}
        </div>

        {text.trim() && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            className="px-4 py-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full font-medium hover:shadow-lg transition-all duration-200"
          >
            마음 나누기 🌸
          </motion.button>
        )}
      </div>

      {/* 타이핑 일시정지 안내 */}
      <AnimatePresence>
        {typingPaused && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-2 p-3 bg-yellow-50 border-l-4 border-yellow-300 rounded-r-lg"
          >
            <p className="text-sm text-yellow-800">
              💛 잠시 멈춰서 깊게 숨을 쉬어보세요. 서두르지 않아도 괜찮습니다.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BreathingTextArea;