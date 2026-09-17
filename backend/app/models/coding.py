from typing import Optional
from pydantic import BaseModel

class CodingHintRequest(BaseModel):
    problemTitle: str
    userCode: str
    hintIndex: int = 0

class CodingHintResponse(BaseModel):
    hint: str
    hintIndex: int
    hasMoreHints: bool = True

class CodeReviewRequest(BaseModel):
    problemTitle: str
    code: str
    language: str = "javascript"

class CodeReviewResponse(BaseModel):
    summary: str
    style: str
    efficiency: str
    cleanliness: str

class ComplexityAnalysisRequest(BaseModel):
    code: str
    language: str = "javascript"

class ComplexityAnalysisResponse(BaseModel):
    timeComplexity: str
    spaceComplexity: str
    breakdown: str
