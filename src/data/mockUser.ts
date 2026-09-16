import { UserProfile } from '../types';

export const mockUser: UserProfile = {
  name: 'Devansh Sharma',
  role: 'Student',
  overallScore: 78,
  scoreChange: 12, // +12%
  interviewsCompleted: 3,
  codingStreak: 5, // 5 days
  email: 'devansh.sharma@example.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  skills: ['Java', 'Python', 'Machine Learning', 'SQL', 'DSA', 'Spring Boot']
};
