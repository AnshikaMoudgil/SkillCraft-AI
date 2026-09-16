import React from 'react';
import { Modal } from '../common/Modal';
import {
  Brain,
  Search,
  Mic,
  GitBranch,
  ShieldCheck,
  Database,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  const architectures = [
    {
      name: 'Azure OpenAI / Foundry',
      icon: Brain,
      badge: 'Generative AI',
      color: 'from-blue-600 to-indigo-600',
      description: 'Generates role-specific questions, evaluates technical code syntax, performs deep code reviews, and synthesizes instant interview feedback.'
    },
    {
      name: 'Azure AI Search',
      icon: Search,
      badge: 'Vector RAG',
      color: 'from-cyan-600 to-blue-600',
      description: 'RAG retrieval pipeline for candidate resumes, project repositories, job descriptions, and domain knowledge bases.'
    },
    {
      name: 'Azure Speech',
      icon: Mic,
      badge: 'Real-time Audio',
      color: 'from-indigo-600 to-purple-600',
      description: 'Real-time neural text-to-speech and low-latency speech-to-text transcription with conversational filler word detection.'
    },
    {
      name: 'Foundry Agent',
      icon: GitBranch,
      badge: 'Adaptive State',
      color: 'from-purple-600 to-pink-600',
      description: 'Autonomous adaptive interviewer that orchestrates dialogue flow, follow-up inquiry branches, and dynamic difficulty scaling.'
    },
    {
      name: 'Foundry Evaluation',
      icon: ShieldCheck,
      badge: 'Quality & Safety',
      color: 'from-emerald-600 to-teal-600',
      description: 'Standardized evaluation metrics for factual accuracy, ground-truth alignment, rubric compliance, and hallucination prevention.'
    },
    {
      name: 'Supabase / Database',
      icon: Database,
      badge: 'Data & Auth',
      color: 'from-emerald-700 to-emerald-500',
      description: 'Secure user authentication, session state persistence, document storage, and structured analytics history.'
    }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Where AI is Used" maxWidth="2xl">
      <div className="space-y-4">
        <p className="text-xs text-slate-500">
          Future-ready architecture designed for seamless cloud integration across Microsoft Foundry, Azure AI Services, and vector search.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
          {architectures.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-indigo-100 hover:shadow-md transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg bg-gradient-to-tr ${item.color} text-white flex items-center justify-center shrink-0 shadow-sm`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                        {item.name}
                      </h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-slate-600 border border-slate-200 shrink-0 font-medium">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100/60 flex items-center justify-between text-xs text-indigo-900">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            <span className="font-medium">
              Frontend service abstraction layer ready in <code className="text-indigo-700 bg-white/60 px-1 py-0.5 rounded">src/services/*</code>
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
};
