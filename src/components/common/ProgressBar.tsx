import React from 'react';

export interface ProgressBarProps {
  value: number; // 0 - 100
  max?: number;
  label?: string;
  showPercent?: boolean;
  color?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showPercent = false,
  color = 'bg-indigo-600',
  className = ''
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center text-xs font-medium text-slate-600 mb-1.5">
          {label && <span>{label}</span>}
          {showPercent && <span className="font-semibold text-slate-800">{percentage}%</span>}
        </div>
      )}
      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export interface CircularProgressProps {
  score: number;
  total?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  score,
  total = 100,
  size = 140,
  strokeWidth = 10,
  label = 'Overall Score',
  sublabel
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(100, Math.max(0, (score / total) * 100));
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="text-slate-100"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
          />
          {/* Animated gradient progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            stroke="url(#scoreGradient)"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{score}</span>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">/ {total}</span>
        </div>
      </div>
      {label && <p className="mt-2 text-sm font-semibold text-slate-700">{label}</p>}
      {sublabel && <p className="text-xs text-slate-400">{sublabel}</p>}
    </div>
  );
};
