export const mockPerformanceTrend = [
  { name: 'Interview 1', score: 62, date: '25 Aug' },
  { name: 'Interview 2', score: 68, date: '01 Sep' },
  { name: 'Interview 3', score: 74, date: '09 Sep' },
  { name: 'Interview 4', score: 81, date: '15 Sep' }
];

export const mockSkillBreakdownChart = [
  { skill: 'Technical', score: 85, fill: '#4F46E5' },
  { skill: 'Problem Solving', score: 76, fill: '#6366F1' },
  { skill: 'Communication', score: 81, fill: '#8B5CF6' },
  { skill: 'DBMS', score: 62, fill: '#EF4444' }, // Highlighted low area
  { skill: 'DSA', score: 88, fill: '#10B981' },
  { skill: 'Projects', score: 90, fill: '#06B6D4' }
];

export const mockProgressStats = {
  overallScore: 78,
  scoreImprovement: 12,
  interviewsCompleted: 3,
  learningStreak: 5,
  aiInsight: 'Your technical score has improved by 19 points, but DBMS performance has remained below 65% across your last 3 interviews. Prioritize transactions & normalization.'
};
