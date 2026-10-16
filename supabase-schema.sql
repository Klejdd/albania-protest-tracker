-- ============================================================
-- Albania Protest Tracker - Database Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Users table (anonymous, nickname only)
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- User profile (demographic data)
CREATE TABLE user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  location text NOT NULL, -- 'albania' or 'abroad'
  has_protested boolean NOT NULL,
  age integer NOT NULL,
  university_major text,
  education_status text NOT NULL, -- 'high_school', 'in_progress', 'finished'
  planned_major text, -- for high schoolers
  current_job text, -- for those who finished
  has_job boolean DEFAULT false,
  works_for_government boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Protest answers (each submission = one user's answers)
CREATE TABLE protest_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  profile_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  protest_goals text[] NOT NULL, -- 5 things they want the protest to achieve
  created_at timestamptz DEFAULT now()
);

-- Comments on results/dashboard
CREATE TABLE comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  comment text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE protest_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables (anyone can read)
CREATE POLICY "Public read access - users" ON users
  FOR SELECT USING (true);

CREATE POLICY "Public read access - profiles" ON user_profiles
  FOR SELECT USING (true);

CREATE POLICY "Public read access - answers" ON protest_answers
  FOR SELECT USING (true);

CREATE POLICY "Public read access - comments" ON comments
  FOR SELECT USING (true);

-- Insert access (authenticated users only)
CREATE POLICY "Insert user" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Insert profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Insert answer" ON protest_answers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Insert comment" ON comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);
