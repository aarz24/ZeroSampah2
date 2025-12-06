-- Add Events System Tables
-- Run this in Supabase SQL Editor to add events, registrations, and attendance tracking

-- 0. Create trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. Events table
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  organizer_id TEXT NOT NULL REFERENCES users(clerk_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  latitude TEXT,
  longitude TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  event_time TEXT NOT NULL,
  waste_categories TEXT[],
  status TEXT NOT NULL DEFAULT 'published',
  max_participants INTEGER,
  reward_info TEXT,
  images TEXT[],
  videos TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1b. Add reward_info column if events table already exists
ALTER TABLE events ADD COLUMN IF NOT EXISTS reward_info TEXT;

-- 2. Event Registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
  id SERIAL PRIMARY KEY,
  event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(clerk_id) ON DELETE CASCADE,
  qr_code TEXT NOT NULL UNIQUE,
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'registered'
);

-- 3. Event Attendance table (verified check-ins)
CREATE TABLE IF NOT EXISTS event_attendance (
  id SERIAL PRIMARY KEY,
  event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(clerk_id) ON DELETE CASCADE,
  registration_id INTEGER NOT NULL REFERENCES event_registrations(id) ON DELETE CASCADE,
  verified_by TEXT REFERENCES users(clerk_id) ON DELETE SET NULL,
  verified_at TIMESTAMPTZ DEFAULT NOW(),
  qr_code_scanned TEXT NOT NULL
);

-- 4. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_events_organizer ON events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user ON event_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_qr ON event_registrations(qr_code);
CREATE INDEX IF NOT EXISTS idx_event_attendance_event ON event_attendance(event_id);
CREATE INDEX IF NOT EXISTS idx_event_attendance_user ON event_attendance(user_id);

-- 5. Trigger to keep events.updated_at fresh
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_events_set_timestamp'
  ) THEN
    CREATE TRIGGER trg_events_set_timestamp BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION set_timestamp();
  END IF;
END$$;

-- Done! Events system is ready.
