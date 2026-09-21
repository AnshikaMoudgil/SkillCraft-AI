from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class InterviewPlanCategory(BaseModel):
    name: str
    count: int

class InterviewPlan(BaseModel):
    interview_goal: str
    role: str
    difficulty: str
    estimated_duration: int
    total_questions: int
    categories: List[InterviewPlanCategory]
    difficulty_progression: List[str]
    adaptive_strategy: List[str]

class GeneratePlanRequest(BaseModel):
    type: str = Field(default="technical", pattern="^(technical|mixed|coding|resume)$")
    role: str = "Software Engineer"
    difficulty: str = Field(default="Intermediate", pattern="^(Beginner|Intermediate|Advanced|Expert)$")
    number_of_questions: int = 5
    experience_level: str = "Fresher"
    programming_language: Optional[str] = None
    focus_areas: Optional[List[str]] = []
    resumeContext: Optional[str] = None
    resume_id: Optional[str] = None

class StartInterviewRequest(BaseModel):
    title: str = "Frontend Engineering Mock"
    type: str = Field(default="technical", pattern="^(technical|mixed|coding|resume)$")
    role: str = "Software Engineer"
    difficulty: str = Field(default="Intermediate", pattern="^(Beginner|Intermediate|Advanced|Expert)$")
    number_of_questions: int = 5
    experience_level: str = "Fresher"
    programming_language: Optional[str] = None
    focus_areas: Optional[List[str]] = []
    resumeContext: Optional[str] = None
    generated_plan: Optional[Dict[str, Any]] = None

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
    success: bool = True
    session_id: str
    candidate_answer: str
    ai_response: str
    next_question: str
    feedback: str
    conversation_id: str
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
    topicsToPractice: List[str] = []
    communicationMetrics: List[CommunicationMetric]
    preparationPlan: List[Dict[str, str]] = []
