import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Set max duration for Vercel serverless function (300 seconds max for Hobby plan)
export const maxDuration = 300;

export async function POST(request: Request) {
  console.log('Gemini API called, key present:', !!GEMINI_API_KEY);
  
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    console.log('Request body received, contents length:', body.contents?.length);
    
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
    
    console.log('Gemini response status:', res.status);
    
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

// Baris 1: Import NextResponse dari next/server untuk mengirim response dari API route

// Baris 3: Deklarasi konstanta GEMINI_API_KEY yang mengambil API key Gemini dari environment variable

// Baris 5-6: Set maxDuration = 300 detik (5 menit) sebagai batas waktu maksimal eksekusi fungsi serverless di Vercel (maksimal untuk Hobby plan)

// Baris 8: Export fungsi POST async untuk menangani request POST ke Gemini API sebagai proxy
// Baris 9: Mencetak log apakah GEMINI_API_KEY ada atau tidak (dengan !! untuk convert ke boolean)

// Baris 11-13: Validasi jika GEMINI_API_KEY tidak ada di environment, return error 500 dengan pesan "GEMINI_API_KEY not configured"

// Baris 15: Blok try untuk menjalankan kode utama
// Baris 16-17: Parse body request menjadi JSON dan log panjang array contents yang dikirim

// Baris 19: Membuat URL endpoint Gemini API dengan model gemini-2.5-flash dan menambahkan API key sebagai query parameter

// Baris 21-23: Membuat AbortController untuk timeout handling dan set timeout 295 detik (295000 ms) sebagai buffer sebelum maxDuration, akan memanggil abort() jika timeout tercapai

// Baris 25-30: Melakukan fetch request ke Gemini API dengan:
//              - method POST
//              - header Content-Type application/json
//              - body berisi data request yang di-stringify
//              - signal dari controller untuk handle timeout/abort

// Baris 32: Clear timeout karena request sudah selesai sebelum timeout

// Baris 34: Parse response dari Gemini API menjadi JSON

// Baris 36: Log status code response dari Gemini API

// Baris 38-44: Jika response tidak ok (status bukan 2xx), log detail error termasuk status, statusText, dan object error dari Gemini

// Baris 46: Return response JSON dari Gemini dengan status code yang sama seperti response asli dari Gemini
// Baris 47-61: Blok catch untuk menangkap error:
//              Baris 48: Log error ke console
//              Baris 50-56: Jika error adalah AbortError (timeout), return error 504 Gateway Timeout dengan pesan request timeout >295s dan saran untuk coba dengan gambar lebih kecil
//              Baris 58-61: Untuk error lainnya, return error 500 dengan pesan "Failed to proxy to Gemini API" dan detail error message