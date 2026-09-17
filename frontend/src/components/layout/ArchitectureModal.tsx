import React from 'react';
import { Modal } from '../common/Modal';
import {
  Brain,
  Search,
  Mic,
  GitBranch,
  Database,
  KeyRound,
  HardDrive,
  Cpu,
  Layers,
  Sparkles,
  CheckCircle2,
  ArrowDown
} from 'lucide-react';

export interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  const stackLayers = [
    {
      title: 'Frontend',
      component: 'React + Vite',
      badge: 'Client SPA',
      desc: 'High-performance React 19 + TypeScript frontend with Tailwind CSS and Recharts.',
      icon: Layers,
      color: 'from-blue-600 to-cyan-500'
    },
    {
      title: 'Backend',
      component: 'FastAPI + Python',
      badge: 'REST & SSE',
      desc: 'High-throughput async Python 3.12 service with Pydantic validation and JWT verification.',
      icon: Cpu,
      color: 'from-emerald-600 to-teal-500'
    },
    {
      title: 'Database',
      component: 'Supabase PostgreSQL',
      badge: 'Relational & RLS',
      desc: 'Cloud PostgreSQL with Row Level Security, relational profiles, interview history, and transcripts.',
      icon: Database,
      color: 'from-teal-600 to-emerald-500'
    },
    {
      title: 'Authentication',
      component: 'Supabase Auth',
      badge: 'JWT & GoTrue',
      desc: 'OAuth, email/password authentication with secure stateless JSON Web Tokens.',
      icon: KeyRound,
      color: 'from-amber-600 to-yellow-500'
    },
    {
      title: 'File Storage',
      component: 'Supabase Storage',
      badge: 'Resumes & Blobs',
      desc: 'Secure object storage for candidate resumes with strict user-isolated storage policies.',
      icon: HardDrive,
      color: 'from-orange-600 to-amber-500'
    },
    {
      title: 'AI Platform',
      component: 'Microsoft Foundry',
      badge: 'Generative AI',
      desc: 'Enterprise Azure AI model endpoints (GPT-4o) for reasoning, code reviews, and evaluation.',
      icon: Brain,
      color: 'from-indigo-600 to-purple-500'
    },
    {
      title: 'Agent Orchestration',
      component: 'Foundry Agent Service',
      badge: 'Autonomous Agents',
      desc: 'Multi-agent system: Adaptive Interviewer, Coding Coach, and Behavioral Evaluator.',
      icon: GitBranch,
      color: 'from-purple-600 to-pink-500'
    },
    {
      title: 'RAG Knowledge',
      component: 'Azure AI Search',
      badge: 'Vector & Hybrid',
      desc: 'Vectorized candidate resumes and interview rubrics retrieved in real time to ground agent responses.',
      icon: Search,
      color: 'from-blue-700 to-indigo-600'
    },
    {
      title: 'Voice Pipeline',
      component: 'Azure AI Speech',
      badge: 'Neural STT & TTS',
      desc: 'Real-time speech-to-text token vending and ultra-low latency neural conversational synthesis.',
      icon: Mic,
      color: 'from-rose-600 to-pink-500'
    }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="SkillCraft AI System Architecture" maxWidth="2xl">
      <div className="space-y-5">
        <p className="text-xs text-slate-500">
          Complete end-to-end production architecture connecting React frontend to FastAPI Python backend, Supabase, Microsoft Foundry, and Azure AI.
        </p>

        {/* Vertical Pipeline Flow matching user's architecture */}
        <div className="flex flex-col items-center space-y-2 py-2">
          {stackLayers.map((layer, index) => {
            const Icon = layer.icon;
            const isLast = index === stackLayers.length - 1;
            return (
              <React.Fragment key={layer.title}>
                <div className="w-full bg-slate-50/80 hover:bg-white border border-slate-200/80 hover:border-indigo-300 rounded-xl p-3 shadow-xs hover:shadow-md transition-all group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg bg-gradient-to-tr ${layer.color} text-white flex items-center justify-center shadow-xs shrink-0`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{layer.title}</span>
                          <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {layer.component}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{layer.desc}</p>
                      </div>
                    </div>
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100/80 font-medium shrink-0">
                      {layer.badge}
                    </span>
                  </div>
                </div>

                {!isLast && (
                  <div className="flex items-center justify-center text-slate-400 py-0.5">
                    <ArrowDown className="w-4 h-4 animate-bounce text-indigo-500/70" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 flex items-center justify-between text-xs text-emerald-900">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">
              Architecture fully scaffolded: <code className="text-emerald-800 bg-white/70 px-1 py-0.5 rounded">backend/</code> (FastAPI) &amp; <code className="text-emerald-800 bg-white/70 px-1 py-0.5 rounded">frontend/</code> (React) with active <code className="text-emerald-800 bg-white/70 px-1 py-0.5 rounded">.env</code> configurations.
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
};
