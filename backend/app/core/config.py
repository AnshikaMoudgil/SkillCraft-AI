from typing import List, Union
from pydantic_settings import BaseSettings, SettingsConfigDict
import os

class Settings(BaseSettings):
    # App Settings
    APP_NAME: str = "SkillCraftAI API"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    CORS_ORIGINS: Union[str, List[str]] = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000"

    # Supabase (PostgreSQL, Auth & Storage)
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    SUPABASE_JWT_SECRET: str = ""
    SUPABASE_STORAGE_BUCKET_RESUMES: str = "resumes"

    # Microsoft Foundry & Agent Service
    AZURE_FOUNDRY_ENDPOINT: str = ""
    AZURE_FOUNDRY_API_KEY: str = ""
    AZURE_TENANT_ID: str = ""
    AZURE_CLIENT_ID: str = ""
    AZURE_CLIENT_SECRET: str = ""
    AZURE_FOUNDRY_PROJECT_CONNECTION_STRING: str = ""
    AZURE_OPENAI_DEPLOYMENT_NAME: str = "gpt-4o"
    AZURE_OPENAI_API_VERSION: str = "2024-05-01-preview"

    # Azure AI Search (RAG)
    AZURE_SEARCH_ENDPOINT: str = ""
    AZURE_SEARCH_KEY: str = ""
    AZURE_SEARCH_INDEX_NAME: str = "skillcraft-rag-index"
    AZURE_OPENAI_EMBEDDING_DEPLOYMENT: str = "text-embedding-3-small"

    # Azure AI Speech (Voice: STT & TTS)
    AZURE_SPEECH_KEY: str = ""
    AZURE_SPEECH_REGION: str = "eastus"
    AZURE_SPEECH_VOICE_NAME: str = "en-US-JennyNeural"
    
    # Judge0
    JUDGE0_URL: str = "https://ce.judge0.com"
    # JUDGE0_API_KEY: str = ""  # Not needed for public CE, but good to have in config

    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def cors_origins_list(self) -> List[str]:
        if isinstance(self.CORS_ORIGINS, str):
            return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]
        elif isinstance(self.CORS_ORIGINS, (list, tuple)):
            return list(self.CORS_ORIGINS)
        return ["*"]

    @property
    def is_supabase_configured(self) -> bool:
        return bool(self.SUPABASE_URL and self.SUPABASE_KEY and "your-project-id" not in self.SUPABASE_URL)

    @property
    def is_foundry_configured(self) -> bool:
        return bool(self.AZURE_FOUNDRY_ENDPOINT)

    @property
    def is_search_configured(self) -> bool:
        return bool(self.AZURE_SEARCH_ENDPOINT and self.AZURE_SEARCH_KEY)

    @property
    def is_speech_configured(self) -> bool:
        return bool(self.AZURE_SPEECH_KEY and self.AZURE_SPEECH_REGION)

settings = Settings()
