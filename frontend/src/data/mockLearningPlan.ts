import { DayPlan } from '../types';

export const mock7DayPlan: DayPlan[] = [
  {
    day: 1,
    title: 'DBMS Transactions',
    topics: ['ACID Properties', 'Commit / Rollback Protocols', 'Isolation Levels & Anomalies'],
    estimatedTime: '45 mins',
    status: 'completed',
    actionLabel: 'Review Summary'
  },
  {
    day: 2,
    title: 'Database Normalization',
    topics: ['1NF, 2NF, 3NF Definitions', 'Boyce-Codd Normal Form (BCNF)', 'Denormalization Trade-offs'],
    estimatedTime: '50 mins',
    status: 'in_progress',
    actionLabel: 'Continue Practice'
  },
  {
    day: 3,
    title: 'Operating Systems',
    topics: ['Processes vs Threads', 'CPU Scheduling Algorithms', 'Deadlocks & Prevention'],
    estimatedTime: '60 mins',
    status: 'upcoming',
    actionLabel: 'Start Practice'
  },
  {
    day: 4,
    title: 'SQL Practice',
    topics: ['Complex JOIN Operations', 'Window Functions & Grouping', 'Index Types & Query Tuning'],
    estimatedTime: '45 mins',
    status: 'upcoming',
    actionLabel: 'Start Practice'
  },
  {
    day: 5,
    title: 'DBMS Mock Interview',
    topics: ['Targeted 20-min AI Assessment', 'Real-time Follow-ups', 'Weakness Validation'],
    estimatedTime: '30 mins',
    status: 'upcoming',
    actionLabel: 'Start Practice'
  },
  {
    day: 6,
    title: 'DSA Practice',
    topics: ['HashMaps & Arrays', 'Binary Trees & BFS/DFS', 'Two Pointers Technique'],
    estimatedTime: '60 mins',
    status: 'upcoming',
    actionLabel: 'Start Practice'
  },
  {
    day: 7,
    title: 'Full Mock Interview',
    topics: ['Comprehensive 45-min Session', 'Technical + Behavioral', 'Final Readiness Score'],
    estimatedTime: '45 mins',
    status: 'upcoming',
    actionLabel: 'Launch Final Mock'
  }
];
