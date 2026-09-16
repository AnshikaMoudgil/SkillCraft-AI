import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { ProgressBar } from '../common/ProgressBar';
import { Clock, BookOpen, Layers, CheckCircle2 } from 'lucide-react';

export interface QuestionProgressBarProps {
  currentQuestion: number;
  totalQuestions: number;
  currentTopic: string;
  nextTopic: string;
  timeRemainingSeconds: number;
  difficulty?: string;
  onFinish: () => void;
}

export const QuestionProgressBar: React.FC<QuestionProgressBarProps> = ({
  currentQuestion,
  totalQuestions,
  currentTopic,
  nextTopic,
  timeRemainingSeconds,
  difficulty = 'Technical • Intermediate',
  onFinish
}) => {
  const minutes = Math.floor(timeRemainingSeconds / 60);
  const seconds = timeRemainingSeconds % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const progressPercent = Math.round((currentQuestion / totalQuestions) * 100);

  return (
    <Card className="p-5 space-y-5 bg-white border border-slate-200/80">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Interview Progress
          </h4>
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
            {currentQuestion} / {totalQuestions} Questions
          </span>
        </div>
        <ProgressBar value={progressPercent} color="bg-gradient-to-r from-indigo-600 to-purple-600" />
      </div>

      {/* Meta Grid */}
      <div className="space-y-3 pt-2 border-t border-slate-100 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-500 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
            Current Topic:
          </span>
          <span className="font-bold text-slate-900">{currentTopic}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-500 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-purple-500" />
            Next Topic:
          </span>
          <span className="font-medium text-slate-600">{nextTopic}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-500 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            Time Remaining:
          </span>
          <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
            {timeFormatted}
          </span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-slate-400">Difficulty:</span>
          <span className="text-slate-600 font-semibold">{difficulty}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-3 border-t border-slate-100">
        <Button
          variant="outline"
          size="sm"
          onClick={onFinish}
          className="w-full text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 hover:border-rose-200"
        >
          Finish & View Analysis
        </Button>
      </div>
    </Card>
  );
};
