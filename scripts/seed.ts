import db from '../src/db/index';
import { Rewards, Events } from '../src/db/schema';

/**
 * Database seeding script for ZeroSampah
 * Run with: npm run db:seed
 * 
 * Seeds:
 * - Rewards catalog
 * - Sample community events
 * - (Users are auto-created via Clerk webhooks)
 */

async function seedRewards() {
  console.log('🌱 Seeding rewards...');
  
  const rewards = [
    {
      name: 'Voucher Makanan Rp 25.000',
      description: 'Voucher makan di restoran partner',
      pointsRequired: 100,
      imageUrl: null,
      stock: 50,
    },
    {
      name: 'Voucher Belanja Rp 50.000',
      description: 'Voucher belanja di supermarket partner',
      pointsRequired: 200,
      imageUrl: null,
      stock: 30,
    },
    {
      name: 'Tas Belanja Ramah Lingkungan',
      description: 'Tas belanja terbuat dari bahan daur ulang',
      pointsRequired: 150,
      imageUrl: null,
      stock: 100,
    },
    {
      name: 'Botol Minum Stainless Steel',
      description: 'Botol minum berkualitas tinggi',
      pointsRequired: 250,
      imageUrl: null,
      stock: 75,
    },
    {
      name: 'Paket Bibit Tanaman',
      description: 'Paket berisi 5 bibit tanaman hias',
      pointsRequired: 120,
      imageUrl: null,
      stock: 40,
    },
    {
      name: 'Voucher Transportasi Rp 50.000',
      description: 'Voucher untuk transportasi online',
      pointsRequired: 180,
      imageUrl: null,
      stock: 60,
    },
    {
      name: 'Set Alat Makan Bambu',
      description: 'Sendok, garpu, dan sumpit dari bambu',
      pointsRequired: 200,
      imageUrl: null,
      stock: 45,
    },
    {
      name: 'Kompos Organik 5kg',
      description: 'Pupuk kompos organik berkualitas',
      pointsRequired: 80,
      imageUrl: null,
      stock: 120,
    },
    {
      name: 'Sertifikat Penghargaan',
      description: 'Sertifikat penghargaan untuk kontribusi lingkungan',
      pointsRequired: 500,
      imageUrl: null,
      stock: 20,
    },
    {
      name: 'Voucher Kursus Online',
      description: 'Akses ke kursus online tentang keberlanjutan',
      pointsRequired: 300,
      imageUrl: null,
      stock: 35,
    },
  ];

  try {
    for (const reward of rewards) {
      await db.insert(Rewards).values(reward).onConflictDoNothing();
      console.log(`✅ Added reward: ${reward.name}`);
    }
    console.log('🎉 Rewards seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding rewards:', error);
    throw error;
  }
}

async function seedEvents() {
  console.log('🌱 Seeding sample events...');
  
  // Note: These events require a valid organizerId (user clerk_id)
  // You'll need to create a user first via Clerk, then update the organizerId
  // For now, we'll skip seeding events or you can manually add organizerId
  
  console.log('ℹ️  Event seeding skipped - requires valid user IDs from Clerk');
  console.log('   To seed events:');
  console.log('   1. Create a user via the app');
  console.log('   2. Get their clerk_id from the users table');
  console.log('   3. Update this seed script with the clerk_id');
  
  // Example events structure (commented out):
  /*
  const sampleEvents = [
    {
      organizerId: 'user_xxx', // Replace with actual clerk_id
      title: 'Bersih-Bersih Pantai Ancol',
      description: 'Mari bersama membersihkan pantai Ancol dari sampah plastik',
      location: 'Pantai Ancol, Jakarta Utara',
      latitude: '-6.122435',
      longitude: '106.843155',
      eventDate: new Date('2026-02-15T08:00:00'),
      eventTime: '08:00',
      wasteCategories: ['Plastic', 'Glass', 'Metal'],
      status: 'published',
      maxParticipants: 50,
      rewardInfo: 'Makan siang gratis dan sertifikat',
      images: [],
      videos: [],
    },
    // Add more sample events...
  ];
  
  for (const event of sampleEvents) {
    await db.insert(Events).values(event).onConflictDoNothing();
    console.log(`✅ Added event: ${event.title}`);
  }
  */
}

async function main() {
  console.log('🚀 Starting database seeding...');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  try {
    await seedRewards();
    console.log();
    await seedEvents();
    console.log();
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✨ All seeding completed successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    process.exit(0);
  } catch (error) {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('💥 Seeding failed:', error);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    process.exit(1);
  }
}

main();
