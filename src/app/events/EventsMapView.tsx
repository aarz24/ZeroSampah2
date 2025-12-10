"use client";

import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import type { MapMarker } from '@/components/Map';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

type Event = {
  event: {
    id: number;
    title: string;
    description: string | null;
    location: string;
    latitude: string | null;
    longitude: string | null;
    eventDate: Date | null;
    eventTime: string;
    wasteCategories: string[] | null;
    rewardInfo: string | null;
    status: string;
    maxParticipants: number | null;
    images: string[] | null;
    videos: string[] | null;
  };
  organizer: {
    fullName: string | null;
    email: string;
  } | null;
};

export default function EventsMapView({ events }: { events: Event[] }) {
  const [view, setView] = useState<'list' | 'map'>('list');

  // Filter events that have valid coordinates
  const eventsWithCoords = events.filter(
    (ev) => ev.event.latitude && ev.event.longitude
  );

  // Create markers for the map
  const markers: MapMarker[] = eventsWithCoords.map((ev) => ({
    position: {
      lat: parseFloat(ev.event.latitude!),
      lng: parseFloat(ev.event.longitude!),
    },
    title: `${ev.event.title}\n📍 ${ev.event.location}\n📅 ${ev.event.eventDate ? new Date(ev.event.eventDate).toLocaleDateString('id-ID') : '-'} • ${ev.event.eventTime}`,
    imageUrl: ev.event.images && ev.event.images.length > 0 ? ev.event.images[0] : undefined,
  }));

  // Calculate center of the map (average of all coordinates)
  const mapCenter =
    markers.length > 0
      ? {
          lat:
            markers.reduce((sum, m) => sum + m.position.lat, 0) / markers.length,
          lng:
            markers.reduce((sum, m) => sum + m.position.lng, 0) / markers.length,
        }
      : { lat: -6.2088, lng: 106.8456 }; // Default to Jakarta if no events

  if (events.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        {/* Empty State */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Belum Ada Acara Tersedia</h3>
            <p className="text-gray-600 mb-8">
              Jadilah yang pertama! Buat acara pembersihan lingkungan dan ajak komunitas untuk bergabung membuat lingkungan lebih bersih.
            </p>
            <Link 
              href="/events/create"
              className="inline-flex items-center gap-2 px-8 py-4 text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 shadow-xl shadow-green-500/30 transition-all text-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Buat Acara Pertama Anda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* View Toggle */}
      <div className="mb-6 flex justify-end">
        <div className="inline-flex rounded-lg border-2 border-gray-200 bg-white p-1 shadow-sm">
          <button
            onClick={() => setView('list')}
            className={`px-6 py-2 rounded-md font-semibold transition-all flex items-center gap-2 ${
              view === 'list'
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            List View
          </button>
          <button
            onClick={() => setView('map')}
            className={`px-6 py-2 rounded-md font-semibold transition-all flex items-center gap-2 ${
              view === 'map'
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Map View
          </button>
        </div>
      </div>

      {view === 'map' ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {eventsWithCoords.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Events with Location Data</h3>
              <p className="text-gray-600">
                Events need location coordinates to be displayed on the map. Switch to list view to see all events.
              </p>
            </div>
          ) : (
            <div>
              <div className="p-6 bg-gradient-to-br from-green-100 via-emerald-50 to-white border-b-2 border-green-200/60">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30 border-2 border-white">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">Peta Acara Komunitas</h3>
                    <p className="text-base text-gray-600 mt-1">
                      Menampilkan <span className="font-bold text-green-600">{eventsWithCoords.length} acara</span> dengan data lokasi yang valid.
                    </p>
                  </div>
                </div>
              </div>
              <Map center={mapCenter} zoom={12} height={600} markers={markers} />
              
              {/* Event list below map */}
              <div className="bg-gradient-to-b from-gray-50 via-white to-gray-50 p-6 border-t-2 border-gray-100">
                <h4 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-3">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6c0 1.887.813 3.56 2.067 4.715L10 18.34l3.933-5.625A5.969 5.969 0 0016 8a6 6 0 00-6-6zm0 8a2 2 0 110-4 2 2 0 010 4z" /></svg>
                  Daftar Acara di Peta
                </h4>
                <div className="space-y-4 max-h-[30rem] overflow-y-auto pr-2">
                  {eventsWithCoords.map((ev, idx) => {
                    const eventDate = ev.event.eventDate ? new Date(ev.event.eventDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric'}) : '-';
                    return (
                      <Link 
                        key={ev.event.id}
                        href={`/events/${ev.event.id}`}
                        className="group block bg-white rounded-2xl border border-gray-200/80 p-5 shadow-lg shadow-gray-500/5 hover:border-green-300 hover:shadow-green-500/20 hover:-translate-y-1 transition-all duration-300"
                      >
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-200 rounded-xl flex items-center justify-center flex-shrink-0 font-extrabold text-green-700 text-xl border-2 border-white shadow-md">
                            {idx + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-bold text-lg text-gray-800 group-hover:text-green-600 transition-colors mb-1.5 line-clamp-1">{ev.event.title}</h5>
                            <div className="text-sm text-gray-500 space-y-2">
                              <div className="flex items-center gap-2 font-medium">
                                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                                <span className="line-clamp-1">{ev.event.location}</span>
                              </div>
                              <div className="flex items-center gap-2 font-medium">
                                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
                                <span>{eventDate} • {ev.event.eventTime} WIB</span>
                              </div>
                            </div>
                          </div>
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-green-100 group-hover:text-green-600 transition-colors">
                            <svg className="w-6 h-6 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((ev) => {
            const eventDate = ev.event.eventDate ? new Date(ev.event.eventDate).toLocaleDateString('id-ID') : '-';
            const attendeeCount = 0;
            const hasLocation = ev.event.latitude && ev.event.longitude;
            
            return (
              <Link 
                key={ev.event.id} 
                href={`/events/${ev.event.id}`} 
                className="group block bg-white rounded-2xl border-2 border-gray-200 hover:border-green-400 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2 flex-1">
                    {ev.event.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 items-start ml-3">
                    <span className="text-xs px-3 py-1.5 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200 font-bold whitespace-nowrap shadow-sm">
                      👥 {attendeeCount} peserta
                    </span>
                    {ev.event.rewardInfo && (
                      <span className="text-xs px-3 py-1.5 rounded-lg bg-gradient-to-r from-yellow-50 to-amber-50 text-yellow-700 border border-yellow-200 font-bold whitespace-nowrap shadow-sm">
                        🎁 Reward
                      </span>
                    )}
                    {hasLocation && (
                      <span className="text-xs px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border border-blue-200 font-bold whitespace-nowrap shadow-sm">
                        📍 On Map
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3 mb-4 p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="line-clamp-1 font-medium">{ev.event.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">{eventDate} • {ev.event.eventTime}</span>
                  </div>
                </div>
                
                {ev.event.wasteCategories && ev.event.wasteCategories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {ev.event.wasteCategories.slice(0, 3).map((t) => (
                      <span key={t} className="text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 font-bold border border-gray-300">
                        #{t}
                      </span>
                    ))}
                    {ev.event.wasteCategories.length > 3 && (
                      <span className="text-xs px-3 py-1.5 rounded-full bg-gray-200 text-gray-700 font-bold">
                        +{ev.event.wasteCategories.length - 3} lagi
                      </span>
                    )}
                  </div>
                )}
                
                <div className="pt-4 border-t-2 border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-md">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium">Organizer</div>
                      <div className="text-sm text-gray-900 font-bold">{ev.organizer?.fullName || 'User'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-green-600 font-bold">
                    <span className="text-sm">Lihat Detail</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
