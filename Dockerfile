# ==============================================================================
# Multi-Stage Dockerfile for SkillCraft-AI (Full-Stack Unified Container)
# ==============================================================================

# --- Stage 1: Build React Frontend ---
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./

# Pass environment variables needed at Vite build time
ARG VITE_API_BASE_URL=/api/v1
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_AZURE_SPEECH_REGION=eastus

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_AZURE_SPEECH_REGION=$VITE_AZURE_SPEECH_REGION

RUN npm run build

# --- Stage 2: Python Backend & Static Host ---
FROM python:3.12-slim
WORKDIR /app

# Install system libraries needed for Azure Speech SDK & audio processing
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libasound2 \
    libssl-dev \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

COPY backend/ ./backend/
# Copy the built React distribution from Stage 1
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

WORKDIR /app/backend

ENV PORT=8000
EXPOSE 8000

# Start Uvicorn bound to Railway/Render assigned $PORT
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
