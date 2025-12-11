"use client";
import { useState, useEffect } from "react";
import { MapPin, Upload, CheckCircle, Package, Camera, Sparkles, FileImage, ExternalLink, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Report } from "@/lib/types";
import Loader from "@/components/Loader";
import Image from "next/image";
import Lottie from "lottie-react";
import noteAnimation from "@/../Note.json";

// Types
interface UserData {
  clerkId: string;
  // Add other user data properties as needed
}

interface NewReport {
  location: string;
  type: string;
  amount: string;
}

interface VerificationResult {
  wasteType: string;
  amount: string;
  verificationResult: {
    decompositionTime: string;
    commonSources: string;
    environmentalImpact: string;
    healthHazards: string;
    carbonFootprint: string;
    economicImpact: string;
    wasteReductionStrategies: string;
    recyclingDisposalMethods: string;
  };
}

// Use secure server-side proxy endpoint for Gemini API instead of exposing the key in client bundles

export default function ReportPage() {
  const router = useRouter();
  
  // State Management
  const [userData, setUserData] = useState<UserData | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState(true);
  const [newReport, setNewReport] = useState<NewReport>({
    location: "",
    type: "",
    amount: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "verifying" | "success" | "failure"
  >("idle");
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true);
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      try {
        setUserData(JSON.parse(storedData));
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("userData");
      }
    }
  }, []);

  // File Handling Functions
  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (e.target.files && e.target.files[0]) {
        const selectedFile = e.target.files[0];

        if (!selectedFile.type.startsWith("image/")) {
          toast.error("Please upload an image file");
          return;
        }

        if (selectedFile.size > 10 * 1024 * 1024) {
          toast.error("File size should be less than 10MB");
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

  // Input Handling
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "location" && value) {
      try {
        new URL(value);
      } catch {
        toast.error("Please enter a valid URL");
        return;
      }
    }

    setNewReport({ ...newReport, [name]: value });
  };

  // Verification Functions
  const handleVerify = async () => {
    if (!file) {
      toast.error("No file selected");
      return;
    }

    setVerificationStatus("verifying");

    try {
      const base64Data = await readFileAsBase64(file);
      const imageData = base64Data.split(",")[1];

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
                    text: `Anda adalah ahli dalam manajemen limbah, keberlanjutan lingkungan, dan daur ulang. Analisis gambar yang diberikan dan klasifikasikan sampahnya.

                    Instruksi:
                    - Set "imageType" menjadi true jika gambar menunjukkan sampah, atau false jika bukan sampah.
                    - Jika gambar tidak berhubungan dengan sampah, return false untuk imageType.
                    - Identifikasi jenis sampah (contoh: plastik, kertas, kaca, logam, organik, berbahaya, campuran, dll).
                    - Estimasi jumlahnya dalam kg atau liter.
                    - Berikan informasi detail tentang aspek-aspek berikut:
                    
                      1. Waktu Penguraian: Berapa lama sampah ini membutuhkan waktu untuk terurai di lingkungan.
                      2. Sumber Umum: Dari mana jenis sampah ini biasanya berasal.
                      3. Dampak Lingkungan: Bagaimana sampah ini mempengaruhi alam, polusi, dan satwa liar.
                      4. Bahaya Kesehatan: Risiko bagi manusia, seperti toksisitas, infeksi, atau polusi udara.
                      5. Jejak Karbon: Kontribusi terhadap emisi CO₂ dan perubahan iklim.
                      6. Dampak Ekonomi: Beban finansial atau manfaat dari pengelolaan sampah ini.
                      7. Strategi Pengurangan Sampah: Cara meminimalkan produksi sampah jenis ini.
                      8. Metode Daur Ulang & Pembuangan: Praktik terbaik untuk menangani, mendaur ulang, atau membuang sampah ini dengan aman.
                    
                    Format Respons:
                    Return HANYA objek JSON yang valid tanpa penjelasan atau teks tambahan.
                    
                    WAJIB gunakan key berikut PERSIS seperti ini (dalam bahasa Indonesia):
                    - imageType (boolean)
                    - wasteType (string)
                    - quantity (string)
                    - waktuPenguraian (string paragraf panjang)
                    - sumberUmum (string paragraf panjang)
                    - dampakLingkungan (string paragraf panjang)
                    - bahayaKesehatan (string paragraf panjang)
                    - jejakKarbon (string paragraf panjang)
                    - dampakEkonomi (string paragraf panjang)
                    - strategiPengurangan (string paragraf panjang)
                    - metodeDaurUlang (string paragraf panjang)
                    
                    Contoh output:
                    {
                      "imageType": true,
                      "wasteType": "Sampah plastik",
                      "quantity": "Sekitar 150 kg",
                      "waktuPenguraian": "Sampah plastik membutuhkan waktu 100-1000 tahun untuk terurai di lingkungan. Faktor seperti suhu, kelembaban, dan keberadaan mikroorganisme sangat mempengaruhi laju penguraian. Barang-barang kecil yang mudah terurai seperti kulit buah terurai lebih cepat daripada barang besar atau yang mengandung selulosa.",
                      "sumberUmum": "Sampah organik umumnya berasal dari rumah tangga, restoran, toko kelontong, dan kegiatan pertanian. Di rumah tangga, sampah organik meliputi sisa makanan seperti kulit buah dan sayuran, sisa daging dan susu, ampas kopi, dan kantong teh. Restoran dan fasilitas pengolahan makanan menghasilkan jumlah limbah makanan yang besar, termasuk bahan yang rusak dan sisa makanan di piring.",
                      "dampakLingkungan": "Dampak lingkungan dari sampah organik sangat besar. Ketika dibuang di tempat pembuangan akhir, sampah terurai secara anaerobik dan menghasilkan metana, gas rumah kaca yang kuat yang berkontribusi terhadap perubahan iklim. Lindi, cairan yang terbentuk saat sampah terurai, dapat mencemari tanah dan air tanah, menimbulkan risiko bagi ekosistem dan sumber daya air.",
                      "bahayaKesehatan": "Sampah organik yang tidak dikelola dengan baik menimbulkan beberapa bahaya kesehatan. Bahan organik yang membusuk dapat menarik hama pembawa penyakit seperti tikus dan serangga, meningkatkan risiko infeksi. Proses penguraian melepaskan senyawa organik volatil (VOC) dan gas berbahaya lainnya, berkontribusi terhadap polusi udara dan masalah pernapasan, terutama di area dengan ventilasi buruk.",
                      "jejakKarbon": "Jejak karbon dari sampah organik sangat signifikan karena emisi metana dari penguraian anaerobik di tempat pembuangan akhir. Metana adalah gas rumah kaca dengan potensi pemanasan global berkali-kali lipat lebih tinggi daripada karbon dioksida dalam periode waktu yang lebih pendek. Transportasi sampah organik ke tempat pembuangan juga berkontribusi terhadap emisi karbon.",
                      "dampakEkonomi": "Dampak ekonomi dari sampah organik sangat beragam. Pembuangan yang tidak tepat menyebabkan biaya tinggi yang terkait dengan pengelolaan tempat pembuangan akhir, pembersihan lingkungan, dan perawatan kesehatan terkait polusi dan penyakit. Namun, pengelolaan sampah organik yang efektif dapat menciptakan peluang ekonomi melalui kompos dan fasilitas digesti anaerobik.",
                      "strategiPengurangan": "Strategi pengurangan sampah untuk sampah organik meliputi pengurangan sumber, pencegahan limbah makanan, dan peningkatan sistem segregasi dan pengumpulan. Pengurangan sumber melibatkan pengurangan jumlah sampah organik yang dihasilkan di sumbernya, seperti rumah tangga dan bisnis, dengan merencanakan makanan dengan hati-hati, menggunakan sisa makanan secara kreatif, dan menghindari pembelian berlebihan.",
                      "metodeDaurUlang": "Metode daur ulang dan pembuangan untuk sampah organik meliputi pengomposan, digesti anaerobik, insinerasi, dan penimbunan. Pengomposan melibatkan penguraian aerobik sampah organik menjadi pupuk tanah yang kaya nutrisi. Digesti anaerobik menggunakan mikroorganisme untuk memecah sampah organik tanpa oksigen, menghasilkan biogas dan digestate, pupuk kaya nutrisi."
                    }
                    
                    PENTING: 
                    1. Berikan SEMUA informasi dalam Bahasa Indonesia
                    2. Gunakan HANYA key dalam Bahasa Indonesia seperti contoh di atas
                    3. JANGAN gunakan key Bahasa Inggris seperti decompositionTime, commonSources, environmentalImpact, dll
                    4. Setiap field (kecuali imageType, wasteType, quantity) harus berupa paragraf detail dalam Bahasa Indonesia
                    5. Pastikan respons adalah JSON valid tanpa teks tambahan`,
                  },
                  {
                    inline_data: {
                      mime_type: file.type,
                      data: imageData,
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
        // Handle rate limit error specifically
        if (response.status === 429 || result.error?.message?.includes("Resource exhausted")) {
          throw new Error(
            "Batas penggunaan API tercapai. Silakan tunggu beberapa menit dan coba lagi, atau lanjutkan tanpa verifikasi AI."
          );
        }
        throw new Error(
          `API Error: ${result.error?.message || "Unknown error"}`
        );
      }

      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error("Invalid response format from Gemini API");
      }

      console.log("Gemini Raw Response:", text);

      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? jsonMatch[0] : null;
      
      if (!jsonText) {
        throw new Error("No JSON found in Gemini response");
      }

      console.log("Extracted JSON:", jsonText);

      let parsedResult;
      try {
        // Try parsing directly first
        parsedResult = JSON.parse(jsonText);
      } catch (e) {
        // If direct parsing fails, try cleaning
        console.log("Direct parse failed, attempting to clean JSON");
        const cleanedJson = jsonText
          .replace(/'/g, '"')
          .replace(/,\s*}/g, "}")
          .replace(/,\s*]/g, "]");
        parsedResult = JSON.parse(cleanedJson);
      }

      console.log("Parsed Result:", parsedResult);

      if (parsedResult.imageType === false) {
        toast.error("Please upload an image related to waste.");
        setVerificationStatus("idle");
        return;
      }

      if (parsedResult.wasteType && parsedResult.quantity) {
        const report = {
          location: newReport.location,
          wasteType: parsedResult.wasteType,
          amount: parsedResult.quantity,
          imageUrl: preview,
          verificationResult: {
            waktuPenguraian: parsedResult.waktuPenguraian,
            sumberUmum: parsedResult.sumberUmum,
            dampakLingkungan: parsedResult.dampakLingkungan,
            bahayaKesehatan: parsedResult.bahayaKesehatan,
            jejakKarbon: parsedResult.jejakKarbon,
            dampakEkonomi: parsedResult.dampakEkonomi,
            strategiPengurangan: parsedResult.strategiPengurangan,
            metodeDaurUlang: parsedResult.metodeDaurUlang,
          },
        };
        setVerificationResult(report);
        setVerificationStatus("success");
        setNewReport({
          ...newReport,
          type: parsedResult.wasteType,
          amount: parsedResult.quantity,
        });
      } else {
        console.error("Invalid verification result:", parsedResult);
        setVerificationStatus("failure");
        toast.error("Could not analyze the waste image properly");
      }
    } catch (error) {
      console.error("Error parsing or verifying waste:", error);
      setVerificationStatus("failure");
      toast.error("Failed to verify waste image");
    }
  };

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationStatus !== "success" || !userData || !verificationResult) {
      toast.error("Please verify the waste before submitting or log in.");
      return;
    }

    setIsSubmitting(true);
    try {
      const resp = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userData.clerkId,
          location: newReport.location,
          wasteType: newReport.type,
          amount: newReport.amount,
          imageUrl: preview,
          verificationResult: verificationResult.verificationResult,
        }),
      });
      const report = await resp.json();

      const formattedReport: Report = {
        id: report.id,
        userId: userData.clerkId,
        location: report.location,
        wasteType: report.wasteType,
        amount: report.amount,
        imageUrl: preview || "",
        verificationResult: verificationResult.verificationResult,
        status: "pending",
        createdAt: new Date(),
        collectorId: null,
      };

      setReports([formattedReport, ...reports]);
      setNewReport({ location: "", type: "", amount: "" });
      setFile(null);
      setPreview(null);
      setVerificationStatus("idle");
      setVerificationResult(null);

      toast.success(
        `Report submitted successfully! You've earned points for reporting waste.`
      );

      router.push("/dashboard");
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Data Fetching
  useEffect(() => {
    const fetchRecentReports = async () => {
      try {
        setIsLoadingReports(true);
        const res = await fetch('/api/reports?limit=5');
        const recentReports = await res.json();
        setReports(recentReports as Report[]);
      } catch (error) {
        console.error("Error fetching recent reports:", error);
        toast.error("Failed to load recent reports");
      } finally {
        setIsLoadingReports(false);
      }
    };

    fetchRecentReports();
  }, []);

  // Render Functions
  const renderLoadingState = () => (
    <div className="flex justify-center items-center py-12">
      <Loader />
      <span className="ml-2 text-gray-500">Memuat laporan terbaru...</span>
    </div>
  );

  const renderEmptyState = () => (
    <div className="py-12 text-center">
      <Package className="mx-auto mb-4 w-12 h-12 text-gray-400" />
      <p className="text-gray-500">Belum ada laporan. Jadilah yang pertama melaporkan sampah!</p>
    </div>
  );

  const renderReportsTable = () => (
    <table className="w-full">
      <thead className="sticky top-0 z-10 bg-gray-50">
        <tr>
          <th className="px-8 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
            Lokasi
          </th>
          <th className="px-8 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
            Jenis
          </th>
          <th className="px-8 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
            Jumlah
          </th>
          <th className="px-8 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
            Tanggal
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {Array.isArray(reports) && reports.map((report, idx) => (
          <tr
            key={report.id ?? `report-${idx}`}
            className="transition-colors duration-200 hover:bg-gray-50"
          >
            <td className="px-8 py-5">
              <div className="flex items-center">
                <MapPin className="mr-3 w-5 h-5 text-green-500" />
                {report.location ? (
                  <a
                    href={report.location}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-green-600 hover:text-green-700 hover:underline"
                  >
                    Lihat Lokasi
                  </a>
                ) : (
                  <span className="text-sm text-gray-500">Lokasi tidak tersedia</span>
                )}
              </div>
            </td>
            <td className="px-8 py-5 text-sm font-medium text-gray-900">
              {report.wasteType}
            </td>
            <td className="px-8 py-5 text-sm font-medium text-gray-900">
              {report.amount}
            </td>
            <td className="px-8 py-5 text-sm text-gray-500">
              {(() => {
                try {
                  if (!report.createdAt) return "N/A";
                  const d = report.createdAt instanceof Date ? report.createdAt : new Date(report.createdAt);
                  return isNaN(d.getTime()) ? "N/A" : d.toLocaleDateString();
                } catch {
                  return "N/A";
                }
              })()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  // Don't render anything until client-side hydration is complete
  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-emerald-50">
      {/* Decorative Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-green-200/30 to-emerald-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-gradient-to-br from-lime-200/20 to-green-200/30 rounded-full blur-3xl" />
      </div>

      <div className="relative px-4 py-12 mx-auto max-w-5xl sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="relative overflow-hidden p-6 md:p-8 mb-10 text-white bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 rounded-3xl shadow-2xl">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl" />
          </div>
          <div className="relative flex items-center gap-4 md:gap-6">
            {/* Lottie Animation Logo */}
            <div className="w-20 h-20 md:w-28 md:h-28 flex-shrink-0 bg-white/20 backdrop-blur-sm rounded-2xl p-2 overflow-hidden">
              <Lottie
                animationData={noteAnimation}
                loop={true}
                autoplay={true}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-extrabold mb-1 md:mb-2">
                Laporkan Sampah
              </h1>
              <p className="text-green-100 text-sm md:text-lg">Bantu menjaga lingkungan dengan melaporkan sampah di sekitar Anda</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image Upload Card */}
          <div className="relative overflow-hidden p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-green-100">
            {/* Card Header */}
            <div className="flex items-start gap-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl">
                <Camera className="w-7 h-7 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  Unggah Foto Sampah
                </h2>
                <p className="text-gray-600">
                  Ambil foto yang jelas dari sampah untuk membantu kami menganalisisnya secara akurat
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Upload Area */}
              <div className="relative group">
                <div className="flex justify-center px-8 py-16 bg-gradient-to-br from-gray-50 to-green-50/50 rounded-2xl border-2 border-dashed border-green-300/50 transition-all duration-300 group-hover:border-green-500 group-hover:bg-green-50/50 group-hover:shadow-lg">
                  <div className="space-y-4 text-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-green-400/20 rounded-full blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <FileImage className="relative mx-auto w-16 h-16 text-green-400 transition-all duration-300 group-hover:text-green-500 group-hover:scale-110" />
                    </div>
                    <div className="flex flex-col items-center">
                      <label
                        htmlFor="waste-image"
                        className="relative mb-3 px-6 py-3 font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-full cursor-pointer hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                      >
                        <span className="flex items-center gap-2">
                          <Upload className="w-5 h-5" />
                          Unggah file
                        </span>
                        <input
                          id="waste-image"
                          name="waste-image"
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                          accept="image/*"
                        />
                      </label>
                      <p className="text-gray-500">atau seret dan jatuhkan</p>
                      <p className="mt-3 text-sm text-gray-400 flex items-center gap-2">
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">PNG</span>
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">JPG</span>
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">GIF</span>
                        <span className="text-gray-400">hingga 10MB</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Area */}
              {preview && (
                <div className="relative overflow-hidden rounded-2xl border-2 border-green-200 shadow-xl group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative bg-gray-100 aspect-video">
                    <Image
                      src={preview}
                      alt="Waste preview"
                      className="object-contain w-full h-full"
                      width={800}
                      height={600}
                    />
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 shadow-lg">
                      Foto siap dianalisis
                    </span>
                  </div>
                </div>
              )}

              {/* Analyze Button */}
              <button
                type="button"
                onClick={handleVerify}
                disabled={!file || verificationStatus === "verifying"}
                className={`w-full flex items-center justify-center gap-3 px-8 py-5 text-lg font-semibold rounded-2xl transition-all duration-300 ${
                  !file
                    ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                    : "text-white bg-gradient-to-r from-green-500 via-green-500 to-emerald-500 shadow-xl shadow-green-500/25 cursor-pointer hover:shadow-2xl hover:shadow-green-500/30 hover:-translate-y-0.5"
                } ${verificationStatus === "verifying" ? "cursor-not-allowed" : ""}`}
              >
                {verificationStatus === "verifying" ? (
                  <>
                    <Loader />
                    <span>Menganalisis Sampah...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6" />
                    <span>Analisis Sampah</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Analysis Results Card */}
          {verificationStatus === "success" && verificationResult && (
            <div className="relative overflow-hidden p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl shadow-xl border border-green-200">
              <div className="absolute top-0 right-0 w-40 h-40 bg-green-200/30 rounded-full blur-3xl" />
              <div className="relative flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="p-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl shadow-lg">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="mb-2 text-2xl font-bold text-gray-900">
                    Analisis Selesai
                  </h3>
                  <p className="text-gray-600 mb-6">Sampah berhasil diidentifikasi oleh AI</p>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="p-5 bg-white rounded-2xl border border-green-100 shadow-md">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <p className="text-sm font-medium text-gray-500">Jenis Sampah</p>
                      </div>
                      <p className="text-xl font-bold text-gray-900">
                        {verificationResult.wasteType}
                      </p>
                    </div>
                    <div className="p-5 bg-white rounded-2xl border border-green-100 shadow-md">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                        <p className="text-sm font-medium text-gray-500">Perkiraan Jumlah</p>
                      </div>
                      <p className="text-xl font-bold text-gray-900">
                        {verificationResult.amount}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Location Details Card */}
          <div className="relative overflow-hidden p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-green-100">
            {/* Card Header */}
            <div className="flex items-start gap-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl">
                <MapPin className="w-7 h-7 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  Detail Lokasi
                </h2>
                <p className="text-gray-600">Tentukan lokasi sampah dengan Google Maps</p>
              </div>
            </div>

            <div className="space-y-8">
              {/* Location Input */}
              <div className="space-y-3">
                <label htmlFor="location" className="block text-sm font-semibold text-gray-700">
                  Lokasi (URL Google Maps)
                </label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      id="location"
                      name="location"
                      value={newReport.location}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 placeholder:text-gray-400"
                      placeholder="Tempel URL lokasi Google Maps"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => window.open("https://www.google.com/maps", "_blank")}
                    className="flex items-center gap-2 px-6 py-4 font-semibold text-green-700 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl transition-all duration-300 cursor-pointer hover:from-green-200 hover:to-emerald-200 hover:shadow-lg"
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span>Buka Maps</span>
                  </button>
                </div>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Klik &apos;Buka Maps&apos; untuk menemukan lokasi Anda, lalu bagikan dan salin URL
                </p>
              </div>

              {/* Waste Details Grid */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <label htmlFor="type" className="block text-sm font-semibold text-gray-700">
                    Jenis Sampah
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="type"
                      name="type"
                      value={newReport.type}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-4 text-gray-700 bg-gray-50 rounded-2xl border-2 border-gray-200 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/20"
                      placeholder="Jenis sampah terverifikasi"
                      readOnly
                    />
                    {newReport.type && (
                      <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <label htmlFor="amount" className="block text-sm font-semibold text-gray-700">
                    Perkiraan Jumlah
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="amount"
                      name="amount"
                      value={newReport.amount}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-4 text-gray-700 bg-gray-50 rounded-2xl border-2 border-gray-200 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/20"
                      placeholder="Jumlah terverifikasi"
                      readOnly
                    />
                    {newReport.amount && (
                      <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !verificationResult}
                className={`w-full flex items-center justify-center gap-3 px-8 py-5 text-lg font-semibold rounded-2xl transition-all duration-300 ${
                  !verificationResult
                    ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                    : "text-white bg-gradient-to-r from-green-500 via-green-500 to-emerald-500 shadow-xl shadow-green-500/25 cursor-pointer hover:shadow-2xl hover:shadow-green-500/30 hover:-translate-y-0.5"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader />
                    <span>Mengirim Laporan...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-6 h-6" />
                    <span>Kirim Laporan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Recent Reports Section */}
        <div className="mt-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Laporan Terbaru
            </h2>
          </div>
          <div className="overflow-hidden bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-green-100">
            <div className="max-h-[480px] overflow-y-auto">
              {isLoadingReports
                ? renderLoadingState()
                : reports.length > 0
                ? renderReportsTable()
                : renderEmptyState()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
