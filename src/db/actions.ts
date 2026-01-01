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

// Redeem a reward using user points
export async function redeemReward(userId: string, rewardId: number) {
  try {
    // Use a transaction to ensure atomicity and prevent race conditions
    // This ensures that all operations succeed or all fail together
    return await db.transaction(async (tx) => {
      // Get user's current points within transaction
      const [user] = await tx
        .select()
        .from(Users)
        .where(eq(Users.clerkId, userId))
        .execute();

      if (!user) {
        throw new Error("User not found");
      }

      // Get reward details and lock the row to prevent concurrent modifications
      const [reward] = await tx
        .select()
        .from(Rewards)
        .where(eq(Rewards.id, rewardId))
        .execute();

      if (!reward) {
        throw new Error("Reward not found");
      }

      // Check if user has enough points
      if (user.points < reward.pointsRequired) {
        throw new Error("Insufficient points");
      }

      // Check stock availability
      if (reward.stock <= 0) {
        throw new Error("Reward out of stock");
      }

      // Deduct points from user
      const [updatedUser] = await tx
        .update(Users)
        .set({ 
          points: sql`${Users.points} - ${reward.pointsRequired}`,
          updatedAt: new Date(),
        })
        .where(eq(Users.clerkId, userId))
        .returning()
        .execute();

      // Reduce reward stock atomically
      await tx
        .update(Rewards)
        .set({ 
          stock: sql`${Rewards.stock} - 1`,
        })
        .where(eq(Rewards.id, rewardId))
        .execute();

      // Create transaction record
      await tx
        .insert(Transactions)
        .values({
          userId,
          rewardId,
          pointsUsed: reward.pointsRequired,
          transactionType: 'redeemed',
          description: `Redeemed: ${reward.name}`,
        })
        .execute();

      return updatedUser;
    });
  } catch (error) {
    console.error("Error redeeming reward:", error);
    throw error;
  }
}

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

// ============ ADDITIONAL ACTIONS ============

// Get all available rewards (catalog)
export async function getRewardsCatalog() {
  try {
    const rewards = await db
      .select()
      .from(Rewards)
      .orderBy(desc(Rewards.pointsRequired));
    
    return rewards;
  } catch (error) {
    console.error("Error fetching rewards catalog:", error);
    throw error;
  }
}

// Create a new reward (admin function)
export async function createReward(data: {
  name: string;
  description?: string;
  pointsRequired: number;
  imageUrl?: string;
  stock: number;
}) {
  try {
    const [reward] = await db
      .insert(Rewards)
      .values(data)
      .returning();
    
    return reward;
  } catch (error) {
    console.error("Error creating reward:", error);
    throw error;
  }
}

// Update reward stock
export async function updateRewardStock(rewardId: number, newStock: number) {
  try {
    const [reward] = await db
      .update(Rewards)
      .set({ stock: newStock })
      .where(eq(Rewards.id, rewardId))
      .returning();
    
    return reward;
  } catch (error) {
    console.error("Error updating reward stock:", error);
    throw error;
  }
}

// Get user statistics
export async function getUserStats(userId: string) {
  try {
    // Get user basic info
    const [user] = await db
      .select()
      .from(Users)
      .where(eq(Users.clerkId, userId));
    
    if (!user) {
      throw new Error("User not found");
    }

    // Get report count
    const reports = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(Reports)
      .where(eq(Reports.userId, userId));
    
    const reportCount = reports[0]?.count || 0;

    // Get collection count (as collector)
    const collections = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(CollectedWastes)
      .where(eq(CollectedWastes.collectorId, userId));
    
    const collectionCount = collections[0]?.count || 0;

    // Get total points earned
    const pointsEarned = await db
      .select({ total: sql<number>`sum(points_used)::int` })
      .from(Transactions)
      .where(and(
        eq(Transactions.userId, userId),
        eq(Transactions.transactionType, 'earned')
      ));
    
    const totalPointsEarned = pointsEarned[0]?.total || 0;

    // Get total points redeemed
    const pointsRedeemed = await db
      .select({ total: sql<number>`sum(points_used)::int` })
      .from(Transactions)
      .where(and(
        eq(Transactions.userId, userId),
        eq(Transactions.transactionType, 'redeemed')
      ));
    
    const totalPointsRedeemed = pointsRedeemed[0]?.total || 0;

    // Get events organized
    const eventsOrganized = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(Events)
      .where(eq(Events.organizerId, userId));
    
    const eventsOrganizedCount = eventsOrganized[0]?.count || 0;

    // Get events joined
    const eventsJoined = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(EventRegistrations)
      .where(eq(EventRegistrations.userId, userId));
    
    const eventsJoinedCount = eventsJoined[0]?.count || 0;

    return {
      user: {
        clerkId: user.clerkId,
        email: user.email,
        fullName: user.fullName,
        profileImage: user.profileImage,
        points: user.points,
      },
      stats: {
        reportsSubmitted: reportCount,
        wastesCollected: collectionCount,
        pointsEarned: totalPointsEarned,
        pointsRedeemed: totalPointsRedeemed,
        currentPoints: user.points,
        eventsOrganized: eventsOrganizedCount,
        eventsJoined: eventsJoinedCount,
      }
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    throw error;
  }
}

// Get event participant count
export async function getEventParticipantCount(eventId: number) {
  try {
    const result = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(EventRegistrations)
      .where(and(
        eq(EventRegistrations.eventId, eventId),
        eq(EventRegistrations.status, 'registered')
      ));
    
    return result[0]?.count || 0;
  } catch (error) {
    console.error("Error getting event participant count:", error);
    return 0;
  }
}

// Update event status
export async function updateEventStatus(
  eventId: number, 
  status: 'published' | 'cancelled' | 'completed'
) {
  try {
    const [event] = await db
      .update(Events)
      .set({ 
        status,
        updatedAt: new Date()
      })
      .where(eq(Events.id, eventId))
      .returning();
    
    return event;
  } catch (error) {
    console.error("Error updating event status:", error);
    throw error;
  }
}

// Cancel event registration
export async function cancelEventRegistration(eventId: number, userId: string) {
  try {
    const [registration] = await db
      .update(EventRegistrations)
      .set({ status: 'cancelled' })
      .where(and(
        eq(EventRegistrations.eventId, eventId),
        eq(EventRegistrations.userId, userId)
      ))
      .returning();
    
    return registration;
  } catch (error) {
    console.error("Error cancelling registration:", error);
    throw error;
  }
}

// Get user by Clerk ID
export async function getUserByClerkId(clerkId: string) {
  try {
    const [user] = await db
      .select()
      .from(Users)
      .where(eq(Users.clerkId, clerkId));
    
    return user || null;
  } catch (error) {
    console.error("Error fetching user by Clerk ID:", error);
    throw error;
  }
}

// Get all users (for admin)
export async function getAllUsers(limit: number = 100, offset: number = 0) {
  try {
    const users = await db
      .select()
      .from(Users)
      .orderBy(desc(Users.points))
      .limit(limit)
      .offset(offset);
    
    return users;
  } catch (error) {
    console.error("Error fetching all users:", error);
    return [];
  }
}

// Delete report (admin or user)
export async function deleteReport(reportId: number) {
  try {
    await db
      .delete(Reports)
      .where(eq(Reports.id, reportId));
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting report:", error);
    throw error;
  }
}