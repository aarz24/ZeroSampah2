import { NextResponse } from 'next/server';

export const maxDuration = 300;

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

// Baris 1: Import NextResponse dari next/server untuk mengirim response dari API route

// Baris 3: Set maxDuration = 300 detik (5 menit) sebagai batas waktu maksimal eksekusi fungsi serverless di Vercel

// Baris 5: Export fungsi GET async untuk menangani request GET ekstraksi koordinat dari URL Google Maps
// Baris 6: Blok try untuk menjalankan kode utama
// Baris 7: Parse URL request dan ambil searchParams untuk mendapat query parameters
// Baris 8: Ambil parameter 'url' dari query string (URL Google Maps yang akan diekstrak koordinatnya)

// Baris 10-12: Validasi jika parameter url tidak ada, return error 400 Bad Request dengan pesan "URL parameter required"

// Baris 14-18: Melakukan HTTP request ke URL Google Maps menggunakan method HEAD (hanya ambil header tanpa body) dengan redirect 'follow' untuk mengikuti semua redirect sampai dapat URL final

// Baris 20: Menyimpan URL final setelah semua redirect di-follow ke variabel finalUrl

// Baris 22-26: Deklarasi array patterns berisi 3 regex pattern untuk mencocokkan format koordinat di URL:
//              - /@(-?\d+\.\d+),(-?\d+\.\d+)/: format @lat,lng
//              - /q=(-?\d+\.\d+),(-?\d+\.\d+)/: format q=lat,lng  
//              - /ll=(-?\d+\.\d+),(-?\d+\.\d+)/: format ll=lat,lng
//              Regex menangkap angka desimal positif atau negatif untuk latitude dan longitude

// Baris 28-41: Loop melalui setiap pattern regex:
//              Baris 29: Coba cocokkan finalUrl dengan pattern
//              Baris 30-40: Jika match ditemukan, return response JSON berisi:
//                           - coordinates: objek dengan lat (match[1]) dan lng (match[2]) yang diparse ke float
//                           - originalUrl: URL asli yang dikirim user
//                           - resolvedUrl: URL final setelah redirect

// Baris 43: Jika tidak ada pattern yang cocok, return error 400 dengan pesan "Could not extract coordinates from URL"
// Baris 44-47: Blok catch untuk menangkap error, mencetak error ke console, dan return response error 500 "Failed to process URL"