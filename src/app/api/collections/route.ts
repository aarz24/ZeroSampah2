import { NextResponse } from 'next/server';
import { createCollectedWaste, updateUserPoints, createTransaction } from '@/db/actions';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { reportId, collectorId, comments } = body;
    
    // Create collected waste record
    const collected = await createCollectedWaste(reportId, collectorId, comments);
    
    if (collected) {
      // Award points to the collector (e.g., 50 points per collection)
      const pointsToAward = 50;
      await updateUserPoints(collectorId, pointsToAward);
      
      // Create transaction record for points earned
      await createTransaction(
        collectorId,
        null, // no reward_id for earning points
        pointsToAward,
        'earned',
        `Points earned from collecting waste (Report #${reportId})`
      );
    }
    
    return NextResponse.json(collected);
  } catch (err) {
    console.error('POST /api/collections error', err);
    return NextResponse.json({ error: 'Failed to create collected waste' }, { status: 500 });
  }
}

// Baris 1: Import NextResponse dari next/server untuk mengirim response dari API route
// Baris 2: Import fungsi createCollectedWaste, updateUserPoints, dan createTransaction dari folder db/actions untuk operasi database

// Baris 4: Export fungsi POST async untuk menangani request POST ke endpoint API ini
// Baris 5: Blok try untuk menjalankan kode utama
// Baris 6: Parse body request menjadi JSON
// Baris 7: Destructuring reportId, collectorId, dan comments dari body request

// Baris 9-10: Membuat record collected waste baru di database dengan memanggil fungsi createCollectedWaste menggunakan reportId, collectorId, dan comments

// Baris 12: Kondisi jika collected waste berhasil dibuat (collected tidak null/undefined)
// Baris 13-14: Set jumlah poin yang akan diberikan ke collector = 50 poin per pengumpulan sampah
// Baris 15: Update total poin user collector dengan menambahkan pointsToAward menggunakan fungsi updateUserPoints

// Baris 17-22: Membuat record transaksi baru di database untuk mencatat poin yang didapat:
//              - collectorId: ID user yang mengumpulkan
//              - null: tidak ada reward_id karena ini earning points bukan redeem
//              - pointsToAward: jumlah poin yang didapat (50)
//              - 'earned': tipe transaksi adalah mendapat poin
//              - description: deskripsi transaksi dengan nomor report

// Baris 25: Return response JSON berisi data collected waste yang baru dibuat
// Baris 26-29: Blok catch untuk menangkap error, mencetak error ke console, dan return response error dengan status 500