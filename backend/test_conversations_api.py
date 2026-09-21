import os
from azure.ai.projects import AIProjectClient
from azure.core.credentials import AzureKeyCredential

try:
    client = AIProjectClient(
        endpoint="https://ai-interview-coach-resource.services.ai.azure.com/api/projects/ai-interview-coach",
        credential=AzureKeyCredential("fake")
    )
    openai_client = client.get_openai_client(agent_name="AI Interview Coach")
    print("Does openai_client have 'conversations'?", hasattr(openai_client, "conversations"))
    print("Does openai_client have 'responses'?", hasattr(openai_client, "responses"))
    print("openai_client methods:", [m for m in dir(openai_client) if not m.startswith("_")])
except Exception as e:
    print(f"Error: {e}")
