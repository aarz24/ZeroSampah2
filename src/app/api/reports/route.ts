import { NextResponse } from 'next/server';
import { createReport, getRecentReports, updateUserPoints, createTransaction } from '@/db/actions';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const limit = Number(url.searchParams.get('limit') || '10');
    const reports = await getRecentReports(limit);
    return NextResponse.json(reports);
  } catch (err) {
    console.error('GET /api/reports error', err);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('POST /api/reports - Received body:', JSON.stringify(body, null, 2));
    const { userId, location, wasteType, amount, imageUrl, verificationResult } = body;
    console.log('POST /api/reports - Calling createReport with userId:', userId);
    
    // Create the report
    const report = await createReport(userId, location, wasteType, amount, imageUrl, verificationResult);
    console.log('POST /api/reports - Created report:', report);
    
    // Award points for reporting (e.g., 10 points per report)
    if (report) {
      const pointsForReport = 10;
      await updateUserPoints(userId, pointsForReport);
      
      // Create transaction record
      await createTransaction(
        userId,
        null,
        pointsForReport,
        'earned',
        `Points earned for reporting waste (Report #${report.id})`
      );
      
      console.log(`Awarded ${pointsForReport} points to user ${userId} for report #${report.id}`);
    }
    
    return NextResponse.json(report);
  } catch (err) {
    console.error('POST /api/reports error', err);
    return NextResponse.json({ error: 'Failed to create report' }, { status: 500 });
  }
}

// Baris 1: Import NextResponse dari next/server untuk mengirim response dari API route
// Baris 2: Import fungsi createReport, getRecentReports, updateUserPoints, dan createTransaction dari folder db/actions untuk operasi database

// Baris 4: Export dynamic = 'force-dynamic' untuk memaksa route ini selalu dinamis (tidak di-cache) di Next.js
// Baris 5: Set maxDuration = 300 detik (5 menit) sebagai batas waktu maksimal eksekusi fungsi serverless di Vercel

// Baris 7: Export fungsi GET async untuk menangani request GET daftar report terbaru
// Baris 8: Blok try untuk menjalankan kode utama
// Baris 9: Parse URL dari request
// Baris 10: Ambil parameter 'limit' dari query string, default 10 jika tidak ada, lalu convert ke Number
// Baris 11: Memanggil fungsi getRecentReports dengan parameter limit untuk mengambil report terbaru dari database
// Baris 12: Return response JSON berisi daftar reports
// Baris 13-16: Blok catch untuk menangkap error, mencetak error ke console dengan prefix 'GET /api/reports error', dan return response error 500 dengan pesan "Failed to fetch reports"

// Baris 18: Export fungsi POST async untuk menangani request POST pembuatan report baru
// Baris 19: Blok try untuk menjalankan kode utama
// Baris 20: Parse body request menjadi JSON
// Baris 21: Log body request yang diterima dalam format JSON yang rapi untuk debugging
// Baris 22: Destructuring userId, location, wasteType, amount, imageUrl, dan verificationResult dari body
// Baris 23: Log userId yang akan digunakan untuk create report

// Baris 25-27: Memanggil fungsi createReport untuk membuat report baru dengan semua parameter dan log hasilnya

// Baris 29-44: Jika report berhasil dibuat:
//              Baris 30-31: Set pointsForReport = 10 poin dan panggil updateUserPoints untuk menambah poin user
//              Baris 33-39: Membuat record transaksi dengan createTransaction:
//                           - userId: ID user yang dapat poin
//                           - null: tidak ada reward_id (ini earning bukan redeem)
//                           - pointsForReport: jumlah poin (10)
//                           - 'earned': tipe transaksi
//                           - description dengan nomor report
//              Baris 41: Log konfirmasi pemberian poin ke user

// Baris 45: Return response JSON berisi data report yang baru dibuat
// Baris 46-49: Blok catch untuk menangkap error, mencetak error ke console dengan prefix 'POST /api/reports error', dan return response error 500 dengan pesan "Failed to create report"