import 'dotenv/config';
import db from "../src/db/index";
import { Users, Reports, Rewards } from "../src/db/schema";

async function main() {
  console.log("Seeding database using DATABASE_URL=", process.env.DATABASE_URL ? "[set]" : "[missing]");
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is missing. Set it in .env and retry.");
    process.exit(1);
  }

  // 1) Demo user
  await db
    .insert(Users)
    .values({
      clerkId: "clerk_demo",
      email: "demo@zerosampah.com",
      fullName: "Demo User",
      points: 100,
    })
    .onConflictDoNothing()
    .execute();
  console.log("✔ Inserted demo user (or already exists)");

  // 2) Sample rewards
  await db
    .insert(Rewards)
    .values([
      {
        name: "Botol Minum Ramah Lingkungan",
        description: "Botol minum stainless steel yang dapat digunakan ulang",
        pointsRequired: 200,
        imageUrl: "/images/rewards/botol.webp",
        stock: 50,
      },
      {
        name: "Set Peralatan Makan Bambu",
        description: "Set peralatan makan bambu ramah lingkungan",
        pointsRequired: 300,
        imageUrl: "/images/rewards/peralatan-bambu.jpg",
        stock: 30,
      },
      {
        name: "Tas Belanja Katun Organik",
        description: "Tas belanja ramah lingkungan terbuat dari katun organik",
        pointsRequired: 150,
        imageUrl: "/images/rewards/tas-katun.webp",
        stock: 100,
      },
    ])
    .onConflictDoNothing()
    .execute();
  console.log("✔ Inserted rewards (or already exist)");

  // 3) Sample report
  await db
    .insert(Reports)
    .values({
      userId: "clerk_demo",
      location: "https://maps.google.com/?q=-6.2088,106.8456",
      wasteType: "Plastic bottles",
      amount: "5 kg",
      status: "pending",
      imageUrl: null,
    })
    .execute();
  console.log("✔ Inserted a sample report");

  console.log("✅ Seeding completed");
}

main().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});
