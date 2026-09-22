import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { InterviewTypes } from './pages/InterviewTypes';
import { ResumeUpload } from './pages/ResumeUpload';
import { InterviewSetup } from './pages/InterviewSetup';
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
      <Route path="/resume" element={<ProtectedRoute><ResumeUpload /></ProtectedRoute>} />
      <Route path="/interview/setup" element={<ProtectedRoute><InterviewSetup /></ProtectedRoute>} />
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
