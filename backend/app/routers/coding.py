from fastapi import APIRouter, Depends
from typing import Dict, Any
from app.core.auth import get_current_user
from app.models.coding import (
    CodingHintRequest,
    CodingHintResponse,
    CodeReviewRequest,
    CodeReviewResponse,
    ComplexityAnalysisRequest,
    ComplexityAnalysisResponse,
    CodeRunRequest,
    CodeSubmitRequest,
    CodeExecutionResponse,
    TestResult
)
from app.services.foundry_agent_service import foundry_agent_service
from app.services.judge0_service import judge0_service
from app.services.coding_problems_db import coding_problems_db
from app.services.supabase_service import supabase_service
from fastapi import HTTPException
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
@router.get("/problems")
async def get_coding_problems(
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Retrieves all coding problems."""
    # Convert DB dictionary to a list suitable for frontend
    problems = []
    for p in coding_problems_db._problems.values():
        problems.append({
            "id": p.get("problem_id", p.get("title", "").lower().replace(" ", "-")),
            "title": p.get("title", ""),
            "slug": p.get("slug", p.get("title", "").lower().replace(" ", "-")),
            "difficulty": p.get("difficulty", "Medium"),
            "category": p.get("category", "Algorithms"),
            "description": p.get("description", ""),
            "starterCode": p.get("starter_code", {}),
            "testCases": p.get("visible_test_cases", []),
            "examples": [
                {
                    "input": t.get("input", ""),
                    "output": t.get("expected", ""),
                    "explanation": t.get("explanation", "")
                } for t in p.get("visible_test_cases", [])
            ],
            "hints": p.get("hints", []),
            "solutionExplanation": p.get("solution_explanation", ""),
            "constraints": p.get("constraints", [])
        })
    return problems

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

async def _execute_tests(code: str, language: str, test_cases: list, time_limit: float, memory_limit: int):
    results = []
    total_time = 0.0
    max_memory = 0.0
    compile_error = None
    runtime_error = None
    
    for idx, test in enumerate(test_cases):
        res = await judge0_service.execute_code(
            source_code=code,
            language=language,
            stdin=test.get("input", ""),
            expected_output=test.get("expected", ""),
            cpu_time_limit=time_limit,
            memory_limit=memory_limit
        )
        
        test_status = "failed"
        if res["passed"]:
            test_status = "passed"
        
        results.append(TestResult(
            id=test.get("id", idx + 1),
            input=test.get("input", ""),
            expected=test.get("expected", ""),
            actual=res["output"],
            status=test_status
        ))
        
        total_time += res["execution_time"]
        max_memory = max(max_memory, res["memory"])
        
        if res["compile_error"] and not compile_error:
            compile_error = res["compile_error"]
        if res["runtime_error"] and not runtime_error:
            runtime_error = res["runtime_error"]
            
        if not res["passed"]:
            break # Stop on first failure
            
    passed_tests = sum(1 for r in results if r.status == "passed")
    all_passed = passed_tests == len(test_cases) and not compile_error and not runtime_error
    
    return {
        "passed": all_passed,
        "passedTests": passed_tests,
        "totalTests": len(test_cases),
        "runtimeMs": total_time * 1000, # Convert to ms
        "memoryMb": max_memory,
        "results": results,
        "compileError": compile_error,
        "runtimeError": runtime_error
    }

@router.post("/run", response_model=CodeExecutionResponse)
async def run_code(
    req: CodeRunRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Executes visible test cases against Judge0."""
    problem = coding_problems_db.get_problem(req.problemTitle)
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
        
    visible_tests = problem.get("visible_test_cases", [])
    if not visible_tests:
        return CodeExecutionResponse(passed=True, totalTests=0, passedTests=0, runtimeMs=0, memoryMb=0, results=[])

    res = await _execute_tests(
        req.code, 
        req.language, 
        visible_tests, 
        problem.get("time_limit", 2.0), 
        problem.get("memory_limit", 128000)
    )
    
    return CodeExecutionResponse(
        passed=res["passed"],
        totalTests=res["totalTests"],
        passedTests=res["passedTests"],
        runtimeMs=res["runtimeMs"],
        memoryMb=res["memoryMb"],
        results=res["results"],
        compileError=res["compileError"],
        runtimeError=res["runtimeError"]
    )

@router.post("/submit", response_model=CodeExecutionResponse)
async def submit_code(
    req: CodeSubmitRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Executes all test cases, saves submission, and gets AI review."""
    problem = coding_problems_db.get_problem(req.problemTitle)
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
        
    all_tests = problem.get("visible_test_cases", []) + problem.get("hidden_test_cases", [])
    if not all_tests:
        raise HTTPException(status_code=400, detail="No test cases found for problem")

    res = await _execute_tests(
        req.code, 
        req.language, 
        all_tests, 
        problem.get("time_limit", 2.0), 
        problem.get("memory_limit", 128000)
    )
    
    # AI Review if passed or mostly passed
    ai_feedback = ""
    if res["passed"]:
        review = await foundry_agent_service.review_code(
            problem_title=req.problemTitle,
            code=req.code,
            language=req.language
        )
        ai_feedback = f"Summary: {review.get('summary', '')}\nStyle: {review.get('style', '')}\nEfficiency: {review.get('efficiency', '')}"
    elif res["runtimeError"]:
        ai_feedback = "Your code encountered a runtime error. Check your base cases and bounds."
    else:
        ai_feedback = "Your code failed some test cases. Review the logic for edge cases."

    status_str = "passed" if res["passed"] else "failed"
    if res["compileError"]:
        status_str = "compile_error"
    elif res["runtimeError"]:
        status_str = "runtime_error"

    # Save to Supabase
    submission_data = {
        "problem_id": problem.get("problem_id", req.problemTitle),
        "problem_title": req.problemTitle,
        "language": req.language,
        "code": req.code,
        "status": status_str,
        "test_cases_passed": res["passedTests"],
        "total_test_cases": res["totalTests"],
        "ai_review": {"feedback": ai_feedback}
    }
    
    await supabase_service.save_coding_submission(current_user.get("id"), submission_data)
    
    # Strip hidden tests from results returned to client
    visible_results = [r for r in res["results"] if r.id in [t["id"] for t in problem.get("visible_test_cases", [])]]
    
    return CodeExecutionResponse(
        passed=res["passed"],
        totalTests=res["totalTests"],
        passedTests=res["passedTests"],
        runtimeMs=res["runtimeMs"],
        memoryMb=res["memoryMb"],
        results=visible_results,
        aiFeedback=ai_feedback,
        compileError=res["compileError"],
        runtimeError=res["runtimeError"],
        percentileScore=85.0 if res["passed"] else 0.0 # Mock percentile for now
    )
