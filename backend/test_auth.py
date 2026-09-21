import os
import asyncio
from dotenv import load_dotenv
from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential

load_dotenv()
endpoint = os.getenv("AZURE_FOUNDRY_ENDPOINT")
key = os.getenv("AZURE_FOUNDRY_API_KEY")

async def test_run():
    print(f"Connecting to Endpoint: {endpoint}")
    try:
        # Exactly how foundry_agent_service works now:
        credential = DefaultAzureCredential()
        client = AIProjectClient(
            endpoint=endpoint,
            credential=credential
        )
        
        # Override the api_key for the inner OpenAI client
        openai_client = client.get_openai_client(
            agent_name="AI Interview Coach",
            api_key=key
        )
        print("Instantiated clients. Making a request...")
        
        # Test conversation creation
        conv = openai_client.conversations.create()
        print(f"Created conversation: {conv.id}")
        
    except Exception as e:
        print(f"FAILED: {e}")

if __name__ == "__main__":
    asyncio.run(test_run())
