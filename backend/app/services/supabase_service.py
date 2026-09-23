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

        user_interviews = [iv for iv in self._mock_interviews.values() if iv.get("user_id") == user_id]
        scores = [iv.get("score", 0) for iv in user_interviews if iv.get("score")]
        avg_score = round(sum(scores) / len(scores)) if scores else 0

        return self._mock_profiles.get(user_id, {
            "id": user_id,
            "name": "Candidate",
            "role": "Candidate",
            "overallScore": avg_score,
            "scoreChange": 0,
            "interviewsCompleted": len(user_interviews),
            "codingStreak": len(user_interviews),
            "skills": ["Algorithms", "Data Structures", "System Design"],
            "email": "candidate@skillcraft.ai"
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
        session_id = session_data.get("id") or str(uuid.uuid4())
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

    async def get_interview(self, session_id: str) -> Dict[str, Any]:
        if self._client:
            try:
                res = self._client.table("interviews").select("*").eq("id", session_id).single().execute()
                if res.data:
                    return res.data
            except Exception as e:
                print(f"[SupabaseService] get_interview error: {e}")

        return self._mock_interviews.get(session_id, {})

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

    async def get_transcripts(self, session_id: str) -> List[Dict[str, Any]]:
        if self._client:
            try:
                res = self._client.table("interview_transcripts").select("*").eq("interview_id", session_id).order("created_at").execute()
                if res.data:
                    return res.data
                return []
            except Exception as e:
                print(f"[SupabaseService] get_transcripts error: {e}")

        return self._mock_transcripts.get(session_id, [])

    async def update_interview_evaluation(self, session_id: str, eval_data: Dict[str, Any]) -> Dict[str, Any]:
        # Strip invalid columns for Supabase schema
        clean_eval = dict(eval_data)
        clean_eval.pop("topicsToPractice", None)

        if self._client:
            try:
                res = self._client.table("interviews").update(clean_eval).eq("id", session_id).execute()
                if res.data:
                    return res.data[0]
            except Exception as e:
                print(f"[SupabaseService] update_interview_evaluation error: {e}")

        if session_id in self._mock_interviews:
            self._mock_interviews[session_id].update(eval_data)
            return self._mock_interviews[session_id]
        return eval_data

    async def save_coding_submission(self, user_id: str, submission_data: Dict[str, Any]) -> Dict[str, Any]:
        submission_id = str(uuid.uuid4())
        submission_data["id"] = submission_id
        submission_data["user_id"] = user_id

        if self._client:
            try:
                res = self._client.table("coding_submissions").insert(submission_data).execute()
                if res.data:
                    return res.data[0]
            except Exception as e:
                print(f"[SupabaseService] save_coding_submission error: {e}")

        # In-memory fallback
        if not hasattr(self, '_mock_submissions'):
            self._mock_submissions = {}
        self._mock_submissions[submission_id] = submission_data
        return submission_data

    async def get_recent_interviews(self, user_id: str, limit: int = 5) -> List[Dict[str, Any]]:
        if self._client:
            try:
                res = self._client.table("interviews").select("*").eq("user_id", user_id).order("started_at", desc=True).limit(limit).execute()
                if res.data:
                    return res.data
                return []
            except Exception as e:
                print(f"[SupabaseService] get_recent_interviews error: {e}")

        # In-memory fallback
        interviews = [v for v in self._mock_interviews.values() if v.get("user_id") == user_id]
        # sort by created_at missing, but fallback shouldn't happen much
        return interviews[:limit]

    async def update_profile(self, user_id: str, profile_data: Dict[str, Any]) -> None:
        if self._client:
            try:
                self._client.table("profiles").update(profile_data).eq("id", user_id).execute()
            except Exception as e:
                print(f"[SupabaseService] update_profile error: {e}")

    async def get_recent_resumes(self, user_id: str, limit: int = 5) -> List[Dict[str, Any]]:
        if self._client:
            try:
                res = self._client.table("resumes").select("*").eq("user_id", user_id).order("created_at", desc=True).limit(limit).execute()
                if res.data:
                    return res.data
                return []
            except Exception as e:
                print(f"[SupabaseService] get_recent_resumes error: {e}")

        # In-memory fallback
        resumes = [v for v in self._mock_resumes.values() if v.get("user_id") == user_id]
        return resumes[:limit]

supabase_service = SupabaseService()
