from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from typing import Dict, Any
import datetime
from app.core.auth import get_current_user
from app.models.resume import ResumeParsedData, ResumeProject
from app.services.supabase_service import supabase_service
from app.services.rag_service import rag_service

router = APIRouter(prefix="/resume", tags=["Resume & RAG Pipeline"])

@router.post("/upload", response_model=ResumeParsedData)
async def upload_and_process_resume(
    file: UploadFile = File(...),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Ingests candidate resume:
    1. Uploads file to Supabase Storage ('resumes' bucket).
    2. Extracts text & structured profile attributes.
    3. Indexes semantic sections into Azure AI Search RAG index.
    4. Records metadata in Supabase PostgreSQL 'resumes' table.
    """
    user_id = current_user["id"]
    file_bytes = await file.read()
    file_size_kb = len(file_bytes) / 1024
    file_size_str = f"{file_size_kb:.1f} KB" if file_size_kb < 1024 else f"{file_size_kb/1024:.1f} MB"

    # 1. Upload to Supabase Storage
    storage_path = await supabase_service.upload_resume_file(
        user_id=user_id,
        file_name=file.filename or "resume.pdf",
        file_bytes=file_bytes,
        content_type=file.content_type or "application/pdf"
    )

    from app.core.config import settings
    from azure.core.credentials import AzureKeyCredential
    from azure.ai.documentintelligence import DocumentIntelligenceClient
    from app.services.foundry_agent_service import foundry_agent_service

    if not settings.AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT or not settings.AZURE_DOCUMENT_INTELLIGENCE_KEY:
        raise HTTPException(status_code=500, detail="Azure Document Intelligence is not configured")

    client = DocumentIntelligenceClient(
        endpoint=settings.AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT,
        credential=AzureKeyCredential(settings.AZURE_DOCUMENT_INTELLIGENCE_KEY)
    )

    try:
        # 2. Extract text with Azure AI Document Intelligence
        poller = client.begin_analyze_document(
            "prebuilt-layout", 
            body=file_bytes
        )
        result = poller.result()
        extracted_text = result.content
        
        # 3. Analyze resume structure with Foundry Agent
        analysis = await foundry_agent_service.analyze_resume_structure(extracted_text)
        
    except Exception as e:
        print(f"Resume extraction error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to analyze resume: {str(e)}")

    # 4. Save metadata record in Supabase PostgreSQL
    now_str = datetime.datetime.now(datetime.timezone.utc).isoformat()
    record = {
        "file_name": file.filename or "resume.pdf",
        "file_path": storage_path,
        "file_size": file_size_str,
        "parsed_date": now_str,
        "analysis": analysis.model_dump()
    }
    saved_record = await supabase_service.save_resume_record(user_id, record)

    return ResumeParsedData(
        id=saved_record.get("id"),
        fileName=file.filename or "resume.pdf",
        fileSize=file_size_str,
        parsedDate=now_str,
        analysis=analysis,
        rawText=extracted_text
    )

@router.get("/history")
async def get_resume_history(
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    resumes = await supabase_service.get_recent_resumes(current_user["id"], limit=1)
    if not resumes:
        return []
        
    return resumes
