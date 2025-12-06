require('dotenv').config();
const { Client } = require('pg');

async function testConnection() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('✅ Connected to Supabase!');

    // Test query
    const result = await client.query('SELECT COUNT(*) FROM reports');
    console.log('✅ Reports count:', result.rows[0].count);

    const users = await client.query('SELECT clerk_id, email FROM users LIMIT 5');
    console.log('✅ Users:', users.rows);

    // Show all reports
    const allReports = await client.query('SELECT id, user_id, waste_type, amount, status, created_at FROM reports ORDER BY created_at DESC');
    console.log('\n📋 All Reports:');
    console.table(allReports.rows);

  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  } finally {
    await client.end();
  }
}

testConnection();
