import { RecentInterview, InterviewPlanItem, ChatMessage, CommunicationMetric } from '../types';

export const mockRecentInterviews: RecentInterview[] = [
  {
    id: 'int-1',
    title: 'Technical Interview',
    type: 'technical',
    score: 82,
    date: '15 Sep 2026',
    duration: '30 min',
    role: 'Software Engineer',
    difficulty: 'Intermediate'
  },
  {
    id: 'int-2',
    title: 'Mock Interview',
    type: 'mock',
    score: 76,
    date: '12 Sep 2026',
    duration: '45 min',
    role: 'Backend Developer',
    difficulty: 'Intermediate'
  },
  {
    id: 'int-3',
    title: 'Coding Interview',
    type: 'coding',
    score: 68,
    date: '09 Sep 2026',
    duration: '60 min',
    role: 'Full Stack Engineer',
    difficulty: 'Intermediate'
  }
];

export const mockDefaultInterviewPlan: InterviewPlanItem[] = [
  { step: 1, title: 'Introduction & Icebreaker', description: 'Brief background, passions, and communication calibration.', topic: 'Behavioral', estimatedMinutes: 3 },
  { step: 2, title: 'Resume Based Questions', description: 'Deep-dive into project architectures and tech stack choices.', topic: 'Projects', estimatedMinutes: 4 },
  { step: 3, title: 'Java Fundamentals', description: 'Core OOP, memory management, collections framework, and multi-threading.', topic: 'Java', estimatedMinutes: 5 },
  { step: 4, title: 'DSA Problem', description: 'Solving cycle detection / two sum with optimal algorithmic complexity.', topic: 'DSA', estimatedMinutes: 6 },
  { step: 5, title: 'DSA Follow-up', description: 'Edge case handling, space trade-offs, and scalability analysis.', topic: 'DSA', estimatedMinutes: 4 },
  { step: 6, title: 'DBMS Concepts', description: 'ACID guarantees, transaction isolation levels, indexing, and normalization.', topic: 'DBMS', estimatedMinutes: 4 },
  { step: 7, title: 'Project Deep Dive', description: 'Architecture trade-offs in AI Interview Coach project.', topic: 'Projects', estimatedMinutes: 4 },
  { step: 8, title: 'Behavioral Question', description: 'Handling ambiguity, teamwork conflict resolution, and ownership.', topic: 'Behavioral', estimatedMinutes: 3 },
  { step: 9, title: 'Final Feedback', description: 'Comprehensive AI synthesis and immediate performance debrief.', topic: 'Feedback', estimatedMinutes: 2 }
];

export const mockTranscriptConversation: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'ai',
    text: 'Hello Anshika! Welcome to your technical mock interview. Let us begin with your background. Explain your featured machine learning project.',
    timestamp: '02:12',
    topic: 'Project Deep Dive'
  },
  {
    id: 'msg-2',
    sender: 'user',
    text: 'I built a machine learning model using Random Forest to predict student placement outcomes based on academic history, project metrics, and internship experience.',
    timestamp: '02:24',
    topic: 'Project Deep Dive'
  },
  {
    id: 'msg-3',
    sender: 'ai',
    text: 'Why did you choose Random Forest over gradient boosted trees or a neural network for this problem?',
    timestamp: '03:10',
    topic: 'Project Deep Dive'
  },
  {
    id: 'msg-4',
    sender: 'user',
    text: 'It handles overfitting well and works great with tabular data. We had around 10,000 tabular records with categorical features, so bagging gave us high interpretability and robust variance reduction.',
    timestamp: '03:42',
    topic: 'Project Deep Dive'
  },
  {
    id: 'msg-5',
    sender: 'ai',
    text: 'What would happen if your dataset was severely class-imbalanced? How would you handle that scenario in production?',
    timestamp: '04:18',
    topic: 'Machine Learning Concepts'
  },
  {
    id: 'msg-6',
    sender: 'user',
    text: 'If imbalanced, accuracy becomes deceptive. I would evaluate using PR-AUC and F1-score rather than ROC-AUC, and apply SMOTE or cost-sensitive focal loss during training.',
    timestamp: '04:55',
    topic: 'Machine Learning Concepts'
  },
  {
    id: 'msg-7',
    sender: 'ai',
    text: 'Explain your approach to detecting a cycle in a singly linked list.',
    timestamp: '05:30',
    topic: 'Linked Lists'
  },
  {
    id: 'msg-8',
    sender: 'user',
    text: "I would use Floyd's cycle detection algorithm with slow and fast pointers. The slow pointer moves one node while the fast pointer moves two nodes at each step.",
    timestamp: '05:52',
    topic: 'Linked Lists'
  },
  {
    id: 'msg-9',
    sender: 'ai',
    text: "That's a good approach. What happens if the list has no cycle? How do we handle that case and ensure termination without NullPointerExceptions?",
    timestamp: '06:15',
    topic: 'Linked Lists'
  }
];

export const mockCommunicationMetrics: CommunicationMetric[] = [
  { label: 'Speaking Pace', status: 'Good', score: 88, description: '135 words per minute. Optimal for technical clarity.' },
  { label: 'Filler Words', status: 'Medium', score: 72, description: 'Slight hesitation during algorithmic edge case questions.' },
  { label: 'Clarity', status: 'Good', score: 90, description: 'Crisp articulation of time and space trade-offs.' },
  { label: 'Confidence', status: 'Good', score: 85, description: 'Consistent tone and structured responses.' },
  { label: 'Answer Structure', status: 'Good', score: 86, description: 'Follows STAR method and problem-solving framework.' }
];

export const mockFillerWords = [
  { word: 'um', count: 4, level: 'low' },
  { word: 'like', count: 2, level: 'low' },
  { word: 'actually', count: 3, level: 'low' }
];

export const mockReportData = {
  overallScore: 81,
  totalPossible: 100,
  date: '15 Sep 2026',
  duration: '28 min',
  skillBreakdown: [
    { skill: 'Technical Knowledge', score: 85, color: '#4F46E5' },
    { skill: 'Problem Solving', score: 76, color: '#6366F1' },
    { skill: 'Communication', score: 81, color: '#8B5CF6' },
    { skill: 'CS Fundamentals', score: 71, color: '#A855F7' },
    { skill: 'Project Knowledge', score: 90, color: '#10B981' }
  ],
  strongAreas: [
    'Java & DSA Problem Solving',
    'Project Architecture Explanation',
    'Clear Structured Communication'
  ],
  areasToImprove: [
    'DBMS Transactions & Isolation Levels',
    'Operating Systems Scheduling',
    'High-Level System Design Partitioning'
  ],
  aiRecommendation: 'Focus on DBMS transactions and OS scheduling before your next technical mock. Your algorithm explanation was stellar!'
};
