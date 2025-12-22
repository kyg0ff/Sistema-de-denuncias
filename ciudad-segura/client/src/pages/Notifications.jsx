import React, { useState, useEffect } from 'react';
import { notificationsService } from '../services/api';

// Función auxiliar para estilos de iconos
const getNotificationStyle = (type) => {
  switch (type) {
    case 'resolved':
      return { 
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>,
        color: '#22c55e', 
        bg: '#dcfce7',
        title: 'Reporte Resuelto'
      };
    case 'new_report':
      return { 
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z"></path><path d="M20.5 10l-.934-2.802c-.8-.029-1.638-.029-2.477 0L15.5 10"></path><path d="M7.5 10c.83 0 1.5-.67 1.5-1.5v-5c0-.83-.67-1.5-1.5-1.5S6 4.17 6 5v5c0 .83.67 1.5 1.5 1.5z"></path><path d="M3.5 10l.934-2.802c.8-.029 1.638-.029 2.477 0L8.5 10"></path></svg>,
        color: 'var(--medium-blue)', 
        bg: '#e0f2fe',
        title: 'Alerta Vecinal'
      };
    default: // update
      return { 
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>,
        color: 'var(--vibrant-blue)', 
        bg: '#e0f7fa',
        title: 'Actualización'
      };
  }
};

export default function Notifications({ user, onBack }) {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar notificaciones
  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await notificationsService.getUserNotifications(user.id);
      if (response.success) {
        setNotifications(response.data);
      } else {
        setError('Error al cargar notificaciones');
      }
    } catch (err) {
      console.error('Error cargando notificaciones:', err);
      setError('Error de conexión con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await notificationsService.markAsRead(user.id, notificationId);
      if (response.success) {
        // Actualizar estado local
        setNotifications(prev => prev.map(notif => 
          notif.id === notificationId ? { ...notif, read: true } : notif
        ));
      }
    } catch (error) {
      console.error('Error marcando como leída:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await notificationsService.markAllAsRead(user.id);
      if (response.success) {
        // Actualizar todas como leídas
        setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
        alert(`${response.count} notificaciones marcadas como leídas`);
      }
    } catch (error) {
      console.error('Error marcando todas como leídas:', error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    if (window.confirm('¿Eliminar esta notificación?')) {
      try {
        const response = await notificationsService.deleteNotification(user.id, notificationId);
        if (response.success) {
          setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
        }
      } catch (error) {
        console.error('Error eliminando notificación:', error);
      }
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={{ backgroundColor: 'var(--bg-body)', minHeight: '100vh' }}>
      <main className="container" style={{ paddingBottom: '80px' }}>
        
        {/* Botón Volver */}
        <div style={{ padding: '40px 0 20px 0' }}>
          <button 
            onClick={onBack} 
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              color: 'var(--text-muted)', 
              fontSize: '15px', 
              fontWeight: 600 
            }}
          >
            ← Volver al inicio
          </button>
        </div>

        {/* Encabezado */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          marginBottom: '40px' 
        }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', margin: '0 0 8px 0', color: 'var(--deep-blue)', fontWeight: 800 }}>
              Bandeja de Notificaciones
            </h1>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1.1rem' }}>
              Mantente informado sobre el estado de tus reportes.
              {unreadCount > 0 && (
                <span style={{ 
                  marginLeft: '10px', 
                  backgroundColor: '#dc2626', 
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  fontWeight: 600
                }}>
                  {unreadCount} sin leer
                </span>
              )}
            </p>
          </div>
          
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              style={{
                background: 'var(--medium-blue)',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 11 12 14 22 4"></polyline>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
              </svg>
              Marcar todas como leídas
            </button>
          )}
        </div>

        {/* Estado de carga/error */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{ 
              width: '50px', 
              height: '50px', 
              margin: '0 auto 20px',
              border: '4px solid var(--light-gray)',
              borderTopColor: 'var(--medium-blue)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
              Cargando notificaciones...
            </p>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : error ? (
          <div style={{ 
            backgroundColor: '#fee2e2', 
            color: '#dc2626', 
            padding: '20px', 
            borderRadius: '12px',
            textAlign: 'center',
            marginBottom: '20px'
          }}>
            <p style={{ margin: 0 }}>{error}</p>
            <button 
              onClick={loadNotifications}
              style={{
                marginTop: '10px',
                background: 'none',
                border: '1px solid #dc2626',
                color: '#dc2626',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Reintentar
            </button>
          </div>
        ) : (
          /* Lista de Tarjetas */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {notifications.length > 0 ? (
              notifications.map((notif) => {
                const style = getNotificationStyle(notif.type);
                
                return (
                  <div 
                    key={notif.id}
                    className="card-hover-effect"
                    style={{ 
                      display: 'flex', 
                      gap: '20px', 
                      padding: '24px', 
                      borderRadius: '16px', 
                      backgroundColor: 'white',
                      border: '1px solid var(--border)', 
                      opacity: notif.read ? 0.8 : 1,
                      transition: '0.2s',
                      position: 'relative'
                    }}
                  >
                    {/* Icono */}
                    <div style={{ 
                      width: '48px', 
                      height: '48px', 
                      borderRadius: '50%', 
                      flexShrink: 0,
                      backgroundColor: style.bg, 
                      color: style.color,
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center'
                    }}>
                      {style.icon}
                    </div>

                    {/* Texto */}
                    <div style={{ flex: 1 }}>
                      <div className="flex-between" style={{ marginBottom: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--deep-blue)' }}>
                            {style.title}
                          </h4>
                          {!notif.read && (
                            <span style={{
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              backgroundColor: style.color,
                              display: 'inline-block'
                            }}></span>
                          )}
                        </div>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                          {notif.time}
                        </span>
                      </div>
                      
                      <p style={{ 
                        margin: '0 0 12px 0', 
                        color: 'var(--text-main)', 
                        lineHeight: 1.5,
                        fontWeight: notif.read ? 400 : 500
                      }}>
                        {notif.message}
                      </p>
                      
                      {notif.complaintId && (
                        <div style={{ 
                          display: 'inline-block',
                          backgroundColor: '#f1f5f9',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          color: 'var(--medium-blue)',
                          fontWeight: 600,
                          marginBottom: '12px'
                        }}>
                          ID Reporte: {notif.complaintId}
                        </div>
                      )}
                      
                      {/* Acciones */}
                      <div style={{ 
                        display: 'flex', 
                        gap: '12px', 
                        marginTop: '12px',
                        fontSize: '0.85rem'
                      }}>
                        {!notif.read && (
                          <button
                            onClick={() => handleMarkAsRead(notif.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--medium-blue)',
                              cursor: 'pointer',
                              textDecoration: 'underline',
                              padding: 0
                            }}
                          >
                            Marcar como leída
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteNotification(notif.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            padding: 0
                          }}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '60px', 
                backgroundColor: 'white', 
                borderRadius: '16px', 
                border: '1px dashed var(--border)' 
              }}>
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  margin: '0 auto 20px',
                  backgroundColor: '#f1f5f9',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)'
                }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                </div>
                <h3 style={{ 
                  margin: '0 0 10px 0', 
                  fontSize: '1.5rem', 
                  color: 'var(--deep-blue)' 
                }}>
                  No tienes notificaciones
                </h3>
                <p style={{ 
                  margin: 0, 
                  color: 'var(--text-muted)', 
                  fontSize: '1rem',
                  maxWidth: '400px',
                  margin: '0 auto'
                }}>
                  Aquí aparecerán las actualizaciones de tus reportes y alertas del sistema.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}