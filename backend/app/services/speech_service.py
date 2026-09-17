from typing import Dict, Any, Optional
import httpx
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
                ssml = (
                    f"<speak version='1.0' xml:lang='en-US'>"
                    f"<voice xml:lang='en-US' name='{settings.AZURE_SPEECH_VOICE_NAME}'>"
                    f"{text}"
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

speech_service = SpeechService()
