'use client';

import { SignIn } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';
import Link from 'next/link';

export default function SignInPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex flex-col items-center p-4 sm:p-8 relative overflow-y-auto">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-20 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-gradient-to-br from-green-200/40 to-emerald-300/30 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 30, 0],
                        y: [0, -20, 0]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-20 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-br from-emerald-200/30 to-lime-200/40 rounded-full blur-3xl"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        x: [0, -40, 0],
                        y: [0, 30, 0]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute top-1/2 left-1/3 w-48 sm:w-64 h-48 sm:h-64 bg-gradient-to-br from-lime-100/30 to-green-200/20 rounded-full blur-2xl"
                    animate={{
                        scale: [1, 1.3, 1],
                        rotate: [0, 180, 360]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                />
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-green-400/60 rounded-full"
                        style={{
                            left: `${10 + i * 12}%`,
                            top: `${15 + (i % 4) * 20}%`
                        }}
                        animate={{
                            y: [0, -40, 0],
                            opacity: [0.3, 0.8, 0.3],
                            scale: [1, 1.5, 1]
                        }}
                        transition={{
                            duration: 3 + i * 0.4,
                            repeat: Infinity,
                            delay: i * 0.2,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

            {/* Content Container */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-sm my-auto"
            >
                {/* Logo and Branding */}
                <div className="text-center mb-4">
                    <p className="text-green-700/80 text-sm mt-12 mb-4">
                        Masuk untuk melanjutkan perjalanan hijau Anda
                    </p>
                    <Link href="/" className="inline-flex items-center gap-3 group mb-4">
                        <div className="relative">
                            {/* Pulsing ring */}
                            <motion.div
                                className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-500 opacity-60"
                                animate={{
                                    scale: [1, 1.15, 1],
                                    opacity: [0.6, 0.2, 0.6]
                                }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            />
                            <motion.div
                                className="relative p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-300/60"
                                whileHover={{ scale: 1.05 }}
                            >
                                <motion.div
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <Leaf className="w-5 h-5" />
                                </motion.div>
                            </motion.div>
                        </div>
                        <motion.span
                            className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-700 bg-clip-text text-transparent"
                            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            style={{ backgroundSize: "200% 200%" }}
                        >
                            ZeroSampah
                        </motion.span>
                    </Link>
                </div>

                {/* Clerk Sign In Component with Custom Styling */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-green-500/10 border border-white/60 p-2 overflow-hidden">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 rounded-t-3xl" />
                    <SignIn
                        appearance={{
                            elements: {
                                rootBox: "w-full",
                                card: "bg-transparent shadow-none p-4 sm:p-6",
                                headerTitle: "text-gray-900 font-bold text-xl",
                                headerSubtitle: "text-gray-600",
                                socialButtonsBlockButton: "bg-white border-2 border-gray-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all duration-300 rounded-xl",
                                socialButtonsBlockButtonText: "font-semibold text-gray-700",
                                dividerLine: "bg-gray-200",
                                dividerText: "text-gray-500",
                                formFieldLabel: "text-gray-700 font-medium",
                                formFieldInput: "border-2 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl transition-all duration-300",
                                formButtonPrimary: "bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 hover:from-green-500 hover:via-emerald-400 hover:to-teal-400 rounded-xl font-semibold shadow-lg shadow-green-500/30 transition-all duration-300",
                                footerActionLink: "text-emerald-600 hover:text-emerald-700 font-semibold",
                                identityPreviewEditButton: "text-emerald-600 hover:text-emerald-700",
                                formFieldAction: "text-emerald-600 hover:text-emerald-700",
                                alert: "rounded-xl",
                                alertText: "text-sm",
                                logoBox: "hidden",
                                footer: "hidden",
                            },
                            layout: {
                                socialButtonsPlacement: "top",
                                showOptionalFields: false,
                            },
                        }}
                        redirectUrl="/dashboard"
                        signUpUrl="/sign-up"
                    />
                </div>

                {/* Footer Links */}
                <div className="text-center mt-4 space-y-2">
                    <p className="text-gray-600 text-sm">
                        Belum punya akun?{' '}
                        <Link href="/sign-up" className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors">
                            Daftar Sekarang
                        </Link>
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-emerald-600 text-sm transition-colors"
                    >
                        <Leaf className="w-4 h-4" />
                        Kembali ke Beranda
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
