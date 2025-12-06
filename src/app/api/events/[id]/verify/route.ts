import { NextResponse } from 'next/server';
import { verifyAttendance, getEventAttendees } from '@/db/actions';
import { auth } from '@clerk/nextjs/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: verifiedById } = await auth();
    if (!verifiedById) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id: eventId } = await params;
    const body = await request.json();
    const { userId, qrData } = body;

    if (!userId || !qrData) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify attendance using DB
    const result = await verifyAttendance({
      eventId: parseInt(eventId),
      userId,
      qrCodeScanned: qrData,
      verifiedBy: verifiedById,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: result.alreadyVerified ? 409 : 400 }
      );
    }

    return NextResponse.json({
      success: true,
      userName: result.userName || 'User',
      message: 'Attendance verified successfully'
    });

  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get verified attendees for an event
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;
    const attendees = await getEventAttendees(parseInt(eventId));

    return NextResponse.json({
      eventId,
      verifiedCount: attendees.length,
      attendees: attendees.map(a => ({
        userId: a.user?.clerkId,
        userName: a.user?.fullName,
        verifiedAt: a.attendance.verifiedAt,
      }))
    });

  } catch (error) {
    console.error('Get attendees error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
