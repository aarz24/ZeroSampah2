import { NextResponse } from 'next/server';
import db from '@/db/index';
import { Users, Reports, EventAttendance } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    
    // Fetch user data with points
    const [user] = await db
      .select({
        points: Users.points,
        fullName: Users.fullName,
        email: Users.email,
      })
      .from(Users)
      .where(eq(Users.clerkId, userId))
      .execute();
    
    // Count user's reports
    const reports = await db
      .select()
      .from(Reports)
      .where(eq(Reports.userId, userId))
      .execute();
    
    const reportsCount = reports.length;
    const points = user?.points || 0;
    
    // Count events attended
    const eventsAttended = await db
      .select()
      .from(EventAttendance)
      .where(eq(EventAttendance.userId, userId))
      .execute();
    
    const eventsAttendedCount = eventsAttended.length;
    
    // Calculate rank based on points
    let rank = "Pemula";
    if (points > 500) rank = "Master";
    else if (points > 200) rank = "Juara";
    else if (points > 50) rank = "Pejuang";
    
    // Calculate impact based on reports
    let impact = "Rendah";
    if (reportsCount > 15) impact = "Tinggi";
    else if (reportsCount > 5) impact = "Sedang";
    
    return NextResponse.json({
      points,
      reportsCount,
      eventsAttendedCount,
      rank,
      impact,
      userName: user?.fullName || "User",
    });
  } catch (err) {
    console.error('GET /api/users/[userId]/stats error', err);
    return NextResponse.json(
      { error: 'Failed to fetch user stats' },
      { status: 500 }
    );
  }
}

// Baris 1: Import NextResponse dari next/server untuk mengirim response dari API route
// Baris 2: Import db (koneksi database) dari folder db/index
// Baris 3: Import schema tabel Users dan Reports dari db/schema
// Baris 4: Import fungsi eq (equal) dan desc (descending) dari drizzle-orm untuk query database

// Baris 6-9: Export fungsi GET async untuk menangani request GET statistik user berdasarkan userId, menerima request dan params yang berisi userId
// Baris 10: Blok try untuk menjalankan kode utama
// Baris 11: Destructuring userId dari params

// Baris 13-22: Query database untuk mengambil data user:
//              - Select hanya kolom points, fullName, dan email dari tabel Users
//              - Where kondisi clerkId sama dengan userId
//              - Hasil query diambil index pertama [0] karena user seharusnya unique

// Baris 24-29: Query database untuk menghitung jumlah reports user:
//              - Select semua kolom dari tabel Reports
//              - Where kondisi userId sama dengan userId dari params
//              - Execute query

// Baris 31: Hitung jumlah reports dengan mengambil panjang array reports
// Baris 32: Ambil points dari user, default 0 jika user tidak ada

// Baris 34-38: Logika menentukan rank berdasarkan points:
//              - Default rank = "Eco Warrior"
//              - Jika points > 500: rank = "Eco Master"
//              - Jika points > 200: rank = "Eco Champion"  
//              - Jika points > 50: rank = "Eco Hero"

// Baris 40-43: Logika menentukan impact berdasarkan jumlah reports:
//              - Default impact = "Growing"
//              - Jika reportsCount > 15: impact = "Significant"
//              - Jika reportsCount > 5: impact = "Positive"

// Baris 45-51: Return response JSON berisi statistik user: points, reportsCount, rank, impact, dan userName (fullName atau default "User")
// Baris 52-57: Blok catch untuk menangkap error, mencetak error ke console dengan prefix 'GET /api/users/[userId]/stats error', dan return response error 500 dengan pesan "Failed to fetch user stats"