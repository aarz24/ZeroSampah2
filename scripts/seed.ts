import db from '../src/db/index';
import { Rewards } from '../src/db/schema';

/**
 * Database seeding script for ZeroSampah
 * Run with: npm run db:seed
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

async function main() {
  console.log('🚀 Starting database seeding...');
  
  try {
    await seedRewards();
    console.log('✨ All seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  }
}

main();
