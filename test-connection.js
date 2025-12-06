import 'dotenv/config';
import pg from 'pg';

const { Client } = pg;

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function testConnection() {
  try {
    console.log('Testing connection to:', process.env.DATABASE_URL?.replace(/:[^:]*@/, ':****@'));
    await client.connect();
    console.log('✅ Connected successfully!');
    
    const res = await client.query('SELECT version()');
    console.log('✅ Database version:', res.rows[0].version);
    
    await client.end();
    console.log('✅ Connection closed');
  } catch (err) {
    console.error('❌ Connection error:', err.message);
    process.exit(1);
  }
}

testConnection();
