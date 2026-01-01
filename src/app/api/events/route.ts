import { NextResponse } from 'next/server';
import { 
  getPublishedEvents, 
  createEvent, 
  registerForEvent,
  getUserRegisteredEvents,
  getUserOrganizedEvents 
} from '@/db/actions';
import { auth } from '@clerk/nextjs/server';

export const maxDuration = 300;

// GET - Fetch published events or user's events
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'registered' | 'organized' | null (all published)
    
    const { userId } = await auth();
    
    if (type === 'registered' && userId) {
      const events = await getUserRegisteredEvents(userId);
      return NextResponse.json(events);
    }
    
    if (type === 'organized' && userId) {
      const events = await getUserOrganizedEvents(userId);
      return NextResponse.json(events);
    }
    
    // Default: get all published events
    const events = await getPublishedEvents();
    return NextResponse.json(events);
    
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new event or register for event
export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Ensure user exists in database
    const { currentUser } = await import('@clerk/nextjs/server');
    const clerkUser = await currentUser();
    if (clerkUser) {
      const { default: db } = await import('@/db/index');
      const { Users } = await import('@/db/schema');
      const { eq } = await import('drizzle-orm');
      
      const existingUser = await db
        .select()
        .from(Users)
        .where(eq(Users.clerkId, userId))
        .limit(1);
      
      if (existingUser.length === 0) {
        // Auto-create user if they don't exist
        const fullName = clerkUser.fullName || 
          `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 
          'Anonymous User';
        
        await db.insert(Users).values({
          clerkId: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          fullName,
          profileImage: clerkUser.imageUrl || null,
        });
      }
    }

    const body = await request.json();
    const { action, ...data } = body;

    // Register for event
    if (action === 'register') {
      const { eventId } = data;
      if (!eventId) {
        return NextResponse.json(
          { error: 'Event ID required' },
          { status: 400 }
        );
      }

      const registration = await registerForEvent(eventId, userId);
      return NextResponse.json(registration);
    }

    // Create new event
    const {
      title,
      description,
      location,
      latitude,
      longitude,
      eventDate,
      eventTime,
      wasteCategories,
      maxParticipants,
      rewardInfo,
      images,
      videos
    } = data;

    // Import validation
    const { validateCreateEvent, createValidationErrorResponse, sanitizeString } = await import('@/lib/validation');
    
    // Sanitize and validate input
    const input = {
      title: sanitizeString(title || ''),
      description: description ? sanitizeString(description) : undefined,
      location: sanitizeString(location || ''),
      latitude: latitude || undefined,
      longitude: longitude || undefined,
      eventDate: eventDate || '',
      eventTime: eventTime || '',
      wasteCategories: wasteCategories || undefined,
      maxParticipants: maxParticipants || undefined,
      rewardInfo: rewardInfo ? sanitizeString(rewardInfo) : undefined,
    };

    const validation = validateCreateEvent(input);
    if (!validation.valid) {
      return NextResponse.json(
        createValidationErrorResponse(validation.errors),
        { status: 400 }
      );
    }

    const event = await createEvent({
      organizerId: userId,
      title,
      description: description || '',
      location,
      latitude: latitude || null,
      longitude: longitude || null,
      eventDate: new Date(eventDate),
      eventTime,
      wasteCategories: wasteCategories || [],
      maxParticipants: maxParticipants || null,
      rewardInfo: rewardInfo || null,
      images: images || [],
      videos: videos || [],
    });

    return NextResponse.json(event, { status: 201 });

  } catch (error) {
    console.error('Error processing event request:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage, details: String(error) },
      { status: 500 }
    );
  }
}
