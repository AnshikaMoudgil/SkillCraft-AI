# SkillCraftAI - FastAPI Backend 🚀

This is the backend service for **SkillCraftAI**, integrating:
- **Database, Auth & Storage**: Supabase (PostgreSQL, Supabase Auth, Supabase Storage)
- **AI & Agent Service**: Microsoft Foundry & Foundry Agent Service
- **RAG Engine**: Azure AI Search
- **Voice Intelligence**: Azure AI Speech

---

## 🏗️ Architecture

```
React + Vite Frontend (Port 5173)
       │
       ▼
FastAPI Backend (Port 8000)
       ├── /api/v1/auth         ──> Supabase Auth & PostgreSQL Profiles
       ├── /api/v1/interview    ──> Microsoft Foundry Adaptive Interviewer Agent
       ├── /api/v1/coding       ──> Microsoft Foundry Code Coach Agent
       ├── /api/v1/resume       ──> Supabase Storage & Azure AI Search RAG
       └── /api/v1/voice        ──> Azure AI Speech (Token Vending & TTS)
```

---

## 🚦 Getting Started

### 1. Create and Activate Virtual Environment
```bash
# In the backend directory:
python -m venv .venv

# Windows PowerShell:
.venv\Scripts\Activate.ps1

# macOS/Linux:
source .venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your API keys in `.env` as they become available.
*(Note: If keys are left empty, the backend runs in a graceful development emulation mode without crashing).*

### 4. Run the Development Server
```bash
uvicorn app.main:app --reload --port 8000
```

- API Docs (Swagger UI): [http://localhost:8000/docs](http://localhost:8000/docs)
- Health Check: [http://localhost:8000/health](http://localhost:8000/health)

---

## 🗄️ Supabase PostgreSQL Setup

1. Open your project on [Supabase](https://supabase.com/).
2. Navigate to **SQL Editor**.
3. Paste the contents of `backend/supabase/schema.sql` and click **Run**.
4. The tables (`profiles`, `resumes`, `interviews`, `interview_transcripts`, `coding_submissions`, `learning_plans`), RLS policies, and `resumes` storage bucket will be set up automatically.
