import Link from 'next/link';
import { getPublishedEvents } from '@/db/actions';
import EventsMapView from './EventsMapView';

export const metadata = { title: 'Cleanup Events' };

export default async function EventsBrowsePage() {
  const events = await getPublishedEvents();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Jelajahi Aksi Bersih Komunitas</h1>
              <p className="text-gray-600 mt-1">Bergabunglah dengan gerakan peduli lingkungan di sekitar Anda</p>
            </div>
            <div className="flex gap-3">
              <Link 
                href="/events/create" 
                className="px-5 py-2.5 text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/30 transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Buat Acara
              </Link>
              <Link 
                href="/events/dashboard" 
                className="px-5 py-2.5 text-green-700 bg-green-50 rounded-lg border-2 border-green-200 font-semibold hover:bg-green-100 transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Dashboard Saya
              </Link>
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
                <img
                  src="/images/event-hero.jpeg"
                  alt="Community Cleanup"
                  className="w-full h-full object-cover"
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
