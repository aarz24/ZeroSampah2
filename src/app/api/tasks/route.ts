import { NextResponse } from 'next/server';
import { getWasteCollectionTasks } from '@/db/actions';

export const dynamic = 'force-dynamic';

// Dummy data for development when database is down
const dummyTasks = [
  {
    id: 1,
    userId: 'user_demo',
    location: 'https://maps.google.com/?q=-6.2088,106.8456',
    wasteType: 'Plastic bottles',
    amount: '5 kg',
    status: 'pending',
    collectorId: null,
    imageUrl: null,
    verificationResult: null,
    date: new Date().toISOString().split('T')[0],
  },
  {
    id: 2,
    userId: 'user_demo',
    location: 'https://maps.google.com/?q=-6.1751,106.8650',
    wasteType: 'Organic waste',
    amount: '3 kg',
    status: 'pending',
    collectorId: null,
    imageUrl: null,
    verificationResult: null,
    date: new Date().toISOString().split('T')[0],
  },
];

export async function GET() {
  try {
    const tasks = await getWasteCollectionTasks();
    console.log('GET /api/tasks - Returning', tasks.length, 'tasks');
    console.log('GET /api/tasks - Task IDs:', tasks.map(t => t.id));
    return NextResponse.json(tasks);
  } catch (err: any) {
    console.error('GET /api/tasks error', err);
    
    // If database unavailable (maintenance), return dummy data
    if (err.code === 'ENOTFOUND' || err.code === 'ETIMEDOUT') {
      console.log('Database unavailable - returning dummy data for development');
      return NextResponse.json(dummyTasks);
    }
    
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}
