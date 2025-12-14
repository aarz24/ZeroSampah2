"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import toast from 'react-hot-toast';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Lottie from 'lottie-react';
import fallenLeaf from "../../../../public/animations/fallen-leaf.json";
import fallenLeaf1 from "../../../../public/animations/fallen-leaf-1.json";
import fallenLeaf2 from "../../../../public/animations/fallen-leaf-2.json";
import fallenLeaf3 from "../../../../public/animations/fallen-leaf-3.json";
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import 'mapbox-gl/dist/mapbox-gl.css';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function CreateEventPage() {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    eventDate: '',
    eventTime: '',
    description: '',
    maxParticipants: '',
  });
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [wasteCategories, setWasteCategories] = useState<string[]>([]);
  const [rewardInfo, setRewardInfo] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Extract coordinates from Google Maps URL
  const extractCoordinatesFromUrl = (url: string): { lat: number; lng: number } | null => {
    try {
      // Pattern 1: maps.app.goo.gl or goo.gl shortened links - need to fetch redirect
      // Pattern 2: google.com/maps with @lat,lng
      const match1 = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (match1) {
        return { lat: parseFloat(match1[1]), lng: parseFloat(match1[2]) };
      }
      
      // Pattern 3: google.com/maps with q=lat,lng
      const match2 = url.match(/q=(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (match2) {
        return { lat: parseFloat(match2[1]), lng: parseFloat(match2[2]) };
      }
      
      // Pattern 4: ll parameter
      const match3 = url.match(/ll=(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (match3) {
        return { lat: parseFloat(match3[1]), lng: parseFloat(match3[2]) };
      }

      return null;
    } catch (error) {
      return null;
    }
  };

  const handleLocationChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, location: value });

    // Check if it's a Google Maps URL
    if (value.includes('maps.app.goo.gl') || value.includes('google.com/maps') || value.includes('goo.gl')) {
      // For shortened URLs, try to extract from redirect
      if (value.includes('maps.app.goo.gl') || value.includes('goo.gl')) {
        try {
          const response = await fetch(`/api/extract-coordinates?url=${encodeURIComponent(value)}`);
          if (response.ok) {
            const data = await response.json();
            if (data.coordinates) {
              setCoordinates(data.coordinates);
              toast.success('Koordinat berhasil diambil dari link Google Maps!');
              return;
            }
          }
        } catch (error) {
          console.error('Failed to extract coordinates from shortened URL:', error);
        }
      }

      // Try direct extraction
      const coords = extractCoordinatesFromUrl(value);
      if (coords) {
        setCoordinates(coords);
        toast.success('Koordinat berhasil diambil dari link Google Maps!');
      }
    }
  };

  const handleCategoryToggle = (category: string) => {
    setWasteCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(files);
    
    // Create preview URLs
    const previews: string[] = [];
    files.forEach(file => {
      const url = URL.createObjectURL(file);
      previews.push(url);
    });
    setImagePreviews(previews);
  };

  const onVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setVideos(files);
    
    // Create preview URLs
    const previews: string[] = [];
    files.forEach(file => {
      const url = URL.createObjectURL(file);
      previews.push(url);
    });
    setVideoPreviews(previews);
  };

  const handleSubmit = async (e: FormEvent, isDraft = false) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Silakan login terlebih dahulu');
      return;
    }

    if (!formData.title || !formData.location || !formData.eventDate || !formData.eventTime) {
      toast.error('Mohon lengkapi semua field yang wajib');
      return;
    }

    if (!coordinates) {
      toast.error('Mohon pilih lokasi acara pada peta dengan mengklik peta');
      return;
    }

    setLoading(true);
    try {
      // Convert images to base64 data URLs
      const imageUrls: string[] = [];
      for (const file of images) {
        // Check file size (limit to 2MB per image)
        if (file.size > 2 * 1024 * 1024) {
          toast.error(`Foto ${file.name} terlalu besar. Maksimal 2MB per foto.`);
          setLoading(false);
          return;
        }
        
        const reader = new FileReader();
        const dataUrl = await new Promise<string>((resolve) => {
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
        imageUrls.push(dataUrl);
      }

      // Convert videos to base64 data URLs
      const videoUrls: string[] = [];
      for (const file of videos) {
        // Check file size (limit to 5MB per video)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`Video ${file.name} terlalu besar. Maksimal 5MB per video.`);
          setLoading(false);
          return;
        }
        
        const reader = new FileReader();
        const dataUrl = await new Promise<string>((resolve) => {
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
        videoUrls.push(dataUrl);
      }

      const eventData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        latitude: coordinates?.lat.toString() || null,
        longitude: coordinates?.lng.toString() || null,
        eventDate: formData.eventDate,
        eventTime: formData.eventTime,
        wasteCategories,
        maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : null,
        rewardInfo: rewardInfo.trim() || null,
        images: imageUrls,
        videos: videoUrls,
      };

      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
        console.error('API Error:', errorData);
        console.error('Response status:', res.status, res.statusText);
        throw new Error(errorData.error || `Failed to create event (${res.status})`);
      }

      const event = await res.json();
      toast.success(isDraft ? 'Draf disimpan!' : 'Acara berhasil diterbitkan!');
      router.push(`/events/${event.id}`);
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Gagal membuat acara');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="px-6 py-8">
        <p className="text-gray-600">Silakan login untuk membuat acara.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 px-4 sm:px-6 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto">
        <motion.button 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()} 
          className="inline-flex items-center gap-2 text-sm font-medium text-green-700 hover:text-green-800 transition-colors mb-4 sm:mb-6 group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Kembali
        </motion.button>
        
        {/* Hero with Animation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden p-5 sm:p-8 md:p-10 mb-6 sm:mb-8 text-white bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 rounded-2xl sm:rounded-3xl shadow-2xl shadow-green-500/25"
        >
          {/* Decorative background elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl" />
          </div>
          
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
          
          <div className="relative flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            {/* Main Animation Logo */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex-shrink-0 bg-white/20 backdrop-blur-md rounded-2xl sm:rounded-3xl p-2 sm:p-3 shadow-xl shadow-black/10 border border-white/20 overflow-hidden"
            >
              <DotLottieReact
                src="/animations/time.json"
                loop
                autoplay
                style={{ width: '100%', height: '100%' }}
              />
            </motion.div>
            
            {/* Content */}
            <div className="text-center sm:text-left">
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2"
                style={{ textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}
              >
                Buat Aksi Bersih Komunitas
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-sm sm:text-base text-green-100"
              >
                Ajak komunitas untuk membersihkan lingkungan bersama-sama.
              </motion.p>
            </div>
          </div>
          
          {/* Bottom gradient line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400/50 via-white/30 to-yellow-400/50" />
        </motion.div>

        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          onSubmit={(e) => handleSubmit(e, false)} 
          className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-100 overflow-hidden"
        >
          {/* Form Header */}
          <div className="relative bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 px-4 sm:px-8 py-4 sm:py-6 overflow-hidden">
            {/* Fallen Leaf Animations - Decorative Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-4 -left-4 w-20 sm:w-28 h-20 sm:h-28 opacity-25">
                <Lottie animationData={fallenLeaf} loop={true} />
              </div>
              <div className="absolute -top-2 left-1/4 w-16 sm:w-24 h-16 sm:h-24 opacity-20">
                <Lottie animationData={fallenLeaf1} loop={true} />
              </div>
              <div className="absolute -top-4 left-1/2 w-20 sm:w-28 h-20 sm:h-28 opacity-25">
                <Lottie animationData={fallenLeaf2} loop={true} />
              </div>
              <div className="absolute -top-2 right-1/4 w-16 sm:w-24 h-16 sm:h-24 opacity-20">
                <Lottie animationData={fallenLeaf3} loop={true} />
              </div>
              <div className="absolute -top-4 -right-4 w-20 sm:w-28 h-20 sm:h-28 opacity-25">
                <Lottie animationData={fallenLeaf} loop={true} />
              </div>
              <div className="absolute -bottom-4 -left-4 w-20 sm:w-28 h-20 sm:h-28 opacity-25">
                <Lottie animationData={fallenLeaf1} loop={true} />
              </div>
              <div className="absolute -bottom-2 left-1/3 w-16 sm:w-24 h-16 sm:h-24 opacity-20">
                <Lottie animationData={fallenLeaf2} loop={true} />
              </div>
              <div className="absolute -bottom-4 right-1/3 w-20 sm:w-28 h-20 sm:h-28 opacity-25">
                <Lottie animationData={fallenLeaf3} loop={true} />
              </div>
              <div className="absolute -bottom-4 -right-4 w-20 sm:w-28 h-20 sm:h-28 opacity-25">
                <Lottie animationData={fallenLeaf} loop={true} />
              </div>
            </div>
            
            <div className="relative z-10">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Detail Acara
              </h2>
              <p className="text-green-100 mt-1 text-sm sm:text-base">Isi informasi acara dengan lengkap</p>
            </div>
          </div>

          <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
            {/* Basic Info Section */}
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2 sm:gap-3">
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 text-green-700 flex items-center justify-center text-xs sm:text-sm font-bold border border-green-200">1</span>
                Informasi Dasar
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Judul Acara <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <input 
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base bg-gray-50 focus:bg-white" 
                      placeholder="Contoh: Bersih-Bersih Taman RW 05" 
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Tanggal <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input 
                      type="date"
                      name="eventDate"
                      value={formData.eventDate}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base bg-gray-50 focus:bg-white"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Waktu <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input 
                      type="time"
                      name="eventTime"
                      value={formData.eventTime}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base bg-gray-50 focus:bg-white"
                      required
                    />
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Deskripsi</label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none text-sm sm:text-base bg-gray-50 focus:bg-white" 
                    rows={3} 
                    placeholder="Ceritakan tujuan acara, aturan yang perlu diikuti, dll." 
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6 sm:pt-8">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 text-green-700 flex items-center justify-center text-xs sm:text-sm font-bold border border-green-200">2</span>
                Detail Lokasi
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Alamat Lokasi atau Link Google Maps <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <input 
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleLocationChange}
                      required
                      className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base bg-gray-50 focus:bg-white"
                      placeholder="Jl. Raya Jakarta atau link Google Maps"
                    />
                  </div>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <span>💡</span> Paste link Google Maps - koordinat otomatis terdeteksi!
                  </p>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Pilih Lokasi di Peta <span className="text-red-500">*</span>
                  </label>
                  <p className="text-[10px] sm:text-xs text-gray-500 mb-2 sm:mb-3 flex items-center gap-1">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Klik pada peta untuk menentukan lokasi acara
                  </p>
                  <div className="rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm">
                    <Map 
                      center={coordinates || { lat: -6.2088, lng: 106.8456 }}
                      zoom={13}
                      height={300}
                      markers={coordinates ? [{ position: coordinates, title: formData.title || 'Lokasi Acara' }] : []}
                      onPickLocation={(pos) => {
                        setCoordinates(pos);
                        toast.success(`Lokasi dipilih: ${pos.lat.toFixed(6)}, ${pos.lng.toFixed(6)}`);
                      }}
                    />
                  </div>
                  {coordinates && (
                    <div className="mt-2 p-2.5 sm:p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                      <p className="text-xs sm:text-sm text-green-700 font-medium flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Koordinat: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
                      </p>
                    </div>
                  )}
                  {!coordinates && (
                    <div className="mt-2 p-2.5 sm:p-3 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl">
                      <p className="text-xs sm:text-sm text-amber-700 font-medium flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Klik peta untuk memilih lokasi
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6 sm:pt-8">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 text-green-700 flex items-center justify-center text-xs sm:text-sm font-bold border border-green-200">3</span>
                Pengaturan Peserta
              </h3>
              
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Maksimal Peserta (opsional)</label>
                <div className="relative w-full md:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <input 
                    type="number"
                    name="maxParticipants"
                    value={formData.maxParticipants}
                    onChange={handleInputChange}
                    className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base bg-gray-50 focus:bg-white" 
                    placeholder="Contoh: 50"
                    min="1"
                  />
                </div>
                <p className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs text-gray-500">Kosongkan jika tidak ada batasan</p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6 sm:pt-8">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 text-green-700 flex items-center justify-center text-xs sm:text-sm font-bold border border-green-200">4</span>
                Kategori Sampah
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                {['plastik', 'organik', 'kertas', 'logam', 'kaca', 'elektronik'].map((k) => (
                  <label 
                    key={k} 
                    className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 cursor-pointer transition-all text-sm sm:text-base ${
                      wasteCategories.includes(k)
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-400 text-green-700 font-medium shadow-sm'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-green-300 hover:bg-white'
                    }`}
                  >
                    <input 
                      type="checkbox"
                      checked={wasteCategories.includes(k)}
                      onChange={() => handleCategoryToggle(k)}
                      className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 rounded focus:ring-green-500"
                    />
                    <span className="capitalize">{k}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6 sm:pt-8">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-yellow-100 to-amber-100 text-yellow-700 flex items-center justify-center text-sm border border-yellow-200">🎁</span>
                Reward untuk Peserta
              </h3>
              
              <div className="bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 rounded-xl p-4 sm:p-6 border border-yellow-200">
                <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                  Hadiah atau Insentif (Opsional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                  </div>
                  <input 
                    type="text"
                    value={rewardInfo}
                    onChange={(e) => setRewardInfo(e.target.value)}
                    className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 border border-yellow-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all bg-white text-sm sm:text-base"
                    placeholder="Makan siang gratis, Goodie bag, Sertifikat, dll"
                  />
                </div>
                <p className="mt-2 sm:mt-3 text-[10px] sm:text-xs text-gray-600 flex items-start gap-1.5">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>Reward meningkatkan antusiasme peserta</span>
                </p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6 sm:pt-8">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 text-green-700 flex items-center justify-center text-xs sm:text-sm font-bold border border-green-200">5</span>
                Dokumentasi (Opsional)
              </h3>
              
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Foto Kondisi Lingkungan</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 sm:p-6 hover:border-green-400 hover:bg-green-50/30 transition-all cursor-pointer">
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      onChange={onImageChange} 
                      className="w-full text-xs sm:text-sm text-gray-600 file:mr-3 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200 cursor-pointer" 
                    />
                    <p className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs text-gray-500">PNG, JPG, atau JPEG hingga 2MB</p>
                    {images.length > 0 && (
                      <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-green-600 font-medium flex items-center gap-1">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {images.length} foto dipilih
                      </p>
                    )}
                  </div>
                  {imagePreviews.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 md:grid-cols-4 gap-3">
                      {imagePreviews.map((preview, idx) => (
                        <div key={idx} className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden shadow-sm border border-gray-300">
                          <img 
                            src={preview} 
                            alt={`Preview ${idx + 1}`} 
                            className="w-full h-full object-cover"
                            onLoad={(e) => console.log('Image loaded:', preview)}
                            onError={(e) => console.error('Image failed to load:', preview)}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Video Kondisi Lingkungan</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-green-500 transition-colors">
                    <input 
                      type="file" 
                      accept="video/*" 
                      multiple 
                      onChange={onVideoChange} 
                      className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer" 
                    />
                    <p className="mt-2 text-xs text-gray-500">MP4, MOV, atau AVI hingga 50MB</p>
                  </div>
                  {videoPreviews.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {videoPreviews.map((preview, idx) => (
                        <div key={idx} className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-sm">
                          <video src={preview} controls className="w-full h-full" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 sm:px-8 py-4 sm:py-6 border-t flex flex-col sm:flex-row gap-3 sm:justify-end">
            <motion.button 
              type="button" 
              onClick={(e) => handleSubmit(e as any, true)}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-5 sm:px-6 py-2.5 sm:py-3 text-gray-700 bg-white border-2 border-gray-300 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm sm:text-base"
            >
              Simpan Draf
            </motion.button>
            <motion.button 
              type="submit" 
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 sm:px-8 py-2.5 sm:py-3 text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/30 transition-all text-sm sm:text-base"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Menyimpan...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Terbitkan Acara
                </span>
              )}
            </motion.button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
