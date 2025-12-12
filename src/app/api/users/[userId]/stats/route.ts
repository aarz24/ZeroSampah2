import { NextResponse } from 'next/server';
import db from '@/db/index';
import { Users, Reports } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    
    // Fetch user data with points
    const [user] = await db
      .select({
        points: Users.points,
        fullName: Users.fullName,
        email: Users.email,
      })
      .from(Users)
      .where(eq(Users.clerkId, userId))
      .execute();
    
    // Count user's reports
    const reports = await db
      .select()
      .from(Reports)
      .where(eq(Reports.userId, userId))
      .execute();
    
    const reportsCount = reports.length;
    const points = user?.points || 0;
    
    // Calculate rank based on points
    let rank = "Eco Warrior";
    if (points > 500) rank = "Eco Master";
    else if (points > 200) rank = "Eco Champion";
    else if (points > 50) rank = "Eco Hero";
    
    // Calculate impact based on reports
    let impact = "Growing";
    if (reportsCount > 15) impact = "Significant";
    else if (reportsCount > 5) impact = "Positive";
    
    return NextResponse.json({
      points,
      reportsCount,
      rank,
      impact,
      userName: user?.fullName || "User",
    });
  } catch (err) {
    console.error('GET /api/users/[userId]/stats error', err);
    return NextResponse.json(
      { error: 'Failed to fetch user stats' },
      { status: 500 }
    );
  }
}
