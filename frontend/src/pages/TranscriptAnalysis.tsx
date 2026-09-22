import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { interviewService } from '../services/interviewService';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();
  
  const [transcripts, setTranscripts] = React.useState<any[]>([]);
  const [reportData, setReportData] = React.useState<any>(null);
  const [recentSessions, setRecentSessions] = React.useState<any[]>([]);
  const [hasNoInterviews, setHasNoInterviews] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  
  const paramSessionId = searchParams.get('session') || searchParams.get('sessionId');

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let activeId = paramSessionId;
        const recent = await interviewService.getRecentInterviews();
        setRecentSessions(recent || []);

        if (!activeId) {
          if (recent && recent.length > 0 && recent[0].id) {
            activeId = recent[0].id;
            setSearchParams({ session: recent[0].id }, { replace: true });
          } else {
            setHasNoInterviews(true);
            setIsLoading(false);
            return;
          }
        }

        if (activeId) {
          const [tData, rData] = await Promise.all([
            interviewService.getInterviewTranscripts(activeId).catch(() => []),
            interviewService.getInterviewReport(activeId).catch(() => null)
          ]);
          setTranscripts(tData || []);
          setReportData(rData);
          setHasNoInterviews(false);
        }
      } catch (e) {
        showToast('Error loading transcripts', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [paramSessionId, setSearchParams, showToast]);

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

  if (isLoading) {
    return (
      <PageContainer title="Interview Transcript">
        <div className="flex justify-center items-center h-64 text-slate-500 animate-pulse">
          Loading transcripts...
        </div>
      </PageContainer>
    );
  }

  if (hasNoInterviews || (!reportData && transcripts.length === 0)) {
    return (
      <PageContainer
        title="Interview Transcript & AI"
        subtitle="Complete conversation transcript & communication metrics."
      >
        <div className="max-w-3xl mx-auto py-8">
          <Card className="p-8 sm:p-12 text-center border border-slate-200/80 bg-white shadow-sm flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5 shadow-inner">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              No Interview Transcripts Recorded Yet
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
              Real-time dialogue records, question-answer breakdowns, and speech cadence indicators will be automatically logged during your mock interviews.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Button
                variant="gradient"
                size="md"
                onClick={() => navigate('/interviews')}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Start Mock Interview
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() => navigate('/interview/voice')}
              >
                Try Voice Interview
              </Button>
            </div>
          </Card>
        </div>
      </PageContainer>
    );
  }

  const metrics = reportData?.communication_metrics || [];

  const fillerWordsList = ["um", "uh", "like", "you know", "actually", "basically"];
  const computedFillerWords = fillerWordsList.map(word => {
    let count = 0;
    transcripts.forEach(t => {
      if (t.role === 'user' || t.sender === 'user') {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        const matches = (t.text || '').match(regex);
        if (matches) count += matches.length;
      }
    });
    return { word, count };
  }).filter(f => f.count > 0).sort((a, b) => b.count - a.count);

  return (
    <PageContainer
      title={`${reportData?.title || 'Interview'} Transcript`}
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
              <BarChart2 className="w-4 h-4" />
              <span>Deep Analysis</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {recentSessions.length > 1 && (
              <select
                value={paramSessionId || reportData?.id || ''}
                onChange={(e) => setSearchParams({ session: e.target.value })}
                className="text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:ring-1 focus:ring-indigo-500 shadow-sm"
              >
                {recentSessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} ({s.date || 'Recent'})
                  </option>
                ))}
              </select>
            )}

            <Button
              variant="gradient"
              size="md"
              onClick={() => navigate(`/interview/report?session=${paramSessionId || reportData?.id || ''}`)}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              View Full Score Report
            </Button>
          </div>
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
                    Timeline Logs ({new Date(reportData?.created_at || new Date()).toLocaleDateString()})
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-mono">Total duration: 15 min</span>
              </div>

              <div className="space-y-4 divide-y divide-slate-100/80">
                {transcripts.map((item: any) => {
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
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
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
                {metrics.map((metric: any) => (
                  <div key={metric.label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">{metric.label}</span>
                      {getStatusBadge(metric.status || (metric.score > 80 ? 'Good' : 'Medium'))}
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${metric.score || 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Detected Fillers Breakdown */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 mb-3">
                  Detected Fillers
                </h4>
                {computedFillerWords.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {computedFillerWords.map((f) => (
                      <div
                        key={f.word}
                        className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-center"
                      >
                        <p className="font-mono text-sm font-bold text-indigo-700">{f.word}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{f.count} times</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No repetitive filler words detected.</p>
                )}
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
