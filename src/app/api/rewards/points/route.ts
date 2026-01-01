import { NextResponse } from 'next/server';
import { updateRewardPoints } from '@/db/actions';
import db from '@/db/index';
import { Users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }
    
    const [user] = await db
      .select({ points: Users.points })
      .from(Users)
      .where(eq(Users.clerkId, userId))
      .execute();
    
    return NextResponse.json({ points: user?.points || 0 });
  } catch (err) {
    console.error('GET /api/rewards/points error', err);
    return NextResponse.json({ error: 'Failed to fetch points' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, pointsToAdd } = body;
    const updated = await updateRewardPoints(userId, Number(pointsToAdd));
    return NextResponse.json(updated);
  } catch (err) {
    console.error('POST /api/rewards/points error', err);
    return NextResponse.json({ error: 'Failed to update reward points' }, { status: 500 });
  }
}

// Baris 1: Import NextResponse dari next/server untuk mengirim response dari API route
// Baris 2: Import fungsi updateRewardPoints dari folder db/actions untuk update poin reward user di database

// Baris 4: Export fungsi POST async untuk menangani request POST update/tambah poin reward user
// Baris 5: Blok try untuk menjalankan kode utama
// Baris 6: Parse body request menjadi JSON
// Baris 7: Destructuring userId dan pointsToAdd dari body request
// Baris 8: Memanggil fungsi updateRewardPoints dengan parameter userId dan pointsToAdd (dikonversi ke Number) untuk menambah poin user di database, lalu simpan hasilnya ke variabel updated
// Baris 9: Return response JSON berisi data user yang sudah diupdate poinnya
// Baris 10-13: Blok catch untuk menangkap error, mencetak error ke console dengan prefix 'POST /api/rewards/points error', dan return response error 500 dengan pesan "Failed to update reward points"