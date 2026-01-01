import { NextResponse } from 'next/server';
import { getUserStats } from '@/db/actions';
import { auth } from '@clerk/nextjs/server';

export const maxDuration = 300;

// GET - Get current user's statistics
export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const stats = await getUserStats(userId);
    return NextResponse.json(stats);

  } catch (error) {
    console.error('Error fetching user stats:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    
    if (errorMessage === 'User not found') {
      return NextResponse.json({ error: errorMessage }, { status: 404 });
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
