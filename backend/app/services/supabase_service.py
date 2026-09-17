from typing import Optional, Dict, Any, List
import uuid
from app.core.config import settings

class SupabaseService:
    def __init__(self):
        self._client = None
        if settings.is_supabase_configured:
            try:
                from supabase import create_client, Client
                key = settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_KEY
                self._client: Optional[Client] = create_client(settings.SUPABASE_URL, key)
            except Exception as e:
                print(f"[SupabaseService] Initialization warning: {e}. Falling back to in-memory mode.")
                self._client = None

        # In-memory mock storage fallback for local dev
        self._mock_profiles = {}
        self._mock_resumes = {}
        self._mock_interviews = {}
        self._mock_transcripts = {}

    @property
    def is_connected(self) -> bool:
        return self._client is not None

    async def get_profile(self, user_id: str) -> Dict[str, Any]:
        if self._client:
            try:
                res = self._client.table("profiles").select("*").eq("id", user_id).single().execute()
                if res.data:
                    return res.data
            except Exception as e:
                print(f"[SupabaseService] get_profile error: {e}")

        return self._mock_profiles.get(user_id, {
            "id": user_id,
            "name": "Alex Morgan",
            "role": "Full Stack Developer",
            "overallScore": 84,
            "scoreChange": 6,
            "interviewsCompleted": 12,
            "codingStreak": 7,
            "skills": ["React", "TypeScript", "Node.js", "Python", "System Design"],
            "email": "alex.morgan@example.com"
        })

    async def update_profile(self, user_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
        if self._client:
            try:
                res = self._client.table("profiles").update(updates).eq("id", user_id).execute()
                if res.data:
                    return res.data[0]
            except Exception as e:
                print(f"[SupabaseService] update_profile error: {e}")

        current = await self.get_profile(user_id)
        current.update(updates)
        self._mock_profiles[user_id] = current
        return current

    async def upload_resume_file(self, user_id: str, file_name: str, file_bytes: bytes, content_type: str = "application/pdf") -> str:
        storage_path = f"{user_id}/{uuid.uuid4()}_{file_name}"
        if self._client:
            try:
                bucket = settings.SUPABASE_STORAGE_BUCKET_RESUMES
                self._client.storage.from_(bucket).upload(
                    path=storage_path,
                    file=file_bytes,
                    file_options={"content-type": content_type}
                )
                return storage_path
            except Exception as e:
                print(f"[SupabaseService] upload_resume_file error: {e}")

        return f"mock_storage/{storage_path}"

    async def save_resume_record(self, user_id: str, record: Dict[str, Any]) -> Dict[str, Any]:
        record_id = str(uuid.uuid4())
        record["id"] = record_id
        record["user_id"] = user_id

        if self._client:
            try:
                res = self._client.table("resumes").insert(record).execute()
                if res.data:
                    return res.data[0]
            except Exception as e:
                print(f"[SupabaseService] save_resume_record error: {e}")

        self._mock_resumes[record_id] = record
        return record

    async def create_interview(self, user_id: str, session_data: Dict[str, Any]) -> Dict[str, Any]:
        session_id = str(uuid.uuid4())
        session_data["id"] = session_id
        session_data["user_id"] = user_id

        if self._client:
            try:
                res = self._client.table("interviews").insert(session_data).execute()
                if res.data:
                    return res.data[0]
            except Exception as e:
                print(f"[SupabaseService] create_interview error: {e}")

        self._mock_interviews[session_id] = session_data
        return session_data

    async def append_transcript(self, interview_id: str, turn: Dict[str, Any]) -> Dict[str, Any]:
        turn_id = str(uuid.uuid4())
        turn["id"] = turn_id
        turn["interview_id"] = interview_id

        if self._client:
            try:
                res = self._client.table("interview_transcripts").insert(turn).execute()
                if res.data:
                    return res.data[0]
            except Exception as e:
                print(f"[SupabaseService] append_transcript error: {e}")

        if interview_id not in self._mock_transcripts:
            self._mock_transcripts[interview_id] = []
        self._mock_transcripts[interview_id].append(turn)
        return turn

    async def update_interview_evaluation(self, session_id: str, eval_data: Dict[str, Any]) -> Dict[str, Any]:
        if self._client:
            try:
                res = self._client.table("interviews").update(eval_data).eq("id", session_id).execute()
                if res.data:
                    return res.data[0]
            except Exception as e:
                print(f"[SupabaseService] update_interview_evaluation error: {e}")

        if session_id in self._mock_interviews:
            self._mock_interviews[session_id].update(eval_data)
            return self._mock_interviews[session_id]
        return eval_data

supabase_service = SupabaseService()
