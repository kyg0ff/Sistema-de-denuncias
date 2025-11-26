import React from 'react';
import Button from './Button';

export default function Hero() {
  return (
    <div style={{ 
      borderRadius: '24px', overflow: 'hidden', minHeight: '500px', 
      position: 'relative', display: 'flex', alignItems: 'center', padding: '64px',
      marginTop: '32px',
      /* CAMBIO: Eliminado la sombra externa del Hero */
      // boxShadow: 'var(--shadow-lg)', 
      backgroundImage: 'url("https://cdn.pixabay.com/photo/2020/11/10/17/36/cusco-5730516_960_720.jpg")',
      backgroundSize: 'cover', backgroundPosition: 'center', color: 'white' 
    }}>
      <div style={{ 
        maxWidth: '650px', zIndex: 10, position: 'relative'
      }}>
        
        <h1 style={{ fontSize: '3.5rem', margin: '0 0 24px 0', lineHeight: 1.1, fontWeight: 800, color: 'white' }}>
          Transformemos Cusco,<br/> una ciudad segura.
        </h1>
        <p style={{ fontSize: '1.25rem', marginBottom: '40px', color: '#edf0f0', lineHeight: 1.6 }}>
          Conecta con tu ayuntamiento y vecinos para resolver incidencias urbanas. Rápido, transparente y efectivo.
        </p>
        <div className="flex-row">
          <Button variant="primary" style={{ height: '52px', padding: '0 32px', fontSize: '16px' }}>
            Reportar denuncia
          </Button>
          <Button style={{ 
            backgroundColor: 'var(--vibrant-blue)', color: 'white',
            height: '52px', padding: '0 32px', fontSize: '16px' 
          }}>
            Ver otras denuncias
          </Button>
        </div>
      </div>
    </div>
  );
}