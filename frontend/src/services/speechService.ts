/**
 * Speech Service
 * 
 * Powered by Azure AI Speech via FastAPI backend token vending and neural voice synthesis.
 */

import { apiClient } from '../lib/apiClient';

export interface SpeechSessionState {
  isRecording: boolean;
  isMuted: boolean;
  volumeLevel: number;
  durationSeconds: number;
}

export interface SpeechTokenResponse {
  token: string;
  region: string;
  isConfigured: boolean;
}

let currentAudio: HTMLAudioElement | null = null;

export const speechService = {
  /**
   * Fetches Azure AI Speech STS token for browser SDK streaming
   */
  async getSpeechToken(): Promise<SpeechTokenResponse> {
    try {
      const res = await apiClient.get<SpeechTokenResponse>('/voice/token');
      return res;
    } catch (e) {
      console.warn('[speechService] Token endpoint unreachable, running fallback:', e);
      return {
        token: 'dev-mode-token',
        region: 'eastus',
        isConfigured: false,
      };
    }
  },

  async recognizeAudio(audioBlob: Blob): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');
      const response = await apiClient.upload<{ text: string }>('/voice/recognize', formData);
      return response.text;
    } catch (e) {
      console.warn('[speechService] Audio recognition failed:', e);
      return '';
    }
  },

  /**
   * Stops currently playing speech synthesis.
   */
  stopSpeech() {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  },

  /**
   * Synthesize text to speech using Azure Neural Voice or browser Web Speech fallback
   */
  async synthesizeSpeech(text: string): Promise<boolean> {
    console.log("[VoiceDebug] TTS CALL");
    console.log(`[VoiceDebug] TTS text: ${text}`);
    console.log("[VoiceDebug] TTS caller/location: speechService.synthesizeSpeech");
    // 1. Try Azure Speech backend neural synthesis endpoint
    try {
      // Get auth headers from Supabase session using the exported getAuthHeaders (or manually)
      const { supabase } = await import('../lib/supabase');
      let tokenStr = '';
      if (supabase) {
        const { data } = await supabase.auth.getSession();
        if (data?.session?.access_token) tokenStr = `Bearer ${data.session.access_token}`;
      }
      if (!tokenStr && localStorage.getItem('skillcraft_is_authenticated') === 'true') {
        tokenStr = 'Bearer mock-demo-token';
      }

      const response = await fetch(`${apiClient.baseUrl}/voice/synthesize`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(tokenStr ? { 'Authorization': tokenStr } : {})
        },
        body: JSON.stringify({ text }),
      });

      console.log(`[VoiceDebug] Azure response status: ${response.status}, ok: ${response.ok}`);
      const contentType = response.headers.get('content-type');
      console.log(`[VoiceDebug] Azure content-type: ${contentType}`);

      if (response.ok && contentType?.includes('audio')) {
        const audioBlob = await response.blob();
        console.log(`[VoiceDebug] Blob created, size: ${audioBlob.size}`);
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Stop any currently playing audio before starting new one
        if (currentAudio) {
          currentAudio.pause();
        }
        
        const audio = new Audio(audioUrl);
        currentAudio = audio;
        
        try {
          await audio.play();
          console.log("[VoiceDebug] audio.play() succeeded!");
          return true;
        } catch (playError) {
          console.error("[VoiceDebug] audio.play() failed with error:", playError);
          // Don't fall back to native if it's an autoplay policy issue, because native will also fail/hang
          return true; 
        }
      } else {
        console.warn(`[VoiceDebug] Azure endpoint didn't return audio. Response text: ${await response.text().catch(() => 'none')}`);
      }
    } catch (e) {
      console.error('[VoiceDebug] Azure voice endpoint fetch exception:', e);
    }

    // 2. Browser native SpeechSynthesis fallback
    console.log("[VoiceDebug] Attempting native Web Speech API fallback...");
    if ('speechSynthesis' in window) {
      return new Promise((resolve) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        
        // Timeout to prevent hanging if onend doesn't fire
        const fallbackTimeout = setTimeout(() => {
           console.warn("[VoiceDebug] Native TTS timed out (onend didn't fire).");
           resolve(true);
        }, 10000);

        utterance.onend = () => {
          clearTimeout(fallbackTimeout);
          console.log("[VoiceDebug] Native TTS completed.");
          resolve(true);
        };
        utterance.onerror = (e) => {
          clearTimeout(fallbackTimeout);
          console.error("[VoiceDebug] Native TTS error:", e);
          resolve(false);
        };
        window.speechSynthesis.speak(utterance);
      });
    }

    return true;
  },
};
