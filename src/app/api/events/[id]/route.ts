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

// Baris 1: Import NextResponse dari next/server untuk mengirim response dari API route
// Baris 2: Import fungsi getEventById dan getUserEventRegistration dari folder db/actions untuk operasi database event
// Baris 3: Import auth dari Clerk untuk autentikasi dan mendapatkan user ID yang sedang login

// Baris 5-9: Export fungsi GET async untuk menangani request GET detail event, menerima request dan params yang berisi id event
// Baris 10: Blok try untuk menjalankan kode utama
// Baris 11: Destructuring id event dari params yang sudah di-await
// Baris 12: Mendapatkan userId dari auth Clerk (bisa null jika user tidak login)
// Baris 13: Convert id event dari string ke integer

// Baris 15-20: Validasi jika eventId bukan number yang valid (NaN), return error 400 Bad Request dengan pesan "Invalid event ID"

// Baris 22: Memanggil fungsi getEventById untuk mengambil detail event dari database berdasarkan eventId

// Baris 24-28: Jika event tidak ditemukan (null/undefined), return error 404 Not Found dengan pesan "Event not found"

// Baris 30-35: Inisialisasi variabel registration = null, kemudian jika userId ada (user sudah login), ambil data registrasi user untuk event ini menggunakan getUserEventRegistration

// Baris 37-40: Return response JSON berisi semua data event (spread operator ...event) plus data userRegistration (null jika user tidak login atau tidak terdaftar)

// Baris 42-47: Blok catch untuk menangkap error, mencetak error ke console, dan return response error 500 Internal Server Error