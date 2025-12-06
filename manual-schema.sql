-- Manual PostgreSQL schema for ZeroSampah
-- Run this in Supabase SQL Editor (split statements by \n;).
-- Idempotent creation using IF NOT EXISTS where possible.

-- 1. Extension(s) (uuid if needed later)
-- create extension if not exists "uuid-ossp";

-- 2. Trigger function to auto-update updated_at columns
CREATE OR REPLACE FUNCTION set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Users table
CREATE TABLE IF NOT EXISTS users (
  clerk_id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  profile_image TEXT,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Reports table
CREATE TABLE IF NOT EXISTS reports (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(clerk_id) ON DELETE CASCADE,
  location TEXT NOT NULL,
  waste_type TEXT NOT NULL,
  amount TEXT NOT NULL,
  image_url TEXT,
  verification_result TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  collector_id TEXT REFERENCES users(clerk_id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Rewards table
CREATE TABLE IF NOT EXISTS rewards (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  points_required INTEGER NOT NULL,
  image_url TEXT,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CollectedWastes table
CREATE TABLE IF NOT EXISTS collected_wastes (
  id SERIAL PRIMARY KEY,
  report_id INTEGER NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  collector_id TEXT NOT NULL REFERENCES users(clerk_id) ON DELETE CASCADE,
  collection_date TIMESTAMPTZ DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'collected',
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(clerk_id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(clerk_id) ON DELETE CASCADE,
  reward_id INTEGER REFERENCES rewards(id) ON DELETE SET NULL,
  points_used INTEGER NOT NULL,
  transaction_type TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_reports_user ON reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_collector ON reports(collector_id);
CREATE INDEX IF NOT EXISTS idx_collected_wastes_report ON collected_wastes(report_id);
CREATE INDEX IF NOT EXISTS idx_collected_wastes_collector ON collected_wastes(collector_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);

-- 10. Triggers to keep updated_at fresh
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_users_set_timestamp'
  ) THEN
    CREATE TRIGGER trg_users_set_timestamp BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION set_timestamp();
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_reports_set_timestamp'
  ) THEN
    CREATE TRIGGER trg_reports_set_timestamp BEFORE UPDATE ON reports
    FOR EACH ROW EXECUTE FUNCTION set_timestamp();
  END IF;
END$$;

-- 11. Sample seed data (optional) - comment out if not needed
-- INSERT INTO users (clerk_id, email, full_name, points) VALUES
-- ('user_1', 'user1@example.com', 'User Satu', 0),
-- ('user_2', 'user2@example.com', 'User Dua', 0);
-- INSERT INTO reports (user_id, location, waste_type, amount, status) VALUES
-- ('user_1', 'Jakarta', 'plastic', '5kg', 'pending'),
-- ('user_2', 'Bandung', 'organic', '3kg', 'pending');

-- To mark a report collected:
-- INSERT INTO collected_wastes (report_id, collector_id, comment) VALUES (1, 'user_2', 'Collected successfully');
-- UPDATE reports SET status = 'collected', collector_id = 'user_2' WHERE id = 1;

-- 12. Basic RLS policies (enable if you want Supabase Row Level Security)
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE collected_wastes ENABLE ROW LEVEL SECURITY;
-- Example policies (adjust for Clerk auth integration):
-- CREATE POLICY "Public read reports" ON reports FOR SELECT USING (true);
-- CREATE POLICY "Insert own report" ON reports FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Update own report status" ON reports FOR UPDATE USING (auth.uid()::text = user_id) WITH CHECK (auth.uid()::text = user_id);
-- If using external auth (Clerk), you may need a mapping table to link auth.uid() to clerk_id.

-- Done.
