-- Quick fix: Just add the reward_info column to existing events table
-- Copy and paste this into Supabase SQL Editor and click RUN

ALTER TABLE events ADD COLUMN IF NOT EXISTS reward_info TEXT;
