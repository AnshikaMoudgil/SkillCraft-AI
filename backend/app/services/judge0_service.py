import httpx
from typing import Dict, Any, List, Optional
from app.core.config import settings

class Judge0Service:
    def __init__(self):
        self.base_url = settings.JUDGE0_URL
        self.language_map = {
            "Python 3": 92,
            "Python": 92,
            "Java": 96,
            "C++": 76,
            "cpp": 76
        }

    def _get_language_id(self, language: str) -> int:
        return self.language_map.get(language, 92)  # Default to Python 3 if not found

    async def execute_code(
        self,
        source_code: str,
        language: str,
        stdin: str = "",
        expected_output: str = "",
        cpu_time_limit: float = 2.0,
        memory_limit: int = 128000 # KB
    ) -> Dict[str, Any]:
        
        language_id = self._get_language_id(language)
        
        payload = {
            "source_code": source_code,
            "language_id": language_id,
            "stdin": stdin,
            "expected_output": expected_output,
            "cpu_time_limit": cpu_time_limit,
            "memory_limit": memory_limit
        }
        
        headers = {
            "Content-Type": "application/json"
        }
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{self.base_url}/submissions?wait=true",
                    json=payload,
                    headers=headers,
                    timeout=30.0 # Wait for submission
                )
                response.raise_for_status()
                result = response.json()
                
                # Parse Judge0 status
                status_id = result.get("status", {}).get("id", 0)
                status_description = result.get("status", {}).get("description", "Unknown")
                
                output = (result.get("stdout") or "").strip()
                compile_error = (result.get("compile_output") or "").strip() or None
                runtime_error = (result.get("stderr") or "").strip() or None
                if result.get("message"):
                    if not runtime_error:
                        runtime_error = result.get("message").strip()
                    else:
                        runtime_error += "\n" + result.get("message").strip()
                
                time_taken = float(result.get("time") or 0.0)
                memory_used = int(result.get("memory") or 0) # in KB
                memory_mb = memory_used / 1024.0
                
                passed = False
                if status_id == 3: # Accepted
                    passed = True
                
                return {
                    "status_id": status_id,
                    "status_description": status_description,
                    "passed": passed,
                    "output": output,
                    "expected_output": expected_output,
                    "compile_error": compile_error,
                    "runtime_error": runtime_error,
                    "execution_time": time_taken,
                    "memory": memory_mb
                }
            except Exception as e:
                print(f"[Judge0Service] Error executing code: {e}")
                return {
                    "status_id": 0,
                    "status_description": "Internal Error",
                    "passed": False,
                    "output": "",
                    "expected_output": expected_output,
                    "compile_error": None,
                    "runtime_error": f"Code execution service is temporarily unavailable.\n{str(e)}",
                    "execution_time": 0.0,
                    "memory": 0.0
                }

judge0_service = Judge0Service()
