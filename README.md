# SkillCraft-AI 🚀

An intelligent, AI-powered mock interview and career preparation platform designed to help candidates prepare, practice, and excel in technical and behavioral interviews.

---

## 🏗️ Architecture Stack

```
Frontend
└── React + Vite (Port 5173)
        ↓
Backend
└── FastAPI + Python (Port 8000)
        ↓
Database
└── Supabase PostgreSQL
        ↓
Authentication
└── Supabase Auth
        ↓
File Storage
└── Supabase Storage
        ↓
AI
└── Microsoft Foundry
        ↓
Agent
└── Foundry Agent Service
        ↓
RAG
└── Azure AI Search
        ↓
Voice
└── Azure AI Speech
```

---

## 📂 Project Structure

```
SkillCraftAI/
├── frontend/                 # React 19 + TypeScript + Vite SPA
│   ├── src/
│   │   ├── components/       # UI components (coding, interview, layout, common)
│   │   ├── context/          # React Context (AuthContext with Supabase Auth)
│   │   ├── lib/              # API & Supabase Client (apiClient.ts, supabase.ts)
│   │   ├── pages/            # Platform pages (Dashboard, Voice, Coding, Resume)
│   │   └── services/         # Service layers connected to FastAPI backend
│   ├── .env.example          # Frontend environment variables template
│   ├── .env                  # Frontend active environment variables
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                  # FastAPI + Python 3.12 Backend
│   ├── app/
│   │   ├── core/             # Configuration & Supabase JWT Auth middleware
│   │   ├── models/           # Pydantic schemas (Interview, Coding, Resume, User)
│   │   ├── services/         # Supabase, Microsoft Foundry, Azure Search RAG, Azure Speech
│   │   ├── routers/          # API endpoints (/auth, /interview, /coding, /resume, /voice)
│   │   └── main.py           # FastAPI entrypoint & CORS middleware
│   ├── supabase/
│   │   └── schema.sql        # Supabase PostgreSQL schema, RLS policies, & storage bucket
│   ├── tests/
│   │   └── test_api.py       # Automated API test suite
│   ├── .env.example          # Backend environment variables template
│   ├── .env                  # Backend active environment variables
│   └── requirements.txt
│
└── README.md
```

---

## 🚦 Quick Start

### 1. Backend Setup (FastAPI)

```bash
cd backend

# Create and activate virtual environment
python -m venv .venv
.venv\Scripts\Activate.ps1    # On Windows
# source .venv/bin/activate   # On macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Start backend server (Port 8000)
uvicorn app.main:app --reload --port 8000
```
- API Docs (Swagger UI): [http://localhost:8000/docs](http://localhost:8000/docs)
- Health Check: [http://localhost:8000/health](http://localhost:8000/health)

### 2. Frontend Setup (React + Vite)

```bash
cd frontend

# Install dependencies
npm install

# Start frontend development server (Port 5173)
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔑 Environment Variables

Both `frontend/.env` and `backend/.env` have been created with clean placeholders ready for your credentials:
- **Supabase**: URL, Anon Key, Service Role Key, JWT Secret (tables can be initialized with `backend/supabase/schema.sql`).
- **Microsoft Foundry**: Azure Foundry endpoint, API key, project connection string.
- **Azure AI Search**: Search service endpoint, admin key, index name.
- **Azure AI Speech**: Speech resource key and region.

*Note: The platform features robust local emulation fallbacks so you can run, develop, and test everything locally even before entering cloud credentials.*

---

## 📄 License

This project is licensed under the MIT License.
