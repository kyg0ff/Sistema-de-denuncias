import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Arreglo para que el icono del marcador se vea bien en Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Sub-componente para detectar clic y movimiento
const LocationMarker = ({ position, setPosition }) => {
    const markerRef = useRef(null);

    useMapEvents({
        click(e) {
            setPosition(e.latlng);
        },
    });

    return position === null ? null : (
        <Marker
            position={position}
            draggable={true}
            eventHandlers={{
                dragend: (e) => {
                    setPosition(e.target.getLatLng());
                },
            }}
            ref={markerRef}
        />
    );
};

const MapSelector = ({ onLocationSelect }) => {
    // Coordenadas de Cusco (Plaza de Armas) o geolocalización)
    const [position, setPosition] = useState({ lat: -13.5167, lng: -71.9781 }); 

    // Intentar obtener ubicación real del usuario al cargar
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const { latitude, longitude } = pos.coords;
                const newPos = { lat: latitude, lng: longitude };
                setPosition(newPos);
                onLocationSelect(newPos); // Avisar al padre
            });
        }
        // eslint-disable-next-line
    }, []);

    // Cada vez que se mueva el pin, avisar al formulario padre
    const handleSetPosition = (latlng) => {
        setPosition(latlng);
        onLocationSelect(latlng);
    };

    return (
        <div style={{ height: '300px', width: '100%', marginTop: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
            <MapContainer center={position} zoom={15} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                />
                <LocationMarker position={position} setPosition={handleSetPosition} />
            </MapContainer>
        </div>
    );
};

export default MapSelector;