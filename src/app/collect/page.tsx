"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Trash2,
  MapPin,
  CheckCircle,
  Clock,
  Upload,
  Calendar,
  Weight,
  Search,
} from "lucide-react";
import { toast } from "react-hot-toast";
// Use server API endpoints instead of importing server DB actions in client bundles
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import Image from "next/image";
import Lottie from "lottie-react";
import litterAnimation from "@/../Litter.json";
import fallenLeaf from "../../../public/animations/fallen-leaf.json";
import fallenLeaf1 from "../../../public/animations/fallen-leaf-1.json";
import fallenLeaf2 from "../../../public/animations/fallen-leaf-2.json";
import fallenLeaf3 from "../../../public/animations/fallen-leaf-3.json";

// Use secure server-side proxy endpoint for Gemini API instead of exposing the key in client bundles

const ITEMS_PER_PAGE = 5;

interface Task {
  id: number;
  userId: string;
  location: string;
  wasteType: string;
  amount: string;
  status: string;
  collectorId: string | null;
  verificationResult: CollectedWaste | null;
  imageUrl: string | null;
  createdAt: Date;
  date?: string;
}

interface VerificationDetails {
  sameLocation: boolean;
  firstImageHasWaste: boolean;
  cleanupStatus: string;
  wasteType: string;
  comments: string;
}

interface CollectedWaste {
  id: number;
  status: string;
  collectorId: string;
  reportId: number;
  collectionDate: Date;
  comment: string | null;
}

interface User {
  id: string;
  clerkId: string;
  name: string;
  email: string;
}

interface FetchedTask {
  id: number;
  userId: string;
  location: string;
  wasteType: string;
  amount: string;
  status: string;
  collectorId: string | null;
  verificationResult: unknown;
  imageUrl: string | null;
  date: string;
}

export default function CollectPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hoveredWasteType, setHoveredWasteType] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "verifying" | "success" | "failure">("idle");
  const [verificationResult, setVerificationResult] = useState<CollectedWaste | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [verificationDetails, setVerificationDetails] = useState<VerificationDetails | null>(null);

  const getDaysAgo = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const isToday = now.toDateString() === date.toDateString();
    if (isToday) {
      return "Hari ini";
    }
    return diffDays;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (e.target.files && e.target.files[0]) {
        const selectedFile = e.target.files[0];
        if (!selectedFile.type.startsWith("image/")) {
          toast.error("Silakan unggah file gambar");
          return;
        }
        if (selectedFile.size > 10 * 1024 * 1024) {
          toast.error("Ukuran file harus kurang dari 10MB");
          return;
        }
        setFile(selectedFile);
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target?.result as string);
        };
        reader.onerror = () => {
          toast.error("Error reading file");
        };
        reader.readAsDataURL(selectedFile);
      }
    } catch (error) {
      console.error("Error handling file:", error);
      toast.error("Error processing file. Please try again.");
    }
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const extractBase64Data = (dataUrl: string | null) => {
    if (!dataUrl) return null;
    const [meta, base64] = dataUrl.split(",");
    const mimeType = meta.match(/data:(.*);base64/)?.[1] || "image/jpeg";
    return { base64, mimeType };
  };

  const filteredTasks = tasks
    .filter((task) =>
      task.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

  const pageCount = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);

  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/tasks');
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const fetchedTasks = await res.json();
        
        if (!Array.isArray(fetchedTasks)) {
          throw new Error('Invalid response format');
        }
        
        const mappedTasks = fetchedTasks.map((task: FetchedTask) => ({
          id: task.id,
          userId: task.userId,
          location: task.location,
          wasteType: task.wasteType,
          amount: task.amount,
          status: task.status,
          collectorId: task.collectorId || null,
          verificationResult: task.verificationResult as CollectedWaste | null,
          imageUrl: task.imageUrl,
          createdAt: new Date(task.date),
        }));
        setTasks(mappedTasks);
      } catch (error: unknown) {
        toast.error("Failed to load tasks. Please refresh the page.");
        setTasks([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUser(parsedUserData);
    }
    fetchTasks();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleVerify = async () => {
    if (!file || !selectedTask) {
      toast.error("Silakan unggah gambar verifikasi.");
      return;
    }

    setVerificationStatus("verifying");
    setVerificationDetails(null);

    try {
      const base64Data = await readFileAsBase64(file);
      const imageData2 = base64Data.split(",")[1];
      const imageData1 = extractBase64Data(selectedTask.imageUrl)?.base64;
        const response = await fetch(`/api/gemini`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are an expert in waste management and environmental analysis. Analyze the two images below.

  Instructions:
  - Determine if both images are from the same place.
  - If yes, compare the state of the location:
    - Was there waste in the first image?
    - Has the waste been cleaned in the second image?
    - Briefly describe the type of waste and the cleanup status.

  Return a JSON object in this format:
  {
    "sameLocation": true or false,
    "firstImageHasWaste": true or false,
    "cleanupStatus": "fully_cleaned" or "partially_cleaned" or "not_cleaned",
    "wasteType": "plastic" or "mixed" or etc,
    "comments": "Short paragraph summarizing your findings"
  }

  IMPORTANT: Use underscore format for cleanupStatus (fully_cleaned, partially_cleaned, not_cleaned).
  Return ONLY the JSON object, no other text or explanation.`,
                  },
                  {
                    inline_data: {
                      mime_type: file.type,
                      data: imageData1,
                    },
                  },
                  {
                    inline_data: {
                      mime_type: file.type,
                      data: imageData2,
                    },
                  },
                ],
              },
            ],
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || "Unknown API error");
      }

      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      const jsonMatch = text?.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? jsonMatch[0] : null;

      if (jsonText) {
        const parsedResult = JSON.parse(jsonText) as VerificationDetails;
        setVerificationDetails(parsedResult);

        const {
          sameLocation,
          firstImageHasWaste,
          cleanupStatus,
          comments,
        } = parsedResult;

        // Normalize cleanupStatus - accept both "fully cleaned" and "fully_cleaned"
        const isFullyCleaned = 
          cleanupStatus === "fully_cleaned" || 
          cleanupStatus === "fully cleaned" ||
          (typeof cleanupStatus === 'string' && cleanupStatus.toLowerCase().replace(/\s+/g, '_') === 'fully_cleaned');

        console.log('Verification Details:', { sameLocation, firstImageHasWaste, cleanupStatus, isFullyCleaned });

        if (sameLocation && firstImageHasWaste && isFullyCleaned) {
          if (!user?.clerkId) {
            toast.error("User not authenticated");
            return;
          }

          const colRes = await fetch('/api/collections', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reportId: selectedTask.id, collectorId: user.clerkId, comments }),
          });
          const collectedWaste = await colRes.json();

          if (collectedWaste) {
            const patchRes = await fetch(`/api/reports/${selectedTask.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'verified', collectorId: user.clerkId }),
            });
            const updatedReport = await patchRes.json();

            if (updatedReport) {
              await fetch('/api/rewards/points', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.clerkId, pointsToAdd: 50 }),
              });

              await fetch('/api/notifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.clerkId, message: `Anda mendapatkan 50 poin karena berhasil mengumpulkan sampah di ${selectedTask.location}!`, type: 'reward' }),
              });

              setVerificationStatus("success");
              setVerificationResult(collectedWaste);
              toast.success("Pengumpulan berhasil diverifikasi! Anda mendapatkan 50 poin!");

              setTasks((prevTasks) =>
                prevTasks.map((task) =>
                  task.id === selectedTask.id
                    ? {
                        ...task,
                        status: "verified",
                        collectorId: user.clerkId || null,
                        verificationResult: collectedWaste,
                      }
                    : task
                )
              );
            } else {
              setVerificationStatus("failure");
              toast.error("Gagal memperbarui status laporan. Silakan coba lagi.");
            }
          } else {
            setVerificationStatus("failure");
            toast.error("Gagal memverifikasi pengumpulan. Silakan coba lagi.");
          }
        } else {
          setVerificationStatus("failure");
          toast.error(
            "Verifikasi gagal. Gambar tidak cocok atau sampah belum sepenuhnya dibersihkan."
          );
        }
      } else {
        throw new Error("Could not parse response JSON");
      }
    } catch (error) {
      console.error("Error during verification:", error);
      toast.error("Gagal memverifikasi pengumpulan. Silakan coba lagi.");
      setVerificationStatus("failure");
    }
  };

  const handleViewDetails = (taskId: string) => {
    router.push(`/viewReport/${taskId}`);
  };

  const handleStartCollection = (taskId: string) => {
    const target = tasks.find((task) => task.id?.toString() === taskId) || null;
    setSelectedTask(target);
    // Optimistically mark as in_progress and assign collector
    if (target && user?.clerkId) {
      fetch(`/api/reports/${target.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'in_progress', collectorId: user.clerkId }),
      })
        .then(res => res.ok ? res.json() : null)
        .then((updated) => {
          if (updated) {
            setTasks(prev => prev.map(t => t.id === target.id ? { ...t, status: 'in_progress', collectorId: user.clerkId } : t));
          }
        })
        .catch(() => {/* non-blocking */});
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-emerald-50">
      {/* Decorative Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-green-200/30 to-emerald-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-gradient-to-br from-lime-200/20 to-green-200/30 rounded-full blur-3xl" />
      </div>

      <div className="relative p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-5xl">
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden p-8 md:p-10 mb-10 text-white bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 rounded-3xl shadow-2xl shadow-green-500/25"
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
            
            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="flex items-center gap-5 md:gap-8">
                {/* Lottie Animation Logo */}
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 md:w-28 md:h-28 flex-shrink-0 bg-white/20 backdrop-blur-md rounded-3xl p-3 shadow-xl shadow-black/10 border border-white/20 overflow-hidden"
                >
                  <Lottie
                    animationData={litterAnimation}
                    loop={true}
                    autoplay={true}
                    style={{ width: '100%', height: '100%' }}
                  />
                </motion.div>
                <div>
                  <motion.h1 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl md:text-4xl font-extrabold mb-2 tracking-tight"
                    style={{ textShadow: '0 2px 20px rgba(0,0,0,0.2)' }}
                  >
                    Tugas Pengumpulan Sampah
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-green-100 text-sm md:text-lg"
                  >
                    Bantu bersihkan lingkungan dengan mengumpulkan sampah
                  </motion.p>
                </div>
              </div>

              {/* Search Bar */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="relative w-full lg:w-96"
              >
                <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Cari berdasarkan area..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-4 pr-5 pl-14 text-base text-gray-900 bg-white/95 backdrop-blur-md rounded-2xl border-2 border-white/50 focus:border-green-300 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-xl placeholder:text-gray-400 transition-all font-medium"
                />
              </motion.div>
            </div>
            
            {/* Bottom gradient line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400/50 via-white/30 to-yellow-400/50" />
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center space-y-4">
                <Loader />
                <p className="text-sm text-gray-500">Memuat tugas...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {paginatedTasks.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-lg border border-gray-200">
                  <Trash2 className="mx-auto w-12 h-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    Tidak ada tugas
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm
                      ? "Tidak ada tugas yang cocok dengan pencarian Anda."
                      : "Tidak ada tugas pengumpulan sampah tersedia."}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {paginatedTasks.map((task) => (
                    <div
                      key={task.id}
                      className="group overflow-hidden bg-white rounded-2xl border-2 border-gray-200 shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-green-300 hover:-translate-y-1"
                    >
                      <div className="p-5 bg-gradient-to-r from-gray-50 to-green-50/30 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <MapPin className="w-5 h-5 text-green-600" />
                            </div>
                            <a
                              href={task.location}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-bold text-green-600 text-base cursor-pointer hover:text-green-700 hover:underline transition-colors"
                            >
                              Lihat Lokasi
                            </a>
                          </div>
                          <span
                            className={`rounded-xl px-4 py-2 text-sm font-bold shadow-md ${
                              task.status === "pending"
                                ? "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300"
                                : task.status === "in_progress"
                                ? "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300"
                                : "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300"
                            }`}
                          >
                            {task.status === "pending"
                              ? "⏳ Menunggu"
                              : task.status === "in_progress"
                              ? "🔄 Sedang Berlangsung"
                              : "✅ Terverifikasi"}
                          </span>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                            <div className="flex-shrink-0 p-2 bg-white rounded-lg shadow-sm">
                              <Trash2 className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium text-gray-500 mb-1">Jenis Sampah</div>
                              <div className="relative">
                                <span
                                  onMouseEnter={() =>
                                    setHoveredWasteType(task.wasteType)
                                  }
                                  onMouseLeave={() => setHoveredWasteType(null)}
                                  className="block text-sm font-bold text-gray-900 cursor-pointer line-clamp-2"
                                  title={task.wasteType}
                                >
                                  {task.wasteType}
                                </span>
                                {hoveredWasteType === task.wasteType && (
                                  <div className="absolute left-0 top-full z-10 p-3 mt-2 text-sm text-white bg-gray-900 rounded-lg shadow-xl whitespace-normal max-w-[250px]">
                                    {task.wasteType}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                            <div className="flex-shrink-0 p-2 bg-white rounded-lg shadow-sm">
                              <Weight className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs font-medium text-gray-500 mb-1">Perkiraan Berat</div>
                              <div className="text-sm font-bold text-gray-900">
                                {task.amount || "N/A"}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                            <div className="flex-shrink-0 p-2 bg-white rounded-lg shadow-sm">
                              <Calendar className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="flex-1">
                              <div className="text-xs font-medium text-gray-500 mb-1">Tanggal Lapor</div>
                              <div className="text-sm font-bold text-gray-900">
                                {task.createdAt
                                  ? task.createdAt.toLocaleDateString('id-ID', {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric'
                                    })
                                  : "No date"}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-5 border-t-2 border-gray-100">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span className="font-medium">
                              {task.createdAt && (
                                <>
                                  {typeof getDaysAgo(task.createdAt) === "string"
                                    ? getDaysAgo(task.createdAt)
                                    : `${getDaysAgo(task.createdAt)} hari yang lalu`}
                                </>
                              )}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                            {task.status === "pending" && (
                              <>
                                <button
                                  onClick={() =>
                                    handleViewDetails(task.id?.toString() || "")
                                  }
                                  className="flex items-center justify-center gap-2 flex-1 sm:flex-initial rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-green-600 border-2 border-green-600 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 cursor-pointer transition-all shadow-sm hover:shadow-md"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                  Lihat Detail
                                </button>
                                <button
                                  onClick={() =>
                                    handleStartCollection(
                                      task.id?.toString() || ""
                                    )
                                  }
                                  className="flex items-center justify-center gap-2 flex-1 sm:flex-initial rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 cursor-pointer transition-all shadow-md hover:shadow-lg"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                  </svg>
                                  Mulai Pengumpulan
                                </button>
                              </>
                            )}
                            {task.status === "in_progress" &&
                              task.collectorId === user?.id && (
                                <button
                                  onClick={() => setSelectedTask(task)}
                                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 cursor-pointer transition-all shadow-md hover:shadow-lg"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  Selesai & Verifikasi
                                </button>
                              )}
                            {task.status === "in_progress" &&
                              task.collectorId !== user?.id && (
                                <div className="flex items-center gap-2 px-4 py-2.5 bg-yellow-50 rounded-xl border border-yellow-200">
                                  <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                  </svg>
                                  <span className="text-sm font-bold text-yellow-800">
                                    Sedang dikerjakan
                                  </span>
                                </div>
                              )}
                            {task.status === "verified" && (
                              <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl border border-green-300 shadow-sm">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <span className="text-sm font-bold text-green-700">
                                  🎁 Hadiah Diterima
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {pageCount > 1 && (
                <div className="flex justify-center items-center mt-8 space-x-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 cursor-pointer hover:bg-green-50 hover:text-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Sebelumnya
                  </button>
                  <span className="text-sm text-gray-700">
                    Halaman {currentPage} dari {pageCount}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, pageCount))
                    }
                    disabled={currentPage === pageCount}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 cursor-pointer hover:bg-green-50 hover:text-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Berikutnya
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

      {selectedTask && (
        <div className="flex fixed inset-0 z-50 justify-center items-center p-4 animate-fadeIn">
          {/* Backdrop */}
          <div className="fixed inset-0 backdrop-blur-sm bg-black/70" />

          {/* Modal Container - Fixed height */}
          <div className="overflow-hidden relative w-full max-w-md bg-white rounded-xl shadow-2xl animate-slideUp">
            {/* Modal Header - Compact */}
            <div className="px-4 py-3 bg-gradient-to-r from-green-50 to-green-100 border-b border-green-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Verifikasi Pengumpulan
                </h3>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="p-1 text-gray-400 rounded-full transition-colors cursor-pointer hover:text-gray-500 hover:bg-gray-100"
                  aria-label="Close modal"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content - Fixed height with scrolling if needed */}
            <div className="p-4 max-h-[50vh] overflow-y-auto">
              {/* Image Comparison Section */}
              <div className="mb-4">
                <h4 className="mb-2 text-sm font-medium text-gray-700">Gambar Asli</h4>
                {selectedTask.imageUrl && (
                  <div className="overflow-hidden mb-4 h-40 rounded-lg border border-gray-200 shadow-sm">
                    <Image
                      src={selectedTask.imageUrl}
                      alt="Original waste"
                      width={400}
                      height={160}
                      className="object-contain w-full h-full"
                    />
                  </div>
                )}
              </div>
              
              {/* Upload Section */}
              <div className="mb-4">
                <label
                  htmlFor="verification-image"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Unggah Foto Verifikasi
                </label>
                <div className="flex justify-center px-4 py-6 rounded-lg border-2 border-gray-300 border-dashed transition-colors hover:border-green-500">
                  <div className="text-center">
                    <Upload className="mx-auto w-8 h-8 text-gray-400" />
                    <div className="mt-2 text-sm text-gray-600">
                      <label
                        htmlFor="verification-image"
                        className="relative font-medium text-green-600 rounded-md cursor-pointer hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-500 focus-within:ring-offset-2"
                      >
                        <span>Unggah file</span>
                        <input
                          id="verification-image"
                          name="verification-image"
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                          accept="image/*"
                        />
                      </label>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      PNG, JPG, GIF hingga 10MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Preview Section - Fixed height */}
              {preview && (
                <div className="mb-4">
                  <h4 className="mb-2 text-sm font-medium text-gray-700">Gambar Verifikasi</h4>
                  <div className="overflow-hidden mb-4 h-40 rounded-lg border border-gray-200 shadow-sm">
                    <Image
                      src={preview}
                      alt="Verification preview"
                      width={400}
                      height={160}
                      className="object-contain w-full h-full"
                    />
                  </div>
                </div>
              )}

              {/* Verification Details */}
              {verificationDetails && (
                <div className="p-3 mb-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="mb-2 text-sm font-medium text-gray-700">Detail Verifikasi</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lokasi Sama:</span>
                      <span className={`font-medium ${verificationDetails.sameLocation ? 'text-green-600' : 'text-red-600'}`}>
                        {verificationDetails.sameLocation ? 'Ya' : 'Tidak'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sampah Ada:</span>
                      <span className={`font-medium ${verificationDetails.firstImageHasWaste ? 'text-green-600' : 'text-red-600'}`}>
                        {verificationDetails.firstImageHasWaste ? 'Ya' : 'Tidak'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status Pembersihan:</span>
                      <span className={`font-medium ${
                        (verificationDetails.cleanupStatus === 'fully_cleaned' || verificationDetails.cleanupStatus === 'fully cleaned')
                          ? 'text-green-600' 
                          : (verificationDetails.cleanupStatus === 'partially_cleaned' || verificationDetails.cleanupStatus === 'partially cleaned')
                            ? 'text-yellow-600'
                            : 'text-red-600'
                      }`}>
                        {verificationDetails.cleanupStatus === 'fully_cleaned' || verificationDetails.cleanupStatus === 'fully cleaned' 
                          ? 'Dibersihkan Sepenuhnya'
                          : verificationDetails.cleanupStatus === 'partially_cleaned' || verificationDetails.cleanupStatus === 'partially cleaned'
                            ? 'Dibersihkan Sebagian'
                            : 'Belum Dibersihkan'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Jenis Sampah:</span>
                      <span className="font-medium text-gray-800">
                        {verificationDetails.wasteType}
                      </span>
                    </div>
                    <div className="pt-2 mt-2 border-t border-gray-200">
                      <p className="text-gray-700">{verificationDetails.comments}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Verification Status Messages */}
              {verificationStatus === "success" && verificationResult && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">
                        Verifikasi Berhasil
                      </h3>
                      <p className="mt-1 text-xs text-green-700">
                        Pengumpulan Anda telah berhasil diverifikasi. Anda mendapatkan hadiah!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {verificationStatus === "failure" && (
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-red-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Verifikasi Gagal
                      </h3>
                      <p className="mt-1 text-xs text-red-700">
                        {verificationDetails 
                          ? "Kriteria verifikasi tidak terpenuhi. Pastikan gambar berasal dari lokasi yang sama dan sampah telah dibersihkan sepenuhnya."
                          : "Silakan coba lagi dengan gambar yang lebih jelas."}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons - Fixed at bottom */}
            <div className="flex justify-end p-4 space-x-3 border-t border-gray-200">
              <button
                onClick={() => {
                  setSelectedTask(null);
                  setVerificationStatus("idle");
                  setVerificationDetails(null);
                  setFile(null);
                  setPreview(null);
                }}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 transition-colors cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                {verificationStatus === "success" || verificationStatus === "failure" ? "Tutup" : "Batal"}
              </button>
              {verificationStatus !== "success" && verificationStatus !== "failure" && (
                <button
                  type="button"
                  onClick={handleVerify}
                  disabled={!file || verificationStatus === "verifying"}
                  className={`flex items-center justify-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-300 ${
                    !file
                      ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                      : "text-white bg-green-600 shadow-sm cursor-pointer hover:bg-green-700"
                  }`}
                >
                      {verificationStatus === "verifying" ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border-b-2 border-white animate-spin"></div>
                      <span>Memverifikasi...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Verifikasi</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}

// Baris 1-2: Import React hooks untuk state management dan side effects
// useState untuk menyimpan state lokal, useEffect untuk operasi setelah component mount

// Baris 3: Import motion dari framer-motion untuk animasi component

// Baris 4-11: Import icon-icon dari lucide-react untuk UI
// Trash2 = ikon tempat sampah, MapPin = ikon lokasi, CheckCircle = ikon centang, dll

// Baris 12: Import toast dari react-hot-toast untuk notifikasi popup

// Baris 14: Import useRouter dari next.js untuk navigasi halaman

// Baris 15: Import component Loader untuk tampilan loading

// Baris 16: Import component Image dari next.js untuk optimasi gambar

// Baris 17: Import Lottie untuk animasi JSON

// Baris 18-22: Import file animasi Lottie dalam format JSON

// Baris 26: Konstanta untuk jumlah item per halaman pagination

// Baris 28-40: Interface TypeScript untuk tipe data Task (tugas pengumpulan sampah)
// Mendefinisikan struktur data seperti id, userId, location, wasteType, dll

// Baris 42-48: Interface untuk VerificationDetails (detail hasil verifikasi AI)
// Menyimpan hasil analisis apakah lokasi sama, ada sampah, status pembersihan, dll

// Baris 50-56: Interface untuk CollectedWaste (data sampah yang sudah dikumpulkan)

// Baris 58-62: Interface untuk User (data pengguna)

// Baris 64-72: Interface untuk FetchedTask (format data task yang diambil dari API)

// Baris 74: Deklarasi component React utama bernama CollectPage

// Baris 75: Inisialisasi router untuk navigasi

// Baris 76-87: Deklarasi state variables menggunakan useState:
// - user: data pengguna yang login
// - tasks: array daftar tugas pengumpulan sampah
// - currentPage: halaman pagination saat ini
// - loading: status loading data
// - hoveredWasteType: jenis sampah yang sedang di-hover mouse
// - searchTerm: kata kunci pencarian
// - selectedTask: tugas yang dipilih untuk verifikasi
// - verificationStatus: status proses verifikasi (idle/verifying/success/failure)
// - verificationResult: hasil verifikasi dari backend
// - file: file gambar yang diupload
// - preview: URL preview gambar yang diupload
// - verificationDetails: detail lengkap hasil verifikasi AI

// Baris 89-99: Function getDaysAgo untuk menghitung selisih hari dari tanggal tertentu
// Mengkonversi tanggal ke format "Hari ini" atau "X hari yang lalu"

// Baris 101-128: Function handleFileChange untuk memproses file yang diupload
// Validasi tipe file harus gambar, ukuran max 10MB
// Membaca file dan membuat preview URL menggunakan FileReader

// Baris 130-137: Function readFileAsBase64 untuk convert file ke base64 string
// Menggunakan Promise untuk async operation dengan FileReader

// Baris 139-144: Function extractBase64Data untuk extract base64 dan mime type
// Memisahkan metadata dan data base64 dari data URL

// Baris 146-154: Filter dan sort tasks berdasarkan search term
// Filter berdasarkan location yang cocok dengan searchTerm
// Sort berdasarkan createdAt descending (terbaru dulu)

// Baris 156: Hitung jumlah total halaman pagination

// Baris 158-161: Slice array tasks untuk pagination
// Mengambil subset data sesuai halaman aktif

// Baris 163-195: useEffect hook untuk fetch data saat component mount
// Mengambil data tasks dari API endpoint '/api/tasks'
// Handle error dan loading state
// Map data dari API ke format Task interface
// Ambil user data dari localStorage

// Baris 197-199: useEffect untuk reset halaman ke 1 saat searchTerm berubah

// Baris 201-301: Function handleVerify - fungsi utama untuk verifikasi pengumpulan sampah
// 1. Validasi file dan selectedTask ada
// 2. Convert gambar ke base64
// 3. Kirim request ke API Gemini untuk analisis 2 gambar (sebelum & sesudah)
// 4. Parse response JSON dari AI
// 5. Cek apakah lokasi sama, ada sampah, dan sudah dibersihkan sepenuhnya
// 6. Jika valid, buat record CollectedWaste, update status report, tambah poin reward
// 7. Kirim notifikasi ke user
// 8. Update state tasks dengan data terbaru

// Baris 303-305: Function handleViewDetails untuk navigasi ke halaman detail report

// Baris 307-322: Function handleStartCollection untuk mulai pengumpulan
// Set selectedTask dan update status ke 'in_progress' via API
// Optimistically update UI sebelum response API

// Baris 324-958: Return JSX - render UI component
// Struktur:
// - Background gradient dan decorative elements
// - Header dengan animasi, judul, dan search bar
// - Loading state dengan Loader component
// - List tasks dengan pagination
// - Modal verifikasi dengan upload gambar

// Baris 328-331: Background decorative elements dengan gradient blur

// Baris 336-453: Header section dengan:
// - Animasi motion.div dari framer-motion
// - Gradient background hijau
// - Animasi daun jatuh (fallen leaf) sebagai dekorasi
// - Logo Lottie animation
// - Judul halaman
// - Search bar

// Baris 455-469: Conditional rendering - tampilkan Loader saat loading = true

// Baris 471-481: Conditional rendering - tampilkan pesan kosong jika tidak ada tasks

// Baris 483-653: Map dan render setiap task card dengan:
// - Info lokasi (link ke Google Maps)
// - Status badge (pending/in_progress/verified)
// - Grid info: jenis sampah, berat, tanggal
// - Tombol aksi sesuai status dan user

// Baris 655-677: Pagination controls - tombol prev/next dan info halaman

// Baris 682-958: Modal verifikasi yang muncul saat selectedTask != null
// Struktur modal:
// - Backdrop blur
// - Header dengan tombol close
// - Gambar asli dari report
// - Upload section untuk foto verifikasi
// - Preview gambar yang diupload
// - Detail hasil verifikasi dari AI
// - Status messages (success/failure)
// - Action buttons (Batal/Verifikasi)

// Baris 699-708: Modal header dengan judul dan tombol close

// Baris 711-802: Modal content dengan scroll:
// - Tampilkan gambar asli
// - Form upload gambar verifikasi
// - Preview gambar yang diupload
// - Detail verifikasi jika ada (lokasi sama, ada sampah, status pembersihan, dll)

// Baris 805-828: Status messages untuk success/failure verifikasi

// Baris 832-867: Action buttons di bottom modal:
// - Tombol Batal/Tutup
// - Tombol Verifikasi dengan loading state