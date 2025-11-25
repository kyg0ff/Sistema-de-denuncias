import React from 'react';

export default function ComplaintCard({ item }) {
  const getStatusStyles = (status) => {
    switch(status) {
      // Badges adaptados
      case 'Urgente': return { bg: '#fee2e2', color: '#dc2626', border: '#fecaca' };
      case 'En Progreso': return { bg: '#dcfce7', color: '#16a34a', border: '#bbf7d0' };
      
      // Resuelta usa el azul vibrante de tu paleta
      case 'Resuelta': return { bg: '#e0f5fa', color: 'var(--medium-blue)', border: 'var(--soft-blue)' };
      default: return { bg: 'var(--light-gray)', color: 'var(--deep-blue)', border: 'var(--soft-blue)' };
    }
  };
  
  const badge = getStatusStyles(item.status);

  return (
    <div className="card-hover-effect" style={{ 
      width: '100%', background: 'white', borderRadius: '16px', overflow: 'hidden',
      cursor: 'pointer', display: 'flex', flexDirection: 'column'
    }}>
      <div className="img-placeholder" style={{ height: '200px', position: 'relative' }}>
        {item.img && <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
        
        {/* Degradado actualizado con tu Azul Profundo #1a3d7d */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to top, rgba(26, 61, 125, 0.7) 0%, transparent 60%)' }}></div>
        
        <span style={{ 
          position: 'absolute', top: 16, left: 16, 
          padding: '6px 12px', background: 'white', color: 'var(--deep-blue)', 
          borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)', zIndex: 2, borderBottom: '3px solid var(--vibrant-blue)'
        }}>
          {item.category}
        </span>
      </div>

      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ 
            padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700',
            backgroundColor: badge.bg, color: badge.color, border: `1px solid ${badge.border}`
          }}>
            {item.status}
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Hace 2h</span>
        </div>
        
        <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: 700, lineHeight: 1.4, color: 'var(--deep-blue)' }}>
          {item.title}
        </h3>
        
        <div className="flex-row" style={{ color: 'var(--text-muted)', fontSize: '14px', gap: '6px', marginTop: 'auto' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          {item.location}
        </div>
      </div>
    </div>
  );
}