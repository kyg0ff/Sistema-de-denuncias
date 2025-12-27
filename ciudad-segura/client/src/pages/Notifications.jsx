import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import { notificationsService } from '../services/api';

/**
 * Función auxiliar para estilos de iconos según el tipo en la BD
 */
const getNotificationStyle = (type) => {
  switch (type) {
    case 'denuncia_creada':
      return { 
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>,
        color: 'var(--vibrant-blue)', 
        bg: '#eff6ff',
        title: 'Denuncia Registrada'
      };
    case 'denuncia_resuelta':
      return { 
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>,
        color: '#10b981', 
        bg: '#ecfdf5',
        title: 'Denuncia Resuelta'
      };
    default:
      return { 
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>,
        color: '#64748b', 
        bg: '#f8fafc',
        title: 'Notificación'
      };
  }
};

export default function Notifications({ user, onBack, onViewDetails }) {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar notificaciones al montar el componente
  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await notificationsService.getUserNotifications(user.id);
      if (response.success) {
        // Mapeamos los campos exactamente como están en tu tabla de BD
        const mappedData = response.data.map(n => ({
          id: n.id,
          tipo: n.tipo,
          mensaje: n.mensaje,
          leida: n.leida === 't' || n.leida === true,
          denuncia_id: n.denuncia_id, // Campo clave para la navegación
          fecha: new Date(n.fecha_creacion).toLocaleString('es-PE', {
            day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
          })
        }));
        setNotifications(mappedData);
      }
    } catch (err) {
      console.error('Error cargando notificaciones:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationClick = (notif) => {
    // 1. Si no está leída, marcar como leída en el servidor
    if (!notif.leida) {
      notificationsService.markAsRead(user.id, notif.id);
      // Actualizar estado local para quitar el punto rojo
      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, leida: true } : n));
    }
    
    // 2. NAVEGACIÓN: Si la notificación tiene una denuncia vinculada, ir al detalle
    if (notif.denuncia_id) {
      onViewDetails(notif.denuncia_id);
    }
  };

  const unreadCount = notifications.filter(n => !n.leida).length;

  return (
    <div style={{ backgroundColor: 'var(--bg-body)', minHeight: '100vh' }}>
      <main className="container" style={{ paddingBottom: '80px' }}>
        
        {/* BOTÓN VOLVER (ESTILO AZUL SÓLIDO) */}
        <div style={{ padding: '40px 0 24px 0' }}>
          <Button 
            onClick={onBack}
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>}
            style={{ 
              backgroundColor: 'var(--deep-blue)', color: 'white', padding: '12px 24px',
              borderRadius: '12px', fontSize: '1rem', fontWeight: 700, border: 'none',
              boxShadow: '0 4px 6px -1px rgba(30, 58, 138, 0.3)'
            }}
          >
            Volver al inicio
          </Button>
        </div>

        {/* ENCABEZADO */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 900, color: 'var(--deep-blue)', margin: 0, letterSpacing: '-1px' }}>
            Notificaciones
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginTop: '5px' }}>
            {unreadCount > 0 ? `Tienes ${unreadCount} avisos nuevos sin leer.` : 'No tienes avisos pendientes.'}
          </p>
        </div>

        {/* LISTADO */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '100px' }}><div className="loader"></div></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {notifications.length > 0 ? (
              notifications.map((notif) => {
                const style = getNotificationStyle(notif.tipo);
                return (
                  <div 
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    style={{ 
                      display: 'flex', gap: '20px', padding: '20px', borderRadius: '16px', 
                      backgroundColor: 'white', border: '1px solid var(--border)',
                      cursor: 'pointer', transition: 'all 0.2s ease',
                      opacity: notif.leida ? 0.7 : 1,
                      position: 'relative',
                      boxShadow: notif.leida ? 'none' : '0 4px 12px rgba(0,0,0,0.05)'
                    }}
                    className="notification-card"
                  >
                    {/* Indicador de no leído */}
                    {!notif.leida && (
                      <div style={{ 
                        position: 'absolute', top: '22px', right: '22px', 
                        width: '10px', height: '10px', borderRadius: '50%', 
                        backgroundColor: '#ef4444' 
                      }} />
                    )}

                    <div style={{ 
                      width: '50px', height: '50px', borderRadius: '12px', flexShrink: 0,
                      backgroundColor: style.bg, color: style.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {style.icon}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                          {notif.fecha}
                        </span>
                      </div>
                      <h4 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', color: 'var(--deep-blue)', fontWeight: 700 }}>
                        {style.title}
                      </h4>
                      <p style={{ margin: 0, color: '#475569', fontSize: '1rem', lineHeight: 1.4 }}>
                        {notif.mensaje}
                      </p>
              
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', padding: '80px', backgroundColor: 'white', borderRadius: '24px', border: '2px dashed #e2e8f0' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>No hay notificaciones para mostrar.</p>
              </div>
            )}
          </div>
        )}
      </main>

      <style>{`
        .notification-card:hover { 
          transform: translateY(-2px); 
          border-color: var(--vibrant-blue); 
          box-shadow: 0 8px 20px rgba(0,0,0,0.08); 
        }
        .loader { width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid var(--vibrant-blue); border-radius: 50%; animation: spin 1s linear infinite; margin: auto; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}