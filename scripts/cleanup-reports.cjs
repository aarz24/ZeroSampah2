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
