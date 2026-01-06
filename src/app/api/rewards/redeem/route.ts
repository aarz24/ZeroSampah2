import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import db from '@/db';
import { Users, RewardRedemptions, Transactions } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { rewardId, rewardName, pointsRequired, qrCode } = body;

    if (!rewardId || !rewardName || !pointsRequired || !qrCode) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get user's current points
    const user = await db.select().from(Users).where(eq(Users.clerkId, userId)).limit(1);
    
    if (!user || user.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const currentPoints = user[0].points || 0;

    // Check if user has enough points
    if (currentPoints < pointsRequired) {
      return NextResponse.json({ 
        error: 'Insufficient points',
        currentPoints,
        required: pointsRequired
      }, { status: 400 });
    }

    // Calculate expiration date (30 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Start transaction: deduct points, create redemption record, and transaction log
    const newPoints = currentPoints - pointsRequired;

    // Update user points
    await db.update(Users)
      .set({ 
        points: newPoints,
        updatedAt: new Date()
      })
      .where(eq(Users.clerkId, userId));

    // Create redemption record (rewardId is null since rewards are not in DB)
    const redemption = await db.insert(RewardRedemptions)
      .values({
        userId,
        rewardId: null,
        rewardName,
        pointsSpent: pointsRequired,
        qrCode,
        status: 'pending',
        expiresAt,
      })
      .returning();

    // Create transaction record (rewardId is null since rewards are not in DB)
    await db.insert(Transactions)
      .values({
        userId,
        rewardId: null,
        pointsUsed: pointsRequired,
        transactionType: 'redeemed',
        description: `Redeemed: ${rewardName}`,
      });

    return NextResponse.json({
      success: true,
      redemption: redemption[0],
      newPoints,
      message: 'Reward redeemed successfully'
    });

  } catch (error) {
    console.error('Error redeeming reward:', error);
    return NextResponse.json({ 
      error: 'Failed to redeem reward',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
