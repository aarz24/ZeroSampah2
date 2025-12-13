# ZeroSampah

A waste reporting, collection, and rewards web application. Users can submit waste reports, view analytics, track collections, and earn rewards. This project uses your own API keys for the database, Google Gemini, and Clerk.

Note: Replace placeholder values and sections below with your own details before publishing.


## Tech Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS
- Drizzle ORM + Neon/Postgres (or your configured DB)
- Clerk for Auth (Next.js SDK)
- Google Gemini API
- Leaflet / React Google Maps

## Features
- Authentication with Clerk
- Waste report submission with verification flow
- Dashboard with recent reports and stats
- Leaderboard and rewards
- Collection view and report details
- API routes for reports, collections, rewards, notifications, chat, and webhooks
 - Community Cleanup Events (Browse, Detail, Create, Dashboard)

## Screenshots
- Home: `home.png`
- Dashboard: `dashboard.png`
- Rewards: `rewards.png`
- Waste Report: `wastereport.png`
- Waste Report Details: `wastereportdetails.png`
- Waste Collection: `wastecollection.png`

Embed in Markdown if you prefer hosted images later.

## Getting Started

### Prerequisites
- Node.js LTS
- Package manager: npm (default)
- A Postgres database (e.g., Neon) or your configured database matching DATABASE_URL
- API keys for Clerk and Google Gemini

### Installation
1. Install dependencies:
   npm install

2. Create a .env file at the project root based on the template below.

3. Run database migrations (Drizzle):
   # push schema to the database
   npm run db:push
   # optional: explore the schema
   npm run db:studio

4. Start the development server:
   npm run dev

The app runs by default on http://localhost:3000

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
