import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { interviewService, SetupConfig } from '../services/interviewService';
import { InterviewPlanItem } from '../types';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  Sliders,
  Plus,
  Bot,
  Video,
  Mic,
  Code2,
  Check
} from 'lucide-react';

export const MixedInterviewSetup: React.FC = () => {
  const [role, setRole] = useState('Software Engineer');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>('Intermediate');
  const [numQuestions, setNumQuestions] = useState<number>(10);

  const navigate = useNavigate();
  const location = useLocation();
  const interviewType = location.state?.type || 'mixed';
  const interviewTitle = location.state?.title || 'Mixed Mock Interview';

  return (
    <PageContainer
      title="Mixed Mock Interview Setup"
      subtitle="Configure a comprehensive session combining Technical, Coding, and MCQ questions."
    >
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="p-6 sm:p-7 space-y-6 border border-slate-200/80">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Target Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all cursor-pointer"
            >
              <option value="Software Engineer">Software Engineer (General)</option>
              <option value="Backend Developer">Backend Engineer (Java / Distributed Systems)</option>
              <option value="Full Stack Engineer">Full Stack Engineer (React / Node / Cloud)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Difficulty Level
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(['Beginner', 'Intermediate', 'Advanced', 'Expert'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setDifficulty(lvl)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                    difficulty === lvl
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-[1.02]'
                      : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Total Questions (Mixed)
            </label>
            <div className="grid grid-cols-4 gap-2.5">
              {[5, 10, 15, 20].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setNumQuestions(num)}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                    numQuestions === num
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{num}</span>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Questions will be dynamically shuffled between Technical, Coding, and Core CS Fundamentals.
            </p>
          </div>

          <div className="pt-6">
            <Button
              variant="gradient"
              size="lg"
              onClick={() => navigate('/interview/mixed', { 
                state: { 
                  config: { title: interviewTitle, type: interviewType, role, difficulty, numQuestions } 
                } 
              })}
              icon={<Layers className="w-4 h-4" />}
              className="w-full font-bold"
            >
              Start Mixed Interview
            </Button>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};
