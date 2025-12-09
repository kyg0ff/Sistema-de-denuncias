import React from 'react';
import Button from './Button';

export default function AnonymousModal({ isOpen, onClose, onLogin, onContinueAnonymous }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(14, 42, 59, 0.7)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 2000, animation: 'fadeIn 0.2s ease-out'
    }} onClick={onClose}>
      
      <div style={{
        backgroundColor: 'white', borderRadius: '24px', padding: '40px',
        maxWidth: '500px', width: '90%', textAlign: 'center',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', position: 'relative',
        animation: 'scaleUp 0.2s ease-out'
      }} onClick={(e) => e.stopPropagation()}>
        
        <div style={{ marginBottom: '24px', color: 'var(--deep-blue)' }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        </div>

        <h2 style={{ fontSize: '1.8rem', color: 'var(--deep-blue)', fontWeight: 800, margin: '0 0 16px 0' }}>
          ¿Cómo deseas reportar?
        </h2>
        
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px', lineHeight: 1.6 }}>
          Para garantizar la calidad del servicio, el sistema maneja dos niveles de atención.
        </p>

        {/* Tarjeta de Advertencia para Anónimos */}
        <div style={{ 
          backgroundColor: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '12px', 
          padding: '16px', marginBottom: '32px', textAlign: 'left', display: 'flex', gap: '12px'
        }}>
          <div style={{ color: '#c2410c', flexShrink: 0, marginTop: '2px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          </div>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#9a3412', lineHeight: 1.4 }}>
            <strong>Nota sobre reporte anónimo:</strong> El tiempo de resolución será mayor que el de un usuario registrado, ya que se debe enviar un supervisor físico para confirmar el reporte antes de procesarlo.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Button 
            onClick={onLogin} 
            style={{ width: '100%', backgroundColor: 'var(--deep-blue)', color: 'white', height: '48px' }}
          >
            Iniciar Sesión (Recomendado)
          </Button>
          
          <Button 
            onClick={onContinueAnonymous} 
            variant="ghost"
            style={{ width: '100%', color: 'var(--text-muted)', border: '1px solid var(--border)', height: '48px' }}
          >
            Continuar como Anónimo
          </Button>
        </div>

      </div>
    </div>
  );
}