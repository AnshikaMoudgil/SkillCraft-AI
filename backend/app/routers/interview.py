from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any
from app.core.auth import get_current_user
from app.models.interview import (
    StartInterviewRequest,
    StartInterviewResponse,
    CandidateAnswerRequest,
    CandidateAnswerResponse,
    EvaluateInterviewRequest,
    EvaluateInterviewResponse
)
from app.services.supabase_service import supabase_service
from app.services.foundry_agent_service import foundry_agent_service
from app.services.rag_service import rag_service

router = APIRouter(prefix="/interview", tags=["Adaptive Interview Agent"])

@router.post("/start", response_model=StartInterviewResponse)
async def start_interview(
    req: StartInterviewRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Starts an adaptive mock interview session.
    Retrieves RAG context from Azure AI Search, uses Foundry Agent to formulate
    opening questions, and stores the session in Supabase PostgreSQL.
    """
    user_id = current_user["id"]

    # 1. RAG retrieval: Fetch relevant resume context from Azure AI Search
    search_query = f"{req.role} {req.difficulty} {req.type} interview"
    rag_context = await rag_service.retrieve_relevant_context(
        query=search_query,
        user_id=user_id,
        top_k=2
    )
    if req.resumeContext:
        rag_context = f"{req.resumeContext}\n{rag_context}"

    # 2. Microsoft Foundry Agent creates opening question
    agent_output = await foundry_agent_service.generate_first_question(
        role=req.role,
        difficulty=req.difficulty,
        rag_context=rag_context
    )

    # 3. Store new interview record in Supabase
    session_data = {
        "title": req.title,
        "type": req.type,
        "role": req.role,
        "difficulty": req.difficulty,
        "score": 0,
        "summary_feedback": ""
    }
    created_session = await supabase_service.create_interview(user_id, session_data)
    session_id = created_session["id"]

    # 4. Save opening turn in transcripts
    await supabase_service.append_transcript(
        interview_id=session_id,
        turn={
            "sender": "ai",
            "text": f"{agent_output['greeting']} {agent_output['firstQuestion']}",
            "timestamp": "00:00",
            "topic": agent_output["topic"]
        }
    )

    return StartInterviewResponse(
        sessionId=session_id,
        greeting=agent_output["greeting"],
        firstQuestion=agent_output["firstQuestion"],
        topic=agent_output["topic"],
        expectedDurationMinutes=15
    )

@router.post("/respond", response_model=CandidateAnswerResponse)
async def respond_to_candidate(
    req: CandidateAnswerRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Evaluates candidate's verbal or written answer via Microsoft Foundry Agent,
    persists dialogue in Supabase transcripts, and generates dynamic follow-up.
    """
    # 1. Append candidate's answer to Supabase transcript
    await supabase_service.append_transcript(
        interview_id=req.sessionId,
        turn={
            "sender": "user",
            "text": req.answer,
            "timestamp": "01:15",
            "topic": req.topic
        }
    )

    # 2. Retrieve supplementary domain context via RAG
    rag_context = await rag_service.retrieve_relevant_context(
        query=f"{req.topic} {req.question}",
        user_id=current_user["id"],
        top_k=1
    )

    # 3. Foundry Agent evaluates answer & produces follow-up question
    evaluation = await foundry_agent_service.evaluate_answer_and_followup(
        question=req.question,
        answer=req.answer,
        topic=req.topic or "Technical",
        rag_context=rag_context
    )

    # 4. Append AI follow-up to transcript
    await supabase_service.append_transcript(
        interview_id=req.sessionId,
        turn={
            "sender": "ai",
            "text": f"{evaluation['feedback']} {evaluation['followUp']}",
            "timestamp": "01:45",
            "topic": req.topic,
            "analysis": {
                "score": evaluation.get("score", 85),
                "sentiment": evaluation.get("sentiment", "neutral"),
                "clarityScore": evaluation.get("clarityScore", 85)
            }
        }
    )

    return CandidateAnswerResponse(
        feedback=evaluation.get("feedback", "Good explanation."),
        followUp=evaluation.get("followUp", "Can you explain the trade-offs of this approach?"),
        score=evaluation.get("score", 85),
        sentiment=evaluation.get("sentiment", "neutral"),
        clarityScore=evaluation.get("clarityScore", 85)
    )

@router.post("/evaluate", response_model=EvaluateInterviewResponse)
async def evaluate_interview(
    req: EvaluateInterviewRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Computes overall interview evaluation, communication metrics, and recommendations,
    and records results in Supabase.
    """
    # 1. Synthesize transcript analysis via Foundry Agent
    eval_result = await foundry_agent_service.evaluate_transcript(req.transcripts)

    # 2. Update interview in Supabase
    update_data = {
        "score": eval_result["overallScore"],
        "summary_feedback": eval_result["summary"],
        "strengths": eval_result["strengths"],
        "improvements": eval_result["improvements"],
        "communication_metrics": eval_result["communicationMetrics"]
    }
    await supabase_service.update_interview_evaluation(req.sessionId, update_data)

    # 3. Update candidate overall profile score
    await supabase_service.update_profile(current_user["id"], {
        "overall_score": eval_result["overallScore"]
    })

    return EvaluateInterviewResponse(
        overallScore=eval_result["overallScore"],
        summary=eval_result["summary"],
        strengths=eval_result["strengths"],
        improvements=eval_result["improvements"],
        communicationMetrics=eval_result["communicationMetrics"]
    )
