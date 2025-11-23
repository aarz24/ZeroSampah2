import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

// Use postgres-js for Supabase compatibility
const client = postgres(process.env.DATABASE_URL!, {
  ssl: 'require',
  max: 1, // Limit connections for serverless
});
const db = drizzle({ client });

export default db;
