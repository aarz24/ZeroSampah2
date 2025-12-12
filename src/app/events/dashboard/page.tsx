'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import fallenLeaf from '../../../../public/animations/fallen-leaf.json';
import fallenLeaf1 from '../../../../public/animations/fallen-leaf-1.json';
import fallenLeaf2 from '../../../../public/animations/fallen-leaf-2.json';
import fallenLeaf3 from '../../../../public/animations/fallen-leaf-3.json';

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Decorative Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-green-200/30 to-emerald-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-indigo-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-gradient-to-br from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl" />
      </div>
      
      <div className="relative px-4 sm:px-6 py-6 sm:py-8">
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
          
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden p-5 sm:p-8 md:p-10 mb-6 sm:mb-10 text-white bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 rounded-2xl sm:rounded-3xl shadow-2xl shadow-green-500/25"
          >
            {/* Fallen Leaf Animations - Decorative Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-8 -left-8 w-32 sm:w-40 h-32 sm:h-40 opacity-25">
                <Lottie animationData={fallenLeaf} loop={true} />
              </div>
              <div className="absolute -top-6 left-1/4 w-28 sm:w-36 h-28 sm:h-36 opacity-20">
                <Lottie animationData={fallenLeaf1} loop={true} />
              </div>
              <div className="absolute -top-4 left-1/2 w-32 sm:w-40 h-32 sm:h-40 opacity-25">
                <Lottie animationData={fallenLeaf2} loop={true} />
              </div>
              <div className="absolute -top-8 right-1/4 w-28 sm:w-36 h-28 sm:h-36 opacity-20">
                <Lottie animationData={fallenLeaf3} loop={true} />
              </div>
              <div className="absolute -top-6 -right-8 w-32 sm:w-40 h-32 sm:h-40 opacity-25">
                <Lottie animationData={fallenLeaf} loop={true} />
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 -left-6 w-28 sm:w-36 h-28 sm:h-36 opacity-20">
                <Lottie animationData={fallenLeaf1} loop={true} />
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 left-1/4 w-32 sm:w-40 h-32 sm:h-40 opacity-15">
                <Lottie animationData={fallenLeaf2} loop={true} />
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 right-1/4 w-32 sm:w-40 h-32 sm:h-40 opacity-15">
                <Lottie animationData={fallenLeaf3} loop={true} />
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 -right-6 w-28 sm:w-36 h-28 sm:h-36 opacity-20">
                <Lottie animationData={fallenLeaf} loop={true} />
              </div>
              <div className="absolute -bottom-8 -left-8 w-32 sm:w-40 h-32 sm:h-40 opacity-25">
                <Lottie animationData={fallenLeaf1} loop={true} />
              </div>
              <div className="absolute -bottom-6 left-1/4 w-28 sm:w-36 h-28 sm:h-36 opacity-20">
                <Lottie animationData={fallenLeaf2} loop={true} />
              </div>
              <div className="absolute -bottom-4 left-1/2 w-32 sm:w-40 h-32 sm:h-40 opacity-25">
                <Lottie animationData={fallenLeaf3} loop={true} />
              </div>
              <div className="absolute -bottom-8 right-1/4 w-28 sm:w-36 h-28 sm:h-36 opacity-20">
                <Lottie animationData={fallenLeaf} loop={true} />
              </div>
              <div className="absolute -bottom-6 -right-8 w-32 sm:w-40 h-32 sm:h-40 opacity-25">
                <Lottie animationData={fallenLeaf1} loop={true} />
              </div>
            </div>
            
            {/* Decorative background elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl" />
            </div>
            
            {/* Floating particles */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/30 rounded-full"
                style={{
                  top: `${15 + i * 18}%`,
                  left: `${5 + i * 20}%`,
                }}
                animate={{
                  y: [0, -15, 0],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 2.5 + i * 0.4,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
            
            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl sm:text-3xl md:text-5xl font-extrabold mb-2 sm:mb-3 tracking-tight"
                  style={{ textShadow: '0 4px 20px rgba(0,0,0,0.2)' }}
                >
                  Acara Saya
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-green-100 text-sm sm:text-lg"
                >
                  Kelola acara yang Anda selenggarakan dan ikuti
                </motion.p>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Link 
                  href="/events/create" 
                  className="group inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 text-green-700 bg-white rounded-xl sm:rounded-2xl font-bold shadow-xl shadow-black/10 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 text-sm sm:text-base"
                >
                  <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </span>
                  Buat Acara
                </Link>
              </motion.div>
            </div>
            
            {/* Bottom gradient line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400/50 via-white/30 to-yellow-400/50" />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          {/* Organized Events */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-xl sm:shadow-2xl shadow-purple-500/10 overflow-hidden"
          >
            {/* Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-500 px-4 sm:px-6 py-4 sm:py-6">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl" />
              </div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4">
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-10 h-10 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg border border-white/20"
                  >
                    <svg className="w-5 h-5 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </motion.div>
                  <div>
                    <h2 className="text-lg sm:text-2xl font-bold text-white">Diselenggarakan</h2>
                    <p className="text-purple-100 text-xs sm:text-sm">Acara yang Anda buat</p>
                  </div>
                </div>
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                  className="text-2xl sm:text-4xl font-extrabold text-white bg-white/20 backdrop-blur-sm px-3 sm:px-5 py-1 sm:py-2 rounded-xl sm:rounded-2xl border border-white/20"
                >
                  {organized.length}
                </motion.div>
              </div>
            </div>
            
            <div className="p-4 sm:p-6">
              {organized.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-5 shadow-lg border border-purple-200"
                  >
                    <svg className="w-8 h-8 sm:w-12 sm:h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </motion.div>
                  <p className="text-gray-800 font-bold text-base sm:text-lg mb-2">Belum ada acara</p>
                  <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">Mulai buat acara pertama Anda untuk mengajak komunitas</p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link 
                      href="/events/create"
                      className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl sm:rounded-2xl hover:from-purple-700 hover:to-indigo-700 transition-all font-bold shadow-lg shadow-purple-500/30 text-sm sm:text-base"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Buat Acara Baru
                    </Link>
                  </motion.div>
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
          </motion.section>

          {/* Joined Events */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative bg-white rounded-3xl border border-gray-100 shadow-2xl shadow-blue-500/10 overflow-hidden"
          >
            {/* Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 px-6 py-6">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-400/20 rounded-full blur-2xl" />
              </div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg border border-white/20"
                  >
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Diikuti</h2>
                    <p className="text-blue-100 text-sm">Acara yang Anda daftar</p>
                  </div>
                </div>
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="text-4xl font-extrabold text-white bg-white/20 backdrop-blur-sm px-5 py-2 rounded-2xl border border-white/20"
                >
                  {joined.length}
                </motion.div>
              </div>
            </div>
            
            <div className="p-6">
              {joined.length === 0 ? (
                <div className="text-center py-12">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                    className="w-24 h-24 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-lg border border-blue-200"
                  >
                    <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </motion.div>
                  <p className="text-gray-800 font-bold text-lg mb-2">Belum ikut acara</p>
                  <p className="text-sm text-gray-500 mb-6">Jelajahi dan gabung dengan acara komunitas yang ada</p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link 
                      href="/events"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl hover:from-blue-700 hover:to-cyan-700 transition-all font-bold shadow-lg shadow-blue-500/30"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Jelajahi Acara
                    </Link>
                  </motion.div>
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
          </motion.section>
        </div>
        </div>
      </div>
    </div>
  );
}
