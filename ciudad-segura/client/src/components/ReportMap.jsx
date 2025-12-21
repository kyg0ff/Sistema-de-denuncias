import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Configuración de iconos
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon, shadowUrl: iconShadow,
    iconSize: [25, 41], iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function LocationMarker({ position, setPosition }) {
  const map = useMapEvents({
    click(e) { setPosition(e.latlng); map.flyTo(e.latlng, map.getZoom()); },
    locationfound(e) { setPosition(e.latlng); map.flyTo(e.latlng, map.getZoom()); },
  });
  return position === null ? null : <Marker position={position}></Marker>;
}

export default function ReportMap({ position, setPosition, mapReady, setMapReady }) {
  
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => { setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setMapReady(true); },
        () => { setMapReady(true); }
      );
    } else { setMapReady(true); }
  }, [setPosition, setMapReady]);

  return (
    <div style={{ width: '100%', height: '350px', borderRadius: '12px', overflow: 'hidden', border: '2px solid var(--border)', position: 'relative', zIndex: 0 }}>
      {mapReady && (
        <MapContainer center={position} zoom={16} style={{ height: '100%', width: '100%' }}>
          <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationMarker position={position} setPosition={setPosition} />
        </MapContainer>
      )}
      <div style={{ position: 'absolute', bottom: '10px', left: '10px', zIndex: 1000, backgroundColor: 'white', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
      </div>
    </div>
  );
}