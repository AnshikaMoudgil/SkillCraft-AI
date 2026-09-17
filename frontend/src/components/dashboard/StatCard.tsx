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
      bg: 'bg-indigo-50',
      text: 'text-indigo-600'
    },
    interviews: {
      icon: TrendingUp,
      bg: 'bg-blue-50',
      text: 'text-blue-600'
    },
    streak: {
      icon: Flame,
      bg: 'bg-amber-50',
      text: 'text-amber-500'
    }
  }[type];

  const Icon = icons.icon;

  return (
    <Card className="p-5 flex items-center justify-between hover:shadow-md transition-shadow">
      <div className="space-y-1">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {value}
          </span>
          {subvalue && (
            <span className="text-sm font-medium text-slate-400">{subvalue}</span>
          )}
          {changeBadge && (
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
              <TrendingUp className="w-3 h-3" />
              {changeBadge}
            </span>
          )}
        </div>
      </div>

      <div className={`w-12 h-12 rounded-2xl ${icons.bg} ${icons.text} flex items-center justify-center shrink-0`}>
        <Icon className="w-6 h-6" />
      </div>
    </Card>
  );
};
