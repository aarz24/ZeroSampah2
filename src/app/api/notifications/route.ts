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

// Baris 1: Import NextResponse dari next/server untuk mengirim response dari API route
// Baris 2: Import fungsi createNotification dari folder db/actions untuk membuat notifikasi baru di database

// Baris 4: Export fungsi POST async untuk menangani request POST pembuatan notifikasi baru
// Baris 5: Blok try untuk menjalankan kode utama
// Baris 6: Parse body request menjadi JSON
// Baris 7: Destructuring userId, message, dan type dari body request
// Baris 8: Memanggil fungsi createNotification untuk membuat notifikasi baru dengan parameter userId, message, dan type, lalu simpan hasilnya ke variabel note
// Baris 9: Return response JSON berisi data notifikasi yang baru dibuat
// Baris 10-13: Blok catch untuk menangkap error, mencetak error ke console dengan prefix 'POST /api/notifications error', dan return response error 500 dengan pesan "Failed to create notification"