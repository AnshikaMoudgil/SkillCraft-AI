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
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();
  
  const [reportData, setReportData] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  
  const sessionId = searchParams.get('sessionId') || searchParams.get('session');

  React.useEffect(() => {
    if (!sessionId) {
      navigate('/dashboard');
      return;
    }
    
    const fetchReport = async () => {
      try {
        const data = await interviewService.getInterviewReport(sessionId);
        setReportData(data);
      } catch (e) {
        showToast('Error loading report', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchReport();
  }, [sessionId, navigate, showToast]);

  const handleDownloadPdf = () => {
    showToast('Downloading official PDF performance report...', 'success');
  };

  if (isLoading) {
    return (
      <PageContainer title="Interview Report">
        <div className="flex justify-center items-center h-64">Loading report...</div>
      </PageContainer>
    );
  }

  if (!reportData) return null;

  const dateStr = new Date(reportData.created_at || new Date()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const metrics = reportData.communication_metrics || [];
  
  // Convert metrics to skillBreakdown format
  const skillBreakdown = metrics.map((m: any, i: number) => ({
    skill: m.label,
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

          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadPdf}
            icon={<Download className="w-4 h-4 text-indigo-600" />}
          >
            Download PDF
          </Button>
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

        {/* Strong Areas vs Areas to Improve Row matching reference Screen 10 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strong Areas Card */}
          <Card className="p-6 border border-emerald-100 bg-emerald-50/30 space-y-4">
            <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Strong Areas</span>
            </div>

            <ul className="space-y-2.5">
              {(reportData.strengths || []).map((item: string) => (
                <li key={item} className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-800">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 text-xs">
                    ✓
                  </span>
                  <span>{item}</span>
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

            <ul className="space-y-2.5">
              {(reportData.improvements || []).map((item: string) => (
                <li key={item} className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-800">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 text-xs font-bold">
                    △
                  </span>
                  <span>{item}</span>
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
