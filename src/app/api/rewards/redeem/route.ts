import { NextResponse } from 'next/server';
import { redeemReward } from '@/db/actions';
import { auth } from '@clerk/nextjs/server';

export const maxDuration = 300;

// POST - Redeem a reward
export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { rewardId } = body;

    if (!rewardId) {
      return NextResponse.json(
        { error: 'Reward ID required' },
        { status: 400 }
      );
    }

    const result = await redeemReward(userId, rewardId);
    
    return NextResponse.json({
      success: true,
      message: 'Reward redeemed successfully',
      user: result
    });

  } catch (error) {
    console.error('Error redeeming reward:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    
    // Handle specific error cases
    if (errorMessage === 'User not found') {
      return NextResponse.json({ error: errorMessage }, { status: 404 });
    }
    if (errorMessage === 'Reward not found') {
      return NextResponse.json({ error: errorMessage }, { status: 404 });
    }
    if (errorMessage === 'Insufficient points') {
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
    if (errorMessage === 'Reward out of stock') {
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
