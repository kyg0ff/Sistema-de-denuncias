import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Button from '../components/Button';

// Configuración de icono Leaflet (igual que antes)
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

function LocationMarker({ position, setPosition }) {
  const map = useMapEvents({
    click(e) { setPosition(e.latlng); map.flyTo(e.latlng, map.getZoom()); },
    locationfound(e) { setPosition(e.latlng); map.flyTo(e.latlng, map.getZoom()); },
  });
  return position === null ? null : <Marker position={position}></Marker>;
}

// AHORA RECIBIMOS 'onViewDetails'
export default function CreateReport({ onBack, onSubmitSuccess, onViewDetails }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');
  const [position, setPosition] = useState({ lat: -13.5167, lng: -71.9781 });
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => { setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setMapReady(true); },
        () => { setMapReady(true); }
      );
    } else { setMapReady(true); }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const code = 'D-' + Math.floor(100000 + Math.random() * 900000);
      setTrackingCode(code);
      setIsSubmitting(false);
      setShowSuccess(true);
    }, 1500);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    onSubmitSuccess();
  };

  // inputs y labels styles (igual que antes)
  const inputStyle = { width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: '#fcfdfe', color: 'var(--deep-blue)', fontSize: '1.1rem', fontWeight: 500, outline: 'none' };
  const labelStyle = { fontSize: '1rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' };

  return (
    <div style={{ backgroundColor: 'var(--bg-body)', minHeight: '100vh' }}>
      <main className="container" style={{ paddingBottom: '80px' }}>
        <div style={{ padding: '40px 0 20px 0' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 600 }}>← Cancelar y volver</button>
        </div>

        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ marginBottom: '40px', textAlign: 'center' }}>
            <h1 style={{ fontSize: '3rem', margin: '0 0 12px 0', color: 'var(--deep-blue)', fontWeight: 800 }}>Nuevo Reporte</h1>
            <p style={{ fontSize: '1.3rem', color: 'var(--text-muted)' }}>Ayúdanos a localizar y resolver el problema. Tu identidad está protegida.</p>
          </div>

          <form onSubmit={handleSubmit} className="profile-card" style={{ display: 'flex', flexDirection: 'column', gap: '40px', padding: '50px' }}>
            {/* ... (SECCIONES DE FORMULARIO IGUALES QUE ANTES) ... */}
            {/* Para no repetir código innecesario, asumo que el formulario interno es el mismo de la respuesta anterior */}
            
            {/* SECCIÓN 1 */}
            <div>
              <h3 className="section-header" style={{ fontSize: '1.5rem', marginBottom: '24px' }}>1. Detalles del Incidente</h3>
              <div className="form-grid">
                <div className="input-group">
                  <label style={labelStyle}>Categoría del Problema</label>
                  <div className="input-wrapper">
                    <select required style={inputStyle}><option value="">Selecciona una categoría...</option><option value="infraestructura">Infraestructura</option><option value="limpieza">Limpieza</option><option value="alumbrado">Alumbrado</option></select>
                  </div>
                </div>
                <div className="input-group">
                  <label style={labelStyle}>Distrito</label>
                  <div className="input-wrapper">
                    <select required style={inputStyle}><option value="">Selecciona tu distrito...</option><option value="cusco">Cusco</option></select>
                  </div>
                </div>
              </div>
              <div className="input-group" style={{ marginTop: '24px' }}>
                <label style={labelStyle}>Descripción Detallada</label>
                <div className="input-wrapper"><textarea required rows="4" placeholder="Describe qué está sucediendo..." style={{ ...inputStyle, fontFamily: 'inherit', resize: 'vertical' }}></textarea></div>
              </div>
            </div>

            {/* SECCIÓN 2 (MAPA) */}
            <div>
              <h3 className="section-header" style={{ fontSize: '1.5rem', marginBottom: '24px' }}>2. Ubicación Exacta</h3>
              <div className="input-group" style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>Dirección de Referencia</label>
                <div className="input-wrapper"><input type="text" placeholder="Ej. Frente al mercado..." required style={inputStyle} /></div>
              </div>
              <div style={{ width: '100%', height: '400px', borderRadius: '16px', overflow: 'hidden', border: '2px solid var(--border)', position: 'relative', zIndex: 0 }}>
                {mapReady && (
                  <MapContainer center={position} zoom={15} style={{ height: '100%', width: '100%' }}>
                    <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationMarker position={position} setPosition={setPosition} />
                  </MapContainer>
                )}
              </div>
            </div>

            {/* SECCIÓN 3 (FOTO) */}
            <div>
              <h3 className="section-header" style={{ fontSize: '1.5rem', marginBottom: '24px' }}>3. Evidencia</h3>
              <div style={{ border: '3px dashed var(--vibrant-blue)', borderRadius: '16px', padding: '40px', backgroundColor: '#f0f9ff', textAlign: 'center', cursor: 'pointer' }} className="upload-area">
                <p style={{ fontWeight: 700, color: 'var(--deep-blue)', fontSize: '1.2rem' }}>Haz clic o arrastra una imagen aquí</p>
              </div>
            </div>

            <div style={{ paddingTop: '30px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="submit" style={{ backgroundColor: 'var(--deep-blue)', color: 'white', width: '250px', height: '60px', fontSize: '1.2rem' }}>{isSubmitting ? 'Enviando...' : 'Enviar Reporte'}</Button>
            </div>
          </form>
        </div>
      </main>

      {/* MODAL DE ÉXITO ACTUALIZADO */}
      {showSuccess && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(14, 42, 59, 0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '50px', maxWidth: '500px', width: '90%', textAlign: 'center', boxShadow: '0 20px 25px rgba(0,0,0,0.2)', animation: 'scaleUp 0.3s ease-out' }}>
            <div style={{ width: '90px', height: '90px', margin: '0 auto 24px', backgroundColor: '#dcfce7', color: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h2 style={{ color: 'var(--deep-blue)', margin: '0 0 12px 0', fontSize: '2rem' }}>¡Reporte Enviado!</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '30px', fontSize: '1.1rem' }}>Hemos recibido tu denuncia correctamente.</p>
            
            <div style={{ backgroundColor: '#f1f5f9', padding: '20px', borderRadius: '16px', marginBottom: '40px', border: '2px dashed var(--border)' }}>
              <span style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Código de Seguimiento</span>
              <span style={{ display: 'block', fontSize: '2.5rem', fontWeight: 800, color: 'var(--deep-blue)', letterSpacing: '2px' }}>{trackingCode}</span>
            </div>

            {/* CAMBIO AQUÍ: DOS BOTONES */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Button 
                onClick={() => onViewDetails(trackingCode)} // Navega a detalles
                style={{ width: '100%', backgroundColor: 'var(--vibrant-blue)', color: 'white', height: '50px', fontSize: '1.1rem' }}
              >
                Ver Detalles
              </Button>
              <Button 
                onClick={handleCloseSuccess} 
                variant="ghost" // Estilo secundario para "salir"
                style={{ width: '100%', color: 'var(--text-muted)', height: '50px', fontSize: '1rem', border: '1px solid var(--border)' }}
              >
                Salir al Inicio
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}