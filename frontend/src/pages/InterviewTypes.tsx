import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useNavigate } from 'react-router-dom';
import {
  Network,
  Code2,
  FileText,
  Layers,
  ArrowRight,
  Sparkles,
  CheckCircle
} from 'lucide-react';

export const InterviewTypes: React.FC = () => {
  const navigate = useNavigate();

  const interviewTypes = [
    {
      id: 'technical',
      title: 'Technical Interview',
      description: 'Core concepts, problem solving, system design, and algorithmic reasoning tailored to software engineering roles.',
      icon: Network,
      color: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
      borderHover: 'hover:border-blue-300',
      badge: 'Most Popular',
      tags: ['System Design', 'Algorithms', 'Core CS'],
      targetPath: '/interview/setup'
    },
    {
      id: 'coding',
      title: 'Coding Interview',
      description: 'Solve coding problems in a real interview environment with live compiler, test execution, and AI Big-O audits.',
      icon: Code2,
      color: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white',
      borderHover: 'hover:border-indigo-300',
      badge: 'Hands-on IDE',
      tags: ['Live Compiler', 'Unit Tests', 'Complexity'],
      targetPath: '/coding'
    },
    {
      id: 'resume',
      title: 'Resume Based Interview',
      description: 'AI extracts your past projects, technology stack, and work history to ask targeted contextual questions.',
      icon: FileText,
      color: 'bg-cyan-50 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white',
      borderHover: 'hover:border-cyan-300',
      badge: 'Resume Tailored',
      tags: ['Project Deep-Dive', 'Tech Stack', 'STAR Method'],
      targetPath: '/resume'
    },
    {
      id: 'mixed',
      title: 'Mixed Mock Interview',
      description: 'Comprehensive simulation combining technical fundamentals, behavioral STAR questions, and architectural discussions.',
      icon: Layers,
      color: 'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white',
      borderHover: 'hover:border-purple-300',
      badge: 'Complete Simulation',
      tags: ['Technical + Behavioral', 'Adaptive AI', 'Full Report'],
      targetPath: '/interview/setup'
    }
  ];

  return (
    <PageContainer
      title="Choose Your Interview Type"
      subtitle="Select the type of interview you want to practice with."
    >
      <div className="space-y-6">
        <div className="max-w-2xl">
          <p className="text-sm text-slate-600">
            Each mode features real-time adaptive questioning powered by advanced AI models.
            Select your preferred practice mode below to begin.
          </p>
        </div>

        {/* 4 Large Interactive Cards matching reference Screen 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {interviewTypes.map((type) => {
            const Icon = type.icon;
            return (
              <Card
                key={type.id}
                onClick={() => navigate(type.targetPath)}
                className={`p-6 sm:p-7 flex flex-col justify-between cursor-pointer border border-slate-200/80 hover:shadow-xl transition-all duration-300 group ${type.borderHover}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm ${type.color}`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-700 transition-colors">
                      {type.badge}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {type.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                    {type.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {type.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/60 text-slate-600 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">
                    Configure Session
                  </span>
                  <div className="flex items-center gap-1 text-sm font-bold text-indigo-600 group-hover:translate-x-1 transition-transform">
                    <span>Start Interview</span>
                    <ArrowRight className="w-4 h-4" />
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
