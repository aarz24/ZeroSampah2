import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix"; // Clerk Webhooks use Svix
import db from "@/db/index"; // Your Drizzle DB instance
import { Users } from "@/db/schema"; // Your Drizzle user schema
import { eq } from "drizzle-orm";

const CLERK_WEBHOOK_SECRET_USER = process.env.CLERK_WEBHOOK_SECRET_USER!;

interface WebhookEvent {
  data: {
    id: string;
    first_name?: string;
    last_name?: string;
    full_name?: string;
    image_url?: string;
    email_addresses: Array<{
      email_address: string;
      id: string;
    }>;
    created_at: number;
    updated_at: number;
  };
  object: string;
  type: string;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headers = Object.fromEntries(req.headers.entries());
  try {
    // Verify webhook signature
    const wh = new Webhook(CLERK_WEBHOOK_SECRET_USER);
    const evt = wh.verify(body, headers) as WebhookEvent;

    const user = evt.data;

    const fullName =
      user.full_name || `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Anonymous User";

    if (evt.type === "user.created") {
      const existingUser = await db
        .select()
        .from(Users)
        .where(eq(Users.clerkId, user.id))
        .execute();

      if (existingUser.length === 0) {
        await db.insert(Users).values({
          clerkId: user.id,
          email: user.email_addresses[0].email_address,
          fullName,
          profileImage: user.image_url,
        });

      } else {
        console.log("⚠️ User already exists:", user.id);
      }

    } else if (evt.type === "user.updated") {
      await db
        .update(Users)
        .set({
          email: user.email_addresses[0].email_address,
          fullName,
          profileImage: user.image_url || "",
        })
        .where(eq(Users.clerkId, user.id))
        .execute();

    } else if (evt.type === "user.deleted") {
      await db.delete(Users).where(eq(Users.clerkId, user.id)).execute();
      console.log("🗑️ User deleted:", user.id);
    }

    return NextResponse.json({ message: "Webhook received" }, { status: 200 });
  } catch (error) {
    console.error("❌ Webhook verification failed:", error);
    return NextResponse.json({ error: "Invalid Webhook Signature" }, { status: 400 });
  }
}

// Baris 1: Import NextRequest dan NextResponse dari next/server untuk menangani request dan response di API route
// Baris 2: Import Webhook dari library svix untuk verifikasi webhook signature dari Clerk
// Baris 3: Import db (koneksi database) dari folder db/index
// Baris 4: Import schema tabel Users dari db/schema
// Baris 5: Import fungsi eq (equal) dari drizzle-orm untuk query database

// Baris 7: Deklarasi konstanta CLERK_WEBHOOK_SECRET_USER yang mengambil webhook secret dari environment variable untuk verifikasi webhook Clerk, tanda ! menandakan nilai pasti ada (non-null assertion)

// Baris 9-24: Deklarasi interface WebhookEvent untuk typing data webhook dari Clerk:
//             - data: objek berisi informasi user (id, first_name, last_name, full_name, image_url, email_addresses array, created_at, updated_at)
//             - object: tipe objek
//             - type: tipe event (user.created, user.updated, user.deleted)

// Baris 26: Export fungsi POST async untuk menangani request POST webhook dari Clerk tentang user events (create/update/delete)
// Baris 27: Ambil body request sebagai raw text untuk verifikasi signature
// Baris 28: Convert headers request menjadi object menggunakan Object.fromEntries
// Baris 29: Blok try untuk menjalankan kode utama
// Baris 30-32: Membuat instance Webhook dengan secret key dan verify signature, cast hasilnya sebagai WebhookEvent

// Baris 34: Ambil data user dari event yang sudah diverifikasi

// Baris 36-37: Buat fullName dari full_name atau gabungan first_name + last_name, jika kosong gunakan "Anonymous User"

// Baris 39-56: Jika event type adalah "user.created" (user baru dibuat di Clerk):
//              Baris 40-44: Query database untuk cek apakah user dengan clerkId ini sudah ada
//              Baris 46-53: Jika user belum ada (existingUser.length = 0), insert user baru ke database dengan clerkId, email, fullName, dan profileImage
//              Baris 54-56: Jika user sudah ada, log peringatan bahwa user sudah exist

// Baris 57-66: Jika event type adalah "user.updated" (user diupdate di Clerk):
//              Update data user di database: email, fullName, dan profileImage (default empty string jika null)
//              Where kondisi clerkId sama dengan user.id

// Baris 67-70: Jika event type adalah "user.deleted" (user dihapus di Clerk):
//              Delete user dari database where clerkId sama dengan user.id dan log konfirmasi penghapusan

// Baris 72: Return response JSON dengan pesan "Webhook received" dan status 200 OK
// Baris 73-76: Blok catch untuk menangkap error verifikasi webhook, log error ke console, dan return response error 400 dengan pesan "Invalid Webhook Signature"