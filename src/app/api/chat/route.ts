import { NextResponse } from 'next/server';

// Set max duration for Vercel serverless function
export const maxDuration = 300;

// This is a placeholder for the actual Gemini API integration
// You'll need to add your Gemini API key and implement the actual API calls

const WASTE_MANAGEMENT_RESPONSES = {
  recycling: [
    "Recycling helps reduce landfill waste and conserve natural resources.",
    "Common recyclable items include paper, cardboard, glass, metal, and most plastics.",
    "Always clean and dry recyclables before placing them in the recycling bin.",
    "Check your local recycling guidelines for specific accepted materials."
  ],
  composting: [
    "Composting is a natural process that turns organic waste into nutrient-rich soil.",
    "You can compost fruit and vegetable scraps, coffee grounds, eggshells, and yard waste.",
    "Avoid composting meat, dairy, and oily foods as they can attract pests.",
    "A balanced compost pile needs a mix of greens (nitrogen) and browns (carbon)."
  ],
  hazardous: [
    "Hazardous waste includes batteries, electronics, chemicals, and certain household products.",
    "Never dispose of hazardous waste in regular trash or down the drain.",
    "Many communities have special collection days or drop-off centers for hazardous waste.",
    "Always check the label for proper disposal instructions on hazardous materials."
  ],
  general: [
    "Proper waste management helps protect our environment and public health.",
    "The waste hierarchy prioritizes: reduce, reuse, recycle, and then dispose.",
    "Consider the environmental impact of your purchases to reduce waste generation.",
    "Many items can be repaired or repurposed instead of being thrown away."
  ]
};

export async function POST(req: Request) {
  try {
    const { message, imageUrl } = await req.json();

    // Simple keyword-based response system
    let responseContent = '';
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('recycl')) {
      responseContent = WASTE_MANAGEMENT_RESPONSES.recycling[
        Math.floor(Math.random() * WASTE_MANAGEMENT_RESPONSES.recycling.length)
      ];
    } else if (lowerMessage.includes('compost')) {
      responseContent = WASTE_MANAGEMENT_RESPONSES.composting[
        Math.floor(Math.random() * WASTE_MANAGEMENT_RESPONSES.composting.length)
      ];
    } else if (lowerMessage.includes('hazard') || lowerMessage.includes('chemical')) {
      responseContent = WASTE_MANAGEMENT_RESPONSES.hazardous[
        Math.floor(Math.random() * WASTE_MANAGEMENT_RESPONSES.hazardous.length)
      ];
    } else {
      responseContent = WASTE_MANAGEMENT_RESPONSES.general[
        Math.floor(Math.random() * WASTE_MANAGEMENT_RESPONSES.general.length)
      ];
    }

    // If there's an image, add image-specific response
    if (imageUrl) {
      responseContent += " I can see the image you've shared. For proper waste management, please ensure items are clean, dry, and properly sorted before disposal.";
    }

    const response = {
      role: 'assistant',
      content: responseContent,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
} 

// Baris 1: Import NextResponse dari next/server untuk mengirim response dari API route

// Baris 3-4: Set maxDuration = 300 detik (5 menit) sebagai batas waktu maksimal eksekusi fungsi serverless di Vercel

// Baris 6-7: Komentar placeholder yang menjelaskan bahwa ini adalah tempat untuk integrasi Gemini API yang sebenarnya

// Baris 9-37: Deklarasi objek WASTE_MANAGEMENT_RESPONSES yang berisi template respons chatbot untuk topik pengelolaan sampah:
//             - recycling: array 4 respons tentang daur ulang
//             - composting: array 4 respons tentang pengomposan
//             - hazardous: array 4 respons tentang sampah berbahaya
//             - general: array 4 respons umum tentang pengelolaan sampah

// Baris 39: Export fungsi POST async untuk menangani request POST ke endpoint API ini
// Baris 40: Blok try untuk menjalankan kode utama
// Baris 41: Destructuring message dan imageUrl dari body request JSON

// Baris 43-44: Inisialisasi variabel responseContent kosong dan convert message ke lowercase untuk pengecekan keyword

// Baris 46-50: Kondisi jika message mengandung kata 'recycl' (recycle/recycling), pilih random response dari array recycling
// Baris 51-55: Kondisi jika message mengandung kata 'compost', pilih random response dari array composting
// Baris 56-60: Kondisi jika message mengandung kata 'hazard' atau 'chemical', pilih random response dari array hazardous
// Baris 61-65: Kondisi else (default), pilih random response dari array general

// Baris 67-70: Jika ada imageUrl, tambahkan teks tambahan ke responseContent tentang melihat gambar dan tips pengelolaan sampah

// Baris 72-75: Membuat objek response dengan role 'assistant' dan content berisi responseContent yang sudah dipilih

// Baris 77: Return response dalam format JSON menggunakan NextResponse.json
// Baris 78-83: Blok catch untuk menangkap error, mencetak error ke console, dan return response error dengan status 500