import { motion } from 'framer-motion';
import React, { useState } from 'react';

interface VoiceNotePlayerProps {
  voiceNote?: any;
  author?: any;
  audioUrl?: string;
  duration?: number;
  onPlay?: () => void;
  onPause?: () => void;
  className?: string;
}

export const VoiceNotePlayer: React.FC<VoiceNotePlayerProps> = ({
  voiceNote,
  author,
  audioUrl,
  duration = 0,
  onPlay,
  onPause,
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (onPause) onPause();
    } else {
      setIsPlaying(true);
      if (onPlay) onPlay();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`voice-note-player bg-blue-50 rounded-lg p-3 ${className}`}>
      <div className="flex items-center gap-3">
        <motion.button
          onClick={handlePlayPause}
          className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isPlaying ? (
            <div className="w-3 h-3 bg-white rounded-sm"></div>
          ) : (
            <div className="w-0 h-0 border-l-4 border-l-white border-t-2 border-t-transparent border-b-2 border-b-transparent ml-1"></div>
          )}
        </motion.button>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex-1 bg-gray-200 rounded-full h-1">
              <div
                className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className={`w-0.5 bg-blue-300 rounded-full transition-all duration-150 ${
                  isPlaying ? 'animate-pulse' : ''
                }`}
                style={{
                  height: `${Math.random() * 16 + 8}px`,
                  animationDelay: `${i * 50}ms`
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
