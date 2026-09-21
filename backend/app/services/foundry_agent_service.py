import json
from typing import Dict, Any, List, Tuple
from azure.ai.projects import AIProjectClient
from azure.identity import ChainedTokenCredential, AzureCliCredential, DeviceCodeCredential
from app.core.config import settings
from app.models.interview import GeneratePlanRequest

class FoundryAgentService:
    def __init__(self):
        self._client = None
        if settings.is_foundry_configured:
            try:
                from azure.identity import ClientSecretCredential
                
                credential = ClientSecretCredential(
                    tenant_id=settings.AZURE_TENANT_ID,
                    client_id=settings.AZURE_CLIENT_ID,
                    client_secret=settings.AZURE_CLIENT_SECRET,
                )
                
                project_client = AIProjectClient(
                    endpoint=settings.AZURE_FOUNDRY_ENDPOINT,
                    credential=credential
                )

                self._client = project_client.get_openai_client(
                    agent_name="AIInterviewCoach"
                )
            except Exception as e:
                print(f"[FoundryAgentService] Azure Foundry client warning: {e}")
                self._client = None

    @property
    def is_connected(self) -> bool:
        return self._client is not None

    async def _send_to_agent(self, prompt: str, conversation_id: str = None) -> Tuple[str, str]:
        if not self.is_connected:
            raise Exception("Azure Foundry client is not configured. Missing AZURE_FOUNDRY_ENDPOINT or API Key.")

        try:
            if not conversation_id:
                conv = self._client.conversations.create()
                conversation_id = conv.id

            response = self._client.responses.create(
                conversation={"id": conversation_id},
                input=prompt
            )

            # Safely extract response text based on the Azure Agents SDK object
            reply = None
            if hasattr(response, 'output') and isinstance(response.output, list):
                for out_item in reversed(response.output):
                    if getattr(out_item, 'type', None) == 'message':
                        content_list = getattr(out_item, 'content', [])
                        for c in content_list:
                            if getattr(c, 'type', None) == 'output_text':
                                reply = getattr(c, 'text', "")
                                break
                    if reply:
                        break
                        
            if reply is None:
                # Fallback if the object structure changes
                if hasattr(response, 'model_dump'):
                    reply = str(response.model_dump())
                else:
                    reply = str(response)

            return str(reply), conversation_id
        except Exception as e:
            print(f"[FoundryAgentService] Agent interaction error: {e}")
            raise Exception(f"Azure Foundry agent interaction failed: {str(e)}")

    def _extract_json(self, text: str) -> Dict[str, Any]:
        """Helper to extract JSON from markdown code blocks if the agent wraps it."""
        text = text.strip()
        if text.startswith("```json"):
            text = text[7:]
        elif text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        
        text = text.strip()
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            # Fallback: try to find the first { and last }
            import re
            match = re.search(r'\{.*\}', text, re.DOTALL)
            if match:
                try:
                    return json.loads(match.group(0))
                except json.JSONDecodeError:
                    pass
            raise ValueError(f"Failed to parse JSON from AI output: {text}")

    async def generate_interview_plan(self, req: GeneratePlanRequest) -> Dict[str, Any]:
        prompt = (
            f"You are an expert AI Interview Coach preparing an interview plan.\n"
            f"Generate a structured interview plan for this session:\n"
            f"- Role: {req.role}\n"
            f"- Type: {req.type}\n"
            f"- Difficulty: {req.difficulty}\n"
            f"- Questions: {req.number_of_questions}\n"
            f"- Experience Level: {req.experience_level}\n"
            f"- Focus Areas: {', '.join(req.focus_areas) if req.focus_areas else 'General'}\n"
            f"- Language: {req.programming_language}\n"
            f"- Resume Context: {req.resumeContext}\n\n"
            f"Return ONLY valid JSON strictly adhering to this schema:\n"
            f"{{\n"
            f'  "interview_goal": "...",\n'
            f'  "role": "...",\n'
            f'  "difficulty": "...",\n'
            f'  "estimated_duration": 30,\n'
            f'  "total_questions": {req.number_of_questions},\n'
            f'  "categories": [ {{"name": "...", "count": 1}} ],\n'
            f'  "difficulty_progression": ["Medium", "Hard"],\n'
            f'  "adaptive_strategy": ["..."]\n'
            f"}}\n"
            f"No markdown blocks, just raw JSON."
        )
        reply, _ = await self._send_to_agent(prompt)
        return self._extract_json(reply)

    async def generate_first_question(
        self, role: str, difficulty: str, interview_type: str = "technical",
        experience_level: str = "Fresher", focus_areas: List[str] = None, 
        programming_language: str = None, rag_context: str = ""
    ) -> Tuple[Dict[str, str], str]:
        
        focus_str = f"Focus areas: {', '.join(focus_areas)}" if focus_areas else ""
        lang_str = f"Programming Language: {programming_language}" if programming_language else ""

        prompt = (
            f"Please generate the opening interview question for a {difficulty}-level {role} role.\n"
            f"Interview Type: {interview_type}\n"
            f"Candidate Experience Level: {experience_level}\n"
            f"{focus_str}\n{lang_str}\n\n"
            f"Return ONLY valid JSON with keys: 'greeting', 'firstQuestion', and 'topic'.\n"
            f"Context:\n{rag_context}"
        )
        reply, conv_id = await self._send_to_agent(prompt)
        return self._extract_json(reply), conv_id

    async def evaluate_answer_and_followup(
        self, question: str, answer: str, topic: str, rag_context: str = "", conversation_id: str = None, 
        generated_plan: Dict[str, Any] = None, previous_evaluations: List[Dict] = None
    ) -> Tuple[Dict[str, Any], str]:
        plan_str = f"Target Interview Plan:\n{json.dumps(generated_plan, indent=2)}\n\n" if generated_plan else ""
        prev_str = f"Previous Evaluations:\n{json.dumps(previous_evaluations, indent=2)}\n\n" if previous_evaluations else ""
        
        prompt = (
            f"{plan_str}{prev_str}"
            f"Topic: {topic}\nQuestion: {question}\nCandidate Answer: {answer}\n\n"
            f"Evaluate the candidate's answer and adaptively generate the next follow-up question based on their performance and the overall interview plan.\n"
            f"Context:\n{rag_context}\n\n"
            f"Return ONLY valid JSON with keys: 'score' (0-100), 'feedback', 'followUp', 'sentiment' (positive/neutral/negative), 'clarityScore' (0-100)."
        )
        reply, returned_conv_id = await self._send_to_agent(prompt, conversation_id)
        return self._extract_json(reply), returned_conv_id

    async def generate_hint(self, problem_title: str, user_code: str, hint_index: int = 0) -> str:
        prompt = (
            f"The user is solving '{problem_title}'. Here is their current code:\n"
            f"```\n{user_code}\n```\n"
            f"They need hint #{hint_index + 1}. Provide a short, progressive hint that DOES NOT spoil the exact solution. Just guide them."
        )
        reply, _ = await self._send_to_agent(prompt)
        return reply.strip()

    async def review_code(self, problem_title: str, code: str, language: str = "javascript") -> Dict[str, str]:
        prompt = (
            f"Review this {language} code for '{problem_title}':\n```\n{code}\n```\n"
            f"Return ONLY valid JSON with keys: 'summary', 'style', 'efficiency', 'cleanliness'."
        )
        reply, _ = await self._send_to_agent(prompt)
        return self._extract_json(reply)

    async def analyze_complexity(self, code: str, language: str = "javascript") -> Dict[str, str]:
        prompt = (
            f"Analyze the Big-O complexity of this {language} code:\n```\n{code}\n```\n"
            f"Return ONLY valid JSON with keys: 'timeComplexity', 'spaceComplexity', 'breakdown'."
        )
        reply, _ = await self._send_to_agent(prompt)
        return self._extract_json(reply)

    async def generate_final_report(self, transcripts: List[Dict[str, Any]], generated_plan: Dict[str, Any] = None) -> Dict[str, Any]:
        plan_str = f"Original Plan:\n{json.dumps(generated_plan, indent=2)}\n\n" if generated_plan else ""
        prompt = (
            f"{plan_str}Analyze this entire interview transcript:\n{json.dumps(transcripts, indent=2)}\n\n"
            f"Return ONLY valid JSON strictly adhering to this schema:\n"
            f"{{\n"
            f'  "overallScore": 85,\n'
            f'  "technicalScore": 80,\n'
            f'  "problemSolvingScore": 90,\n'
            f'  "communicationScore": 85,\n'
            f'  "summary": "...",\n'
            f'  "strengths": ["..."],\n'
            f'  "improvements": ["..."],\n'
            f'  "topicsToPractice": ["..."],\n'
            f'  "communicationMetrics": [ {{"label": "...", "status": "...", "score": 90, "description": "..."}} ],\n'
            f'  "preparationPlan": [ {{"day": "Day 1", "topic": "...", "action": "..."}} ]\n'
            f"}}\n"
        )
        reply, _ = await self._send_to_agent(prompt)
        return self._extract_json(reply)

foundry_agent_service = FoundryAgentService()
