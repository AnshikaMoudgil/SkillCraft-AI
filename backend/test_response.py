import asyncio
from azure.identity import InteractiveBrowserCredential
from azure.ai.projects import AIProjectClient
import os
from dotenv import load_dotenv

load_dotenv()

async def test_response():
    endpoint = os.getenv("AZURE_FOUNDRY_ENDPOINT")
    
    credential = InteractiveBrowserCredential(tenant_id="bfb666a5-330a-49b1-884a-70ad7b8c97ea")
    client = AIProjectClient(
        endpoint=endpoint,
        credential=credential
    )
    
    openai_client = client.get_openai_client(agent_name="AIInterviewCoach")
    
    print("Creating conversation...")
    conv = openai_client.conversations.create()
    
    print("Creating response...")
    response = openai_client.responses.create(
        conversation={"id": conv.id},
        input="Hello, can you give me a test message?"
    )
    
    print("\n--- RESPONSE TYPE ---")
    print(type(response))
    
    print("\n--- RESPONSE ATTRIBUTES ---")
    print(dir(response))
    
    print("\n--- RESPONSE DUMP ---")
    if hasattr(response, 'model_dump'):
        print(response.model_dump())
    elif hasattr(response, '__dict__'):
        print(response.__dict__)
    else:
        print(response)

if __name__ == "__main__":
    asyncio.run(test_response())
