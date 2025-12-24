import React from 'react';

/**
 * COMPONENTE: ComplaintCard
 * Muestra un resumen de la denuncia en la cuadrícula principal.
 * Corregido para manejar objetos de ubicación y mostrar imágenes del servidor.
 */
export default function ComplaintCard({ item, onClick }) {
  
  // 1. Lógica de Estilos de Estado (Mantenida de tu original + soporte backend)
  const getStatusStyles = (status) => {
    // Normalizamos a minúsculas para que 'Pendiente' coincida con 'pendiente'
    const s = (status || '').toLowerCase();
    switch(s) {
      case 'urgente': 
      case 'pendiente':
        return { bg: '#fee2e2', color: '#dc2626', border: '#fecaca', label: 'Urgente' };
      case 'en progreso':
      case 'en_revision':
      case 'revision':
        return { bg: '#fff7ed', color: '#ea580c', border: '#fed7aa', label: 'En Revisión' };
      case 'resuelta':
      case 'resuelto':
        return { bg: '#dcfce7', color: '#16a34a', border: '#bbf7d0', label: 'Resuelta' };
      default: 
        return { bg: 'var(--light-gray)', color: 'var(--deep-blue)', border: 'var(--soft-blue)', label: status || 'Pendiente' };
    }
  };
  
  const badge = getStatusStyles(item.status || item.estado);

  return (
    <div 
      onClick={() => onClick && onClick(item.id)}
      className="card-hover-effect" 
      style={{ 
        width: '100%', background: 'white', borderRadius: '16px', overflow: 'hidden',
        cursor: 'pointer', display: 'flex', flexDirection: 'column',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s ease'
      }}
    >
      {/* SECCIÓN DE IMAGEN (Con soporte para el servidor real) */}
      <div className="img-placeholder" style={{ height: '200px', position: 'relative', background: '#f1f5f9' }}>
        {item.evidencias && item.evidencias.length > 0 ? (
          // Si hay fotos reales en el servidor
          <img 
            src={`http://localhost:5000/uploads/${item.evidencias[0]}`} 
            alt={item.title || item.titulo} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        ) : item.img ? (
          // Si es un dato de prueba con URL externa
          <img src={item.img} alt={item.title || item.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          // Placeholder si no hay imagen
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#cbd5e1' }}>
             <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
             </svg>
          </div>
        )}
        
        {/* Badge de Categoría (Mantenido igual) */}
        <span style={{ 
          position: 'absolute', top: 16, left: 16, padding: '6px 12px', 
          background: 'white', color: 'var(--deep-blue)', borderRadius: '8px', 
          fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)', zIndex: 2, 
          borderBottom: '3px solid var(--vibrant-blue)' 
        }}>
          {item.category || item.categoria || 'General'}
        </span>
      </div>

      {/* CUERPO DE LA TARJETA */}
      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ 
            padding: '4px 10px', borderRadius: '20px', fontSize: '12px', 
            fontWeight: '700', backgroundColor: badge.bg, color: badge.color, 
            border: `1px solid ${badge.border}` 
          }}>
            {badge.label}
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
             {item.fecha_creacion ? 'Nuevo' : 'Hace 2h'}
          </span>
        </div>
        
        <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: 700, lineHeight: 1.4, color: 'var(--deep-blue)' }}>
          {item.titulo || item.title}
        </h3>
        
        {/* SECCIÓN DE UBICACIÓN (Aquí está la corrección principal) */}
        <div className="flex-row" style={{ color: 'var(--text-muted)', fontSize: '14px', gap: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {/* Si es objeto, muestra .address. Si es string, lo muestra tal cual */}
            {typeof item.ubicacion === 'object' 
              ? (item.ubicacion?.address || 'Ubicación registrada') 
              : (item.location || item.ubicacion || 'Cusco, Perú')}
          </span>
        </div>

        {/* Decoración inferior (Opcional, mantiene tu estilo) */}
        <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #f8fafc', display: 'flex', justifyContent: 'flex-end' }}>
             <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--vibrant-blue)' }}>Ver reporte →</span>
        </div>
      </div>
    </div>
  );
}