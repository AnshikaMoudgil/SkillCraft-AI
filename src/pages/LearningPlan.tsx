import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { mock7DayPlan } from '../data/mockLearningPlan';
import { DayPlan } from '../types';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import {
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  BookOpen,
  Play,
  RotateCcw
} from 'lucide-react';

export const LearningPlan: React.FC = () => {
  const [plans, setPlans] = useState<DayPlan[]>(mock7DayPlan);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const toggleDayCompletion = (dayNum: number) => {
    setPlans((prev) =>
      prev.map((p) => {
        if (p.day === dayNum) {
          const nextStatus = p.status === 'completed' ? 'in_progress' : 'completed';
          return {
            ...p,
            status: nextStatus,
            actionLabel: nextStatus === 'completed' ? 'Review Summary' : 'Continue Practice'
          };
        }
        return p;
      })
    );
    showToast(`Updated Day ${dayNum} status!`, 'success');
  };

  const handleStartPractice = (day: DayPlan) => {
    if (day.title.includes('Mock Interview')) {
      navigate('/interviews');
    } else if (day.title.includes('DSA')) {
      navigate('/coding');
    } else {
      showToast(`Launching interactive practice module for: ${day.title}`, 'info');
    }
  };

  const completedCount = plans.filter((p) => p.status === 'completed').length;
  const progressPercent = Math.round((completedCount / plans.length) * 100);

  return (
    <PageContainer
      title="Your 7-Day AI Learning Plan"
      subtitle="Personalized based on your interview performance."
    >
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Top Progress Summary Header */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-[#071A33] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-xl">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Target Remedial Curriculum</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              DBMS & Core Fundamentals Focus
            </h3>
            <p className="text-xs sm:text-sm text-indigo-200/80 leading-relaxed">
              Based on your last 3 technical mocks, finishing this 7-day sprint will boost your predicted interview success probability to 94%.
            </p>
          </div>

          <div className="shrink-0 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center min-w-[140px]">
            <span className="text-3xl font-extrabold text-white">{progressPercent}%</span>
            <p className="text-xs text-indigo-200 mt-0.5">{completedCount} of 7 Days Done</p>
          </div>
        </div>

        {/* 7-Day Timeline Cards matching reference Screen 12 */}
        <div className="space-y-3.5">
          {plans.map((day) => {
            const isCompleted = day.status === 'completed';
            const isInProgress = day.status === 'in_progress';

            return (
              <Card
                key={day.day}
                className={`p-5 sm:p-6 transition-all border ${
                  isCompleted
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : isInProgress
                    ? 'border-indigo-300 bg-indigo-50/20 shadow-md ring-2 ring-indigo-500/10'
                    : 'border-slate-200/80 bg-white'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left info */}
                  <div className="flex items-start gap-4">
                    {/* Day Number Badge */}
                    <button
                      onClick={() => toggleDayCompletion(day.day)}
                      title="Click to toggle completed"
                      className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center shrink-0 font-bold transition-transform active:scale-90 ${
                        isCompleted
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                          : isInProgress
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <span className="text-[10px] uppercase font-semibold leading-none">Day</span>
                      <span className="text-base font-extrabold leading-none mt-0.5">{day.day}</span>
                    </button>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-3">
                        <h4 className="text-base font-bold text-slate-900">{day.title}</h4>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide ${
                            isCompleted
                              ? 'bg-emerald-100 text-emerald-800'
                              : isInProgress
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {isCompleted ? 'Completed ✓' : isInProgress ? 'In Progress ⏳' : 'Upcoming'}
                        </span>
                      </div>

                      {/* Bullet list of topics */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {day.topics.map((t) => (
                          <span
                            key={t}
                            className="text-xs text-slate-600 bg-white border border-slate-200/80 px-2.5 py-1 rounded-lg font-medium shadow-2xs"
                          >
                            • {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      {day.estimatedTime}
                    </span>

                    <Button
                      variant={isCompleted ? 'outline' : isInProgress ? 'gradient' : 'primary'}
                      size="sm"
                      onClick={() => handleStartPractice(day)}
                      icon={isCompleted ? <RotateCcw className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    >
                      {day.actionLabel}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </PageContainer>
  );
};
