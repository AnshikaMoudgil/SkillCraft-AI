from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class StartInterviewRequest(BaseModel):
    title: str = "Frontend Engineering Mock"
    type: str = Field(default="technical", pattern="^(technical|mock|coding|resume)$")
    role: str = "Senior Frontend Engineer"
    difficulty: str = Field(default="Intermediate", pattern="^(Beginner|Intermediate|Advanced|Expert)$")
    resumeContext: Optional[str] = None

class StartInterviewResponse(BaseModel):
    sessionId: str
    greeting: str
    firstQuestion: str
    topic: str
    expectedDurationMinutes: int = 15

class CandidateAnswerRequest(BaseModel):
    sessionId: str
    question: str
    answer: str
    topic: Optional[str] = "General"
    audioLengthSeconds: Optional[float] = None

class CandidateAnswerResponse(BaseModel):
    feedback: str
    followUp: str
    score: int
    sentiment: str = "neutral"
    clarityScore: int = 85

class EvaluateInterviewRequest(BaseModel):
    sessionId: str
    transcripts: List[Dict[str, Any]] = []

class CommunicationMetric(BaseModel):
    label: str
    status: str
    score: int
    description: str

class EvaluateInterviewResponse(BaseModel):
    overallScore: int
    summary: str
    strengths: List[str]
    improvements: List[str]
    communicationMetrics: List[CommunicationMetric]
