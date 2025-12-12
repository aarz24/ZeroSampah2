import { Github, Twitter, Linkedin } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <footer className="py-16 text-gray-300 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid gap-12 md:grid-cols-4"
        >
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">ZeroSampah</h3>
            <p className="text-gray-400 leading-relaxed">
              Menjadikan pengelolaan sampah bermanfaat dan berkelanjutan bagi semua. Bergabunglah bersama kami untuk menciptakan masa depan yang lebih bersih.
            </p>
          </div>
          <div>
            <h4 className="mb-6 text-lg font-semibold text-white">Tautan Cepat</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="hover:text-green-400 transition-colors">Tentang Kami</Link></li>
              <li><Link href="#" className="hover:text-green-400 transition-colors">Cara Kerja</Link></li>
              <li><Link href="#" className="hover:text-green-400 transition-colors">Kontak</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-6 text-lg font-semibold text-white">Sumber Daya</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="hover:text-green-400 transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-green-400 transition-colors">Dokumentasi</Link></li>
              <li><Link href="#" className="hover:text-green-400 transition-colors">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-6 text-lg font-semibold text-white">Terhubung</h4>
            <div className="flex space-x-5">
              <Link href="#" className="hover:text-green-400 transition-transform hover:scale-110">
                <Github className="w-6 h-6" />
              </Link>
              <Link href="#" className="hover:text-green-400 transition-transform hover:scale-110">
                <Twitter className="w-6 h-6" />
              </Link>
              <Link href="#" className="hover:text-green-400 transition-transform hover:scale-110">
                <Linkedin className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </motion.div>
        <div className="pt-8 mt-12 text-sm text-center border-t border-gray-800">
          <p>&copy; {new Date().getFullYear()} ZeroSampah. Semua hak dilindungi.</p>
        </div>
      </div>
    </footer>
  )
} 