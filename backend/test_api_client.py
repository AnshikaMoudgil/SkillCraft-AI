import os
import sys

# Set environment before any imports from app
if not os.environ.get("AZURE_FOUNDRY_ENDPOINT"):
    os.environ["AZURE_FOUNDRY_ENDPOINT"] = "https://ai-interview-coach-resource.services.ai.azure.com/api/projects/ai-interview-coach"

# Ensure we're hitting the new pattern via auth override
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from app.main import app
from app.core.auth import get_current_user

def mock_get_current_user():
    return {"id": "test-user", "email": "test@example.com"}

app.dependency_overrides[get_current_user] = mock_get_current_user

client = TestClient(app)

print("Sending POST request to /api/v1/coding/hint...")
response = client.post(
    "/api/v1/coding/hint",
    json={
        "problemTitle": "Two Sum",
        "userCode": "def twoSum(nums, target):\n    return []",
        "hintIndex": 0
    }
)
print(f"Status Code: {response.status_code}")
if response.status_code == 200:
    print("Response JSON:")
    print(response.json())
    print("TEST PASSED: Reached Foundry Agent successfully.")
else:
    print("Error Response:")
    print(response.text)
    print("TEST FAILED.")
