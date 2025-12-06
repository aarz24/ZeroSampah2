-- Add latitude and longitude columns to events table if they don't exist
-- Run this in Supabase SQL Editor

-- Add latitude column if missing
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'events' 
        AND column_name = 'latitude'
    ) THEN
        ALTER TABLE events ADD COLUMN latitude TEXT;
        RAISE NOTICE '✓ Added latitude column';
    ELSE
        RAISE NOTICE '✓ latitude column already exists';
    END IF;
END $$;

-- Add longitude column if missing
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'events' 
        AND column_name = 'longitude'
    ) THEN
        ALTER TABLE events ADD COLUMN longitude TEXT;
        RAISE NOTICE '✓ Added longitude column';
    ELSE
        RAISE NOTICE '✓ longitude column already exists';
    END IF;
END $$;

-- Verify the columns exist
SELECT 
    column_name,
    data_type,
    is_nullable
FROM 
    information_schema.columns
WHERE 
    table_name = 'events'
    AND column_name IN ('latitude', 'longitude');

-- Check if you have any events with coordinates
SELECT 
    COUNT(*) as total_events,
    COUNT(latitude) as events_with_lat,
    COUNT(longitude) as events_with_lng,
    COUNT(CASE WHEN latitude IS NOT NULL AND longitude IS NOT NULL THEN 1 END) as events_with_coords
FROM 
    events;
