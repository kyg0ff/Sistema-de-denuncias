import React from 'react';

// Función auxiliar para estilos de iconos
const getNotificationStyle = (type) => {
  switch (type) {
    case 'resolved':
      return { 
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>,
        color: '#22c55e', bg: '#dcfce7' 
      };
    case 'new_report':
      return { 
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z"></path><path d="M20.5 10l-.934-2.802c-.8-.029-1.638-.029-2.477 0L15.5 10"></path><path d="M7.5 10c.83 0 1.5-.67 1.5-1.5v-5c0-.83-.67-1.5-1.5-1.5S6 4.17 6 5v5c0 .83.67 1.5 1.5 1.5z"></path><path d="M3.5 10l.934-2.802c.8-.029 1.638-.029 2.477 0L8.5 10"></path></svg>,
        color: 'var(--medium-blue)', bg: '#e0f2fe' 
      };
    default: // update
      return { 
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>,
        color: 'var(--vibrant-blue)', bg: '#e0f7fa' 
      };
  }
};

export default function Notifications({ notifications, onBack }) {
  return (
    <div style={{ backgroundColor: 'var(--bg-body)', minHeight: '100vh' }}>
      <main className="container" style={{ paddingBottom: '80px' }}>
        
        {/* Botón Volver */}
        <div style={{ padding: '40px 0 20px 0' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '15px', fontWeight: 600 }}>
            ← Volver al inicio
          </button>
        </div>

        {/* Encabezado */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.5rem', margin: '0 0 8px 0', color: 'var(--deep-blue)', fontWeight: 800 }}>
            Bandeja de Notificaciones
          </h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            Mantente informado sobre el estado de tus reportes.
          </p>
        </div>

        {/* Lista de Tarjetas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {notifications.length > 0 ? (
            notifications.map((notif, index) => {
              const style = getNotificationStyle(notif.type);
              
              return (
                <div 
                  key={index}
                  className="card-hover-effect"
                  style={{ 
                    display: 'flex', gap: '20px', padding: '24px', 
                    borderRadius: '16px', backgroundColor: 'white',
                    border: '1px solid var(--border)', 
                    opacity: 1, 
                    transition: '0.2s'
                  }}
                >
                  {/* Icono */}
                  <div style={{ 
                    width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0,
                    backgroundColor: style.bg, color: style.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {style.icon}
                  </div>

                  {/* Texto */}
                  <div style={{ flex: 1 }}>
                    <div className="flex-between" style={{ marginBottom: '6px' }}>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--deep-blue)' }}>
                        {notif.type === 'resolved' ? 'Reporte Resuelto' : notif.type === 'new_report' ? 'Alerta Vecinal' : 'Actualización'}
                      </h4>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{notif.time}</span>
                    </div>
                    
                    <p style={{ margin: '0 0 12px 0', color: 'var(--text-main)', lineHeight: 1.5 }}>
                      {notif.message}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', padding: '60px', backgroundColor: 'white', borderRadius: '16px', border: '1px dashed var(--border)' }}>
               <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>No tienes notificaciones.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}