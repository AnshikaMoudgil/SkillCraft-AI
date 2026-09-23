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

export const CodingInterviewSetup: React.FC = () => {
  const [role, setRole] = useState('Software Engineer');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>('Intermediate');
  const [language, setLanguage] = useState('Java');
  const [numProblems, setNumProblems] = useState<number>(2);

  const navigate = useNavigate();
  const location = useLocation();
  const interviewType = location.state?.type || 'coding';
  const interviewTitle = location.state?.title || 'Coding Interview';

  return (
    <PageContainer
      title="Coding Interview Setup"
      subtitle="Customize your isolated coding assessment."
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
              Number of Problems
            </label>
            <div className="grid grid-cols-4 gap-2.5">
              {[1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setNumProblems(num)}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                    numProblems === num
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{num}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Programming Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all cursor-pointer"
            >
              <option value="Java">Java</option>
              <option value="Python">Python</option>
              <option value="C++">C++</option>
              <option value="JavaScript">JavaScript</option>
            </select>
          </div>

          <div className="pt-6">
            <Button
              variant="gradient"
              size="lg"
              onClick={() => navigate('/interview/coding', { 
                state: { 
                  config: { title: interviewTitle, type: interviewType, role, difficulty, language, numProblems } 
                } 
              })}
              icon={<Code2 className="w-4 h-4" />}
              className="w-full font-bold"
            >
              Start Coding Interview
            </Button>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};
