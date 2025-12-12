-- ZeroSampah Database Schema (Enhanced for shared visibility & collection workflow)
-- Run this in Supabase SQL Editor (safe re-run: uses IF NOT EXISTS / idempotent constructs)

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  clerk_id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  profile_image TEXT,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Reports Table
CREATE TABLE IF NOT EXISTS reports (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(clerk_id) ON DELETE CASCADE,
  location TEXT NOT NULL,
  waste_type TEXT NOT NULL,
  amount TEXT NOT NULL,
  image_url TEXT,
  verification_result TEXT,
  -- Extended workflow statuses: pending (just reported), in_progress (claimed by collector),
  -- collected (collection evidence uploaded), verified (AI / moderator verification), rejected (failed validation)
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'collected', 'verified', 'rejected')),
  collector_id TEXT REFERENCES users(clerk_id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS collected_wastes (
  id SERIAL PRIMARY KEY,
  report_id INTEGER NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  collector_id TEXT NOT NULL REFERENCES users(clerk_id) ON DELETE CASCADE,
  collection_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'collected' CHECK (status IN ('collected', 'verified', 'rejected')),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Rewards Table
CREATE TABLE IF NOT EXISTS rewards (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  points_required INTEGER NOT NULL,
  image_url TEXT,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(clerk_id) ON DELETE CASCADE,
  reward_id INTEGER REFERENCES rewards(id) ON DELETE SET NULL,
  points_used INTEGER NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('earned', 'redeemed')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(clerk_id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error', 'reward')),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- (Recreate if missing)
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_collected_wastes_collector_id ON collected_wastes(collector_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE collected_wastes ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- DROP existing permissive policies if present (ignore errors if first run)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all operations on users') THEN
    DROP POLICY "Allow all operations on users" ON users; END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all operations on reports') THEN
    DROP POLICY "Allow all operations on reports" ON reports; END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all operations on collected_wastes') THEN
    DROP POLICY "Allow all operations on collected_wastes" ON collected_wastes; END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all operations on rewards') THEN
    DROP POLICY "Allow all operations on rewards" ON rewards; END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all operations on transactions') THEN
    DROP POLICY "Allow all operations on transactions" ON transactions; END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all operations on notifications') THEN
    DROP POLICY "Allow all operations on notifications" ON notifications; END IF;
END $$;

-- PRINCIPLED POLICIES
-- Users: allow SELECT all (so names can show with reports), allow UPDATE only self
CREATE POLICY "users_select_all" ON users FOR SELECT USING (true);
CREATE POLICY "users_update_self" ON users FOR UPDATE USING (auth.uid()::text = clerk_id) WITH CHECK (auth.uid()::text = clerk_id);
CREATE POLICY "users_insert_self" ON users FOR INSERT WITH CHECK (auth.uid()::text = clerk_id);

-- Reports: everyone can see every report; insert only self; update only owner or collector
CREATE POLICY "reports_select_all" ON reports FOR SELECT USING (true);
CREATE POLICY "reports_insert_owner" ON reports FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "reports_update_owner_or_collector" ON reports FOR UPDATE USING (
  auth.uid()::text = user_id OR auth.uid()::text = collector_id
) WITH CHECK (
  auth.uid()::text = user_id OR auth.uid()::text = collector_id
);

-- Collected wastes: visible to all; insert only by authenticated users; update only the collector
CREATE POLICY "collected_select_all" ON collected_wastes FOR SELECT USING (true);
CREATE POLICY "collected_insert_auth" ON collected_wastes FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "collected_update_collector" ON collected_wastes FOR UPDATE USING (auth.uid()::text = collector_id) WITH CHECK (auth.uid()::text = collector_id);

-- Rewards, Transactions, Notifications: READ all for app transparency, write restricted
CREATE POLICY "rewards_select_all" ON rewards FOR SELECT USING (true);
CREATE POLICY "transactions_select_all" ON transactions FOR SELECT USING (true);
CREATE POLICY "notifications_select_all" ON notifications FOR SELECT USING (true);
CREATE POLICY "notifications_insert_user" ON notifications FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "notifications_update_user" ON notifications FOR UPDATE USING (auth.uid()::text = user_id) WITH CHECK (auth.uid()::text = user_id);

-- (Adjust further as needed for stricter privacy.)

-- VIEW: Public overview combining reports & collection state
CREATE OR REPLACE VIEW public.report_overview AS
SELECT r.id,
       r.location,
       r.waste_type,
       r.amount,
       r.status,
       r.user_id AS reporter_id,
       r.collector_id,
       (cw.id IS NOT NULL) AS is_collected,
       r.created_at,
       r.updated_at
FROM reports r
LEFT JOIN collected_wastes cw ON cw.report_id = r.id;

-- TRIGGER: auto mark report as collected when a collected_wastes row is inserted (if not already verified)
CREATE OR REPLACE FUNCTION public.mark_report_collected()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE reports
     SET status = CASE WHEN status <> 'verified' THEN 'collected' ELSE status END,
         collector_id = COALESCE(collector_id, NEW.collector_id),
         updated_at = NOW()
   WHERE id = NEW.report_id;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_collected_waste_after_insert ON collected_wastes;
CREATE TRIGGER trg_collected_waste_after_insert
AFTER INSERT ON collected_wastes
FOR EACH ROW EXECUTE FUNCTION public.mark_report_collected();

INSERT INTO users (clerk_id, email, full_name, points) 
VALUES ('clerk_demo', 'demo@zerosampah.com', 'Demo User', 100)
ON CONFLICT (clerk_id) DO NOTHING;

-- Insert sample rewards
INSERT INTO rewards (name, description, points_required, image_url, stock) VALUES
('Botol Minum Ramah Lingkungan', 'Botol minum stainless steel yang dapat digunakan ulang', 200, '/images/rewards/botol.webp', 50),
('Set Peralatan Makan Bambu', 'Set peralatan makan bambu ramah lingkungan', 300, '/images/rewards/peralatan-bambu.jpg', 30),
('Tas Belanja Katun Organik', 'Tas belanja ramah lingkungan terbuat dari katun organik', 150, '/images/rewards/tas-katun.webp', 100)
ON CONFLICT DO NOTHING;

INSERT INTO reports (user_id, location, waste_type, amount, status) 
VALUES ('clerk_demo', 'https://maps.google.com/?q=-6.2088,106.8456', 'Plastic bottles', '5 kg', 'pending')
ON CONFLICT DO NOTHING;

-- Example collected entry (demonstrates trigger changing report status)
INSERT INTO collected_wastes (report_id, collector_id, comment)
SELECT id, 'clerk_demo', 'Initial collection demo' FROM reports WHERE user_id = 'clerk_demo' LIMIT 1;

-- Success message
SELECT 'Enhanced shared visibility schema applied successfully!' AS status;
