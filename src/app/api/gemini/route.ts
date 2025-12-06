import { NextResponse } from 'next/server';

// Ensure this API route runs in Node runtime so `process.env` is available during dev
export const runtime = 'nodejs';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(request: Request) {
  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY not configured');
    return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch (e) {
      json = { raw: text };
    }

    if (!res.ok) {
      console.error('Gemini API returned error', { status: res.status, statusText: res.statusText, body: json });
      return NextResponse.json({ error: 'Gemini API error', status: res.status, body: json }, { status: 502 });
    }

    return NextResponse.json(json, { status: res.status });
  } catch (err) {
    console.error('Gemini proxy error', err);
    return NextResponse.json({ error: 'Failed to proxy to Gemini API', details: String(err) }, { status: 500 });
  }
}
