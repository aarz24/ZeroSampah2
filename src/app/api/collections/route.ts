import { NextResponse } from 'next/server';
import { createCollectedWaste } from '@/db/actions';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { reportId, collectorId, comments } = body;
    const collected = await createCollectedWaste(reportId, collectorId, comments);
    return NextResponse.json(collected);
  } catch (err) {
    console.error('POST /api/collections error', err);
    return NextResponse.json({ error: 'Failed to create collected waste' }, { status: 500 });
  }
}
