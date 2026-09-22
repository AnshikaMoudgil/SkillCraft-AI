import React, { useState, useEffect } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { resumeService } from '../services/resumeService';
import {
  FileText,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Code,
  FolderGit2,
  Briefcase,
  Loader2,
  Trash2,
  AlertCircle
} from 'lucide-react';

export const ResumeInterviewSetup: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [latestResume, setLatestResume] = useState<any>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    let isMounted = true;
    const fetchHistory = async () => {
      try {
        const pastResume = await resumeService.getLatestResume();
        if (isMounted && pastResume) {
          setLatestResume(pastResume);
        }
      } catch (e) {
        console.warn("Failed to fetch past resume:", e);
      } finally {
        if (isMounted) {
          setIsLoadingHistory(false);
        }
      }
    };
    fetchHistory();
    return () => { isMounted = false; };
  }, []);

  const handleSimulatedUpload = async (uploadedFile?: File) => {
    const targetFile = uploadedFile || file;
    if (!targetFile) return;

    setIsParsing(true);
    setErrorMsg(null);
    try {
      const data = await resumeService.parseResumeFile(targetFile);
      setParsedData(data);
      showToast('Resume parsed successfully with Azure AI Document Intelligence!', 'success');
    } catch (err: any) {
      console.error("Resume parse error:", err);
      setErrorMsg("Resume analysis failed. We could not process this resume.");
      showToast('Failed to parse resume.', 'error');
    } finally {
      setIsParsing(false);
    }
  };

  const handleUsePrevious = () => {
    if (!latestResume) return;
    setParsedData(latestResume);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleReset = () => {
    setFile(null);
    setParsedData(null);
    setErrorMsg(null);
  };

  const handleStartLive = () => {
    navigate('/interview/live', {
      state: {
        config: {
          title: 'Resume Based Interview',
          type: 'resume',
          role: parsedData?.analysis?.name ? `${parsedData.analysis.name}'s Role` : 'Candidate',
          difficulty: 'Intermediate',
          focusAreas: parsedData?.analysis?.interview_focus_areas || ['General'],
          durationMinutes: 30,
          number_of_questions: 5,
          resumeContext: parsedData?.rawText || JSON.stringify(parsedData?.analysis)
        }
      }
    });
  };

  const handleStartVoice = () => {
    navigate('/interview/voice', {
      state: {
        config: {
          title: 'Resume Based Interview',
          type: 'resume',
          role: parsedData?.analysis?.name ? `${parsedData.analysis.name}'s Role` : 'Candidate',
          difficulty: 'Intermediate',
          focusAreas: parsedData?.analysis?.interview_focus_areas || ['General'],
          durationMinutes: 30,
          number_of_questions: 5,
          resumeContext: parsedData?.rawText || JSON.stringify(parsedData?.analysis)
        }
      }
    });
  };

  if (isLoadingHistory) {
    return (
      <PageContainer title="Resume Based Interview Setup" subtitle="Checking your profile...">
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Resume Based Interview Setup"
      subtitle="Upload your resume to generate targeted contextual interview questions."
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <p className="text-sm text-slate-600 text-center max-w-2xl mx-auto">
          Your resume will be analyzed using Azure AI Document Intelligence and the existing AI Interview Coach to create a personalized interview.
        </p>

        <Card className="p-8 sm:p-10 border border-slate-200/80">
          {!parsedData && !isParsing && !errorMsg ? (
            <div className="space-y-6 text-center">
              
              {!file && latestResume && (
                <div className="mb-8 p-5 bg-indigo-50/50 border border-indigo-100 rounded-2xl animate-in fade-in">
                  <h4 className="text-sm font-bold text-slate-800 mb-3">Previously uploaded resume</h4>
                  <div className="flex items-center justify-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-slate-200 shadow-sm text-sm">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      <span className="font-semibold text-slate-700">{latestResume.file_name || 'Resume'}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                    <Button onClick={handleUsePrevious} variant="gradient" size="sm">
                      Use This Resume
                    </Button>
                  </div>
                  <div className="mt-6 flex items-center gap-4 before:h-px before:flex-1 before:bg-slate-200 after:h-px after:flex-1 after:bg-slate-200">
                    <span className="text-xs text-slate-400 font-medium">OR</span>
                  </div>
                </div>
              )}

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all duration-200 ${
                  isDragging
                    ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]'
                    : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50 hover:bg-indigo-50/20'
                }`}
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-4 shadow-sm border border-indigo-200">
                  <FileText className="w-8 h-8" />
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-slate-800">
                  Upload Your Resume
                </h3>
                <p className="text-xs text-slate-400 mt-1 mb-6">Upload a PDF or DOCX resume</p>

                {!file ? (
                  <label className="inline-block cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf,.docx"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                    <span className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition-all active:scale-95">
                      Choose Resume
                    </span>
                  </label>
                ) : (
                  <div className="inline-flex flex-col items-center gap-4">
                    <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-lg border border-slate-200 shadow-sm">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm font-semibold text-slate-700">{file.name}</span>
                      <button onClick={handleReset} className="text-xs font-bold text-rose-500 hover:text-rose-700 ml-2">
                        Remove
                      </button>
                    </div>
                  </div>
                )}
                
                <p className="text-xs text-slate-400 mt-6">Supported: PDF, DOCX</p>
              </div>

              {file && (
                <div className="pt-4 animate-in fade-in zoom-in-95">
                  <Button variant="gradient" size="lg" onClick={() => handleSimulatedUpload(file)} icon={<Sparkles className="w-4 h-4" />}>
                    Analyze Resume
                  </Button>
                </div>
              )}
            </div>
          ) : isParsing ? (
            <div className="py-16 text-center space-y-4">
              <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping" />
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg">
                  <Loader2 className="w-7 h-7 animate-spin" />
                </div>
              </div>
              <h4 className="text-lg font-bold text-slate-900">
                Analyzing Resume...
              </h4>
              <div className="text-xs text-slate-500 max-w-sm mx-auto space-y-1 text-left inline-block">
                <p>1. Uploading resume...</p>
                <p>2. Extracting resume content...</p>
                <p>3. Structuring resume with AI...</p>
                <p>4. Preparing interview focus areas...</p>
              </div>
              <p className="text-sm text-slate-400 mt-4">Please wait...</p>
            </div>
          ) : errorMsg ? (
            <div className="py-16 text-center space-y-6">
              <div className="w-16 h-16 mx-auto flex items-center justify-center bg-rose-100 text-rose-600 rounded-full">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">
                Resume analysis failed.
              </h4>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                We could not process this resume.
              </p>
              <Button variant="outline" onClick={handleReset}>
                Try Again
              </Button>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-900">
                      Resume Analysis Complete
                    </h4>
                    <p className="text-xs text-emerald-700">
                      Your resume has been analyzed successfully.
                    </p>
                  </div>
                </div>
                <button onClick={handleReset} className="p-2 text-emerald-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-5">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 pb-2">
                    <Code className="w-4 h-4 text-indigo-600" />
                    <span>Candidate Profile</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {parsedData?.analysis?.name && (
                      <div>
                        <span className="block text-xs text-slate-400 font-semibold mb-1">Name</span>
                        <span className="font-bold text-slate-800">{parsedData.analysis.name}</span>
                      </div>
                    )}
                    {parsedData?.analysis?.education && parsedData.analysis.education.length > 0 && (
                      <div>
                        <span className="block text-xs text-slate-400 font-semibold mb-1">Education</span>
                        <ul className="list-disc list-inside text-slate-700 text-xs space-y-0.5">
                          {parsedData.analysis.education.map((e: string, i: number) => <li key={i}>{e}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>

                  {((parsedData?.analysis?.skills && parsedData.analysis.skills.length > 0) || 
                    (parsedData?.analysis?.programming_languages && parsedData.analysis.programming_languages.length > 0)) && (
                    <div className="pt-2">
                       <span className="block text-xs text-slate-400 font-semibold mb-2">Skills & Technologies</span>
                       <div className="flex flex-wrap gap-2">
                         {parsedData?.analysis?.skills?.map((s: string) => (
                           <span key={s} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600">{s}</span>
                         ))}
                         {parsedData?.analysis?.programming_languages?.map((s: string) => (
                           <span key={s} className="px-2.5 py-1 bg-indigo-50 border border-indigo-100 rounded-lg text-xs font-medium text-indigo-700">{s}</span>
                         ))}
                       </div>
                    </div>
                  )}

                  {parsedData?.analysis?.projects && parsedData.analysis.projects.length > 0 && (
                    <div className="pt-3 border-t border-slate-200">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                        <FolderGit2 className="w-4 h-4 text-purple-600" />
                        <span>Projects</span>
                      </div>
                      <div className="space-y-3">
                        {parsedData.analysis.projects.map((p: any, i: number) => (
                          <div key={i} className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
                             <div className="font-bold text-slate-800 mb-1">{p.title}</div>
                             <div className="text-slate-500 mb-2">{p.description}</div>
                             {p.techStack && p.techStack.length > 0 && (
                               <div className="text-slate-400 font-mono text-[10px]">Stack: {p.techStack.join(', ')}</div>
                             )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {parsedData?.analysis?.experience && parsedData.analysis.experience.length > 0 && (
                    <div className="pt-3 border-t border-slate-200">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                        <Briefcase className="w-4 h-4 text-emerald-600" />
                        <span>Experience</span>
                      </div>
                      <div className="space-y-3">
                        {parsedData.analysis.experience.map((exp: any, i: number) => (
                          <div key={i} className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
                             <div className="flex justify-between items-start mb-1">
                               <span className="font-bold text-slate-800">{exp.role} {exp.company ? `@ ${exp.company}` : ''}</span>
                               {exp.duration && (
                                 <span className="text-slate-500 text-[10px] bg-slate-100 px-2 py-0.5 rounded">{exp.duration}</span>
                               )}
                             </div>
                             <div className="text-slate-500">{exp.description}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {parsedData?.analysis?.interview_focus_areas && parsedData.analysis.interview_focus_areas.length > 0 && (
                    <div className="pt-3 border-t border-slate-200">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>Interview Focus Areas</span>
                      </div>
                      <ul className="list-disc list-inside text-slate-700 text-xs space-y-1">
                        {parsedData.analysis.interview_focus_areas.map((area: string, i: number) => <li key={i}>{area}</li>)}
                      </ul>
                    </div>
                  )}

                </div>
              </div>

              <div className="pt-6 flex justify-end gap-3 border-t border-slate-200 mt-6">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleStartLive}
                >
                  Start Live Adaptive
                </Button>
                <Button
                  variant="gradient"
                  size="lg"
                  onClick={handleStartVoice}
                >
                  Start Voice Session
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </PageContainer>
  );
};
