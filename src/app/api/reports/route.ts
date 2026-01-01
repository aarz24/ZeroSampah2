import { NextResponse } from 'next/server';
import { createReport, getRecentReports, updateUserPoints, createTransaction } from '@/db/actions';
import { validateCreateReport, createValidationErrorResponse, sanitizeString } from '@/lib/validation';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const limit = Number(url.searchParams.get('limit') || '10');
    
    // Validate limit parameter
    if (isNaN(limit) || limit < 1 || limit > 100) {
      return NextResponse.json({ 
        error: 'Invalid limit parameter. Must be between 1 and 100' 
      }, { status: 400 });
    }
    
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
    
    // Sanitize inputs
    const input = {
      userId: sanitizeString(body.userId || ''),
      location: sanitizeString(body.location || ''),
      wasteType: body.wasteType || '',
      amount: sanitizeString(body.amount || ''),
      imageUrl: body.imageUrl || undefined,
    };
    
    // Validate input
    const validation = validateCreateReport(input);
    if (!validation.valid) {
      return NextResponse.json(
        createValidationErrorResponse(validation.errors),
        { status: 400 }
      );
    }
    
    console.log('POST /api/reports - Calling createReport with userId:', input.userId);
    
    // Create the report
    const report = await createReport(
      input.userId, 
      input.location, 
      input.wasteType, 
      input.amount, 
      input.imageUrl, 
      body.verificationResult
    );
    console.log('POST /api/reports - Created report:', report);
    
    // Award points for reporting (e.g., 10 points per report)
    if (report) {
      const pointsForReport = 10;
      await updateUserPoints(input.userId, pointsForReport);
      
      // Create transaction record
      await createTransaction(
        input.userId,
        null,
        pointsForReport,
        'earned',
        `Points earned for reporting waste (Report #${report.id})`
      );
      
      console.log(`Awarded ${pointsForReport} points to user ${input.userId} for report #${report.id}`);
    }
    
    return NextResponse.json(report);
  } catch (err) {
    console.error('POST /api/reports error', err);
    return NextResponse.json({ error: 'Failed to create report' }, { status: 500 });
  }
}
