import os
import asyncio
import sys

# Set env before imports
if not os.environ.get("AZURE_FOUNDRY_ENDPOINT"):
    os.environ["AZURE_FOUNDRY_ENDPOINT"] = "https://ai-interview-coach-resource.services.ai.azure.com/api/projects/ai-interview-coach"

# Add the backend directory to python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.services.foundry_agent_service import foundry_agent_service

async def run_test():
    print("Directly testing foundry_agent_service.generate_hint...")
    try:
        hint = await foundry_agent_service.generate_hint(
            problem_title="Two Sum",
            user_code="def twoSum(nums, target):\n    return []",
            hint_index=0
        )
        print("Response from Agent:")
        print(hint)
        print("TEST PASSED: Reached Foundry Agent successfully.")
    except Exception as e:
        print("Error Response:")
        print(e)
        print("TEST FAILED.")

if __name__ == "__main__":
    asyncio.run(run_test())
