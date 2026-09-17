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

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Login />} />

      {/* Core Platform Routes */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/interviews" element={<InterviewTypes />} />
      <Route path="/resume" element={<ResumeUpload />} />
      <Route path="/interview/setup" element={<InterviewSetup />} />
      <Route path="/coding" element={<CodingSandbox />} />
      <Route path="/interview/voice" element={<VoiceInterview />} />
      <Route path="/interview/live" element={<LiveInterview />} />
      <Route path="/interview/transcript" element={<TranscriptAnalysis />} />
      <Route path="/interview/report" element={<InterviewReport />} />
      <Route path="/progress" element={<ProgressDashboard />} />
      <Route path="/learning" element={<LearningPlan />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;
