import { integer, pgTable, serial, text, timestamp, boolean } from "drizzle-orm/pg-core";

// Users table
export const Users = pgTable('users', {
  clerkId: text('clerk_id').primaryKey(),
  email: text('email').unique().notNull(),
  fullName: text('full_name'),
  profileImage: text('profile_image'),
  points: integer('points').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// Reports table
export const Reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => Users.clerkId, { onDelete: 'cascade' }).notNull(),
  location: text("location").notNull(),
  wasteType: text("waste_type").notNull(),
  amount: text("amount").notNull(),
  imageUrl: text("image_url"),
  verificationResult: text("verification_result"),
  status: text("status").notNull().default("pending"),
  collectorId: text("collector_id").references(() => Users.clerkId, { onDelete: 'set null' }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});


// Rewards table
export const Rewards = pgTable("rewards", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  pointsRequired: integer("points_required").notNull(),
  imageUrl: text("image_url"),
  stock: integer("stock").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// CollectedWastes table
export const CollectedWastes = pgTable("collected_wastes", {
  id: serial("id").primaryKey(),
  reportId: integer("report_id").references(() => Reports.id, { onDelete: 'cascade' }).notNull(),
  collectorId: text("collector_id").references(() => Users.clerkId, { onDelete: 'cascade' }).notNull(),
  collectionDate: timestamp("collection_date", { withTimezone: true }).defaultNow(),
  status: text("status").notNull().default("collected"),
  comment: text("comment"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Notifications table
export const Notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => Users.clerkId, { onDelete: 'cascade' }).notNull(),
  message: text("message").notNull(),
  type: text("type").notNull().default('info'),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Transactions table
export const Transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => Users.clerkId, { onDelete: 'cascade' }).notNull(),
  rewardId: integer("reward_id").references(() => Rewards.id, { onDelete: 'set null' }),
  pointsUsed: integer("points_used").notNull(),
  transactionType: text("transaction_type").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Events table
export const Events = pgTable("events", {
  id: serial("id").primaryKey(),
  organizerId: text("organizer_id").references(() => Users.clerkId, { onDelete: 'cascade' }).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  location: text("location").notNull(),
  latitude: text("latitude"),
  longitude: text("longitude"),
  eventDate: timestamp("event_date", { withTimezone: true }).notNull(),
  eventTime: text("event_time").notNull(),
  wasteCategories: text("waste_categories").array(),
  status: text("status").notNull().default("published"), // published, cancelled, completed
  maxParticipants: integer("max_participants"),
  rewardInfo: text("reward_info"), // e.g., "Makan siang gratis", "Goodie bag", "Sertifikat"
  contactPersonName: text("contact_person_name"),
  contactPersonPhone: text("contact_person_phone"),
  contactPersonEmail: text("contact_person_email"),
  images: text("images").array(),
  videos: text("videos").array(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Event Registrations table
export const EventRegistrations = pgTable("event_registrations", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => Events.id, { onDelete: 'cascade' }).notNull(),
  userId: text("user_id").references(() => Users.clerkId, { onDelete: 'cascade' }).notNull(),
  qrCode: text("qr_code").notNull().unique(), // Unique QR code for this registration
  registeredAt: timestamp("registered_at", { withTimezone: true }).defaultNow(),
  status: text("status").notNull().default("registered"), // registered, cancelled
});

// Event Attendance table (verified check-ins)
export const EventAttendance = pgTable("event_attendance", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => Events.id, { onDelete: 'cascade' }).notNull(),
  userId: text("user_id").references(() => Users.clerkId, { onDelete: 'cascade' }).notNull(),
  registrationId: integer("registration_id").references(() => EventRegistrations.id, { onDelete: 'cascade' }).notNull(),
  verifiedBy: text("verified_by").references(() => Users.clerkId, { onDelete: 'set null' }), // Organizer who scanned
  verifiedAt: timestamp("verified_at", { withTimezone: true }).defaultNow(),
  qrCodeScanned: text("qr_code_scanned").notNull(), // The QR code data that was scanned
});