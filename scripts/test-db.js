require('dotenv').config();
const { Client } = require('pg');

(async () => {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    console.log('Connected to DB');

    // Ensure a user exists
    const userRes = await client.query(`SELECT clerk_id FROM users LIMIT 1`);
    let clerkId;
    if (userRes.rows.length === 0) {
      clerkId = 'clerk_demo';
      await client.query(`INSERT INTO users (clerk_id, email, full_name) VALUES ($1, $2, $3)`, [clerkId, 'demo@example.com', 'Demo User']);
      console.log('Inserted demo user', clerkId);
    } else {
      clerkId = userRes.rows[0].clerk_id;
      console.log('Using existing user', clerkId);
    }

    // Insert a test report
    const insertRes = await client.query(
      `INSERT INTO reports (user_id, location, waste_type, amount, image_url, verification_result, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, created_at`,
      [clerkId, 'https://maps.example.com/?q=1,1', 'Plastic', '1 bag', null, null, 'pending']
    );

    console.log('Inserted report:', insertRes.rows[0]);
  } catch (err) {
    console.error('DB test error:', err);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
})();

// Baris 1: Import dan konfigurasi dotenv untuk memuat variabel environment dari file .env
// Baris 2: Import library pg (PostgreSQL client) untuk koneksi ke database

// Baris 4: Membuat fungsi async yang langsung dieksekusi (IIFE - Immediately Invoked Function Expression)
// Baris 5: Membuat koneksi client PostgreSQL menggunakan DATABASE_URL dari environment variable
// Baris 6: Blok try untuk menjalankan kode utama
// Baris 7-8: Connect ke database dan mencetak konfirmasi berhasil connect

// Baris 10-11: Query untuk mengecek apakah ada user di tabel users, mengambil 1 user saja
// Baris 12: Deklarasi variabel clerkId untuk menyimpan ID user
// Baris 13-17: Kondisi jika tidak ada user di database, maka insert user demo baru dengan clerk_id 'clerk_demo', email 'demo@example.com', nama 'Demo User', lalu cetak konfirmasi
// Baris 18-20: Kondisi jika sudah ada user, gunakan clerk_id dari user yang sudah ada dan cetak konfirmasi

// Baris 22-26: Insert report baru ke tabel reports dengan data:
//              - user_id: clerkId dari user yang sudah ada atau baru dibuat
//              - location: URL maps contoh
//              - waste_type: 'Plastic'
//              - amount: '1 bag'
//              - image_url: null
//              - verification_result: null
//              - status: 'pending'
//              RETURNING untuk mengembalikan id dan created_at dari report yang baru dibuat

// Baris 28: Mencetak hasil insert report (id dan created_at)
// Baris 29-32: Blok catch untuk menangkap error, mencetak pesan error, dan set exit code 1 untuk menandakan proses gagal
// Baris 33-35: Blok finally untuk menutup koneksi database