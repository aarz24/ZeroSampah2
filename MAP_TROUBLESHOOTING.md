## Troubleshooting Checklist - Map Not Showing

### 1. **Did you run the SQL script in Supabase?**
Open Supabase SQL Editor and run `COMPLETE_SCHEMA_WITH_EVENTS.sql`

This creates:
- Events tables with latitude/longitude columns
- 6 dummy events with coordinates

### 2. **Check if events exist in database**
Run this in Supabase SQL Editor:
```sql
SELECT COUNT(*) FROM events WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
```

Should return at least 6 events.

### 3. **Check browser console for errors**
1. Open http://localhost:3002/events
2. Press F12 to open DevTools
3. Check Console tab for errors like:
   - "Google Maps API key" errors
   - "Failed to load Google Maps"
   - Any JavaScript errors

### 4. **Verify Google Maps API Key**
- Go to Google Cloud Console
- Enable "Maps JavaScript API" 
- Check API key restrictions (should allow localhost)
- Ensure billing is enabled (required even for free tier)

### 5. **Check if Map View button exists**
- Do you see a toggle button with "List View" and "Map View"?
- Click "Map View" button

### 6. **Restart with clean cache**
```powershell
# Stop the server (Ctrl+C)
# Then run:
npm run dev
```

Then open: http://localhost:3002/events in incognito mode

### What to tell me:
1. ✓ Did you run the SQL script? (Yes/No)
2. ✓ Do you see events in List View? (Yes/No)
3. ✓ What error shows in browser console when you click Map View?
4. ✓ Screenshot of the events page would help!
