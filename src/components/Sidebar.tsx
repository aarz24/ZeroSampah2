"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trash, Package, Gift, Trophy, Home, Menu, X, Calendar } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";

interface SidebarProps {
  children: React.ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const { isSignedIn, isLoaded } = useUser();

  // Detect desktop screen size
  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Don't show sidebar if not signed in or still loading
  if (!isLoaded || !isSignedIn) {
    return children;
  }

  // Show sidebar on specified routes
  if (!pathname.includes('/report') && 
      !pathname.includes('/dashboard') && 
      !pathname.includes('/collect') && 
      !pathname.includes('/rewards') && 
      !pathname.includes('/leaderboard') &&
      !pathname.includes('/events')) {
    return children;
  }

  const menuItems = [
            { name: "Dasbor", icon: <Home className="w-4 h-4 sm:w-5 sm:h-5" />, link: "/dashboard" },
            { name: "Laporkan Sampah", icon: <Trash className="w-4 h-4 sm:w-5 sm:h-5" />, link: "/report" },
            { name: "Kumpulkan Sampah", icon: <Package className="w-4 h-4 sm:w-5 sm:h-5" />, link: "/collect" },
            { name: "Hadiah", icon: <Gift className="w-4 h-4 sm:w-5 sm:h-5" />, link: "/rewards" },
            { name: "Papan Peringkat", icon: <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />, link: "/leaderboard" },
            { name: "Event", icon: <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />, link: "/events" },
  ];

  return (
    <div className="flex pt-14 sm:pt-16 min-h-screen">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-3 sm:left-4 top-16 sm:top-20 z-50 p-1.5 sm:p-2 bg-white rounded-lg shadow-lg lg:hidden"
      >
        {isOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
      </button>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: isDesktop ? 0 : -280 }}
        animate={{ x: (isDesktop || isOpen) ? 0 : -280 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-0 top-14 sm:top-16 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] w-56 sm:w-64 bg-gradient-to-b from-emerald-50 via-white to-green-50 border-r border-emerald-100/70 shadow-xl shadow-emerald-100/80 z-40"
      >
        {/* Menu Items */}
        <nav className="h-full px-3 sm:px-4 pt-4 sm:pt-6 pb-20 sm:pb-28">
          <div className="mb-3 sm:mb-5 px-2">
            <p className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-semibold tracking-[0.22em] text-emerald-700/80 uppercase">
              <span className="inline-flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 text-[10px] sm:text-xs font-bold">
                ●
              </span>
              Navigasi Utama
            </p>
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Link href={item.link} className="block">
                  <div
                    className={`group flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl border transition-all duration-300
                      ${pathname === item.link 
                        ? 'bg-gradient-to-r from-emerald-600/10 via-emerald-500/5 to-lime-500/10 border-emerald-200 text-emerald-800 shadow-md shadow-emerald-100' 
                        : 'bg-white/60 border-transparent text-gray-600 hover:bg-emerald-50/80 hover:border-emerald-100 hover:text-emerald-700 hover:shadow-sm'}`}
                  >
                    <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl transition-all duration-300
                      ${pathname === item.link 
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-300' 
                        : 'bg-gray-100 text-gray-400 group-hover:bg-emerald-100 group-hover:text-emerald-700'
                    }`}>
                      {item.icon}
                    </div>
                    <span className="ml-0.5 sm:ml-1 text-xs sm:text-sm font-semibold tracking-tight">{item.name}</span>
                    
                    {pathname === item.link && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto h-5 sm:h-6 w-1 rounded-full bg-gradient-to-b from-emerald-500 to-lime-400"
                      />
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute right-0 bottom-0 left-0 p-4 sm:p-6 border-t border-gray-100">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center space-x-4"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-sm text-gray-600">Sesi Aktif</p>
          </motion.div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={`flex-1 ${(isDesktop || isOpen) ? 'ml-56 sm:ml-64' : 'ml-0'} lg:ml-64 w-full transition-all duration-300`}
      >
        <div className="w-full">
          {children}
        </div>
      </motion.main>
    </div>
  );
}