import os
from azure.ai.projects import AIProjectClient
from azure.core.credentials import AzureKeyCredential

client = AIProjectClient(
    endpoint="https://ai-interview-coach-resource.services.ai.azure.com/api/projects/ai-interview-coach",
    credential=AzureKeyCredential("fake")
)
openai_client = client.get_openai_client(agent_name="AI Interview Coach")

# To simulate what we would do:
# conv = openai_client.conversations.create()
# res = openai_client.responses.create(conversation={"id": conv.id}, input="Hello")
print("Done checking.")
