"use client";

import Link from "next/link";
import Lottie from "lottie-react";
import rocketAnimation from "@/../Rocket.json";

export default function PanelAksiCepat() {
  return (
    <div className="relative w-full lg:max-w-md bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl shadow-black/10 overflow-hidden">
      {/* Rocket Animation Background */}
      <div className="absolute -right-6 sm:-right-8 -bottom-6 sm:-bottom-8 w-28 sm:w-40 h-28 sm:h-40 opacity-20 pointer-events-none">
        <Lottie
          animationData={rocketAnimation}
          loop={true}
          autoplay={true}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-white/90 mb-3 sm:mb-4">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
          Panel Aksi Cepat
        </div>
        <div className="flex flex-col gap-2 sm:gap-3 sm:flex-row">
          <Link 
            href="/events/create" 
            className="group relative flex-1 inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-white text-green-700 font-bold shadow-xl shadow-black/15 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 overflow-hidden text-sm sm:text-base"
          >
            {/* Mini rocket on button */}
            <div className="absolute -right-2 -top-2 w-10 sm:w-12 h-10 sm:h-12 opacity-10 pointer-events-none">
              <Lottie
                animationData={rocketAnimation}
                loop={true}
                autoplay={true}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            <span className="relative z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            </span>
            <span className="relative z-10">Buat Acara</span>
          </Link>
          <Link 
            href="/events/dashboard" 
            className="group relative flex-1 inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-white/40 text-white font-bold bg-white/10 hover:bg-white/20 hover:-translate-y-1 transition-all duration-300 overflow-hidden text-sm sm:text-base"
          >
            {/* Mini rocket on button */}
            <div className="absolute -right-2 -top-2 w-10 sm:w-12 h-10 sm:h-12 opacity-10 pointer-events-none">
              <Lottie
                animationData={rocketAnimation}
                loop={true}
                autoplay={true}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            <span className="relative z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </span>
            <span className="relative z-10">Dashboard Saya</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
