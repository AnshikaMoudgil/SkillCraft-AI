import React, { useState, useEffect, useRef } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { WaveformVisualizer } from '../components/interview/WaveformVisualizer';
import { VoiceAvatar } from '../components/interview/VoiceAvatar';
import { Button } from '../components/common/Button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { interviewService, SetupConfig } from '../services/interviewService';
import { speechService } from '../services/speechService';
import * as speechsdk from 'microsoft-cognitiveservices-speech-sdk';
import {
  Mic,
  MicOff,
  PhoneOff,
  Volume2,
  VolumeX,
  Sparkles,
  MessageSquare,
  Send,
  Loader2,
  Type
} from 'lucide-react';

export const InterviewState = {
  INITIALIZING: 'INITIALIZING',
  AI_THINKING: 'AI_THINKING',
  AI_SPEAKING: 'AI_SPEAKING',
  WAITING_FOR_CANDIDATE: 'WAITING_FOR_CANDIDATE',
  LISTENING: 'LISTENING',
  SUBMITTING: 'SUBMITTING',
  COMPLETED: 'COMPLETED',
  ERROR: 'ERROR'
} as const;

export type InterviewState = typeof InterviewState[keyof typeof InterviewState];

let globalLastSpokenText: string | null = null;

export const VoiceInterview: React.FC = () => {
  const [seconds, setSeconds] = useState(0);
  const [isRecording, setIsRecording] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [interviewState, setInterviewState] = useState<InterviewState>(InterviewState.INITIALIZING);
  const [speechPrompt, setSpeechPrompt] = useState("Initializing interview session...");
  
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentTopic, setCurrentTopic] = useState<string>("General");
  
  const [showTextInput, setShowTextInput] = useState(false);
  const [textAnswer, setTextAnswer] = useState('');

  const recognizerRef = useRef<speechsdk.SpeechRecognizer | null>(null);
  const [interimTranscript, setInterimTranscript] = useState('');
  const textAnswerRef = useRef('');

  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const config = location.state?.config || {
    title: 'Quick Mock Interview',
    type: 'technical',
    role: 'Software Engineer',
    difficulty: 'Intermediate',
    focusAreas: ['React', 'TypeScript', 'General CS'],
    durationMinutes: 15,
    number_of_questions: 3
  };

  useEffect(() => {
    const initSession = async () => {
      try {
        console.log("[InterviewFlow] Interview initialization");
        setInterviewState(InterviewState.INITIALIZING);
        const res = await interviewService.startInterview(config);
        
        console.log("[InterviewFlow] Initial AI response received");
        setSessionId(res.sessionId);
        setCurrentTopic(res.topic);
        const fullPrompt = `${res.greeting} ${res.firstQuestion}`;
        console.log(`[InterviewFlow] Initial AI response text: ${fullPrompt}`);
        setSpeechPrompt(fullPrompt);
        
        setInterviewState(InterviewState.AI_SPEAKING);
        if (isSpeakerOn) {
          if (globalLastSpokenText !== fullPrompt) {
              globalLastSpokenText = fullPrompt;
              console.log("[InterviewFlow] TTS request");
              console.log("[InterviewFlow] TTS started");
              await speechService.synthesizeSpeech(fullPrompt);
              console.log("[InterviewFlow] TTS completed");
          } else {
              console.log("[InterviewFlow] Duplicate TTS prevented");
          }
        }
        setInterviewState(InterviewState.WAITING_FOR_CANDIDATE);
      } catch (e) {
        showToast("Failed to start interview.", "error");
        setInterviewState(InterviewState.ERROR);
      }
    };
    
    initSession();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isRecording) {
      interval = setInterval(() => setSeconds(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTimer = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const startMic = async () => {
    if (interviewState === InterviewState.AI_SPEAKING || interviewState === InterviewState.INITIALIZING || interviewState === InterviewState.SUBMITTING || interviewState === InterviewState.AI_THINKING) {
       console.warn("[VoiceInterview] Microphone start ignored due to conflicting state: ", interviewState);
       return;
    }

    try {
      console.log("[InterviewFlow] microphone button clicked");
      const tokenRes = await speechService.getSpeechToken();
      if (!tokenRes.token) throw new Error("Missing speech token");
      
      const speechConfig = speechsdk.SpeechConfig.fromAuthorizationToken(tokenRes.token, tokenRes.region);
      speechConfig.speechRecognitionLanguage = "en-US";
      
      const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
      const recognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig);
      recognizerRef.current = recognizer;
      
      recognizer.recognizing = (s, e) => {
        setInterimTranscript(e.result.text);
      };

      recognizer.recognized = (s, e) => {
        if (e.result.reason === speechsdk.ResultReason.RecognizedSpeech && e.result.text) {
          setTextAnswer(prev => {
            const next = (prev ? prev + ' ' : '') + e.result.text;
            textAnswerRef.current = next;
            return next;
          });
          setInterimTranscript('');
        }
      };

      recognizer.canceled = (s, e) => {
        if (e.reason === speechsdk.CancellationReason.Error) {
          showToast(`Microphone recognition failed. Please check microphone permission and try again.`, "error");
        }
        stopMic(false);
      };

      recognizer.sessionStopped = (s, e) => {
        stopMic(false);
      };

      recognizer.startContinuousRecognitionAsync(
        () => {
          setInterviewState(InterviewState.LISTENING);
          setTextAnswer('');
          textAnswerRef.current = '';
          setInterimTranscript('');
        },
        (err) => {
          showToast("Microphone recognition failed. Please check microphone permission and try again.", "error");
          stopMic(false);
        }
      );
    } catch (e) {
      showToast("Microphone recognition failed. Please check microphone permission and try again.", "error");
      stopMic(false);
    }
  };

  const stopMic = (shouldSubmit: boolean = true) => {
    const recognizer = recognizerRef.current;
    if (recognizer) {
      recognizer.stopContinuousRecognitionAsync(
        () => {
          recognizer.close();
          recognizerRef.current = null;
          if (shouldSubmit) handleFinalSubmission();
          else {
              setInterimTranscript('');
              setInterviewState(InterviewState.WAITING_FOR_CANDIDATE);
          }
        },
        (err) => {
          recognizer.close();
          recognizerRef.current = null;
          setInterviewState(InterviewState.WAITING_FOR_CANDIDATE);
        }
      );
    } else {
      if (shouldSubmit) handleFinalSubmission();
      else setInterviewState(InterviewState.WAITING_FOR_CANDIDATE);
    }
  };

  const handleFinalSubmission = () => {
    const finalAns = textAnswerRef.current.trim();
    if (finalAns) {
      submitAnswer(finalAns);
    } else {
      showToast("Could not recognize speech. Please try again or type.", "error");
      setInterviewState(InterviewState.WAITING_FOR_CANDIDATE);
    }
    setInterimTranscript('');
  };

  const handleToggleMute = () => {
    if (interviewState === InterviewState.INITIALIZING || interviewState === InterviewState.SUBMITTING || interviewState === InterviewState.AI_SPEAKING || interviewState === InterviewState.AI_THINKING) return;
    if (interviewState !== InterviewState.LISTENING) {
      startMic();
      showToast('Recording started. Click Mic again to stop and submit.', 'info');
    } else {
      stopMic(true);
    }
  };

  const submitAnswer = async (answerText: string) => {
    if (!sessionId) return;
    if (interviewState === InterviewState.SUBMITTING) {
        console.warn("[InterviewFlow] Duplicate submission prevented.");
        return;
    }
    
    // Preserve the actual question being answered to send to the backend
    const currentQuestion = speechPrompt;
    
    setInterviewState(InterviewState.SUBMITTING);
    setSpeechPrompt("Analyzing your response...");
    
    console.log("[InterviewFlow] Candidate answer");
    console.log(`[InterviewFlow] Candidate answer text: ${answerText}`);
    console.log("[InterviewFlow] POST /interview/respond");
    
    setInterviewState(InterviewState.AI_THINKING);

    try {
      const evalRes = await interviewService.respondToCandidate(
        sessionId,
        currentQuestion, // pass the actual question context
        answerText,
        currentTopic
      );
      
      console.log(`[InterviewFlow] Response status: 200`);
      console.log(`[InterviewFlow] Response body:`, evalRes);
      
      const aiResponseContent = evalRes.ai_response || `${evalRes.feedback} ${evalRes.followUp}`;
      
      console.log(`[InterviewFlow] AI response received`);
      setSpeechPrompt(aiResponseContent);
      console.log(`[InterviewFlow] Next question displayed`);
      
      setInterviewState(InterviewState.AI_SPEAKING);
      if (isSpeakerOn) {
        if (globalLastSpokenText !== aiResponseContent) {
            globalLastSpokenText = aiResponseContent;
            console.log("[InterviewFlow] TTS request");
            console.log("[InterviewFlow] TTS started");
            await speechService.synthesizeSpeech(aiResponseContent);
            console.log("[InterviewFlow] TTS completed");
        } else {
            console.log("[InterviewFlow] Duplicate TTS prevented");
        }
      }
      setInterviewState(InterviewState.WAITING_FOR_CANDIDATE);
      
    } catch (e: any) {
      console.error(`[InterviewFlow] Interview API error`, e.response?.status, e.response?.data || e.message);
      showToast("AI response could not be generated. Please try again.", "error");
      setInterviewState(InterviewState.WAITING_FOR_CANDIDATE);
      setSpeechPrompt(currentQuestion); // Revert back to allow retry
    }
  };

  const handleTextSubmit = () => {
    if (textAnswer.trim()) {
      submitAnswer(textAnswer);
      setTextAnswer('');
      textAnswerRef.current = '';
      setShowTextInput(false);
    }
  };

  const handleEndInterview = async () => {
    setIsRecording(false);
    setInterviewState(InterviewState.COMPLETED);
    if (sessionId) {
      showToast('Evaluating interview and generating final report...', 'info');
      try {
        await interviewService.evaluateInterview(sessionId, []);
      } catch (e) {
        console.error("Evaluation failed", e);
      }
      navigate(`/interview/report?sessionId=${sessionId}`);
    } else {
      navigate('/interview/setup');
    }
  };

  const isMuted = interviewState !== InterviewState.LISTENING;
  const isProcessing = interviewState === InterviewState.INITIALIZING || interviewState === InterviewState.SUBMITTING || interviewState === InterviewState.AI_THINKING;
  const isAiSpeaking = interviewState === InterviewState.AI_SPEAKING;

  return (
    <PageContainer
      title="Voice Interview (Live)"
      subtitle="Simulated Azure Neural Speech Session"
    >
      <div className="max-w-4xl mx-auto">
        <div className="rounded-3xl bg-[#071A33] border border-slate-800 text-white shadow-2xl p-6 sm:p-10 relative overflow-hidden flex flex-col items-center justify-between min-h-[560px]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="w-full flex items-center justify-between z-10">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 text-xs">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span className="w-2 h-2 rounded-full bg-rose-500 -ml-3" />
              <span className="font-bold text-rose-300">Recording</span>
              <span className="font-mono text-slate-300 ml-1">{formatTimer(seconds)}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/interview/live', { state: { config } })}
                className="text-xs text-indigo-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Switch to Chat</span>
              </button>
            </div>
          </div>

          <div className="my-8 flex flex-col items-center justify-center space-y-6 z-10 max-w-lg text-center w-full">
            <VoiceAvatar isAiSpeaking={isAiSpeaking} />

            <div className="relative bg-[#0F223D] border border-indigo-500/30 rounded-2xl p-5 shadow-xl text-slate-100 text-sm sm:text-base leading-relaxed animate-in fade-in zoom-in-95 duration-300 w-full">
              <div className="flex items-center justify-center gap-1.5 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
                {isProcessing ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>{isProcessing ? 'Thinking...' : 'AI Interviewer Speaking'}</span>
              </div>
              <p>"{speechPrompt}"</p>
            </div>

            {!showTextInput ? (
              <div className="w-full flex flex-col items-center pt-2">
                <WaveformVisualizer isSpeaking={!isMuted} barCount={22} />
                
                {(!isMuted || textAnswer) && (
                  <div className="mt-6 p-4 w-full bg-slate-900/50 rounded-xl border border-slate-700/50 min-h-[60px] text-sm text-slate-300 text-left">
                    {textAnswer && <span>{textAnswer} </span>}
                    {interimTranscript && <span className="italic text-slate-500">{interimTranscript}</span>}
                    {!textAnswer && !interimTranscript && <span className="text-slate-600 italic">Listening...</span>}
                  </div>
                )}

                <p className="text-xs font-medium text-slate-400 mt-4 flex items-center gap-2">
                  {!isMuted && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
                  <span>{isMuted ? 'Mic is muted. Click mic to speak.' : 'Recording... Click mic to submit.'}</span>
                </p>
                <button 
                  onClick={() => setShowTextInput(true)}
                  className="mt-4 text-[11px] text-slate-400 hover:text-indigo-400 flex items-center gap-1"
                >
                  <Type className="w-3 h-3" />
                  Type your answer instead
                </button>
              </div>
            ) : (
              <div className="w-full mt-4 flex gap-2">
                <input
                  type="text"
                  value={textAnswer}
                  onChange={(e) => { setTextAnswer(e.target.value); textAnswerRef.current = e.target.value; }}
                  onKeyDown={(e) => e.key === 'Enter' && handleTextSubmit()}
                  placeholder="Type your answer here..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:ring-1 focus:ring-indigo-500"
                  autoFocus
                />
                <Button 
                  onClick={handleTextSubmit} 
                  disabled={!textAnswer.trim() || isProcessing}
                  variant="primary"
                >
                  <Send className="w-4 h-4" />
                </Button>
                <Button onClick={() => setShowTextInput(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            )}
          </div>

          <div className="w-full pt-4 border-t border-slate-800/80 flex items-center justify-center gap-4 z-10">
            <button
              onClick={handleToggleMute}
              disabled={isProcessing || showTextInput || isAiSpeaking}
              className={`p-3.5 rounded-2xl transition-all ${
                !isMuted
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              } disabled:opacity-50`}
              title={!isMuted ? 'Stop & Submit' : 'Start Recording'}
            >
              {!isMuted ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsSpeakerOn(!isSpeakerOn)}
              className={`p-3.5 rounded-2xl transition-all ${
                !isSpeakerOn
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
              title={isSpeakerOn ? 'Mute speaker' : 'Enable speaker'}
            >
              {!isSpeakerOn ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            <button
              onClick={handleEndInterview}
              disabled={isProcessing}
              className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-lg shadow-rose-600/30 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              <PhoneOff className="w-5 h-5" />
              <span>End Interview</span>
            </button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
