import { NextResponse } from 'next/server';
import { updateRewardPoints } from '@/db/actions';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, pointsToAdd } = body;
    const updated = await updateRewardPoints(userId, Number(pointsToAdd));
    return NextResponse.json(updated);
  } catch (err) {
    console.error('POST /api/rewards/points error', err);
    return NextResponse.json({ error: 'Failed to update reward points' }, { status: 500 });
  }
}
