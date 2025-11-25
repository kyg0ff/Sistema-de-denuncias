import React from 'react';

// Recibimos ahora dos funciones: para About y para Contact
export default function Footer({ onNavigateToAbout, onOpenContact }) {
  return (
    <footer style={{ padding: '60px 0', borderTop: '1px solid var(--border)', color: 'var(--text-muted)', backgroundColor: 'white', marginTop: 'auto' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <p style={{ fontWeight: 600, color: 'var(--text-main)', margin: '0 0 12px 0' }}>
          CiudadSegura &copy; 2024
        </p>
        <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', fontSize: '0.9rem' }}>
          <a href="#" style={{ textDecoration: 'none', color: 'var(--text-muted)' }}>Sobre el sistema</a>
          
          <button 
            onClick={(e) => { e.preventDefault(); onNavigateToAbout(); }} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'none', color: 'var(--text-muted)', fontSize: '0.9rem', fontFamily: 'inherit' }}
          >
            Acerca de nosotros
          </button>
          
          {/* CAMBIO: Botón Contáctanos */}
          <button 
            onClick={(e) => { e.preventDefault(); onOpenContact(); }} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'none', color: 'var(--text-muted)', fontSize: '0.9rem', fontFamily: 'inherit' }}
          >
            Contáctanos
          </button>
        </div>
      </div>
    </footer>
  );
}