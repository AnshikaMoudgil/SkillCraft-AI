from typing import List, Optional
from pydantic import BaseModel, Field

class UserProfileSchema(BaseModel):
    id: Optional[str] = None
    name: Optional[str] = "Candidate"
    role: Optional[str] = "Candidate"
    avatarUrl: Optional[str] = None
    overallScore: Optional[int] = 0
    scoreChange: Optional[int] = 0
    interviewsCompleted: Optional[int] = 0
    codingStreak: Optional[int] = 0
    skills: Optional[List[str]] = Field(default_factory=list)
    email: Optional[str] = None

class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    skills: Optional[List[str]] = None
    overallScore: Optional[int] = None
    avatarUrl: Optional[str] = None
