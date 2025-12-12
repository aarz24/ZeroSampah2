import { NextResponse } from 'next/server';
import { createNotification } from '@/db/actions';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, message, type } = body;
    const note = await createNotification(userId, message, type);
    return NextResponse.json(note);
  } catch (err) {
    console.error('POST /api/notifications error', err);
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
  }
}
