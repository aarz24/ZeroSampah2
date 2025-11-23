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
