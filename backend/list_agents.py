import asyncio
from azure.identity import InteractiveBrowserCredential
from azure.ai.projects import AIProjectClient
import os
from dotenv import load_dotenv

load_dotenv()

async def list_agents():
    endpoint = os.getenv("AZURE_FOUNDRY_ENDPOINT")
    print(f"Connecting to: {endpoint}")
    
    credential = InteractiveBrowserCredential(tenant_id="bfb666a5-330a-49b1-884a-70ad7b8c97ea")
    client = AIProjectClient(
        endpoint=endpoint,
        credential=credential
    )
    
    print("\nFetching agents...")
    try:
        agents = client.agents.list()
        print("\n--- AVAILABLE AGENTS ---")
        has_agents = False
        for agent in agents:
            has_agents = True
            print(f"Name (Display): {agent.name}")
            print(f"ID (Programmatic): {agent.id}")
            print("------------------------")
        if not has_agents:
            print("No agents found in this project!")
    except Exception as e:
        print(f"Failed to list agents: {e}")

if __name__ == "__main__":
    asyncio.run(list_agents())
