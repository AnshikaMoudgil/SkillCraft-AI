import os
from azure.ai.projects import AIProjectClient
from azure.core.credentials import AzureKeyCredential

client = AIProjectClient(
    endpoint="https://ai-interview-coach-resource.services.ai.azure.com/api/projects/ai-interview-coach",
    credential=AzureKeyCredential("fake")
)
print("Does client have threads?")
print(hasattr(client, "threads"))
if hasattr(client, "agents"):
    print("Agent methods:")
    print([m for m in dir(client.agents) if not m.startswith("_")])
