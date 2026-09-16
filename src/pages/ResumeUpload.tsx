import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { resumeService } from '../services/resumeService';
import { ResumeData } from '../types';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Code,
  FolderGit2,
  Briefcase,
  Loader2,
  Trash2
} from 'lucide-react';

export const ResumeUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedData, setParsedData] = useState<ResumeData | null>(null);

  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSimulatedUpload = async (uploadedFile?: File) => {
    const targetFile = uploadedFile || new File([''], 'Anshika_Moudgil_Resume.pdf', { type: 'application/pdf' });
    setFile(targetFile);
    setIsParsing(true);

    try {
      const data = await resumeService.parseResumeFile(targetFile);
      setParsedData(data);
      showToast('Resume parsed successfully! 12 skills & 5 projects extracted.', 'success');
    } catch (err) {
      showToast('Failed to parse resume', 'error');
    } finally {
      setIsParsing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleSimulatedUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleSimulatedUpload(e.target.files[0]);
    }
  };

  const handleReset = () => {
    setFile(null);
    setParsedData(null);
  };

  return (
    <PageContainer
      title="Upload Your Resume"
      subtitle="Get personalized interview questions based on your resume and experience."
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Upload Card Area matching reference Screen 4 */}
        <Card className="p-8 sm:p-10 border border-slate-200/80">
          {!parsedData && !isParsing ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-3xl p-10 sm:p-14 text-center transition-all duration-200 ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]'
                  : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50 hover:bg-indigo-50/20'
              }`}
            >
              <div className="w-20 h-20 mx-auto rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5 shadow-sm">
                <UploadCloud className="w-10 h-10 animate-bounce" />
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-slate-800">
                Drag & drop your resume here
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 mb-6">or</p>

              <label className="inline-block cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileInput}
                  className="hidden"
                />
                <span className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition-all active:scale-95">
                  <FileText className="w-4 h-4" />
                  Choose File
                </span>
              </label>

              <p className="text-xs text-slate-400 mt-5 font-medium">
                Supported: <span className="font-semibold text-slate-600">PDF, DOCX</span> (Max 10MB)
              </p>
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
                AI is parsing your resume...
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Extracting technical skills, project architectures, and work chronology using Azure AI Document Intelligence.
              </p>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Success Badge Banner */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-900">
                      Resume uploaded & parsed successfully ✓
                    </h4>
                    <p className="text-xs text-emerald-700">
                      {parsedData?.fileName} ({parsedData?.fileSize}) • Ready for RAG interview generation
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="p-2 text-emerald-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Upload different resume"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Extracted Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Skills Card */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 md:col-span-2 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <Code className="w-4 h-4 text-indigo-600" />
                    <span>Extracted Skills (Found in Resume)</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {parsedData?.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-200/60 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <FolderGit2 className="w-4 h-4 text-purple-600" />
                      <span>Extracted Featured Projects</span>
                    </div>

                    <div className="space-y-2">
                      {parsedData?.projects.map((proj) => (
                        <div
                          key={proj.title}
                          className="p-3 bg-white rounded-xl border border-slate-200/70 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900">{proj.title}</span>
                            <span className="text-[10px] text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded-full">
                              Verified
                            </span>
                          </div>
                          <p className="text-slate-500">{proj.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Parsed Resume Summary Card (matching reference) */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-900 to-[#071A33] text-white space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-4">
                      <Sparkles className="w-4 h-4" />
                      <span>Parsed Resume</span>
                    </div>

                    <div className="space-y-3.5 text-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-indigo-800/60">
                        <span className="text-slate-300">Skills Found</span>
                        <span className="font-mono font-bold text-white text-sm">12</span>
                      </div>
                      <div className="flex items-center justify-between pb-2 border-b border-indigo-800/60">
                        <span className="text-slate-300">Projects Found</span>
                        <span className="font-mono font-bold text-white text-sm">5</span>
                      </div>
                      <div className="flex items-center justify-between pb-2 border-b border-indigo-800/60">
                        <span className="text-slate-300">Experience</span>
                        <span className="font-mono font-bold text-white text-sm">1.5 years</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">RAG Match Score</span>
                        <span className="font-mono font-bold text-emerald-400 text-sm">92%</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-indigo-200/80 leading-relaxed italic">
                    AI will synthesize questions testing your Random Forest and full-stack architecture design decisions.
                  </p>
                </div>
              </div>

              {/* Continue CTA */}
              <div className="pt-4 flex justify-end">
                <Button
                  variant="gradient"
                  size="lg"
                  onClick={() => navigate('/interview/setup')}
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Continue to Interview Setup
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </PageContainer>
  );
};
