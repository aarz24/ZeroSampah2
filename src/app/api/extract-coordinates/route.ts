import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json({ error: 'URL parameter required' }, { status: 400 });
    }

    // Follow redirects to get the full URL
    const response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
    });

    const finalUrl = response.url;

    // Extract coordinates from the final URL
    const patterns = [
      /@(-?\d+\.\d+),(-?\d+\.\d+)/, // @lat,lng
      /q=(-?\d+\.\d+),(-?\d+\.\d+)/, // q=lat,lng
      /ll=(-?\d+\.\d+),(-?\d+\.\d+)/, // ll=lat,lng
    ];

    for (const pattern of patterns) {
      const match = finalUrl.match(pattern);
      if (match) {
        return NextResponse.json({
          coordinates: {
            lat: parseFloat(match[1]),
            lng: parseFloat(match[2]),
          },
          originalUrl: url,
          resolvedUrl: finalUrl,
        });
      }
    }

    return NextResponse.json({ error: 'Could not extract coordinates from URL' }, { status: 400 });
  } catch (error) {
    console.error('Error extracting coordinates:', error);
    return NextResponse.json({ error: 'Failed to process URL' }, { status: 500 });
  }
}
