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
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Events Map</h3>
                    <p className="text-sm text-gray-600">
                      Showing {eventsWithCoords.length} event{eventsWithCoords.length !== 1 ? 's' : ''} with location data
                    </p>
                  </div>
                </div>
              </div>
              <Map center={mapCenter} zoom={12} height={600} markers={markers} />
              
              {/* Event list below map */}
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <h4 className="font-bold text-gray-900 mb-4">Events on Map:</h4>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {eventsWithCoords.map((ev, idx) => {
                    const eventDate = ev.event.eventDate ? new Date(ev.event.eventDate).toLocaleDateString('id-ID') : '-';
                    return (
                      <Link 
                        key={ev.event.id}
                        href={`/events/${ev.event.id}`}
                        className="block bg-white rounded-lg border border-gray-200 p-4 hover:border-green-300 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-green-700 text-sm">
                            {idx + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-bold text-gray-900 mb-1 line-clamp-1">{ev.event.title}</h5>
                            <div className="text-sm text-gray-600 space-y-1">
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="line-clamp-1">{ev.event.location}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>{eventDate} • {ev.event.eventTime}</span>
                              </div>
                            </div>
                          </div>
                          <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
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
                className="group block bg-white rounded-xl border-2 border-gray-200 hover:border-green-300 p-5 shadow-md hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-700 transition-colors line-clamp-2 flex-1">
                    {ev.event.title}
                  </h3>
                  <div className="flex flex-col gap-1.5 items-end ml-3">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200 font-medium whitespace-nowrap">
                      {attendeeCount} peserta
                    </span>
                    {ev.event.rewardInfo && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200 font-semibold whitespace-nowrap">
                        🎁 Reward
                      </span>
                    )}
                    {hasLocation && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-medium whitespace-nowrap">
                        📍 On Map
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="line-clamp-1">{ev.event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{eventDate} • {ev.event.eventTime}</span>
                  </div>
                </div>
                
                {ev.event.wasteCategories && ev.event.wasteCategories.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {ev.event.wasteCategories.slice(0, 3).map((t) => (
                      <span key={t} className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 font-medium">
                        #{t}
                      </span>
                    ))}
                    {ev.event.wasteCategories.length > 3 && (
                      <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
                        +{ev.event.wasteCategories.length - 3}
                      </span>
                    )}
                  </div>
                )}
                
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-600">{ev.organizer?.fullName || 'Unknown'}</span>
                  </div>
                  <span className="text-xs text-green-600 font-semibold group-hover:underline">
                    Lihat Detail →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
