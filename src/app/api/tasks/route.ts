import { NextResponse } from 'next/server';
import { getWasteCollectionTasks } from '@/db/actions';

export const dynamic = 'force-dynamic';

// Dummy data for development when database is down
const dummyTasks = [
  {
    id: 1,
    userId: 'user_demo',
    location: 'https://maps.google.com/?q=-6.2088,106.8456',
    wasteType: 'Plastic bottles',
    amount: '5 kg',
    status: 'pending',
    collectorId: null,
    imageUrl: null,
    verificationResult: null,
    date: new Date().toISOString().split('T')[0],
  },
  {
    id: 2,
    userId: 'user_demo',
    location: 'https://maps.google.com/?q=-6.1751,106.8650',
    wasteType: 'Organic waste',
    amount: '3 kg',
    status: 'pending',
    collectorId: null,
    imageUrl: null,
    verificationResult: null,
    date: new Date().toISOString().split('T')[0],
  },
];

export async function GET() {
  try {
    const tasks = await getWasteCollectionTasks();
    return NextResponse.json(tasks);
  } catch (err: any) {
    console.error('GET /api/tasks error', err);
    
    // If database unavailable (maintenance), return dummy data
    if (err.code === 'ENOTFOUND' || err.code === 'ETIMEDOUT') {
      console.log('Database unavailable - returning dummy data for development');
      return NextResponse.json(dummyTasks);
    }
    
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

// Baris 1: Import NextResponse dari next/server untuk mengirim response dari API route
// Baris 2: Import fungsi getWasteCollectionTasks dari folder db/actions untuk mengambil daftar tugas pengumpulan sampah dari database

// Baris 4: Export dynamic = 'force-dynamic' untuk memaksa route ini selalu dinamis (tidak di-cache) di Next.js

// Baris 6-32: Deklarasi array dummyTasks berisi data dummy untuk development ketika database down:
//             - Task 1: Plastic bottles 5 kg di Jakarta dengan status pending
//             - Task 2: Organic waste 3 kg di Jakarta dengan status pending
//             Setiap task punya: id, userId, location (Google Maps URL), wasteType, amount, status, collectorId (null), imageUrl (null), verificationResult (null), dan date (tanggal hari ini)

// Baris 34: Export fungsi GET async untuk menangani request GET daftar tugas pengumpulan sampah
// Baris 35: Blok try untuk menjalankan kode utama
// Baris 36: Memanggil fungsi getWasteCollectionTasks untuk mengambil semua task dari database
// Baris 37: Return response JSON berisi daftar tasks
// Baris 38-48: Blok catch untuk menangkap error:
//              Baris 39: Log error ke console dengan prefix 'GET /api/tasks error'
//              Baris 41-44: Jika error code adalah ENOTFOUND atau ETIMEDOUT (database tidak tersedia/maintenance), log pesan dan return dummyTasks sebagai fallback untuk development
//              Baris 46: Untuk error lainnya, return response error 500 dengan pesan "Failed to fetch tasks"