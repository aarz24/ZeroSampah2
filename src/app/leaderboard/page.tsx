"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaMedal, FaTrophy, FaCrown, FaLeaf, FaUser } from "react-icons/fa";
import Loader from "@/components/Loader";
import Image from "next/image";
import Lottie from "lottie-react";
import trophyAnimation from "@/../trophy.json";

// Dummy leaderboard data
const leaderboardData = [
  {
    id: 1,
    name: "Alvin Masykur",
    points: 2500,
    rank: 1,
    achievements: 15,
    avatar: "https://ui-avatars.com/api/?name=Alvin+Masykur&background=4CAF50&color=fff&size=128&rounded=true",
    badge: <FaCrown className="text-yellow-500" />,
  },
  {
    id: 2,
    name: "Nara",
    points: 2350,
    rank: 2,
    achievements: 14,
    avatar: "https://ui-avatars.com/api/?name=Nara&background=4CAF50&color=fff&size=128&rounded=true",
    badge: <FaMedal className="text-gray-400" />,
  },
  {
    id: 3,
    name: "Abdul",
    points: 2200,
    rank: 3,
    achievements: 13,
    avatar: "https://ui-avatars.com/api/?name=Abdul&background=4CAF50&color=fff&size=128&rounded=true",
    badge: <FaMedal className="text-amber-600" />,
  },
  {
    id: 4,
    name: "Ical",
    points: 2050,
    rank: 4,
    achievements: 12,
    avatar: "https://ui-avatars.com/api/?name=Ical&background=4CAF50&color=fff&size=128&rounded=true",
    badge: <FaLeaf className="text-green-500" />,
  },
  {
    id: 5,
    name: "Boris",
    points: 1900,
    rank: 5,
    achievements: 11,
    avatar: "https://ui-avatars.com/api/?name=Boris&background=4CAF50&color=fff&size=128&rounded=true",
    badge: <FaLeaf className="text-green-500" />,
  },
  {
    id: 6,
    name: "Juan",
    points: 1750,
    rank: 6,
    achievements: 10,
    avatar: "https://ui-avatars.com/api/?name=Juan&background=4CAF50&color=fff&size=128&rounded=true",
    badge: <FaLeaf className="text-green-500" />,
  },
  {
    id: 7,
    name: "Dhika",
    points: 1600,
    rank: 7,
    achievements: 9,
    avatar: "https://ui-avatars.com/api/?name=Dhika&background=4CAF50&color=fff&size=128&rounded=true",
    badge: <FaLeaf className="text-green-500" />,
  },
  {
    id: 8,
    name: "Husen",
    points: 1450,
    rank: 8,
    achievements: 8,
    avatar: "https://ui-avatars.com/api/?name=Husen&background=4CAF50&color=fff&size=128&rounded=true",
    badge: <FaLeaf className="text-green-500" />,
  },
  {
    id: 9,
    name: "Ariel",
    points: 1300,
    rank: 9,
    achievements: 7,
    avatar: "https://ui-avatars.com/api/?name=Ariel&background=4CAF50&color=fff&size=128&rounded=true",
    badge: <FaLeaf className="text-green-500" />,
  },
  {
    id: 10,
    name: "Aryan",
    points: 1150,
    rank: 10,
    achievements: 6,
    avatar: "https://ui-avatars.com/api/?name=Aryan&background=4CAF50&color=fff&size=128&rounded=true",
    badge: <FaLeaf className="text-green-500" />,
  },
];

// Time periods for filtering
const timePeriods = [
  { id: "all-time", label: "Sepanjang Waktu" },
  { id: "monthly", label: "Bulan Ini" },
  { id: "weekly", label: "Minggu Ini" },
  { id: "daily", label: "Hari Ini" },
];

export default function LeaderboardPage() {
  const [activePeriod, setActivePeriod] = useState("all-time");
  const [userRank] = useState(12);
  const [userPoints] = useState(950);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate waiting for layout components to load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300); // Adjust this time as needed based on your actual layout load time

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="container p-12 mx-auto animate-fadeIn">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
          🏆 Papan Peringkat
        </h1>
        <p className="text-gray-600">Lihat peringkat pengguna teratas dan pencapaian mereka</p>
      </motion.div>

      {/* User Rank Summary Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden p-6 mb-8 text-white bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 rounded-2xl shadow-xl"
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl transform translate-x-32 -translate-y-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl transform -translate-x-32 translate-y-32" />
        </div>
        
        <div className="relative flex justify-between items-center">
          <div className="flex-1">
            <h2 className="mb-1 text-xl font-semibold opacity-90">Peringkat Anda</h2>
            <div className="flex items-center gap-3">
              <motion.p 
                className="text-5xl font-bold"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
              >
                #{userRank}
              </motion.p>
              <Lottie animationData={trophyAnimation} loop={true} className="w-16 h-16" />
            </div>
            <p className="mt-2 text-sm opacity-90 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Anda memiliki <span className="font-bold">{userPoints} poin</span>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Time Period Filter */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex overflow-x-auto pb-2 mb-6 space-x-3"
      >
        {timePeriods.map((period, index) => (
          <motion.button
            key={period.id}
            onClick={() => setActivePeriod(period.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 shadow-md ${
              activePeriod === period.id
                ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-green-200"
                : "bg-white text-gray-700 hover:bg-gray-50 hover:shadow-lg"
            }`}
          >
            {period.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Leaderboard Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="overflow-hidden bg-white rounded-2xl shadow-xl border border-gray-100"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-700 uppercase">
                  Peringkat
                </th>
                <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-700 uppercase">
                  Pengguna
                </th>
                <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-700 uppercase">
                  Poin
                </th>
                <th className="px-6 py-4 text-xs font-bold tracking-wider text-left text-gray-700 uppercase">
                  Pencapaian
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {leaderboardData.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ 
                    backgroundColor: "rgba(16, 185, 129, 0.05)",
                    transition: { duration: 0.2 }
                  }}
                  className={`transition-all duration-300 ${
                    user.rank <= 3 ? "bg-gradient-to-r from-yellow-50/50 to-transparent" : ""
                  }`}
                >
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.05 + 0.2, type: "spring" }}
                        className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg ${
                          user.rank === 1
                            ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-lg shadow-yellow-200"
                            : user.rank === 2
                            ? "bg-gradient-to-br from-gray-300 to-gray-500 text-white shadow-lg shadow-gray-200"
                            : user.rank === 3
                            ? "bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-lg shadow-amber-200"
                            : "bg-gradient-to-br from-green-100 to-emerald-100 text-green-700"
                        }`}
                      >
                        {user.rank}
                      </motion.div>
                      <motion.span 
                        className="text-2xl"
                        animate={user.rank <= 3 ? { 
                          scale: [1, 1.2, 1],
                          rotate: [0, 10, -10, 0]
                        } : {}}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 3
                        }}
                      >
                        {user.badge}
                      </motion.span>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <motion.div 
                        className="flex-shrink-0 w-12 h-12 relative ring-2 ring-green-100 rounded-full"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Image
                          className="rounded-full"
                          src={user.avatar}
                          alt={user.name}
                          fill
                          sizes="48px"
                        />
                      </motion.div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">
                          {user.name}
                        </div>
                        {user.rank <= 3 && (
                          <div className="text-xs text-green-600 font-medium">
                            Top {user.rank} 🌟
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-base font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        {user.points.toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full">
                        <span className="text-sm font-bold text-green-700">
                          {user.achievements}
                        </span>
                      </div>
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Your Position (if not in top 10) */}
      {userRank > 10 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative overflow-hidden p-6 mt-8 bg-gradient-to-r from-gray-50 to-green-50 rounded-2xl border-2 border-green-200 shadow-lg"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-200 rounded-full blur-3xl opacity-30 transform translate-x-16 -translate-y-16" />
          
          <div className="relative flex justify-between items-center">
            <div className="flex items-center gap-4">
              <motion.div 
                className="flex-shrink-0 w-14 h-14 ring-4 ring-green-200 rounded-full"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <div className="flex justify-center items-center w-full h-full bg-gradient-to-br from-green-400 to-emerald-500 rounded-full shadow-lg">
                  <FaUser className="text-white text-xl" />
                </div>
              </motion.div>
              <div>
                <div className="text-base font-bold text-gray-900 flex items-center gap-2">
                  You
                  <span className="px-2 py-0.5 text-xs bg-green-500 text-white rounded-full">
                    #{userRank}
                  </span>
                </div>
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {userPoints} points
                </div>
              </div>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold shadow-lg"
            >
              Keep Going! 🚀
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Leaderboard page ends here */}
    </div>
  );
}
