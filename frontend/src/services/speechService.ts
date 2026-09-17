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

  startRecording(): void {
    // In future with Azure Speech SDK:
    // const speechConfig = SpeechConfig.fromAuthorizationToken(token, region);
    // const recognizer = new SpeechRecognizer(speechConfig, audioConfig);
  },

  stopRecording(): void {
    // In future: recognizer.stopContinuousRecognitionAsync();
  },

  /**
   * Synthesize text to speech using Azure Neural Voice or browser Web Speech fallback
   */
  async synthesizeSpeech(text: string): Promise<boolean> {
    // 1. Try Azure Speech backend neural synthesis endpoint
    try {
      const response = await fetch(`${apiClient.baseUrl}/voice/synthesize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (response.ok && response.headers.get('content-type')?.includes('audio')) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        await audio.play();
        return true;
      }
    } catch (e) {
      console.warn('[speechService] Azure voice endpoint fallback to Web Speech:', e);
    }

    // 2. Browser native SpeechSynthesis fallback
    if ('speechSynthesis' in window) {
      return new Promise((resolve) => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.onend = () => resolve(true);
        utterance.onerror = () => resolve(false);
        window.speechSynthesis.speak(utterance);
      });
    }

    return true;
  },
};
