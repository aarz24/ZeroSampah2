'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Leaf, Recycle, Users, Coins, MapPin } from 'lucide-react'
import AnimatedGlobe from '@/components/AnimatedGlobe'
import Footer from '@/components/Footer'
import { Chatbot } from '@/components/Chatbot'
import Image from 'next/image'
import { useUser, useClerk } from "@clerk/nextjs";

const images = {
  recycling: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=1200",
  greenTech: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200",
  sustainability: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=1200",
  cleanEnergy: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=1200"
};

export default function Home() {
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  
  const handleGetStarted = () => {
    if (isSignedIn) {
      window.location.href = "/dashboard";
    } else {
      openSignIn({
        appearance: {
          elements: {
            rootBox: "rounded-xl",
            card: "rounded-xl",
          },
        },
        afterSignInUrl: "/dashboard",
      });
    }
  };

  return (
    <div className="pt-10 min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className="relative min-h-screen">
        <motion.div 
          className="hidden absolute z-50 left-106 lg:block top-22"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 0.75, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <AnimatedGlobe />
        </motion.div>
        <div className="relative z-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid gap-8 items-center pt-12 lg:gap-12 lg:pt-20 md:grid-cols-2">
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="p-4 text-left from-green-50 to-white rounded-3xl backdrop-blur-sm sm:p-6 lg:p-8"
            >
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-3 py-1.5 mb-6 text-sm font-medium rounded-full border border-green-200 sm:px-4 sm:py-2 sm:mb-8 text-green-950 bg-green-200/80"
              >
                🌱 Ayo Gabung Revolusi Hijau
              </motion.span>
              <h1 className="mb-4 text-3xl font-bold tracking-tight text-green-900 sm:mb-6 sm:text-4xl lg:text-6xl">
                Lingkungan Kita{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">Untuk Kita Semua</span>
              </h1>
              <p className="mb-6 max-w-xl text-lg text-green-800 sm:mb-8 sm:text-xl">
                  Bergabung dengan platform inovatif kami yang memberi penghargaan untuk pengelolaan sampah berkelanjutan.
                  Laporkan, kumpulkan, dan dapatkan hadiah sambil membuat planet kita lebih bersih.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <motion.button 
                  onClick={handleGetStarted}
                  className="flex justify-center items-center cursor-pointer hover:bg-green-600 px-4 py-2.5 text-base font-medium text-white bg-green-700 rounded-full shadow-lg transition-all sm:px-6 sm:py-3 sm:text-lg"
                >
                    {isSignedIn ? "Ke Dashboard" : "Mulai"}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </motion.button>
                <motion.button 
                  className="flex justify-center items-center cursor-pointer hover:bg-green-100 px-5 py-2.5 text-base font-medium text-green-600 rounded-full border-2 border-green-500 transition-all sm:px-6 sm:py-3 sm:text-lg"
                >
                    Pelajari Lebih Lanjut
                </motion.button>
              </div>
            </motion.div>

            {/* Right Images */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="grid relative gap-4 sm:gap-6 md:grid-cols-2"
            >
              <div className="space-y-4 sm:space-y-6">
                <div className="overflow-hidden relative h-36 rounded-2xl shadow-lg sm:h-48">
                  <div className="absolute inset-0 z-10 bg-green-600/10" />
                  <Image
                      src={images.recycling}
                      alt="Proses Daur Ulang"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="overflow-hidden relative h-48 rounded-2xl shadow-lg sm:h-64">
                  <Image
                    src={images.greenTech}
                      alt="Pengumpulan Sampah Cerdas"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
              <div className="mt-4 space-y-4 sm:mt-12 sm:space-y-6">
                <div className="overflow-hidden relative h-48 rounded-2xl shadow-lg sm:h-64">
                  <Image
                    src={images.sustainability}
                      alt="Teknologi Berkelanjutan"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="overflow-hidden relative h-36 rounded-2xl shadow-lg sm:h-48">
                  <Image
                    src={images.cleanEnergy}
                      alt="Solusi Ramah Lingkungan"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-b from-white to-green-50 sm:py-24 lg:py-32">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">Kenapa Memilih ZeroSampah?</h2>
            <p className="mx-auto mb-12 max-w-2xl text-lg text-gray-600 sm:mb-16 sm:text-xl">
                Platform kami menggabungkan keberlanjutan dan teknologi untuk menciptakan pengalaman
                yang memberi penghargaan bagi semua yang terlibat dalam pengelolaan sampah.
            </p>
          </motion.div>
          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={Leaf}
                title="Solusi Ramah Lingkungan"
                description="Berkontribusi pada keberlanjutan lingkungan melalui sistem pengelolaan sampah inovatif kami."
              delay={0.2}
            />
            <FeatureCard
              icon={Coins}
                title="Sistem Hadiah"
                description="Dapatkan token dan hadiah untuk partisipasi aktif Anda dalam inisiatif pengelolaan sampah."
              delay={0.4}
            />
            <FeatureCard
              icon={Users}
                title="Dampak Komunitas"
                description="Bergabunglah dengan jaringan orang-orang peduli lingkungan yang terus berkembang untuk membuat perubahan nyata."
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-24 lg:py-32 bg-green-100/50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 rounded-3xl border border-green-100 shadow-xl backdrop-blur-sm sm:p-8 lg:p-12 bg-white/80"
          >
            <h2 className="mb-12 text-3xl font-bold text-center text-gray-900 sm:mb-16 sm:text-4xl">Dampak Global Kita</h2>
              <div className="grid gap-8 sm:gap-12 sm:grid-cols-2 lg:grid-cols-4">
                <ImpactCard title="Sampah Terkumpul" value="1,500 kg" icon={Recycle} delay={0.2} />
                <ImpactCard title="Laporan Aktif" value="320" icon={MapPin} delay={0.4} />
                <ImpactCard title="Hadiah Terdistribusi" value="12,450" icon={Coins} delay={0.6} />
                <ImpactCard title="Offset Karbon" value="850 kg" icon={Leaf} delay={0.8} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-green-600 via-green-500 to-emerald-600 sm:py-24 lg:py-32">
        <div className="px-4 mx-auto max-w-7xl text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-3xl"
          >
            <h2 className="mb-6 text-3xl font-bold text-white sm:mb-8 sm:text-4xl lg:text-5xl">Siap Berkontribusi?</h2>
            <p className="mb-8 text-lg text-green-100 sm:mb-12 sm:text-xl">
                Bergabunglah dengan ribuan orang lain yang sudah berkontribusi untuk masa depan yang
                lebih bersih dan berkelanjutan bersama ZeroSampah.
            </p>
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 text-lg font-medium text-green-600 bg-white rounded-full shadow-lg transition-all sm:px-8 sm:py-4 sm:text-xl"
            >
                Mulai Perjalanan Anda
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Add WasteManagementChat component with dark gradient */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b backdrop-blur-sm from-gray-900/90 to-gray-800/90" />
        <div className="relative z-10">
          <Chatbot />
        </div>
      </div>

      <Footer />
    </div>
  );
}

function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  delay 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
  delay: number;
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="flex flex-col items-center p-8 rounded-xl border border-green-100 shadow-lg backdrop-blur-sm transition-all bg-white/80 hover:shadow-xl"
    >
      <div className="p-4 mb-6 rounded-full bg-green-100/80">
        <Icon className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="mb-4 text-2xl font-semibold text-gray-900">{title}</h3>
      <p className="leading-relaxed text-center text-gray-600">{description}</p>
    </motion.div>
  );
}

function ImpactCard({ 
  title, 
  value, 
  icon: Icon,
  delay
}: { 
  title: string; 
  value: string; 
  icon: React.ElementType;
  delay: number;
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.03 }}
      className="p-6 text-center"
    >
      <Icon className="mx-auto mb-6 w-12 h-12 text-green-600" />
      <p className="mb-3 text-5xl font-bold text-gray-900">{value}</p>
      <p className="text-lg text-gray-600">{title}</p>
    </motion.div>
  );
}