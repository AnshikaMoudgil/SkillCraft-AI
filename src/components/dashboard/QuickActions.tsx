import React from 'react';
import { Card } from '../common/Card';
import { Code2, Video, FileUp, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Start Coding Practice',
      description: 'Solve DSA & system algorithms in sandbox',
      icon: Code2,
      path: '/coding',
      color: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white',
      border: 'hover:border-indigo-200'
    },
    {
      title: 'Start Mock Interview',
      description: 'AI adaptive role-specific questioning',
      icon: Video,
      path: '/interviews',
      color: 'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white',
      border: 'hover:border-purple-200'
    },
    {
      title: 'Upload Resume',
      description: 'Extract skills & project RAG questions',
      icon: FileUp,
      path: '/resume',
      color: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
      border: 'hover:border-blue-200'
    }
  ];

  return (
    <Card className="p-5 sm:p-6">
      <h3 className="text-base font-bold text-slate-900 mb-4">Quick Actions</h3>

      <div className="space-y-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <div
              key={act.title}
              onClick={() => navigate(act.path)}
              className={`p-3.5 rounded-xl border border-slate-100 hover:shadow-sm transition-all cursor-pointer flex items-center justify-between group ${act.border}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-200 ${act.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                    {act.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{act.description}</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
            </div>
          );
        })}
      </div>
    </Card>
  );
};
