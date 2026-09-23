from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any, List
import uuid
import random

from app.core.auth import get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/mixed", tags=["Mixed Mock Interview"])

# --- Models ---
class MixedSessionStartRequest(BaseModel):
    role: str
    difficulty: str
    num_questions: int

class EvaluateAnswerRequest(BaseModel):
    session_id: str
    question_id: str
    answer: str

# --- Static Data Banks ---
MCQ_BANK = [
    {
        "id": "mcq-1",
        "type": "mcq",
        "question": "Which of the following is true about a Binary Search Tree?",
        "options": [
            {"id": "A", "text": "The left child is always greater than the parent."},
            {"id": "B", "text": "The right child is always less than the parent."},
            {"id": "C", "text": "In-order traversal yields elements in sorted order."},
            {"id": "D", "text": "It is always perfectly balanced."}
        ],
        "correct_option_id": "C",
        "explanation": "An in-order traversal (Left, Root, Right) of a BST visits nodes in monotonically increasing order.",
        "category": "DSA"
    },
    {
        "id": "mcq-2",
        "type": "mcq",
        "question": "What is the primary purpose of a database index?",
        "options": [
            {"id": "A", "text": "To compress data and save disk space."},
            {"id": "B", "text": "To speed up data retrieval operations."},
            {"id": "C", "text": "To enforce foreign key constraints automatically."},
            {"id": "D", "text": "To prevent SQL injection attacks."}
        ],
        "correct_option_id": "B",
        "explanation": "Indexes create a separate data structure (often a B-Tree) that allows the database engine to find rows quickly without scanning the entire table.",
        "category": "DBMS"
    },
    {
        "id": "mcq-3",
        "type": "mcq",
        "question": "Which HTTP method is meant to be idempotent?",
        "options": [
            {"id": "A", "text": "POST"},
            {"id": "B", "text": "PUT"},
            {"id": "C", "text": "PATCH"},
            {"id": "D", "text": "CONNECT"}
        ],
        "correct_option_id": "B",
        "explanation": "PUT is idempotent, meaning multiple identical requests should have the same effect as a single request (replacing the resource).",
        "category": "Networking"
    }
]

TECH_BANK = [
    {
        "id": "tech-1",
        "type": "technical",
        "question": "Explain the difference between concurrency and parallelism.",
        "expected_key_points": ["Concurrency is about dealing with multiple things at once (structure)", "Parallelism is about doing multiple things at once (execution)", "Single core vs Multi-core"],
        "category": "OS"
    },
    {
        "id": "tech-2",
        "type": "technical",
        "question": "How does Garbage Collection work in Java/C#?",
        "expected_key_points": ["Generational hypothesis", "Mark and sweep", "Eden, Survivor, Tenured spaces", "Stop-the-world pauses"],
        "category": "Languages"
    }
]

VOICE_BANK = [
    {
        "id": "voice-1",
        "type": "voice",
        "question": "Walk me through how you would design a URL shortening service like Bitly.",
        "expected_key_points": ["API endpoints", "Database schema", "Hashing algorithm", "High availability/Load balancing"],
        "category": "System Design"
    },
    {
        "id": "voice-2",
        "type": "voice",
        "question": "Tell me about a time you had to resolve a conflict within your team.",
        "expected_key_points": ["Situation/Task", "Action", "Result", "Empathy", "Communication"],
        "category": "Behavioral"
    }
]

from app.services.coding_problems_db import coding_problems_db
from app.services.supabase_service import supabase_service

active_sessions = {}

@router.post("/start")
async def start_mixed_session(
    req: MixedSessionStartRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    session_id = str(uuid.uuid4())
    
    questions = []
    
    # 1. Grab MCQs
    shuffled_mcqs = random.sample(MCQ_BANK, min(len(MCQ_BANK), max(1, req.num_questions // 4)))
    questions.extend(shuffled_mcqs)
    
    # 2. Grab Techs (Text)
    shuffled_techs = random.sample(TECH_BANK, min(len(TECH_BANK), max(1, req.num_questions // 4)))
    questions.extend(shuffled_techs)

    # 3. Grab Techs (Voice)
    shuffled_voices = random.sample(VOICE_BANK, min(len(VOICE_BANK), max(1, req.num_questions // 4)))
    questions.extend(shuffled_voices)
    
    # 4. Grab Coding
    all_problems = list(coding_problems_db._problems.values())
    if all_problems:
        p = random.choice(all_problems)
        questions.append({
            "id": f"code-{p['problem_id']}",
            "type": "coding",
            "problem_id": p['problem_id'],
            "title": p.get("title", ""),
            "difficulty": p.get("difficulty", ""),
            "question": f"Coding Challenge: {p['title']}",
            "expected_key_points": [],
            "category": p.get("category", "Algorithms"),
            "starter_code": p.get("starter_code", {})
        })
        
    random.shuffle(questions)
    
    # Truncate if we somehow have more
    questions = questions[:req.num_questions]
    
    # Store locally
    active_sessions[session_id] = {
        "user_id": current_user["id"],
        "questions": questions,
        "answers": {},
        "scores": {}
    }
    
    # Persist session to Supabase
    await supabase_service.create_interview(
        current_user["id"],
        {
            "id": session_id,
            "title": f"Mixed Mock: {req.role}",
            "type": "mixed",
            "role": req.role,
            "difficulty": req.difficulty,
            "number_of_questions": req.num_questions,
            "score": 0,
            "summary_feedback": ""
        }
    )
    
    # Remove correct answers from MCQs before sending to client
    client_questions = []
    for q in questions:
        q_copy = dict(q)
        if q_copy["type"] == "mcq":
            q_copy.pop("correct_option_id", None)
            q_copy.pop("explanation", None)
        client_questions.append(q_copy)
        
    return {
        "session_id": session_id,
        "questions": client_questions
    }

@router.post("/evaluate")
async def evaluate_answer(
    req: EvaluateAnswerRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    session = active_sessions.get(req.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    original_q = next((q for q in session["questions"] if q["id"] == req.question_id), None)
    if not original_q:
        raise HTTPException(status_code=404, detail="Question not found in session")
        
    session["answers"][req.question_id] = req.answer
    
    if original_q["type"] == "mcq":
        is_correct = req.answer == original_q["correct_option_id"]
        session["scores"][req.question_id] = 100 if is_correct else 0
        return {
            "is_correct": is_correct,
            "correct_option_id": original_q["correct_option_id"],
            "explanation": original_q["explanation"]
        }
        
    elif original_q["type"] in ["technical", "voice"]:
        # Simulate AI grading
        import asyncio
        await asyncio.sleep(1)
        
        length = len(req.answer.split())
        score = min(100, max(0, length * 5))
        session["scores"][req.question_id] = score
        
        feedback = "Good attempt. You touched on some key areas."
        if score > 80:
            feedback = "Excellent answer, covering the main architectural considerations."
        elif score < 40:
            feedback = "Your answer was a bit brief. Next time, try to expand on the core mechanisms."
            
        return {
            "score": score,
            "feedback": feedback,
            "expected_points": original_q["expected_key_points"]
        }
        
    return {"status": "recorded"}

@router.post("/finish")
async def finish_session(
    session_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    session = active_sessions.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    # Aggregate scores
    scores = session["scores"]
    total = sum(scores.values())
    count = len(scores)
    avg = total / count if count > 0 else 0
    
    # Persist the evaluation
    await supabase_service.update_interview_evaluation(
        session_id,
        {
            "score": avg,
            "summary_feedback": f"You completed {count} questions across different topics with an average score of {int(avg)}/100.",
            "strengths": ["Adaptability", "Broad CS Knowledge"] if avg >= 60 else ["Willingness to learn"],
            "improvements": ["Deep diving into specific topics"] if avg < 80 else [],
            "topicsToPractice": ["Data Structures", "System Design"] if avg < 70 else [],
            "communication_metrics": [
                {"name": "Clarity", "score": int(avg * 0.9), "feedback": "Good structure in answers"},
                {"name": "Confidence", "score": int(avg * 0.95), "feedback": "Steady delivery"}
            ]
        }
    )
    
    # Update profile score
    await supabase_service.update_profile(current_user["id"], {
        "overall_score": avg
    })
    
    return {
        "session_id": session_id,
        "final_score": avg,
        "breakdown": scores
    }
