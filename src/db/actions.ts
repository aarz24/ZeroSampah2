import db from './index';
import { Users, Reports, Rewards, CollectedWastes, Notifications, Transactions, Events, EventRegistrations, EventAttendance } from './schema';
import { eq, sql, and, desc } from 'drizzle-orm';

// Define a type for verification result
interface VerificationResult {
  decompositionTime?: string;
  commonSources?: string;
  environmentalImpact?: string;
  healthHazards?: string;
  carbonFootprint?: string;
  economicImpact?: string;
  wasteReductionStrategies?: string;
  recyclingDisposalMethods?: string;
  [key: string]: string | undefined;
}

export async function createUser(
  clerkId: string,
  email: string,
  fullName: string,
  profileImage?: string,
) {
  try {
    const existingUser = await db.select().from(Users).where(eq(Users.clerkId, clerkId)).execute();
    console.log(existingUser);

    if (existingUser.length > 0) {
      throw new Error('User already exists');
    }
    const newUser = await db.insert(Users).values({
      clerkId,
      email,
      fullName,
      profileImage,
    }).returning();   
    console.log(newUser);
    return newUser[0];
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}


export async function getUserByEmail(email: string) {
  try {
    const [user] = await db.select().from(Users).where(eq(Users.email, email)).execute();
    return user;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return null;
  }
}

export async function createReport(
  userId: string,
  location: string,
  wasteType: string,
  amount: string,
  imageUrl?: string | null,
  verificationResult?: VerificationResult
) {
  try {
    console.log('createReport - Starting with params:', { userId, location, wasteType, amount, hasImage: !!imageUrl });
    
    // First, ensure user exists in database (auto-create if not exists)
    await db
      .insert(Users)
      .values({
        clerkId: userId,
        email: `${userId}@temp.com`, // Temporary email
        fullName: 'User',
      })
      .onConflictDoNothing()
      .execute();
    
    const [report] = await db
      .insert(Reports)
      .values({
        userId,
        location,
        wasteType,
        amount,
        imageUrl: imageUrl || null,
        verificationResult: verificationResult ? JSON.stringify(verificationResult) : null,
        status: "pending",
      })
      .returning()
      .execute();

    console.log('createReport - Successfully inserted report:', report.id);
    return report;
  } catch (error) {
    console.error("Error creating report:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    throw error;
  }
}

export async function getReportsByUserId(userId: string) {
  try {
    const reports = await db.select().from(Reports).where(eq(Reports.userId, userId)).execute();
    return reports;
  } catch (error) {
    console.error("Error fetching reports:", error);
    return [];
  }
}

export async function getOrCreateReward(userId: string) {
  try {
    let [reward] = await db.select().from(Rewards).where(eq(Rewards.userId, userId)).execute();
    if (!reward) {
      [reward] = await db.insert(Rewards).values({
        userId,
        name: 'Default Reward',
        collectionInfo: 'Default Collection Info',
        points: 0,
        level: 1,
        isAvailable: true,
      }).returning().execute();
    }
    return reward;
  } catch (error) {
    console.error("Error getting or creating reward:", error);
    return null;
  }
}

export async function updateRewardPoints(userId: string, pointsToAdd: number) {
  try {
    const [updatedReward] = await db
      .update(Rewards)
      .set({ 
        points: sql`${Rewards.points} + ${pointsToAdd}`,
        updatedAt: new Date()
      })
      .where(eq(Rewards.userId, userId))
      .returning()
      .execute();
    return updatedReward;
  } catch (error) {
    console.error("Error updating reward points:", error);
    return null;
  }
}

export async function updateUserPoints(userId: string, pointsToAdd: number) {
  try {
    const [updatedUser] = await db
      .update(Users)
      .set({ 
        points: sql`${Users.points} + ${pointsToAdd}`,
        updatedAt: new Date()
      })
      .where(eq(Users.clerkId, userId))
      .returning()
      .execute();
    return updatedUser;
  } catch (error) {
    console.error("Error updating user points:", error);
    return null;
  }
}

export async function createCollectedWaste(reportId: number, collectorId: string, comments?: string) {
  try {
    const [collectedWaste] = await db
      .insert(CollectedWastes)
      .values({
        reportId,
        collectorId,
        collectionDate: new Date(),
        comment: comments,
      })
      .returning()
      .execute();
    return collectedWaste;
  } catch (error) {
    console.error("Error creating collected waste:", error);
    return null;
  }
}

export async function getCollectedWastesByCollector(collectorId: string) {
  try {
    return await db.select().from(CollectedWastes).where(eq(CollectedWastes.collectorId, collectorId)).execute();
  } catch (error) {
    console.error("Error fetching collected wastes:", error);
    return [];
  }
}

export async function createNotification(userId: string, message: string, type: string) {
  try {
    const [notification] = await db
      .insert(Notifications)
      .values({ userId, message, type })
      .returning()
      .execute();
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    return null;
  }
}

export async function getUnreadNotifications(userId: string) {
  try {
    return await db.select().from(Notifications).where(
      and(
        eq(Notifications.userId, userId),
        eq(Notifications.isRead, false)
      )
    ).execute();
  } catch (error) {
    console.error("Error fetching unread notifications:", error);
    return [];
  }
}

export async function markNotificationAsRead(notificationId: number) {
  try {
    await db.update(Notifications).set({ isRead: true }).where(eq(Notifications.id, notificationId)).execute();
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
}

export async function getPendingReports() {
  try {
    return await db.select().from(Reports).where(eq(Reports.status, "pending")).execute();
  } catch (error) {
    console.error("Error fetching pending reports:", error);
    return [];
  }
}

export async function getLeaderboard(limit: number = 100) {
  try {
    const users = await db
      .select({
        clerkId: Users.clerkId,
        fullName: Users.fullName,
        email: Users.email,
        points: Users.points,
        profileImage: Users.profileImage,
      })
      .from(Users)
      .orderBy(desc(Users.points))
      .limit(limit)
      .execute();
    
    return users;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }
}

export async function updateReportStatus(reportId: number, status: string, collectorId?: string) {
  try {
    const updateData: Record<string, unknown> = { status };
    if (collectorId !== undefined) {
      updateData.collectorId = collectorId;
    }

    const [updatedReport] = await db
      .update(Reports)
      .set(updateData)
      .where(eq(Reports.id, reportId))
      .returning()
      .execute();
    return updatedReport;
  } catch (error) {
    console.error("Error updating report status:", error);
    return null;
  }
}

export async function getRecentReports(limit: number = 10) {
  try {
    const reports = await db
      .select()
      .from(Reports)
      .orderBy(desc(Reports.createdAt))
      .limit(limit)
      .execute();
    return reports;
  } catch (error) {
    console.error("Error fetching recent reports:", error);
    return [];
  }
}

export async function getWasteCollectionTasks(limit: number = 20) {
  try {
    const tasks = await db
      .select({
        id: Reports.id,
        location: Reports.location,
        wasteType: Reports.wasteType,
        amount: Reports.amount,
        status: Reports.status,
        date: Reports.createdAt,
        collectorId: Reports.collectorId,
        userId: Reports.userId,
        imageUrl: Reports.imageUrl,
        verificationResult: Reports.verificationResult,
      })
      .from(Reports)
      .where(
        and(
          eq(Reports.status, 'pending'),
          sql`${Reports.collectorId} IS NULL`
        )
      )
      .limit(limit)
      .orderBy(desc(Reports.createdAt))
      .execute();

    return tasks.map(task => ({
      ...task,
      // Preserve full ISO timestamp for reliable ordering on client
      date: task.date instanceof Date ? task.date.toISOString() : String(task.date),
    }));
  } catch (error) {
    console.error("Error fetching waste collection tasks:", error);
    return [];
  }
}

export async function saveReward(userId: string, amount: number) {
  try {
    const [reward] = await db
      .insert(Rewards)
      .values({
        userId,
        name: 'Waste Collection Reward',
        collectionInfo: 'Points earned from waste collection',
        points: amount,
        level: 1,
        isAvailable: true,
      })
      .returning()
      .execute();
    
    // Create a transaction for this reward
    await createTransaction(userId, null, amount, 'earned', 'Points earned for collecting waste');

    return reward;
  } catch (error) {
    console.error("Error saving reward:", error);
    throw error;
  }
}

export async function saveCollectedWaste(reportId: number, collectorId: string) {
  try {
    const [collectedWaste] = await db
      .insert(CollectedWastes)
      .values({
        reportId,
        collectorId,
        collectionDate: new Date(),
      })
      .returning()
      .execute();
    return collectedWaste;
  } catch (error) {
    console.error("Error saving collected waste:", error);
    return null;
  }
}

export async function updateTaskStatus(reportId: number, newStatus: string, collectorId?: string) {
  try {
    const updateData: Record<string, unknown> = { status: newStatus };
    
    if (collectorId) {
      updateData.collectorId = collectorId;
    }
    
    const [updatedReport] = await db
      .update(Reports)
      .set(updateData)
      .where(eq(Reports.id, reportId))
      .returning()
      .execute();
    return updatedReport;
  } catch (error) {
    console.error("Error updating task status:", error);
    return null;
  }
}

export async function getAllRewards() {
  try {
    const rewards = await db
      .select({
        id: Rewards.id,
        userId: Rewards.userId,
        points: Rewards.points,
        level: Rewards.level,
        createdAt: Rewards.createdAt,
        userName: Users.fullName,
      })
      .from(Rewards)
      .leftJoin(Users, eq(Rewards.userId, Users.id))
      .orderBy(desc(Rewards.points))
      .execute();

    return rewards;
  } catch (error) {
    console.error("Error fetching all rewards:", error);
    return [];
  }
}

export async function getRewardTransactions(userId: string) {
  try {
    console.log('Fetching transactions for user ID:', userId)
    const transactions = await db
      .select({
        id: Transactions.id,
        type: Transactions.type,
        amount: Transactions.amount,
        description: Transactions.description,
        date: Transactions.date,
      })
      .from(Transactions)
      .where(eq(Transactions.userId, userId))
      .orderBy(desc(Transactions.date))
      .limit(10)
      .execute();

    console.log('Raw transactions from database:', transactions)

    const formattedTransactions = transactions.map(t => ({
      ...t,
      date: t.date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
    }));

    console.log('Formatted transactions:', formattedTransactions)
    return formattedTransactions;
  } catch (error) {
    console.error("Error fetching reward transactions:", error);
    return [];
  }
}

export async function getAvailableRewards(userId: string) {
  try {
    console.log('Fetching available rewards for user:', userId);
    
    // Get user's total points
    const userTransactions = await getRewardTransactions(userId);
    const userPoints = userTransactions.reduce((total, transaction) => {
      return transaction.type.startsWith('earned') ? total + transaction.amount : total - transaction.amount;
    }, 0);

    console.log('User total points:', userPoints);

    // Get available rewards from the database
    const dbRewards = await db
      .select({
        id: Rewards.id,
        name: Rewards.name,
        cost: Rewards.points,
        description: Rewards.description,
        collectionInfo: Rewards.collectionInfo,
      })
      .from(Rewards)
      .where(eq(Rewards.isAvailable, true))
      .execute();

    console.log('Rewards from database:', dbRewards);

    // Combine user points and database rewards
    const allRewards = [
      {
        id: 0, // Use a special ID for user's points
        name: "Your Points",
        cost: userPoints,
        description: "Redeem your earned points",
        collectionInfo: "Points earned from reporting and collecting waste"
      },
      ...dbRewards
    ];

    console.log('All available rewards:', allRewards);
    return allRewards;
  } catch (error) {
    console.error("Error fetching available rewards:", error);
    return [];
  }
}

export async function createTransaction(
  userId: string, 
  rewardId: number | null, 
  pointsUsed: number, 
  transactionType: 'earned' | 'redeemed',
  description: string
) {
  try {
    const [transaction] = await db
      .insert(Transactions)
      .values({ 
        userId, 
        rewardId,
        pointsUsed,
        transactionType,
        description 
      })
      .returning()
      .execute();
    return transaction;
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
}

// export async function redeemReward(userId: number, rewardId: number) {
//   try {
//     const userReward = await getOrCreateReward(userId) as any;
    
//     if (rewardId === 0) {
//       // Redeem all points
//       const [updatedReward] = await db.update(Rewards)
//         .set({ 
//           points: 0,
//           updatedAt: new Date(),
//         })
//         .where(eq(Rewards.userId, userId))
//         .returning()
//         .execute();

//       // Create a transaction for this redemption
//       await createTransaction(userId, 'redeemed', userReward.points, `Redeemed all points: ${userReward.points}`);

//       return updatedReward;
//     } else {
//       // Existing logic for redeeming specific rewards
//       const availableReward = await db.select().from(Rewards).where(eq(Rewards.id, rewardId)).execute();

//       if (!userReward || !availableReward[0] || userReward.points < availableReward[0].points) {
//         throw new Error("Insufficient points or invalid reward");
//       }

//       const [updatedReward] = await db.update(Rewards)
//         .set({ 
//           points: sql`${Rewards.points} - ${availableReward[0].points}`,
//           updatedAt: new Date(),
//         })
//         .where(eq(Rewards.userId, userId))
//         .returning()
//         .execute();

//       // Create a transaction for this redemption
//       await createTransaction(userId, 'redeemed', availableReward[0].points, `

export async function getReportById(reportId: number) {
  try {
    const [report] = await db
      .select()
      .from(Reports)
      .where(eq(Reports.id, reportId))
      .execute();
    
    if (!report) {
      throw new Error('Report not found');
    }
    
    return report;
  } catch (error) {
    console.error("Error fetching report by ID:", error);
    throw error;
  }
}

// ============ EVENT ACTIONS ============

// Create a new event
export async function createEvent(data: {
  organizerId: string;
  title: string;
  description?: string;
  location: string;
  latitude?: string;
  longitude?: string;
  eventDate: Date;
  eventTime: string;
  wasteCategories?: string[];
  maxParticipants?: number;
  rewardInfo?: string;
  images?: string[];
  videos?: string[];
}) {
  try {
    const [event] = await db.insert(Events).values(data).returning();
    return event;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
}

// Get all published events
export async function getPublishedEvents() {
  try {
    const events = await db
      .select({
        event: Events,
        organizer: Users,
      })
      .from(Events)
      .leftJoin(Users, eq(Events.organizerId, Users.clerkId))
      .where(eq(Events.status, 'published'))
      .orderBy(desc(Events.eventDate));
    
    return events;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}

// Get event by ID with organizer info
export async function getEventById(eventId: number) {
  try {
    const [event] = await db
      .select({
        event: Events,
        organizer: Users,
      })
      .from(Events)
      .leftJoin(Users, eq(Events.organizerId, Users.clerkId))
      .where(eq(Events.id, eventId));
    
    if (!event) return null;
    return event;
  } catch (error) {
    console.error("Error fetching event by ID:", error);
    throw error;
  }
}

// Register user for an event
export async function registerForEvent(eventId: number, userId: string) {
  try {
    // Check if already registered
    const existing = await db
      .select()
      .from(EventRegistrations)
      .where(and(
        eq(EventRegistrations.eventId, eventId),
        eq(EventRegistrations.userId, userId)
      ));
    
    if (existing.length > 0) {
      return { success: false, message: 'Already registered', registration: existing[0] };
    }

    // Generate unique QR code data
    const qrCode = `EVENT:${eventId}:${userId}:${Date.now()}`;
    
    const [registration] = await db
      .insert(EventRegistrations)
      .values({ eventId, userId, qrCode })
      .returning();
    
    return { success: true, registration };
  } catch (error) {
    console.error("Error registering for event:", error);
    throw error;
  }
}

// Get user's registration for an event
export async function getUserEventRegistration(eventId: number, userId: string) {
  try {
    const [registration] = await db
      .select()
      .from(EventRegistrations)
      .where(and(
        eq(EventRegistrations.eventId, eventId),
        eq(EventRegistrations.userId, userId),
        eq(EventRegistrations.status, 'registered')
      ));
    
    return registration || null;
  } catch (error) {
    console.error("Error fetching user registration:", error);
    throw error;
  }
}

// Verify attendance (scan QR code)
export async function verifyAttendance(data: {
  eventId: number;
  userId: string;
  qrCodeScanned: string;
  verifiedBy: string;
}) {
  try {
    // Validate QR format
    const parts = data.qrCodeScanned.split(':');
    if (parts[0] !== 'EVENT' || parts[1] !== data.eventId.toString() || parts[2] !== data.userId) {
      throw new Error('Invalid QR code');
    }

    // Get registration
    const [registration] = await db
      .select()
      .from(EventRegistrations)
      .where(and(
        eq(EventRegistrations.eventId, data.eventId),
        eq(EventRegistrations.userId, data.userId),
        eq(EventRegistrations.qrCode, data.qrCodeScanned)
      ));
    
    if (!registration) {
      throw new Error('Registration not found');
    }

    // Check if already verified
    const existing = await db
      .select()
      .from(EventAttendance)
      .where(and(
        eq(EventAttendance.eventId, data.eventId),
        eq(EventAttendance.userId, data.userId)
      ));
    
    if (existing.length > 0) {
      return { success: false, message: 'Already verified', alreadyVerified: true };
    }

    // Get user name for response
    const [user] = await db
      .select()
      .from(Users)
      .where(eq(Users.clerkId, data.userId));

    // Create attendance record
    const [attendance] = await db
      .insert(EventAttendance)
      .values({
        eventId: data.eventId,
        userId: data.userId,
        registrationId: registration.id,
        verifiedBy: data.verifiedBy,
        qrCodeScanned: data.qrCodeScanned,
      })
      .returning();
    
    // Award points for attending event
    await updateUserPoints(data.userId, 25);
    
    return { success: true, attendance, userName: user?.fullName || 'User' };
  } catch (error) {
    console.error("Error verifying attendance:", error);
    throw error;
  }
}

// Get verified attendees for an event
export async function getEventAttendees(eventId: number) {
  try {
    const attendees = await db
      .select({
        attendance: EventAttendance,
        user: Users,
      })
      .from(EventAttendance)
      .leftJoin(Users, eq(EventAttendance.userId, Users.clerkId))
      .where(eq(EventAttendance.eventId, eventId))
      .orderBy(desc(EventAttendance.verifiedAt));
    
    return attendees;
  } catch (error) {
    console.error("Error fetching event attendees:", error);
    throw error;
  }
}

// Get user's registered events
export async function getUserRegisteredEvents(userId: string) {
  try {
    const registrations = await db
      .select({
        registration: EventRegistrations,
        event: Events,
      })
      .from(EventRegistrations)
      .leftJoin(Events, eq(EventRegistrations.eventId, Events.id))
      .where(and(
        eq(EventRegistrations.userId, userId),
        eq(EventRegistrations.status, 'registered')
      ))
      .orderBy(desc(Events.eventDate));
    
    return registrations;
  } catch (error) {
    console.error("Error fetching user registered events:", error);
    throw error;
  }
}

// Get user's organized events
export async function getUserOrganizedEvents(userId: string) {
  try {
    const events = await db
      .select()
      .from(Events)
      .where(eq(Events.organizerId, userId))
      .orderBy(desc(Events.eventDate));
    
    // Return in the same structure as registered events for consistency
    return events.map(event => ({ event }));
  } catch (error) {
    console.error("Error fetching user organized events:", error);
    throw error;
  }
}

// Baris 1: Import instance database dari file index
// db adalah instance Drizzle ORM yang terkoneksi ke database

// Baris 2: Import semua table schema dari file schema
// Users, Reports, Rewards, dll adalah definisi tabel database

// Baris 3: Import operator Drizzle ORM untuk query
// eq = equals, sql = raw SQL, and = logical AND, desc = descending order

// Baris 5-14: Interface TypeScript untuk VerificationResult
// Mendefinisikan struktur data hasil verifikasi sampah dari AI
// Berisi info seperti waktu dekomposisi, dampak lingkungan, jejak karbon, dll
// [key: string] untuk property dinamis lainnya

// Baris 16-37: Function createUser untuk membuat user baru di database
// 1. Cek apakah user dengan clerkId sudah ada
// 2. Jika sudah ada, throw error
// 3. Jika belum, insert user baru dengan data: clerkId, email, fullName, profileImage
// 4. Return user yang baru dibuat
// Handle error dengan console.error dan throw error

// Baris 40-48: Function getUserByEmail untuk ambil user berdasarkan email
// Select dari tabel Users dengan kondisi email = parameter
// Return user pertama yang ditemukan atau null jika error

// Baris 50-90: Function createReport untuk membuat laporan sampah baru
// Parameter: userId, location, wasteType, amount, imageUrl (optional), verificationResult (optional)
// 1. Log parameter untuk debugging
// 2. Auto-create user jika belum ada dengan onConflictDoNothing (upsert pattern)
// 3. Insert report baru dengan semua data
// 4. Convert verificationResult object ke JSON string untuk disimpan
// 5. Set status default "pending"
// 6. Return report yang baru dibuat

// Baris 92-99: Function getReportsByUserId untuk ambil semua laporan user
// Select semua reports dengan userId = parameter
// Return array reports atau array kosong jika error

// Baris 101-118: Function getOrCreateReward untuk get atau create reward user
// 1. Coba select reward dengan userId
// 2. Jika tidak ada, create reward baru dengan default values
// 3. Return reward object atau null jika error

// Baris 120-134: Function updateRewardPoints untuk tambah poin reward user
// Gunakan sql template untuk increment: points = points + pointsToAdd
// Update juga updatedAt dengan timestamp sekarang
// Return reward yang sudah diupdate

// Baris 136-150: Function updateUserPoints untuk tambah poin user
// Sama seperti updateRewardPoints tapi update tabel Users
// Increment points dengan SQL: points = points + pointsToAdd
// Update updatedAt timestamp

// Baris 152-167: Function createCollectedWaste untuk record sampah yang sudah dikumpulkan
// Insert ke tabel CollectedWastes dengan: reportId, collectorId, collectionDate, comment
// Return collected waste yang baru dibuat

// Baris 169-176: Function getCollectedWastesByCollector untuk ambil riwayat pengumpulan
// Select semua collected wastes dengan collectorId = parameter
// Return array atau kosong jika error

// Baris 178-189: Function createNotification untuk buat notifikasi user
// Insert ke tabel Notifications dengan: userId, message, type
// Return notification yang baru dibuat

// Baris 191-202: Function getUnreadNotifications untuk ambil notifikasi belum dibaca
// Select dengan kondisi AND: userId = parameter DAN isRead = false
// Return array notifications

// Baris 204-210: Function markNotificationAsRead untuk tandai notifikasi sudah dibaca
// Update Notifications set isRead = true dengan id = parameter

// Baris 212-219: Function getPendingReports untuk ambil semua laporan pending
// Select reports dengan status = "pending"
// Return array reports

// Baris 221-239: Function getLeaderboard untuk ambil ranking user berdasarkan poin
// Select: clerkId, fullName, email, points, profileImage dari Users
// Order by points descending (tertinggi dulu)
// Limit sesuai parameter (default 100)
// Return array users sorted by points

// Baris 241-259: Function updateReportStatus untuk update status laporan
// Parameter: reportId, status, collectorId (optional)
// Buat object updateData yang dinamis
// Jika collectorId provided, tambahkan ke updateData
// Update report dan return hasil update

// Baris 261-272: Function getRecentReports untuk ambil laporan terbaru
// Select reports order by createdAt descending
// Limit sesuai parameter (default 10)
// Return array reports

// Baris 274-303: Function getWasteCollectionTasks untuk ambil tugas pengumpulan sampah
// Select reports dengan kondisi: status = 'pending' DAN collectorId IS NULL
// Artinya: laporan yang belum ada yang ambil
// Order by createdAt descending (terbaru dulu)
// Convert date ke ISO string untuk konsistensi format
// Return array tasks

// Baris 305-329: Function saveReward untuk simpan reward baru
// 1. Insert reward baru dengan: userId, name, collectionInfo, points, level, isAvailable
// 2. Create transaction record untuk track history
// 3. Return reward yang baru dibuat
// Throw error jika gagal

// Baris 331-346: Function saveCollectedWaste untuk simpan collected waste
// Insert ke CollectedWastes dengan: reportId, collectorId, collectionDate
// Return collected waste atau null jika error

// Baris 348-367: Function updateTaskStatus untuk update status task
// Mirip updateReportStatus tapi khusus untuk task
// Buat updateData dinamis, include collectorId jika provided
// Return updated report

// Baris 369-388: Function getAllRewards untuk ambil semua rewards dengan join
// Select rewards dengan LEFT JOIN ke Users untuk get fullName
// Select: id, userId, points, level, createdAt, userName
// Order by points descending
// Return array rewards

// Baris 390-418: Function getRewardTransactions untuk ambil riwayat transaksi poin user
// Select transactions dengan userId = parameter
// Order by date descending, limit 10 (transaksi terbaru)
// Format date ke YYYY-MM-DD untuk display
// Return array formatted transactions
// Multiple console.log untuk debugging

// Baris 420-462: Function getAvailableRewards untuk ambil daftar reward yang bisa ditukar
// 1. Get semua transaksi user untuk hitung total points
// 2. Calculate points: earned - redeemed
// 3. Select rewards yang isAvailable = true dari database
// 4. Combine user points dengan database rewards
// 5. Return array dengan user points di index 0, diikuti rewards lainnya

// Baris 464-482: Function createTransaction untuk record transaksi poin
// Parameter: userId, rewardId (nullable), pointsUsed, transactionType, description
// transactionType: 'earned' (dapat poin) atau 'redeemed' (tukar poin)
// Insert transaction dan return hasil

// Baris 484-534: Function redeemReward (COMMENTED OUT)
// Code untuk redeem/tukar poin reward
// Logic: cek poin cukup, kurangi poin user, create transaction
// Di-comment kemungkinan sedang dalam development atau tidak dipakai

// Baris 536-551: Function getReportById untuk ambil detail report berdasarkan ID
// Select report dengan id = parameter
// Throw error jika tidak ditemukan
// Return report object

// Baris 553-556: Comment section separator untuk EVENT ACTIONS

// Baris 558-578: Function createEvent untuk buat event/acara baru
// Parameter: object dengan semua data event
// Data: organizerId, title, description, location, lat/lng, date, time, categories, dll
// Insert ke tabel Events dan return event yang baru dibuat

// Baris 580-599: Function getPublishedEvents untuk ambil semua event yang sudah published
// Select Events dengan LEFT JOIN Users untuk get organizer info
// Filter: status = 'published'
// Order by eventDate descending
// Return array dengan structure { event, organizer }

// Baris 601-618: Function getEventById untuk ambil detail event by ID
// Select event dengan LEFT JOIN Users untuk get organizer
// Filter: id = parameter
// Return object { event, organizer } atau null jika tidak ada

// Baris 620-650: Function registerForEvent untuk daftar ke event
// 1. Cek apakah user sudah terdaftar dengan AND condition
// 2. Jika sudah, return success: false dengan message
// 3. Generate unique QR code: format "EVENT:eventId:userId:timestamp"
// 4. Insert ke EventRegistrations dengan qrCode
// 5. Return success: true dengan registration data

// Baris 652-667: Function getUserEventRegistration untuk cek pendaftaran user
// Select registration dengan kondisi AND: eventId, userId, status='registered'
// Return registration atau null

// Baris 669-729: Function verifyAttendance untuk verifikasi kehadiran via QR scan
// 1. Parse dan validate QR code format: "EVENT:eventId:userId:timestamp"
// 2. Cek format valid (parts[0]='EVENT', parts[1]=eventId, parts[2]=userId)
// 3. Get registration dengan QR code yang di-scan
// 4. Cek apakah sudah pernah verified (prevent double verification)
// 5. Get user name untuk response
// 6. Insert attendance record dengan: eventId, userId, registrationId, verifiedBy, qrCode
// 7. Return success dengan attendance dan userName

// Baris 731-747: Function getEventAttendees untuk ambil daftar peserta yang sudah verified
// Select EventAttendance dengan LEFT JOIN Users
// Filter: eventId = parameter
// Order by verifiedAt descending (terbaru dulu)
// Return array { attendance, user }

// Baris 749-765: Function getUserRegisteredEvents untuk ambil event yang user daftar
// Select EventRegistrations dengan LEFT JOIN Events
// Filter: userId DAN status='registered'
// Order by eventDate descending
// Return array { registration, event }

// Baris 767-781: Function getUserOrganizedEvents untuk ambil event yang user buat
// Select Events dengan organizerId = userId
// Order by eventDate descending
// Map hasil ke format { event } untuk konsistensi dengan getUserRegisteredEvents
// Return array { event }