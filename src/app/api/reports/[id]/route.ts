import { NextResponse } from 'next/server';
import { getReportById, updateReportStatus } from '@/db/actions';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const report = await getReportById(Number(id));
    return NextResponse.json(report);
  } catch (err) {
    console.error('GET /api/reports/[id] error', err);
    return NextResponse.json({ error: 'Failed to fetch report' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, collectorId } = body;
    const updated = await updateReportStatus(Number(id), status, collectorId);
    return NextResponse.json(updated);
  } catch (err) {
    console.error('PATCH /api/reports/[id] error', err);
    return NextResponse.json({ error: 'Failed to update report' }, { status: 500 });
  }
}
