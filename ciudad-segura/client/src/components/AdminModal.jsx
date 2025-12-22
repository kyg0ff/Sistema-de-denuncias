import React from 'react';

export default function AdminModal({ 
  title, 
  isOpen, 
  onClose, 
  children, 
  footer,
  width = '800px'  // Nuevo prop: ancho por defecto más grande
}) {
  if (!isOpen) return null;

  return (
    <div 
      className="admin-modal-overlay" 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px', // evita que toque los bordes en móvil
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      <div 
        className="admin-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
          width: '100%',
          maxWidth: width,        // Usa el prop width (por defecto 800px)
          maxHeight: '90vh',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Cabecera con título */}
        {title && (
          <div style={{
            padding: '28px 32px 20px',
            borderBottom: '1px solid #e2e8f0'
          }}>
            <h3 style={{
              margin: 0,
              fontSize: '1.6rem',
              fontWeight: 700,
              color: 'var(--deep-blue)'
            }}>
              {title}
            </h3>
          </div>
        )}

        {/* Contenido principal */}
        <div style={{
          padding: '32px',
          flex: 1,
          overflowY: 'auto'
        }}>
          {children}
        </div>

        {/* Footer con botones */}
        {footer && (
          <div style={{
            padding: '20px 32px',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            backgroundColor: '#f8fafc'
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}