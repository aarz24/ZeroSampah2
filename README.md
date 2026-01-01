# ZeroSampah

A comprehensive waste reporting, collection, and rewards web application with community cleanup events. Users can submit waste reports, view analytics, track collections, earn rewards, and participate in community environmental initiatives.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![React](https://img.shields.io/badge/React-19.0-blue)

---

## 🌟 Features

### Core Features
- ✅ **User Authentication** - Secure auth with Clerk (email, social login, MFA)
- ✅ **Waste Report Submission** - AI-powered waste verification with Google Gemini
- ✅ **Real-time Dashboard** - View recent reports, stats, and analytics
- ✅ **Rewards System** - Earn points for reporting and collecting waste
- ✅ **Leaderboard** - Competitive rankings based on environmental contributions
- ✅ **Waste Collection** - Track and manage waste collection tasks
- ✅ **Report Details** - Detailed view of each waste report with verification

### Community Features
- ✅ **Community Cleanup Events** - Organize and join environmental cleanup activities
- ✅ **QR Code System** - Secure event registration and attendance verification
- ✅ **Event Dashboard** - Manage organized and joined events
- ✅ **Event Discovery** - Browse upcoming cleanup events in your area
- ✅ **Attendance Tracking** - Verify participants with QR code scanning

### Technical Features
- ✅ **Responsive Design** - Mobile-first, works on all devices
- ✅ **Real-time Updates** - Live notifications and status updates
- ✅ **Secure API** - Input validation, sanitization, and rate limiting
- ✅ **Type Safety** - Full TypeScript implementation
- ✅ **Database ORM** - Drizzle ORM with PostgreSQL

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ and npm
- PostgreSQL database (Neon, Supabase, or local)
- Clerk account for authentication
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aarz24/ZeroSampah2.git
   cd ZeroSampah2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

4. **Initialize database**
   ```bash
   npm run db:push
   npm run db:seed  # Optional: Add sample rewards
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

For detailed setup instructions, see [DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md)

---

## 📚 Documentation

- **[Development Setup](./DEVELOPMENT_SETUP.md)** - Complete guide to set up the project locally
- **[API Documentation](./API_DOCUMENTATION.md)** - REST API endpoints and usage examples
- **[Database Schema](./DATABASE_DOCUMENTATION.md)** - Database structure and relationships
- **[Deployment Guide](./DEPLOYMENT_GUIDE.md)** - Step-by-step deployment to production
- **[Security Best Practices](./SECURITY_BEST_PRACTICES.md)** - Security guidelines and implementation

---

## 🏗️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Lottie React** - Animated illustrations

### Backend
- **Next.js API Routes** - Serverless functions
- **Drizzle ORM** - Type-safe database queries
- **PostgreSQL** - Relational database
- **Clerk** - Authentication and user management

### AI & Maps
- **Google Gemini** - AI-powered waste verification
- **Leaflet** - Interactive maps
- **React Google Maps** - Google Maps integration
- **Mapbox** - Alternative map provider

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **Drizzle Kit** - Database migrations
- **tsx** - TypeScript execution

---

## 📁 Project Structure

```
ZeroSampah2/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── events/        # Events CRUD
│   │   │   ├── reports/       # Waste reports
│   │   │   ├── rewards/       # Rewards system
│   │   │   ├── users/         # User management
│   │   │   └── webhooks/      # Clerk webhooks
│   │   ├── dashboard/         # User dashboard
│   │   ├── events/            # Community events
│   │   ├── leaderboard/       # Rankings
│   │   └── ...                # Other pages
│   ├── components/            # React components
│   │   ├── QRCodeDisplay.tsx  # QR code generator
│   │   ├── QRScanner.tsx      # QR code scanner
│   │   └── ...                # UI components
│   ├── db/                    # Database layer
│   │   ├── schema.ts          # Drizzle schema
│   │   ├── actions.ts         # Database operations
│   │   └── index.ts           # DB connection
│   ├── hooks/                 # Custom React hooks
│   └── lib/                   # Utilities
│       ├── validation/        # Input validation
│       ├── utils.ts           # Helper functions
│       └── ...
├── public/                    # Static assets
│   └── animations/            # Lottie animations
├── scripts/                   # Utility scripts
│   ├── seed.ts               # Database seeding
│   └── test-api-comprehensive.js
├── .env.example              # Environment template
├── drizzle.config.ts         # Drizzle configuration
├── next.config.ts            # Next.js config
├── package.json              # Dependencies
└── tsconfig.json             # TypeScript config
```

---

## 🔒 Security

This project implements multiple security measures:

- ✅ **Input Validation** - All user inputs validated and sanitized
- ✅ **XSS Prevention** - HTML escaping and content sanitization
- ✅ **SQL Injection Protection** - Parameterized queries with Drizzle ORM
- ✅ **Authentication** - Clerk-managed secure sessions
- ✅ **Rate Limiting** - Built-in rate limiter for API endpoints
- ✅ **Environment Variables** - Secrets stored securely
- ✅ **HTTPS Enforcement** - SSL/TLS for all connections

For more details, see [SECURITY_BEST_PRACTICES.md](./SECURITY_BEST_PRACTICES.md)

---

## 📊 Database Schema

### Core Tables
- **users** - User accounts synced from Clerk
- **reports** - Waste reports submitted by users
- **rewards** - Redeemable rewards catalog
- **transactions** - Points earned and spent history

### Events Tables
- **events** - Community cleanup events
- **event_registrations** - User event registrations
- **event_attendance** - Verified attendees

### Supporting Tables
- **collected_wastes** - Collection records
- **notifications** - User notifications

For detailed schema information, see [DATABASE_DOCUMENTATION.md](./DATABASE_DOCUMENTATION.md)

---

## 🎯 API Endpoints

### Reports
- `GET /api/reports` - Get recent reports
- `POST /api/reports` - Submit new report
- `GET /api/reports/[id]` - Get report details

### Rewards
- `GET /api/rewards` - Get rewards catalog
- `POST /api/rewards` - Create reward (admin)
- `POST /api/rewards/redeem` - Redeem reward

### Events
- `GET /api/events` - Get published events
- `POST /api/events` - Create or register for event
- `GET /api/events/[id]` - Get event details
- `POST /api/events/[id]/verify` - Verify attendance

### Users
- `GET /api/users/stats` - Get user statistics
- `GET /api/leaderboard` - Get leaderboard

For complete API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

---

## 🧪 Testing

Run the comprehensive API test suite:

```bash
# Test all API endpoints
node scripts/test-api-comprehensive.js

# Test database connection
node test-connection.js

# Test Gemini AI integration
node test-gemini.js
```

---

## 📱 Screenshots

### Home Page
Landing page with feature overview and call-to-action

### Dashboard
User dashboard showing recent reports, stats, and quick actions

### Waste Report
Report submission form with AI verification

### Events
Community cleanup events discovery and registration

### Leaderboard
User rankings based on environmental contributions

### Rewards
Points system and redeemable rewards catalog

---

## 🌍 Environment Variables

Required environment variables (see `.env.example` for details):

```env
# Database
DATABASE_URL=postgresql://...

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
CLERK_WEBHOOK_SECRET_USER=whsec_...

# Google Gemini AI
GEMINI_API_KEY=...

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

---

## 🚀 Deployment

Deploy to Vercel (recommended):

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

## 📈 Performance

- **Server Components** - Reduced client bundle size
- **Image Optimization** - Next.js Image component
- **API Caching** - Optimized data fetching
- **Code Splitting** - Automatic route-based splitting
- **Database Indexes** - Optimized query performance

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👥 Authors

- **aarz24** - Initial work - [@aarz24](https://github.com/aarz24)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Clerk](https://clerk.com/) - Authentication
- [Drizzle ORM](https://orm.drizzle.team/) - Database ORM
- [Google Gemini](https://deepmind.google/technologies/gemini/) - AI verification
- [Vercel](https://vercel.com/) - Deployment platform

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/aarz24/ZeroSampah2/issues)
- **Discussions**: [GitHub Discussions](https://github.com/aarz24/ZeroSampah2/discussions)
- **Documentation**: See docs in this repository

---

## 🗺️ Roadmap

### Upcoming Features
- [ ] File upload integration (images/videos)
- [ ] Push notifications
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Export reports to PDF
- [ ] Integration with waste management services
- [ ] Gamification enhancements

---

**Made with ❤️ for a cleaner environment**

## Community Cleanup Events — User Flows

**QR Code Verification System:**
- After registering for an event, participants receive a unique QR code
- QR codes are displayed in-app and can be screenshotted
- Event organizers use built-in scanner to verify attendance on-site
- Only verified attendees receive rewards (prevents fake registrations)
- System tracks: registration → physical attendance → reward eligibility

- **Discover & Join:**
   - Pengguna membuka `Leaderboard` lalu scroll ke bagian "Aksi Bersih Komunitas" dan klik "Lihat semua" (`/events`).
   - Di halaman `Events Browse` (`/events`), pilih kartu acara dan buka detail (`/events/[id]`).
   - Klik "Gabung Acara" untuk mendaftar (UI mock; integrasi backend dapat ditambahkan di tahap berikutnya).

- **Create New Event:**
   - Pengguna buka `Buat Acara` (`/events/create`).
   - Isi form: judul, lokasi, tanggal, waktu, deskripsi, kategori sampah.
   - Klik "Terbitkan Acara" untuk membuat event (UI mock; koneksi DB/Drizzle dapat ditambahkan).

- **Organizer Manage Event:**
   - Pengguna buka `Dashboard Saya` (`/events/dashboard`).
   - Lihat daftar acara yang diselenggarakan dan diikuti, klik "Kelola" untuk masuk ke detail.
   - Aksi lanjut (edit, batalkan, lihat peserta) dapat ditambahkan pada tahap integrasi.

## Routes Added
- `/events` — Browse/Discovery
- `/events/[id]` — Detail
- `/events/create` — Create Event
- `/events/dashboard` — User Dashboard

## Next Steps (Integration)
- Buat schema Drizzle untuk `events`, `event_participants` di `src/db/schema.ts`.
- Tambahkan actions di `src/db/actions.ts` untuk CRUD event dan join.
- Lindungi routes form dengan auth (middleware) bila diperlukan.
- Hubungkan tombol "Gabung" ke action server.

### Build
- Production build:
  npm run build
- Start:
  npm start

## Environment Variables
Create .env with the following keys (do not commit secrets):

- DATABASE_URL=postgres://user:pass@host:port/db
- GEMINI_API_KEY=your_gemini_api_key
- CLERK_WEBHOOK_SECRET_USER=your_clerk_user_webhook_secret
- CLERK_WEBHOOK_SECRET_SESSION=your_clerk_session_webhook_secret

If your client needs public variables, use the NEXT_PUBLIC_ prefix and document them here.

## Available Scripts
- dev: Start Next.js dev server
- build: Build for production
- start: Run production server
- lint: Lint the codebase
- db:push: Push Drizzle schema
- db:studio: Open Drizzle Studio

Optional additions you may add to package.json:
- typecheck: tsc --noEmit

## Project Structure (high-level)
- src/app: Pages and API routes (App Router)
- src/components: UI components
- src/db: Drizzle schema and database access
- scripts: Maintenance/utility scripts (e.g., check-reports.ts)
- public: Static assets

## Attribution (Optional)
If this project is based on or adapted from another open-source project, include attribution here per the original license terms. Example:
This project is based on <Original Project Name> by <Author/Org>, licensed under <License>.

## License
Add your license of choice here. If the original source requires preserving a license or attribution, ensure compliance by including the appropriate LICENSE file and notice here.
