import os
from azure.ai.projects import AIProjectClient
from azure.core.credentials import AzureKeyCredential
import inspect

print("AIProjectClient properties:")
print(dir(AIProjectClient))
