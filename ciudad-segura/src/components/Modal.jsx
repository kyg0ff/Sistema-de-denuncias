import React from 'react';
import Button from './Button';

export default function Modal({ isOpen, onClose, title, message }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(14, 42, 59, 0.5)', // Fondo oscuro semitransparente (Tu azul oscuro)
      backdropFilter: 'blur(4px)', // Efecto borroso moderno
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 2000, animation: 'fadeIn 0.2s ease-out'
    }} onClick={onClose}>
      
      <div style={{
        backgroundColor: 'white', 
        borderRadius: '24px', 
        padding: '40px', 
        maxWidth: '400px', 
        width: '90%',
        textAlign: 'center',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        transform: 'scale(1)',
        animation: 'scaleUp 0.2s ease-out'
      }} onClick={(e) => e.stopPropagation()}>
        
        {/* Icono de Éxito animado o estático */}
        <div style={{ 
          width: '64px', height: '64px', margin: '0 auto 24px', 
          backgroundColor: '#dcfce7', color: '#16a34a', 
          borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>

        <h3 style={{ margin: '0 0 12px 0', fontSize: '1.5rem', color: 'var(--deep-blue)', fontWeight: 800 }}>
          {title}
        </h3>
        
        <p style={{ margin: '0 0 32px 0', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          {message}
        </p>

        <Button 
          onClick={onClose} 
          style={{ 
            width: '100%', backgroundColor: 'var(--medium-blue)', color: 'white' 
          }}
        >
          Entendido
        </Button>

      </div>
    </div>
  );
}