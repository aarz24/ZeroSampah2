import { NextResponse } from 'next/server';
import { getLeaderboard } from '@/db/actions';

export async function GET() {
  try {
    const leaderboard = await getLeaderboard(100);
    return NextResponse.json(leaderboard);
  } catch (err) {
    console.error('GET /api/leaderboard error', err);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
