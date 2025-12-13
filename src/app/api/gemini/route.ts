import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Set max duration for Vercel serverless function (300 seconds max for Hobby plan)
export const maxDuration = 300;

export async function POST(request: Request) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    // Add timeout to the fetch request (295 seconds, buffer before maxDuration)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 295000);
    
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    const json = await res.json();
    
    // Log error details for debugging
    if (!res.ok) {
      console.error('Gemini API Error:', {
        status: res.status,
        statusText: res.statusText,
        error: json
      });
    }
    
    return NextResponse.json(json, { status: res.status });
  } catch (err) {
    console.error('Gemini proxy error', err);
    
    // Handle timeout specifically
    if (err instanceof Error && err.name === 'AbortError') {
      return NextResponse.json({ 
        error: 'Request timeout - AI analysis took too long (>295s)',
        details: 'Please try with a smaller image or simpler request'
      }, { status: 504 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to proxy to Gemini API',
      details: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 });
  }
}
