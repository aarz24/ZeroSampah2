import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true, // Disables Next.js image optimization
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  experimental: {
    allowedDevOrigins: ["localhost:3000", "192.168.*.*:3000", "*.local:3000"],
  },
};

export default nextConfig;
