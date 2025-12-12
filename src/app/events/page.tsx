import { getPublishedEvents } from '@/db/actions';
import EventsMapView from './EventsMapView';
import EventHeroAnimation from './EventHeroAnimation';
import PanelAksiCepat from './PanelAksiCepat';

export const metadata = { title: 'Cleanup Events' };

export default async function EventsBrowsePage() {
  const events = await getPublishedEvents();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-gradient-to-b from-white via-green-50/50 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-green-600 via-emerald-500 to-teal-500 text-white shadow-2xl shadow-green-500/25 px-4 sm:px-8 py-6 sm:py-10 md:px-12">
            {/* Decorative background elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent" />
            </div>
            
            {/* Floating particles */}
            <div className="absolute top-[15%] left-[5%] w-2 h-2 bg-white/30 rounded-full animate-pulse" />
            <div className="absolute top-[33%] left-[25%] w-2 h-2 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="absolute top-[51%] left-[45%] w-2 h-2 bg-white/25 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-[69%] left-[65%] w-2 h-2 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
            <div className="absolute top-[87%] left-[85%] w-2 h-2 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
            
            <div className="relative flex flex-col gap-5 sm:gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold leading-tight tracking-tight" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
                  Jelajahi Aksi Bersih Komunitas
                </h1>
              </div>
              
              {/* Panel Aksi Cepat with Rocket Animation */}
              <PanelAksiCepat />
            </div>
            
            {/* Bottom gradient line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400/50 via-white/30 to-yellow-400/50" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Hero Section with Animation */}
        <div className="max-w-5xl mx-auto mb-6 sm:mb-10">
          <div className="relative overflow-hidden bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-green-100">
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
              <div className="relative p-5 sm:p-8 md:p-10 flex flex-col justify-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full text-xs sm:text-sm font-bold mb-4 sm:mb-5 w-fit shadow-sm border border-green-200">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Fitur Acara Komunitas
                </div>

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 sm:mb-4">
                  <span className="text-gray-900">Bersama Menjaga </span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500">
                    Bumi Lebih Bersih
                  </span>
                </h2>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed mb-5 sm:mb-8 text-sm sm:text-lg">
                  Fitur acara komunitas memungkinkan Anda untuk mengorganisir dan mengikuti kegiatan pembersihan lingkungan bersama warga sekitar. 
                  <span className="font-semibold text-green-700"> Bersama-sama</span> kita dapat membuat perbedaan nyata.
                </p>

                {/* Feature Cards */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="group flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-green-50 to-transparent rounded-xl sm:rounded-2xl border border-green-100 hover:border-green-300 hover:shadow-lg transition-all duration-300">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm sm:text-base">Buat & Kelola Acara</p>
                      <p className="text-xs sm:text-sm text-gray-600">Atur jadwal, lokasi, dan detail acara dengan mudah</p>
                    </div>
                  </div>

                  <div className="group flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-emerald-50 to-transparent rounded-xl sm:rounded-2xl border border-emerald-100 hover:border-emerald-300 hover:shadow-lg transition-all duration-300">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1z" clipRule="evenodd" />
                        <path d="M11 4a1 1 0 10-2 0v1a1 1 0 002 0V4zM10 7a1 1 0 011 1v1h2a1 1 0 110 2h-3a1 1 0 01-1-1V8a1 1 0 011-1zM16 9a1 1 0 100 2 1 1 0 000-2zM9 13a1 1 0 011-1h1a1 1 0 110 2v2a1 1 0 11-2 0v-3zM7 11a1 1 0 100-2H4a1 1 0 100 2h3zM17 13a1 1 0 01-1 1h-2a1 1 0 110-2h2a1 1 0 011 1zM16 17a1 1 0 100-2h-3a1 1 0 100 2h3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm sm:text-base">QR Code Check-in</p>
                      <p className="text-xs sm:text-sm text-gray-600">Verifikasi kehadiran peserta dengan sistem QR otomatis</p>
                    </div>
                  </div>

                  <div className="group flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-lime-50 to-transparent rounded-xl sm:rounded-2xl border border-lime-100 hover:border-lime-300 hover:shadow-lg transition-all duration-300">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-lime-400 to-green-500 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm sm:text-base">Reward & Insentif</p>
                      <p className="text-xs sm:text-sm text-gray-600">Berikan apresiasi kepada peserta yang berkontribusi</p>
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
