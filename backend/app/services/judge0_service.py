import asyncio
import tempfile
import os
import sys
import time
from typing import Dict, Any

class Judge0Service:
    def __init__(self):
        pass

    async def execute_code(
        self,
        source_code: str,
        language: str,
        stdin: str = "",
        expected_output: str = "",
        cpu_time_limit: float = 2.0,
        memory_limit: int = 128000 # KB
    ) -> Dict[str, Any]:
        
        # Check if the code is just the default starter code
        is_starter = "Your code here" in source_code or len(source_code.strip()) < 50
        if is_starter:
            return {
                "status_id": 4,
                "status_description": "Wrong Answer",
                "passed": False,
                "output": "",
                "expected_output": expected_output,
                "compile_error": None,
                "runtime_error": None,
                "execution_time": 0.01,
                "memory": 8.0
            }

        ext = ".py" if language.lower() == "python" else ".js" if language.lower() in ["javascript", "js"] else ".txt"
        if ext == ".txt":
            # Unsupported language fallback
            return {
                "status_id": 4, "status_description": "Unsupported language", "passed": False,
                "output": "Language not supported in local sandbox", "expected_output": expected_output,
                "compile_error": "Language not supported", "runtime_error": None,
                "execution_time": 0.0, "memory": 0.0
            }

        # Write source code to temp file
        with tempfile.NamedTemporaryFile(suffix=ext, mode='w', delete=False) as f:
            f.write(source_code)
            temp_file = f.name

        try:
            cmd = [sys.executable, temp_file] if ext == ".py" else ["node", temp_file]
            
            start_time = time.time()
            
            process = await asyncio.create_subprocess_exec(
                *cmd,
                stdin=asyncio.subprocess.PIPE,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            
            try:
                stdout, stderr = await asyncio.wait_for(
                    process.communicate(input=stdin.encode()),
                    timeout=cpu_time_limit
                )
                
                execution_time = time.time() - start_time
                out_str = stdout.decode().strip()
                err_str = stderr.decode().strip()
                
                passed = (out_str == expected_output.strip())
                
                if process.returncode != 0:
                    return {
                        "status_id": 11,
                        "status_description": "Runtime Error",
                        "passed": False,
                        "output": out_str,
                        "expected_output": expected_output,
                        "compile_error": None,
                        "runtime_error": err_str,
                        "execution_time": execution_time,
                        "memory": 10.0
                    }
                
                return {
                    "status_id": 3 if passed else 4,
                    "status_description": "Accepted" if passed else "Wrong Answer",
                    "passed": passed,
                    "output": out_str,
                    "expected_output": expected_output,
                    "compile_error": None,
                    "runtime_error": None,
                    "execution_time": execution_time,
                    "memory": 10.0
                }
                
            except asyncio.TimeoutError:
                process.kill()
                return {
                    "status_id": 5,
                    "status_description": "Time Limit Exceeded",
                    "passed": False,
                    "output": "",
                    "expected_output": expected_output,
                    "compile_error": None,
                    "runtime_error": "Time limit exceeded",
                    "execution_time": cpu_time_limit,
                    "memory": 10.0
                }
                
        finally:
            if os.path.exists(temp_file):
                os.remove(temp_file)

judge0_service = Judge0Service()
