export interface UserProfile {
  name: string;
  role: string;
  avatarUrl?: string;
  overallScore: number;
  scoreChange: number;
  interviewsCompleted: number;
  codingStreak: number;
  skills: string[];
  email?: string;
}

export interface RecentInterview {
  id: string;
  title: string;
  type: 'technical' | 'mock' | 'coding' | 'resume';
  score: number;
  date: string;
  duration: string;
  role: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface CodingProblem {
  id: string;
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  starterCode: Record<string, string>;
  testCases: {
    id: number;
    input: string;
    expected: string;
    actual?: string;
    status?: 'passed' | 'failed';
  }[];
  hints: string[];
  solutionExplanation: string;
  complexity: {
    time: string;
    space: string;
    explanation: string;
  };
}

export interface ResumeData {
  fileName: string;
  fileSize: string;
  parsedDate: string;
  skills: string[];
  projects: {
    title: string;
    description: string;
    techStack: string[];
  }[];
  experienceYears: number;
  education: string;
  roleMatchScore: number;
  suggestedFocusAreas: string[];
}

export interface InterviewPlanItem {
  step: number;
  title: string;
  description: string;
  topic: string;
  estimatedMinutes: number;
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user' | 'system';
  text: string;
  timestamp: string;
  topic?: string;
  analysis?: {
    clarity?: string;
    sentiment?: string;
    keyPoints?: string[];
  };
}

export interface CommunicationMetric {
  label: string;
  status: 'Good' | 'Medium' | 'Needs Work';
  score: number;
  description: string;
}

export interface DayPlan {
  day: number;
  title: string;
  topics: string[];
  estimatedTime: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  actionLabel: string;
}
