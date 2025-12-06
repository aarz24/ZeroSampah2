"use client";

import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { CheckCircle, XCircle, Scan, Camera } from 'lucide-react';

interface ScanResult {
  status: 'success' | 'error' | 'duplicate';
  message: string;
  userName?: string;
}

export default function QRScanner({ 
  eventId,
  onVerified 
}: { 
  eventId: string;
  onVerified?: (userId: string) => void;
}) {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const qrCodeRegionId = "qr-reader";

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  const startScanning = async () => {
    setCameraError(null);
    setScanning(true); // Set scanning first to render the div
    
    // Wait for the DOM element to be ready
    await new Promise(resolve => setTimeout(resolve, 100));
    
    try {
      // Check if the element exists
      const element = document.getElementById(qrCodeRegionId);
      if (!element) {
        throw new Error('Scanner element not found. Please try again.');
      }

      // Check if camera permissions are available first
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Request camera permission explicitly
        await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      }

      const scanner = new Html5Qrcode(qrCodeRegionId);
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" }, // Use back camera
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        async (decodedText) => {
          // Stop scanning immediately after successful scan
          await scanner.stop();
          setScanning(false);
          
          await handleScan(decodedText);
        },
        (errorMessage) => {
          // Ignore continuous scan errors
          console.log(errorMessage);
        }
      );

    } catch (err: any) {
      console.error("Scanner error:", err);
      
      let errorMsg = "Tidak dapat mengakses kamera.";
      
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        errorMsg = "Akses kamera ditolak. Silakan izinkan akses kamera di pengaturan browser Anda.";
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        errorMsg = "Kamera tidak ditemukan di perangkat Anda.";
      } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
        errorMsg = "Kamera sedang digunakan aplikasi lain. Tutup aplikasi lain dan coba lagi.";
      } else if (err.name === "OverconstrainedError") {
        errorMsg = "Kamera tidak mendukung mode yang diminta.";
      } else if (err.name === "NotSupportedError") {
        errorMsg = "Browser Anda tidak mendukung akses kamera. Gunakan browser modern seperti Chrome atau Safari.";
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      setCameraError(errorMsg);
      setScanning(false);
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current?.isScanning) {
      await scannerRef.current.stop();
    }
    setScanning(false);
  };

  const handleScan = async (data: string) => {
    try {
      // Expected format: "EVENT:eventId:userId:timestamp"
      const parts = data.split(':');
      if (parts[0] !== 'EVENT' || parts[1] !== eventId) {
        setResult({
          status: 'error',
          message: 'QR code tidak valid untuk acara ini'
        });
        return;
      }

      const userId = parts[2];
      
      // Call API to verify attendance
      const response = await fetch(`/api/events/${eventId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, qrData: data })
      });

      const verifyResult = await response.json();

      if (response.ok) {
        setResult({
          status: 'success',
          message: 'Kehadiran berhasil diverifikasi!',
          userName: verifyResult.userName
        });
        onVerified?.(userId);
      } else if (response.status === 409) {
        setResult({
          status: 'duplicate',
          message: 'Peserta sudah pernah diverifikasi'
        });
      } else {
        setResult({
          status: 'error',
          message: verifyResult.error || 'Gagal memverifikasi'
        });
      }
    } catch {
      setResult({
        status: 'error',
        message: 'Terjadi kesalahan sistem'
      });
    }

    // Auto-reset after 3 seconds
    setTimeout(() => {
      setResult(null);
    }, 3000);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-center flex items-center justify-center gap-2">
          <Camera className="w-5 h-5" />
          Scan QR Code Peserta
        </h3>
        
        {!scanning && !result && (
          <div className="space-y-3">
            <button
              onClick={startScanning}
              className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 transition-colors"
            >
              <Scan className="w-5 h-5" />
              Mulai Scan
            </button>
            
            {cameraError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm font-semibold text-red-700 mb-2">⚠️ {cameraError}</p>
                <div className="text-xs text-red-600 space-y-1 mt-2">
                  <p className="font-semibold">Cara mengizinkan akses kamera:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Chrome/Android:</strong> Klik ikon kunci/info di samping URL → Izin → Kamera → Izinkan</li>
                    <li><strong>Safari/iPhone:</strong> Pengaturan → Safari → Kamera → Izinkan</li>
                    <li><strong>HTTPS Required:</strong> Pastikan mengakses via HTTPS atau localhost</li>
                  </ul>
                </div>
              </div>
            )}
            
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
              <p className="font-semibold mb-1">💡 Tips:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Pastikan browser memiliki izin kamera</li>
                <li>Gunakan HTTPS atau akses dari jaringan lokal yang sama</li>
                <li>Refresh halaman jika error berlanjut</li>
              </ul>
            </div>
          </div>
        )}

        {scanning && (
          <div className="space-y-3">
            <div id={qrCodeRegionId} className="relative rounded-lg overflow-hidden border-2 border-green-600"></div>
            <button
              onClick={stopScanning}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Batal
            </button>
            <p className="text-xs text-center text-gray-500">
              Arahkan kamera ke QR code peserta
            </p>
          </div>
        )}

        {result && (
          <div className={`p-4 rounded-lg ${
            result.status === 'success' 
              ? 'bg-green-50 border border-green-200' 
              : result.status === 'duplicate'
              ? 'bg-yellow-50 border border-yellow-200'
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center gap-3">
              {result.status === 'success' ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : (
                <XCircle className="w-8 h-8 text-red-600" />
              )}
              <div>
                <p className={`font-medium ${
                  result.status === 'success' 
                    ? 'text-green-800' 
                    : result.status === 'duplicate'
                    ? 'text-yellow-800'
                    : 'text-red-800'
                }`}>
                  {result.message}
                </p>
                {result.userName && (
                  <p className="text-sm text-gray-600 mt-1">Peserta: {result.userName}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
