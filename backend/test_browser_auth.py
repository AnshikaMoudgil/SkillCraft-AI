import asyncio
from azure.identity import InteractiveBrowserCredential

async def test_auth():
    print("Attempting to open browser for Azure Auth...")
    try:
        credential = InteractiveBrowserCredential()
        # To trigger the browser, we request a token for the standard Cognitive Services scope
        token = credential.get_token("https://cognitiveservices.azure.com/.default")
        print("Successfully obtained token!")
    except Exception as e:
        print(f"Failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_auth())
