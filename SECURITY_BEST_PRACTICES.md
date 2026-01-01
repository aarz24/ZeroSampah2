# ZeroSampah Security Best Practices

## Overview
This document outlines security measures implemented in ZeroSampah and best practices for maintaining security.

---

## Authentication & Authorization

### ✅ Implemented

1. **Clerk Authentication**
   - Industry-standard authentication provider
   - Secure session management
   - Multi-factor authentication support
   - Social login providers

2. **API Route Protection**
   - All sensitive endpoints require authentication
   - User context validated via Clerk's auth() function
   - JWT tokens validated on every request

3. **Webhook Verification**
   - Svix signature verification for Clerk webhooks
   - Prevents unauthorized webhook calls
   - Secret keys stored in environment variables

### 🔄 To Implement

1. **Role-Based Access Control (RBAC)**
   ```typescript
   // Add role field to Users table
   role: text('role').default('user') // user, collector, admin, organizer
   
   // Middleware for role checking
   export function requireRole(allowedRoles: string[]) {
     return async (req, res, next) => {
       const { userId } = await auth();
       const user = await getUserByClerkId(userId);
       
       if (!allowedRoles.includes(user.role)) {
         return res.status(403).json({ error: 'Forbidden' });
       }
       next();
     };
   }
   ```

2. **Admin-Only Endpoints**
   - Restrict reward creation to admins
   - Event moderation capabilities
   - User management endpoints

---

## Input Validation

### ✅ Implemented

1. **Validation Library** (`src/lib/validation/index.ts`)
   - Type-safe validation functions
   - Sanitization for XSS prevention
   - Format validation (email, URL, coordinates, dates)
   - Business logic validation (waste types, statuses, etc.)

2. **API Validation**
   - Rewards API validates inputs
   - Events API validates event data
   - Error messages don't expose system details

### 🔄 Best Practices

1. **Always Validate User Input**
   ```typescript
   import { validateCreateReport, createValidationErrorResponse } from '@/lib/validation';
   
   const validation = validateCreateReport(input);
   if (!validation.valid) {
     return NextResponse.json(
       createValidationErrorResponse(validation.errors),
       { status: 400 }
     );
   }
   ```

2. **Sanitize Before Storage**
   ```typescript
   import { sanitizeString } from '@/lib/validation';
   
   const cleanTitle = sanitizeString(userInput.title);
   ```

3. **Server-Side Validation**
   - Never trust client-side validation alone
   - Validate all inputs on the server
   - Re-validate before database operations

---

## SQL Injection Prevention

### ✅ Implemented

1. **Drizzle ORM**
   - Parameterized queries by default
   - Type-safe query builder
   - No raw SQL strings in application code

2. **Foreign Key Constraints**
   - Database-level referential integrity
   - Prevents orphaned records
   - Cascade deletes configured properly

### 🔄 Best Practices

```typescript
// ✅ GOOD: Using Drizzle ORM
const user = await db
  .select()
  .from(Users)
  .where(eq(Users.clerkId, userId));

// ❌ BAD: Raw SQL with string concatenation (NEVER DO THIS)
const user = await db.execute(`SELECT * FROM users WHERE clerk_id = '${userId}'`);

// ✅ GOOD: Even with raw SQL, use parameters
const user = await db.execute(
  sql`SELECT * FROM users WHERE clerk_id = ${userId}`
);
```

---

## Cross-Site Scripting (XSS) Prevention

### ✅ Implemented

1. **String Sanitization**
   - Removes HTML tags
   - Strips javascript: protocol
   - Removes event handlers (onclick, etc.)

2. **React Auto-Escaping**
   - React automatically escapes rendered content
   - dangerouslySetInnerHTML not used

### 🔄 Best Practices

1. **Never Use dangerouslySetInnerHTML**
   ```typescript
   // ❌ DANGEROUS
   <div dangerouslySetInnerHTML={{ __html: userContent }} />
   
   // ✅ SAFE
   <div>{userContent}</div>
   ```

2. **Sanitize User Content**
   ```typescript
   import { sanitizeString } from '@/lib/validation';
   
   const cleanDescription = sanitizeString(userInput.description);
   ```

3. **Content Security Policy**
   Add to `next.config.ts`:
   ```typescript
   async headers() {
     return [
       {
         source: '/:path*',
         headers: [
           {
             key: 'Content-Security-Policy',
             value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
           }
         ]
       }
     ];
   }
   ```

---

## Rate Limiting

### ✅ Implemented

1. **RateLimiter Class** (`src/lib/validation/index.ts`)
   - In-memory rate limiting
   - Configurable requests per time window
   - Automatic cleanup of old entries

### 🔄 To Implement

1. **Apply to Sensitive Endpoints**
   ```typescript
   import { RateLimiter } from '@/lib/validation';
   
   const limiter = new RateLimiter(10, 60000); // 10 requests per minute
   
   export async function POST(request: Request) {
     const { userId } = await auth();
     
     if (!limiter.check(userId)) {
       return NextResponse.json(
         { error: 'Rate limit exceeded' },
         { status: 429 }
       );
     }
     
     // ... rest of endpoint
   }
   ```

2. **Different Limits for Different Actions**
   - Rewards redemption: 5 per hour
   - Report creation: 20 per hour
   - Event creation: 3 per day
   - API queries: 100 per hour

3. **Redis-Based Rate Limiting** (Production)
   ```bash
   npm install @upstash/ratelimit @upstash/redis
   ```

---

## Data Protection

### ✅ Implemented

1. **Environment Variables**
   - All secrets in .env file
   - .env excluded from git
   - .env.example provided as template

2. **Database Encryption**
   - SSL/TLS for database connections
   - Connection strings secured
   - No sensitive data logged

### 🔄 Best Practices

1. **Never Log Sensitive Data**
   ```typescript
   // ❌ BAD
   console.log('User data:', { email, password, clerkId });
   
   // ✅ GOOD
   console.log('User created:', { clerkId });
   ```

2. **Encrypt Sensitive Fields**
   Consider encrypting:
   - Personal information (if stored)
   - Payment details (if applicable)
   - API keys in database

3. **Regular Key Rotation**
   - Rotate Clerk webhook secrets annually
   - Update API keys periodically
   - Generate new database passwords

---

## API Security

### ✅ Implemented

1. **HTTPS Enforcement**
   - Vercel enforces HTTPS automatically
   - Clerk requires HTTPS for webhooks

2. **CORS Configuration**
   - Next.js handles CORS
   - API routes protected by default

### 🔄 Best Practices

1. **API Versioning**
   ```typescript
   // Future: Add API versioning
   /api/v1/reports
   /api/v2/reports
   ```

2. **Request Size Limits**
   ```typescript
   export const config = {
     api: {
       bodyParser: {
         sizeLimit: '1mb', // Limit request body size
       },
     },
   };
   ```

3. **Error Handling**
   ```typescript
   // ❌ BAD: Exposes system details
   catch (error) {
     return NextResponse.json({ error: error.message }, { status: 500 });
   }
   
   // ✅ GOOD: Generic error message
   catch (error) {
     console.error('Internal error:', error);
     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
   }
   ```

---

## Database Security

### ✅ Implemented

1. **Foreign Key Constraints**
   - Referential integrity enforced
   - Cascade deletes configured
   - Orphaned records prevented

2. **Parameterized Queries**
   - Drizzle ORM prevents SQL injection
   - Type-safe operations

### 🔄 Row Level Security (RLS)

For Supabase deployments:

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Users can only read their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (clerk_id = auth.uid());

-- Users can only update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (clerk_id = auth.uid());

-- Reports are public for reading
CREATE POLICY "Reports are viewable by everyone" ON reports
  FOR SELECT USING (true);

-- Users can only insert their own reports
CREATE POLICY "Users can insert own reports" ON reports
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Events are public for reading
CREATE POLICY "Events are viewable by everyone" ON events
  FOR SELECT USING (status = 'published');

-- Only organizers can update their events
CREATE POLICY "Organizers can update own events" ON events
  FOR UPDATE USING (organizer_id = auth.uid());
```

---

## File Upload Security

### 🔄 To Implement

1. **File Type Validation**
   ```typescript
   const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
   
   if (!allowedTypes.includes(file.type)) {
     throw new Error('Invalid file type');
   }
   ```

2. **File Size Limits**
   ```typescript
   const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
   
   if (file.size > MAX_FILE_SIZE) {
     throw new Error('File too large');
   }
   ```

3. **Virus Scanning**
   - Integrate with ClamAV or similar
   - Scan uploads before storage
   - Quarantine suspicious files

4. **Secure Storage**
   - Use Supabase Storage or Cloudflare R2
   - Generate random filenames
   - Set proper access policies

---

## Monitoring & Logging

### 🔄 To Implement

1. **Error Tracking**
   ```bash
   npm install @sentry/nextjs
   ```

2. **Audit Logging**
   ```typescript
   // Log sensitive operations
   async function logAuditEvent(event: {
     userId: string;
     action: string;
     resource: string;
     timestamp: Date;
   }) {
     await db.insert(AuditLog).values(event);
   }
   
   // Example usage
   await redeemReward(userId, rewardId);
   await logAuditEvent({
     userId,
     action: 'REDEEM_REWARD',
     resource: `reward:${rewardId}`,
     timestamp: new Date()
   });
   ```

3. **Security Alerts**
   - Alert on multiple failed login attempts
   - Monitor unusual API activity
   - Track privilege escalation attempts

---

## Dependency Security

### 🔄 Best Practices

1. **Regular Updates**
   ```bash
   # Check for vulnerabilities
   npm audit
   
   # Fix automatically
   npm audit fix
   
   # Update dependencies
   npm update
   ```

2. **Automated Scanning**
   - Enable Dependabot on GitHub
   - Set up automated security patches
   - Review dependency changes

3. **Minimal Dependencies**
   - Only install necessary packages
   - Regularly review and remove unused dependencies
   - Prefer well-maintained packages

---

## Incident Response

### Preparation

1. **Security Contact**
   - Designate security point of contact
   - Create security@zerosampah.com email

2. **Response Plan**
   - Document steps for common incidents
   - Define escalation procedures
   - Maintain contact list

### In Case of Breach

1. **Immediate Actions**
   - Rotate all API keys and secrets
   - Review access logs
   - Identify affected users
   - Contain the breach

2. **Communication**
   - Notify affected users
   - Disclose timeline and impact
   - Provide remediation steps

3. **Post-Incident**
   - Conduct root cause analysis
   - Implement preventive measures
   - Update security documentation

---

## Security Checklist

### Before Deployment

- [ ] All secrets in environment variables
- [ ] HTTPS enforced
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection protection verified
- [ ] XSS prevention implemented
- [ ] Authentication required for sensitive endpoints
- [ ] Error messages don't expose system details
- [ ] Dependencies up to date
- [ ] Security headers configured
- [ ] CORS properly configured
- [ ] File uploads secured (if applicable)

### Regular Maintenance

- [ ] Weekly: Review error logs
- [ ] Monthly: Update dependencies
- [ ] Quarterly: Security audit
- [ ] Yearly: Penetration testing
- [ ] Yearly: Key rotation

---

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [Clerk Security](https://clerk.com/docs/security/overview)
- [Drizzle ORM Security](https://orm.drizzle.team/docs/sql)

---

Last Updated: January 2026
