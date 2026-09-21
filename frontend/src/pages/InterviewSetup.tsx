import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { interviewService, SetupConfig } from '../services/interviewService';
import { InterviewPlanItem } from '../types';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  Sliders,
  Plus,
  Bot,
  Video,
  Mic,
  Code2,
  Check
} from 'lucide-react';

export const InterviewSetup: React.FC = () => {
  const [role, setRole] = useState('Software Engineer');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>('Intermediate');
  const [focusAreas, setFocusAreas] = useState<string[]>(['DSA', 'Java', 'DBMS', 'System Design']);
  const [duration, setDuration] = useState<number>(30);
  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState<any>(null);
  const [customTopicInput, setCustomTopicInput] = useState('');
  const [showAddCustom, setShowAddCustom] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const interviewType = location.state?.type || 'technical';
  const interviewTitle = location.state?.title || 'Mock Interview';

  const allTopics = ['DSA', 'Java', 'DBMS', 'System Design', 'Behavioral', 'Projects', 'Machine Learning', 'Cloud & Docker'];

  const toggleFocusArea = (topic: string) => {
    if (focusAreas.includes(topic)) {
      setFocusAreas(focusAreas.filter((t) => t !== topic));
    } else {
      setFocusAreas([...focusAreas, topic]);
    }
  };

  const handleAddCustomTopic = () => {
    if (customTopicInput.trim() && !focusAreas.includes(customTopicInput.trim())) {
      setFocusAreas([...focusAreas, customTopicInput.trim()]);
      setCustomTopicInput('');
      setShowAddCustom(false);
      showToast(`Added focus topic: ${customTopicInput.trim()}`, 'info');
    }
  };

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    try {
      const config: SetupConfig = {
        title: interviewTitle,
        type: interviewType,
        role,
        difficulty,
        focusAreas,
        durationMinutes: duration,
        number_of_questions: duration === 15 ? 3 : duration === 30 ? 5 : duration === 45 ? 7 : 9
      };
      const generated = await interviewService.generateInterviewPlan(config);
      setPlan(generated);
      showToast('AI synthesized your tailored 9-step interview plan!', 'success');
    } catch (e) {
      showToast('Error generating interview plan', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <PageContainer
      title="Interview Setup"
      subtitle="Customize your mock interview experience."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Configuration Form (7 columns) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 sm:p-7 space-y-6 border border-slate-200/80">
            {/* Target Role */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Target Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all cursor-pointer"
              >
                <option value="Software Engineer">Software Engineer (General)</option>
                <option value="Backend Developer">Backend Engineer (Java / Distributed Systems)</option>
                <option value="Full Stack Engineer">Full Stack Engineer (React / Node / Cloud)</option>
                <option value="Machine Learning Engineer">Machine Learning Engineer (ML / PyTorch / LLMs)</option>
                <option value="DevOps & Cloud Engineer">DevOps & Cloud Engineer (Kubernetes / Azure)</option>
              </select>
            </div>

            {/* Difficulty Level */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Difficulty Level
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {(['Beginner', 'Intermediate', 'Advanced', 'Expert'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setDifficulty(lvl)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                      difficulty === lvl
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-[1.02]'
                        : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Focus Areas */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Focus Areas (Multi-Select)
                </label>
                <button
                  type="button"
                  onClick={() => setShowAddCustom(!showAddCustom)}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Custom Topic</span>
                </button>
              </div>

              {showAddCustom && (
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={customTopicInput}
                    onChange={(e) => setCustomTopicInput(e.target.value)}
                    placeholder="e.g. Microservices, Kafka, Redis"
                    className="flex-1 px-3 py-1.5 rounded-lg border border-indigo-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <Button size="sm" variant="primary" onClick={handleAddCustomTopic}>
                    Add
                  </Button>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {allTopics.map((topic) => {
                  const isSelected = focusAreas.includes(topic);
                  return (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => toggleFocusArea(topic)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm'
                          : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                      <span>{topic}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interview Duration */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Interview Duration
              </label>
              <div className="grid grid-cols-4 gap-2.5">
                {[15, 30, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDuration(mins)}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                      duration === mins
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    <span>{mins} min</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Plan Button */}
            <div className="pt-2">
              <Button
                variant="gradient"
                size="lg"
                onClick={handleGeneratePlan}
                isLoading={isGenerating}
                icon={<Sparkles className="w-4 h-4" />}
                className="w-full font-bold"
              >
                Generate Interview Plan
              </Button>
            </div>
          </Card>
        </div>

        {/* Right: AI Generated Plan (5 columns - matching reference Screen 5) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 border border-slate-200/80 bg-white flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    AI Generated Plan
                  </h3>
                </div>
                <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                  {duration} mins • 9 steps
                </span>
              </div>

              {/* Dynamic Plan Rendering */}
              {plan ? (
                <div className="py-2 space-y-4">
                  <p className="text-xs text-slate-600 font-medium">{plan.interview_goal}</p>
                  
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Category Breakdown</h4>
                    <div className="space-y-2">
                      {plan.categories?.map((cat: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-lg p-2 text-xs">
                          <span className="font-semibold text-slate-700">{cat.name}</span>
                          <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200">{cat.count} Questions</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Adaptive Strategy</h4>
                    <ul className="text-[11px] text-slate-600 space-y-1 pl-4 list-disc marker:text-indigo-400">
                      {plan.adaptive_strategy?.map((strategy: string, idx: number) => (
                        <li key={idx}>{strategy}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-[11px] text-indigo-900 mt-2 flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span className="font-bold">Plan successfully generated.</span>
                    </div>
                    <span className="text-[10px] opacity-80">This plan is fully tailored based on your configuration.</span>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 mt-2 h-64">
                  <Bot className="w-10 h-10 text-slate-300 mb-3" />
                  <p className="text-sm font-bold text-slate-600 mb-1">No Plan Generated</p>
                  <p className="text-xs text-slate-400">Click the button on the left to synthesize a custom strategy using Microsoft Foundry Agent.</p>
                </div>
              )}
            </div>

            {/* Launch Practice Options */}
            <div className="pt-6 border-t border-slate-100 space-y-2.5">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Choose Practice Format:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => navigate('/interview/live', { 
                    state: { 
                      config: {
                        title: interviewTitle,
                        type: interviewType,
                        role,
                        difficulty,
                        focusAreas,
                        durationMinutes: duration,
                        number_of_questions: duration === 15 ? 3 : duration === 30 ? 5 : duration === 45 ? 7 : 9
                      }
                    } 
                  })}
                  icon={<Video className="w-4 h-4" />}
                  className="w-full text-xs font-bold"
                >
                  Live Adaptive
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => navigate('/interview/voice', { 
                    state: { 
                      config: {
                        title: interviewTitle,
                        type: interviewType,
                        role,
                        difficulty,
                        focusAreas,
                        durationMinutes: duration,
                        number_of_questions: duration === 15 ? 3 : duration === 30 ? 5 : duration === 45 ? 7 : 9,
                        generated_plan: plan
                      }
                    } 
                  })}
                  icon={<Mic className="w-4 h-4 text-purple-600" />}
                  className="w-full text-xs font-bold"
                  disabled={!plan}
                >
                  Voice Session
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};
