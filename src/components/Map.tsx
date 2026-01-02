"use client";

import { useEffect, useRef, useState } from "react";
import 'mapbox-gl/dist/mapbox-gl.css';

export type LatLng = { lat: number; lng: number };

export type MapMarker = {
  position: LatLng;
  title?: string;
  imageUrl?: string;
};

export default function Map({
  center,
  zoom = 13,
  height = 300,
  markers = [],
  onPickLocation,
}: {
  center: LatLng;
  zoom?: number;
  height?: number;
  markers?: MapMarker[];
  onPickLocation?: (pos: LatLng) => void;
}) {
  const divRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!divRef.current || mapRef.current) return;

    const mapboxgl = require('mapbox-gl');
    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    if (!accessToken) {
      setMapError("Token akses Mapbox tidak dikonfigurasi");
      setIsLoading(false);
      return;
    }

    try {
      mapboxgl.accessToken = accessToken;

      const map = new mapboxgl.Map({
        container: divRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [center.lng, center.lat],
        zoom: zoom,
      });

      map.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.on('load', () => {
        setIsLoading(false);
        
        // Add markers
        markersRef.current = markers.map((m) => {
          const el = document.createElement('div');
          el.className = 'marker';
          el.style.backgroundImage = 'url(https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png)';
          el.style.width = '30px';
          el.style.height = '40px';
          el.style.backgroundSize = '100%';
          el.style.cursor = 'pointer';

          const marker = new mapboxgl.Marker(el)
            .setLngLat([m.position.lng, m.position.lat])
            .addTo(map);

          if (m.title) {
            const popupHTML = `
              <div style="width: 220px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                ${m.imageUrl ? `
                  <img 
                    src="${m.imageUrl}" 
                    alt="Event Image" 
                    style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px 8px 0 0; display: block;"
                  />
                ` : ''}
                <div style="padding: 12px;">
                  <div style="font-weight: 700; font-size: 16px; color: #1f2937; margin-bottom: 8px; line-height: 1.2; white-space: normal;">${m.title.split('\n')[0]}</div>
                  <div style="font-size: 13px; color: #4b5563; white-space: normal; display: flex; align-items: flex-start; gap: 6px;">
                    <svg style="width: 16px; height: 16px; flex-shrink: 0; margin-top: 2px;" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path></svg>
                    <span>${m.title.split('\n')[1]?.substring(2)}</span>
                  </div>
                  <div style="font-size: 13px; color: #4b5563; white-space: normal; display: flex; align-items: center; gap: 6px; margin-top: 6px;">
                    <svg style="width: 16px; height: 16px; flex-shrink: 0;" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path></svg>
                    <span>${m.title.split('\n')[2]?.substring(2)}</span>
                  </div>
                </div>
              </div>
            `;

            const popup = new mapboxgl.Popup({ 
              offset: 35,
              closeButton: false,
              className: 'event-popup' // Add a class for custom styling
            }).setHTML(popupHTML);
            marker.setPopup(popup);
          }

          return marker;
        });

        // Handle click for location picking
        if (onPickLocation) {
          map.on('click', (e: any) => {
            const { lng, lat } = e.lngLat;
            onPickLocation({ lat, lng });
          });
        }
      });

      map.on('error', (e: any) => {
        console.error('Mapbox error:', e);
        setMapError('Gagal memuat peta');
        setIsLoading(false);
      });

      mapRef.current = map;

    } catch (err: any) {
      console.error("Map initialization error:", err);
      setMapError("Failed to initialize map: " + err.message);
      setIsLoading(false);
    }

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [center.lat, center.lng, zoom, markers.length, onPickLocation]);

  if (mapError) {
    return (
      <div style={{ width: "100%", height }} className="rounded-lg border bg-red-50 flex items-center justify-center">
        <div className="text-center p-6">
          <p className="text-sm text-red-700 font-semibold">Map unavailable</p>
          <p className="mt-1 text-xs text-red-600">{mapError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div style={{ width: "100%", height }} className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
      <div ref={divRef} style={{ width: "100%", height }} className="rounded-lg border" />
    </div>
  );
}
