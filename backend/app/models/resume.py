from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class ResumeProject(BaseModel):
    title: str
    description: str
    techStack: List[str]

class ResumeExperience(BaseModel):
    role: str
    company: str
    duration: str
    description: str

class ResumeAnalysis(BaseModel):
    name: str = ""
    education: List[str] = []
    skills: List[str] = []
    programming_languages: List[str] = []
    frameworks: List[str] = []
    tools: List[str] = []
    experience: List[ResumeExperience] = []
    projects: List[ResumeProject] = []
    certifications: List[str] = []
    achievements: List[str] = []
    leadership: List[str] = []
    links: List[str] = []
    interview_focus_areas: List[str] = []
    potential_questions: List[str] = []

class ResumeParsedData(BaseModel):
    id: Optional[str] = None
    fileName: str
    fileSize: str
    parsedDate: str
    analysis: ResumeAnalysis
    rawText: str = ""
