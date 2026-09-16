import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { StatCard } from '../components/dashboard/StatCard';
import { AiRecommendationCard } from '../components/dashboard/AiRecommendationCard';
import { RecentInterviews } from '../components/dashboard/RecentInterviews';
import { QuickActions } from '../components/dashboard/QuickActions';
import { useAuth } from '../context/AuthContext';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <PageContainer
      title={`Good morning, ${user.name.split(' ')[0]}! ☀️`}
      subtitle="Here's your progress and recommendations."
    >
      <div className="space-y-6">
        {/* Top Statistics Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <StatCard
            title="Overall Score"
            value={user.overallScore}
            subvalue="/ 100"
            changeBadge={`+${user.scoreChange}%`}
            type="score"
          />
          <StatCard
            title="Interviews Completed"
            value={user.interviewsCompleted}
            type="interviews"
          />
          <StatCard
            title="Coding Streak"
            value={`${user.codingStreak} days`}
            type="streak"
          />
        </div>

        {/* AI Recommendation Card */}
        <AiRecommendationCard />

        {/* Recent Interviews & Quick Actions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentInterviews />
          </div>
          <div className="lg:col-span-1">
            <QuickActions />
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
