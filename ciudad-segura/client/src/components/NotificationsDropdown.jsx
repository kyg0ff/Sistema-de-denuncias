import React from 'react';
import { notificationsService } from '../services/api';

const NotificationItem = ({ notification, onMarkAsRead }) => {
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

  const handleClick = () => {
    if (!notification.read && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <div 
      style={{ 
        display: 'flex', 
        gap: '12px', 
        padding: '12px 0', 
        borderBottom: '1px solid #f0f4f8',
        cursor: 'pointer',
        backgroundColor: notification.read ? 'transparent' : '#f8fbff',
        borderRadius: '8px',
        padding: '12px'
      }}
      onClick={handleClick}
    >
      <div style={{ 
        color: color, 
        fontSize: '1.2rem', 
        display: 'flex', 
        alignItems: 'center' 
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          marginBottom: '4px' 
        }}>
          {!notification.read && (
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: color,
              display: 'inline-block'
            }}></span>
          )}
          <p style={{ 
            margin: 0, 
            fontWeight: notification.read ? 500 : 600, 
            color: notification.read ? 'var(--text-muted)' : 'var(--deep-blue)', 
            lineHeight: 1.3, 
            fontSize: '0.9rem' 
          }}>
            {notification.message}
          </p>
        </div>
        <span style={{ 
          fontSize: '0.75rem', 
          color: 'var(--text-muted)' 
        }}>
          {notification.time}
        </span>
        {notification.complaintId && (
          <div style={{ 
            marginTop: '4px', 
            fontSize: '0.7rem',
            color: 'var(--medium-blue)',
            fontWeight: 600
          }}>
            ID: {notification.complaintId}
          </div>
        )}
      </div>
    </div>
  );
};

export default function NotificationsDropdown({ 
  userId, 
  notifications, 
  onClose, 
  onViewAll, 
  onMarkAsRead,
  unreadCount 
}) {
  const handleMarkAsRead = async (notificationId) => {
    if (onMarkAsRead) {
      onMarkAsRead(notificationId);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsService.markAllAsRead(userId);
      // Recargar notificaciones o actualizar estado
      if (onViewAll) {
        onViewAll(); // Esto recargará las notificaciones
      }
    } catch (error) {
      console.error('Error marcando todas como leídas:', error);
    }
  };

  return (
    <div className="notifications-dropdown" style={{ 
      position: 'absolute', 
      right: '0', 
      top: 'calc(100% + 15px)', 
      width: '400px', 
      maxHeight: '500px', 
      overflowY: 'auto',
      backgroundColor: 'white', 
      borderRadius: '12px', 
      boxShadow: 'var(--shadow-lg)',
      border: '1px solid var(--border)', 
      zIndex: 1000,
      animation: 'scaleUp 0.2s ease-out forwards',
    }} onClick={(e) => e.stopPropagation()}>
      
      {/* Header */}
      <div style={{ 
        padding: '16px 20px', 
        borderBottom: '1px solid #f0f4f8',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--deep-blue)' }}>
            Notificaciones
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {unreadCount || 0} sin leer
          </p>
        </div>
        
        {unreadCount > 0 && (
          <button 
            onClick={handleMarkAllAsRead}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--medium-blue)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Marcar todas como leídas
          </button>
        )}
      </div>
      
      {/* Lista de notificaciones */}
      <div style={{ padding: '0 20px', maxHeight: '350px', overflowY: 'auto' }}>
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <NotificationItem 
              key={notif.id} 
              notification={notif} 
              onMarkAsRead={handleMarkAsRead}
            />
          ))
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px 20px', 
            color: 'var(--text-muted)' 
          }}>
            <svg 
              width="48" 
              height="48" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
              style={{ marginBottom: '16px', opacity: 0.5 }}
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>
              Sin nuevas notificaciones
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ 
        padding: '12px 20px', 
        borderTop: '1px solid #f0f4f8', 
        textAlign: 'center' 
      }}>
        <button 
          onClick={(e) => { 
            if (onClose) onClose(e);
            if (onViewAll) onViewAll();
          }} 
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--medium-blue)', 
            fontWeight: 700, 
            cursor: 'pointer', 
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            margin: '0 auto'
          }}
        >
          Ver todas las notificaciones
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
}