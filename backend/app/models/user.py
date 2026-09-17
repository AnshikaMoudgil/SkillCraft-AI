from typing import List, Optional
from pydantic import BaseModel, Field

class UserProfileSchema(BaseModel):
    id: Optional[str] = None
    name: str = "Alex Morgan"
    role: str = "Full Stack Developer"
    avatarUrl: Optional[str] = None
    overallScore: int = 84
    scoreChange: int = 6
    interviewsCompleted: int = 12
    codingStreak: int = 7
    skills: List[str] = ["React", "TypeScript", "Node.js", "Python", "System Design"]
    email: Optional[str] = "alex.morgan@example.com"

class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    skills: Optional[List[str]] = None
    overallScore: Optional[int] = None
    avatarUrl: Optional[str] = None
