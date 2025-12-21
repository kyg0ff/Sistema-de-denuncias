import React from 'react';
import Button from '../components/Button';

const getStatusColor = (status) => {
  switch (status) {
    case 'Resuelto': return { bg: '#dcfce7', text: '#166534', dot: '#22c55e' };
    case 'En Revisión': return { bg: '#fef9c3', text: '#854d0e', dot: '#eab308' };
    case 'Urgente': return { bg: '#fee2e2', text: '#991b1b', dot: '#ef4444' };
    default: return { bg: '#f1f5f9', text: '#475569', dot: '#64748b' }; 
  }
};

export default function ComplaintDetails({ complaintId, onBack }) {
  const complaint = {
    id: complaintId, // Este ID ahora es el código (ej. D-2024-XXX)
    title: 'Vehículo mal estacionado en zona escolar',
    category: 'Infraestructura',
    description: 'Un vehículo gris está bloqueando la rampa de acceso para discapacitados frente al colegio San José. Lleva más de 2 horas ahí.',
    location: 'Av. La Cultura 800, Wanchaq',
    date: '25 Nov 2024',
    image: 'https://images.unsplash.com/photo-1562512685-2e6f2cb66258?q=80&w=800&auto=format&fit=crop',
    status: 'En Revisión',
    timeline: [
      { title: 'Asignación a Equipo de Tránsito', date: '25/11/2025 11:45 AM', desc: 'Se envió notificación automática al equipo responsable de Wanchaq.' },
      { title: 'Validación OK y Cambio de Estado', date: '25/11/2025 10:45 AM', desc: 'Reporte aceptado. Evidencia y ubicación confirmada.' },
      { title: 'Denuncia Recibida', date: '25/11/2025 10:30 AM', desc: 'Denuncia ingresada por: Luis F. Gallegos.' }
    ]
  };

  const statusColors = getStatusColor(complaint.status);

  return (
    <div style={{ backgroundColor: 'var(--bg-body)', minHeight: '100vh' }}>
      <main className="container" style={{ paddingBottom: '80px' }}>
        
        <div style={{ padding: '40px 0 20px 0' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '15px', fontWeight: 600 }}>
            ← Volver
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' }}>
          
          <div>
            <div className="profile-card">
              <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '24px', height: '250px', backgroundColor: '#e2e8f0' }}>
                <img src={complaint.image} alt="Evidencia" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {complaint.category}
                  </span>
                  <span style={{ backgroundColor: statusColors.bg, color: statusColors.text, padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' }}>
                    {complaint.status}
                  </span>
                </div>
                <h1 style={{ fontSize: '1.8rem', margin: 0, color: 'var(--deep-blue)', fontWeight: 800, lineHeight: 1.2 }}>
                  {complaint.title}
                </h1>
                
                {/* CAMBIO AQUÍ: Etiqueta actualizada */}
                <p style={{ margin: '12px 0 0 0', color: 'var(--vibrant-blue)', fontWeight: 700, fontSize: '1.1rem' }}>
                  Código de Seguimiento: <span style={{fontFamily: 'monospace', fontSize: '1.2rem'}}>{complaint.id}</span>
                </p>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '20px 0' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Descripción</label>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--deep-blue)', lineHeight: 1.6 }}>{complaint.description}</p>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Ubicación</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', color: 'var(--deep-blue)', fontWeight: 500 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    {complaint.location}
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

                {complaint.timeline.map((event, index) => (
                  <div key={index} style={{ display: 'flex', gap: '20px', marginBottom: '32px', position: 'relative' }}>
                    <div style={{ 
                      width: '20px', height: '20px', borderRadius: '50%', 
                      backgroundColor: index === 0 ? 'var(--vibrant-blue)' : 'var(--soft-blue)', 
                      border: '4px solid white', 
                      boxShadow: '0 0 0 2px ' + (index === 0 ? 'var(--vibrant-blue)' : '#cbd5e1'),
                      zIndex: 1, flexShrink: 0 
                    }}></div>

                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: 'var(--deep-blue)', fontWeight: 700 }}>
                        {event.title}
                      </h4>
                      <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 500 }}>
                        {event.date}
                      </span>
                      <p style={{ margin: 0, fontSize: '0.95rem', color: '#475569', lineHeight: 1.5 }}>
                        {event.desc}
                      </p>
                    </div>
                  </div>
                ))}
                
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}