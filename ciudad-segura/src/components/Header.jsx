import React from 'react';
import Button from './Button';
import NotificationsDropdown from './NotificationsDropdown';

export default function Header({ 
  user, 
  onLogin, 
  onNavigateToProfile, 
  onNavigateToHome, 
  notifications, 
  showNotifications, 
  toggleNotifications, 
  onViewAllNotifications // <--- Asegúrate de que esto esté aquí
}) {
  const buttonStyle = {
    backgroundColor: 'var(--vibrant-blue)', color: 'white', fontSize: '14px', height: '38px'
  };

  return (
    <header style={{ 
      position: 'sticky', top: 0, zIndex: 100,
      backgroundColor: 'var(--deep-blue)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    }}>
      <div className="container flex-between" style={{ height: '70px' }}>
        
        <div 
          className="flex-row" 
          style={{ gap: '12px', cursor: 'pointer' }}
          onClick={onNavigateToHome}
        >
          <div style={{ 
            width: '36px', height: '36px', background: 'white', 
            borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--deep-blue)'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          </div>
          <h2 style={{ fontSize: '20px', margin: 0, fontWeight: 800, color: 'white' }}>
            Ciudad<span style={{ color: 'var(--soft-blue)' }}>Segura</span>
          </h2>
        </div>

        <div className="flex-row" style={{ position: 'relative' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              
              <button 
                onClick={toggleNotifications}
                style={{ 
                  background: 'none', border: 'none', cursor: 'pointer', 
                  color: 'white', position: 'relative', padding: '8px'
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                {notifications && notifications.filter(n => !n.read).length > 0 && (
                  <span style={{ 
                    position: 'absolute', top: 5, right: 5, 
                    backgroundColor: '#ef4444', borderRadius: '50%', 
                    width: '10px', height: '10px', border: '2px solid var(--deep-blue)' 
                  }}></span>
                )}
              </button>

              {showNotifications && (
                <NotificationsDropdown 
                  notifications={notifications} 
                  onClose={toggleNotifications} 
                  onViewAll={onViewAllNotifications} // <--- Pasamos la función aquí
                />
              )}

              <div 
                onClick={onNavigateToProfile}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '12px', 
                  cursor: 'pointer', padding: '6px 12px', borderRadius: '8px',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }}
              >
                <span style={{ color: 'white', fontWeight: 600, fontSize: '14px' }}>
                  {user.name}
                </span>
                <div style={{ 
                  width: '36px', height: '36px', borderRadius: '50%', 
                  backgroundColor: 'var(--soft-blue)', color: 'var(--deep-blue)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </div>
              </div>
            </div>
          ) : (
            <>
              <Button style={buttonStyle} onClick={onLogin}>Iniciar Sesión</Button>
              <Button style={buttonStyle} onClick={onLogin}>Registrarse</Button>
            </>
          )}
        </div>

      </div>
    </header>
  );
}