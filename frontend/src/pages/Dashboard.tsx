import React, { useState, useEffect } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { StatCard } from '../components/dashboard/StatCard';
import { AiRecommendationCard } from '../components/dashboard/AiRecommendationCard';
import { RecentInterviews } from '../components/dashboard/RecentInterviews';
import { QuickActions } from '../components/dashboard/QuickActions';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../lib/apiClient';
import { RecentInterview } from '../types';

export const Dashboard: React.FC = () => {
  const { user, syncUserStats } = useAuth();
  const displayName = user.name && user.name.trim() ? user.name : 'Candidate';
  const [interviews, setInterviews] = useState<RecentInterview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await apiClient.get<RecentInterview[]>('/interview/recent');
        if (data) {
          setInterviews(data);
          const count = data.length;
          const scores = data.map((i) => i.score).filter((s): s is number => typeof s === 'number');
          const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
          const scoreDiff = scores.length >= 2 ? scores[0] - scores[scores.length - 1] : 0;

          syncUserStats({
            interviewsCompleted: count,
            overallScore: avgScore,
            scoreChange: scoreDiff,
            codingStreak: count > 0 ? Math.min(count, 7) : 0
          });
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <PageContainer
      title={`Welcome back, ${displayName}!`}
      subtitle="Here's your real-time interview preparation overview and AI recommendations."
    >
      <div className="space-y-6">
        {/* Top Statistics Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <StatCard
            title="Overall Score"
            value={user.overallScore > 0 ? user.overallScore : '—'}
            subvalue={user.overallScore > 0 ? '/ 100' : 'No tests yet'}
            changeBadge={user.scoreChange ? `${user.scoreChange > 0 ? '+' : ''}${user.scoreChange}%` : undefined}
            type="score"
          />
          <StatCard
            title="Interviews Completed"
            value={user.interviewsCompleted}
            type="interviews"
          />
          <StatCard
            title="Coding Streak"
            value={`${user.codingStreak} ${user.codingStreak === 1 ? 'day' : 'days'}`}
            type="streak"
          />
        </div>

        {/* AI Recommendation Card */}
        <AiRecommendationCard />

        {/* Recent Interviews & Quick Actions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentInterviews interviews={interviews} loading={loading} />
          </div>
          <div className="lg:col-span-1">
            <QuickActions />
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
