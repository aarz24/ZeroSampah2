'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Trash2, MapPin, Calendar, Weight, ArrowLeft, Leaf, Clock, AlertTriangle, Recycle, DollarSign, Lightbulb, Info } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import type { Report } from '@/lib/types'
// Fetch report details from server API
import Loader from '@/components/Loader'
import Image from "next/image";

export default function ViewReportPage() {
  const params = useParams()
  const reportId = parseInt(params.id as string)
  
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReportDetails = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/reports/${reportId}`);
        const reportData = await res.json();
        setReport(reportData)
      } catch (err) {
        console.error('Error fetching report details:', err)
        setError(err instanceof Error ? err.message : 'Failed to load report details')
        toast.error('Failed to load report details')
      } finally {
        setLoading(false)
      }
    }

    if (reportId) {
      fetchReportDetails()
    }
  }, [reportId])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader />
          <p className="text-sm text-gray-500">Loading report details...</p>
        </div>
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="p-8 mx-auto max-w-3xl">
        <div className="p-4 bg-red-50 rounded-md">
          <h2 className="text-lg font-medium text-red-800">Error</h2>
          <p className="mt-1 text-sm text-red-700">{error || 'Report not found'}</p>
          <Link 
            href="/collect" 
            className="inline-flex items-center mt-4 text-sm font-medium text-green-600 hover:text-green-500"
          >
            <ArrowLeft className="mr-1 w-4 h-4" />
            Back to Collection Tasks
          </Link>
        </div>
      </div>
    )
  }

  // Parse verification result if it exists
  const verificationResult = report.verificationResult ? 
    (() => {
      try {
        return typeof report.verificationResult === 'string' 
          ? JSON.parse(report.verificationResult) 
          : report.verificationResult;
      } catch (e) {
        console.error('Failed to parse verificationResult:', e);
        return null;
      }
    })() : 
    null;

  // Format date
  const formattedDate = report.createdAt ? 
    new Date(report.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) : 
    'No date available';

  return (
    <div className="bg-gray-50 mi-4n-h-screen">
      <div className="w-full">
        <div className="bg-white shadow-sm">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
            </div>
          </div>
        </div>
        
        <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center px-3 py-2 mb-4 text-sm font-medium text-gray-700 transition-colors hover:text-green-600"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Kembali ke Dashboard
          </Link>
          <div className="overflow-hidden bg-white rounded-lg shadow-sm">
            <div className="px-6 py-5 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900">Detail Laporan Sampah</h1>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div className="space-y-6">
                  <div className="overflow-hidden bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="px-4 py-5 bg-gray-50 border-b border-gray-200 sm:px-6">
                      <h2 className="text-lg font-medium text-gray-900">Informasi Laporan</h2>
                    </div>
                    <div className="px-4 py-5 sm:p-6">
                      <div className="space-y-6">
                        <div className="flex items-start">
                          <MapPin className="flex-shrink-0 mt-1 mr-3 w-5 h-5 text-green-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">Lokasi</p>
                            <a 
                              href={report.location}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-1 text-sm text-green-600 transition-colors hover:text-green-500"
                            >
                              Lihat di Google Maps
                            </a>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <Trash2 className="flex-shrink-0 mt-1 mr-3 w-5 h-5 text-green-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">Jenis Sampah</p>
                            <p className="mt-1 text-base text-gray-900">{report.wasteType}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <Weight className="flex-shrink-0 mt-1 mr-3 w-5 h-5 text-green-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">Jumlah</p>
                            <p className="mt-1 text-base text-gray-900">{report.amount || 'Tidak tersedia'}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <Calendar className="flex-shrink-0 mt-1 mr-3 w-5 h-5 text-green-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">Tanggal Laporan</p>
                            <p className="mt-1 text-base text-gray-900">{formattedDate}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-hidden bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="px-4 py-5 bg-gray-50 border-b border-gray-200 sm:px-6">
                      <h2 className="text-lg font-medium text-gray-900">Informasi Status</h2>
                    </div>
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${
                          report.status === 'pending' ? 'bg-yellow-400' :
                          report.status === 'in_progress' ? 'bg-blue-500' :
                          'bg-green-500'
                        }`}></div>
                        <p className="text-base font-medium text-gray-900">
                          {report.status === 'pending' ? 'Menunggu Pengumpulan' :
                           report.status === 'in_progress' ? 'Sedang Diproses' :
                           'Terverifikasi'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="overflow-hidden bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="px-4 py-5 bg-gray-50 border-b border-gray-200 sm:px-6">
                      <h2 className="text-lg font-medium text-gray-900">Gambar Sampah</h2>
                    </div>
                    <div className="px-4 py-5 sm:p-6">
                      {report.imageUrl ? (
                        <div className="overflow-hidden rounded-lg border border-gray-200">
                          <Image
                            src={report.imageUrl}
                            alt="Gambar sampah"
                            className="object-cover w-full h-full"
                            width={800}
                            height={600}
                          />
                        </div>
                      ) : (
                        <div className="flex justify-center items-center h-48 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-500">Tidak ada gambar</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
                
              {verificationResult && (
                <div className="mt-8">
                  <div className="overflow-hidden bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="px-4 py-5 bg-gray-50 border-b border-gray-200 sm:px-6">
                      <h2 className="text-lg font-medium text-gray-900">Analisis Sampah</h2>
                    </div>
                    <div className="px-4 py-5 sm:p-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                          <div className="flex items-center mb-3">
                            <Clock className="mr-2 w-5 h-5 text-green-600" />
                            <h3 className="font-medium text-gray-900">Waktu Penguraian</h3>
                          </div>
                          <p className="text-sm text-gray-700">{verificationResult.waktuPenguraian || verificationResult.decompositionTime || 'Tidak tersedia'}</p>
                        </div>
                        
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                          <div className="flex items-center mb-3">
                            <Info className="mr-2 w-5 h-5 text-blue-600" />
                            <h3 className="font-medium text-gray-900">Sumber Umum</h3>
                          </div>
                          <p className="text-sm text-gray-700">{verificationResult.sumberUmum || verificationResult.commonSources || 'Tidak tersedia'}</p>
                        </div>
                        
                        <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                          <div className="flex items-center mb-3">
                            <AlertTriangle className="mr-2 w-5 h-5 text-red-600" />
                            <h3 className="font-medium text-gray-900">Dampak Lingkungan</h3>
                          </div>
                          <p className="text-sm text-gray-700">{verificationResult.dampakLingkungan || verificationResult.environmentalImpact || 'Tidak tersedia'}</p>
                        </div>
                        
                        <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                          <div className="flex items-center mb-3">
                            <AlertTriangle className="mr-2 w-5 h-5 text-orange-600" />
                            <h3 className="font-medium text-gray-900">Bahaya Kesehatan</h3>
                          </div>
                          <p className="text-sm text-gray-700">{verificationResult.bahayaKesehatan || verificationResult.healthHazards || 'Tidak tersedia'}</p>
                        </div>
                        
                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                          <div className="flex items-center mb-3">
                            <Leaf className="mr-2 w-5 h-5 text-purple-600" />
                            <h3 className="font-medium text-gray-900">Jejak Karbon</h3>
                          </div>
                          <p className="text-sm text-gray-700">{verificationResult.jejakKarbon || verificationResult.carbonFootprint || 'Tidak tersedia'}</p>
                        </div>
                        
                        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                          <div className="flex items-center mb-3">
                            <DollarSign className="mr-2 w-5 h-5 text-yellow-600" />
                            <h3 className="font-medium text-gray-900">Dampak Ekonomi</h3>
                          </div>
                          <p className="text-sm text-gray-700">{verificationResult.dampakEkonomi || verificationResult.economicImpact || 'Tidak tersedia'}</p>
                        </div>
                        
                        <div className="p-4 bg-teal-50 rounded-lg border border-teal-100">
                          <div className="flex items-center mb-3">
                            <Lightbulb className="mr-2 w-5 h-5 text-teal-600" />
                            <h3 className="font-medium text-gray-900">Strategi Pengurangan Sampah</h3>
                          </div>
                          <p className="text-sm text-gray-700">{verificationResult.strategiPengurangan || verificationResult.wasteReductionStrategies || 'Tidak tersedia'}</p>
                        </div>
                        
                        <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                          <div className="flex items-center mb-3">
                            <Recycle className="mr-2 w-5 h-5 text-indigo-600" />
                            <h3 className="font-medium text-gray-900">Metode Daur Ulang & Pembuangan</h3>
                          </div>
                          <p className="text-sm text-gray-700">{verificationResult.metodeDaurUlang || verificationResult.recyclingDisposalMethods || 'Tidak tersedia'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 