import { NextResponse } from 'next/server';
import { getLeaderboard } from '@/db/actions';

export async function GET() {
  try {
    const leaderboard = await getLeaderboard(100);
    return NextResponse.json(leaderboard);
  } catch (err) {
    console.error('GET /api/leaderboard error', err);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}

// Baris 1: Import NextResponse dari next/server untuk mengirim response dari API route
// Baris 2: Import fungsi getLeaderboard dari folder db/actions untuk mengambil data leaderboard dari database

// Baris 4: Export fungsi GET async untuk menangani request GET daftar leaderboard/papan peringkat
// Baris 5: Blok try untuk menjalankan kode utama
// Baris 6: Memanggil fungsi getLeaderboard dengan parameter 100 (ambil top 100 user dengan poin tertinggi) dan simpan hasilnya
// Baris 7: Return response JSON berisi data leaderboard
// Baris 8-11: Blok catch untuk menangkap error, mencetak error ke console dengan prefix 'GET /api/leaderboard error', dan return response error 500 dengan pesan "Failed to fetch leaderboard"