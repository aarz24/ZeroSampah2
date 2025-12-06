-- Fix script: Add latitude and longitude columns if missing
-- Run this in Supabase SQL Editor if the columns don't exist

-- Add latitude column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'events' 
        AND column_name = 'latitude'
    ) THEN
        ALTER TABLE events ADD COLUMN latitude TEXT;
        RAISE NOTICE 'Added latitude column to events table';
    ELSE
        RAISE NOTICE 'latitude column already exists';
    END IF;
END $$;

-- Add longitude column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'events' 
        AND column_name = 'longitude'
    ) THEN
        ALTER TABLE events ADD COLUMN longitude TEXT;
        RAISE NOTICE 'Added longitude column to events table';
    ELSE
        RAISE NOTICE 'longitude column already exists';
    END IF;
END $$;

-- Verify the changes
SELECT 
    column_name,
    data_type,
    is_nullable
FROM 
    information_schema.columns
WHERE 
    table_name = 'events'
    AND column_name IN ('latitude', 'longitude');
