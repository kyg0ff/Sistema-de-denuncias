import React, { useState } from 'react';
import Button from '../components/Button';
import ComplaintTable from '../components/ComplaintTable';
import Modal from '../components/Modal';

const InputGroup = ({ label, value, type = "text", disabled = false }) => (
  <div className="input-group">
    <label>{label}</label>
    <div className={`input-wrapper ${disabled ? 'disabled' : ''}`}>
      <input type={type} defaultValue={value} disabled={disabled} />
      {!disabled && (
        <span className="input-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
        </span>
      )}
    </div>
  </div>
);

// AHORA RECIBIMOS 'onViewDetails' aquí
export default function Profile({ onLogout, onBack, onViewDetails }) {
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const myComplaints = [
    { id: 'RPT-8821', date: '25 Nov 2024', time: '14:30', category: 'Vehículo mal estacionado', status: 'Resuelto' },
    { id: 'RPT-8822', date: '24 Nov 2024', time: '09:15', category: 'Alumbrado público', status: 'En Revisión' },
    { id: 'RPT-8823', date: '20 Nov 2024', time: '18:45', category: 'Basura acumulada', status: 'Pendiente' },
    { id: 'RPT-8824', date: '18 Nov 2024', time: '22:10', category: 'Ruidos molestos', status: 'Urgente' },
  ];

  const handleUpdate = () => {
    setShowUpdateModal(true);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-body)', minHeight: '100vh' }}>
      
      <main className="container" style={{ paddingBottom: '80px' }}>
        
        <div className="flex-between" style={{ padding: '40px 0 20px 0' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '15px', fontWeight: 600 }}>
            ← Volver al inicio
          </button>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '3rem', margin: '0 0 10px 0', color: 'var(--deep-blue)', letterSpacing: '-0.03em', fontWeight: 800 }}>
            Hola, Luis Fernando
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', margin: 0, maxWidth: '600px' }}>
            Bienvenido a tu panel ciudadano. Aquí puedes gestionar tu información personal y hacer seguimiento a tus reportes.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' }}>
          
          {/* COLUMNA 1: Datos Personales */}
          <div>
            <div className="profile-card">
              <div className="section-header">
                <h3>Mis Datos Personales</h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <InputGroup label="DNI" value="12345678" disabled={true} />
                <div className="form-grid-compact">
                  <InputGroup label="Nombre" value="Luis Fernando" disabled={true} />
                  <InputGroup label="Apellidos" value="Gallegos Ballon" disabled={true} />
                </div>
                <InputGroup label="Correo electrónico" value="luis.gallegos@gmail.com" />
                <InputGroup label="Teléfono" value="+51 987 654 321" />
                <InputGroup label="Dirección" value="Av. La Cultura 123, Cusco" />
                
                <div style={{ paddingTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                   <Button onClick={handleUpdate} style={{ backgroundColor: 'var(--medium-blue)', color: 'white', width: '100%' }}>
                     Actualizar Datos
                   </Button>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMNA 2: Historial de Reportes */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
             <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: 'var(--deep-blue)' }}>Historial de Reportes</h3>
                
                <Button 
                  onClick={onLogout}
                  style={{ backgroundColor: '#fff1f2', color: '#e11d48', border: '1px solid #fda4af', height: '36px', fontSize: '0.85rem', padding: '0 16px' }}
                  icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>}
                >
                  Cerrar sesión
                </Button>
             </div>
             
             <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
                {/* PASAMOS LA FUNCIÓN A LA TABLA */}
                <ComplaintTable data={myComplaints} onViewDetails={onViewDetails} />
             </div>
          </div>

        </div>
      </main>

      <Modal isOpen={showUpdateModal} onClose={() => setShowUpdateModal(false)} title="¡Datos Actualizados!" message="Tu información personal ha sido guardada correctamente en nuestro sistema." />

    </div>
  );
}