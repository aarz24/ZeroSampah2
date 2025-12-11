import Link from 'next/link';
import { getPublishedEvents } from '@/db/actions';
import EventsMapView from './EventsMapView';
import EventHeroAnimation from './EventHeroAnimation';

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
        {/* Hero Section with Animation */}
        <div className="max-w-5xl mx-auto mb-10">
          <div className="relative overflow-hidden bg-white rounded-3xl shadow-2xl border border-green-100">
            {/* Decorative Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-green-200/40 to-emerald-300/30 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-br from-lime-200/30 to-green-200/40 rounded-full blur-3xl" />
            </div>

            <div className="relative grid md:grid-cols-2 gap-0">
              {/* Animation Section */}
              <div className="relative h-72 md:h-auto overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-green-100/50 to-transparent" />
                <div className="relative w-full h-full min-h-[300px]">
                  <EventHeroAnimation />
                </div>
              </div>

              {/* Content Section */}
              <div className="relative p-8 md:p-10 flex flex-col justify-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full text-sm font-bold mb-5 w-fit shadow-sm border border-green-200">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Fitur Acara Komunitas
                </div>

                {/* Title */}
                <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
                  <span className="text-gray-900">Bersama Menjaga </span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500">
                    Bumi Lebih Bersih
                  </span>
                </h2>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                  Fitur acara komunitas memungkinkan Anda untuk mengorganisir dan mengikuti kegiatan pembersihan lingkungan bersama warga sekitar. 
                  <span className="font-semibold text-green-700"> Bersama-sama</span> kita dapat membuat perbedaan nyata.
                </p>

                {/* Feature Cards */}
                <div className="space-y-4">
                  <div className="group flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-transparent rounded-2xl border border-green-100 hover:border-green-300 hover:shadow-lg transition-all duration-300">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Buat & Kelola Acara</p>
                      <p className="text-sm text-gray-600">Atur jadwal, lokasi, dan detail acara dengan mudah</p>
                    </div>
                  </div>

                  <div className="group flex items-start gap-4 p-4 bg-gradient-to-r from-emerald-50 to-transparent rounded-2xl border border-emerald-100 hover:border-emerald-300 hover:shadow-lg transition-all duration-300">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1z" clipRule="evenodd" />
                        <path d="M11 4a1 1 0 10-2 0v1a1 1 0 002 0V4zM10 7a1 1 0 011 1v1h2a1 1 0 110 2h-3a1 1 0 01-1-1V8a1 1 0 011-1zM16 9a1 1 0 100 2 1 1 0 000-2zM9 13a1 1 0 011-1h1a1 1 0 110 2v2a1 1 0 11-2 0v-3zM7 11a1 1 0 100-2H4a1 1 0 100 2h3zM17 13a1 1 0 01-1 1h-2a1 1 0 110-2h2a1 1 0 011 1zM16 17a1 1 0 100-2h-3a1 1 0 100 2h3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">QR Code Check-in</p>
                      <p className="text-sm text-gray-600">Verifikasi kehadiran peserta dengan sistem QR otomatis</p>
                    </div>
                  </div>

                  <div className="group flex items-start gap-4 p-4 bg-gradient-to-r from-lime-50 to-transparent rounded-2xl border border-lime-100 hover:border-lime-300 hover:shadow-lg transition-all duration-300">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lime-400 to-green-500 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Reward & Insentif</p>
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
