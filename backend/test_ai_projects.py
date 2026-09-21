import os
import sys

try:
    from azure.ai.projects import AIProjectClient
    import inspect

    print("AIProjectClient init signature:")
    print(inspect.signature(AIProjectClient.__init__))
except ImportError as e:
    print(f"Error: {e}")
