-- 在 Supabase SQL Editor 里运行这个脚本

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  password_hash TEXT NOT NULL,
  token TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 允许 anon key 对 users 表做所有操作
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "允许所有操作" ON users
  FOR ALL
  USING (true)
  WITH CHECK (true);
