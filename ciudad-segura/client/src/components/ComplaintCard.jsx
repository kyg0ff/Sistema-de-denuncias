import React from 'react';

/**
 * COMPONENTE: ComplaintCard
 * Representa una tarjeta de resumen para las denuncias en la cuadrícula principal.
 * * FUNCIONAMIENTO:
 * 1. Mapeo de Estados: Traduce el estado del backend (pendiente, resuelto, etc.) a colores semánticos.
 * 2. Carga Inteligente de Medios: Gestiona imágenes desde el servidor local, URLs externas o placeholders.
 * 3. Procesamiento de Ubicación: Detecta si la ubicación es un objeto de Google Maps o un texto simple.
 * 4. Interacción: Ejecuta la acción 'onClick' inyectada devolviendo el ID del registro seleccionado.
 */
export default function ComplaintCard({ item, onClick }) {
  
  // Función para determinar el estilo visual según la gravedad o estado del reporte
  const getStatusStyles = (status) => {
    // Normalizamos para evitar errores de mayúsculas/minúsculas del backend
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
        return { bg: 'var(--bg-body)', color: 'var(--deep-blue)', border: 'var(--border)', label: status || 'Pendiente' };
    }
  };
  
  const badge = getStatusStyles(item.status || item.estado);

  return (
    <div 
      onClick={() => onClick && onClick(item.id)}
      className="card-hover-effect" 
      style={{ 
        width: '100%', 
        backgroundColor: '#ffffff', 
        borderRadius: '16px', 
        overflow: 'hidden',
        cursor: 'pointer', 
        display: 'flex', 
        flexDirection: 'column',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s ease'
      }}
    >
      {/* 1. CABECERA: Visualización de Evidencia */}
      <div className="img-placeholder" style={{ height: '200px', position: 'relative', background: 'var(--bg-body)' }}>
        {item.evidencias && item.evidencias.length > 0 ? (
          // Caso A: Imagen alojada en el servidor propio
          <img 
            src={`http://localhost:5000/uploads/${item.evidencias[0]}`} 
            alt={item.titulo || item.title} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        ) : item.img ? (
          // Caso B: URL externa (datos de prueba o mocks)
          <img src={item.img} alt={item.titulo || item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          // Caso C: Sin imagen (Placeholder SVG)
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--border)' }}>
             <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
             </svg>
          </div>
        )}
        
        {/* Etiqueta flotante de Categoría */}
        <span style={{ 
          position: 'absolute', top: 16, left: 16, padding: '6px 12px', 
          backgroundColor: '#ffffff', color: 'var(--deep-blue)', borderRadius: '8px', 
          fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)', zIndex: 2, 
          borderBottom: '3px solid var(--vibrant-blue)' 
        }}>
          {item.categoria || item.category || 'General'}
        </span>
      </div>

      {/* 2. CONTENIDO: Información del Reporte */}
      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Fila de Metadatos (Estado y Fecha) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
          <span style={{ 
            padding: '4px 10px', borderRadius: '20px', fontSize: '11px', 
            fontWeight: 800, backgroundColor: badge.bg, color: badge.color, 
            border: `1px solid ${badge.border}`, textTransform: 'uppercase'
          }}>
            {badge.label}
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>
             {item.fecha_creacion ? new Date(item.fecha_creacion).toLocaleDateString() : 'Reciente'}
          </span>
        </div>
        
        <h3 style={{ 
          margin: '0 0 12px 0', 
          fontSize: '18px', 
          fontWeight: 800, 
          lineHeight: 1.3, 
          color: 'var(--deep-blue)',
          letterSpacing: '-0.01em'
        }}>
          {item.titulo || item.title}
        </h3>
        
        {/* SECCIÓN DE UBICACIÓN: Manejo de datos dinámicos */}
        <div style={{ 
          color: 'var(--text-muted)', 
          fontSize: '14px', 
          gap: '8px', 
          marginBottom: '16px', 
          display: 'flex', 
          alignItems: 'center' 
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {/* Validación de tipo: si es objeto (Google Maps) usa .address, si es string lo usa directo */}
            {typeof item.ubicacion === 'object' 
              ? (item.ubicacion?.address || item.ubicacion?.direccion || 'Ubicación registrada') 
              : (item.ubicacion || item.location || 'No especificada')}
          </span>
        </div>

      </div>
    </div>
  );
}