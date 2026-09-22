import React, { useState, useEffect } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/common/Card';
import { StatCard } from '../components/dashboard/StatCard';
import { Button } from '../components/common/Button';
import { apiClient } from '../lib/apiClient';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { Sparkles, Download, ArrowRight, TrendingUp, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

export const ProgressDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await apiClient.get<any>('/interview/analytics');
        if (data) setAnalytics(data);
      } catch (err) {
        showToast('Failed to load analytics', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [showToast]);

  if (loading) {
    return (
      <PageContainer title="Your Progress">
        <div className="flex items-center justify-center h-48 text-slate-500 animate-pulse">Loading analytics...</div>
      </PageContainer>
    );
  }

  const skillBreakdown = (analytics?.skillBreakdown || []).filter((s: any) => s && s.skill);
  const rawTrend = analytics?.performanceTrend || [];
  const performanceTrend = rawTrend.map((t: any) => ({
    date: t.date || t.name || 'Recent',
    score: t.score ?? 0
  }));
  const progressStats = analytics?.progressStats || {
    overallScore: 0,
    scoreImprovement: 0,
    interviewsCompleted: 0,
    learningStreak: 0,
    aiInsight: 'Take your first mock interview to generate personalized AI performance insights.'
  };

  const hasData = progressStats.interviewsCompleted > 0;

  return (
    <PageContainer
      title="Your Progress"
      subtitle="Track your improvement over time and identify weak areas."
    >
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Top Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <StatCard
            title="Overall Score"
            value={hasData ? `${progressStats.overallScore}%` : '—'}
            changeBadge={progressStats.interviewsCompleted >= 2 ? `${progressStats.scoreImprovement >= 0 ? '+' : ''}${progressStats.scoreImprovement}%` : undefined}
            type="score"
          />
          <StatCard
            title="Interviews Completed"
            value={progressStats.interviewsCompleted}
            type="interviews"
          />
          <StatCard
            title="Learning Streak"
            value={`${progressStats.learningStreak} days`}
            type="streak"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Skill-wise Performance Bar Chart (6 cols) */}
          <Card className="lg:col-span-6 p-6 border border-slate-200/80 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Skill-wise Performance
              </h3>
              <span className="text-xs text-slate-400">Current Readiness</span>
            </div>

            <div className="h-64 w-full">
              {hasData && skillBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={skillBreakdown}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                    <XAxis type="number" domain={[0, 100]} stroke="#94A3B8" fontSize={11} />
                    <YAxis
                      type="category"
                      dataKey="skill"
                      stroke="#64748B"
                      fontSize={11}
                      tickLine={false}
                      width={90}
                    />
                    <Tooltip
                      formatter={(val: any) => [`${val}%`, 'Readiness']}
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '12px',
                        border: 'none'
                      }}
                    />
                    <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                      {skillBreakdown.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.fill || '#4F46E5'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
                  <Sparkles className="w-8 h-8 text-indigo-400 mb-2" />
                  <p className="text-xs font-bold text-slate-700">No Skill Data Yet</p>
                  <p className="text-[11px] text-slate-400 max-w-xs mt-1">
                    Complete your first mock interview to map your technical accuracy and skill strengths.
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Right: Performance Trend Line Chart (6 cols) */}
          <Card className="lg:col-span-6 p-6 border border-slate-200/80 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Performance Trend
              </h3>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                progressStats.scoreImprovement >= 0 
                  ? 'text-emerald-600 bg-emerald-50 border-emerald-200' 
                  : 'text-amber-600 bg-amber-50 border-amber-200'
              }`}>
                {progressStats.interviewsCompleted >= 2 
                  ? `${progressStats.scoreImprovement >= 0 ? '+' : ''}${progressStats.scoreImprovement} pts` 
                  : 'Baseline'}
              </span>
            </div>

            <div className="h-64 w-full">
              {hasData && performanceTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={performanceTrend}
                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} />
                    <YAxis domain={[0, 100]} stroke="#94A3B8" fontSize={11} />
                    <Tooltip
                      formatter={(val: any) => [`${val}%`, 'Score']}
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '12px',
                        border: 'none'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#4F46E5"
                      strokeWidth={3}
                      dot={{ fill: '#4F46E5', strokeWidth: 2, r: 5 }}
                      activeDot={{ r: 7, fill: '#7C3AED' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
                  <TrendingUp className="w-8 h-8 text-indigo-400 mb-2" />
                  <p className="text-xs font-bold text-slate-700">No Trend Recorded</p>
                  <p className="text-[11px] text-slate-400 max-w-xs mt-1">
                    Complete mock interviews over time to visualize your historical score trajectory.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* AI Insight Card */}
        <Card className="p-6 bg-gradient-to-r from-indigo-50/90 via-purple-50/70 to-white border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                AI Insight & Pattern Recognition
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed mt-0.5">
                {progressStats.aiInsight}
              </p>
            </div>
          </div>

          <Button
            variant="gradient"
            size="md"
            onClick={() => navigate(hasData ? '/learning' : '/interviews')}
            icon={<ArrowRight className="w-4 h-4" />}
            className="shrink-0 font-bold"
          >
            {hasData ? 'Start Remedial Plan' : 'Start Mock Interview'}
          </Button>
        </Card>
      </div>
    </PageContainer>
  );
};
