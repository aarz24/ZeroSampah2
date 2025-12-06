-- Create or replace the shared report overview view
-- Run this alone in Supabase SQL Editor if the original schema script failed mid-way.
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
FROM public.reports r
LEFT JOIN public.collected_wastes cw ON cw.report_id = r.id;

-- Verification query (run after creating view):
-- SELECT * FROM public.report_overview ORDER BY created_at DESC LIMIT 20;