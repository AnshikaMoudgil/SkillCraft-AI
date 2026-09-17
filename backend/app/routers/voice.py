from fastapi import APIRouter, Depends, Response, HTTPException
from typing import Dict, Any
from pydantic import BaseModel
from app.core.auth import get_current_user
from app.services.speech_service import speech_service

router = APIRouter(prefix="/voice", tags=["Azure AI Speech"])

class SynthesizeSpeechRequest(BaseModel):
    text: str

@router.get("/token")
async def get_speech_token(current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Returns an ephemeral Azure AI Speech STS token and region.
    Allows frontend client to securely connect directly to Azure Speech SDK.
    """
    token_info = await speech_service.get_speech_token()
    return token_info

@router.post("/synthesize")
async def synthesize_speech(
    req: SynthesizeSpeechRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Synthesizes speech using Azure Neural Voices, returning streaming audio bytes.
    """
    audio_bytes = await speech_service.synthesize_speech(req.text)
    if not audio_bytes:
        return {"status": "fallback", "message": "Neural speech emulation active"}

    return Response(
        content=audio_bytes,
        media_type="audio/mpeg",
        headers={"Content-Disposition": "inline; filename=speech.mp3"}
    )
