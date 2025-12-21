import React from 'react';

const NotificationItem = ({ notification }) => {
  let icon = null;
  let color = 'var(--text-main)';

  if (notification.type === 'update') {
    icon = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>;
    color = 'var(--vibrant-blue)';
  } else if (notification.type === 'resolved') {
    icon = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>;
    color = '#22c55e';
  } else if (notification.type === 'new_report') {
    icon = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z"></path><path d="M20.5 10l-.934-2.802c-.8-.029-1.638-.029-2.477 0L15.5 10"></path></svg>;
    color = 'var(--medium-blue)';
  }

  return (
    <div style={{ display: 'flex', gap: '12px', padding: '12px 0', borderBottom: '1px solid #f0f4f8' }}>
      <div style={{ color: color, fontSize: '1.2rem', display: 'flex', alignItems: 'center' }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <p style={{ margin: '0 0 4px 0', fontWeight: 600, color: 'var(--deep-blue)', lineHeight: 1.3, fontSize: '0.9rem' }}>
          {notification.message}
        </p>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{notification.time}</span>
      </div>
    </div>
  );
};

export default function NotificationsDropdown({ notifications, onClose, onViewAll }) {
  return (
    <div className="notifications-dropdown" style={{ 
      position: 'absolute', right: '0', top: 'calc(100% + 15px)', 
      width: '380px', maxHeight: '450px', overflowY: 'auto',
      backgroundColor: 'white', borderRadius: '12px', boxShadow: 'var(--shadow-lg)',
      border: '1px solid var(--border)', zIndex: 1000,
      animation: 'scaleUp 0.2s ease-out forwards',
    }} onClick={(e) => e.stopPropagation()}>
      
      <div style={{ padding: '16px 24px', borderBottom: '1px solid #f0f4f8' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--deep-blue)' }}>Notificaciones</h3>
      </div>
      
      <div style={{ padding: '0 24px' }}>
        {notifications.length > 0 ? (
          notifications.map((notif, index) => <NotificationItem key={index} notification={notif} />)
        ) : (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px 0', fontSize: '0.9rem' }}>
            Sin nuevas notificaciones.
          </p>
        )}
      </div>

      <div style={{ padding: '12px 24px', borderTop: '1px solid #f0f4f8', textAlign: 'center' }}>
        <button 
          // --- CORRECCIÓN DEL BOTÓN ---
          onClick={(e) => { 
             onClose(e);   // Pasamos el evento
             onViewAll();  // Navegamos
          }} 
          style={{ background: 'none', border: 'none', color: 'var(--medium-blue)', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}
        >
          Ver todas las notificaciones
        </button>
      </div>
    </div>
  );
}