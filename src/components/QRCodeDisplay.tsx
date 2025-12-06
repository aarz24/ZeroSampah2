"use client";

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

export default function QRCodeDisplay({ 
  value, 
  size = 256 
}: { 
  value: string; 
  size?: number; 
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (canvasRef.current && value) {
      QRCode.toCanvas(canvasRef.current, value, { 
        width: size,
        margin: 2,
        color: {
          dark: '#166534', // green-800
          light: '#FFFFFF'
        }
      }, (err) => {
        if (err) setError('Failed to generate QR code');
      });
    }
  }, [value, size]);

  if (error) {
    return <div className="text-red-600 text-sm">{error}</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <canvas ref={canvasRef} className="rounded-lg border-4 border-green-600 shadow-lg" />
      <p className="mt-3 text-xs text-gray-600 text-center max-w-xs">
        Simpan atau screenshot QR code ini. Tunjukkan kepada panitia saat acara.
      </p>
    </div>
  );
}
