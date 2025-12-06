"use client";

import { useEffect, useRef, useState } from "react";
import 'mapbox-gl/dist/mapbox-gl.css';

type LatLng = { lat: number; lng: number };

export type MapMarker = {
  position: LatLng;
  title?: string;
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
      setMapError("Mapbox access token not configured");
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
            const popup = new mapboxgl.Popup({ offset: 25 })
              .setHTML(`<div style="padding: 8px; max-width: 200px; white-space: pre-wrap;">${m.title}</div>`);
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
        setMapError('Failed to load map');
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
