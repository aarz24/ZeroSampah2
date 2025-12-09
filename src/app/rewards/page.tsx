"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaMedal, FaTrophy, FaGift, FaStar, FaLeaf, FaLightbulb, FaAward, FaUsers } from "react-icons/fa";
import Loader from "@/components/Loader";
import Image from "next/image";
import Lottie from "lottie-react";
import coinStackAnimation from "@/../coin-stack.json";

// Dummy rewards data
const rewardsData = [
  {
    id: 1,
    title: "Pejuang Ekologi",
    description: "Mencapai 100 poin dengan mendaur ulang 50 item",
    icon: <FaMedal className="text-yellow-400" />,
    points: 100,
    date: "15 Mei 2023",
    status: "completed",
  },
  {
    id: 2,
    title: "Inovator Hijau",
    description: "Menyelesaikan 10 tantangan ramah lingkungan",
    icon: <FaLightbulb className="text-yellow-300" />,
    points: 250,
    date: "22 Juni 2023",
    status: "completed",
  },
  {
    id: 3,
    title: "Juara Keberlanjutan",
    description: "Mengurangi jejak karbon sebesar 25%",
    icon: <FaAward className="text-amber-400" />,
    points: 500,
    date: "10 Juli 2023",
    status: "completed",
  },
  {
    id: 4,
    title: "Pemimpin Komunitas",
    description: "Mengundang 5 teman untuk bergabung dengan ZeroSampah",
    icon: <FaUsers className="text-yellow-400" />,
    points: 150,
    date: "5 Agustus 2023",
    status: "completed",
  },
  {
    id: 5,
    title: "Master Nol Sampah",
    description: "Mencapai nol sampah selama 30 hari",
    icon: <FaTrophy className="text-purple-400" />,
    points: 300,
    date: "18 September 2023",
    status: "in-progress",
  },
];

// Available rewards to redeem
const availableRewards = [
  {
    id: 1,
    title: "Botol Minum Ramah Lingkungan",
    description: "Botol minum stainless steel yang dapat digunakan ulang",
    points: 200,
    image: "/images/rewards/botol.webp",
  },
  {
    id: 2,
    title: "Set Peralatan Makan Bambu",
    description: "Set peralatan makan bambu ramah lingkungan",
    points: 325,
    image: "/images/rewards/peralatan-bambu.jpg",
  },
  {
    id: 3,
    title: "Tas Belanja Katun Organik",
    description: "Tas belanja ramah lingkungan terbuat dari katun organik",
    points: 150,
    image: "/images/rewards/tas-katun.webp",
  },
];

// Tambahan hadiah (gambar placeholder — akan Anda isi nanti)
const moreAvailableRewards = [
  {
    id: 4,
    title: "Set Sedotan Stainless",
    description: "Set sedotan stainless beserta sikat pembersih, bisa digunakan ulang",
    points: 90,
    // using user's provided JPEG placed in public/images/rewards/
    image: "/images/rewards/sedotan-stainless.jpeg",
  },
  {
    id: 5,
    title: "Sabun Batang Organik",
    description: "Sabun batang organik biodegradable, dibuat lokal",
    points: 80,
    image: "/images/rewards/soap-organic.jpg",
  },
  {
    id: 6,
    title: "Eco Notebook",
    description: "Buku catatan terbuat dari kertas daur ulang",
    points: 100,
    // using user's photo (copy your file to public/images/rewards/notebook-eco.jpeg)
    image: "/images/rewards/notebook-eco.jpeg",
  },
  {
    id: 7,
    title: "Lampu LED Rechargeable",
    description: "Lampu LED isi ulang hemat energi untuk penggunaan rumah tangga",
    points: 120,
    image: "/images/rewards/led-rechargeable.jpg",
  },
  {
    id: 8,
    title: "Tanaman Hias Mini",
    description: "Tanaman hias kecil untuk memperbaiki kualitas udara di rumah",
    points: 125,
    image: "/images/rewards/tanaman-hias.jpeg",
  },
  {
    id: 9,
    // replacement: Stainless lunchbox
    title: "Kotak Makan Stainless (Bento)",
    description: "Kotak makan stainless tahan lama untuk mengurangi penggunaan bungkus sekali pakai",
    points: 300,
    image: "/images/rewards/lunchbox-eco.webp",
  },
];

// Gabungkan daftar dasar dan daftar tambahan
const mergedAvailableRewards = [...availableRewards, ...moreAvailableRewards];

export default function RewardsPage() {
  const [activeTab, setActiveTab] = useState("earned");
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user's points from server. We pull clerkId from localStorage userData if available.
  const fetchPoints = async (clerkId?: string) => {
    try {
      const id = clerkId || JSON.parse(localStorage.getItem('userData') || 'null')?.clerkId;
      if (!id) return;
      const res = await fetch(`/api/rewards/points?userId=${encodeURIComponent(id)}`);
      if (!res.ok) return;
      const data = await res.json();
      if (typeof data.points === 'number') setTotalPoints(data.points);
    } catch (e) {
      console.error('Failed to fetch points', e);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchPoints();
    // Poll every 8 seconds to pick up updates from collections/reports
    const t = setInterval(() => fetchPoints(), 8000);
    return () => clearInterval(t);
  }, []);

  const getStatusLabel = (status: string) => {
    if (status === "completed") return "Selesai";
    if (status === "in-progress") return "Sedang Berlangsung";
    return status;
  };

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
      {/* Points Summary Card */}
      <div className="p-6 mb-8 text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="mb-1 text-xl font-semibold">Total Poin</h2>
            <div className="flex items-center gap-2">
              <p className="text-4xl font-bold">{totalPoints}</p>
              <Lottie animationData={coinStackAnimation} loop={true} className="w-12 h-12" />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full bg-white bg-opacity-20 rounded-full h-2.5">
            <div className="bg-white h-2.5 rounded-full" style={{ width: "65%" }}></div>
          </div>
          <p className="mt-2 text-sm">Tier berikutnya: 2000 poin</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex mb-6 border-b border-gray-200">
        <button
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === "earned"
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("earned")}
        >
          Misi Bulanan
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === "available"
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("available")}
        >
          Hadiah Tersedia
        </button>
      </div>

      {/* Earned Rewards */}
      {activeTab === "earned" && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rewardsData.map((reward, index) => (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ 
                y: -8, 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              className="group relative overflow-hidden p-6 bg-white rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-2xl"
            >
              {/* Animated background glow */}
              <motion.div
                className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${
                  reward.status === "completed" 
                    ? "bg-gradient-to-br from-green-400 via-emerald-400 to-teal-500" 
                    : "bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-500"
                }`}
                initial={{ scale: 0 }}
                whileHover={{ scale: 1.5 }}
                transition={{ duration: 0.5 }}
              />

              {/* Content */}
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-3">
                    <motion.div 
                      className={`p-4 rounded-xl shadow-md ${
                        reward.status === "completed" 
                          ? "bg-gradient-to-br from-green-400 to-emerald-500" 
                          : "bg-gradient-to-br from-yellow-400 to-amber-500"
                      }`}
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <div className="text-2xl text-white">
                        {reward.icon}
                      </div>
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-green-600 transition-colors">
                        {reward.title}
                      </h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {reward.date}
                      </p>
                    </div>
                  </div>
                  
                  <motion.div 
                    className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-md ${
                      reward.status === "completed"
                        ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
                        : "bg-gradient-to-r from-yellow-400 to-amber-500 text-white"
                    }`}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {reward.points} pt
                  </motion.div>
                </div>

                <p className="text-sm text-gray-700 leading-relaxed mb-4 group-hover:text-gray-900 transition-colors">
                  {reward.description}
                </p>

                {/* Status Badge */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <motion.span 
                      className={`inline-block w-2.5 h-2.5 rounded-full ${
                        reward.status === "completed" ? "bg-green-500" : "bg-yellow-500"
                      }`}
                      animate={{
                        scale: reward.status === "in-progress" ? [1, 1.3, 1] : 1,
                        opacity: reward.status === "in-progress" ? [1, 0.5, 1] : 1,
                      }}
                      transition={{
                        duration: 2,
                        repeat: reward.status === "in-progress" ? Infinity : 0,
                      }}
                    />
                    <span className={`text-sm font-medium ${
                      reward.status === "completed" ? "text-green-600" : "text-yellow-600"
                    }`}>
                      {getStatusLabel(reward.status)}
                    </span>
                  </div>
                  
                  {reward.status === "completed" && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                    >
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </motion.div>
                  )}
                </div>

                {/* Decorative corner accent */}
                <motion.div
                  className={`absolute -right-6 -bottom-6 w-32 h-32 rounded-full blur-2xl opacity-20 ${
                    reward.status === "completed"
                      ? "bg-gradient-to-br from-green-400 to-emerald-500"
                      : "bg-gradient-to-br from-yellow-400 to-amber-500"
                  }`}
                  animate={{ 
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Available Rewards */}
      {activeTab === "available" && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mergedAvailableRewards.map((reward, index) => (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              whileHover={{ 
                y: -10, 
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
              className="group relative overflow-hidden bg-white rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-2xl"
            >
              {/* Image Container */}
              <div className="relative overflow-hidden h-56">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full"
                >
                  <Image
                    src={reward.image}
                    alt={reward.title}
                    className="object-cover w-full h-full"
                    width={400}
                    height={300}
                  />
                </motion.div>
                
                {/* Gradient Overlay on Hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                
                {/* Points Badge - Floating */}
                <motion.div 
                  className="absolute top-3 right-3 px-4 py-2 rounded-full backdrop-blur-md bg-white/90 shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {reward.points} pt
                    </span>
                  </div>
                </motion.div>

                {/* Availability indicator */}
                {totalPoints >= reward.points && (
                  <motion.div
                    initial={{ scale: 0, x: 20 }}
                    animate={{ scale: 1, x: 0 }}
                    className="absolute top-3 left-3 px-3 py-1 rounded-full backdrop-blur-md bg-green-500/90 shadow-lg"
                  >
                    <span className="text-xs font-bold text-white">✓ Tersedia</span>
                  </motion.div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors leading-tight">
                  {reward.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-5 min-h-[40px]">
                  {reward.description}
                </p>
                
                {/* Action Button */}
                <motion.button 
                  className={`w-full py-3 px-4 rounded-xl font-bold text-white transition-all duration-300 shadow-md hover:shadow-xl ${
                    totalPoints >= reward.points 
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700" 
                      : "bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed"
                  }`}
                  disabled={totalPoints < reward.points}
                  whileHover={totalPoints >= reward.points ? { scale: 1.03 } : {}}
                  whileTap={totalPoints >= reward.points ? { scale: 0.98 } : {}}
                >
                  {totalPoints >= reward.points ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Tukarkan Sekarang
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Butuh {reward.points - totalPoints} poin lagi
                    </span>
                  )}
                </motion.button>
              </div>

              {/* Decorative corner accent */}
              <motion.div
                className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 opacity-10 blur-3xl group-hover:opacity-20 transition-opacity duration-300"
                animate={{ 
                  scale: [1, 1.2, 1],
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
