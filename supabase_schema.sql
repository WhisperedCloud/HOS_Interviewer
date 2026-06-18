-- =====================================================================================
-- SUPABASE SCHEMA UPDATES FOR CODING ASSESSMENTS
-- Run this script in your Supabase SQL Editor to apply the necessary schema changes.
-- =====================================================================================

-- 1. Add 'type' column to the quizzes table
ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS type text DEFAULT 'mcq';

-- 2. Add columns to results table for coding submissions
ALTER TABLE results ADD COLUMN IF NOT EXISTS submission_type text DEFAULT 'mcq';
ALTER TABLE results ADD COLUMN IF NOT EXISTS code text;
ALTER TABLE results ADD COLUMN IF NOT EXISTS language text;
ALTER TABLE results ADD COLUMN IF NOT EXISTS test_results jsonb;

-- 3. Create coding_questions table
CREATE TABLE IF NOT EXISTS coding_questions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id uuid REFERENCES quizzes(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text NOT NULL,
    language_options text[] DEFAULT '{"python3", "javascript", "c"}',
    time_limit_seconds integer DEFAULT 60,
    created_at timestamp with time zone DEFAULT now()
);

-- 4. Create test_cases table
CREATE TABLE IF NOT EXISTS test_cases (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id uuid REFERENCES coding_questions(id) ON DELETE CASCADE,
    input text NOT NULL,
    expected_output text NOT NULL,
    is_public boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);

-- =====================================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================================

-- Enable RLS
ALTER TABLE coding_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_cases ENABLE ROW LEVEL SECURITY;

-- Create policies (Drops existing ones to avoid errors if run multiple times)
DROP POLICY IF EXISTS "Enable full access to coding_questions" ON coding_questions;
CREATE POLICY "Enable full access to coding_questions" 
ON coding_questions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable full access to test_cases" ON test_cases;
CREATE POLICY "Enable full access to test_cases" 
ON test_cases FOR ALL USING (true) WITH CHECK (true);
