import os
from azure.ai.projects import AIProjectClient
from azure.core.credentials import AzureKeyCredential

client = AIProjectClient(
    endpoint="https://ai-interview-coach-resource.services.ai.azure.com/api/projects/ai-interview-coach",
    credential=AzureKeyCredential("fake")
)
print("Client properties:")
print(dir(client))
