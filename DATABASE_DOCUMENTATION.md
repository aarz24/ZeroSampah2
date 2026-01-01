# ZeroSampah Database Schema Documentation

## Overview
This document describes the database schema for the ZeroSampah platform, including table structures, relationships, and indexes.

**Database Type**: PostgreSQL  
**ORM**: Drizzle ORM  
**Provider**: Neon/Supabase (configurable via DATABASE_URL)

---

## Entity Relationship Diagram

```
Users (1) ──────< Reports (N)
  │                  │
  │                  └──< CollectedWastes (N)
  │
  ├──────< Events (N) - organized by user
  │         │
  │         └──< EventRegistrations (N)
  │                  │
  │                  └──< EventAttendance (N)
  │
  ├──────< Notifications (N)
  │
  └──────< Transactions (N)
           │
           └──> Rewards (N) - optional FK
```

---

## Tables

### 1. Users

Stores user account information synced from Clerk authentication.

**Schema:**
```typescript
{
  clerkId: text (PRIMARY KEY),
  email: text (UNIQUE, NOT NULL),
  fullName: text,
  profileImage: text,
  points: integer (DEFAULT 0),
  createdAt: timestamp (DEFAULT NOW()),
  updatedAt: timestamp (DEFAULT NOW())
}
```

**Indexes:**
- Primary Key: `clerkId`
- Unique: `email`
- Index on `points` for leaderboard queries

**Business Logic:**
- Points are earned by submitting reports and collecting waste
- Points are spent by redeeming rewards
- Users are created automatically via Clerk webhook

**Sample Data:**
```sql
INSERT INTO users (clerk_id, email, full_name, points) VALUES
  ('user_123abc', 'john@example.com', 'John Doe', 150),
  ('user_456def', 'jane@example.com', 'Jane Smith', 300);
```

---

### 2. Reports

Waste reports submitted by users.

**Schema:**
```typescript
{
  id: serial (PRIMARY KEY),
  userId: text (FK -> Users.clerkId, CASCADE DELETE),
  location: text (NOT NULL),
  wasteType: text (NOT NULL),
  amount: text (NOT NULL),
  imageUrl: text,
  verificationResult: text, // JSON string
  status: text (DEFAULT 'pending'), // pending, in_progress, collected, verified, rejected
  collectorId: text (FK -> Users.clerkId, SET NULL),
  createdAt: timestamp (DEFAULT NOW()),
  updatedAt: timestamp (DEFAULT NOW())
}
```

**Indexes:**
- Primary Key: `id`
- Foreign Keys: `userId`, `collectorId`
- Index on `status` for filtering
- Index on `createdAt` for sorting

**Status Flow:**
1. `pending`: Just reported, awaiting collection
2. `in_progress`: Claimed by a collector
3. `collected`: Collection completed
4. `verified`: AI/moderator verified
5. `rejected`: Failed verification

**Sample Data:**
```sql
INSERT INTO reports (user_id, location, waste_type, amount, status) VALUES
  ('user_123abc', 'Jakarta Selatan', 'Plastic', '5kg', 'pending'),
  ('user_456def', 'Jakarta Pusat', 'Glass', '3kg', 'collected');
```

---

### 3. Rewards

Catalog of rewards that users can redeem with points.

**Schema:**
```typescript
{
  id: serial (PRIMARY KEY),
  name: text (NOT NULL),
  description: text,
  pointsRequired: integer (NOT NULL),
  imageUrl: text,
  stock: integer (DEFAULT 0),
  createdAt: timestamp (DEFAULT NOW())
}
```

**Indexes:**
- Primary Key: `id`
- Index on `pointsRequired` for filtering

**Sample Data:**
```sql
INSERT INTO rewards (name, description, points_required, stock) VALUES
  ('Voucher Makanan Rp 25.000', 'Voucher makan di restoran partner', 100, 50),
  ('Tas Belanja Ramah Lingkungan', 'Tas dari bahan daur ulang', 150, 100);
```

---

### 4. CollectedWastes

Records of waste collections by collectors.

**Schema:**
```typescript
{
  id: serial (PRIMARY KEY),
  reportId: integer (FK -> Reports.id, CASCADE DELETE),
  collectorId: text (FK -> Users.clerkId, CASCADE DELETE),
  collectionDate: timestamp (DEFAULT NOW()),
  status: text (DEFAULT 'collected'), // collected, verified, rejected
  comment: text,
  createdAt: timestamp (DEFAULT NOW())
}
```

**Indexes:**
- Primary Key: `id`
- Foreign Keys: `reportId`, `collectorId`
- Index on `collectorId` for user queries

**Sample Data:**
```sql
INSERT INTO collected_wastes (report_id, collector_id, comment) VALUES
  (1, 'user_456def', 'Collected plastic bottles'),
  (2, 'user_123abc', 'Collected glass containers');
```

---

### 5. Notifications

User notifications for various events.

**Schema:**
```typescript
{
  id: serial (PRIMARY KEY),
  userId: text (FK -> Users.clerkId, CASCADE DELETE),
  message: text (NOT NULL),
  type: text (DEFAULT 'info'), // info, success, warning, error, reward
  isRead: boolean (DEFAULT false),
  createdAt: timestamp (DEFAULT NOW())
}
```

**Indexes:**
- Primary Key: `id`
- Foreign Key: `userId`
- Index on `userId, isRead` for unread queries

**Sample Data:**
```sql
INSERT INTO notifications (user_id, message, type) VALUES
  ('user_123abc', 'Your report has been verified!', 'success'),
  ('user_456def', 'You earned 10 points!', 'reward');
```

---

### 6. Transactions

History of points earned and spent.

**Schema:**
```typescript
{
  id: serial (PRIMARY KEY),
  userId: text (FK -> Users.clerkId, CASCADE DELETE),
  rewardId: integer (FK -> Rewards.id, SET NULL),
  pointsUsed: integer (NOT NULL),
  transactionType: text (NOT NULL), // earned, redeemed
  description: text,
  createdAt: timestamp (DEFAULT NOW())
}
```

**Indexes:**
- Primary Key: `id`
- Foreign Keys: `userId`, `rewardId`
- Index on `userId, transactionType` for filtering
- Index on `createdAt` for sorting

**Sample Data:**
```sql
INSERT INTO transactions (user_id, points_used, transaction_type, description) VALUES
  ('user_123abc', 10, 'earned', 'Points earned for reporting waste'),
  ('user_456def', 100, 'redeemed', 'Redeemed: Voucher Makanan');
```

---

### 7. Events

Community cleanup events organized by users.

**Schema:**
```typescript
{
  id: serial (PRIMARY KEY),
  organizerId: text (FK -> Users.clerkId, CASCADE DELETE),
  title: text (NOT NULL),
  description: text,
  location: text (NOT NULL),
  latitude: text,
  longitude: text,
  eventDate: timestamp (NOT NULL),
  eventTime: text (NOT NULL),
  wasteCategories: text[], // array of waste types
  status: text (DEFAULT 'published'), // published, cancelled, completed
  maxParticipants: integer,
  rewardInfo: text,
  images: text[], // array of image URLs
  videos: text[], // array of video URLs
  createdAt: timestamp (DEFAULT NOW()),
  updatedAt: timestamp (DEFAULT NOW())
}
```

**Indexes:**
- Primary Key: `id`
- Foreign Key: `organizerId`
- Index on `status, eventDate` for filtering
- Index on `eventDate` for sorting

**Sample Data:**
```sql
INSERT INTO events (organizer_id, title, location, event_date, event_time) VALUES
  ('user_123abc', 'Bersih-Bersih Pantai', 'Pantai Ancol', '2024-02-01', '08:00'),
  ('user_456def', 'Tanam Pohon Bersama', 'Taman Kota', '2024-02-15', '07:00');
```

---

### 8. EventRegistrations

User registrations for events with QR codes.

**Schema:**
```typescript
{
  id: serial (PRIMARY KEY),
  eventId: integer (FK -> Events.id, CASCADE DELETE),
  userId: text (FK -> Users.clerkId, CASCADE DELETE),
  qrCode: text (UNIQUE, NOT NULL), // format: "EVENT:{eventId}:{userId}:{timestamp}"
  registeredAt: timestamp (DEFAULT NOW()),
  status: text (DEFAULT 'registered') // registered, cancelled
}
```

**Indexes:**
- Primary Key: `id`
- Foreign Keys: `eventId`, `userId`
- Unique: `qrCode`
- Index on `eventId, userId` for lookups
- Index on `userId` for user's events

**QR Code Format:**
```
EVENT:{eventId}:{userId}:{timestamp}
Example: EVENT:1:user_123abc:1704067200000
```

**Sample Data:**
```sql
INSERT INTO event_registrations (event_id, user_id, qr_code) VALUES
  (1, 'user_456def', 'EVENT:1:user_456def:1704067200000'),
  (2, 'user_123abc', 'EVENT:2:user_123abc:1704153600000');
```

---

### 9. EventAttendance

Verified attendance records after QR code scanning.

**Schema:**
```typescript
{
  id: serial (PRIMARY KEY),
  eventId: integer (FK -> Events.id, CASCADE DELETE),
  userId: text (FK -> Users.clerkId, CASCADE DELETE),
  registrationId: integer (FK -> EventRegistrations.id, CASCADE DELETE),
  verifiedBy: text (FK -> Users.clerkId, SET NULL), // organizer who scanned
  verifiedAt: timestamp (DEFAULT NOW()),
  qrCodeScanned: text (NOT NULL)
}
```

**Indexes:**
- Primary Key: `id`
- Foreign Keys: `eventId`, `userId`, `registrationId`, `verifiedBy`
- Unique constraint on `eventId, userId` to prevent duplicate scans

**Sample Data:**
```sql
INSERT INTO event_attendance (event_id, user_id, registration_id, verified_by, qr_code_scanned) VALUES
  (1, 'user_456def', 1, 'user_123abc', 'EVENT:1:user_456def:1704067200000');
```

---

## Database Functions & Triggers

### Auto-update Updated_at Timestamp

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reports_updated_at 
  BEFORE UPDATE ON reports 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at 
  BEFORE UPDATE ON events 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
```

---

## Performance Optimization

### Recommended Indexes

```sql
-- Users table
CREATE INDEX idx_users_points ON users(points DESC);

-- Reports table
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_user_id ON reports(user_id);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);
CREATE INDEX idx_reports_collector_id ON reports(collector_id);

-- Events table
CREATE INDEX idx_events_organizer_id ON events(organizer_id);
CREATE INDEX idx_events_event_date ON events(event_date);
CREATE INDEX idx_events_status ON events(status);

-- Event Registrations
CREATE INDEX idx_event_registrations_user_id ON event_registrations(user_id);
CREATE INDEX idx_event_registrations_event_id ON event_registrations(event_id);

-- Transactions
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(transaction_type);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);

-- Notifications
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read);
```

---

## Migration Commands

### Push Schema to Database
```bash
npm run db:push
```

### Open Database Studio
```bash
npm run db:studio
```

### Seed Database
```bash
npm run db:seed
```

---

## Backup & Recovery

### Backup Database
```bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore Database
```bash
psql $DATABASE_URL < backup_20240101_120000.sql
```

---

## Security Considerations

1. **Parameterized Queries**: Drizzle ORM handles SQL injection prevention
2. **Foreign Key Constraints**: Maintain referential integrity
3. **Cascade Deletes**: Automatically clean up related records
4. **Row Level Security**: Consider implementing RLS in Supabase
5. **Audit Logs**: Add audit logging for sensitive operations

### Recommended RLS Policies (Supabase)

```sql
-- Users can only read their own data
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (clerk_id = current_setting('request.jwt.claims')::json->>'sub');

-- Reports are public for reading, but only owner can update
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reports are viewable by everyone" ON reports
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own reports" ON reports
  FOR INSERT WITH CHECK (user_id = current_setting('request.jwt.claims')::json->>'sub');
```

---

## Data Retention Policy

Consider implementing:
- Archive old reports after 1 year
- Delete cancelled event registrations after 30 days
- Purge read notifications after 90 days
- Keep transaction history indefinitely for audit purposes

---

## Common Queries

### Get User Leaderboard
```typescript
const leaderboard = await db
  .select({
    clerkId: Users.clerkId,
    fullName: Users.fullName,
    points: Users.points,
  })
  .from(Users)
  .orderBy(desc(Users.points))
  .limit(100);
```

### Get Pending Reports
```typescript
const pendingReports = await db
  .select()
  .from(Reports)
  .where(eq(Reports.status, 'pending'))
  .orderBy(desc(Reports.createdAt));
```

### Get User Statistics
```typescript
const stats = await getUserStats(userId);
```

---

## Troubleshooting

### Connection Issues
```bash
# Test database connection
node test-connection.js

# Check DATABASE_URL
echo $DATABASE_URL
```

### Schema Sync Issues
```bash
# Reset and push schema
npm run db:push

# If needed, manually drop all tables and re-push
```

### Performance Issues
```bash
# Check query performance in Drizzle Studio
npm run db:studio

# Analyze slow queries
EXPLAIN ANALYZE <your-query>;
```

---

## Future Enhancements

1. **Full-text Search**: Add search indexes for reports and events
2. **Geospatial Queries**: Use PostGIS for location-based searches
3. **Analytics Tables**: Create summary tables for dashboards
4. **Archive Tables**: Move old data to archive tables
5. **Partitioning**: Partition large tables by date

---

Last Updated: January 2026
