import { NextResponse } from 'next/server';
import { addPointsToUser, getUserPoints } from '@/db/actions';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    const points = await getUserPoints(userId);
    return NextResponse.json({ userId, points });
  } catch (err) {
    console.error('GET /api/rewards/points error', err);
    return NextResponse.json({ error: 'Failed to fetch user points' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, pointsToAdd } = body;
    if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    const updated = await addPointsToUser(userId, Number(pointsToAdd));
    return NextResponse.json(updated);
  } catch (err) {
    console.error('POST /api/rewards/points error', err);
    return NextResponse.json({ error: 'Failed to update reward points' }, { status: 500 });
  }
}
