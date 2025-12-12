'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Leaf, Users, Coins, Sparkles } from 'lucide-react'
import { FlipWords } from '@/components/ui/flip-words'
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
      <section className="relative min-h-screen overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-gradient-to-br from-green-200/40 to-emerald-300/30 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              x: [0, 30, 0],
              y: [0, -20, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-40 right-20 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-br from-emerald-200/30 to-lime-200/40 rounded-full blur-3xl"
            animate={{ 
              scale: [1.2, 1, 1.2],
              x: [0, -40, 0],
              y: [0, 30, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/2 left-1/3 w-48 sm:w-64 h-48 sm:h-64 bg-gradient-to-br from-lime-100/30 to-green-200/20 rounded-full blur-2xl"
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400/60 rounded-full hidden sm:block"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

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
              className="p-3 sm:p-4 text-left from-green-50 to-white rounded-2xl sm:rounded-3xl backdrop-blur-sm sm:p-6 lg:p-8"
            >
              {/* Animated Badge */}
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 mb-4 sm:mb-6 text-xs sm:text-sm font-semibold rounded-full border border-green-300/50 sm:px-5 sm:py-2.5 sm:mb-8 text-green-800 bg-gradient-to-r from-green-100/90 via-emerald-100/90 to-lime-100/90 backdrop-blur-sm shadow-lg shadow-green-200/50"
              >
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🌱
                </motion.span>
                <span className="bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent font-bold">
                  Ayo Gabung Revolusi Hijau
                </span>
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 animate-pulse" />
              </motion.div>

              {/* Main Heading with FlipWords */}
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="mb-3 sm:mb-4 text-2xl sm:text-3xl font-extrabold tracking-tight sm:mb-6 lg:text-6xl"
              >
                <span className="text-green-900">Lingkungan Kita</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-emerald-400 to-lime-500">
                  Untuk{" "}
                </span>
                <FlipWords 
                  words={["Kita Semua", "Masa Depan", "Bumi Hijau", "Generasi"]} 
                  duration={2500}
                  className="!text-emerald-500 font-extrabold"
                />
              </motion.h1>

              {/* Description */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="mb-4 sm:mb-6 max-w-xl text-sm sm:text-lg leading-relaxed text-green-800/90 sm:mb-8 sm:text-xl"
              >
                Bergabung dengan platform inovatif kami yang memberi penghargaan untuk 
                <span className="font-semibold text-green-700"> pengelolaan sampah berkelanjutan</span>.
                Laporkan, kumpulkan, dan dapatkan hadiah sambil membuat planet kita lebih bersih.
              </motion.p>

              {/* Action Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="flex flex-col gap-3 sm:gap-4 sm:flex-row"
              >
                <motion.button 
                  onClick={handleGetStarted}
                  whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -10px rgba(34, 197, 94, 0.4)" }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative flex justify-center items-center cursor-pointer px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 rounded-full shadow-xl shadow-green-500/30 transition-all duration-300 sm:px-8 sm:py-4 sm:text-lg overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-green-500 via-emerald-400 to-lime-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative flex items-center gap-2">
                    {isSignedIn ? "Ke Dashboard" : "Mulai Sekarang"}
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </motion.button>
                <motion.a 
                  href="/about"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group flex justify-center items-center cursor-pointer px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold text-green-700 bg-white/80 backdrop-blur-sm rounded-full border-2 border-green-200 hover:border-green-400 hover:bg-green-50 transition-all duration-300 shadow-lg sm:px-8 sm:py-4 sm:text-lg"
                >
                  <Leaf className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:rotate-12 transition-transform" />
                  Pelajari Lebih Lanjut
                </motion.a>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-green-200/50"
              >
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-green-700">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse" />
                    <span>1000+ Pengguna Aktif</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span>50+ Kota</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-lime-500 rounded-full animate-pulse" />
                    <span>10,000+ Laporan</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Images */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="grid relative gap-3 sm:gap-4 grid-cols-2 sm:gap-6"
            >
              <div className="space-y-3 sm:space-y-4 sm:space-y-6">
                <div className="overflow-hidden relative h-28 sm:h-36 rounded-xl sm:rounded-2xl shadow-lg sm:h-48">
                  <div className="absolute inset-0 z-10 bg-green-600/10" />
                  <Image
                      src={images.recycling}
                      alt="Proses Daur Ulang"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="overflow-hidden relative h-36 sm:h-48 rounded-xl sm:rounded-2xl shadow-lg sm:h-64">
                  <Image
                    src={images.greenTech}
                      alt="Pengumpulan Sampah Cerdas"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
              <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4 sm:mt-12 sm:space-y-6">
                <div className="overflow-hidden relative h-36 sm:h-48 rounded-xl sm:rounded-2xl shadow-lg sm:h-64">
                  <Image
                    src={images.sustainability}
                      alt="Teknologi Berkelanjutan"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="overflow-hidden relative h-28 sm:h-36 rounded-xl sm:rounded-2xl shadow-lg sm:h-48">
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
      <section className="relative py-16 overflow-hidden bg-gradient-to-b from-white via-green-50 to-emerald-50 sm:py-24 lg:py-32">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-10 w-72 h-72 bg-emerald-100 rounded-full blur-3xl opacity-70"></div>
          <div className="absolute -bottom-32 -left-5 w-80 h-80 bg-green-200 rounded-full blur-3xl opacity-60"></div>
        </div>
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1 mb-6 text-sm font-semibold text-green-700 bg-white shadow-sm rounded-full border border-green-100">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Komunitas Hijau Modern
            </span>
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
              Kenapa <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-lime-500">Memilih ZeroSampah?</span>
            </h2>
            <p className="mx-auto mb-12 max-w-3xl text-lg text-gray-600 sm:mb-16 sm:text-xl">
              Platform kami memadukan keberlanjutan, AI, dan sistem apresiasi yang membuat setiap aksi ramah lingkungan terasa mudah dan bermakna.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-12 text-sm font-semibold text-green-700">
              <span className="px-4 py-1 rounded-full bg-white shadow border border-green-100">Pengelolaan Sampah Pintar</span>
              <span className="px-4 py-1 rounded-full bg-white shadow border border-green-100">Reward Token & Insentif</span>
              <span className="px-4 py-1 rounded-full bg-white shadow border border-green-100">Jangkauan Komunitas Nasional</span>
            </div>
          </motion.div>
          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={Leaf}
              title="Solusi Ramah Lingkungan"
              description="Berkontribusi pada keberlanjutan lingkungan melalui sistem pengelolaan sampah inovatif kami."
              delay={0.1}
            />
            <FeatureCard
              icon={Coins}
              title="Sistem Hadiah"
              description="Dapatkan token dan hadiah untuk partisipasi aktif Anda dalam inisiatif pengelolaan sampah."
              delay={0.25}
            />
            <FeatureCard
              icon={Users}
              title="Dampak Komunitas"
              description="Bergabunglah dengan jaringan orang-orang peduli lingkungan yang terus berkembang untuk membuat perubahan nyata."
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 sm:py-28 lg:py-36 overflow-hidden">
        {/* Background with pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50" />
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #10b981 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        
        {/* Decorative blurs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-green-300/30 to-emerald-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-br from-teal-300/30 to-lime-300/20 rounded-full blur-3xl" />
        
        <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-[2.5rem] border border-white/60 shadow-2xl shadow-green-500/10 backdrop-blur-xl bg-white/70"
          >
            {/* Top gradient accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500" />
            
            <div className="p-8 sm:p-12 lg:p-16">
              <div className="flex flex-col items-center gap-10">
                {/* Section Title */}
                <div className="text-center space-y-4">
                  <span className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-emerald-700 bg-gradient-to-r from-emerald-100 to-green-100 rounded-full border border-emerald-200 shadow-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
                    Environmental Impact
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                    Bersama Wujudkan <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500">Lingkungan Bersih</span>
                  </h3>
                </div>
                
                {/* Image with enhanced styling and embedded button */}
                <div className="relative w-full max-w-4xl">
                  <div className="absolute -inset-4 bg-gradient-to-r from-green-400/20 via-emerald-400/20 to-teal-400/20 rounded-3xl blur-2xl" />
                  <div className="relative overflow-hidden rounded-2xl border-4 border-white shadow-2xl">
                    <img
                      src="/images/impact.jpg"
                      alt="Environmental Impact"
                      className="w-full h-auto object-cover"
                      style={{ maxHeight: '450px' }}
                    />
                    {/* Image overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    
                    {/* Embedded CTA Button */}
                    <motion.a
                      href="/events"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="absolute bottom-6 left-1/2 -translate-x-1/2 group inline-flex items-center gap-3 px-6 py-3 text-lg font-bold text-white bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-xl shadow-2xl shadow-black/30 backdrop-blur-sm border border-white/20 transition-all hover:shadow-3xl hover:from-green-500 hover:via-emerald-500 hover:to-teal-500"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
                      Jelajahi Event Kerja Bakti
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </motion.a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 sm:py-28 lg:py-36 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600" />
        
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-lime-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/10 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/10 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/10 rounded-full" />
        </div>
        
        <div className="relative px-4 mx-auto max-w-7xl text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 mb-8 text-sm font-bold text-white bg-white/20 backdrop-blur-sm rounded-full border border-white/30"
            >
              <span className="w-2 h-2 bg-lime-400 rounded-full animate-ping" />
              <span className="w-2 h-2 bg-lime-400 rounded-full absolute" />
              Bergabung Sekarang
            </motion.div>
            
            {/* Heading */}
            <h2 className="mb-6 text-4xl font-extrabold text-white sm:mb-8 sm:text-5xl lg:text-6xl leading-tight">
              Siap <span className="relative inline-block">
                <span className="relative z-10">Berkontribusi</span>
                <span className="absolute bottom-2 left-0 right-0 h-3 bg-lime-400/40 -skew-x-3" />
              </span>?
            </h2>
            
            {/* Description */}
            <p className="mb-10 text-lg text-green-100/90 sm:mb-14 sm:text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed">
              Bergabunglah dengan ribuan orang lain yang sudah berkontribusi untuk masa depan yang
              lebih bersih dan berkelanjutan bersama <span className="font-bold text-white">ZeroSampah</span>.
            </p>
            
            {/* CTA Button */}
            <motion.a
              href="/dashboard"
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex items-center gap-3 px-10 py-5 text-lg sm:text-xl font-bold text-green-700 bg-white rounded-2xl shadow-2xl shadow-black/20 transition-all hover:shadow-3xl"
            >
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
              Mulai Perjalanan Anda
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.a>
            
            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap justify-center gap-6 text-white/70 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-lime-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                Gratis untuk bergabung
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-lime-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                Komunitas aktif
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-lime-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                Reward menarik
              </div>
            </div>
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
      whileHover={{ y: -8, scale: 1.01 }}
      className="group relative flex flex-col items-center p-8 rounded-2xl border border-white/60 shadow-xl backdrop-blur bg-white/90 hover:border-green-200"
    >
      <div className="absolute inset-x-0 -top-1 h-1 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-green-500 via-emerald-500 to-lime-400 rounded-full transition-opacity" />
      <div className="p-5 mb-6 rounded-2xl bg-gradient-to-br from-green-100 via-emerald-100 to-white shadow-inner">
        <Icon className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="mb-3 text-2xl font-semibold text-gray-900 text-center">{title}</h3>
      <p className="leading-relaxed text-center text-gray-600">{description}</p>
    </motion.div>
  );
}
