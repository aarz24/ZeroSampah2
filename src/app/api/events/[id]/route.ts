import { NextResponse } from 'next/server';
import { getEventById, getUserEventRegistration } from '@/db/actions';
import { auth } from '@clerk/nextjs/server';

// GET - Fetch event details
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId } = await auth();
    const eventId = parseInt(id);

    if (isNaN(eventId)) {
      return NextResponse.json(
        { error: 'Invalid event ID' },
        { status: 400 }
      );
    }

    const event = await getEventById(eventId);
    
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Check if user is registered
    let registration = null;
    if (userId) {
      registration = await getUserEventRegistration(eventId, userId);
    }

    return NextResponse.json({
      ...event,
      userRegistration: registration,
    });

  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
