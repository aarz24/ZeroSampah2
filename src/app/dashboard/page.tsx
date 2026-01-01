"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trash, 
  Package, 
  Award, 
  TrendingUp, 
  Calendar,
  MapPin,
  Users,
  BarChart,
  Plus,
  ArrowRight,
  Loader2,
  RefreshCw,
  FileText,
  Recycle,
  Coins,
  Leaf,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  Sparkles
} from "lucide-react";
// Use server API endpoint for recent reports
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Report } from "@/lib/types";
import { useUser } from "@clerk/nextjs";
import Lottie from "lottie-react";
import fallenLeaf from "../../../public/animations/fallen-leaf.json";
import fallenLeaf1 from "../../../public/animations/fallen-leaf-1.json";
import fallenLeaf2 from "../../../public/animations/fallen-leaf-2.json";
import fallenLeaf3 from "../../../public/animations/fallen-leaf-3.json";

// Cache expiration time in milliseconds (5 minutes)
const CACHE_EXPIRATION = 5 * 60 * 1000;

const recyclingItems = {
  plastic: {
    name: "Plastik",
    image: "/plastico.jpg",
    description: "Plastik adalah salah satu bahan paling umum dalam kehidupan sehari-hari dan dapat memakan waktu ratusan tahun untuk terurai. Daur ulang yang tepat sangat penting untuk mengurangi dampak lingkungannya.",
    steps: [
      { title: "Cuci untuk menghilangkan sisa", detail: "Buang semua sisa dan cuci dengan air. Sabun tidak diperlukan, pastikan tidak ada sisa makanan.", image: "/plastic1.jpg" },
      { title: "Pisahkan tutup dan label", detail: "Jika memungkinkan, pisahkan tutup dan label karena mungkin terbuat dari jenis plastik yang berbeda.", image: "/plastic2.jpeg" },
      { title: "Hancurkan untuk mengurangi volume", detail: "Tekan untuk menghemat ruang. Botol dapat dihancurkan, tapi tetap jaga agar identifikasi material terlihat.", image: "/plastic3.jpg" },
      { title: "Masukkan ke tempat sampah yang benar", detail: "Buang di tempat sampah khusus plastik. Periksa warna tempat sampah – biasanya merah untuk plastik.", image: "/plastic4.webp" }
    ],
    impact: "Plastik dapat memakan waktu hingga 450 tahun untuk terurai di alam. Dengan mendaur ulang, Anda membantu mengurangi polusi laut dan emisi gas rumah kaca.",
    tips: ["Pilih produk dengan kemasan lebih sedikit", "Gunakan tas yang dapat digunakan ulang", "Hindari plastik sekali pakai", "Pilih kemasan yang dapat didaur ulang"]
  },
  electronics: {
    name: "Elektronik",
    image: "/eletronicos.jpg",
    description: "Sampah elektronik mengandung bahan berharga serta zat beracun. Daur ulang yang tepat penting untuk melindungi lingkungan dan memulihkan bahan berharga.",
    steps: [
      { title: "Lepaskan baterai", detail: "Baterai harus didaur ulang secara terpisah karena mengandung bahan beracun. Cari titik pengumpulan khusus.", image: "/eletronics1.jpg" },
      { title: "Hapus data pribadi", detail: "Untuk perangkat penyimpanan, backup dan hapus sepenuhnya data pribadi Anda.", image: "/eletronics2.jpeg" },
      { title: "Temukan titik pengumpulan", detail: "Cari titik pengumpulan khusus elektronik. Banyak toko elektronik menawarkan program daur ulang.", image: "/eletronics3.jpeg" },
      { title: "Serahkan dengan benar", detail: "Serahkan elektronik di titik pengumpulan resmi, di mana akan dibongkar dan didaur ulang dengan benar.", image: "/eletronics4.jpeg" }
    ],
    impact: "Sampah elektronik hanya 2% dari sampah TPA tapi menyumbang 70% sampah beracun. Daur ulang yang tepat mencegah kontaminasi tanah dan air.",
    tips: ["Perpanjang umur perangkat", "Lakukan pemeliharaan preventif", "Donasikan peralatan yang masih berfungsi", "Teliti reputasi titik pengumpulan"]
  },
  paper: {
    name: "Kertas",
    image: "/papel.jpeg",
    description: "Kertas adalah salah satu bahan yang paling banyak didaur ulang di dunia. Daur ulang membantu mengurangi deforestasi dan konsumsi air dalam produksi kertas baru.",
    steps: [
      { title: "Lepaskan bagian plastik atau logam", detail: "Bagian berlapis plastik atau logam, seperti staples harus dilepas sebelum didaur ulang.", image: "/paper1.jpg" },
      { title: "Sobek untuk memudahkan transportasi", detail: "Menyobek kertas membantu mengoptimalkan penyimpanan dan transportasi untuk daur ulang.", image: "/paper2.jpg" },
      { title: "Hindari kertas yang terkontaminasi", detail: "Kertas yang kotor dengan minyak atau makanan tidak dapat didaur ulang.", image: "/paper3.png" },
      { title: "Masukkan ke tempat sampah biru", detail: "Buang kertas yang dapat didaur ulang di tempat sampah biru.", image: "/paper4.jpeg" }
    ],
    impact: "Setiap ton kertas daur ulang menghemat sekitar 10.000 liter air dan mengurangi kebutuhan penebangan pohon.",
    tips: ["Gunakan kertas daur ulang", "Cetak dua sisi jika memungkinkan", "Gunakan kembali kertas sebelum dibuang", "Hindari pemborosan dalam catatan"]
  },
  organic: {
    name: "Organik",
    image: "/organico.jpg",
    description: "Sampah organik, seperti sisa makanan dan kulit buah, dapat diubah menjadi kompos, mengurangi jumlah sampah yang dikirim ke TPA.",
    steps: [
      { title: "Pisahkan sampah organik", detail: "Pisahkan sisa buah, kulit sayuran, cangkang telur, dan ampas kopi untuk pengomposan.", image: "/organic1.webp" },
      { title: "Hindari mencampur dengan plastik dan logam", detail: "Jaga sampah organik bebas dari kemasan plastik atau logam.", image: "/organic2.webp" },
      { title: "Gunakan komposter rumah", detail: "Jika Anda punya ruang, komposter rumah dapat mengubah sampah organik Anda menjadi pupuk alami.", image: "/organic3.jpeg" },
      { title: "Buang dengan benar di lokasi yang ditentukan", detail: "Jika Anda tidak membuat kompos, masukkan sampah organik ke tempat sampah coklat.", image: "/organic4.jpeg" }
    ],
    impact: "Pengomposan mengurangi emisi gas metana, salah satu kontributor utama efek rumah kaca, dan meningkatkan kualitas tanah.",
    tips: ["Hindari pemborosan makanan", "Gunakan kulit dan batang dalam resep", "Gunakan sampah organik untuk kompos", "Simpan dengan benar untuk menghindari bau"]
  }
};

interface UserData {
  name: string;
  email: string;
  id: string;
}

interface UserStats {
  points: number;
  reportsCount: number;
  eventsAttendedCount: number;
  rank: string;
  impact: string;
}

export default function DashboardPage() {
  const { isSignedIn, isLoaded, user } = useUser();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    points: 0,
    reportsCount: 0,
    eventsAttendedCount: 0,
    rank: "Pemula",
    impact: "Rendah"
  });
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedRecycleItem, setSelectedRecycleItem] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const expandedContentRef = useRef<HTMLDivElement>(null);

  // Function to handle card click with auto-scroll
  const handleCardClick = (key: string) => {
    const isClosing = expandedItem === key;
    setExpandedItem(isClosing ? null : key);
    
    // Scroll to expanded content after a short delay to let it render
    if (!isClosing) {
      setTimeout(() => {
        expandedContentRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start'
        });
      }, 100);
    }
  };

  // Auto-cycle through steps when item is expanded
  useEffect(() => {
    if (expandedItem) {
      const item = recyclingItems[expandedItem as keyof typeof recyclingItems];
      const timer = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % item.steps.length);
      }, 2000);
      return () => clearInterval(timer);
    } else {
      setCurrentStep(0);
    }
  }, [expandedItem]);

  useEffect(() => {
    if (selectedRecycleItem) {
      const item = recyclingItems[selectedRecycleItem as keyof typeof recyclingItems];
      const timer = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % item.steps.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [selectedRecycleItem]);

  // Load user data from localStorage on client-side only
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("userData");
      if (storedData) {
        setUserData(JSON.parse(storedData));
      } else if (user) {
        // If no stored data but we have user from Clerk, create userData
        const newUserData = {
          name: user.fullName || user.username || "User",
          email: user.emailAddresses[0]?.emailAddress || "",
          id: user.id
        };
        setUserData(newUserData);
        // Safely cache user data; ignore storage quota errors
        try {
          localStorage.setItem("userData", JSON.stringify(newUserData));
        } catch (err) {
          console.warn("localStorage setItem failed for userData:", err);
        }
      }
    }
  }, [user]);

  // Redirect to home page if user is not signed in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/");
    }
  }, [isLoaded, isSignedIn, router]);

  // Function to fetch reports from the database
  const fetchRecentReports = async (forceRefresh = false) => {
    try {
      setIsLoading(true);
      
      // Check if we have cached data and it's not expired
      let cachedData: string | null = null;
      let cacheTimestamp: string | null = null;
      try {
        cachedData = localStorage.getItem("recentReports");
        cacheTimestamp = localStorage.getItem("recentReportsTimestamp");
      } catch (err) {
        // Access to storage might be blocked; ignore cache in that case
        console.warn("localStorage getItem failed:", err);
      }
      
      const now = new Date().getTime();
      const isCacheValid = cacheTimestamp && 
        (now - parseInt(cacheTimestamp)) < CACHE_EXPIRATION;
      
      // Fetch user stats from database
      if (user?.id) {
        try {
          const statsRes = await fetch(`/api/users/${user.id}/stats`);
          if (statsRes.ok) {
            const stats = await statsRes.json();
            setUserStats({
              points: stats.points,
              reportsCount: stats.reportsCount,
              eventsAttendedCount: stats.eventsAttendedCount,
              rank: stats.rank,
              impact: stats.impact
            });
          }
        } catch (error) {
          console.error("Error fetching user stats:", error);
        }
      }
      
      // Use cached data if available, not expired, and not forcing refresh
      if (cachedData && isCacheValid && !forceRefresh) {
        try {
          const parsedReports = JSON.parse(cachedData);
          setRecentReports(parsedReports);
          setIsLoading(false);
          return;
        } catch (err) {
          console.warn("Failed to parse cached recentReports:", err);
          // fall through to fetch fresh data
        }
      }
      
      // Fetch fresh data from the server API
      const res = await fetch('/api/reports?limit=5');
      const reports = await res.json();
      
      // Convert null imageUrl to undefined to match Report type
      const formattedReports = reports.map(report => ({
        ...report,
        imageUrl: report.imageUrl || undefined,
        collectorId: report.collectorId || null
      }));
      
      // Cache the formatted reports
      // Safely cache the formatted reports; if quota exceeded, skip caching
      try {
        localStorage.setItem("recentReports", JSON.stringify(formattedReports));
        localStorage.setItem("recentReportsTimestamp", now.toString());
      } catch (err) {
        console.warn("localStorage quota exceeded or unavailable; skipping cache:", err);
        try {
          // Attempt to free space for our keys only
          localStorage.removeItem("recentReports");
          localStorage.removeItem("recentReportsTimestamp");
        } catch {}
      }
      
      setRecentReports(formattedReports as Report[]);
    } catch (error) {
      console.error("Error fetching recent reports:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Initial data load
  useEffect(() => {
    if (isSignedIn) {
      fetchRecentReports();
    }
  }, [isSignedIn]);

  // Handle manual refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchRecentReports(true);
  };

  // Show loading state while checking authentication
  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
      </div>
    );
  }

  // Don't render anything if not signed in (will redirect)
  if (!isSignedIn) {
    return null;
  }

  // Use a fallback name if userData is not available
  const userName = userData?.name || user?.fullName || user?.username || "User";

  const stats = [
    {
      title: "Total Poin",
      value: userStats.points,
      icon: Award,
      gradient: "from-pink-500 via-rose-500 to-pink-600",
      iconBg: "bg-gradient-to-br from-pink-400 to-pink-600",
      description: "Skor kontribusi lingkungan Anda"
    },
    {
      title: "Laporan Dikirim",
      value: userStats.reportsCount,
      icon: Trash,
      gradient: "from-yellow-500 via-amber-500 to-yellow-600",
      iconBg: "bg-gradient-to-br from-yellow-400 to-amber-600",
      description: "Total laporan sampah yang dikirim"
    },
    {
      title: "Peringkat Saat Ini",
      value: userStats.rank,
      icon: TrendingUp,
      gradient: "from-purple-500 via-violet-500 to-purple-600",
      iconBg: "bg-gradient-to-br from-purple-400 to-purple-600",
      description: "Status pejuang lingkungan Anda saat ini"
    },
    {
      title: "Dampak Lingkungan",
      value: userStats.impact,
      icon: Leaf,
      gradient: "from-blue-500 via-cyan-500 to-blue-600",
      iconBg: "bg-gradient-to-br from-blue-400 to-cyan-600",
      description: "Jejak lingkungan positif Anda"
    },
  ];

  return (
    <div className="pt-12 pb-16 sm:pb-20 min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="px-3 sm:px-4 mx-auto max-w-7xl md:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden p-5 sm:p-8 md:p-10 text-white bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-2xl sm:rounded-3xl shadow-2xl shadow-green-500/25"
          >
            {/* Fallen Leaf Animations - Decorative Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {/* Top row */}
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
              
              {/* Middle row */}
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
              
              {/* Bottom row */}
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
            <div className="absolute top-0 right-0 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent" />
            
            {/* Floating particles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/30 rounded-full hidden sm:block"
                style={{
                  top: `${20 + i * 15}%`,
                  left: `${10 + i * 15}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2 sm:mb-3 tracking-tight">
                  {("Selamat datang kembali,").split("").map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.02, duration: 0.3 }}
                      style={{ display: 'inline-block' }}
                    >
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  ))}
                  <br />
                  <span className="bg-gradient-to-r from-yellow-200 via-yellow-300 to-orange-200 bg-clip-text text-transparent">
                    {userName.split("").map((char, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.03, duration: 0.3 }}
                        style={{ display: 'inline-block' }}
                      >
                        {char === " " ? "\u00A0" : char}
                      </motion.span>
                    ))}
                  </span>
                </h1>
              </div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              >
                <Link 
                  href="/report"
                  className="group relative flex gap-2 sm:gap-3 items-center px-5 sm:px-8 py-3 sm:py-4 font-bold text-green-600 bg-white rounded-xl sm:rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10 p-1.5 sm:p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg sm:rounded-xl shadow-md group-hover:shadow-lg transition-all">
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <span className="relative z-10 text-sm sm:text-lg">Laporan Baru</span>
                  <motion.div
                    className="relative z-10"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                  </motion.div>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-6 mb-8 sm:mb-12 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 30, rotateX: -10 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ 
                y: -10, 
                scale: 1.03,
                transition: { duration: 0.3 }
              }}
              className="group relative overflow-hidden p-4 sm:p-6 bg-gradient-to-br from-white via-white to-gray-50/50 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-xl transition-all duration-500 hover:shadow-2xl hover:shadow-gray-200/50"
            >
              {/* Animated background glow */}
              <div className={`absolute -inset-1 bg-gradient-to-r ${stat.gradient} rounded-3xl opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500`} />
              
              {/* Top accent line */}
              <div className={`absolute top-0 left-0 right-0 h-1 sm:h-1.5 bg-gradient-to-r ${stat.gradient} rounded-t-2xl sm:rounded-t-3xl`} />
              
              {/* Content */}
              <div className="relative z-10 pt-1 sm:pt-2">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0 mb-3 sm:mb-5">
                  <motion.div 
                    className={`p-2.5 sm:p-4 rounded-xl sm:rounded-2xl ${stat.iconBg} shadow-lg group-hover:shadow-xl transition-all duration-300`}
                    whileHover={{ rotate: 360, scale: 1.15 }}
                    transition={{ duration: 0.6 }}
                  >
                    <stat.icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                  </motion.div>
                  <motion.div 
                    className="hidden sm:block text-right"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  >
                    <span className={`px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent border border-gray-100 rounded-full`}>
                      {stat.title}
                    </span>
                  </motion.div>
                </div>
                
                <motion.div 
                  className="mb-2 sm:mb-3"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 200 }}
                >
                  <p className={`${typeof stat.value === 'string' ? 'text-lg sm:text-2xl md:text-3xl' : 'text-xl sm:text-4xl md:text-5xl'} font-extrabold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                    {stat.value}
                  </p>
                </motion.div>
                
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed hidden sm:flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${stat.gradient}`} />
                  {stat.description}
                </p>
                <p className="text-xs sm:hidden text-gray-500 mt-1 font-medium">{stat.title}</p>
                
                {/* Decorative corner accent */}
                <motion.div
                  className={`absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-gradient-to-br ${stat.gradient} opacity-10 blur-2xl group-hover:opacity-25 transition-opacity duration-500`}
                  animate={{ 
                    scale: [1, 1.3, 1],
                    rotate: [0, 45, 0],
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
                
                {/* Bottom shine effect */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Activity and Progress Section */}
        <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2 mb-8 sm:mb-12">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="group relative overflow-hidden bg-gradient-to-br from-white via-white to-emerald-50/30 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500"
          >
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-40 sm:w-64 h-40 sm:h-64 bg-gradient-to-bl from-emerald-100/50 to-transparent rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-24 sm:w-40 h-24 sm:h-40 bg-gradient-to-tr from-green-100/50 to-transparent rounded-full blur-2xl" />
            
            {/* Top accent bar */}
            <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-400" />
            
            <div className="relative p-4 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <motion.div 
                    className="p-2 sm:p-3 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl sm:rounded-2xl shadow-lg shadow-emerald-200/50"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </motion.div>
                  <h2 className="text-lg sm:text-2xl font-extrabold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Aktivitas Terbaru
                  </h2>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                  <motion.button 
                    onClick={handleRefresh}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-semibold text-gray-500 hover:text-emerald-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl hover:bg-emerald-50 transition-all"
                    disabled={isRefreshing}
                  >
                    {isRefreshing ? (
                      <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
                    )}
                    <span>Segarkan</span>
                  </motion.button>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link 
                      href="/collect"
                      className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg sm:rounded-xl px-3 sm:px-5 py-1.5 sm:py-2.5 shadow-lg shadow-emerald-200/50 hover:shadow-xl transition-all"
                    >
                      <span>Kumpulkan Sampah</span>
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Link>
                  </motion.div>
                </div>
              </div>
              
              <div className="space-y-4">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-500" />
                    </motion.div>
                    <p className="mt-4 text-sm font-medium text-gray-400">Memuat aktivitas...</p>
                  </div>
                ) : recentReports.length > 0 ? (
                  recentReports.map((report, index) => (
                    <motion.div
                      key={report.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08 }}
                      whileHover={{ x: 5, scale: 1.01 }}
                      className="group/item relative flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-100 hover:border-emerald-300 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-emerald-100/50"
                    >
                      {/* Left accent */}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-emerald-400 to-green-500 rounded-r-full opacity-0 group-hover/item:opacity-100 transition-opacity" />
                      
                      <motion.div 
                        className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-50 to-green-100 text-emerald-600 border border-emerald-100 group-hover/item:from-emerald-500 group-hover/item:to-green-500 group-hover/item:text-white group-hover/item:border-transparent group-hover/item:shadow-lg transition-all duration-300"
                        whileHover={{ rotate: 180 }}
                        transition={{ duration: 0.4 }}
                      >
                        <Recycle className="w-4 h-4 sm:w-5 sm:h-5" />
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base font-bold text-gray-800 line-clamp-1 group-hover/item:text-emerald-700 transition-colors">
                          {report.wasteType}
                        </p>
                        <p className="mt-1.5 text-xs text-gray-400 flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>
                            {new Date(report.createdAt || new Date()).toLocaleDateString('id-ID', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </p>
                      </div>
                      <motion.a 
                        href={report.location}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-gray-600 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 shadow-sm transition-all group-hover/item:bg-gradient-to-r group-hover/item:from-emerald-500 group-hover/item:to-green-500 group-hover/item:text-white group-hover/item:border-transparent group-hover/item:shadow-lg"
                      >
                        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>Lihat Lokasi</span>
                      </motion.a>
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-14 text-center bg-gradient-to-br from-gray-50 to-emerald-50/30 border-2 border-dashed border-gray-200 rounded-3xl"
                  >
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Package className="mx-auto mb-4 w-16 h-16 text-gray-300" />
                    </motion.div>
                    <p className="mb-1 text-base font-bold text-gray-600">Belum ada aktivitas terbaru</p>
                    <p className="mb-6 text-sm text-gray-400">Mulai dengan melaporkan titik sampah pertama Anda.</p>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link 
                        href="/report"
                        className="inline-flex items-center gap-2 text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl px-6 py-3 shadow-lg shadow-emerald-200/50 hover:shadow-xl transition-all"
                      >
                        <Plus className="w-5 h-5" />
                        <span>Buat Laporan Sampah</span>
                      </Link>
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Environmental Impact */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="group relative overflow-hidden bg-gradient-to-br from-white via-white to-blue-50/30 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500"
          >
            {/* Decorative background */}
            <div className="absolute top-0 left-0 w-40 sm:w-64 h-40 sm:h-64 bg-gradient-to-br from-cyan-100/50 to-transparent rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -right-10 w-24 sm:w-40 h-24 sm:h-40 bg-gradient-to-tl from-violet-100/50 to-transparent rounded-full blur-2xl" />
            
            {/* Top accent bar */}
            <div className="h-1.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-400" />
            
            <div className="relative p-4 sm:p-6 md:p-8">
              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <motion.div 
                  className="p-2 sm:p-3 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl sm:rounded-2xl shadow-lg shadow-emerald-200/50"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </motion.div>
                <h2 className="text-lg sm:text-2xl font-extrabold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Dampak Lingkungan Anda
                </h2>
              </div>
              
              <div className="space-y-4 sm:space-y-5">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="group/card relative flex flex-col sm:flex-row items-start sm:items-center p-4 sm:p-5 bg-gradient-to-r from-emerald-50/80 via-green-50/80 to-teal-50/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-emerald-100 shadow-lg hover:shadow-xl hover:shadow-emerald-100/50 transition-all duration-300 gap-3 sm:gap-0"
                >
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 sm:h-10 bg-gradient-to-b from-emerald-400 to-green-500 rounded-r-full" />
                  <motion.div 
                    className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-gradient-to-br from-emerald-400 to-green-500 text-white rounded-xl sm:rounded-2xl shadow-lg shadow-emerald-200/50"
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Recycle className="w-5 h-5 sm:w-7 sm:h-7" />
                  </motion.div>
                  <div className="flex-1 sm:ml-5">
                    <p className="font-bold text-sm sm:text-base text-gray-800">Sampah Terkumpul</p>
                    <p className="text-xs sm:text-sm text-gray-500">Estimasi total dari laporan</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-emerald-500 to-green-500 bg-clip-text text-transparent">
                      {userStats.reportsCount * 5}
                    </span>
                    <span className="text-sm sm:text-lg font-bold text-gray-400 ml-1">kg</span>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="group/card relative flex flex-col sm:flex-row items-start sm:items-center p-4 sm:p-5 bg-gradient-to-r from-cyan-50/80 via-blue-50/80 to-sky-50/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-cyan-100 shadow-lg hover:shadow-xl hover:shadow-cyan-100/50 transition-all duration-300 gap-3 sm:gap-0"
                >
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 sm:h-10 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-r-full" />
                  <motion.div 
                    className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-gradient-to-br from-cyan-400 to-blue-500 text-white rounded-xl sm:rounded-2xl shadow-lg shadow-cyan-200/50"
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Users className="w-5 h-5 sm:w-7 sm:h-7" />
                  </motion.div>
                  <div className="flex-1 sm:ml-5">
                    <p className="font-bold text-sm sm:text-base text-gray-800">Kerja Bakti yang Diikuti</p>
                    <p className="text-xs sm:text-sm text-gray-500">total sejauh ini</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                      {userStats.eventsAttendedCount}
                    </span>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="group/card relative flex flex-col sm:flex-row items-start sm:items-center p-4 sm:p-5 bg-gradient-to-r from-violet-50/80 via-purple-50/80 to-fuchsia-50/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-violet-100 shadow-lg hover:shadow-xl hover:shadow-violet-100/50 transition-all duration-300 gap-3 sm:gap-0"
                >
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 sm:h-10 bg-gradient-to-b from-violet-400 to-purple-500 rounded-r-full" />
                  <motion.div 
                    className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-gradient-to-br from-violet-400 to-purple-500 text-white rounded-xl sm:rounded-2xl shadow-lg shadow-violet-200/50"
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Calendar className="w-5 h-5 sm:w-7 sm:h-7" />
                  </motion.div>
                  <div className="flex-1 sm:ml-5">
                    <p className="font-bold text-sm sm:text-base text-gray-800">Total Hari Aktif</p>
                    <p className="text-xs sm:text-sm text-gray-500">Berpartisipasi dalam aksi</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-violet-500 to-purple-500 bg-clip-text text-transparent">
                      {Math.ceil(userStats.reportsCount * 1.5)}
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>



          {/* Detail Modal */}
          <AnimatePresence>
            {selectedRecycleItem && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                onClick={() => setSelectedRecycleItem(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="bg-white rounded-2xl max-w-4xl max-h-[90vh] overflow-y-auto w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center z-10">
                    <h2 className="text-2xl font-bold text-green-600">
                      Cara Daur Ulang: {recyclingItems[selectedRecycleItem as keyof typeof recyclingItems].name}
                    </h2>
                    <button
                      onClick={() => {
                        setSelectedRecycleItem(null);
                        setCurrentStep(0);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="p-6">
                    <p className="text-gray-600 mb-6">
                      {recyclingItems[selectedRecycleItem as keyof typeof recyclingItems].description}
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div className="relative h-64 rounded-lg overflow-hidden">
                        <img
                          src={recyclingItems[selectedRecycleItem as keyof typeof recyclingItems].image}
                          alt={recyclingItems[selectedRecycleItem as keyof typeof recyclingItems].name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="bg-green-50 rounded-xl p-6">
                        <h3 className="text-xl font-semibold text-green-600 mb-3">Dampak Lingkungan</h3>
                        <p className="text-gray-700 mb-4">
                          {recyclingItems[selectedRecycleItem as keyof typeof recyclingItems].impact}
                        </p>
                        <h4 className="font-medium text-green-600 mb-2">Tips Berguna:</h4>
                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                          {recyclingItems[selectedRecycleItem as keyof typeof recyclingItems].tips.map((tip, i) => (
                            <li key={i}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-green-600 mb-4">Langkah-langkah Daur Ulang</h3>
                    <div className="space-y-6">
                      {recyclingItems[selectedRecycleItem as keyof typeof recyclingItems].steps.map((step, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -50 }}
                          animate={{
                            opacity: currentStep === i ? 1 : 0.7,
                            x: 0,
                            scale: currentStep === i ? 1 : 0.98,
                          }}
                          transition={{ duration: 0.5 }}
                          className="grid md:grid-cols-2 gap-4 items-center"
                        >
                          <div className="flex items-start">
                            <div
                              className={`flex-shrink-0 w-8 h-8 rounded-full ${
                                currentStep === i ? "bg-green-500" : "bg-gray-200"
                              } flex items-center justify-center mr-3 mt-1`}
                            >
                              {currentStep === i && (
                                <Check className="text-white" size={20} />
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium text-green-600 mb-1">{step.title}</h4>
                              <p className="text-gray-600 text-sm">{step.detail}</p>
                            </div>
                          </div>
                          <div className="relative h-40 rounded-lg overflow-hidden">
                            <img
                              src={step.image}
                              alt={step.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* EcoRecycle Guide Section - Added from eco-recycle-main */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 sm:mt-12"
        >
          <div className="text-center mb-6 sm:mb-8 relative">
            {/* Decorative floating icons */}
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-1/4 -top-2 text-green-400 opacity-60 hidden sm:block"
            >
              <Recycle className="w-6 h-6 sm:w-8 sm:h-8" />
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute right-1/4 -top-2 text-blue-400 opacity-60 hidden sm:block"
            >
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8" />
            </motion.div>

            {/* Main title with gradient */}
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold mb-2 sm:mb-3 bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                Panduan Daur Ulang
              </h2>
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="inline-block px-3 sm:px-4 py-0.5 sm:py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs sm:text-sm font-semibold rounded-full shadow-lg mb-3 sm:mb-4"
              >
                ZeroSampah
              </motion.span>
            </motion.div>

            {/* Subtitle with icons */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-base sm:text-xl md:text-2xl font-medium flex items-center justify-center gap-2"
            >
              <Recycle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Pelajari cara mendaur ulang dengan benar
              </span>
              <Recycle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
            </motion.p>

            {/* Decorative underline */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-3 sm:mt-4 mx-auto w-20 sm:w-32 h-1 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 rounded-full"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {Object.entries(recyclingItems).map(([key, item], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 40, rotateX: -10 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                whileHover={{ 
                  y: -12, 
                  scale: 1.05,
                  rotateY: 2,
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.5, delay: index * 0.15, ease: "easeOut" }}
                className={`group relative bg-gradient-to-br from-white via-white to-green-50/50 rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 ${
                  expandedItem === key 
                    ? 'ring-4 ring-green-400 ring-offset-4 shadow-[0_20px_50px_rgba(34,197,94,0.3)]' 
                    : 'shadow-[0_10px_40px_rgba(0,0,0,0.1)] hover:shadow-[0_25px_60px_rgba(34,197,94,0.25)]'
                }`}
                style={{ transformStyle: 'preserve-3d' }}
                onClick={() => handleCardClick(key)}
              >
                {/* Animated background glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
                
                {/* Image section with parallax effect */}
                <div className="relative h-32 sm:h-48 overflow-hidden">
                  <motion.img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.15 }}
                    transition={{ duration: 0.6 }}
                  />
                  
                  {/* Multi-layer gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Floating category badge */}
                  <motion.div 
                    className="absolute top-2 sm:top-4 left-2 sm:left-4"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.15 + 0.3 }}
                  >
                    <span className="px-2 sm:px-4 py-1 sm:py-1.5 bg-white/95 backdrop-blur-md text-green-600 text-[10px] sm:text-xs font-bold rounded-full shadow-lg border border-green-100 flex items-center gap-1 sm:gap-1.5">
                      <Recycle className="w-2 h-2 sm:w-3 sm:h-3" />
                      Daur Ulang
                    </span>
                  </motion.div>
                  
                  {/* Animated corner accent */}
                  <div className="absolute top-0 right-0 w-12 sm:w-20 h-12 sm:h-20 bg-gradient-to-bl from-green-400/30 to-transparent" />
                  
                  {/* Title overlay with glass effect */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5 bg-gradient-to-t from-black/80 to-transparent">
                    <motion.h3 
                      className="text-lg sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight"
                      style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
                    >
                      {item.name}
                    </motion.h3>
                  </div>
                </div>
                
                {/* Content section with premium styling */}
                <div className="relative p-4 sm:p-6">
                  {/* Decorative top border */}
                  <div className="absolute top-0 left-4 sm:left-6 right-4 sm:right-6 h-px bg-gradient-to-r from-transparent via-green-300 to-transparent" />
                  
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 group-hover:from-green-200 group-hover:to-emerald-200 transition-colors duration-300">
                        <Recycle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                      </div>
                      <span className="text-[10px] sm:text-sm font-bold bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                        Panduan Lengkap
                      </span>
                    </div>
                    <motion.div
                      animate={{ 
                        rotate: expandedItem === key ? 180 : 0,
                        scale: expandedItem === key ? 1.1 : 1
                      }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 group-hover:from-green-400 group-hover:to-emerald-400 group-hover:text-white transition-all duration-300 shadow-sm"
                    >
                      <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 group-hover:text-white transition-colors" />
                    </motion.div>
                  </div>
                  
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2 sm:line-clamp-3 mb-3 sm:mb-4">
                    {item.description}
                  </p>
                  
                  {/* Interactive hint with animation */}
                  <motion.div 
                    className="hidden sm:flex items-center justify-between pt-3 sm:pt-4 border-t border-green-100"
                    initial={{ opacity: 0.5 }}
                    whileHover={{ opacity: 1 }}
                  >
                    <div className="flex items-center gap-2 text-[10px] sm:text-xs font-semibold text-green-600">
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="flex items-center gap-1"
                      >
                        <span>Lihat Detail</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </motion.div>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(4)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-green-300"
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
                        />
                      ))}
                    </div>
                  </motion.div>
                </div>
                
                {/* Premium bottom accent bar */}
                <div className="h-1.5 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-400 group-hover:h-2 transition-all duration-300" />
              </motion.div>
            ))}
          </div>

          {/* Expandable Content - Full Width Below All Cards */}
          <AnimatePresence>
            {expandedItem && (
              <motion.div
                ref={expandedContentRef}
                initial={{ opacity: 0, height: 0, y: 20 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: 20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="overflow-hidden mt-4 sm:mt-8"
              >
                <div className="relative bg-gradient-to-br from-white via-white to-green-50/30 rounded-xl sm:rounded-3xl shadow-lg sm:shadow-[0_20px_60px_rgba(0,0,0,0.1)] overflow-hidden">
                  {/* Decorative background elements */}
                  <div className="absolute top-0 right-0 w-48 sm:w-96 h-48 sm:h-96 bg-gradient-to-bl from-green-100/50 to-transparent rounded-full blur-3xl hidden sm:block" />
                  <div className="absolute bottom-0 left-0 w-32 sm:w-64 h-32 sm:h-64 bg-gradient-to-tr from-blue-100/50 to-transparent rounded-full blur-3xl hidden sm:block" />
                  
                  {/* Top gradient bar */}
                  <div className="h-1 sm:h-2 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-400" />
                  
                  <div className="relative p-4 sm:p-8 md:p-10">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4 sm:mb-8">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex-1 min-w-0"
                      >
                        <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                          <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg">
                            <Recycle className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                          </div>
                          <span className="px-2 sm:px-4 py-1 sm:py-1.5 bg-green-100 text-green-600 text-xs sm:text-sm font-bold rounded-full">
                            Panduan Lengkap
                          </span>
                        </div>
                        <h3 className="text-lg sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent leading-tight">
                          Cara Daur Ulang: {recyclingItems[expandedItem as keyof typeof recyclingItems].name}
                        </h3>
                      </motion.div>
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setExpandedItem(null)}
                        className="p-2 sm:p-3 bg-gradient-to-br from-gray-100 to-gray-200 hover:from-red-100 hover:to-red-200 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg group flex-shrink-0 ml-2"
                      >
                        <X className="w-4 h-4 sm:w-6 sm:h-6 text-gray-500 group-hover:text-red-500 transition-colors" />
                      </motion.button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-10">
                      {/* Environmental Impact */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="relative group"
                      >
                        <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 hidden sm:block" />
                        <div className="relative bg-gradient-to-br from-green-50 via-green-50 to-emerald-100/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-100 shadow-md sm:shadow-lg hover:shadow-xl transition-all duration-300">
                          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                            <div className="p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 shadow-md">
                              <Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <h4 className="text-base sm:text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                              Dampak Lingkungan
                            </h4>
                          </div>
                          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                            {recyclingItems[expandedItem as keyof typeof recyclingItems].impact}
                          </p>
                          <div className="mt-3 sm:mt-4 flex items-center gap-2 text-xs sm:text-sm text-green-600 font-medium">
                            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>Kontribusi positif untuk bumi</span>
                          </div>
                        </div>
                      </motion.div>

                      {/* Tips */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="relative group"
                      >
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 hidden sm:block" />
                        <div className="relative bg-gradient-to-br from-blue-50 via-blue-50 to-cyan-100/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-100 shadow-md sm:shadow-lg hover:shadow-xl transition-all duration-300">
                          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                            <div className="p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 shadow-md">
                              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <h4 className="text-base sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                              Tips Berguna
                            </h4>
                          </div>
                          <ul className="space-y-2 sm:space-y-3">
                            {recyclingItems[expandedItem as keyof typeof recyclingItems].tips.map((tip, i) => (
                              <motion.li 
                                key={i} 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + i * 0.1 }}
                                className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700 group/item"
                              >
                                <div className="flex-shrink-0 p-0.5 sm:p-1 rounded-md sm:rounded-lg bg-gradient-to-br from-blue-400 to-cyan-400 shadow-sm group-hover/item:scale-110 transition-transform">
                                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                </div>
                                <span className="leading-relaxed">{tip}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    </div>

                    {/* Steps */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                        <div className="p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-400 to-teal-500 shadow-md">
                          <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <h4 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                          Langkah-langkah Daur Ulang
                        </h4>
                        <div className="flex-1 h-px bg-gradient-to-r from-green-200 to-transparent hidden sm:block" />
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-3 sm:gap-6">
                        {recyclingItems[expandedItem as keyof typeof recyclingItems].steps.map((step, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -30 }}
                            animate={{
                              opacity: 1,
                              x: 0,
                              scale: currentStep === i ? 1 : 0.98,
                            }}
                            transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                            className={`group relative rounded-2xl overflow-hidden transition-all duration-500 ${
                              currentStep === i 
                                ? 'bg-gradient-to-br from-green-50 to-emerald-100/50 shadow-[0_10px_40px_rgba(34,197,94,0.2)] ring-2 ring-green-400 ring-offset-2' 
                                : 'bg-gradient-to-br from-gray-50 to-gray-100/50 shadow-lg hover:shadow-xl'
                            }`}
                          >
                            {/* Step indicator bar */}
                            <div className={`h-0.5 sm:h-1 transition-all duration-500 ${
                              currentStep === i 
                                ? 'bg-gradient-to-r from-green-400 via-emerald-500 to-teal-400' 
                                : 'bg-gradient-to-r from-gray-200 to-gray-300'
                            }`} />
                            
                            <div className="p-3 sm:p-5">
                              <div className="flex gap-3 sm:gap-4">
                                {/* Step number/check */}
                                <motion.div
                                  animate={{
                                    scale: currentStep === i ? [1, 1.2, 1] : 1,
                                  }}
                                  transition={{ duration: 0.5 }}
                                  className={`flex-shrink-0 w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center font-bold text-sm sm:text-lg shadow-md sm:shadow-lg transition-all duration-500 ${
                                    currentStep === i
                                      ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white'
                                      : 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-600'
                                  }`}
                                >
                                  {currentStep === i ? (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ type: "spring", stiffness: 500 }}
                                    >
                                      <Check className="w-4 h-4 sm:w-6 sm:h-6" />
                                    </motion.div>
                                  ) : (
                                    <span>{i + 1}</span>
                                  )}
                                </motion.div>
                                
                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                  <h5 className={`font-bold text-sm sm:text-lg mb-1 sm:mb-2 transition-colors duration-300 ${
                                    currentStep === i 
                                      ? 'bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent' 
                                      : 'text-gray-800'
                                  }`}>
                                    {step.title}
                                  </h5>
                                  <p className={`text-xs sm:text-sm leading-relaxed mb-2 sm:mb-4 transition-colors duration-300 ${
                                    currentStep === i ? 'text-gray-700' : 'text-gray-500'
                                  }`}>
                                    {step.detail}
                                  </p>
                                  
                                  {/* Image with overlay */}
                                  <div className={`relative w-full h-24 sm:h-36 rounded-lg sm:rounded-xl overflow-hidden transition-all duration-500 ${
                                    currentStep === i 
                                      ? 'ring-2 sm:ring-3 ring-green-400 shadow-md sm:shadow-lg' 
                                      : 'ring-1 ring-gray-200'
                                  }`}>
                                    <img
                                      src={step.image}
                                      alt={step.title}
                                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className={`absolute inset-0 transition-opacity duration-300 ${
                                      currentStep === i 
                                        ? 'bg-gradient-to-t from-green-500/20 to-transparent' 
                                        : 'bg-gradient-to-t from-gray-500/10 to-transparent'
                                    }`} />
                                    
                                    {/* Active indicator */}
                                    {currentStep === i && (
                                      <motion.div
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="absolute top-1 right-1 sm:top-2 sm:right-2 px-2 sm:px-3 py-0.5 sm:py-1 bg-green-500 text-white text-[10px] sm:text-xs font-bold rounded-full shadow-lg flex items-center gap-1"
                                      >
                                        <motion.div
                                          animate={{ scale: [1, 1.3, 1] }}
                                          transition={{ duration: 1, repeat: Infinity }}
                                          className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"
                                        />
                                        Aktif
                                      </motion.div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Bottom gradient bar */}
                  <div className="h-1 sm:h-2 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-400" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

// Baris 1: "use client" - Menandakan ini adalah Client Component di Next.js (bukan Server Component)

// Baris 3: Import React hooks untuk state management dan side effects
// Baris 4: Import Framer Motion untuk animasi
// Baris 5-27: Import icon-icon dari lucide-react untuk UI
// Baris 29: Import useRouter dari Next.js untuk navigasi
// Baris 30: Import Link dari Next.js untuk navigasi tanpa reload
// Baris 31: Import tipe Report dari lib/types
// Baris 32: Import useUser dari Clerk untuk autentikasi
// Baris 33-37: Import animasi Lottie (daun jatuh untuk dekorasi)

// Baris 40: Konstanta CACHE_EXPIRATION = 5 menit untuk cache localStorage

// Baris 42-105: Object recyclingItems berisi data panduan daur ulang untuk 4 kategori:
//               - plastic: Panduan daur ulang plastik
//               - electronics: Panduan daur ulang elektronik  
//               - paper: Panduan daur ulang kertas
//               - organic: Panduan daur ulang organik
//               Setiap kategori punya: name, image, description, steps (langkah-langkah), impact, tips
// Baris 107-111: Interface UserData untuk data user:
//                - name: nama user
//                - email: email user
//                - id: clerk ID user

// Baris 113-118: Interface UserStats untuk statistik user dari DATABASE:
//                - points: total poin user
//                - reportsCount: jumlah laporan yang dibuat
//                - rank: peringkat (Elite, Eco Master, dll)
//                - impact: dampak lingkungan (Positif, Signifikan, dll)
// Baris 122-124: Destructuring useUser dari Clerk untuk cek status login
// Baris 125: useRouter untuk navigasi programmatic
// Baris 126: State userData untuk menyimpan data user
// Baris 127-132: State userStats dengan DEFAULT VALUES:
//                ⚠️ MASALAH ADA DI SINI! Default rank="Elite" dan impact="Positif"
//                Ini HARDCODED values yang muncul di dashboard Anda!
// Baris 133: State recentReports untuk list laporan terbaru
// Baris 134: State isLoading untuk loading indicator
// Baris 135: State isRefreshing untuk refresh button
// Baris 136-138: State untuk modal detail recycling
// Baris 139: Ref untuk auto-scroll ke expanded content

// Baris 142-153: Function handleCardClick untuk handle klik card recycling guide dengan auto-scroll

// Baris 155-166: useEffect untuk auto-cycle through steps di recycling guide setiap 2 detik

// Baris 168-175: useEffect lain untuk auto-cycle di modal dengan interval 5 detik
// Baris 178-199: useEffect untuk load userData dari localStorage (BUKAN dari database!)
//                Baris 179-180: Cek kalau di client-side (browser)
//                Baris 181-183: Ambil userData dari localStorage
//                Baris 184-197: Jika tidak ada di localStorage tapi ada user dari Clerk:
//                               - Buat userData baru dari Clerk data
//                               - Simpan ke localStorage (dengan try-catch untuk handle quota errors)
// Baris 202-207: useEffect untuk redirect user yang tidak login ke homepage
//                Menggunakan isLoaded dan isSignedIn dari Clerk
// Baris 209: Deklarasi async function fetchRecentReports dengan parameter forceRefresh
// Baris 210-212: Try block dan set isLoading = true

// Baris 214-221: Cek cache di localStorage:
//                - Ambil cachedData dan cacheTimestamp
//                - Hitung apakah cache masih valid (< 5 menit)

// Baris 223-234: ⭐ FETCH USER STATS DARI DATABASE API!
//                Baris 225: Fetch ke endpoint `/api/users/${user.id}/stats`
//                Baris 226-233: Jika berhasil, UPDATE userStats state dengan data dari API:
//                               - points dari database
//                               - reportsCount dari database  
//                               - rank dari database
//                               - impact dari database
//                ⚠️ INI HARUSNYA OVERRIDE default values "Elite" dan "Positif"!

// Baris 236-245: Jika ada cache valid dan tidak force refresh, gunakan cache

// Baris 247-263: ⭐ FETCH REPORTS DARI DATABASE API!
//                Baris 248: Fetch ke endpoint `/api/reports?limit=5`
//                Baris 249: Parse response JSON
//                Baris 251-256: Format reports (convert null imageUrl ke undefined)
//                Baris 258-263: Simpan ke localStorage cache (dengan try-catch)
//                Baris 265: Set recentReports state

// Baris 267-272: Catch error dan finally block
// Baris 274-279: useEffect untuk load data saat pertama kali komponen di-render
//                Memanggil fetchRecentReports() jika user sudah login
// Baris 281-285: Function handleRefresh untuk manual refresh data
//                Set isRefreshing = true dan panggil fetchRecentReports(true)
// Baris 287-297: Jika Clerk belum selesai load auth, tampilkan loading spinner

// Baris 299-302: Jika user tidak login, return null (akan di-redirect)

// Baris 304-305: Fallback name jika userData tidak ada, ambil dari Clerk
// Baris 307-336: Array stats untuk 4 card statistik:
//                1. Total Poin - value: userStats.points (dari database!)
//                2. Laporan Dikirim - value: userStats.reportsCount (dari database!)
//                3. Peringkat - value: userStats.rank === "Eco Warrior" ? "Elite" : userStats.rank
//                   ⚠️ MASALAH: Ada ternary yang convert "Eco Warrior" jadi "Elite"!
//                4. Dampak Lingkungan - value: userStats.impact === "Positive" ? "Positif" : userStats.impact
//                   ⚠️ Ada ternary yang convert "Positive" jadi "Positif" (Bahasa Indonesia)