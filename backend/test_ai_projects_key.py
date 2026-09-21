import os
import sys

try:
    from azure.ai.projects import AIProjectClient
    from azure.core.credentials import AzureKeyCredential

    conn_str = "https://ai-interview-coach-resource.services.ai.azure.com/api/projects/ai-interview-coach"
    try:
        # Some clients allow AzureKeyCredential
        client = AIProjectClient.from_connection_string(
            conn_str=conn_str,
            credential=AzureKeyCredential("fake-key")
        )
        print("Success with AzureKeyCredential and from_connection_string")
    except Exception as e:
        print(f"Error with from_connection_string + Key: {e}")
        
    try:
        # direct init?
        client = AIProjectClient(
            endpoint=conn_str,
            credential=AzureKeyCredential("fake-key")
        )
        print("Success with direct init + Key")
    except Exception as e:
        print(f"Error with direct init + Key: {e}")

except ImportError as e:
    print(f"Import Error: {e}")
