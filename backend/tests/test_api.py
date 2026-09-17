"""Automated API test suite verifying all routes in the SkillCraftAI FastAPI backend."""
import sys
import os

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from starlette.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "online"
    assert "integrations" in data
    print("[PASS] Health endpoint passed")

def test_auth_me():
    res = client.get("/api/v1/auth/me")
    assert res.status_code == 200
    data = res.json()
    assert "name" in data
    assert "role" in data
    print("[PASS] Auth profile endpoint passed")

def test_coding_hint():
    res = client.post("/api/v1/coding/hint", json={
        "problemTitle": "Two Sum",
        "userCode": "function twoSum(nums, target) {}",
        "hintIndex": 0
    })
    assert res.status_code == 200
    data = res.json()
    assert "hint" in data
    print("[PASS] Coding hint endpoint passed (hint received)")

def test_coding_review():
    res = client.post("/api/v1/coding/review", json={
        "problemTitle": "Valid Parentheses",
        "code": "function isValid(s) { return true; }",
        "language": "javascript"
    })
    assert res.status_code == 200
    data = res.json()
    assert "summary" in data
    assert "style" in data
    print("[PASS] Coding review endpoint passed")

def test_coding_complexity():
    res = client.post("/api/v1/coding/complexity", json={
        "code": "for (let i = 0; i < n; i++) {}",
        "language": "javascript"
    })
    assert res.status_code == 200
    data = res.json()
    assert "timeComplexity" in data
    print("[PASS] Coding complexity endpoint passed:", data["timeComplexity"])

def test_interview_session():
    # 1. Start session
    start_res = client.post("/api/v1/interview/start", json={
        "title": "Senior Frontend Interview",
        "type": "technical",
        "role": "Senior Frontend Engineer",
        "difficulty": "Advanced"
    })
    assert start_res.status_code == 200
    start_data = start_res.json()
    session_id = start_data["sessionId"]
    assert session_id
    assert "firstQuestion" in start_data
    print("[PASS] Interview start passed:", start_data["firstQuestion"][:50], "...")

    # 2. Candidate response & follow-up
    respond_res = client.post("/api/v1/interview/respond", json={
        "sessionId": session_id,
        "question": start_data["firstQuestion"],
        "answer": "I use React.memo, useMemo, and avoid unnecessary re-renders using immutable state.",
        "topic": "React Performance"
    })
    assert respond_res.status_code == 200
    respond_data = respond_res.json()
    assert "feedback" in respond_data
    assert "followUp" in respond_data
    print("[PASS] Interview answer evaluation passed:", respond_data["feedback"][:50], "...")

    # 3. Overall evaluation
    eval_res = client.post("/api/v1/interview/evaluate", json={
        "sessionId": session_id,
        "transcripts": [
            {"sender": "ai", "text": start_data["firstQuestion"]},
            {"sender": "user", "text": "My answer..."}
        ]
    })
    assert eval_res.status_code == 200
    eval_data = eval_res.json()
    assert eval_data["overallScore"] > 0
    assert len(eval_data["communicationMetrics"]) > 0
    print("[PASS] Interview overall evaluation passed with score:", eval_data["overallScore"])

def test_voice_token():
    res = client.get("/api/v1/voice/token")
    assert res.status_code == 200
    data = res.json()
    assert "token" in data
    assert "region" in data
    print("[PASS] Azure Voice token vending passed")

def test_resume_upload():
    file_content = b"%PDF-1.4 Mock resume content for Alex Morgan, Software Engineer."
    files = {"file": ("alex_resume.pdf", file_content, "application/pdf")}
    res = client.post("/api/v1/resume/upload", files=files)
    assert res.status_code == 200
    data = res.json()
    assert data["fileName"] == "alex_resume.pdf"
    assert len(data["skills"]) > 0
    assert data["ragIndexed"] is True
    print("[PASS] Resume upload and RAG indexing passed:", data["skills"][:4])

if __name__ == "__main__":
    print("\n--- Running SkillCraftAI API Test Suite ---")
    test_health()
    test_auth_me()
    test_coding_hint()
    test_coding_review()
    test_coding_complexity()
    test_interview_session()
    test_voice_token()
    test_resume_upload()
    print("\n--- ALL BACKEND TESTS PASSED SUCCESSFULLY! ---\n")
