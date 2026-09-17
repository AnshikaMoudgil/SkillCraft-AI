from fastapi import APIRouter, Depends
from typing import Dict, Any
from app.core.auth import get_current_user
from app.models.coding import (
    CodingHintRequest,
    CodingHintResponse,
    CodeReviewRequest,
    CodeReviewResponse,
    ComplexityAnalysisRequest,
    ComplexityAnalysisResponse
)
from app.services.foundry_agent_service import foundry_agent_service

router = APIRouter(prefix="/coding", tags=["Coding Coach Agent"])

@router.post("/hint", response_model=CodingHintResponse)
async def get_coding_hint(
    req: CodingHintRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Generates progressive coding hints without revealing complete answers."""
    hint_text = await foundry_agent_service.generate_hint(
        problem_title=req.problemTitle,
        user_code=req.userCode,
        hint_index=req.hintIndex
    )
    return CodingHintResponse(
        hint=hint_text,
        hintIndex=req.hintIndex,
        hasMoreHints=req.hintIndex < 3
    )

@router.post("/review", response_model=CodeReviewResponse)
async def review_code(
    req: CodeReviewRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Executes structured architectural and clean-code review."""
    review = await foundry_agent_service.review_code(
        problem_title=req.problemTitle,
        code=req.code,
        language=req.language
    )
    return CodeReviewResponse(
        summary=review.get("summary", "Clean implementation."),
        style=review.get("style", "Follows standard formatting."),
        efficiency=review.get("efficiency", "Optimal runtime."),
        cleanliness=review.get("cleanliness", "Clean modular code.")
    )

@router.post("/complexity", response_model=ComplexityAnalysisResponse)
async def analyze_complexity(
    req: ComplexityAnalysisRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Evaluates computational time and space complexity."""
    analysis = await foundry_agent_service.analyze_complexity(
        code=req.code,
        language=req.language
    )
    return ComplexityAnalysisResponse(
        timeComplexity=analysis.get("timeComplexity", "O(n)"),
        spaceComplexity=analysis.get("spaceComplexity", "O(1)"),
        breakdown=analysis.get("breakdown", "Evaluates elements linearly.")
    )
