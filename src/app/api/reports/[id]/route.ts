import { NextResponse } from 'next/server';
import { getReportById, updateReportStatus } from '@/db/actions';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const report = await getReportById(Number(id));
    return NextResponse.json(report);
  } catch (err) {
    console.error('GET /api/reports/[id] error', err);
    return NextResponse.json({ error: 'Failed to fetch report' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, collectorId } = body;
    const updated = await updateReportStatus(Number(id), status, collectorId);
    return NextResponse.json(updated);
  } catch (err) {
    console.error('PATCH /api/reports/[id] error', err);
    return NextResponse.json({ error: 'Failed to update report' }, { status: 500 });
  }
}

// Baris 1: Import NextResponse dari next/server untuk mengirim response dari API route
// Baris 2: Import fungsi getReportById dan updateReportStatus dari folder db/actions untuk operasi database report

// Baris 4: Export fungsi GET async untuk menangani request GET detail report berdasarkan ID, menerima request dan params yang berisi id report
// Baris 5: Blok try untuk menjalankan kode utama
// Baris 6: Destructuring id report dari params yang sudah di-await
// Baris 7: Memanggil fungsi getReportById dengan id yang dikonversi ke Number untuk mengambil detail report dari database
// Baris 8: Return response JSON berisi data report
// Baris 9-12: Blok catch untuk menangkap error, mencetak error ke console dengan prefix 'GET /api/reports/[id] error', dan return response error 500 dengan pesan "Failed to fetch report"

// Baris 14: Export fungsi PATCH async untuk menangani request PATCH update status report, menerima request dan params yang berisi id report
// Baris 15: Blok try untuk menjalankan kode utama
// Baris 16: Destructuring id report dari params yang sudah di-await
// Baris 17: Parse body request menjadi JSON
// Baris 18: Destructuring status dan collectorId dari body request
// Baris 19: Memanggil fungsi updateReportStatus dengan parameter id (dikonversi ke Number), status baru, dan collectorId untuk update status report di database
// Baris 20: Return response JSON berisi data report yang sudah diupdate
// Baris 21-24: Blok catch untuk menangkap error, mencetak error ke console dengan prefix 'PATCH /api/reports/[id] error', dan return response error 500 dengan pesan "Failed to update report"