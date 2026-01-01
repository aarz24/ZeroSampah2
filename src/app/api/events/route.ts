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

    if (!title || !location || !eventDate || !eventTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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

// Baris 1: Import NextResponse dari next/server untuk mengirim response dari API route
// Baris 2-8: Import fungsi-fungsi dari db/actions untuk operasi database event:
//            - getPublishedEvents: ambil semua event yang sudah dipublish
//            - createEvent: buat event baru
//            - registerForEvent: daftar ke event
//            - getUserRegisteredEvents: ambil event yang user sudah daftar
//            - getUserOrganizedEvents: ambil event yang user organize/buat
// Baris 9: Import auth dari Clerk untuk autentikasi dan mendapatkan user ID yang sedang login

// Baris 11: Set maxDuration = 300 detik (5 menit) sebagai batas waktu maksimal eksekusi fungsi serverless di Vercel

// Baris 13-15: Export fungsi GET async untuk menangani request GET daftar event
// Baris 16: Blok try untuk menjalankan kode utama
// Baris 17: Parse URL request dan ambil searchParams untuk mendapat query parameters
// Baris 18: Ambil parameter 'type' dari query string (bisa 'registered', 'organized', atau null untuk semua event published)

// Baris 20: Mendapatkan userId dari auth Clerk (bisa null jika user tidak login)

// Baris 22-25: Jika type = 'registered' dan userId ada, ambil event yang user sudah daftar menggunakan getUserRegisteredEvents dan return sebagai JSON

// Baris 27-30: Jika type = 'organized' dan userId ada, ambil event yang user organize menggunakan getUserOrganizedEvents dan return sebagai JSON

// Baris 32-34: Default: jika tidak ada type atau type tidak valid, ambil semua event published menggunakan getPublishedEvents dan return sebagai JSON

// Baris 36-42: Blok catch untuk menangkap error, mencetak error ke console, dan return response error 500 Internal Server Error

// Baris 44-46: Export fungsi POST async untuk membuat event baru atau registrasi ke event
// Baris 47: Blok try untuk menjalankan kode utama
// Baris 48-53: Mendapatkan userId dari auth Clerk, jika tidak ada (user tidak login) return error 401 Unauthorized

// Baris 55-84: Memastikan user sudah ada di database:
//              Baris 56-57: Import currentUser dari Clerk dan dapatkan data user dari Clerk
//              Baris 58-67: Import db, schema Users, dan fungsi eq dari drizzle-orm, lalu cek apakah user dengan clerkId ini sudah ada di database
//              Baris 69-83: Jika user tidak ada (existingUser.length = 0), auto-create user baru:
//                           - Buat fullName dari firstName+lastName Clerk atau default 'Anonymous User'
//                           - Insert user baru dengan clerkId, email, fullName, dan profileImage dari data Clerk

// Baris 86: Parse body request menjadi JSON
// Baris 87: Destructuring action dan sisanya sebagai data dari body

// Baris 89-101: Jika action = 'register' (registrasi ke event):
//               Baris 90-96: Destructuring eventId, validasi jika eventId tidak ada return error 400
//               Baris 98-99: Panggil registerForEvent untuk daftarkan user ke event dan return hasilnya sebagai JSON

// Baris 103-119: Destructuring semua field untuk create event: title, description, location, latitude, longitude, eventDate, eventTime, wasteCategories, maxParticipants, rewardInfo, images, videos

// Baris 121-126: Validasi field wajib: jika title, location, eventDate, atau eventTime tidak ada, return error 400 "Missing required fields"

// Baris 128-143: Panggil createEvent untuk membuat event baru dengan semua parameter:
//                - organizerId: userId yang sedang login
//                - semua field lainnya, dengan default values untuk field optional (description='', wasteCategories=[], dll)
//                - eventDate dikonversi ke objek Date

// Baris 145: Return event yang baru dibuat sebagai JSON dengan status 201 Created

// Baris 147-153: Blok catch untuk menangkap error, mencetak error ke console, ambil error message, dan return response error 500 dengan detail error