# ZeroSampah Deployment Guide

## Overview
This guide will help you deploy the ZeroSampah platform to production. The application can be deployed to various platforms including Vercel, Netlify, or any Node.js hosting provider.

---

## Prerequisites

Before deploying, ensure you have:

1. **Database**: PostgreSQL database (Neon, Supabase, or any PostgreSQL provider)
2. **Clerk Account**: For authentication (https://clerk.com)
3. **Google Gemini API**: For AI features (https://makersuite.google.com)
4. **Domain** (optional): Custom domain for your application

---

## Environment Variables

Create a `.env` file or set environment variables in your deployment platform with the following:

### Required Variables

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
CLERK_SECRET_KEY=sk_live_xxxxx

# Clerk Webhooks
CLERK_WEBHOOK_SECRET_USER=whsec_xxxxx
CLERK_WEBHOOK_SECRET_SESSION=whsec_xxxxx

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Application URL
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Optional Variables

```bash
# Google Maps (for map features)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key

# Mapbox (alternative to Google Maps)
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token

# Node Environment
NODE_ENV=production
```

---

## Database Setup

### 1. Create Database

Choose a PostgreSQL provider:

#### Option A: Neon (Recommended)
1. Go to https://neon.tech
2. Create a new project
3. Copy the connection string
4. Set `DATABASE_URL` environment variable

#### Option B: Supabase
1. Go to https://supabase.com
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string (Direct connection)
5. Set `DATABASE_URL` environment variable

#### Option C: Any PostgreSQL Provider
- Ensure PostgreSQL version 12 or higher
- Enable SSL connections
- Note the connection string format: `postgresql://user:password@host:5432/database`

### 2. Push Database Schema

```bash
# Install dependencies
npm install

# Push schema to database
npm run db:push

# Seed initial data (rewards catalog)
npm run db:seed
```

### 3. Verify Schema

```bash
# Open Drizzle Studio to verify tables
npm run db:studio
```

Expected tables:
- users
- reports
- rewards
- collected_wastes
- notifications
- transactions
- events
- event_registrations
- event_attendance

---

## Clerk Setup

### 1. Create Clerk Application

1. Go to https://dashboard.clerk.com
2. Create a new application
3. Choose "Next.js" as the framework
4. Note your API keys

### 2. Configure Authentication

1. **Enable Social Providers** (optional):
   - Google
   - Facebook
   - Twitter

2. **Configure Email/Password**:
   - Enable email verification
   - Set password requirements

### 3. Set Up Webhooks

#### User Webhook
1. Go to Webhooks in Clerk Dashboard
2. Create endpoint: `https://your-domain.com/api/webhooks/user`
3. Subscribe to events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
4. Copy the webhook secret
5. Set `CLERK_WEBHOOK_SECRET_USER` environment variable

#### Session Webhook (optional)
1. Create endpoint: `https://your-domain.com/api/webhooks/session`
2. Subscribe to session events
3. Set `CLERK_WEBHOOK_SECRET_SESSION` environment variable

### 4. Configure URLs

In Clerk Dashboard → Paths:
- Homepage: `https://your-domain.com`
- Sign in: `https://your-domain.com/sign-in`
- Sign up: `https://your-domain.com/sign-up`
- After sign in: `https://your-domain.com/dashboard`
- After sign out: `https://your-domain.com`

---

## Google Gemini Setup

1. Go to https://makersuite.google.com/app/apikey
2. Create a new API key
3. Set `GEMINI_API_KEY` environment variable
4. Test the API:
   ```bash
   node test-gemini.js
   ```

---

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the recommended platform for Next.js applications.

#### Steps:

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Set Environment Variables**:
   ```bash
   # Via CLI
   vercel env add DATABASE_URL
   vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
   # ... add all required variables

   # Or via Vercel Dashboard:
   # Project Settings → Environment Variables
   ```

5. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

#### Auto-Deploy from GitHub:

1. Push your code to GitHub
2. Import project in Vercel Dashboard
3. Connect GitHub repository
4. Set environment variables
5. Deploy

**Vercel Configuration** (`vercel.json`):
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "framework": "nextjs",
  "installCommand": "npm install"
}
```

---

### Option 2: Netlify

1. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`

2. **Environment Variables**:
   Add all required variables in Site Settings → Environment Variables

3. **Deploy**:
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod
   ```

---

### Option 3: Self-Hosted (Docker)

#### Dockerfile:
```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
```

#### docker-compose.yml:
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      - CLERK_SECRET_KEY=${CLERK_SECRET_KEY}
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    restart: unless-stopped
```

#### Deploy:
```bash
docker-compose up -d
```

---

## Post-Deployment Checklist

### 1. Test Core Features

- [ ] User registration and login
- [ ] Report submission
- [ ] Waste collection
- [ ] Rewards redemption
- [ ] Event creation
- [ ] Event registration
- [ ] QR code verification
- [ ] Leaderboard display

### 2. Verify Webhooks

Test Clerk webhooks:
```bash
# Check webhook logs in Clerk Dashboard
# Create a test user
# Verify user appears in database
```

### 3. Test Database Connection

```bash
# Run connection test
node test-connection.js

# Check database logs
# Verify all tables exist
```

### 4. Performance Check

- [ ] Page load times < 3 seconds
- [ ] API response times < 1 second
- [ ] Image optimization enabled
- [ ] Caching configured

### 5. Security Audit

- [ ] SSL/TLS certificate installed
- [ ] HTTPS enforced
- [ ] Environment variables secured
- [ ] API keys not exposed in client
- [ ] CORS properly configured
- [ ] Rate limiting enabled (optional)

---

## Monitoring & Logging

### Vercel Analytics

Enable in Vercel Dashboard:
- Analytics
- Speed Insights
- Web Vitals

### Error Tracking

Consider integrating:
- Sentry (https://sentry.io)
- LogRocket (https://logrocket.com)
- Datadog (https://www.datadoghq.com)

### Database Monitoring

- Monitor connection pool
- Track slow queries
- Set up alerts for errors

---

## Scaling Considerations

### Database

- **Connection Pooling**: Configure max connections
- **Read Replicas**: For high-traffic scenarios
- **Indexes**: Ensure proper indexes (see DATABASE_DOCUMENTATION.md)
- **Caching**: Implement Redis for frequently accessed data

### Application

- **CDN**: Use Vercel's CDN or Cloudflare
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic with Next.js
- **API Routes**: Consider moving to serverless functions

### Cost Optimization

- **Free Tiers**:
  - Vercel: 100GB bandwidth
  - Neon: 10GB storage
  - Clerk: 10,000 MAU (Monthly Active Users)

- **Paid Plans** (when needed):
  - Vercel Pro: $20/month
  - Neon Scale: $19/month
  - Clerk Pro: $25/month

---

## Backup Strategy

### Database Backups

```bash
# Daily automated backups (cron job)
0 2 * * * pg_dump $DATABASE_URL > /backups/zerosampah_$(date +\%Y\%m\%d).sql

# Retention: 30 days
find /backups -name "zerosampah_*.sql" -mtime +30 -delete
```

### Application Backups

- Code: Version controlled in Git
- Environment: Document in password manager
- Media: Backup uploaded images/videos

---

## Rollback Procedure

If deployment fails:

### Vercel
```bash
# Redeploy previous version
vercel --prod --force
```

### Database
```bash
# Restore from backup
psql $DATABASE_URL < backup_20240101.sql
```

### Code
```bash
# Revert to previous commit
git revert HEAD
git push
```

---

## Troubleshooting

### Build Failures

```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Database Connection Errors

- Verify `DATABASE_URL` is correct
- Check SSL settings: `?sslmode=require`
- Ensure database is accessible from deployment server
- Check connection pool limits

### Authentication Issues

- Verify Clerk API keys
- Check webhook URLs are accessible
- Ensure HTTPS is enabled
- Verify redirect URLs in Clerk Dashboard

### API Errors

- Check server logs
- Verify environment variables
- Test endpoints with curl/Postman
- Check CORS configuration

---

## Support & Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Clerk Docs**: https://clerk.com/docs
- **Drizzle ORM**: https://orm.drizzle.team
- **Vercel Support**: https://vercel.com/support
- **Neon Docs**: https://neon.tech/docs

---

## Maintenance

### Regular Tasks

- **Weekly**: Check error logs
- **Monthly**: Review performance metrics
- **Quarterly**: Security audit
- **Yearly**: Dependency updates

### Updates

```bash
# Update dependencies
npm update

# Check for security vulnerabilities
npm audit
npm audit fix

# Update Next.js
npm install next@latest react@latest react-dom@latest
```

---

Last Updated: January 2026
