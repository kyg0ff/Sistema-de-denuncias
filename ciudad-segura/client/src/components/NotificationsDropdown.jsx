import React from 'react';
import { notificationsService } from '../services/api';

const NotificationItem = ({ notification, onMarkAsRead, onNavigate }) => {
  let icon = null;
  let color = 'var(--text-main)';
  let bg = '#f8fafc';

  // Sincronización con los tipos de tu BD: 'denuncia_creada'
  if (notification.tipo === 'denuncia_creada') {
    icon = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>;
    color = 'var(--vibrant-blue)';
    bg = '#eff6ff';
  } else if (notification.tipo === 'denuncia_resuelta') {
    icon = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
    color = '#10b981';
    bg = '#ecfdf5';
  }

  // Convertimos el estado de lectura (t/f o boolean)
  const isRead = notification.leida === 't' || notification.leida === true;

  const handleClick = (e) => {
    e.stopPropagation();
    if (!isRead && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
    // Si tiene denuncia_id, navegamos al detalle
    if (notification.denuncia_id && onNavigate) {
      onNavigate(notification.denuncia_id);
    }
  };

  return (
    <div 
      style={{ 
        display: 'flex', 
        gap: '12px', 
        padding: '12px', 
        borderBottom: '1px solid #f0f4f8',
        cursor: 'pointer',
        backgroundColor: isRead ? 'transparent' : '#f8fbff',
        borderRadius: '8px',
        transition: 'background 0.2s'
      }}
      onClick={handleClick}
    >
      <div style={{ 
        width: '36px', height: '36px', borderRadius: '8px',
        backgroundColor: bg, color: color,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
      }}>
        {icon || <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle></svg>}
      </div>
      
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          <p style={{ 
            margin: 0, 
            fontWeight: isRead ? 500 : 700, 
            color: isRead ? '#64748b' : 'var(--deep-blue)', 
            lineHeight: 1.3, 
            fontSize: '0.85rem' 
          }}>
            {notification.mensaje} {/* Usamos 'mensaje' de tu BD */}
          </p>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            {new Date(notification.fecha_creacion).toLocaleDateString()} {/* Usamos 'fecha_creacion' */}
          </span>
          {notification.denuncia_id && (
            <span style={{ fontSize: '0.7rem', color: 'var(--vibrant-blue)', fontWeight: 700 }}>
              Ver detalle →
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default function NotificationsDropdown({ 
  userId, 
  notifications = [], 
  onClose, 
  onViewAll, 
  onMarkAsRead,
  onNavigate, // Nueva prop para manejar la navegación desde el dropdown
  unreadCount 
}) {

  const handleMarkAllAsRead = async (e) => {
    e.stopPropagation();
    try {
      await notificationsService.markAllAsRead(userId);
      if (onViewAll) onViewAll(); 
    } catch (error) {
      console.error('Error marcando todas:', error);
    }
  };

  return (
    <div className="notifications-dropdown" style={{ 
      position: 'absolute', right: '0', top: 'calc(100% + 15px)', 
      width: '380px', backgroundColor: 'white', borderRadius: '16px', 
      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
      border: '1px solid var(--border)', zIndex: 1000, overflow: 'hidden'
    }} onClick={(e) => e.stopPropagation()}>
      
      {/* Header */}
      <div style={{ 
        padding: '16px 20px', borderBottom: '1px solid #f1f5f9',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        backgroundColor: '#fff'
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--deep-blue)' }}>
            Notificaciones
          </h3>
          <span style={{ fontSize: '0.75rem', color: unreadCount > 0 ? '#ef4444' : 'var(--text-muted)', fontWeight: 600 }}>
            {unreadCount || 0} mensajes nuevos
          </span>
        </div>
        
        {unreadCount > 0 && (
          <button onClick={handleMarkAllAsRead} style={{
            background: 'none', border: 'none', color: 'var(--vibrant-blue)',
            fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer'
          }}>
            Limpiar todo
          </button>
        )}
      </div>
      
      {/* Lista */}
      <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '8px' }}>
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <NotificationItem 
              key={notif.id} 
              notification={notif} 
              onMarkAsRead={onMarkAsRead}
              onNavigate={(id) => {
                onClose(); // Cerramos el dropdown
                onNavigate(id); // Navegamos al detalle
              }}
            />
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              No tienes notificaciones
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: '12px', backgroundColor: '#f8fafc', textAlign: 'center' }}>
        <button 
          onClick={(e) => { onClose(e); onViewAll(); }} 
          style={{ 
            background: 'white', border: '1px solid var(--border)', 
            color: 'var(--deep-blue)', fontWeight: 700, cursor: 'pointer', 
            fontSize: '0.8rem', padding: '8px 16px', borderRadius: '8px',
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
          }}
        >
          Ver historial completo
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    </div>
  );
}