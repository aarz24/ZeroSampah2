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
    <main className="flex min-h-screen flex-col items-center justify-start p-8 bg-gradient-to-b from-green-50 to-blue-50">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-green-600 mb-2">Panduan Daur Ulang</h1>
        <p className="text-xl text-blue-600">Pelajari cara mendaur ulang dengan benar</p>
      </motion.div>

      <div className="w-full max-w-6xl">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {commonItems.map((item) => (
            <Link href={`/recycling-guide/${item.slug}`} key={item.slug}>
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="relative h-40">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <item.icon className="w-6 h-6 text-green-500" />
                    <h2 className="text-lg font-semibold text-green-600">
                      {item.name}
                    </h2>
                  </div>
                  <p className="text-sm text-gray-600 min-h-[45px]">
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
