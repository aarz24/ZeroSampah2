# Event System - Quick Start Guide

## 🚀 Getting Started

### 1. Database is Ready
The event tables have been successfully migrated to Supabase:
- ✅ Events
- ✅ EventRegistrations  
- ✅ EventAttendance

No manual SQL needed - everything is set up!

### 2. Test the Event Flow

#### As an Organizer (Create Event):
1. Start dev server (already running on port 3001)
2. Login with your Clerk account
3. Navigate to **Events** menu in sidebar
4. Click **"Buat Acara"** button
5. Fill in the form:
   - Title: "Test Community Cleanup"
   - Location: "Taman Kota"
   - Date: Pick a future date
   - Time: "08:00"
   - Description: "Test event description"
   - Select waste categories (optional)
6. Click **"Terbitkan Acara"**
7. You'll be redirected to the event detail page

#### As a Participant (Join Event):
1. Make sure you're logged in
2. Go to Browse Events page (`/events`)
3. Click on any event card
4. Click **"Gabung Acara"** button
5. Click **"Tampilkan QR Code"** to see your unique QR
6. Screenshot or note the QR code

#### As Organizer (Verify Attendance):
1. Navigate to your event detail page
2. Click **"Buka Scanner"** button
3. Use the camera scanner to scan a participant's QR code
4. See success message with participant name
5. Try scanning the same QR again - should show duplicate error

#### Check Your Dashboard:
1. Navigate to **Dashboard Saya** from Events page
2. Left column shows events you organized
3. Right column shows events you joined
4. See status badges and counts

## 🔍 API Endpoints Available

### Public Endpoints
```http
GET /api/events
  Returns all published events with organizer info

GET /api/events/[id]
  Returns event details
  If user logged in, includes registration status
```

### Protected Endpoints (Require Auth)
```http
POST /api/events
  Body: { title, location, eventDate, eventTime, description, ... }
  Creates new event

POST /api/events
  Body: { action: "register", eventId }
  Registers user for event

POST /api/events/[id]/verify
  Body: { userId, qrData }
  Verifies QR code and marks attendance

GET /api/events?type=organized
  Returns user's organized events

GET /api/events?type=registered
  Returns user's registered events
```

## 📱 Pages You Can Visit

| Route | Description | Auth Required |
|-------|-------------|---------------|
| `/events` | Browse all published events | No |
| `/events/[id]` | Event detail with registration | No (but features require auth) |
| `/events/create` | Create new event form | Yes |
| `/events/dashboard` | Personal event dashboard | Yes |

## 🧪 Testing Tips

### Test Registration:
```javascript
// In browser console on event detail page
fetch('/api/events', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    action: 'register', 
    eventId: 1  // Replace with actual event ID
  })
})
```

### Test QR Verification:
The QR code format is: `EVENT:{eventId}:{userId}:{timestamp}`

Example: `EVENT:1:user_2abc123:1703001234567`

### Check Database:
```bash
# Open Drizzle Studio to view database
npm run db:studio
```

## 🐛 Common Issues & Solutions

### Issue: "Event not found"
- Make sure event exists in database
- Check event ID is correct number
- Verify event status is 'published'

### Issue: "Registration not found"
- User must register before getting QR code
- Check EventRegistrations table in database
- Verify userId matches Clerk user ID

### Issue: "Already verified" on QR scan
- This is expected behavior (duplicate prevention)
- Check EventAttendance table to see existing record
- Each registration can only be verified once

### Issue: No events showing on browse page
- Create at least one event first
- Check event status is 'published' (not 'draft')
- Verify getPublishedEvents() action works in db:studio

### Issue: Images/videos not saving
- File upload is not yet implemented
- Only preview works currently
- TODO: Integrate Supabase Storage

## 🔧 Development Commands

```bash
# Start dev server
npm run dev

# Push schema changes to database
npm run db:push

# Open database studio
npm run db:studio

# Check for TypeScript errors
npm run typecheck

# Build for production
npm run build
```

## 📊 Quick Database Queries

### Check event count:
```sql
SELECT COUNT(*) FROM "Events";
```

### Check registrations:
```sql
SELECT e.title, COUNT(r.id) as registrations
FROM "Events" e
LEFT JOIN "EventRegistrations" r ON e.id = r."eventId"
GROUP BY e.id, e.title;
```

### Check verified attendance:
```sql
SELECT e.title, COUNT(a.id) as verified_attendees
FROM "Events" e
LEFT JOIN "EventAttendance" a ON e.id = a."eventId"
GROUP BY e.id, e.title;
```

## 🎯 Next Steps

### Recommended Order:
1. ✅ Test event creation
2. ✅ Test registration flow
3. ✅ Test QR verification
4. ✅ Check dashboard displays correctly
5. 🔜 Implement file upload for images/videos
6. 🔜 Add attendee count to event cards
7. 🔜 Create attendees list page for organizers
8. 🔜 Re-enable Google Maps when new key available

## 💡 Pro Tips

- Use Clerk's test accounts for testing different user roles
- Open browser DevTools Network tab to debug API calls
- Check browser console for error messages
- Use React DevTools to inspect component state
- Drizzle Studio is great for verifying data in real-time

## 📞 Need Help?

Check these files for implementation details:
- `src/db/schema.ts` - Database table definitions
- `src/db/actions.ts` - Server-side database functions
- `src/app/api/events/route.ts` - Main events API
- `src/app/api/events/[id]/verify/route.ts` - QR verification API
- `EVENT_SYSTEM_IMPLEMENTATION.md` - Detailed documentation

---

**Happy Testing! 🎉**
