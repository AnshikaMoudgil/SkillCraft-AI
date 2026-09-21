import os
from azure.ai.projects import AIProjectClient
from azure.core.credentials import AzureKeyCredential

client = AIProjectClient(
    endpoint="https://ai-interview-coach-resource.services.ai.azure.com/api/projects/ai-interview-coach",
    credential=AzureKeyCredential("fake")
)
try:
    openai_client = client.get_openai_client()
    print("OpenAI client type:", type(openai_client))
    print("Does it have beta.assistants?", hasattr(openai_client, "beta") and hasattr(openai_client.beta, "assistants"))
except Exception as e:
    print(f"Error: {e}")
