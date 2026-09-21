import os
import asyncio
from dotenv import load_dotenv

load_dotenv(".env")
tenant_id = os.environ.get("AZURE_TENANT_ID")
client_id = os.environ.get("AZURE_CLIENT_ID")
client_secret = os.environ.get("AZURE_CLIENT_SECRET")
endpoint = os.environ.get("AZURE_FOUNDRY_ENDPOINT")

from azure.identity import ClientSecretCredential
from azure.ai.projects import AIProjectClient

def main():
    credential = ClientSecretCredential(
        tenant_id=tenant_id,
        client_id=client_id,
        client_secret=client_secret
    )
    
    project_client = AIProjectClient(
        endpoint=endpoint,
        credential=credential
    )
    
    print("Listing agents in project...")
    agents = project_client.agents.list()
    for agent in agents.data:
        print(f"Agent ID (Name): {agent.id}")
        print(f"Display Name: {getattr(agent, 'name', 'N/A')}")
        print("---")

if __name__ == "__main__":
    main()
