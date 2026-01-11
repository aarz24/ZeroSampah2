"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaMedal, FaTrophy, FaCrown, FaLeaf, FaUser } from "react-icons/fa";
import { useUser } from "@clerk/nextjs";
import Loader from "@/components/Loader";
import Image from "next/image";
import Lottie from "lottie-react";
import trophyAnimation from "@/../trophy.json";
import coinAnimation from "@/../coin.json";
import fallenLeaf from "../../../public/animations/fallen-leaf.json";
import fallenLeaf1 from "../../../public/animations/fallen-leaf-1.json";
import fallenLeaf2 from "../../../public/animations/fallen-leaf-2.json";
import fallenLeaf3 from "../../../public/animations/fallen-leaf-3.json";

// Interface for leaderboard user from API
interface LeaderboardUser {
  clerkId: string;
  fullName: string | null;
  email: string;
  points: number;
  profileImage: string | null;
}

// Time periods for filtering
const timePeriods = [
  { id: "all-time", label: "Sepanjang Waktu" },
  { id: "monthly", label: "Bulan Ini" },
  { id: "weekly", label: "Minggu Ini" },
  { id: "daily", label: "Hari Ini" },
];

export default function LeaderboardPage() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const [activePeriod, setActivePeriod] = useState("all-time");
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [userRank, setUserRank] = useState(0);
  const [userPoints, setUserPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch leaderboard data from API
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch('/api/leaderboard');
        if (res.ok) {
          const data = await res.json();
          setLeaderboardData(data);

          // Find current user's rank and points
          if (user?.id) {
            const userIndex = data.findIndex((u: LeaderboardUser) => u.clerkId === user.id);
            if (userIndex !== -1) {
              setUserRank(userIndex + 1);
              setUserPoints(data[userIndex].points);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isUserLoaded) {
      fetchLeaderboard();
    }
  }, [user, isUserLoaded]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-emerald-50">
      {/* Decorative Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-green-200/30 to-emerald-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-gradient-to-br from-yellow-200/20 to-amber-200/30 rounded-full blur-3xl" />
      </div>

      <div className="relative container px-4 sm:px-6 py-6 md:p-12 mx-auto animate-fadeIn">
        {/* User Rank Summary Card */}
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
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent" />
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

          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-5 sm:gap-8">
            {/* Left Section - Rank Info */}
            <div className="flex items-center gap-4 sm:gap-6">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 flex-shrink-0 bg-white/20 backdrop-blur-md rounded-2xl sm:rounded-3xl p-2 sm:p-3 shadow-xl shadow-black/10 border border-white/20 overflow-hidden"
              >
                <Lottie animationData={trophyAnimation} loop={true} className="w-full h-full" />
              </motion.div>

              <div>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm sm:text-lg md:text-xl font-semibold text-green-100 mb-1 sm:mb-2"
                >
                  Peringkat Anda
                </motion.p>
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                  className="flex items-baseline gap-2"
                >
                  <span className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                    #{userRank}
                  </span>
                </motion.div>
              </div>
            </div>

            {/* Right Section - Points & Motivation */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col items-start md:items-end gap-2 sm:gap-3"
            >
              <div className="flex items-center gap-2 sm:gap-3 bg-white/20 backdrop-blur-sm px-3 sm:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl border border-white/20">
                <div className="w-10 h-10 sm:w-12 sm:h-12">
                  <Lottie animationData={coinAnimation} loop={true} className="w-full h-full" />
                </div>
                <span className="text-xl sm:text-2xl md:text-3xl font-bold">{userPoints}</span>
                <span className="text-sm sm:text-lg font-semibold text-green-100">poin</span>
              </div>

              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-base sm:text-lg md:text-xl font-bold text-yellow-200"
                style={{ textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}
              >
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom gradient line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400/50 via-white/30 to-yellow-400/50" />
        </motion.div>

        {/* Time Period Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex overflow-x-auto pb-2 mb-4 sm:mb-6 space-x-2 sm:space-x-3"
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
              className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 shadow-md whitespace-nowrap ${activePeriod === period.id
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
          className="overflow-hidden bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-100"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-xs font-bold tracking-wider text-left text-gray-700 uppercase">
                    Peringkat
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-xs font-bold tracking-wider text-left text-gray-700 uppercase">
                    Pengguna
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-xs font-bold tracking-wider text-left text-gray-700 uppercase">
                    Poin
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {leaderboardData.map((user, index) => {
                  const rank = index + 1;
                  const displayName = user.fullName || user.email.split('@')[0];
                  const avatar = user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=4CAF50&color=fff&size=128&rounded=true`;

                  return (
                    <motion.tr
                      key={user.clerkId}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.03 }}
                      className={`transition-colors duration-200 hover:bg-gray-50/80 ${rank <= 3 ? "bg-gradient-to-r from-amber-50/30 to-transparent" : ""
                        }`}
                    >
                      <td className="px-3 sm:px-6 py-3 sm:py-5 whitespace-nowrap">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div
                            className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full font-bold text-sm sm:text-lg ${rank === 1
                                ? "bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-sm"
                                : rank === 2
                                  ? "bg-gradient-to-br from-gray-400 to-gray-500 text-white shadow-sm"
                                  : rank === 3
                                    ? "bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-sm"
                                    : "bg-green-100 text-green-700"
                              }`}
                          >
                            {rank}
                          </div>
                          <span className="text-xl opacity-80">
                            {rank === 1 ? <FaCrown className="text-yellow-500" /> :
                              rank === 2 ? <FaMedal className="text-gray-400" /> :
                                rank === 3 ? <FaMedal className="text-amber-600" /> :
                                  <FaLeaf className="text-green-500" />}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0 w-12 h-12 relative ring-2 ring-gray-100 rounded-full">
                            <Image
                              className="rounded-full"
                              src={avatar}
                              alt={displayName}
                              fill
                              sizes="48px"
                            />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-800">
                              {displayName}
                            </div>
                            {rank <= 3 && (
                              <div className="text-xs text-gray-500 font-medium">
                                Top {rank}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-base font-semibold text-gray-700">
                            {user.points.toLocaleString()}
                          </span>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
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
            </div>
          </motion.div>
        )}

        {/* Leaderboard page ends here */}
      </div>
    </div>
  );
}
