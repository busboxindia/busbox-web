import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { config } from '../config';

interface Pt { lat: number; lng: number }

/** Mapbox map with drop pin + traveller pin. Only loaded when a Mapbox token is configured. */
export default function TrackMap({ drop, traveller }: { drop: Pt; traveller: Pt | null }) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const travellerMarker = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!config.mapboxToken || !el.current) return;
    mapboxgl.accessToken = config.mapboxToken;
    const m = new mapboxgl.Map({ container: el.current, style: 'mapbox://styles/mapbox/streets-v12', center: [drop.lng, drop.lat], zoom: 11 });
    m.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');
    new mapboxgl.Marker({ color: '#FF8A00' }).setLngLat([drop.lng, drop.lat]).addTo(m);
    map.current = m;
    return () => m.remove();
  }, [drop.lat, drop.lng]);

  useEffect(() => {
    const m = map.current;
    if (!m || !traveller) return;
    if (!travellerMarker.current) {
      const dot = document.createElement('div');
      dot.style.cssText = 'width:22px;height:22px;border-radius:50%;background:#16A34A;border:4px solid #fff;box-shadow:0 0 0 6px rgba(22,163,74,.25)';
      travellerMarker.current = new mapboxgl.Marker({ element: dot }).setLngLat([traveller.lng, traveller.lat]).addTo(m);
    } else {
      travellerMarker.current.setLngLat([traveller.lng, traveller.lat]);
    }
    const b = new mapboxgl.LngLatBounds().extend([drop.lng, drop.lat]).extend([traveller.lng, traveller.lat]);
    m.fitBounds(b, { padding: 60, maxZoom: 14, duration: 800 });
  }, [traveller?.lat, traveller?.lng, drop.lat, drop.lng]);

  return <div ref={el} className="track-map" />;
}
