import React from 'react';
import Button from './Button';

const developers = [
  { name: 'Nombre Apellido 1', role: 'Frontend Developer', email: 'dev1@ciudadsegura.com', phone: '+51 900 000 001' },
  { name: 'Nombre Apellido 2', role: 'Backend Developer', email: 'dev2@ciudadsegura.com', phone: '+51 900 000 002' },
  { name: 'Nombre Apellido 3', role: 'UI/UX Designer', email: 'dev3@ciudadsegura.com', phone: '+51 900 000 003' },
  { name: 'Nombre Apellido 4', role: 'Database Admin', email: 'dev4@ciudadsegura.com', phone: '+51 900 000 004' },
];

export default function ContactModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(14, 42, 59, 0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 2000, animation: 'fadeIn 0.2s ease-out'
    }} onClick={onClose}>
      
      <div style={{
        backgroundColor: 'white', borderRadius: '24px', padding: '40px',
        maxWidth: '800px', width: '90%', maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', position: 'relative',
        animation: 'scaleUp 0.2s ease-out'
      }} onClick={(e) => e.stopPropagation()}>
        
        {/* Botón Cerrar (X) */}
        <button onClick={onClose} style={{ 
          position: 'absolute', top: '24px', right: '24px', 
          background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' 
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"></path></svg>
        </button>

        <h2 style={{ textAlign: 'center', marginBottom: '10px', color: 'var(--deep-blue)', fontSize: '2rem', fontWeight: 800 }}>
          Contáctanos
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '40px' }}>
          El equipo de desarrollo detrás de CiudadSegura.
        </p>

        {/* Grid de Desarrolladores */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
          {developers.map((dev, index) => (
            <div key={index} style={{ 
              padding: '24px', borderRadius: '16px', border: '1px solid var(--border)',
              backgroundColor: '#f8fbff', textAlign: 'center', transition: 'transform 0.2s'
            }}>
              <div style={{ 
                width: '50px', height: '50px', margin: '0 auto 16px', borderRadius: '50%', 
                backgroundColor: 'var(--vibrant-blue)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{dev.name.charAt(0)}</span>
              </div>
              
              <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: 'var(--deep-blue)', fontWeight: 700 }}>
                {dev.name}
              </h3>
              <p style={{ margin: '0 0 16px 0', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {dev.role}
              </p>
              
              <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  {dev.email}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  {dev.phone}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <Button onClick={onClose} style={{ backgroundColor: 'var(--medium-blue)', color: 'white', padding: '0 40px' }}>
            Cerrar
          </Button>
        </div>

      </div>
    </div>
  );
}