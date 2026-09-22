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

class CodeRunRequest(BaseModel):
    problemTitle: str
    code: str
    language: str

class CodeSubmitRequest(BaseModel):
    problemTitle: str
    code: str
    language: str

class TestResult(BaseModel):
    id: int
    input: str
    expected: str
    actual: str
    status: str

class CodeExecutionResponse(BaseModel):
    passed: bool
    totalTests: int
    passedTests: int
    runtimeMs: float
    memoryMb: float
    results: list[TestResult]
    aiFeedback: str = ""
    compileError: Optional[str] = None
    runtimeError: Optional[str] = None
    percentileScore: Optional[float] = None

class ExplainErrorRequest(BaseModel):
    problemTitle: str
    code: str
    language: str
    errorMessage: str

class ExplainErrorResponse(BaseModel):
    explanation: str
