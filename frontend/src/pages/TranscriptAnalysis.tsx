import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { mockTranscriptConversation, mockCommunicationMetrics, mockFillerWords } from '../../src/data/mockInterviews';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Activity,
  Bot,
  User,
  Clock,
  Sparkles,
  ArrowRight,
  BarChart2,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const TranscriptAnalysis: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'transcript' | 'analysis'>('transcript');
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Good':
        return <Badge variant="success">Good</Badge>;
      case 'Medium':
        return <Badge variant="warning">Medium</Badge>;
      default:
        return <Badge variant="danger">Needs Work</Badge>;
    }
  };

  return (
    <PageContainer
      title="Interview Transcript"
      subtitle="Complete conversation transcript & communication metrics"
    >
      <div className="space-y-6">
        {/* Top Tab Bar & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center p-1 bg-white border border-slate-200/80 rounded-2xl shadow-sm">
            <button
              onClick={() => setActiveTab('transcript')}
              className={`px-5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${
                activeTab === 'transcript'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Transcript</span>
            </button>
            <button
              onClick={() => setActiveTab('analysis')}
              className={`px-5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${
                activeTab === 'analysis'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>AI Analysis</span>
            </button>
          </div>

          <Button
            variant="gradient"
            size="md"
            onClick={() => navigate('/interview/report')}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            View Full Score Report
          </Button>
        </div>

        {/* Main Grid: Transcript Timeline (Left) + Communication Analysis (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left / Center: Conversation Timeline */}
          <div className={`lg:col-span-8 ${activeTab === 'analysis' ? 'hidden lg:block' : 'block'}`}>
            <Card className="p-6 sm:p-7 border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Timeline Logs (15 Sep 2026)
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-mono">Total duration: 28 min</span>
              </div>

              <div className="space-y-4 divide-y divide-slate-100/80">
                {mockTranscriptConversation.map((item) => {
                  const isAi = item.sender === 'ai';
                  return (
                    <div key={item.id} className="pt-4 first:pt-0 flex items-start gap-3.5">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                          isAi
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'bg-slate-900 text-white'
                        }`}
                      >
                        {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={`text-xs font-bold ${
                              isAi ? 'text-indigo-600' : 'text-slate-800'
                            }`}
                          >
                            {isAi ? 'AI' : 'You'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {item.timestamp}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Right: Communication Analysis */}
          <div className={`lg:col-span-4 space-y-6 ${activeTab === 'transcript' ? 'hidden lg:block' : 'block'}`}>
            <Card className="p-6 border border-slate-200/80 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Communication Indicators</span>
                </h3>
              </div>

              {/* Metrics List */}
              <div className="space-y-3.5">
                {mockCommunicationMetrics.map((metric) => (
                  <div key={metric.label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">{metric.label}</span>
                      {getStatusBadge(metric.status)}
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${metric.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Detected Fillers Breakdown matching reference Screen 9 */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 mb-3">
                  Detected Fillers
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {mockFillerWords.map((f) => (
                    <div
                      key={f.word}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-center"
                    >
                      <p className="font-mono text-sm font-bold text-indigo-700">{f.word}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{f.count} times</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Communication Indicators Note */}
              <div className="p-3 rounded-xl bg-slate-50 text-[11px] text-slate-500 leading-relaxed">
                Evaluated objectively based on speech timing and sentence cadence. High technical precision observed.
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
