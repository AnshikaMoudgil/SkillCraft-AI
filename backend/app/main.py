import os
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routers import auth, interview, coding, resume, voice, mixed

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "SkillCraftAI Full-Stack Architecture Backend\n"
        "- Supabase PostgreSQL (Database & RLS)\n"
        "- Supabase Auth (Authentication & Session Management)\n"
        "- Supabase Storage (Resume Files)\n"
        "- Microsoft Foundry & Foundry Agent Service (Adaptive Interview & Code Coach)\n"
        "- Azure AI Search (RAG Pipeline for Resume & Rubrics)\n"
        "- Azure AI Speech (Neural Real-Time STT/TTS)"
    ),
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API v1 Routers
api_v1_prefix = "/api/v1"
app.include_router(auth.router, prefix=api_v1_prefix)
app.include_router(interview.router, prefix=api_v1_prefix)
app.include_router(coding.router, prefix=api_v1_prefix)
app.include_router(resume.router, prefix=api_v1_prefix)
app.include_router(voice.router, prefix=api_v1_prefix)
app.include_router(mixed.router, prefix=api_v1_prefix)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    import traceback
    with open("error.log", "w") as f:
        f.write(traceback.format_exc())
    print(f"Global Exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error", "error": str(exc)},
        headers={"Access-Control-Allow-Origin": "*"}
    )

@app.get("/health", tags=["Health"])
async def health_check():
    """Service health and connection diagnostic check."""
    return {
        "status": "online",
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
        "integrations": {
            "supabase": settings.is_supabase_configured,
            "microsoft_foundry": settings.is_foundry_configured,
            "azure_ai_search": settings.is_search_configured,
            "azure_ai_speech": settings.is_speech_configured
        }
    }

# Serve frontend distribution if present (built in container / unified deployment)
frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))

if os.path.exists(frontend_dist):
    assets_dir = os.path.join(frontend_dist, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}", tags=["Frontend"])
    async def serve_spa(full_path: str):
        # Allow API, docs, redoc, and health check to pass through
        if full_path.startswith("api/") or full_path in ("docs", "redoc", "health"):
            return JSONResponse(status_code=404, content={"detail": "Not found"})
        file_path = os.path.join(frontend_dist, full_path)
        if full_path and os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_dist, "index.html"))
else:
    @app.get("/", tags=["Root"])
    async def root_info():
        return {
            "message": "Welcome to SkillCraftAI Backend API",
            "documentation": "/docs",
            "health": "/health"
        }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
