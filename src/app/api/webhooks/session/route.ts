import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";

const CLERK_WEBHOOK_SECRET_SESSION = process.env.CLERK_WEBHOOK_SECRET_SESSION;

export async function POST(req: NextRequest) {
  try {
    const headers = req.headers;
    const svixId = headers.get("svix-id");
    const svixTimestamp = headers.get("svix-timestamp");
    const svixSignature = headers.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature || !CLERK_WEBHOOK_SECRET_SESSION) {
      return NextResponse.json(false, { status: 400 });
    }

    const payload = await req.text();

    try {
      const wh = new Webhook(CLERK_WEBHOOK_SECRET_SESSION);
      wh.verify(payload, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      });
    } catch (error) {
      console.error("Invalid webhook signature:", error);
      return NextResponse.json(false, { status: 401 });
    }

    const body = JSON.parse(payload);

    if (!body.type || !body.data) {
      return NextResponse.json(false, { status: 400 });
    }

    if (body.type === "session.created") {
      return NextResponse.json(true);
    }

    if (body.type === "session.ended") {
      return NextResponse.json(false);
    }

    return NextResponse.json(false);
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(false, { status: 500 });
  }
}

// Baris 1: Import NextRequest dan NextResponse dari next/server untuk menangani request dan response di API route
// Baris 2: Import Webhook dari library svix untuk verifikasi webhook signature dari Clerk

// Baris 4: Deklarasi konstanta CLERK_WEBHOOK_SECRET_SESSION yang mengambil webhook secret dari environment variable untuk verifikasi webhook Clerk

// Baris 6: Export fungsi POST async untuk menangani request POST webhook dari Clerk tentang session events
// Baris 7: Blok try untuk menjalankan kode utama
// Baris 8: Ambil headers dari request
// Baris 9-11: Ambil header svix-id, svix-timestamp, dan svix-signature yang dikirim oleh Clerk untuk verifikasi webhook

// Baris 13-15: Validasi jika ada header yang missing atau CLERK_WEBHOOK_SECRET_SESSION tidak ada, return response false dengan status 400 Bad Request

// Baris 17: Ambil payload request sebagai raw text (bukan JSON) karena diperlukan untuk verifikasi signature

// Baris 19-27: Blok try-catch untuk verifikasi webhook signature:
//              Baris 20: Membuat instance Webhook dengan secret key
//              Baris 21-25: Memanggil wh.verify untuk memverifikasi payload dengan headers svix
//              Baris 26-28: Jika verifikasi gagal (signature tidak valid), log error dan return false dengan status 401 Unauthorized

// Baris 30: Parse payload menjadi JSON setelah verifikasi berhasil

// Baris 32-34: Validasi jika body tidak punya properti type atau data, return false dengan status 400 Bad Request

// Baris 36-38: Jika event type adalah "session.created" (user membuat session/login), return response true

// Baris 40-42: Jika event type adalah "session.ended" (user mengakhiri session/logout), return response false

// Baris 44: Default response false untuk event type lainnya yang tidak dihandle
// Baris 45-48: Blok catch untuk menangkap error umum, log error ke console, dan return false dengan status 500 Internal Server Error