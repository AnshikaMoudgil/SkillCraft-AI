import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Calendar, Clock, Terminal, Video, Code } from 'lucide-react';
import { apiClient } from '../../lib/apiClient';
import { RecentInterview } from '../../types';

export interface RecentInterviewsProps {
  interviews?: RecentInterview[];
  loading?: boolean;
}

export const RecentInterviews: React.FC<RecentInterviewsProps> = ({
  interviews: propInterviews,
  loading: propLoading
}) => {
  const navigate = useNavigate();
  const [internalInterviews, setInternalInterviews] = useState<RecentInterview[]>([]);
  const [internalLoading, setInternalLoading] = useState(true);

  const interviews = propInterviews !== undefined ? propInterviews : internalInterviews;
  const loading = propLoading !== undefined ? propLoading : internalLoading;

  useEffect(() => {
    if (propInterviews !== undefined) return;
    const fetchInterviews = async () => {
      try {
        const data = await apiClient.get<RecentInterview[]>('/interview/recent');
        if (data) {
          setInternalInterviews(data);
        }
      } catch (err) {
        console.error("Failed to fetch recent interviews", err);
      } finally {
        setInternalLoading(false);
      }
    };
    fetchInterviews();
  }, [propInterviews]);

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (score >= 70) return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    return 'bg-amber-50 text-amber-700 border-amber-200';
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'technical':
        return <Terminal className="w-4 h-4 text-indigo-600" />;
      case 'mock':
        return <Video className="w-4 h-4 text-purple-600" />;
      case 'coding':
        return <Code className="w-4 h-4 text-blue-600" />;
      default:
        return <Terminal className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-900">Recent Interviews</h3>
        <button
          onClick={() => navigate('/progress')}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          View All &rarr;
        </button>
      </div>

      <div className="divide-y divide-slate-100">
        {loading ? (
          <div className="py-8 text-sm text-slate-500 text-center animate-pulse flex flex-col items-center justify-center gap-2">
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <span>Loading recent interview sessions...</span>
          </div>
        ) : interviews.length === 0 ? (
          <div className="py-8 px-4 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-xs">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">No mock interviews completed yet</p>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Take your first practice session to get AI-generated scorecards, Big-O complexity reports, and speech clarity analytics.
              </p>
            </div>
            <button
              onClick={() => navigate('/interviews')}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold shadow-md shadow-indigo-500/20 hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all cursor-pointer"
            >
              <span>Start First Interview</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          interviews.map((interview) => (
            <div
              key={interview.id}
              onClick={() => navigate(`/interview/report?sessionId=${interview.id}`)}
              className="py-3.5 flex items-center justify-between hover:bg-slate-50/80 -mx-2 px-2 rounded-xl transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:shadow-sm transition-all">
                  {getIcon(interview.type)}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                    {interview.title}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {interview.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {interview.duration}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getScoreBadgeColor(
                    interview.score
                  )}`}
                >
                  {interview.score}%
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
