import React, { useState, useEffect } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { WaveformVisualizer } from '../components/interview/WaveformVisualizer';
import { VoiceAvatar } from '../components/interview/VoiceAvatar';
import { Button } from '../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import {
  Mic,
  MicOff,
  PhoneOff,
  Volume2,
  VolumeX,
  Sparkles,
  MessageSquare,
  FileText,
  RotateCcw
} from 'lucide-react';

export const VoiceInterview: React.FC = () => {
  const [seconds, setSeconds] = useState(154); // 00:02:34 matching reference!
  const [isRecording, setIsRecording] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isCandidateSpeaking, setIsCandidateSpeaking] = useState(true);
  const [speechPrompt, setSpeechPrompt] = useState(
    "That's a great answer! Can you explain why you chose a HashMap instead of sorting the array?"
  );

  const navigate = useNavigate();
  const { showToast } = useToast();

  // Timer simulation
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Speaking state toggle simulation
  useEffect(() => {
    const waveInterval = setInterval(() => {
      setIsCandidateSpeaking((prev) => !prev);
    }, 4500);
    return () => clearInterval(waveInterval);
  }, []);

  const formatTimer = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    showToast(isMuted ? 'Microphone unmuted' : 'Microphone muted', 'info');
  };

  const handleToggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
    showToast(isSpeakerOn ? 'Speaker output muted' : 'Speaker output enabled', 'info');
  };

  const handleEndInterview = () => {
    setIsRecording(false);
    showToast('Voice session ended. Generating transcript & communication metrics.', 'success');
    navigate('/interview/transcript');
  };

  return (
    <PageContainer
      title="Voice Interview (Live)"
      subtitle="Simulated Azure Neural Speech Session"
    >
      <div className="max-w-4xl mx-auto">
        {/* Dark Navy Voice Room Container matching Screen 7 */}
        <div className="rounded-3xl bg-[#071A33] border border-slate-800 text-white shadow-2xl p-6 sm:p-10 relative overflow-hidden flex flex-col items-center justify-between min-h-[560px]">
          {/* Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

          {/* Top Bar inside Voice Room */}
          <div className="w-full flex items-center justify-between z-10">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 text-xs">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span className="w-2 h-2 rounded-full bg-rose-500 -ml-3" />
              <span className="font-bold text-rose-300">Recording</span>
              <span className="font-mono text-slate-300 ml-1">{formatTimer(seconds)}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/interview/live')}
                className="text-xs text-indigo-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Switch to Chat</span>
              </button>
            </div>
          </div>

          {/* Center Stage: AI Interviewer Portrait & Speech Bubble */}
          <div className="my-8 flex flex-col items-center justify-center space-y-6 z-10 max-w-lg text-center">
            <VoiceAvatar isAiSpeaking={!isCandidateSpeaking} />

            {/* AI Speech Bubble matching reference Screen 7 */}
            <div className="relative bg-[#0F223D] border border-indigo-500/30 rounded-2xl p-5 shadow-xl text-slate-100 text-sm sm:text-base leading-relaxed animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center justify-center gap-1.5 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Interviewer Speaking</span>
              </div>
              <p>"{speechPrompt}"</p>
            </div>

            {/* Real-time Dynamic Waveform Animation */}
            <div className="w-full flex flex-col items-center pt-2">
              <WaveformVisualizer isSpeaking={isCandidateSpeaking && !isMuted} barCount={22} />
              <p className="text-xs font-medium text-slate-400 mt-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{isMuted ? 'You are muted' : 'You are speaking... (Natural conversational pace)'}</span>
              </p>
            </div>
          </div>

          {/* Bottom Controls Bar matching reference Screen 7 */}
          <div className="w-full pt-4 border-t border-slate-800/80 flex items-center justify-center gap-4 z-10">
            <button
              onClick={handleToggleMute}
              className={`p-3.5 rounded-2xl transition-all ${
                isMuted
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <button
              onClick={handleToggleSpeaker}
              className={`p-3.5 rounded-2xl transition-all ${
                !isSpeakerOn
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
              title={isSpeakerOn ? 'Mute speaker' : 'Enable speaker'}
            >
              {!isSpeakerOn ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            {/* Red End Call Button matching reference Screen 7 */}
            <button
              onClick={handleEndInterview}
              className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-lg shadow-rose-600/30 flex items-center gap-2 transition-all active:scale-95"
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
