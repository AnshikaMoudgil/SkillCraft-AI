from typing import Dict, Any, Optional
import httpx
import tempfile
import os
import azure.cognitiveservices.speech as speechsdk
from app.core.config import settings

class SpeechService:
    """
    Azure AI Speech Service
    Provides token vending for client-side streaming SDK,
    and server-side speech synthesis (TTS) / recognition (STT).
    """
    def __init__(self):
        pass

    @property
    def is_connected(self) -> bool:
        return settings.is_speech_configured

    async def get_speech_token(self) -> Dict[str, Any]:
        """
        Vends a temporary auth token for Azure Cognitive Services Speech SDK.
        This keeps the primary AZURE_SPEECH_KEY private on the backend.
        """
        if settings.is_speech_configured:
            try:
                sts_url = f"https://{settings.AZURE_SPEECH_REGION}.api.cognitive.microsoft.com/sts/v1.0/issueToken"
                headers = {
                    "Ocp-Apim-Subscription-Key": settings.AZURE_SPEECH_KEY,
                    "Content-type": "application/x-www-form-urlencoded",
                    "Content-Length": "0"
                }
                async with httpx.AsyncClient(timeout=10.0) as client:
                    resp = await client.post(sts_url, headers=headers)
                    if resp.status_code == 200:
                        return {
                            "token": resp.text,
                            "region": settings.AZURE_SPEECH_REGION,
                            "isConfigured": True
                        }
                    print(f"[SpeechService] Azure Speech STS returned status {resp.status_code}: {resp.text}")
            except Exception as e:
                print(f"[SpeechService] Failed to generate Azure Speech token: {e}")

        # Local development / fallback response
        return {
            "token": "mock-azure-speech-token-dev-mode",
            "region": settings.AZURE_SPEECH_REGION or "eastus",
            "isConfigured": False
        }

    async def synthesize_speech(self, text: str) -> Optional[bytes]:
        """
        Synthesizes text to speech using Azure Neural Speech voices via REST API.
        """
        if settings.is_speech_configured:
            try:
                token_data = await self.get_speech_token()
                token = token_data.get("token")
                tts_url = f"https://{settings.AZURE_SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1"
                import html
                escaped_text = html.escape(text)
                ssml = (
                    f"<speak version='1.0' xml:lang='en-US'>"
                    f"<voice xml:lang='en-US' name='{settings.AZURE_SPEECH_VOICE_NAME}'>"
                    f"{escaped_text}"
                    f"</voice></speak>"
                )
                headers = {
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/ssml+xml",
                    "X-Microsoft-OutputFormat": "audio-16khz-128kbitrate-mono-mp3",
                    "User-Agent": "SkillCraftAI"
                }
                async with httpx.AsyncClient(timeout=15.0) as client:
                    resp = await client.post(tts_url, headers=headers, content=ssml.encode("utf-8"))
                    if resp.status_code == 200:
                        return resp.content
            except Exception as e:
                print(f"[SpeechService] Audio synthesis error: {e}")

        return None

    async def recognize_speech_from_audio(self, audio_bytes: bytes) -> str:
        """
        Transcribes speech from an audio file using Azure Speech SDK.
        """
        if not settings.is_speech_configured:
            return "Speech recognition is not configured."

        try:
            # Use ANY container format to let Azure handle browser WebM/OGG compressions natively
            stream_format = speechsdk.audio.AudioStreamFormat(compressed_stream_format=speechsdk.audio.AudioStreamContainerFormat.ANY)
            push_stream = speechsdk.audio.PushAudioInputStream(stream_format=stream_format)
            push_stream.write(audio_bytes)
            push_stream.close()

            speech_config = speechsdk.SpeechConfig(
                subscription=settings.AZURE_SPEECH_KEY, 
                region=settings.AZURE_SPEECH_REGION
            )
            audio_config = speechsdk.audio.AudioConfig(stream=push_stream)
            speech_recognizer = speechsdk.SpeechRecognizer(
                speech_config=speech_config, 
                audio_config=audio_config
            )

            # Perform recognition
            result = speech_recognizer.recognize_once_async().get()
            
            if result.reason == speechsdk.ResultReason.RecognizedSpeech:
                return result.text
            elif result.reason == speechsdk.ResultReason.NoMatch:
                print("[SpeechService] Speech Recognition returned NoMatch (possibly silent or unsupported audio).")
                return ""
            elif result.reason == speechsdk.ResultReason.Canceled:
                cancellation_details = result.cancellation_details
                print(f"[SpeechService] Speech Recognition canceled: {cancellation_details.reason}")
                return ""
        except Exception as e:
            print(f"[SpeechService] Exception during speech recognition: {e}")
        
        return ""

speech_service = SpeechService()
