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
