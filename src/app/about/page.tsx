// app/about/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';
import {
  FaRecycle,
  FaRobot,
  FaChartLine,
  FaLeaf,
  FaCalendarAlt,
  FaUsers,
  FaMapMarkerAlt,
  FaAward,
  FaGlobeAmericas,
  FaCheckCircle,
  FaArrowRight,
  FaHandsHelping,
} from 'react-icons/fa';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function AboutPage() {
  return (
    <div className="pt-12 min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className="relative px-3 sm:px-4 py-16 sm:py-24 overflow-hidden md:px-8">
        {/* Decorative Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-br from-green-200/30 to-emerald-300/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-56 sm:w-80 h-56 sm:h-80 bg-gradient-to-br from-teal-200/30 to-green-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-gradient-to-br from-lime-100/20 to-emerald-100/10 rounded-full blur-3xl" />
        </div>

        <div className="relative text-center max-w-5xl mx-auto">
          {/* Main Heading */}
          <h1 className="mb-6 sm:mb-8 text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
            <span className="text-gray-900">Revolusi Manajemen Sampah</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500">
              dengan AI
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto max-w-3xl text-base sm:text-lg leading-relaxed text-gray-600 md:text-xl mb-8 sm:mb-10">
            Kami berada dalam misi untuk membuat manajemen sampah menjadi 
            <span className="font-semibold text-green-700"> lebih cerdas</span>, 
            <span className="font-semibold text-emerald-600"> lebih efisien</span>, dan 
            <span className="font-semibold text-teal-600"> ramah lingkungan </span>
            melalui teknologi kecerdasan buatan mutakhir.
          </p>

          {/* Stats Row */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-6 md:gap-10">
            <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-3 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-green-100 shadow-lg">
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 text-green-600">
                <FaRobot className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="text-left">
                <p className="text-sm sm:text-lg font-bold text-gray-900">AI-Powered</p>
                <p className="text-xs sm:text-sm text-gray-500">Teknologi Cerdas</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-3 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-green-100 shadow-lg">
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-600">
                <FaGlobeAmericas className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="text-left">
                <p className="text-sm sm:text-lg font-bold text-gray-900">Eco-Friendly</p>
                <p className="text-xs sm:text-sm text-gray-500">Ramah Lingkungan</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-3 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-green-100 shadow-lg">
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-teal-100 to-green-100 text-teal-600">
                <FaChartLine className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="text-left">
                <p className="text-sm sm:text-lg font-bold text-gray-900">Data-Driven</p>
                <p className="text-xs sm:text-sm text-gray-500">Berbasis Analitik</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="relative px-3 sm:px-4 py-12 sm:py-20 overflow-hidden md:px-8">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-green-50/50 to-emerald-50/30" />
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-56 sm:w-80 h-56 sm:h-80 bg-gradient-to-br from-green-100/40 to-emerald-200/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 sm:w-96 h-72 sm:h-96 bg-gradient-to-br from-teal-100/30 to-green-100/20 rounded-full blur-3xl" />
        </div>

        <div className="relative grid gap-8 sm:gap-12 items-center mx-auto max-w-6xl lg:grid-cols-2">
          {/* Content */}
          <div className="order-2 lg:order-1">
            {/* Badge */}
            <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6 text-xs sm:text-sm font-semibold text-green-700 bg-white/90 backdrop-blur-sm border border-green-200/50 rounded-full shadow-md">
              <FaLeaf className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
              <span>Tentang Kami</span>
            </span>

            <h2 className="mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold">
              <span className="text-gray-900">Misi </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500">
                Kami
              </span>
            </h2>

            <p className="mb-4 sm:mb-6 text-base sm:text-lg leading-relaxed text-gray-600">
              Di <span className="font-bold text-green-700">ZeroSampah</span>, kami percaya bahwa manajemen sampah yang berkelanjutan adalah kunci untuk 
              <span className="font-semibold text-emerald-600"> masa depan yang lebih baik</span>. 
              Platform bertenaga AI kami membantu mengoptimalkan pengumpulan, daur ulang, dan pelaporan lingkungan.
            </p>

            <p className="mb-6 sm:mb-8 text-base sm:text-lg leading-relaxed text-gray-600">
              Dengan menggunakan <span className="font-semibold text-green-700">analitik data</span>, 
              kami membantu komunitas menghemat sumber daya dan mengelola sampah secara cerdas.
            </p>

            {/* Feature Points */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 mt-0.5 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 text-white flex-shrink-0">
                  <FaCheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </div>
                <p className="text-sm sm:text-base text-gray-700"><span className="font-semibold">Pengumpulan Optimal</span> — Rute dan jadwal yang efisien</p>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 mt-0.5 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white flex-shrink-0">
                  <FaCheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </div>
                <p className="text-sm sm:text-base text-gray-700"><span className="font-semibold">Daur Ulang Cerdas</span> — Pemisahan otomatis berbasis AI</p>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 mt-0.5 rounded-full bg-gradient-to-br from-teal-400 to-green-500 text-white flex-shrink-0">
                  <FaCheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </div>
                <p className="text-sm sm:text-base text-gray-700"><span className="font-semibold">Laporan Transparan</span> — Dampak lingkungan terukur</p>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative order-1 lg:order-2">
            <div className="relative h-[280px] sm:h-[400px] md:h-[500px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
              {/* Gradient Overlay */}
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-green-900/40 via-transparent to-transparent" />
              <div className="absolute inset-0 z-10 bg-gradient-to-r from-green-600/20 to-transparent" />
              <Image
                src="https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?auto=format&fit=crop&q=80"
                alt="AI-powered waste management"
                fill
                className="object-cover"
              />
              {/* Floating Card */}
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 z-20 p-3 sm:p-4 bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-green-100">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg">
                    <FaLeaf className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <p className="text-sm sm:text-base font-bold text-gray-900">Masa Depan Hijau</p>
                    <p className="text-xs sm:text-sm text-gray-600">Bersama membangun lingkungan berkelanjutan</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl blur-sm opacity-20" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-teal-400 to-green-500 rounded-full blur-sm opacity-20" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative px-3 sm:px-4 py-12 sm:py-20 bg-gradient-to-br from-green-50 via-white to-emerald-50 md:px-8">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-12 w-40 sm:w-60 h-40 sm:h-60 bg-green-200 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute bottom-0 right-0 w-56 sm:w-72 h-56 sm:h-72 bg-emerald-100 rounded-full blur-3xl opacity-70"></div>
        </div>
        <div className="relative mx-auto max-w-6xl text-center">
          <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 mb-3 sm:mb-4 text-xs sm:text-sm font-semibold text-green-700 bg-white border border-green-100 rounded-full shadow-sm">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 animate-pulse" />
            Teknologi & Dampak
          </span>
          <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Fitur Utama Kami</h2>
          <p className="mx-auto mb-8 sm:mb-14 max-w-3xl text-sm sm:text-lg text-gray-600">
            Dari pemrosesan berbasis AI hingga pelacakan dampak, ZeroSampah menghadirkan ekosistem lengkap yang membantu komunitas mengelola sampah dengan cara yang lebih cerdas, transparan, dan memberi penghargaan.
          </p>
          <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
            <FeatureCard icon={<FaRobot />} title="Pemisahan Berbasis AI" description="Algoritme cerdas memisahkan material sampah secara otomatis berdasarkan jenisnya." />
            <FeatureCard icon={<FaChartLine />} title="Analitik Cerdas" description="Mengoptimalkan rute dan penggunaan sumber daya dengan data real-time." />
            <FeatureCard icon={<FaRecycle />} title="Optimisasi Daur Ulang" description="Meningkatkan proses daur ulang dengan sistem pemulihan yang cerdas." />
            <FeatureCard icon={<FaLeaf />} title="Dampak Lingkungan" description="Melacak jejak karbon dan sasaran keberlanjutan." />
          </div>
        </div>
      </section>

      {/* Event Features Section with Animations */}
      <section className="relative px-3 sm:px-4 py-12 sm:py-20 overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-50 md:px-8">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-gradient-to-br from-green-200/40 to-emerald-300/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-56 sm:w-80 h-56 sm:h-80 bg-gradient-to-br from-lime-200/30 to-green-200/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-gradient-to-br from-emerald-100/20 to-teal-100/20 rounded-full blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl">
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-12">
            <span className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-1.5 sm:py-2 mb-4 sm:mb-6 text-xs sm:text-sm font-semibold text-green-700 bg-white/90 backdrop-blur-sm border border-green-200/50 rounded-full shadow-lg shadow-green-100/50">
              <FaCalendarAlt className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
              <span>Kelola Event dengan Mudah</span>
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 animate-pulse" />
            </span>
            <h2 className="mb-4 sm:mb-6 text-2xl sm:text-4xl md:text-5xl font-extrabold">
              <span className="text-gray-900">Fitur </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500">
                Event Kami
              </span>
            </h2>
            <p className="mx-auto max-w-3xl text-sm sm:text-lg leading-relaxed text-gray-600 md:text-xl">
              Pengadaan kerja bakti lebih optimal dengan sistem 
              <span className="font-semibold text-green-700"> event management </span> 
              yang terintegrasi. Atur jadwal, kelola peserta, dan lacak dampak lingkungan dari setiap kegiatan pembersihan komunitas.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="grid gap-3 sm:gap-4 mb-8 sm:mb-12 grid-cols-2 lg:grid-cols-4">
            <div className="group flex items-center gap-3 sm:gap-4 p-3 sm:p-5 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-green-100 shadow-lg hover:shadow-xl hover:border-green-300 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 text-green-600 shadow-inner">
                <FaCalendarAlt className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-gray-900">Jadwal Fleksibel</h4>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Atur waktu sesuai kebutuhan</p>
              </div>
            </div>
            <div className="group flex items-center gap-3 sm:gap-4 p-3 sm:p-5 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-green-100 shadow-lg hover:shadow-xl hover:border-green-300 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-600 shadow-inner">
                <FaUsers className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-gray-900">Kelola Peserta</h4>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Registrasi & absensi digital</p>
              </div>
            </div>
            <div className="group flex items-center gap-3 sm:gap-4 p-3 sm:p-5 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-green-100 shadow-lg hover:shadow-xl hover:border-green-300 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-teal-100 to-green-100 text-teal-600 shadow-inner">
                <FaMapMarkerAlt className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-gray-900">Lokasi Terintegrasi</h4>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Peta & navigasi otomatis</p>
              </div>
            </div>
            <div className="group flex items-center gap-3 sm:gap-4 p-3 sm:p-5 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-green-100 shadow-lg hover:shadow-xl hover:border-green-300 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-lime-100 to-green-100 text-lime-600 shadow-inner">
                <FaAward className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-gray-900">Reward Otomatis</h4>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Poin untuk setiap partisipasi</p>
              </div>
            </div>
          </div>

          {/* Animations Row */}
          <div className="relative p-4 sm:p-8 mb-6 sm:mb-8 bg-white/60 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-green-100 shadow-xl">
            <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-green-50/50 via-transparent to-emerald-50/50" />
            <div className="relative flex justify-center flex-wrap gap-2 sm:gap-4 lg:-space-x-8 lg:flex-nowrap">
              <div className="flex items-center justify-center w-24 sm:w-48 lg:w-56 transition-transform hover:scale-110 hover:z-10">
                <DotLottieReact
                  src="/animations/backyard-planting.json"
                  loop
                  autoplay
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>
              <div className="flex items-center justify-center w-24 sm:w-48 lg:w-56 transition-transform hover:scale-110 hover:z-10">
                <DotLottieReact
                  src="/animations/young-family.json"
                  loop
                  autoplay
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>
              <div className="flex items-center justify-center w-24 sm:w-48 lg:w-56 transition-transform hover:scale-110 hover:z-10">
                <DotLottieReact
                  src="/animations/rubbish-collection.json"
                  loop
                  autoplay
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>
              <div className="flex items-center justify-center w-24 sm:w-48 lg:w-56 transition-transform hover:scale-110 hover:z-10">
                <DotLottieReact
                  src="/animations/warehouse-delivery.json"
                  loop
                  autoplay
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>
              <div className="flex items-center justify-center w-24 sm:w-48 lg:w-56 transition-transform hover:scale-110 hover:z-10">
                <DotLottieReact
                  src="/animations/teamwork.json"
                  loop
                  autoplay
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 rounded-full shadow-xl shadow-green-500/30 hover:shadow-2xl hover:shadow-green-500/40 transition-all duration-300 hover:-translate-y-1"
            >
              <FaCalendarAlt className="w-4 h-4 sm:w-5 sm:h-5" />
              Jelajahi Event Sekarang
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-3 sm:px-4 py-16 sm:py-24 overflow-hidden md:px-8">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-green-500 to-emerald-600" />
        
        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-56 sm:w-80 h-56 sm:h-80 bg-emerald-400/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
          <div className="absolute top-1/2 left-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-teal-400/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          
          {/* Floating Particles */}
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/30 rounded-full animate-pulse"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 3) * 20}%`,
                animationDelay: `${i * 0.5}s`
              }}
            />
          ))}
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 mb-6 sm:mb-8 text-xs sm:text-sm font-semibold text-green-700 bg-white/95 backdrop-blur-sm rounded-full shadow-xl">
            <FaHandsHelping className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
            <span>Mari Berkontribusi</span>
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 animate-pulse" />
          </span>

          {/* Heading */}
          <h2 className="mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            Bergabunglah Bersama Kami untuk{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-200 via-emerald-200 to-teal-200">
              Membuat Perbedaan
            </span>
          </h2>

          {/* Description */}
          <p className="mb-8 sm:mb-10 text-sm sm:text-lg text-green-100 md:text-xl max-w-2xl mx-auto leading-relaxed">
            Bersama-sama, kita dapat membangun dunia yang lebih hijau dan lebih bersih melalui manajemen sampah yang didorong oleh AI.
          </p>

          {/* CTA Button */}
          <Link
            href="/dashboard"
            className="group inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold text-green-700 bg-white rounded-full shadow-2xl hover:shadow-white/30 transition-all duration-300 hover:-translate-y-1 hover:bg-green-50"
          >
            <FaLeaf className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 group-hover:rotate-12 transition-transform" />
            Mulai Hari Ini
            <FaArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Trust Elements */}
          <div className="mt-8 sm:mt-12 flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-10">
            <div className="flex items-center gap-2 text-green-100">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-lime-300 rounded-full animate-pulse" />
              <span className="text-xs sm:text-sm font-medium">Gratis untuk memulai</span>
            </div>
            <div className="flex items-center gap-2 text-green-100">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-emerald-300 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
              <span className="text-xs sm:text-sm font-medium">Dampak terukur</span>
            </div>
            <div className="flex items-center gap-2 text-green-100">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-teal-300 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }} />
              <span className="text-xs sm:text-sm font-medium">Komunitas aktif</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="group relative h-full p-6 text-left bg-white/90 rounded-2xl border border-white/60 shadow-xl backdrop-blur transition-all hover:-translate-y-1 hover:shadow-2xl">
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 bg-gradient-to-br from-green-100/80 via-white to-transparent blur-xl transition-opacity" />
      <div className="relative flex flex-col gap-4">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-green-100 via-emerald-100 to-white text-green-600 text-3xl shadow-inner">
          {icon}
        </div>
        <div>
          <h3 className="mb-2 text-xl font-semibold text-gray-900">{title}</h3>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600">
          Jelajahi fitur
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </div>
  );
}

function BenefitCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="p-6 text-left bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-4 text-2xl text-green-600">
        {icon}
        <h3 className="ml-3 text-xl font-semibold text-green-700">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="p-6 text-center bg-green-50 rounded-lg">
      <div className="mb-2 text-4xl font-bold text-green-700">{value}</div>
      <p className="text-gray-600">{label}</p>
    </div>
  );
}
