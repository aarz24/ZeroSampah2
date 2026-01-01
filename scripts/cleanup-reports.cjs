require('dotenv').config();
const { Client } = require('pg');

async function cleanupReports() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('✅ Connected to Supabase!');

    // Check current state
    const before = await client.query(`
      SELECT id, verification_result, status 
      FROM reports 
      WHERE verification_result IS NOT NULL
    `);
    console.log('\n📋 Reports with verification_result BEFORE cleanup:');
    console.table(before.rows);

    // Delete reports with malformed verification_result
    // This includes reports where verification_result = '[object Object]' string
    const deleteResult = await client.query(`
      DELETE FROM reports 
      WHERE verification_result = '[object Object]' 
         OR (verification_result IS NOT NULL 
             AND verification_result NOT LIKE '{%' 
             AND verification_result != '')
      RETURNING id, user_id, waste_type
    `);
    
    console.log('\n🗑️ Deleted reports with malformed data:');
    console.table(deleteResult.rows);
    console.log(`\n✅ Cleaned up ${deleteResult.rowCount} malformed report(s)`);

    // Show remaining reports
    const after = await client.query(`
      SELECT id, user_id, waste_type, amount, status, verification_result
      FROM reports 
      ORDER BY created_at DESC
    `);
    console.log('\n📋 Remaining reports AFTER cleanup:');
    console.table(after.rows);

  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
  } finally {
    await client.end();
  }
}

cleanupReports();


// Baris 1: Import dan konfigurasi dotenv untuk memuat variabel environment dari file .env
// Baris 2: Import library pg (PostgreSQL client) untuk koneksi ke database

// Baris 4: Deklarasi fungsi async cleanupReports untuk membersihkan data reports yang rusak
// Baris 5-8: Membuat koneksi client PostgreSQL menggunakan DATABASE_URL dengan SSL enabled

// Baris 10: Blok try untuk menjalankan kode utama
// Baris 11-12: Connect ke database dan mencetak konfirmasi berhasil connect

// Baris 14-18: Query untuk mengecek kondisi awal - mengambil semua reports yang punya verification_result
// Baris 19-20: Mencetak data reports SEBELUM cleanup dalam format tabel

// Baris 22-31: Query DELETE untuk menghapus reports dengan verification_result yang rusak:
//              - verification_result = '[object Object]' (string literal yang salah)
//              - verification_result yang bukan JSON valid (tidak diawali '{')
//              - verification_result yang kosong
//              RETURNING digunakan untuk mengembalikan data yang dihapus (id, user_id, waste_type)

// Baris 33-35: Mencetak data reports yang berhasil dihapus dalam format tabel dan jumlah total yang dihapus

// Baris 37-42: Query untuk mengecek kondisi akhir - mengambil semua reports yang tersisa diurutkan dari terbaru
// Baris 43-44: Mencetak data reports SETELAH cleanup dalam format tabel

// Baris 46-48: Blok catch untuk menangkap dan mencetak error jika terjadi kesalahan
// Baris 49-51: Blok finally untuk menutup koneksi database

// Baris 54: Menjalankan fungsi cleanupReports