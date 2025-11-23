"use client";

import { useState, useEffect } from "react";
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
  const [isClient, setIsClient] = useState(false);
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

  useEffect(() => {
    setIsClient(true);
  }, []);

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
        const fetchedTasks = await res.json();
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
        console.error("Error fetching tasks:", error);
        toast.error("Failed to load tasks. Please try again.");
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
      toast.error("Please upload a verification image.");
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
                body: JSON.stringify({ userId: user.clerkId, message: `You earned 50 points for successfully collecting waste at ${selectedTask.location}!`, type: 'reward' }),
              });

              setVerificationStatus("success");
              setVerificationResult(collectedWaste);
              toast.success("Collection verified successfully! You earned 50 points!");

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
              toast.error("Failed to update report status. Please try again.");
            }
          } else {
            setVerificationStatus("failure");
            toast.error("Failed to verify collection. Please try again.");
          }
        } else {
          setVerificationStatus("failure");
          toast.error(
            "Verification failed. The images don&apos;t match or the waste hasn&apos;t been fully cleaned."
          );
        }
      } else {
        throw new Error("Could not parse response JSON");
      }
    } catch (error) {
      console.error("Error during verification:", error);
      toast.error("Failed to verify collection. Please try again.");
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
    <div className="p-4 min-h-screen bg-gray-50 sm:p-6 lg:p-8">
      {!isClient ? (
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      ) : (
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col mb-8 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:mb-0">
              Tugas Pengumpulan Sampah
            </h1>

            <div className="relative w-full max-w-md">
              <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Cari berdasarkan area..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="py-2 pr-4 pl-10 w-full text-sm bg-white rounded-lg border border-gray-300 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
              />
            </div>
          </div>

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
                      className="overflow-hidden bg-white rounded-lg border border-gray-200 shadow-sm transition-all hover:shadow-md"
                    >
                      <div className="p-4 bg-gray-50 border-b border-gray-100">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <MapPin className="mr-2 w-5 h-5 text-green-600" />
                            <a
                              href={task.location}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-green-600 cursor-pointer text-md hover:underline"
                            >
                              Lihat Lokasi
                            </a>
                          </div>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              task.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : task.status === "in_progress"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {task.status === "pending"
                              ? "Menunggu"
                              : task.status === "in_progress"
                              ? "Sedang Berlangsung"
                              : "Terverifikasi"}
                          </span>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                          <div className="flex items-center">
                            <Trash2 className="flex-shrink-0 mr-2 w-4 h-4 text-gray-500" />
                            <div className="relative max-w-[120px]">
                              <span
                                onMouseEnter={() =>
                                  setHoveredWasteType(task.wasteType)
                                }
                                onMouseLeave={() => setHoveredWasteType(null)}
                                className="block truncate cursor-pointer"
                              >
                                {task.wasteType}
                              </span>
                              {hoveredWasteType === task.wasteType && (
                                <div className="absolute left-0 top-full z-10 p-2 mt-1 text-xs text-white bg-gray-800 rounded-md shadow-lg whitespace-normal max-w-[200px]">
                                  {task.wasteType}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Weight className="mr-2 w-4 h-4 text-gray-500" />
                            <span className="truncate">
                              {task.amount || "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="mr-2 w-4 h-4 text-gray-500" />
                            <span className="truncate">
                              {task.createdAt
                                ? task.createdAt.toLocaleDateString()
                                : "No date"}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-6">
                            <div className="text-xs text-gray-500">
                            {task.createdAt && (
                              <span className="flex items-center">
                                <Clock className="mr-1 w-3 h-3" />
                                {typeof getDaysAgo(task.createdAt) === "string"
                                  ? getDaysAgo(task.createdAt)
                                  : `${getDaysAgo(task.createdAt)} hari yang lalu`}
                              </span>
                            )}
                          </div>
                          <div className="flex justify-end space-x-2">
                            {task.status === "pending" && (
                              <>
                                <button
                                  onClick={() =>
                                    handleViewDetails(task.id?.toString() || "")
                                  }
                                  className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-green-600 border border-green-600 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 cursor-pointer"
                                >
                                  Lihat Detail
                                </button>
                                <button
                                  onClick={() =>
                                    handleStartCollection(
                                      task.id?.toString() || ""
                                    )
                                  }
                                  className="rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 cursor-pointer"
                                >
                                  Mulai Pengumpulan
                                </button>
                              </>
                            )}
                            {task.status === "in_progress" &&
                              task.collectorId === user?.id && (
                                <button
                                  onClick={() => setSelectedTask(task)}
                                  className="rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 cursor-pointer"
                                >
                                  Selesai & Verifikasi
                                </button>
                              )}
                            {task.status === "in_progress" &&
                              task.collectorId !== user?.id && (
                                <span className="text-sm font-medium text-yellow-600">
                                  Sedang dikerjakan oleh pengumpul lain
                                </span>
                              )}
                            {task.status === "verified" && (
                              <span className="flex items-center text-sm font-medium text-green-600">
                                <CheckCircle className="mr-1 w-4 h-4" />
                                Hadiah Diterima
                              </span>
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
      )}

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
  );
}
