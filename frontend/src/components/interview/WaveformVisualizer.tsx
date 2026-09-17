import React from 'react';

export interface WaveformVisualizerProps {
  isSpeaking: boolean;
  barCount?: number;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  isSpeaking,
  barCount = 18
}) => {
  // Array of heights for waveform bars
  const heights = [
    14, 28, 42, 22, 50, 36, 18, 46, 32, 54, 26, 40, 20, 48, 30, 16, 38, 24
  ];

  return (
    <div className="flex items-center justify-center gap-1.5 h-16 py-2 select-none">
      {heights.slice(0, barCount).map((h, i) => (
        <div
          key={i}
          className={`w-1.5 rounded-full transition-all duration-300 ${
            isSpeaking
              ? 'bg-gradient-to-t from-indigo-500 via-purple-400 to-pink-400 animate-pulse'
              : 'bg-slate-700 h-2'
          }`}
          style={{
            height: isSpeaking ? `${Math.max(8, (h * (0.6 + ((i % 5) * 0.15))))}px` : '6px',
            animationDelay: `${(i % 6) * 0.12}s`,
            animationDuration: `${0.8 + ((i % 4) * 0.2)}s`
          }}
        />
      ))}
    </div>
  );
};
