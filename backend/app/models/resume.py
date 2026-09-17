from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class ResumeProject(BaseModel):
    title: str
    description: str
    techStack: List[str]

class ResumeParsedData(BaseModel):
    id: Optional[str] = None
    fileName: str
    fileSize: str
    parsedDate: str
    skills: List[str]
    projects: List[ResumeProject]
    experienceYears: float
    education: str
    roleMatchScore: int
    suggestedFocusAreas: List[str]
    ragIndexed: bool = False
