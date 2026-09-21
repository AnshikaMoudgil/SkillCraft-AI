import os
import json
from dotenv import load_dotenv
from azure.ai.projects import AIProjectClient
from azure.core.credentials import AzureKeyCredential
from azure.identity import DefaultAzureCredential

load_dotenv()
endpoint = os.getenv("AZURE_FOUNDRY_ENDPOINT")
api_key = os.getenv("AZURE_FOUNDRY_API_KEY")

if api_key:
    cred = AzureKeyCredential(api_key)
else:
    cred = DefaultAzureCredential()

client = AIProjectClient(endpoint=endpoint, credential=cred)
openai_client = client.get_openai_client(agent_name="AI Interview Coach")

try:
    print("Creating response...")
    response = openai_client.responses.create(
        input="Say hello!"
    )
    print("Response type:", type(response))
    print("Response dir:", dir(response))
    # We will try to print its dict if it has one
    if hasattr(response, 'model_dump'):
        print("Model dump:", response.model_dump())
    elif hasattr(response, 'to_dict'):
        print("Dict:", response.to_dict())
    else:
        print("Content?", getattr(response, 'output', getattr(response, 'choices', getattr(response, 'message', None))))
except Exception as e:
    print(f"Error: {e}")
