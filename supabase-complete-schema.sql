-- ====================================================================
-- ZeroSampah Complete Database Schema
-- Enhanced for shared visibility, collection workflow, and events
-- Run this in Supabase SQL Editor
-- Safe for re-run: uses IF NOT EXISTS / idempotent constructs
-- ====================================================================

-- ====================================================================
-- 1. USERS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS users (
  clerk_id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  profile_image TEXT,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- 2. REPORTS TABLE
-- Extended workflow statuses:
-- - pending: just reported
-- - in_progress: claimed by collector
-- - collected: collection evidence uploaded
-- - verified: AI/moderator verification passed
-- - rejected: failed validation
-- ====================================================================
CREATE TABLE IF NOT EXISTS reports (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(clerk_id) ON DELETE CASCADE,
  location TEXT NOT NULL,
  waste_type TEXT NOT NULL,
  amount TEXT NOT NULL,
  image_url TEXT,
  verification_result TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'collected', 'verified', 'rejected')),
  collector_id TEXT REFERENCES users(clerk_id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- 3. COLLECTED WASTES TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS collected_wastes (
  id SERIAL PRIMARY KEY,
  report_id INTEGER NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  collector_id TEXT NOT NULL REFERENCES users(clerk_id) ON DELETE CASCADE,
  collection_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'collected' CHECK (status IN ('collected', 'verified', 'rejected')),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- 4. REWARDS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS rewards (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  points_required INTEGER NOT NULL,
  image_url TEXT,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- 5. TRANSACTIONS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(clerk_id) ON DELETE CASCADE,
  reward_id INTEGER REFERENCES rewards(id) ON DELETE SET NULL,
  points_used INTEGER NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('earned', 'redeemed')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- 6. NOTIFICATIONS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(clerk_id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error', 'reward')),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- 7. EVENTS TABLE (Community Cleanup Events)
-- ====================================================================
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  organizer_id TEXT NOT NULL REFERENCES users(clerk_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  latitude TEXT,
  longitude TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  event_time TEXT NOT NULL,
  waste_categories TEXT[],
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'cancelled', 'completed')),
  max_participants INTEGER,
  reward_info TEXT,
  images TEXT[],
  videos TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- 8. EVENT REGISTRATIONS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS event_registrations (
  id SERIAL PRIMARY KEY,
  event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(clerk_id) ON DELETE CASCADE,
  qr_code TEXT NOT NULL UNIQUE,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'cancelled')),
  UNIQUE(event_id, user_id)
);

-- ====================================================================
-- 9. EVENT ATTENDANCE TABLE (Verified Check-ins)
-- ====================================================================
CREATE TABLE IF NOT EXISTS event_attendance (
  id SERIAL PRIMARY KEY,
  event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(clerk_id) ON DELETE CASCADE,
  registration_id INTEGER NOT NULL REFERENCES event_registrations(id) ON DELETE CASCADE,
  verified_by TEXT REFERENCES users(clerk_id) ON DELETE SET NULL,
  verified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  qr_code_scanned TEXT NOT NULL,
  UNIQUE(event_id, user_id)
);

-- ====================================================================
-- INDEXES FOR PERFORMANCE
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_collected_wastes_collector_id ON collected_wastes(collector_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_events_organizer_id ON events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user_id ON event_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_event_attendance_event_id ON event_attendance(event_id);

-- ====================================================================
-- ENABLE ROW LEVEL SECURITY
-- ====================================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE collected_wastes ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendance ENABLE ROW LEVEL SECURITY;

-- ====================================================================
-- DROP EXISTING POLICIES (Idempotent)
-- ====================================================================
DO $$ 
BEGIN
  -- Users policies
  DROP POLICY IF EXISTS "Allow all operations on users" ON users;
  DROP POLICY IF EXISTS "users_select_all" ON users;
  DROP POLICY IF EXISTS "users_update_self" ON users;
  DROP POLICY IF EXISTS "users_insert_self" ON users;
  
  -- Reports policies
  DROP POLICY IF EXISTS "Allow all operations on reports" ON reports;
  DROP POLICY IF EXISTS "reports_select_all" ON reports;
  DROP POLICY IF EXISTS "reports_insert_owner" ON reports;
  DROP POLICY IF EXISTS "reports_update_owner_or_collector" ON reports;
  
  -- Collected wastes policies
  DROP POLICY IF EXISTS "Allow all operations on collected_wastes" ON collected_wastes;
  DROP POLICY IF EXISTS "collected_select_all" ON collected_wastes;
  DROP POLICY IF EXISTS "collected_insert_auth" ON collected_wastes;
  DROP POLICY IF EXISTS "collected_update_collector" ON collected_wastes;
  
  -- Rewards policies
  DROP POLICY IF EXISTS "Allow all operations on rewards" ON rewards;
  DROP POLICY IF EXISTS "rewards_select_all" ON rewards;
  
  -- Transactions policies
  DROP POLICY IF EXISTS "Allow all operations on transactions" ON transactions;
  DROP POLICY IF EXISTS "transactions_select_all" ON transactions;
  
  -- Notifications policies
  DROP POLICY IF EXISTS "Allow all operations on notifications" ON notifications;
  DROP POLICY IF EXISTS "notifications_select_all" ON notifications;
  DROP POLICY IF EXISTS "notifications_insert_user" ON notifications;
  DROP POLICY IF EXISTS "notifications_update_user" ON notifications;
  
  -- Events policies
  DROP POLICY IF EXISTS "events_select_all" ON events;
  DROP POLICY IF EXISTS "events_insert_auth" ON events;
  DROP POLICY IF EXISTS "events_update_organizer" ON events;
  
  -- Event registrations policies
  DROP POLICY IF EXISTS "event_registrations_select_all" ON event_registrations;
  DROP POLICY IF EXISTS "event_registrations_insert_auth" ON event_registrations;
  DROP POLICY IF EXISTS "event_registrations_update_user" ON event_registrations;
  
  -- Event attendance policies
  DROP POLICY IF EXISTS "event_attendance_select_all" ON event_attendance;
  DROP POLICY IF EXISTS "event_attendance_insert_organizer" ON event_attendance;
END $$;

-- ====================================================================
-- ROW LEVEL SECURITY POLICIES
-- ====================================================================

-- Users: allow SELECT all, UPDATE/INSERT only self
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

-- Rewards: READ all for app transparency
CREATE POLICY "rewards_select_all" ON rewards FOR SELECT USING (true);

-- Transactions: READ all for app transparency
CREATE POLICY "transactions_select_all" ON transactions FOR SELECT USING (true);

-- Notifications: READ all, write restricted to user
CREATE POLICY "notifications_select_all" ON notifications FOR SELECT USING (true);
CREATE POLICY "notifications_insert_user" ON notifications FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "notifications_update_user" ON notifications FOR UPDATE USING (auth.uid()::text = user_id) WITH CHECK (auth.uid()::text = user_id);

-- Events: everyone can see published events; insert by authenticated users; update only by organizer
CREATE POLICY "events_select_all" ON events FOR SELECT USING (true);
CREATE POLICY "events_insert_auth" ON events FOR INSERT WITH CHECK (auth.uid()::text = organizer_id);
CREATE POLICY "events_update_organizer" ON events FOR UPDATE USING (auth.uid()::text = organizer_id) WITH CHECK (auth.uid()::text = organizer_id);

-- Event Registrations: visible to all; insert by authenticated users; update only by user
CREATE POLICY "event_registrations_select_all" ON event_registrations FOR SELECT USING (true);
CREATE POLICY "event_registrations_insert_auth" ON event_registrations FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "event_registrations_update_user" ON event_registrations FOR UPDATE USING (auth.uid()::text = user_id) WITH CHECK (auth.uid()::text = user_id);

-- Event Attendance: visible to all; insert by event organizer or system
CREATE POLICY "event_attendance_select_all" ON event_attendance FOR SELECT USING (true);
CREATE POLICY "event_attendance_insert_organizer" ON event_attendance FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ====================================================================
-- VIEWS
-- ====================================================================

-- Public overview combining reports & collection state
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

-- ====================================================================
-- TRIGGERS
-- ====================================================================

-- Auto mark report as collected when a collected_wastes row is inserted
CREATE OR REPLACE FUNCTION public.mark_report_collected()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE reports
     SET status = CASE WHEN status <> 'verified' THEN 'collected' ELSE status END,
         collector_id = COALESCE(collector_id, NEW.collector_id),
         updated_at = NOW()
   WHERE id = NEW.report_id;
  RETURN NEW;
END; 
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_collected_waste_after_insert ON collected_wastes;
CREATE TRIGGER trg_collected_waste_after_insert
AFTER INSERT ON collected_wastes
FOR EACH ROW EXECUTE FUNCTION public.mark_report_collected();

-- ====================================================================
-- SEED DATA
-- ====================================================================

-- Insert demo user
INSERT INTO users (clerk_id, email, full_name, points) 
VALUES ('clerk_demo', 'demo@zerosampah.com', 'Demo User', 100)
ON CONFLICT (clerk_id) DO NOTHING;

-- Insert sample rewards
INSERT INTO rewards (name, description, points_required, image_url, stock) VALUES
('Botol Minum Ramah Lingkungan', 'Botol minum stainless steel yang dapat digunakan ulang', 200, '/images/rewards/botol.webp', 50),
('Set Peralatan Makan Bambu', 'Set peralatan makan bambu ramah lingkungan', 300, '/images/rewards/peralatan-bambu.jpg', 30),
('Tas Belanja Katun Organik', 'Tas belanja ramah lingkungan terbuat dari katun organik', 150, '/images/rewards/tas-katun.webp', 100),
('Voucher GoFood Rp 50.000', 'Voucher makan dari GoFood senilai Rp 50.000', 500, '/images/rewards/gofood.jpg', 20),
('Tumbler Stainless Premium', 'Tumbler stainless steel premium 500ml', 250, '/images/rewards/tumbler.jpg', 40),
('Eco Bag Canvas', 'Tas canvas berkualitas tinggi ramah lingkungan', 180, '/images/rewards/ecobag.jpg', 60)
ON CONFLICT DO NOTHING;

-- Insert sample reports
INSERT INTO reports (user_id, location, waste_type, amount, status) 
VALUES 
('clerk_demo', 'Jl. Raya Mabes Hankam Jakarta', 'Plastic bottles', '5 kg', 'pending'),
('clerk_demo', 'Taman Kota Senayan', 'Paper waste', '3 kg', 'pending'),
('clerk_demo', 'Pasar Minggu', 'Organic waste', '10 kg', 'collected')
ON CONFLICT DO NOTHING;

-- Example collected entry
DO $$
DECLARE
  report_id_val INTEGER;
BEGIN
  SELECT id INTO report_id_val FROM reports WHERE user_id = 'clerk_demo' AND status = 'pending' LIMIT 1;
  IF report_id_val IS NOT NULL THEN
    INSERT INTO collected_wastes (report_id, collector_id, comment)
    VALUES (report_id_val, 'clerk_demo', 'Initial collection demo')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- ====================================================================
-- VERIFICATION & COMPLETION MESSAGE
-- ====================================================================

-- Show latest reports to verify setup
SELECT 'Schema setup completed successfully!' AS status;
SELECT 'Latest Reports:' AS info;
SELECT id, user_id, location, waste_type, amount, status, collector_id, created_at
FROM reports
ORDER BY created_at DESC
LIMIT 10;

SELECT 'User Points:' AS info;
SELECT clerk_id, full_name, email, points FROM users ORDER BY points DESC LIMIT 10;

SELECT 'Available Rewards:' AS info;
SELECT id, name, points_required, stock FROM rewards ORDER BY points_required;
