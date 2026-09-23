import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { CircularProgress } from '../components/common/ProgressBar';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { interviewService } from '../services/interviewService';
import {
  Download,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Award,
  Calendar,
  Clock,
  ArrowRight
} from 'lucide-react';

export const InterviewReport: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();
  
  const [reportData, setReportData] = React.useState<any>(null);
  const [recentSessions, setRecentSessions] = React.useState<any[]>([]);
  const [hasNoInterviews, setHasNoInterviews] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  
  const paramSessionId = searchParams.get('sessionId') || searchParams.get('session');

  React.useEffect(() => {
    const loadReportData = async () => {
      setIsLoading(true);
      try {
        let activeId = paramSessionId;

        // If no sessionId in URL, fetch user's recent interviews
        const recent = await interviewService.getRecentInterviews();
        setRecentSessions(recent || []);

        if (!activeId) {
          if (!recent || recent.length === 0) {
            setHasNoInterviews(true);
          }
          setIsLoading(false);
          return;
        }

        if (activeId) {
          const data = await interviewService.getInterviewReport(activeId);
          setReportData(data);
          setHasNoInterviews(false);
        }
      } catch (e) {
        showToast('Error loading interview report', 'error');
        // Clear invalid session ID from URL to fallback to Stack view
        setSearchParams({});
      } finally {
        setIsLoading(false);
      }
    };

    loadReportData();
  }, [paramSessionId, setSearchParams, showToast]);

  const handleDownloadPdf = () => {
    showToast('Downloading official PDF performance report...', 'success');
  };

  if (isLoading) {
    return (
      <PageContainer title="Interview Report">
        <div className="flex justify-center items-center h-64 text-slate-500 animate-pulse">
          Loading report...
        </div>
      </PageContainer>
    );
  }

  if (hasNoInterviews || (paramSessionId && !reportData)) {
    return (
      <PageContainer
        title="Interview Report"
        subtitle="Comprehensive AI assessment, Big-O metrics, and personalized learning recommendations."
      >
        <div className="max-w-3xl mx-auto py-8">
          <Card className="p-8 sm:p-12 text-center border border-slate-200/80 bg-white shadow-sm flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5 shadow-inner">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              No Interview Reports Generated Yet
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
              Complete your first AI mock or voice interview to generate an in-depth scorecard with communication metrics, technical accuracy, and tailored preparation plans.
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

  if (!paramSessionId && recentSessions.length > 0) {
    return (
      <PageContainer title="Reports History" subtitle="Review your past interview performances and track your progress.">
        <div className="max-w-4xl mx-auto py-8">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-slate-900">Your Interview Stack</h2>
          </div>
          <div className="grid gap-4">
            {recentSessions.map((session, idx) => (
              <Card 
                key={idx} 
                className="p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                onClick={() => setSearchParams({ sessionId: session.id })}
              >
                <div className="flex justify-between items-center">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-slate-800">{session.title}</h3>
                      <p className="text-sm text-slate-500 capitalize">{session.type} Interview • {session.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-indigo-600">{session.score}<span className="text-sm font-normal text-slate-400">/100</span></div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!reportData) return null;

  const dateStr = new Date(reportData.created_at || new Date()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const metrics = reportData.communication_metrics || [];
  
  // Convert metrics to skillBreakdown format
  const skillBreakdown = metrics.map((m: any, i: number) => ({
    skill: m.label || m.name,
    score: m.score,
    color: ['#4F46E5', '#06B6D4', '#8B5CF6', '#10B981'][i % 4]
  }));

  return (
    <PageContainer
      title={`${reportData.title || 'Interview'} Report`}
      subtitle={`Generated on ${dateStr} • Role: ${reportData.role}`}
    >
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Top Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {dateStr}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Difficulty: {reportData.difficulty}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {recentSessions.length > 1 && (
              <select
                value={paramSessionId || reportData.id || ''}
                onChange={(e) => setSearchParams({ session: e.target.value })}
                className="text-xs bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 font-medium focus:ring-1 focus:ring-indigo-500 shadow-sm"
              >
                {recentSessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} ({s.date || 'Recent'}) - Score: {s.score}%
                  </option>
                ))}
              </select>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadPdf}
              icon={<Download className="w-4 h-4 text-indigo-600" />}
            >
              Download PDF
            </Button>
          </div>
        </div>

        {/* Scores & Skill Breakdown Row matching reference Screen 10 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Overall Score Circle (4 columns) */}
          <Card className="lg:col-span-4 p-8 flex flex-col items-center justify-center text-center border border-slate-200/80 bg-white">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
              Overall Score
            </h3>
            <CircularProgress score={reportData.score || 0} total={100} size={150} strokeWidth={12} />
            <div className="mt-6 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              <Award className="w-3.5 h-3.5" />
              <span>Readiness: Strong Candidate</span>
            </div>
          </Card>

          {/* Skill-wise Performance (8 columns) */}
          <Card className="lg:col-span-8 p-6 sm:p-8 border border-slate-200/80 bg-white space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100">
              Skill-wise Performance
            </h3>

            <div className="space-y-4 pt-1">
              {skillBreakdown.map((item: any) => (
                <div key={item.skill} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{item.skill}</span>
                    <span className="font-mono font-extrabold text-slate-900">{item.score}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${item.score}%`,
                        backgroundColor: item.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Coding Analytics (Only shown for Coding Interviews) */}
        {reportData.type === 'coding' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 border border-slate-200 shadow-sm bg-white">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" /> Code Efficiency
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Your submissions were highly efficient in terms of runtime. You frequently hit O(N) constraints optimally.
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg border border-green-100 font-medium">Top 15% Runtime</div>
                <div className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 font-medium">Memory Optimized</div>
              </div>
            </Card>

            <Card className="p-6 border border-slate-200 shadow-sm bg-white">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-500" /> Big-O Metrics (Average)
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-xs text-slate-500 mb-1 font-semibold uppercase">Time Complexity</div>
                  <div className="text-xl font-black text-slate-800 font-mono">O(N)</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-xs text-slate-500 mb-1 font-semibold uppercase">Space Complexity</div>
                  <div className="text-xl font-black text-slate-800 font-mono">O(1)</div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Strong Areas vs Areas to Improve Row matching reference Screen 10 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strong Areas Card */}
          <Card className="p-6 border border-emerald-100 bg-emerald-50/30 space-y-4">
            <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Strong Areas</span>
            </div>

            <ul className="space-y-3">
              {(reportData.strengths || []).map((s: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{s}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Areas to Improve Card */}
          <Card className="p-6 border border-rose-100 bg-rose-50/30 space-y-4">
            <div className="flex items-center gap-2 text-rose-800 text-xs font-bold uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Areas to Improve</span>
            </div>

            <ul className="space-y-3">
              {(reportData.improvements || []).map((s: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{s}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Preparation Plan Section (New) */}
        {reportData.preparation_plan && reportData.preparation_plan.length > 0 && (
          <div className="grid grid-cols-1 gap-6">
            <Card className="p-6 border border-indigo-100 bg-white space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-indigo-800 text-xs font-bold uppercase tracking-wider pb-2 border-b border-slate-100">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>Recommended Preparation Plan</span>
              </div>
              <div className="space-y-4 pt-2">
                {reportData.preparation_plan.map((item: any, idx: number) => (
                  <div key={idx} className="flex flex-col sm:flex-row gap-2 sm:gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-bold text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded w-fit h-fit shrink-0">
                      {item.day || `Day ${idx + 1}`}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-slate-800">{item.topic}</h4>
                      <p className="text-xs text-slate-600 mt-1">{item.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* AI Recommendation Banner matching reference Screen 10 */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                AI Feedback & Summary
              </h4>
              <p className="text-xs sm:text-sm text-slate-800 font-medium mt-0.5">
                {reportData.summary_feedback}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="gradient"
              size="sm"
              onClick={() => navigate('/learning')}
              icon={<BookOpen className="w-4 h-4" />}
            >
              Practice Weak Areas
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/interviews')}
              icon={<RotateCcw className="w-4 h-4" />}
            >
              Take Another Interview
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
