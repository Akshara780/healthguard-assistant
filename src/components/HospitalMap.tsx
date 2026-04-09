import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Hospital = {
  id: number;
  name: string;
  address: string;
  lat?: number;
  lon?: number;
  emergency: boolean;
  type?: string;
};

interface HospitalMapProps {
  hospitals: Hospital[];
  center?: { lat: number; lon: number };
  selectedId?: number | null;
  onSelect?: (id: number) => void;
}

// Fix default marker icon issue with bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const emergencyIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const defaultIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function HospitalMap({ hospitals, center, selectedId, onSelect }: HospitalMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current).setView(
        center ? [center.lat, center.lon] : [20, 0],
        center ? 13 : 2
      );
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(mapRef.current);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const validHospitals = hospitals.filter((h) => h.lat && h.lon);

    validHospitals.forEach((h) => {
      const marker = L.marker([h.lat!, h.lon!], {
        icon: h.emergency ? emergencyIcon : defaultIcon,
      })
        .addTo(map)
        .bindPopup(
          `<strong>${h.name}</strong><br/>${h.address}<br/>${h.type || ""}${h.emergency ? " 🚑 ER" : ""}`
        );

      marker.on("click", () => onSelect?.(h.id));
      markersRef.current.push(marker);
    });

    if (validHospitals.length > 0) {
      const group = L.featureGroup(markersRef.current);
      map.fitBounds(group.getBounds().pad(0.1));
    } else if (center) {
      map.setView([center.lat, center.lon], 13);
    }
  }, [hospitals, center, onSelect]);

  // Highlight selected marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedId) return;

    const validHospitals = hospitals.filter((h) => h.lat && h.lon);
    const idx = validHospitals.findIndex((h) => h.id === selectedId);
    if (idx >= 0 && markersRef.current[idx]) {
      markersRef.current[idx].openPopup();
      map.setView(markersRef.current[idx].getLatLng(), 15);
    }
  }, [selectedId, hospitals]);

  return (
    <div
      ref={containerRef}
      className="w-full h-[300px] md:h-[500px] rounded-lg border border-border overflow-hidden z-0"
    />
  );
}
