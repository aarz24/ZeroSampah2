-- Verification script for events table schema
-- Run this in Supabase SQL Editor to check if latitude/longitude columns exist

-- 1. Check if events table exists and its structure
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM 
    information_schema.columns
WHERE 
    table_name = 'events'
ORDER BY 
    ordinal_position;

-- 2. Check sample events data
SELECT 
    id,
    title,
    location,
    latitude,
    longitude,
    event_date,
    status
FROM 
    events
LIMIT 10;

-- 3. Count events with coordinates
SELECT 
    COUNT(*) as total_events,
    COUNT(latitude) as events_with_latitude,
    COUNT(longitude) as events_with_longitude,
    COUNT(CASE WHEN latitude IS NOT NULL AND longitude IS NOT NULL THEN 1 END) as events_with_both_coords
FROM 
    events
WHERE 
    status = 'published';
