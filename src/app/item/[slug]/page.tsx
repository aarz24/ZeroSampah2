"use client";

import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import Link from "next/link";

const items = {
  plastic: {
    name: "Plastik",
    image: "/plastico.jpg",
    description:
      "Plastik adalah salah satu bahan paling umum dalam kehidupan sehari-hari dan dapat memakan waktu ratusan tahun untuk terurai. Daur ulang yang tepat sangat penting untuk mengurangi dampak lingkungannya.",
    steps: [
      {
        title: "Cuci untuk menghilangkan sisa",
        detail:
          "Buang semua sisa dan cuci dengan air. Sabun tidak diperlukan, pastikan tidak ada sisa makanan.",
        image: "/plastic1.jpg",
        contain: false,
      },
      {
        title: "Pisahkan tutup dan label",
        detail:
          "Jika memungkinkan, pisahkan tutup dan label karena mungkin terbuat dari jenis plastik yang berbeda.",
        image: "/plastic2.jpeg",
        contain: false,
      },
      {
        title: "Hancurkan untuk mengurangi volume",
        detail:
          "Tekan untuk menghemat ruang. Botol dapat dihancurkan, tapi tetap jaga agar identifikasi material terlihat.",
        image: "/plastic3.jpg",
        contain: false,
      },
      {
        title: "Masukkan ke tempat sampah yang benar",
        detail:
          "Buang di tempat sampah khusus plastik. Periksa warna tempat sampah – biasanya merah untuk plastik.",
        image: "/plastic4.webp",
        contain: true,
      },
    ],
    impact:
      "Plastik dapat memakan waktu hingga 450 tahun untuk terurai di alam. Dengan mendaur ulang, Anda membantu mengurangi polusi laut dan emisi gas rumah kaca.",
    tips: [
      "Pilih produk dengan kemasan lebih sedikit",
      "Gunakan tas yang dapat digunakan ulang",
      "Hindari plastik sekali pakai",
      "Pilih kemasan yang dapat didaur ulang",
    ],
  },
  electronics: {
    name: "Elektronik",
    image: "/eletronicos.jpg",
    description:
      "Sampah elektronik mengandung bahan berharga serta zat beracun. Daur ulang yang tepat penting untuk melindungi lingkungan dan memulihkan bahan berharga.",
    steps: [
      {
        title: "Lepaskan baterai",
        detail:
          "Baterai harus didaur ulang secara terpisah karena mengandung bahan beracun. Cari titik pengumpulan khusus.",
        image: "/eletronics1.jpg",
        contain: false,
      },
      {
        title: "Hapus data pribadi",
        detail:
          "Untuk perangkat penyimpanan, backup dan hapus sepenuhnya data pribadi Anda.",
        image: "/eletronics2.jpeg",
        contain: false,
      },
      {
        title: "Temukan titik pengumpulan",
        detail:
          "Cari titik pengumpulan khusus elektronik. Banyak toko elektronik menawarkan program daur ulang.",
        image: "/eletronics3.jpeg",
        contain: false,
      },
      {
        title: "Serahkan dengan benar",
        detail:
          "Serahkan elektronik di titik pengumpulan resmi, di mana akan dibongkar dan didaur ulang dengan benar.",
        image: "/eletronics4.jpeg",
        contain: false,
      },
    ],
    impact:
      "Sampah elektronik hanya 2% dari sampah TPA tapi menyumbang 70% sampah beracun. Daur ulang yang tepat mencegah kontaminasi tanah dan air.",
    tips: [
      "Perpanjang umur perangkat",
      "Lakukan pemeliharaan preventif",
      "Donasikan peralatan yang masih berfungsi",
      "Teliti reputasi titik pengumpulan",
    ],
  },
  paper: {
    name: "Kertas",
    image: "/papel.jpeg",
    description:
      "Kertas adalah salah satu bahan yang paling banyak didaur ulang di dunia. Daur ulang membantu mengurangi deforestasi dan konsumsi air dalam produksi kertas baru.",
    steps: [
      {
        title: "Lepaskan bagian plastik atau logam",
        detail:
          "Bagian berlapis plastik atau logam, seperti staples harus dilepas sebelum didaur ulang.",
        image: "/paper1.jpg",
        contain: false,
      },
      {
        title: "Sobek untuk memudahkan transportasi",
        detail:
          "Menyobek kertas membantu mengoptimalkan penyimpanan dan transportasi untuk daur ulang.",
        image: "/paper2.jpg",
        contain: false,
      },
      {
        title: "Hindari kertas yang terkontaminasi",
        detail:
          "Kertas yang kotor dengan minyak atau makanan tidak dapat didaur ulang.",
        image: "/paper3.png",
        contain: false,
      },
      {
        title: "Masukkan ke tempat sampah biru",
        detail:
          "Buang kertas yang dapat didaur ulang di tempat sampah biru.",
        image: "/paper4.jpeg",
        contain: false,
      },
    ],
    impact:
      "Setiap ton kertas daur ulang menghemat sekitar 10.000 liter air dan mengurangi kebutuhan penebangan pohon.",
    tips: [
      "Gunakan kertas daur ulang",
      "Cetak dua sisi jika memungkinkan",
      "Gunakan kembali kertas sebelum dibuang",
      "Hindari pemborosan dalam catatan",
    ],
  },
  organic: {
    name: "Organik",
    image: "/organico.jpg",
    description:
      "Sampah organik, seperti sisa makanan dan kulit buah, dapat diubah menjadi kompos, mengurangi jumlah sampah yang dikirim ke TPA.",
    steps: [
      {
        title: "Pisahkan sampah organik",
        detail:
          "Pisahkan sisa buah, kulit sayuran, cangkang telur, dan ampas kopi untuk pengomposan.",
        image: "/organic1.webp",
        contain: false,
      },
      {
        title: "Hindari mencampur dengan plastik dan logam",
        detail:
          "Jaga sampah organik bebas dari kemasan plastik atau logam.",
        image: "/organic2.webp",
        contain: false,
      },
      {
        title: "Gunakan komposter rumah",
        detail:
          "Jika Anda punya ruang, komposter rumah dapat mengubah sampah organik Anda menjadi pupuk alami.",
        image: "/organic3.jpeg",
        contain: false,
      },
      {
        title: "Buang dengan benar di lokasi yang ditentukan",
        detail:
          "Jika Anda tidak membuat kompos, masukkan sampah organik ke tempat sampah coklat.",
        image: "/organic4.jpeg",
        contain: true,
      },
    ],
    impact:
      "Pengomposan mengurangi emisi gas metana, salah satu kontributor utama efek rumah kaca, dan meningkatkan kualitas tanah.",
    tips: [
      "Hindari pemborosan makanan",
      "Gunakan kulit dan batang dalam resep",
      "Gunakan sampah organik untuk kompos",
      "Simpan dengan benar untuk menghindari bau",
    ],
  },
};

type Props = {
  params: Promise<{ slug: string }>;
};

export default function ItemPage({ params }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const routeParams = use(params);
  const item = items[routeParams.slug as keyof typeof items];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % item.steps.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [item.steps.length]);

  if (!item) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Item tidak ditemukan</p>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-8 bg-gradient-to-b from-green-50 to-blue-50">
      <Link href="/dashboard" className="self-start mb-8">
        <motion.div
          whileHover={{ x: -5 }}
          className="flex items-center text-green-600 hover:text-green-700"
        >
          <ArrowLeft className="mr-2" />
          Kembali ke Dashboard
        </motion.div>
      </Link>

      <div className="w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-green-600 mb-4">
            Cara Mendaur Ulang: {item.name}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">{item.description}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative h-[300px] rounded-lg overflow-hidden"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </motion.div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-green-600 mb-4">
              Dampak Lingkungan
            </h2>
            <p className="text-gray-600 mb-4">{item.impact}</p>
            <h3 className="font-medium text-green-600 mb-2">Tips Berguna:</h3>
            <ul className="list-disc list-inside text-gray-600">
              {item.tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-green-600 mb-6">
            Langkah-langkah Daur Ulang
          </h2>
          <div className="grid gap-6">
            {item.steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                animate={{
                  opacity: currentStep === index ? 1 : 0.7,
                  x: 0,
                  scale: currentStep === index ? 1 : 0.98,
                }}
                transition={{ duration: 0.5 }}
                className="grid md:grid-cols-2 gap-4 items-center"
              >
                <div className="flex items-start">
                  <div
                    className={`flex-shrink-0 w-6 h-6 rounded-full ${
                      currentStep === index ? "bg-green-500" : "bg-gray-200"
                    } flex items-center justify-center mr-3 mt-1`}
                  >
                    {currentStep === index && (
                      <Check className="text-white" size={16} />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-green-600">{step.title}</h3>
                    <p className="text-gray-600 mt-1">{step.detail}</p>
                  </div>
                </div>
                <div className="relative h-[150px] rounded-lg overflow-hidden">
                  <img
                    src={step.image}
                    alt={step.title}
                    className={`w-full h-full ${
                      step.contain ? "object-contain" : "object-cover"
                    }`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
