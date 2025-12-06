'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

interface EventItem {
  event: {
    id: number;
    title: string;
    eventDate: Date | null;
    status: string;
  };
  registration?: {
    status: string;
  };
}

export default function MyEventsDashboardPage() {
  const router = useRouter();
  const { user } = useUser();
  const [organized, setOrganized] = useState<EventItem[]>([]);
  const [joined, setJoined] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const [organizedRes, joinedRes] = await Promise.all([
          fetch('/api/events?type=organized'),
          fetch('/api/events?type=registered'),
        ]);

        if (organizedRes.ok) {
          const data = await organizedRes.json();
          setOrganized(data);
        }

        if (joinedRes.ok) {
          const data = await joinedRes.json();
          setJoined(data);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [user]);

  if (loading) {
    return (
      <div className="px-6 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="px-6 py-8">
        <p className="text-gray-600">Silakan login untuk melihat acara Anda.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => router.back()} 
          className="inline-flex items-center gap-2 text-sm font-medium text-green-700 hover:text-green-800 transition-colors mb-6 group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Kembali
        </button>
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Acara Saya</h1>
            <p className="text-lg text-gray-600">Kelola acara yang Anda selenggarakan dan ikuti</p>
          </div>
          <Link 
            href="/events/create" 
            className="px-6 py-3 text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/30 transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Buat Acara
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Organized Events */}
          <section className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Diselenggarakan</h2>
                    <p className="text-purple-100 text-sm">Acara yang Anda buat</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-white">{organized.length}</div>
              </div>
            </div>
            
            <div className="p-6">
              {organized.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 font-medium mb-2">Belum ada acara</p>
                  <p className="text-sm text-gray-500 mb-6">Mulai buat acara pertama Anda untuk mengajak komunitas</p>
                  <Link 
                    href="/events/create"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Buat Acara Baru
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {organized.map((item) => {
                    if (!item?.event) return null;
                    
                    const eventDate = item.event.eventDate 
                      ? new Date(item.event.eventDate).toLocaleDateString('id-ID', { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric' 
                        })
                      : '-';
                    
                    return (
                      <div key={item.event.id} className="group p-4 rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:shadow-md transition-all bg-gradient-to-br from-white to-purple-50/30">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors mb-1">
                              {item.event.title}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {eventDate}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className="text-xs px-3 py-1 rounded-full bg-purple-100 text-purple-700 font-medium border border-purple-200">
                              {item.event.status}
                            </span>
                            <Link 
                              href={`/events/${item.event.id}`} 
                              className="text-sm text-purple-700 hover:text-purple-800 font-medium hover:underline flex items-center gap-1"
                            >
                              Kelola
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* Joined Events */}
          <section className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Diikuti</h2>
                    <p className="text-blue-100 text-sm">Acara yang Anda daftar</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-white">{joined.length}</div>
              </div>
            </div>
            
            <div className="p-6">
              {joined.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 font-medium mb-2">Belum ikut acara</p>
                  <p className="text-sm text-gray-500 mb-6">Jelajahi dan gabung dengan acara komunitas yang ada</p>
                  <Link 
                    href="/events"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Jelajahi Acara
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {joined.map((item) => {
                    if (!item?.event) return null;
                    
                    const eventDate = item.event.eventDate 
                      ? new Date(item.event.eventDate).toLocaleDateString('id-ID', { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric' 
                        })
                      : '-';
                    
                    return (
                      <Link 
                        key={item.event.id} 
                        href={`/events/${item.event.id}`} 
                        className="block group p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-md transition-all bg-gradient-to-br from-white to-blue-50/30"
                      >
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors mb-1">
                          {item.event.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {eventDate}
                        </div>
                        {item.registration && (
                          <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium border border-blue-200">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {item.registration.status}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
