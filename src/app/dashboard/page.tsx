"use client";

import { useState, useEffect } from "react";
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
  Check
} from "lucide-react";
// Use server API endpoint for recent reports
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Report } from "@/lib/types";
import { useUser } from "@clerk/nextjs";

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
    rank: "Eco Warrior",
    impact: "Positive"
  });
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedRecycleItem, setSelectedRecycleItem] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

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
        localStorage.setItem("userData", JSON.stringify(newUserData));
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
      const cachedData = localStorage.getItem("recentReports");
      const cacheTimestamp = localStorage.getItem("recentReportsTimestamp");
      
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
        const parsedReports = JSON.parse(cachedData);
        setRecentReports(parsedReports);
        setIsLoading(false);
        return;
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
      localStorage.setItem("recentReports", JSON.stringify(formattedReports));
      localStorage.setItem("recentReportsTimestamp", now.toString());
      
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
      gradient: "from-blue-500 via-cyan-500 to-blue-600",
      iconBg: "bg-gradient-to-br from-blue-400 to-blue-600",
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
      gradient: "from-green-500 via-emerald-500 to-green-600",
      iconBg: "bg-gradient-to-br from-green-400 to-green-600",
      description: "Jejak lingkungan positif Anda"
    },
  ];

  return (
    <div className="pt-12 pb-20 min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg"
          >
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">
                  {("Selamat datang kembali, " + userName).split("").map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03, duration: 0.3 }}
                      style={{ display: 'inline-block' }}
                    >
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  ))}
                </h1>
                <p className="mt-2 text-lg">
                  Lacak dampak lingkungan dan kemajuan pengelolaan sampah Anda
                </p>
              </div>
              <Link 
                href="/report"
                className="flex gap-2 items-center px-6 py-3 font-semibold text-green-600 bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                <span>Laporan Baru</span>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ 
                y: -8, 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              className="group relative overflow-hidden p-6 bg-white rounded-2xl border border-gray-100 shadow-lg transition-all duration-300 hover:shadow-2xl"
            >
              {/* Animated background gradient */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.5, opacity: 0.05 }}
                transition={{ duration: 0.5 }}
              />
              
              {/* Content */}
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <motion.div 
                    className={`p-3 rounded-xl ${stat.iconBg} shadow-md`}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <div className="text-right">
                    <span className={`text-xs font-semibold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                      {stat.title}
                    </span>
                  </div>
                </div>
                
                <motion.p 
                  className="mb-2 text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  {stat.value}
                </motion.p>
                
                <p className="text-sm text-gray-600 leading-relaxed">
                  {stat.description}
                </p>
                
                {/* Decorative corner accent */}
                <motion.div
                  className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-gradient-to-br ${stat.gradient} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-300`}
                  animate={{ 
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Activity and Progress Section */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 bg-white rounded-2xl border border-gray-100 shadow-lg"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Aktivitas Terbaru
              </h2>
              <div className="flex gap-4 items-center">
                <button 
                  onClick={handleRefresh}
                  className="flex gap-1 items-center text-sm font-medium text-green-600 hover:text-green-700"
                  disabled={isRefreshing}
                >
                  {isRefreshing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  <span>Segarkan</span>
                </button>
                <Link 
                  href="/reports"
                  className="flex gap-1 items-center text-sm font-medium text-green-600 hover:text-green-700"
                >
                  Lihat Semua
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
                </div>
              ) : recentReports.length > 0 ? (
                recentReports.map((report, index) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center p-4 bg-gray-50 rounded-xl transition-colors duration-300 hover:bg-gray-100"
                  >
                    <div className="flex-shrink-0">
                      <MapPin className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="flex-1 ml-4">
                      <p className="text-sm font-medium text-gray-900">
                        {report.wasteType}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(report.createdAt || new Date()).toLocaleDateString()}
                      </p>
                    </div>
                      <a 
                      href={report.location}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex gap-1 items-center text-sm text-green-600 hover:text-green-700 hover:underline"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>Lihat Lokasi</span>
                    </a>
                  </motion.div>
                ))
              ) : (
                <div className="py-8 text-center">
                  <Package className="mx-auto mb-4 w-12 h-12 text-gray-400" />
                  <p className="text-gray-500">
                    Tidak ada aktivitas terbaru untuk ditampilkan
                  </p>
                  <Link 
                    href="/report"
                    className="inline-flex gap-2 items-center mt-4 text-sm font-medium text-green-600 hover:text-green-700"
                  >
                    Buat laporan pertama Anda
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          </motion.div>

          {/* Environmental Impact */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 bg-white rounded-2xl border border-gray-100 shadow-lg"
          >
            <h2 className="mb-6 text-xl font-semibold text-gray-900">
              Dampak Lingkungan
            </h2>
            <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-center p-4 bg-green-50 rounded-xl transition-colors duration-300 hover:bg-green-100"
              >
                <div className="flex items-center">
                  <Package className="mr-3 w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-900">
                    Sampah Terkumpul
                  </span>
                </div>
                <span className="text-sm font-semibold text-green-600">
                  {userStats.reportsCount * 5}kg
                </span>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex justify-between items-center p-4 bg-blue-50 rounded-xl transition-colors duration-300 hover:bg-blue-100"
              >
                <div className="flex items-center">
                  <BarChart className="mr-3 w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium text-gray-900">
                    Offset Karbon
                  </span>
                </div>
                <span className="text-sm font-semibold text-blue-600">
                  {userStats.reportsCount * 2.5}kg
                </span>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex justify-between items-center p-4 bg-purple-50 rounded-xl transition-colors duration-300 hover:bg-purple-100"
              >
                <div className="flex items-center">
                  <Calendar className="mr-3 w-5 h-5 text-purple-500" />
                  <span className="text-sm font-medium text-gray-900">
                    Hari Aktif
                  </span>
                </div>
                <span className="text-sm font-semibold text-purple-600">
                  {Math.ceil(userStats.reportsCount * 1.5)}
                </span>
              </motion.div>
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
          className="mt-12"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-green-600 mb-2">Panduan Daur Ulang ZeroSampah</h2>
            <p className="text-xl text-blue-600">Pelajari cara mendaur ulang dengan benar</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(recyclingItems).map(([key, item], idx) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className={`bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transition-all ${
                  expandedItem === key ? 'ring-2 ring-green-500' : ''
                }`}
                onClick={() => setExpandedItem(expandedItem === key ? null : key)}
              >
                <div className="relative h-40">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-green-600">
                      {item.name}
                    </h3>
                    <motion.div
                      animate={{ rotate: expandedItem === key ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-5 h-5 text-green-600" />
                    </motion.div>
                  </div>
                  <p className="text-sm text-gray-600 min-h-[45px]">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Expandable Content - Full Width Below All Cards */}
          <AnimatePresence>
            {expandedItem && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden mt-6"
              >
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-green-600">
                      Cara Daur Ulang: {recyclingItems[expandedItem as keyof typeof recyclingItems].name}
                    </h3>
                    <button
                      onClick={() => setExpandedItem(null)}
                      className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                      <X className="w-6 h-6 text-gray-600" />
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    {/* Environmental Impact */}
                    <div className="bg-green-50 rounded-lg p-6">
                      <h4 className="text-xl font-semibold text-green-600 mb-3">
                        Dampak Lingkungan
                      </h4>
                      <p className="text-gray-700 mb-4">
                        {recyclingItems[expandedItem as keyof typeof recyclingItems].impact}
                      </p>
                    </div>

                    {/* Tips */}
                    <div className="bg-blue-50 rounded-lg p-6">
                      <h4 className="text-xl font-semibold text-blue-600 mb-3">
                        Tips Berguna:
                      </h4>
                      <ul className="space-y-2">
                        {recyclingItems[expandedItem as keyof typeof recyclingItems].tips.map((tip, i) => (
                          <li key={i} className="flex items-start text-gray-700">
                            <Check className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Steps */}
                  <div>
                    <h4 className="text-xl font-semibold text-green-600 mb-6">
                      Langkah-langkah Daur Ulang:
                    </h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      {recyclingItems[expandedItem as keyof typeof recyclingItems].steps.map((step, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -50 }}
                          animate={{
                            opacity: currentStep === i ? 1 : 0.6,
                            x: 0,
                            scale: currentStep === i ? 1 : 0.95,
                          }}
                          transition={{ duration: 0.5 }}
                          className={`flex gap-4 rounded-lg p-4 transition-all duration-300 ${
                            currentStep === i ? 'bg-green-50' : 'bg-gray-50'
                          }`}
                        >
                          <div
                            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                              currentStep === i
                                ? 'bg-green-500 text-white scale-110'
                                : 'bg-gray-300 text-gray-600'
                            }`}
                          >
                            {currentStep === i ? (
                              <Check className="w-6 h-6" />
                            ) : (
                              <span>{i + 1}</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <h5 className={`font-semibold mb-2 transition-colors duration-300 ${
                              currentStep === i ? 'text-green-600' : 'text-gray-900'
                            }`}>
                              {step.title}
                            </h5>
                            <p className={`text-sm mb-3 transition-colors duration-300 ${
                              currentStep === i ? 'text-gray-700' : 'text-gray-500'
                            }`}>
                              {step.detail}
                            </p>
                            <div className={`w-full h-32 rounded-lg overflow-hidden transition-all duration-300 ${
                              currentStep === i ? 'ring-2 ring-green-500' : ''
                            }`}>
                              <img
                                src={step.image}
                                alt={step.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
