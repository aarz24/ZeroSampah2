"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaMedal, FaTrophy, FaGift, FaStar, FaLeaf } from "react-icons/fa";
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
    icon: <FaMedal className="text-amber-500" />,
    points: 100,
    date: "15 Mei 2023",
    status: "completed",
  },
  {
    id: 2,
    title: "Inovator Hijau",
    description: "Menyelesaikan 10 tantangan ramah lingkungan",
    icon: <FaTrophy className="text-emerald-500" />,
    points: 250,
    date: "22 Juni 2023",
    status: "completed",
  },
  {
    id: 3,
    title: "Juara Keberlanjutan",
    description: "Mengurangi jejak karbon sebesar 25%",
    icon: <FaLeaf className="text-green-500" />,
    points: 500,
    date: "10 Juli 2023",
    status: "completed",
  },
  {
    id: 4,
    title: "Pemimpin Komunitas",
    description: "Mengundang 5 teman untuk bergabung dengan ZeroSampah",
    icon: <FaStar className="text-blue-500" />,
    points: 150,
    date: "5 Agustus 2023",
    status: "completed",
  },
  {
    id: 5,
    title: "Master Nol Sampah",
    description: "Mencapai nol sampah selama 30 hari",
    icon: <FaGift className="text-purple-500" />,
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
          {rewardsData.map((reward) => (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-6 bg-white rounded-lg shadow-md transition-shadow hover:shadow-lg"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <div className="p-3 mr-4 bg-gray-100 rounded-full">
                    {reward.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{reward.title}</h3>
                    <p className="text-sm text-gray-500">{reward.date}</p>
                  </div>
                </div>
                  <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {reward.points} pt
                </div>
              </div>
              <p className="mt-4 text-gray-600">{reward.description}</p>
              <div className="flex items-center mt-4">
                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                  reward.status === "completed" ? "bg-green-500" : "bg-yellow-500"
                }`}></span>
                <span className="text-sm text-gray-500">{getStatusLabel(reward.status)}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Available Rewards */}
      {activeTab === "available" && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mergedAvailableRewards.map((reward) => (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden bg-white rounded-lg shadow-md transition-shadow hover:shadow-lg"
            >
              <div className="overflow-hidden h-48">
                <Image
                  src={reward.image}
                  alt={reward.title}
                  className="object-cover w-full h-full"
                  width={400}
                  height={300}
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">{reward.title}</h3>
                  <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {reward.points} pt
                    </div>
                </div>
                <p className="mb-4 text-gray-600">{reward.description}</p>
                <button 
                  className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                    totalPoints >= reward.points 
                      ? "bg-green-600 hover:bg-green-700" 
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                  disabled={totalPoints < reward.points}
                >
                  {totalPoints >= reward.points ? "Tukarkan Sekarang" : "Poin Tidak Cukup"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
