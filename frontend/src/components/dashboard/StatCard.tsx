import React from 'react';
import { Card } from '../common/Card';
import { TrendingUp, Award, Flame } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  subvalue?: string;
  changeBadge?: string;
  type: 'score' | 'interviews' | 'streak';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subvalue,
  changeBadge,
  type
}) => {
  const icons = {
    score: {
      icon: Award,
      bg: 'bg-gradient-to-tr from-indigo-50 to-indigo-100 text-indigo-600 border border-indigo-200/50 shadow-xs'
    },
    interviews: {
      icon: TrendingUp,
      bg: 'bg-gradient-to-tr from-blue-50 to-cyan-100 text-blue-600 border border-blue-200/50 shadow-xs'
    },
    streak: {
      icon: Flame,
      bg: 'bg-gradient-to-tr from-amber-50 to-orange-100 text-amber-600 border border-amber-200/50 shadow-xs'
    }
  }[type];

  const Icon = icons.icon;

  return (
    <Card className="p-5 sm:p-6 flex items-center justify-between card-hover-lift border border-slate-200/80 bg-white">
      <div className="space-y-1.5">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          {title}
        </p>
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {value}
          </span>
          {subvalue && (
            <span className="text-xs font-semibold text-slate-400">{subvalue}</span>
          )}
          {changeBadge && (
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <TrendingUp className="w-3 h-3" />
              {changeBadge}
            </span>
          )}
        </div>
      </div>

      <div className={`w-13 h-13 rounded-2xl ${icons.bg} flex items-center justify-center shrink-0`}>
        <Icon className="w-6 h-6" />
      </div>
    </Card>
  );
};
