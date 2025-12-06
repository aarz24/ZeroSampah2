import { NextResponse } from 'next/server';
import { createCollectedWaste, updateUserPoints, createTransaction } from '@/db/actions';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { reportId, collectorId, comments } = body;
    
    // Create collected waste record
    const collected = await createCollectedWaste(reportId, collectorId, comments);
    
    if (collected) {
      // Award points to the collector (e.g., 50 points per collection)
      const pointsToAward = 50;
      await updateUserPoints(collectorId, pointsToAward);
      
      // Create transaction record for points earned
      await createTransaction(
        collectorId,
        null, // no reward_id for earning points
        pointsToAward,
        'earned',
        `Points earned from collecting waste (Report #${reportId})`
      );
    }
    
    return NextResponse.json(collected);
  } catch (err) {
    console.error('POST /api/collections error', err);
    return NextResponse.json({ error: 'Failed to create collected waste' }, { status: 500 });
  }
}
