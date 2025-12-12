'use client';

import Lottie from 'lottie-react';
import PanelAksiCepat from './PanelAksiCepat';
import fallenLeaf from '../../../public/animations/fallen-leaf.json';
import fallenLeaf1 from '../../../public/animations/fallen-leaf-1.json';
import fallenLeaf2 from '../../../public/animations/fallen-leaf-2.json';
import fallenLeaf3 from '../../../public/animations/fallen-leaf-3.json';

export default function EventsHeader() {
  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-green-600 via-emerald-500 to-teal-500 text-white shadow-2xl shadow-green-500/25 px-4 sm:px-8 py-6 sm:py-10 md:px-12">
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
  );
}
