# ZeroSampah Development Setup Guide

## Overview
This guide will help you set up the ZeroSampah project for local development on your machine.

---

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

1. **Node.js** (v20 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

3. **Git**
   - Download from: https://git-scm.com/
   - Verify installation: `git --version`

### Required Accounts

1. **PostgreSQL Database**
   - [Neon](https://neon.tech) (Recommended - Free tier available)
   - [Supabase](https://supabase.com) (Alternative - Free tier available)
   - Or any PostgreSQL provider

2. **Clerk** (Authentication)
   - Sign up at: https://clerk.com
   - Free tier: 10,000 monthly active users

3. **Google Cloud** (For Gemini AI)
   - Sign up at: https://console.cloud.google.com
   - Enable Generative AI API
   - Get API key from: https://makersuite.google.com/app/apikey

---

## Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/aarz24/ZeroSampah2.git

# Navigate to project directory
cd ZeroSampah2

# Check current branch
git branch
```

---

## Step 2: Install Dependencies

```bash
# Install all dependencies
npm install

# This will install:
# - Next.js 16
# - React 19
# - Drizzle ORM
# - Clerk SDK
# - Google Gemini SDK
# - And all other dependencies
```

---

## Step 3: Set Up Database

### Option A: Using Neon (Recommended)

1. Go to https://neon.tech and sign up
2. Create a new project
3. Note your database connection string
4. It should look like:
   ```
   postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
   ```

### Option B: Using Supabase

1. Go to https://supabase.com and sign up
2. Create a new project
3. Go to Settings → Database
4. Copy the "Connection string" (Direct connection)
5. It should look like:
   ```
   postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres
   ```

### Option C: Local PostgreSQL

If you want to run PostgreSQL locally:

```bash
# macOS (using Homebrew)
brew install postgresql@16
brew services start postgresql@16

# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql

# Windows
# Download installer from: https://www.postgresql.org/download/windows/

# Create database
createdb zerosampah

# Connection string
postgresql://localhost:5432/zerosampah
```

---

## Step 4: Set Up Clerk Authentication

1. **Create Clerk Application**
   - Go to https://dashboard.clerk.com
   - Click "Add application"
   - Name it "ZeroSampah Dev"
   - Choose authentication methods (Email, Google, etc.)

2. **Get API Keys**
   - In Clerk Dashboard, go to "API Keys"
   - Copy:
     - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_test_`)
     - `CLERK_SECRET_KEY` (starts with `sk_test_`)

3. **Configure URLs**
   - In Clerk Dashboard, go to "Paths"
   - Set Sign-in URL: `/sign-in`
   - Set Sign-up URL: `/sign-up`
   - Set After sign-in URL: `/dashboard`
   - Set After sign-out URL: `/`

4. **Set Up Webhooks** (Optional for local dev)
   - In Clerk Dashboard, go to "Webhooks"
   - Add endpoint: `http://localhost:3000/api/webhooks/user`
   - Subscribe to: `user.created`, `user.updated`, `user.deleted`
   - Copy webhook secret
   - For local testing, use ngrok: `npx ngrok http 3000`

---

## Step 5: Get Google Gemini API Key

1. Go to https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Get API Key" or "Create API Key"
4. Copy the API key

---

## Step 6: Configure Environment Variables

1. **Copy the example file**
   ```bash
   cp .env.example .env
   ```

2. **Edit .env file**
   ```bash
   # Open in your text editor
   nano .env
   # or
   code .env  # VS Code
   # or
   vim .env
   ```

3. **Fill in your values**
   ```env
   # Database
   DATABASE_URL=postgresql://your_database_connection_string
   
   # Clerk
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
   CLERK_SECRET_KEY=sk_test_xxxxx
   
   # Clerk Webhooks (optional for local dev)
   CLERK_WEBHOOK_SECRET_USER=whsec_xxxxx
   CLERK_WEBHOOK_SECRET_SESSION=whsec_xxxxx
   
   # Google Gemini
   GEMINI_API_KEY=your_gemini_api_key
   
   # App URL
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   
   # Environment
   NODE_ENV=development
   ```

4. **Save the file**

---

## Step 7: Initialize Database

```bash
# Push database schema to your database
npm run db:push

# This will create all tables:
# - users
# - reports
# - rewards
# - collected_wastes
# - notifications
# - transactions
# - events
# - event_registrations
# - event_attendance
```

### Verify Database Schema

```bash
# Open Drizzle Studio to view your database
npm run db:studio

# This opens a browser at http://localhost:4983
# You can view and edit data visually
```

---

## Step 8: Seed Database (Optional)

Add sample data to your database:

```bash
npm run db:seed

# This will add:
# - 10 sample rewards
# - (Add more seed data as needed)
```

---

## Step 9: Run Development Server

```bash
# Start the development server
npm run dev

# The app will start at http://localhost:3000
```

You should see output like:
```
   ▲ Next.js 16.0.7
   - Local:        http://localhost:3000
   - Environments: .env

 ✓ Ready in 2.3s
```

---

## Step 10: Test the Application

1. **Open your browser**
   - Navigate to http://localhost:3000

2. **Sign Up/Sign In**
   - Click "Sign In" or "Sign Up"
   - Create an account using Clerk

3. **Test Features**
   - Submit a waste report
   - View leaderboard
   - Browse events
   - Check rewards

---

## Development Workflow

### Running the App

```bash
# Start development server
npm run dev

# In a separate terminal, open Drizzle Studio
npm run db:studio
```

### Making Changes

1. **Code Changes**
   - Edit files in `src/` directory
   - Changes auto-reload in browser (Hot Module Replacement)

2. **Database Changes**
   - Edit `src/db/schema.ts`
   - Run `npm run db:push` to apply changes

3. **API Changes**
   - Edit files in `src/app/api/`
   - Test with browser or API client (Postman, Thunder Client)

### Testing

```bash
# Run API tests
node scripts/test-api-comprehensive.js

# Test database connection
node test-connection.js

# Test Gemini AI
node test-gemini.js
```

### Linting and Type Checking

```bash
# Run ESLint
npm run lint

# Run TypeScript type checking
npm run typecheck
```

---

## Common Issues & Solutions

### Issue: "Cannot find module 'dotenv/config'"

**Solution:** The drizzle.config.ts was already fixed. If you still see this:
```bash
npm install dotenv
```

### Issue: Database connection fails

**Solution:** 
1. Check DATABASE_URL is correct
2. Ensure database allows connections from your IP
3. For local PostgreSQL, check if service is running:
   ```bash
   # macOS
   brew services list
   
   # Ubuntu
   sudo systemctl status postgresql
   ```

### Issue: Clerk authentication not working

**Solution:**
1. Verify Clerk keys in .env
2. Check Clerk Dashboard URLs are configured
3. Clear browser cookies and cache
4. Ensure you're using test keys for development

### Issue: "Error: listen EADDRINUSE: address already in use :::3000"

**Solution:** Port 3000 is already in use
```bash
# Find and kill process using port 3000
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use a different port
npm run dev -- -p 3001
```

### Issue: Build fails with TypeScript errors

**Solution:**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try build again
npm run build
```

---

## Project Structure

```
ZeroSampah2/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API routes
│   │   ├── dashboard/      # Dashboard page
│   │   ├── events/         # Events pages
│   │   ├── leaderboard/    # Leaderboard page
│   │   ├── report/         # Report submission
│   │   └── ...             # Other pages
│   ├── components/         # React components
│   ├── db/                 # Database layer
│   │   ├── schema.ts       # Drizzle schema
│   │   ├── actions.ts      # Database operations
│   │   └── index.ts        # Database connection
│   ├── hooks/              # Custom React hooks
│   └── lib/                # Utility functions
│       └── validation/     # Input validation
├── public/                 # Static assets
├── scripts/                # Utility scripts
├── .env                    # Environment variables (not in git)
├── .env.example            # Environment template
├── drizzle.config.ts       # Drizzle ORM config
├── next.config.ts          # Next.js config
├── package.json            # Dependencies
└── tsconfig.json           # TypeScript config
```

---

## Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run ESLint
npm run typecheck        # Run TypeScript checker

# Database
npm run db:push          # Push schema to database
npm run db:studio        # Open Drizzle Studio
npm run db:seed          # Seed database with sample data

# Testing
node scripts/test-api-comprehensive.js
node test-connection.js
node test-gemini.js
```

---

## Next Steps

1. **Explore the Codebase**
   - Read through `src/app/` for pages
   - Check `src/db/actions.ts` for database operations
   - Review API routes in `src/app/api/`

2. **Read Documentation**
   - [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
   - [DATABASE_DOCUMENTATION.md](./DATABASE_DOCUMENTATION.md)
   - [SECURITY_BEST_PRACTICES.md](./SECURITY_BEST_PRACTICES.md)

3. **Start Building**
   - Try adding a new feature
   - Create a new API endpoint
   - Add a new page

4. **Join the Community**
   - Report issues on GitHub
   - Contribute improvements
   - Help other developers

---

## Getting Help

- **Documentation**: Check the docs in this repository
- **Clerk Docs**: https://clerk.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Drizzle ORM**: https://orm.drizzle.team

---

Happy Coding! 🚀

Last Updated: January 2026
