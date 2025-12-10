"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import toast from 'react-hot-toast';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import dynamic from 'next/dynamic';
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => router.back()} 
          className="inline-flex items-center gap-2 text-sm font-medium text-green-700 hover:text-green-800 transition-colors mb-6 group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Kembali
        </button>
        
        {/* Hero with Animation */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-8">
          <div className="relative p-8 md:p-12">
            {/* Background Animation */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <DotLottieReact
                src="/animations/time.json"
                loop
                autoplay
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            
            {/* Content */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4 w-fit">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Waktunya Beraksi
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">Buat Aksi Bersih Komunitas</h1>
              <p className="text-lg text-gray-600 max-w-2xl">Ajak komunitas untuk membersihkan lingkungan bersama-sama. Setiap aksi kecil membuat perbedaan besar!</p>
            </div>
          </div>
        </div>

        <form onSubmit={(e) => handleSubmit(e, false)} className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">Detail Acara</h2>
            <p className="text-green-50 mt-1">Isi informasi acara dengan lengkap</p>
          </div>

          <div className="p-8 space-y-8">
            {/* Basic Info Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold">1</span>
                Informasi Dasar
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Judul Acara <span className="text-red-500">*</span>
                  </label>
                  <input 
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" 
                    placeholder="Contoh: Bersih-Bersih Taman RW 05" 
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Waktu <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="time"
                    name="eventTime"
                    value={formData.eventTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none" 
                    rows={4} 
                    placeholder="Ceritakan tujuan acara, aturan yang perlu diikuti, perlengkapan yang perlu dibawa, dll." 
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-8">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-6">
                <span className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold">2</span>
                Detail Lokasi
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alamat Lokasi atau Link Google Maps <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleLocationChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="Contoh: Jl. Raya Jakarta atau https://maps.app.goo.gl/xxx"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    💡 Bisa paste link Google Maps langsung - koordinat akan terdeteksi otomatis!
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cari Lokasi
                  </label>
                  <div className="mb-3">
                    <Geocoder
                      mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ''}
                      onSelected={(result: any) => {
                        const [lng, lat] = result.center;
                        setCoordinates({ lat, lng });
                        setFormData({ ...formData, location: result.place_name });
                        toast.success('Lokasi ditemukan!');
                      }}
                      viewport={{}}
                      hideOnSelect={true}
                      queryParams={{
                        country: 'id',
                        proximity: '106.8456,-6.2088' // Jakarta center
                      }}
                      position="top-left"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pilih Lokasi di Peta <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Klik pada peta untuk menentukan lokasi acara atau gunakan pencarian di atas.
                  </p>
                  <div className="rounded-lg overflow-hidden border-2 border-gray-300">
                    <Map 
                      center={coordinates || { lat: -6.2088, lng: 106.8456 }}
                      zoom={13}
                      height={400}
                      markers={coordinates ? [{ position: coordinates, title: formData.title || 'Lokasi Acara' }] : []}
                      onPickLocation={(pos) => {
                        setCoordinates(pos);
                        toast.success(`Lokasi dipilih: ${pos.lat.toFixed(6)}, ${pos.lng.toFixed(6)}`);
                      }}
                    />
                  </div>
                  {coordinates && (
                    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800">
                        ✓ Koordinat dipilih: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
                      </p>
                    </div>
                  )}
                  {!coordinates && (
                    <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        ⚠️ Pilih lokasi dengan mengklik pada peta
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t pt-8">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-6">
                <span className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold">3</span>
                Pengaturan Peserta
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Maksimal Peserta (opsional)</label>
                <input 
                  type="number"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleInputChange}
                  className="w-full md:w-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" 
                  placeholder="Contoh: 50"
                  min="1"
                />
                <p className="mt-2 text-xs text-gray-500">Kosongkan jika tidak ada batasan peserta</p>
              </div>
            </div>

            <div className="border-t pt-8">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-6">
                <span className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold">4</span>
                Kategori Sampah
              </h3>
              
              <div className="flex flex-wrap gap-3">
                {['plastik', 'organik', 'kertas', 'logam', 'kaca', 'elektronik'].map((k) => (
                  <label 
                    key={k} 
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all ${
                      wasteCategories.includes(k)
                        ? 'bg-green-50 border-green-500 text-green-700 font-medium'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-green-300'
                    }`}
                  >
                    <input 
                      type="checkbox"
                      checked={wasteCategories.includes(k)}
                      onChange={() => handleCategoryToggle(k)}
                      className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                    />
                    <span className="capitalize">{k}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t pt-8">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-6">
                <span className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center text-sm">🎁</span>
                Reward untuk Peserta
              </h3>
              
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 border-2 border-yellow-200">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Hadiah atau Insentif (Opsional)
                </label>
                <input 
                  type="text"
                  value={rewardInfo}
                  onChange={(e) => setRewardInfo(e.target.value)}
                  className="w-full px-4 py-3 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all bg-white"
                  placeholder="Contoh: Makan siang gratis, Goodie bag, Sertifikat keikutsertaan, Voucher belanja"
                />
                <p className="mt-3 text-sm text-gray-700 flex items-start gap-2">
                  <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>Reward dapat meningkatkan antusiasme peserta dan apresiasi atas kontribusi mereka dalam menjaga lingkungan</span>
                </p>
              </div>
            </div>

            <div className="border-t pt-8">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-6">
                <span className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold">5</span>
                Dokumentasi (Opsional)
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Foto Kondisi Lingkungan</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-green-500 transition-colors">
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      onChange={onImageChange} 
                      className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer" 
                    />
                    <p className="mt-2 text-xs text-gray-500">PNG, JPG, atau JPEG hingga 10MB</p>
                    {images.length > 0 && (
                      <p className="mt-2 text-sm text-green-600 font-medium">
                        ✓ {images.length} foto dipilih
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
          <div className="bg-gray-50 px-8 py-6 border-t flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button 
              type="button" 
              onClick={(e) => handleSubmit(e as any, true)}
              disabled={loading}
              className="px-6 py-3 text-gray-700 bg-white border-2 border-gray-300 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Simpan Draf
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-8 py-3 text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/30 transition-all"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Menyimpan...
                </span>
              ) : (
                '🚀 Terbitkan Acara'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
