import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import { complaintsService } from '../services/api';

const getStatusColor = (status) => {
  const s = (status || '').toLowerCase();
  switch (s) {
    case 'resuelto': 
    case 'resuelta': 
      return { bg: '#dcfce7', text: '#166534', dot: '#22c55e', label: 'Resuelto' };
    case 'en_revision': 
    case 'en revisión': 
    case 'en progreso':
      return { bg: '#fef9c3', text: '#854d0e', dot: '#eab308', label: 'En Revisión' };
    case 'urgente': 
    case 'pendiente':
      return { bg: '#fee2e2', text: '#991b1b', dot: '#ef4444', label: 'Urgente' };
    default: 
      return { bg: '#f1f5f9', text: '#475569', dot: '#64748b', label: status }; 
  }
};

export default function ComplaintDetails({ complaintId, onBack }) {
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const response = await complaintsService.getById(complaintId);
        if (response.success) {
          setComplaint(response.data);
        }
      } catch (error) {
        console.error("Error cargando detalle:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [complaintId]);

  if (loading) {
    return (
      <div style={{ padding: '100px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>Cargando detalles de la denuncia...</p>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div style={{ padding: '100px', textAlign: 'center' }}>
        <p>No se encontró la información solicitada.</p>
        <Button onClick={onBack} style={{ backgroundColor: 'var(--deep-blue)', color: 'white' }}>Volver al inicio</Button>
      </div>
    );
  }

  const statusColors = getStatusColor(complaint.estado);
  const displayLocation = typeof complaint.ubicacion === 'object' 
    ? (complaint.ubicacion.address || complaint.ubicacion.direccion)
    : (complaint.ubicacion || 'Ubicación no especificada');

  const displayImage = (complaint.evidencias && complaint.evidencias.length > 0)
    ? `http://localhost:5000/uploads/${complaint.evidencias[0]}`
    : 'https://images.unsplash.com/photo-1562512685-2e6f2cb66258?q=80&w=800';

  return (
    <div style={{ backgroundColor: 'var(--bg-body)', minHeight: '100vh' }}>
      <main className="container" style={{ paddingBottom: '80px' }}>
        
        {/* CABECERA CON BOTÓN MEJORADO Y EFECTOS */}
        <div style={{ padding: '40px 0 20px 0' }}>
          <Button 
            onClick={onBack}
            style={{ 
              backgroundColor: 'var(--deep-blue)', 
              color: 'white', 
              padding: '12px 24px',
              borderRadius: '12px',
              fontSize: '1.05rem',
              fontWeight: 700,
              border: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(30, 58, 138, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2563eb';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--deep-blue)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Volver al inicio
          </Button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' }}>
          
          <div>
            <div className="profile-card">
              <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '24px', height: '250px', backgroundColor: '#e2e8f0' }}>
                <img src={displayImage} alt="Evidencia" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {/* ← CAMBIO AQUÍ */}
                    {complaint.categoria_titulo || complaint.categoria_slug || 'Categoría no especificada'}
                  </span>
                  <span style={{ backgroundColor: statusColors.bg, color: statusColors.text, padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' }}>
                    {statusColors.label}
                  </span>
                </div>
                <h1 style={{ fontSize: '1.8rem', margin: 0, color: 'var(--deep-blue)', fontWeight: 800, lineHeight: 1.2 }}>
                  {complaint.titulo}
                </h1>
                <p style={{ margin: '12px 0 0 0', color: 'var(--vibrant-blue)', fontWeight: 700, fontSize: '1.1rem' }}>
                  Código: <span style={{fontFamily: 'monospace'}}>{complaint.codigo_seguimiento}</span>
                </p>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '20px 0' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* DISEÑO DE PLACA IGUAL AL DE DESCRIPCIÓN */}
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Número de Placa
                  </label>
                  <p style={{ 
                    margin: '4px 0 0 0', 
                    color: 'var(--deep-blue)', 
                    fontWeight: 800, 
                    fontSize: '1.3rem', 
                    fontFamily: 'monospace',
                    letterSpacing: '1px'
                  }}>
                    {complaint.placa ? complaint.placa.toUpperCase() : 'NO REGISTRADA'}
                  </p>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Descripción</label>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--deep-blue)', lineHeight: 1.6 }}>{complaint.descripcion}</p>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Ubicación</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', color: 'var(--deep-blue)', fontWeight: 500 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    {displayLocation}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="profile-card">
              <h3 style={{ fontSize: '1.3rem', color: 'var(--deep-blue)', fontWeight: 700, marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid var(--light-gray)' }}>
                Seguimiento del Caso
              </h3>

              <div className="timeline" style={{ position: 'relative', paddingLeft: '10px' }}>
                <div style={{ position: 'absolute', left: '19px', top: '10px', bottom: '30px', width: '2px', backgroundColor: '#e2e8f0' }}></div>

                <div style={{ display: 'flex', gap: '20px', marginBottom: '32px', position: 'relative' }}>
                  <div style={{ 
                    width: '20px', height: '20px', borderRadius: '50%', 
                    backgroundColor: 'var(--vibrant-blue)', 
                    border: '4px solid white', 
                    boxShadow: '0 0 0 2px var(--vibrant-blue)',
                    zIndex: 1, flexShrink: 0 
                  }}></div>

                  <div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: 'var(--deep-blue)', fontWeight: 700 }}>
                      Reporte Recibido
                    </h4>
                    <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 500 }}>
                      {new Date(complaint.fecha_creacion).toLocaleString()}
                    </span>
                    <p style={{ margin: 0, fontSize: '0.95rem', color: '#475569', lineHeight: 1.5 }}>
                      La denuncia ha sido ingresada con éxito. El vehículo reportado tiene la placa <strong>{complaint.placa || 'N/A'}</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}