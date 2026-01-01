'use client';

import { use, useState, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import { QrCode, ScanLine } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

const QRScanner = dynamic(() => import('@/components/QRScanner'), { ssr: false });

interface EventData {
  event: {
    id: number;
    title: string;
    description: string;
    location: string;
    latitude: string | null;
    longitude: string | null;
    eventDate: Date | null;
    eventTime: string;
    wasteCategories: string[] | null;
    status: string;
    maxParticipants: number | null;
    images: string[] | null;
    videos: string[] | null;
    organizerId: string;
  };
  organizer: {
    id: number;
    clerkId: string;
    email: string;
    fullName: string | null;
  } | null;
  userRegistration: {
    id: number;
    eventId: number;
    userId: string;
    qrCode: string;
    registeredAt: Date | null;
    status: string;
  } | null;
}

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { user } = useUser();
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch(`/api/events/${id}`);
        if (!res.ok) {
          if (res.status === 404) return notFound();
          throw new Error('Failed to fetch event');
        }
        const data = await res.json();
        setEventData(data);
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    if (!user) return;
    setRegistering(true);
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', eventId: parseInt(id) }),
      });
      
      if (res.ok) {
        const registration = await res.json();
        // Refresh event data
        const eventRes = await fetch(`/api/events/${id}`);
        const updatedData = await eventRes.json();
        setEventData(updatedData);
      }
    } catch (error) {
      console.error('Error registering:', error);
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="px-6 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!eventData) return notFound();

  const ev = eventData.event;
  const organizer = eventData.organizer;
  const registration = eventData.userRegistration;
  const isRegistered = !!registration;
  const isOrganizer = user?.id === ev.organizerId;
  const eventDate = ev.eventDate ? new Date(ev.eventDate).toLocaleDateString('id-ID') : '-';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8 px-6">
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={() => router.back()} 
          className="mb-6 flex items-center gap-2 text-green-700 hover:text-green-800 font-medium transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Kembali
        </button>

        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">{ev.title}</h1>
                <div className="flex items-center gap-2 text-green-50">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">{eventDate} • {ev.eventTime}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                <span className="text-white font-semibold">0 peserta</span>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Description */}
            {ev.description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Deskripsi Acara</h3>
                <p className="text-gray-700 leading-relaxed">{ev.description}</p>
              </div>
            )}

            {/* Categories */}
            {ev.wasteCategories && ev.wasteCategories.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-600 mb-3">Kategori Sampah</h3>
                <div className="flex flex-wrap gap-2">
                  {ev.wasteCategories.map((cat) => (
                    <span key={cat} className="px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium border border-green-200">
                      #{cat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Organizer */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500">Diselenggarakan oleh</p>
                <p className="font-semibold text-gray-900">{organizer?.fullName || 'Unknown'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reward Section */}
        {ev.rewardInfo && (
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-6 border-2 border-yellow-200 shadow-lg mb-6">
            <div className="flex items-start gap-4">
              <div className="text-5xl">🎁</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Event dengan Reward!</h3>
                <p className="text-gray-800 text-lg mb-2">{ev.rewardInfo}</p>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Hadiah akan diberikan setelah kehadiran diverifikasi
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Perlengkapan */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900">Perlengkapan</h3>
            </div>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Sarung tangan
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Kantong sampah (organik/anorganik)
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Sepatu tertutup
              </li>
            </ul>
          </div>

          {/* Aturan */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900">Aturan Singkat</h3>
            </div>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Pisahkan sampah sesuai kategori
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Utamakan keselamatan dan kebersihan
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Hormati warga dan pengunjung
              </li>
            </ul>
          </div>

          {/* Lokasi */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900">Lokasi Acara</h3>
            </div>
            <a 
              href={ev.location} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Lihat Lokasi di Maps
            </a>
            <p className="mt-3 text-xs text-gray-500 text-center">Klik untuk membuka di Google Maps</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex gap-4 flex-wrap">
            {!user ? (
              <p className="text-gray-600">Silakan login untuk mendaftar</p>
            ) : !isRegistered && !isOrganizer ? (
              <button 
                onClick={handleRegister}
                disabled={registering}
                className="flex-1 px-6 py-4 text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {registering ? 'Mendaftar...' : 'Gabung Acara'}
              </button>
            ) : isRegistered ? (
              <button 
                onClick={() => setShowQR(!showQR)}
                className="flex-1 px-6 py-4 text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <QrCode className="w-6 h-6" />
                {showQR ? 'Sembunyikan' : 'Tampilkan'} QR Code
              </button>
            ) : null}
            {isOrganizer && (
              <button 
                onClick={() => setShowScanner(!showScanner)}
                className="flex-1 px-6 py-4 text-purple-700 bg-purple-50 rounded-xl border-2 border-purple-200 font-bold hover:bg-purple-100 transition-all flex items-center justify-center gap-2"
              >
                <ScanLine className="w-6 h-6" />
                {showScanner ? 'Tutup' : 'Buka'} Scanner
              </button>
            )}
          </div>
        </div>

        {/* QR Code for registered participants */}
        {isRegistered && showQR && registration && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 border-2 border-green-200">
            <h3 className="text-xl font-bold text-center text-gray-900 mb-6">QR Code Kehadiran Anda</h3>
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white rounded-2xl shadow-lg">
                <QRCodeDisplay value={registration.qrCode} size={280} />
              </div>
            </div>
            <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-semibold text-blue-900 mb-1">Penting!</p>
                  <p className="text-sm text-blue-800">
                    Tunjukkan QR code ini kepada panitia saat acara dimulai. Kehadiran Anda akan diverifikasi oleh panitia untuk mendapatkan reward.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scanner for organizers */}
        {isOrganizer && showScanner && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <div className="mb-6 p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-semibold text-purple-900 mb-1">Mode Panitia</p>
                  <p className="text-sm text-purple-800">
                    Gunakan scanner di bawah untuk memverifikasi kehadiran peserta.
                  </p>
                </div>
              </div>
            </div>
            <QRScanner 
              eventId={id} 
              onVerified={(userId) => console.log('Verified:', userId)}
            />
          </div>
        )}

        {/* Media Section */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Media Acara</h3>
          {(ev.images && ev.images.length > 0) || (ev.videos && ev.videos.length > 0) ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {ev.images?.map((img, idx) => (
                <div key={idx} className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden shadow-md border border-gray-200 hover:shadow-xl transition-shadow">
                  <img src={img} alt={`Event ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
              {ev.videos?.map((vid, idx) => (
                <div key={idx} className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden shadow-md border border-gray-200">
                  <video src={vid} controls className="w-full h-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl text-center border-2 border-dashed border-gray-300">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 font-medium">Belum ada foto atau video yang diunggah</p>
              <p className="text-sm text-gray-400 mt-2">Panitia akan mengunggah dokumentasi acara setelah acara berlangsung</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Baris 1: Directive Next.js untuk menandakan ini adalah Client Component (berjalan di browser)

// Baris 3: Import React hooks
// - use: untuk unwrap Promise dari params
// - useState: untuk state management lokal
// - useEffect: untuk side effects setelah component mount

// Baris 4: Import fungsi navigasi dari Next.js
// - notFound: untuk redirect ke halaman 404
// - useRouter: untuk navigasi programatik

// Baris 5: Import dynamic dari Next.js untuk lazy loading component
// Digunakan untuk component yang hanya berjalan di client-side

// Baris 6: Import component QRCodeDisplay untuk menampilkan QR code

// Baris 7: Import icon dari lucide-react (QrCode dan ScanLine)

// Baris 8: Import useUser hook dari Clerk untuk autentikasi user

// Baris 10: Dynamic import QRScanner dengan SSR disabled
// ssr: false artinya component ini hanya di-render di client, tidak di server
// Karena QR Scanner membutuhkan akses kamera yang hanya tersedia di browser

// Baris 12-38: Interface TypeScript untuk EventData
// Mendefinisikan struktur data event lengkap dengan:
// - event: detail acara (id, title, description, location, date, dll)
// - organizer: data penyelenggara acara
// - userRegistration: data pendaftaran user (termasuk QR code)

// Baris 40: Deklarasi component EventDetailPage dengan parameter params (Promise<{id: string}>)

// Baris 41: Inisialisasi router untuk navigasi

// Baris 42: Unwrap Promise params untuk mendapatkan id event

// Baris 43: Get user data dari Clerk authentication

// Baris 44-48: Deklarasi state variables:
// - eventData: menyimpan data event lengkap
// - loading: status loading data
// - registering: status proses pendaftaran
// - showQR: toggle tampilan QR code
// - showScanner: toggle tampilan scanner QR (untuk organizer)

// Baris 50-64: useEffect hook untuk fetch data event saat component mount
// 1. Fetch data dari API endpoint /api/events/${id}
// 2. Handle error 404 dengan redirect ke halaman not found
// 3. Set eventData dengan response JSON
// 4. Set loading false setelah selesai

// Baris 66-88: Function handleRegister untuk mendaftar ke event
// 1. Validasi user sudah login
// 2. Set registering true untuk show loading state
// 3. POST request ke /api/events dengan action 'register'
// 4. Jika berhasil, refresh data event untuk update UI
// 5. Handle error dan set registering false

// Baris 90-99: Conditional render loading state
// Tampilkan skeleton loading dengan animasi pulse

// Baris 101: Redirect ke 404 jika eventData tidak ada

// Baris 103-108: Extract data dari eventData dan compute derived states:
// - ev: data event
// - organizer: data penyelenggara
// - registration: data pendaftaran user
// - isRegistered: boolean apakah user sudah daftar
// - isOrganizer: boolean apakah user adalah penyelenggara
// - eventDate: format tanggal event ke Bahasa Indonesia

// Baris 110-115: Return JSX - container utama dengan gradient background

// Baris 112-119: Tombol "Kembali" untuk navigasi ke halaman sebelumnya

// Baris 122-152: Hero Section - header event
// - Background gradient hijau
// - Judul event dan tanggal/waktu
// - Badge jumlah peserta (hardcoded 0, seharusnya dynamic)

// Baris 154-167: Section Deskripsi Acara
// Conditional render, hanya tampil jika ev.description ada

// Baris 170-181: Section Kategori Sampah
// Conditional render, tampilkan badge untuk setiap kategori
// Loop melalui ev.wasteCategories array

// Baris 184-197: Section Organizer Info
// Tampilkan nama penyelenggara dengan avatar icon

// Baris 202-220: Reward Section (conditional)
// Tampilkan info reward dengan emoji hadiah
// Hanya muncul jika ev.rewardInfo ada

// Baris 223-323: Info Cards Grid (3 kolom)
// Card 1: Perlengkapan yang dibutuhkan (sarung tangan, kantong sampah, sepatu)
// Card 2: Aturan singkat acara (pisahkan sampah, utamakan keselamatan, hormati warga)
// Card 3: Lokasi acara dengan link ke Google Maps

// Baris 326-361: Section Action Buttons
// Conditional rendering berdasarkan status user:
// - Jika belum login: tampilkan pesan untuk login
// - Jika belum daftar & bukan organizer: tombol "Gabung Acara"
// - Jika sudah daftar: tombol "Tampilkan/Sembunyikan QR Code"
// - Jika adalah organizer: tombol "Buka/Tutup Scanner"

// Baris 364-383: QR Code Display Section (conditional)
// Tampil jika user sudah daftar dan showQR = true
// Menampilkan QR code dengan ukuran 280x280 px
// Ada info box dengan instruksi untuk tunjukkan QR ke panitia

// Baris 386-406: QR Scanner Section (conditional)
// Tampil jika user adalah organizer dan showScanner = true
// Menampilkan component QRScanner untuk verifikasi kehadiran peserta
// Ada info box mode panitia

// Baris 409-442: Media Section
// Menampilkan foto dan video event
// Jika tidak ada media: tampilkan placeholder dengan icon dan pesan
// Grid layout 3 kolom untuk foto/video
// Video dengan controls untuk play/pause
