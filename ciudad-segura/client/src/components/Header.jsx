import React from 'react';
import Button from './Button';
import NotificationsDropdown from './NotificationsDropdown';

/**
 * COMPONENTE: Header
 * Es la barra superior de la aplicación. Se mantiene fija (sticky) al hacer scroll.
 * Centraliza la navegación principal y el acceso a la cuenta del usuario.
 */
export default function Header({ 
  user,                     // Objeto con la sesión (contiene 'nombres', 'role', etc.)
  onViewDetails,
  onLogin,                  // Abre el modal de inicio de sesión
  onNavigateToRegister,     // Cambia la página a Registro
  onNavigateToProfile,      // Cambia la página a Perfil
  onNavigateToHome,         // Cambia la página a Inicio
  notifications,            // Lista de notificaciones desde el servidor
  showNotifications,        // Estado booleano para mostrar/ocultar el dropdown
  toggleNotifications,      // Función para alternar el estado de las notificaciones
  onViewAllNotifications,    // Función para navegar a la lista completa de alertas
  onMarkAsRead
}) {
  
  // Estilo reutilizable para los botones de acceso cuando no hay sesión iniciada
  const buttonStyle = {
    backgroundColor: 'var(--vibrant-blue)', 
    color: 'white', 
    fontSize: '14px', 
    height: '38px'
  };

  return (
    <header style={{ 
      position: 'sticky', top: 0, zIndex: 100,
      backgroundColor: 'var(--deep-blue)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    }}>
      <div className="container flex-between" style={{ height: '70px' }}>
        
        {/* --- BLOQUE 1: LOGOTIPO --- */}
        <div 
          className="flex-row" 
          style={{ gap: '12px', cursor: 'pointer' }}
          onClick={onNavigateToHome}
        >
          {/* Icono de edificio/casa con fondo blanco para contraste */}
          <div style={{ 
            width: '36px', height: '36px', background: 'white', 
            borderRadius: '8px', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', color: 'var(--deep-blue)'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          {/* Nombre de la marca con resaltado en el segundo término */}
          <h2 style={{ fontSize: '20px', margin: 0, fontWeight: 800, color: 'white' }}>
            Ciudad<span style={{ color: 'var(--soft-blue)' }}>Segura</span>
          </h2>
        </div>

        {/* --- BLOQUE 2: ACCIONES / USUARIO --- */}
        <div className="flex-row" style={{ position: 'relative' }}>
          
          {/* RENDERIZADO CONDICIONAL: ¿Hay un usuario logueado? */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              
              {/* Botón de Campana: Muestra notificaciones */}
              <button 
                onClick={toggleNotifications}
                style={{ 
                  background: 'none', border: 'none', cursor: 'pointer', 
                  color: 'white', position: 'relative', padding: '8px'
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                
                {/* Indicador visual de notificaciones pendientes (punto rojo) */}
                {notifications && notifications.filter(n => !n.read).length > 0 && (
                  <span style={{ 
                    position: 'absolute', top: 5, right: 5, 
                    backgroundColor: '#ef4444', borderRadius: '50%', 
                    width: '10px', height: '10px', border: '2px solid var(--deep-blue)' 
                  }}></span>
                )}
              </button>

              {/* El desplegable se renderiza solo si el estado 'showNotifications' es verdadero */}
              {showNotifications && (
                <NotificationsDropdown
                  userId={user?.id}
                  notifications={notifications || []} // Agregamos "|| []" por seguridad
                  onClose={() => toggleNotifications()}
                  onViewAll={onViewAllNotifications}
                  onMarkAsRead={onMarkAsRead} // Ahora sí funcionará porque ya existe arriba
                  onNavigate={onViewDetails}
                  // Agregamos un chequeo de seguridad aquí también:
                  unreadCount={(notifications || []).filter(n => !n.leida).length}
                />
              )}

              {/* Sección de Identidad: Nombre del Ciudadano y Avatar */}
              <div 
                onClick={onNavigateToProfile}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '12px', 
                  cursor: 'pointer', padding: '6px 12px', borderRadius: '8px',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }}
              >
                {/* CAMBIO REALIZADO: 'user.name' -> 'user.nombres'
                   Se ajusta para leer la columna correcta de tu base de datos (PostgreSQL).
                */}
                <span style={{ color: 'white', fontWeight: 600, fontSize: '14px' }}>
                  {user.nombres}
                </span>

                {/* Avatar circular con icono de usuario */}
                <div style={{ 
                  width: '36px', height: '36px', borderRadius: '50%', 
                  backgroundColor: 'var(--soft-blue)', color: 'var(--deep-blue)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
              </div>
            </div>
          ) : (
            /* CASO: INVITADO (Muestra opciones para entrar al sistema) */
            <>
              <Button style={buttonStyle} onClick={onLogin}>Iniciar Sesión</Button>
              <Button style={buttonStyle} onClick={onNavigateToRegister}>Registrarse</Button>
            </>
          )}
        </div>

      </div>
    </header>
  );
}