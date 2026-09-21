import os
from azure.ai.projects import AIProjectClient
from azure.core.credentials import AzureKeyCredential
import inspect

client = AIProjectClient(
    endpoint="https://ai-interview-coach-resource.services.ai.azure.com/api/projects/ai-interview-coach",
    credential=AzureKeyCredential("fake")
)
openai_client = client.get_openai_client(agent_name="AI Interview Coach")

try:
    print("conversations.create signature:")
    print(inspect.signature(openai_client.conversations.create))
    print("responses.create signature:")
    print(inspect.signature(openai_client.responses.create))
    print("conversations.messages.create signature:")
    print(inspect.signature(openai_client.conversations.messages.create))
except Exception as e:
    print(f"Error: {e}")
