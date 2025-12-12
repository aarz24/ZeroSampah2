"use client";

import { motion } from "framer-motion";
import { BoxIcon as Bottle, Battery, Newspaper, Apple } from "lucide-react";
import Link from "next/link";

const commonItems = [
  {
    name: "Plastik",
    icon: Bottle,
    slug: "plastic",
    image: "/plastico.jpg",
    description: "Pelajari cara mendaur ulang berbagai jenis plastik dengan benar",
  },
  {
    name: "Elektronik",
    icon: Battery,
    slug: "electronics",
    image: "/eletronicos.jpg",
    description: "Pembuangan peralatan elektronik yang tepat",
  },
  {
    name: "Kertas",
    icon: Newspaper,
    slug: "paper",
    image: "/papel.jpeg",
    description: "Cara mendaur ulang berbagai jenis kertas dan kardus",
  },
  {
    name: "Organik",
    icon: Apple,
    slug: "organic",
    image: "/organico.jpg",
    description: "Ubah sampah organik menjadi kompos",
  },
];

export default function RecyclingGuidePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 sm:p-6 md:p-8 bg-gradient-to-b from-green-50 to-blue-50">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8 sm:mb-12"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-600 mb-2">Panduan Daur Ulang</h1>
        <p className="text-base sm:text-lg md:text-xl text-blue-600">Pelajari cara mendaur ulang dengan benar</p>
      </motion.div>

      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {commonItems.map((item) => (
            <Link href={`/recycling-guide/${item.slug}`} key={item.slug}>
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl sm:rounded-lg shadow-lg overflow-hidden"
              >
                <div className="relative h-28 sm:h-40">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 sm:p-4">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                    <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                    <h2 className="text-sm sm:text-lg font-semibold text-green-600">
                      {item.name}
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 min-h-[32px] sm:min-h-[45px] line-clamp-2 sm:line-clamp-none">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
