// app/about/page.tsx
'use client';

import Image from 'next/image';
import { ReactNode } from 'react';
import {
  FaRecycle,
  FaRobot,
  FaChartLine,
  FaLeaf,
  FaCheckCircle,
  FaLightbulb,
  FaHandshake,
} from 'react-icons/fa';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function AboutPage() {
  return (
    <div className="pt-12 min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className="px-4 py-20 text-center md:px-8">
          <h1 className="mb-6 text-4xl font-bold text-green-800 md:text-5xl">
            Revolusi Manajemen Sampah dengan AI
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            Kami berada dalam misi untuk membuat manajemen sampah menjadi lebih cerdas, lebih efisien, dan ramah lingkungan melalui teknologi kecerdasan buatan mutakhir.
          </p>
      </section>

      {/* Mission Section */}
      <section className="px-4 py-16 bg-white md:px-8">
        <div className="grid gap-12 items-center mx-auto max-w-6xl md:grid-cols-2">
          <div>
              <h2 className="mb-4 text-3xl font-bold text-green-700">Misi Kami</h2>
              <p className="mb-4 text-gray-600">
                Di ZeroSampah, kami percaya bahwa manajemen sampah yang berkelanjutan adalah kunci untuk masa depan yang lebih baik. Platform bertenaga AI kami membantu mengoptimalkan pengumpulan, daur ulang, dan pelaporan lingkungan.
              </p>
              <p className="text-gray-600">
                Dengan menggunakan analitik data, kami membantu komunitas menghemat sumber daya dan mengelola sampah secara cerdas.
              </p>
          </div>
          <div className="relative h-[400px] rounded-lg overflow-hidden shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?auto=format&fit=crop&q=80"
              alt="AI-powered waste management"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 bg-green-50 md:px-8">
        <div className="mx-auto max-w-6xl text-center">
            <h2 className="mb-12 text-3xl font-bold text-green-700">Fitur Utama Kami</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <FeatureCard icon={<FaRobot />} title="Pemisahan Berbasis AI" description="Algoritme cerdas memisahkan material sampah secara otomatis berdasarkan jenisnya." />
              <FeatureCard icon={<FaChartLine />} title="Analitik Cerdas" description="Mengoptimalkan rute dan penggunaan sumber daya dengan data real-time." />
              <FeatureCard icon={<FaRecycle />} title="Optimisasi Daur Ulang" description="Meningkatkan proses daur ulang dengan sistem pemulihan yang cerdas." />
              <FeatureCard icon={<FaLeaf />} title="Dampak Lingkungan" description="Melacak jejak karbon dan sasaran keberlanjutan." />
          </div>
        </div>
      </section>

      {/* Event Features Section with Animations */}
      <section className="px-4 py-16 bg-white md:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-3xl font-bold text-center text-green-700">Fitur Event Kami</h2>
          <div className="flex justify-center mb-8 -space-x-12">
            <div className="flex items-center justify-center w-64">
              <DotLottieReact
                src="/animations/backyard-planting.json"
                loop
                autoplay
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
            <div className="flex items-center justify-center w-64">
              <DotLottieReact
                src="/animations/young-family.json"
                loop
                autoplay
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
            <div className="flex items-center justify-center w-64">
              <DotLottieReact
                src="/animations/rubbish-collection.json"
                loop
                autoplay
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
            <div className="flex items-center justify-center w-64">
              <DotLottieReact
                src="/animations/warehouse-delivery.json"
                loop
                autoplay
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
            <div className="flex items-center justify-center w-64">
              <DotLottieReact
                src="/animations/teamwork.json"
                loop
                autoplay
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
          </div>
          <p className="text-center text-lg text-gray-700 max-w-3xl mx-auto">
            Pengadaan kerja bakti lebih optimal dengan sistem event management yang terintegrasi. 
            Atur jadwal, kelola peserta, dan lacak dampak lingkungan dari setiap kegiatan pembersihan komunitas.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 text-center text-white bg-green-700 md:px-8">
          <h2 className="mb-4 text-3xl font-bold">Bergabunglah Bersama Kami untuk Membuat Perbedaan</h2>
          <p className="mb-8 text-xl">Bersama-sama, kita dapat membangun dunia yang lebih hijau dan lebih bersih melalui manajemen sampah yang didorong oleh AI.</p>
          <button className="px-8 py-3 font-bold text-green-700 bg-white rounded-full transition hover:bg-green-100">
            Mulai Hari Ini
          </button>
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
    <div className="p-6 text-center bg-white rounded-lg shadow-md transition hover:shadow-lg">
      <div className="mb-4 text-4xl text-green-600">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold text-green-700">{title}</h3>
      <p className="text-gray-600">{description}</p>
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
