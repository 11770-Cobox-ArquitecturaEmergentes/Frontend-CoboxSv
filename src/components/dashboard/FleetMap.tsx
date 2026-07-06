import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { motion } from 'framer-motion';
import { DashboardCard } from './DashboardCard';
import { fleetMarkers } from '@/data/dashboardData';
import type { FleetMarker } from '@/data/dashboardData';

const STATUS_STYLES: Record<FleetMarker['status'], { color: string; label: string }> = {
  en_ruta: { color: '#10B981', label: 'En ruta' },
  en_pausa: { color: '#F59E0B', label: 'En pausa' },
  estacionado: { color: '#2563EB', label: 'Estacionado' },
};

function createMarkerIcon(status: FleetMarker['status']): L.DivIcon {
  const { color } = STATUS_STYLES[status];
  return L.divIcon({
    className: 'custom-marker-icon',
    html: `<div style="
      width: 20px; height: 20px;
      background: ${color};
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.25);
    "></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -12],
  });
}

const statusIcons: Record<FleetMarker['status'], string> = {
  en_ruta: '🟢',
  en_pausa: '🟠',
  estacionado: '🔵',
};

export function FleetMap() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <DashboardCard
        title="Mapa de flota en tiempo real"
        subtitle="Ubicación actual de unidades activas"
        className="relative"
      >
        <div className="absolute right-6 top-6 z-[1000] flex gap-4 text-xs">
          {(Object.entries(statusIcons) as [FleetMarker['status'], string][]).map(([key, icon]) => (
            <span key={key} className="flex items-center gap-1 text-[#64748B]">
              {icon} {STATUS_STYLES[key].label}
            </span>
          ))}
        </div>
        <div className="h-80 w-full overflow-hidden rounded-xl">
          {mounted && (
            <MapContainer
              center={[-12.0583, -77.0469]}
              zoom={13}
              scrollWheelZoom={false}
              className="h-full w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.r.png"
              />
              {fleetMarkers.map((marker) => (
                <Marker
                  key={marker.id}
                  position={marker.position}
                  icon={createMarkerIcon(marker.status)}
                >
                  <Popup>
                    <div className="space-y-1 text-sm">
                      <p className="font-semibold text-[#0F172A]">{marker.name}</p>
                      <p className="text-[#64748B]">
                        Estado: {STATUS_STYLES[marker.status].label}
                      </p>
                      <p className="text-[#64748B]">Velocidad: {marker.speed} km/h</p>
                      <p className="text-[#64748B]">Última actualización: {marker.lastUpdate}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>
      </DashboardCard>
    </motion.div>
  );
}
