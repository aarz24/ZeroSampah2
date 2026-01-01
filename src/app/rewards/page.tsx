"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaMedal, FaTrophy, FaGift, FaStar, FaLeaf, FaLightbulb, FaAward, FaUsers } from "react-icons/fa";
import { useUser } from "@clerk/nextjs";
import Loader from "@/components/Loader";
import Image from "next/image";
import Lottie from "lottie-react";
import coinAnimation from "@/../coin.json";
import fallenLeaf from "../../../public/animations/fallen-leaf.json";
import fallenLeaf1 from "../../../public/animations/fallen-leaf-1.json";
import fallenLeaf2 from "../../../public/animations/fallen-leaf-2.json";
import fallenLeaf3 from "../../../public/animations/fallen-leaf-3.json";

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
  const { user, isLoaded: isUserLoaded } = useUser();
  const [activeTab, setActiveTab] = useState("earned");
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user's points from API using Clerk user ID
  useEffect(() => {
    const fetchPoints = async () => {
      if (!user?.id) return;
      
      try {
        const res = await fetch(`/api/rewards/points?userId=${encodeURIComponent(user.id)}`);
        if (res.ok) {
          const data = await res.json();
          if (typeof data.points === 'number') {
            setTotalPoints(data.points);
          }
        }
      } catch (e) {
        console.error('Failed to fetch points', e);
      } finally {
        setIsLoading(false);
      }
    };

    if (isUserLoaded) {
      fetchPoints();
    }
  }, [user, isUserLoaded]);

  const getStatusLabel = (status: string) => {
    if (status === "completed") return "Selesai";
    if (status === "in-progress") return "Sedang Berlangsung";
    return status;
  };

  if (isLoading || !isUserLoaded) {
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
        {/* Points Summary Card */}
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
          
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-5 sm:gap-6">
            <div className="flex items-center gap-4 sm:gap-6">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex-shrink-0 bg-white/20 backdrop-blur-md rounded-2xl sm:rounded-3xl p-2 sm:p-3 shadow-xl shadow-black/10 border border-white/20 overflow-hidden"
              >
                <Lottie animationData={coinAnimation} loop={true} className="w-full h-full" />
              </motion.div>
              
              <div>
                <motion.h2 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm sm:text-lg md:text-xl font-semibold text-green-100 mb-1 sm:mb-2"
                >
                  Total Poin
                </motion.h2>
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                  className="flex items-baseline gap-2"
                >
                  <span className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                    {totalPoints}
                  </span>
                  <span className="text-lg sm:text-xl md:text-2xl font-bold text-green-200">pt</span>
                </motion.div>
              </div>
            </div>
            
            {/* Progress section */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="w-full md:w-72"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-green-100">Tier berikutnya</span>
                <span className="text-sm font-bold text-white">2000 pt</span>
              </div>
              <div className="relative w-full bg-white/20 backdrop-blur-sm rounded-full h-3 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "65%" }}
                  transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-400 rounded-full shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>
            </motion.div>
          </div>
          
          {/* Bottom gradient line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400/50 via-white/30 to-yellow-400/50" />
        </motion.div>

        {/* Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-2 mb-6 sm:mb-8 p-1 sm:p-1.5 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-gray-100"
        >
          <button
            className={`flex-1 py-2.5 sm:py-3.5 px-3 sm:px-6 font-bold text-xs sm:text-sm rounded-lg sm:rounded-xl transition-all duration-300 ${
              activeTab === "earned"
                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-200/50"
                : "text-gray-500 hover:text-green-600 hover:bg-green-50"
            }`}
            onClick={() => setActiveTab("earned")}
          >
            Misi Bulanan
          </button>
          <button
            className={`flex-1 py-2.5 sm:py-3.5 px-3 sm:px-6 font-bold text-xs sm:text-sm rounded-lg sm:rounded-xl transition-all duration-300 ${
              activeTab === "available"
                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-200/50"
                : "text-gray-500 hover:text-green-600 hover:bg-green-50"
            }`}
            onClick={() => setActiveTab("available")}
          >
            Hadiah Tersedia
          </button>
        </motion.div>

      {/* Earned Rewards */}
      {activeTab === "earned" && (
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
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
              className="group relative overflow-hidden p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-2xl"
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
                <div className="flex justify-between items-start mb-3 sm:mb-4">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <motion.div 
                      className={`p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-md ${
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
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
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
              className="group relative overflow-hidden bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-2xl"
            >
              {/* Image Container */}
              <div className="relative overflow-hidden h-40 sm:h-56">
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
                  className="absolute top-2 right-2 sm:top-3 sm:right-3 px-2.5 py-1 sm:px-4 sm:py-2 rounded-full backdrop-blur-md bg-white/90 shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-xs sm:text-sm font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {reward.points} pt
                    </span>
                  </div>
                </motion.div>

                {/* Availability indicator */}
                {totalPoints >= reward.points && (
                  <motion.div
                    initial={{ scale: 0, x: 20 }}
                    animate={{ scale: 1, x: 0 }}
                    className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full backdrop-blur-md bg-green-500/90 shadow-lg"
                  >
                    <span className="text-[10px] sm:text-xs font-bold text-white">✓ Tersedia</span>
                  </motion.div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6">
                <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2 group-hover:text-green-600 transition-colors leading-tight">
                  {reward.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-3 sm:mb-5 min-h-[32px] sm:min-h-[40px]">
                  {reward.description}
                </p>
                
                {/* Action Button */}
                <motion.button 
                  className={`w-full py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base text-white transition-all duration-300 shadow-md hover:shadow-xl ${
                    totalPoints >= reward.points 
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700" 
                      : "bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed"
                  }`}
                  disabled={totalPoints < reward.points}
                  whileHover={totalPoints >= reward.points ? { scale: 1.03 } : {}}
                  whileTap={totalPoints >= reward.points ? { scale: 0.98 } : {}}
                >
                  {totalPoints >= reward.points ? (
                    <span className="flex items-center justify-center gap-1.5 sm:gap-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Tukarkan Sekarang
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-1.5 sm:gap-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Butuh {reward.points - totalPoints} poin lagi
                    </span>
                  )}
                </motion.button>
              </div>

              {/* Decorative corner accent */}
              <motion.div
                className="absolute -right-6 -bottom-6 sm:-right-8 sm:-bottom-8 w-28 h-28 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 opacity-10 blur-3xl group-hover:opacity-20 transition-opacity duration-300"
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
    </div>
  );
}
