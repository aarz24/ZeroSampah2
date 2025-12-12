"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Leaf, Menu, X } from "lucide-react";
import Link from "next/link";
import { UserButton, useClerk, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

// Define a specific interface for user data
interface UserData {
  clerkId: string;
  name: string;
  email: string;
  imageUrl: string;
}

export default function Header() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isSignedIn, user, isLoaded } = useUser();
  const { openSignIn } = useClerk();

  useEffect(() => {
    // Only access localStorage on the client side
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      setUserData(JSON.parse(storedData));
    }
  }, []);

  useEffect(() => {
    if (isSignedIn && user) {
      const userData = {
        clerkId: user.id,
        name: user.fullName || "Unknown",
        email: user.primaryEmailAddress?.emailAddress || "No Email",
        imageUrl: user.imageUrl || "",
      };
      localStorage.setItem("userData", JSON.stringify(userData));
      setUserData(userData);
    } else {
      localStorage.removeItem("userData");
      setUserData(null);
    }
  }, [isSignedIn, user]);

  const handleLogin = () => {
    openSignIn({
      appearance: {
        elements: {
          rootBox: "rounded-xl",
          card: "rounded-xl",
        },
      },
      afterSignInUrl: "/",
    });
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-50 py-2 sm:py-4 border-b border-emerald-100/70 shadow-lg shadow-emerald-100/60 backdrop-blur-xl bg-gradient-to-r from-white/90 via-emerald-50/80 to-white/90">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between gap-4 sm:gap-6">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white text-emerald-600 shadow-lg shadow-emerald-200/60 transition-transform duration-300 group-hover:-translate-y-0.5">
              <Leaf className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="leading-tight">
              <p className="text-[16px] sm:text-[18px] font-bold tracking-tight text-gray-900">ZeroSampah</p>
            </div>
          </Link>

          <div className="hidden items-center gap-4 md:flex">
            <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-full border border-emerald-100 bg-white/70 shadow-sm">
              <NavLink href="/">Beranda</NavLink>
              <NavLink href="/about">Tentang</NavLink>
              {userData && <NavLink href="/dashboard">Dashboard</NavLink>}
              {userData && <NavLink href="/events">Event</NavLink>}
            </div>

            {!isLoaded ? (
              <div className="w-10 h-10 rounded-full bg-emerald-100 animate-pulse" />
            ) : !isSignedIn ? (
              <button
                onClick={handleLogin}
                className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white rounded-full bg-gradient-to-r from-emerald-600 to-lime-500 shadow-lg shadow-emerald-200/70 transition-all duration-200 hover:shadow-emerald-300"
              >
                Mulai Gabung
              </button>
            ) : (
              <div className="p-1 rounded-full bg-white/70 border border-emerald-100 shadow-sm">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10",
                    },
                  }}
                />
              </div>
            )}
          </div>

          <button
            className="p-1.5 sm:p-2 rounded-full border border-emerald-100/60 bg-white/80 text-emerald-700 transition-colors duration-200 md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            ) : (
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            )}
          </button>
        </nav>

        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden"
          >
            <div className="py-3 sm:py-4 mt-3 sm:mt-4 space-y-2 sm:space-y-3 rounded-xl sm:rounded-2xl border border-emerald-100 bg-white/90 shadow-xl">
              <MobileNavLink href="/">Beranda</MobileNavLink>
              <MobileNavLink href="/dashboard">Dasbor</MobileNavLink>
              <MobileNavLink href="/events">Event</MobileNavLink>
              <MobileNavLink href="/about">Tentang</MobileNavLink>
              {isSignedIn ? (
                <div className="px-4 py-2">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10",
                      },
                    }}
                  />
                </div>
              ) : (
                <button
                  onClick={handleLogin}
                  className="px-4 sm:px-6 py-2 sm:py-2.5 mx-3 sm:mx-4 w-[calc(100%-1.5rem)] sm:w-[calc(100%-2rem)] text-sm sm:text-base text-white bg-gradient-to-r from-emerald-600 to-lime-500 rounded-full font-semibold transition-all duration-200 hover:shadow-lg"
                >
                  Mulai Gabung
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`relative px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 ${
        isActive
          ? "text-emerald-900 bg-white shadow-md shadow-emerald-100"
          : "text-slate-500 hover:text-emerald-700 hover:bg-white/70"
      }`}
    >
      {children}
      {isActive && (
        <span className="absolute inset-0 rounded-full border border-emerald-200/70 pointer-events-none"></span>
      )}
    </Link>
  );
}

function MobileNavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`block px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl border transition-all ${
        isActive
          ? "text-emerald-800 bg-emerald-50 border-emerald-100"
          : "text-gray-800 border-transparent hover:bg-emerald-50/70 hover:border-emerald-100"
      }`}
    >
      {children}
    </Link>
  );
}
