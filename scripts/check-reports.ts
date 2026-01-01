// Load environment variables from .env when running this script directly
import 'dotenv/config';
import db from '../src/db/index';
import { Reports } from '../src/db/schema';
import { desc } from 'drizzle-orm';

(async () => {
  try {
    console.log('Connecting using DATABASE_URL:', process.env.DATABASE_URL ? '[SET]' : '[NOT SET]');
    const reports = await db.select().from(Reports).orderBy(desc(Reports.createdAt)).limit(10).execute();
    console.log('Recent reports (up to 10):');
    console.log(JSON.stringify(reports, null, 2));
  } catch (error) {
    console.error('Error querying reports:', error);
  } finally {
    process.exit(0);
  }
})();

// Baris 1-2: Import konfigurasi dotenv untuk memuat variabel environment dari file .env, dan import koneksi database dari folder src/db
// Baris 3: Import schema tabel Reports dan fungsi desc (descending) dari Drizzle ORM
// Baris 5: Membuat fungsi async yang langsung dieksekusi (IIFE - Immediately Invoked Function Expression)
// Baris 6-7: Blok try untuk menjalankan kode utama
// Baris 8: Mencetak status apakah DATABASE_URL sudah diset atau belum di environment
// Baris 9: Query database untuk mengambil data dari tabel Reports, diurutkan berdasarkan createdAt dari yang terbaru, dibatasi 10 data saja
// Baris 10-11: Mencetak hasil query dalam format JSON yang rapi
// Baris 12-13: Blok catch untuk menangkap dan mencetak error jika terjadi kesalahan
// Baris 14-15: Blok finally yang selalu dijalankan untuk keluar dari proses