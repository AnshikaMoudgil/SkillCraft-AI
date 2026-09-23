import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { InterviewTypes } from './pages/InterviewTypes';
import { InterviewSetup } from './pages/InterviewSetup';
import { ResumeInterviewSetup } from './pages/ResumeInterviewSetup';
import { CodingInterviewSetup } from './pages/CodingInterviewSetup';
import { MixedInterviewSetup } from './pages/MixedInterviewSetup';
import { CodingInterview } from './pages/CodingInterview';
import { MixedInterview } from './pages/MixedInterview';
import { CodingSandbox } from './pages/CodingSandbox';
import { VoiceInterview } from './pages/VoiceInterview';
import { LiveInterview } from './pages/LiveInterview';
import { TranscriptAnalysis } from './pages/TranscriptAnalysis';
import { InterviewReport } from './pages/InterviewReport';
import { ProgressDashboard } from './pages/ProgressDashboard';
import { LearningPlan } from './pages/LearningPlan';

import { ProtectedRoute } from './components/layout/ProtectedRoute';

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Login />} />

      {/* Core Platform Routes (Protected) */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/interviews" element={<ProtectedRoute><InterviewTypes /></ProtectedRoute>} />
      <Route path="/interview/resume-setup" element={<ProtectedRoute><ResumeInterviewSetup /></ProtectedRoute>} />
      <Route path="/interview/setup" element={<ProtectedRoute><InterviewSetup /></ProtectedRoute>} />
      
      <Route path="/interview/coding-setup" element={<ProtectedRoute><CodingInterviewSetup /></ProtectedRoute>} />
      <Route path="/interview/mixed-setup" element={<ProtectedRoute><MixedInterviewSetup /></ProtectedRoute>} />
      <Route path="/interview/coding" element={<ProtectedRoute><CodingInterview /></ProtectedRoute>} />
      <Route path="/interview/mixed" element={<ProtectedRoute><MixedInterview /></ProtectedRoute>} />
      
      <Route path="/coding" element={<ProtectedRoute><CodingSandbox /></ProtectedRoute>} />
      <Route path="/interview/voice" element={<ProtectedRoute><VoiceInterview /></ProtectedRoute>} />
      <Route path="/interview/live" element={<ProtectedRoute><LiveInterview /></ProtectedRoute>} />
      <Route path="/interview/transcript" element={<ProtectedRoute><TranscriptAnalysis /></ProtectedRoute>} />
      <Route path="/interview/report" element={<ProtectedRoute><InterviewReport /></ProtectedRoute>} />
      <Route path="/progress" element={<ProtectedRoute><ProgressDashboard /></ProtectedRoute>} />
      <Route path="/learning" element={<ProtectedRoute><LearningPlan /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;
