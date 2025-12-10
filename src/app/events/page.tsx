import Link from 'next/link';
import Image from 'next/image';
import { getPublishedEvents } from '@/db/actions';
import EventsMapView from './EventsMapView';

export const metadata = { title: 'Cleanup Events' };

export default async function EventsBrowsePage() {
  const events = await getPublishedEvents();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-gradient-to-b from-white via-green-50 to-white border-b border-green-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="rounded-3xl bg-gradient-to-br from-green-600 via-emerald-600 to-lime-500 text-white shadow-2xl border border-white/20 px-6 py-7 md:px-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-4 w-full">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold tracking-wide rounded-full bg-white/15 border border-white/20 backdrop-blur">
                  <span className="w-2 h-2 rounded-full bg-lime-300 animate-ping" />
                  Komunitas Peduli
                </span>
                <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                  Jelajahi Aksi Bersih Komunitas
                </h1>
                <div className="flex flex-wrap gap-2 text-sm font-semibold text-white/90">
                  <span className="px-3 py-1 rounded-full bg-white/15 border border-white/20">Koordinasi Relawan</span>
                  <span className="px-3 py-1 rounded-full bg-white/15 border border-white/20">Laporan Real-time</span>
                  <span className="px-3 py-1 rounded-full bg-white/15 border border-white/20">Reward Transparan</span>
                </div>
              </div>
              <div className="w-full lg:max-w-sm bg-white/10 border border-white/20 rounded-2xl p-5 backdrop-blur">
                <div className="text-xs font-semibold uppercase tracking-wide text-white/70 mb-3">
                  Panel Aksi Cepat
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link 
                    href="/events/create" 
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white text-green-700 font-semibold shadow-lg shadow-black/10 hover:-translate-y-0.5 transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Buat Acara
                  </Link>
                  <Link 
                    href="/events/dashboard" 
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-white/40 text-white font-semibold bg-white/15 hover:bg-white/25 transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Dashboard Saya
                  </Link>
                </div>
                <p className="mt-4 text-xs text-white/80 leading-relaxed">
                  Simpan agenda aksi bersih, atur tim lapangan, dan pantau progres semua acara di satu tempat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section with Image - Always show */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative h-64 md:h-auto overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50">
                <Image
                  src="/images/event-hero.jpeg"
                  alt="Community Cleanup"
                  className="w-full h-full object-cover"
                  width={600}
                  height={400}
                  priority
                />
              </div>
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4 w-fit">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Fitur Acara Komunitas
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Bersama Menjaga Bumi Lebih Bersih
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Fitur acara komunitas memungkinkan Anda untuk mengorganisir dan mengikuti kegiatan pembersihan lingkungan bersama warga sekitar. Bersama-sama kita dapat membuat perbedaan nyata untuk lingkungan yang lebih bersih dan sehat.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Buat & Kelola Acara</p>
                      <p className="text-sm text-gray-600">Atur jadwal, lokasi, dan detail acara dengan mudah</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">QR Code Check-in</p>
                      <p className="text-sm text-gray-600">Verifikasi kehadiran peserta dengan sistem QR otomatis</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Reward & Insentif</p>
                      <p className="text-sm text-gray-600">Berikan apresiasi kepada peserta yang berkontribusi</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Events Map and List View */}
        <EventsMapView events={events} />
      </div>
    </div>
  );
}
