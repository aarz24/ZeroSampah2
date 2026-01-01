import { NextResponse } from 'next/server';
import { getRewardsCatalog, createReward } from '@/db/actions';
import { auth } from '@clerk/nextjs/server';

export const maxDuration = 300;

// GET - Get all available rewards
export async function GET() {
  try {
    const rewards = await getRewardsCatalog();
    return NextResponse.json(rewards);
  } catch (error) {
    console.error('Error fetching rewards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rewards' },
      { status: 500 }
    );
  }
}

// POST - Create a new reward (admin only - add proper authorization check in production)
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
    const { name, description, pointsRequired, imageUrl, stock } = body;

    if (!name || !pointsRequired || stock === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: name, pointsRequired, stock' },
        { status: 400 }
      );
    }

    const reward = await createReward({
      name,
      description: description || '',
      pointsRequired,
      imageUrl: imageUrl || null,
      stock
    });

    return NextResponse.json(reward, { status: 201 });

  } catch (error) {
    console.error('Error creating reward:', error);
    return NextResponse.json(
      { error: 'Failed to create reward' },
      { status: 500 }
    );
  }
}
