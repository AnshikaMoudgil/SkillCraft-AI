-- ==============================================================================
-- SkillCraftAI Database Schema for Supabase PostgreSQL
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USER PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    name TEXT,
    role TEXT DEFAULT 'Full Stack Developer',
    avatar_url TEXT,
    overall_score INTEGER DEFAULT 84,
    score_change INTEGER DEFAULT 6,
    interviews_completed INTEGER DEFAULT 12,
    coding_streak INTEGER DEFAULT 7,
    skills TEXT[] DEFAULT ARRAY['React', 'TypeScript', 'Node.js', 'Python', 'System Design'],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to create profile automatically on auth.users sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. RESUMES TABLE (Stores parsed resumes and storage references)
CREATE TABLE IF NOT EXISTS public.resumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size TEXT,
    parsed_date TIMESTAMPTZ DEFAULT NOW(),
    skills TEXT[] DEFAULT ARRAY[]::TEXT[],
    experience_years NUMERIC DEFAULT 0,
    education TEXT,
    role_match_score INTEGER DEFAULT 0,
    suggested_focus_areas TEXT[] DEFAULT ARRAY[]::TEXT[],
    projects JSONB DEFAULT '[]'::JSONB,
    rag_indexed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. INTERVIEWS TABLE (Interview sessions and performance results)
CREATE TABLE IF NOT EXISTS public.interviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('technical', 'mock', 'coding', 'resume')),
    role TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
    score INTEGER DEFAULT 0,
    duration TEXT DEFAULT '00:00',
    summary_feedback TEXT,
    communication_metrics JSONB DEFAULT '[]'::JSONB,
    strengths TEXT[] DEFAULT ARRAY[]::TEXT[],
    improvements TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. INTERVIEW TRANSCRIPTS TABLE (Conversation turns between user and AI)
CREATE TABLE IF NOT EXISTS public.interview_transcripts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    interview_id UUID REFERENCES public.interviews(id) ON DELETE CASCADE,
    sender TEXT NOT NULL CHECK (sender IN ('ai', 'user', 'system')),
    text TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    topic TEXT,
    analysis JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CODING SUBMISSIONS TABLE (Coding sandbox exercises and reviews)
CREATE TABLE IF NOT EXISTS public.coding_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    problem_id TEXT NOT NULL,
    problem_title TEXT NOT NULL,
    language TEXT NOT NULL DEFAULT 'javascript',
    code TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'passed',
    test_cases_passed INTEGER DEFAULT 0,
    total_test_cases INTEGER DEFAULT 0,
    complexity JSONB DEFAULT '{}'::JSONB,
    ai_review JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. LEARNING PLANS TABLE (Adaptive study plans)
CREATE TABLE IF NOT EXISTS public.learning_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    target_role TEXT NOT NULL,
    current_score INTEGER DEFAULT 0,
    target_score INTEGER DEFAULT 95,
    day_plans JSONB DEFAULT '[]'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coding_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_plans ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Resumes Policies
CREATE POLICY "Users can view own resumes" ON public.resumes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resumes" ON public.resumes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own resumes" ON public.resumes
    FOR DELETE USING (auth.uid() = user_id);

-- Interviews Policies
CREATE POLICY "Users can view own interviews" ON public.interviews
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own interviews" ON public.interviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Interview Transcripts Policies
CREATE POLICY "Users can view transcripts of their interviews" ON public.interview_transcripts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.interviews
            WHERE interviews.id = interview_transcripts.interview_id
            AND interviews.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert transcripts to their interviews" ON public.interview_transcripts
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.interviews
            WHERE interviews.id = interview_transcripts.interview_id
            AND interviews.user_id = auth.uid()
        )
    );

-- Coding Submissions Policies
CREATE POLICY "Users can view own coding submissions" ON public.coding_submissions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own coding submissions" ON public.coding_submissions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Learning Plans Policies
CREATE POLICY "Users can view own learning plans" ON public.learning_plans
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own learning plans" ON public.learning_plans
    FOR ALL USING (auth.uid() = user_id);

-- ==============================================================================
-- SUPABASE STORAGE BUCKET CONFIGURATION
-- ==============================================================================
-- Insert the 'resumes' storage bucket if it does not exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Allow authenticated users to upload to their folder in 'resumes'
CREATE POLICY "Users can upload resumes" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view own resume files" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]
    );
