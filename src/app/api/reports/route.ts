import { NextResponse } from 'next/server';
import { createReport, getRecentReports, updateUserPoints, createTransaction } from '@/db/actions';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const limit = Number(url.searchParams.get('limit') || '10');
    const reports = await getRecentReports(limit);
    return NextResponse.json(reports);
  } catch (err) {
    console.error('GET /api/reports error', err);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('POST /api/reports - Received body:', JSON.stringify(body, null, 2));
    const { userId, location, wasteType, amount, imageUrl, verificationResult } = body;
    console.log('POST /api/reports - Calling createReport with userId:', userId);
    
    // Create the report
    const report = await createReport(userId, location, wasteType, amount, imageUrl, verificationResult);
    console.log('POST /api/reports - Created report:', report);
    
    // Award points for reporting (e.g., 10 points per report)
    if (report) {
      const pointsForReport = 10;
      await updateUserPoints(userId, pointsForReport);
      
      // Create transaction record
      await createTransaction(
        userId,
        null,
        pointsForReport,
        'earned',
        `Points earned for reporting waste (Report #${report.id})`
      );
      
      console.log(`Awarded ${pointsForReport} points to user ${userId} for report #${report.id}`);
    }
    
    return NextResponse.json(report);
  } catch (err) {
    console.error('POST /api/reports error', err);
    return NextResponse.json({ error: 'Failed to create report' }, { status: 500 });
  }
}
