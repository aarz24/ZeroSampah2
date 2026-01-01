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

// Baris 1: Import NextResponse dari next/server untuk mengirim response dari API route
// Baris 2: Import fungsi verifyAttendance dan getEventAttendees dari folder db/actions untuk operasi database kehadiran event
// Baris 3: Import auth dari Clerk untuk autentikasi dan mendapatkan user ID yang sedang login

// Baris 5-8: Export fungsi POST async untuk menangani request POST verifikasi kehadiran event, menerima request dan params yang berisi id event
// Baris 9: Blok try untuk menjalankan kode utama
// Baris 10-16: Mendapatkan userId dari auth Clerk sebagai verifiedById (user yang melakukan verifikasi), jika tidak ada userId return error 401 Unauthorized

// Baris 18: Destructuring id event dari params yang sudah di-await
// Baris 19-20: Parse body request JSON dan destructuring userId dan qrData (data QR code yang di-scan)

// Baris 22-27: Validasi jika userId atau qrData tidak ada, return error 400 Bad Request dengan pesan "Missing required fields"

// Baris 29-35: Memanggil fungsi verifyAttendance untuk memverifikasi kehadiran peserta event dengan parameter:
//              - eventId: ID event yang dikonversi ke integer
//              - userId: ID user yang hadir
//              - qrCodeScanned: data QR yang di-scan
//              - verifiedBy: ID user yang melakukan verifikasi

// Baris 37-41: Jika verifikasi gagal (result.success = false), return error dengan status 409 jika sudah terverifikasi sebelumnya, atau 400 untuk error lainnya

// Baris 43-47: Jika berhasil, return response JSON dengan success true, nama user, dan pesan sukses

// Baris 49-54: Blok catch untuk menangkap error, mencetak error ke console, dan return response error 500 Internal Server Error

// Baris 56-59: Export fungsi GET async untuk mendapatkan daftar peserta yang sudah terverifikasi kehadirannya di event tertentu
// Baris 60: Blok try untuk menjalankan kode utama
// Baris 61-62: Destructuring id event dari params dan memanggil getEventAttendees untuk mengambil data peserta yang hadir

// Baris 64-72: Return response JSON berisi:
//              - eventId: ID event
//              - verifiedCount: jumlah peserta yang terverifikasi
//              - attendees: array peserta dengan userId (clerkId), userName (fullName), dan waktu verifikasi (verifiedAt)

// Baris 74-79: Blok catch untuk menangkap error, mencetak error ke console, dan return response error 500 Internal Server Error