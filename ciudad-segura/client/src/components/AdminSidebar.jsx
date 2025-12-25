import React from 'react';

/**
 * COMPONENTE: AdminSidebar
 * Proporciona la navegación lateral persistente para el panel de administración.
 * * FUNCIONAMIENTO:
 * 1. Control de Navegación: Utiliza 'activeTab' para resaltar visualmente la sección actual.
 * 2. Gestión de Selección: 'handleNavClick' cambia la pestaña y ejecuta 'resetSelection' 
 * para limpiar estados secundarios (como filtros u organizaciones seleccionadas).
 * 3. Layout Fijo: Utiliza 'position: fixed' para mantenerse visible mientras el contenido 
 * derecho hace scroll.
 * 4. Estilos Dinámicos: Aplica clases condicionales (`active`) para cambiar el estilo 
 * del botón según la ruta activa.
 */
export default function AdminSidebar({ activeTab, setActiveTab, onLogout, resetSelection }) {
  
  // Función auxiliar para centralizar la lógica de cambio de pestaña
  const handleNavClick = (tabName) => {
    setActiveTab(tabName);
    if (resetSelection) resetSelection(); 
  };

  return (
    <aside style={{ 
      width: '280px', 
      backgroundColor: 'var(--deep-blue)', 
      color: '#ffffff', // Color base blanco para contraste
      display: 'flex', 
      flexDirection: 'column', 
      position: 'fixed', 
      height: '100vh', 
      zIndex: 10,
      boxShadow: '4px 0 10px rgba(0,0,0,0.1)'
    }}>
      {/* 1. CABECERA: Identidad del Panel de Control */}
      <div style={{ padding: '32px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{ 
            width: '32px', height: '32px', 
            backgroundColor: '#ffffff', 
            borderRadius: '6px', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            color: 'var(--deep-blue)' 
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
            Admin<span style={{ color: 'var(--soft-blue)' }}>Panel</span>
          </h2>
        </div>
        <span style={{ fontSize: '0.8rem', opacity: 0.6, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Gestión Ciudadana v1.0
        </span>
      </div>

      {/* 2. NAVEGACIÓN: Enlaces a las diferentes secciones administrativas */}
      <nav style={{ flex: 1, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ 
          fontSize: '0.75rem', 
          textTransform: 'uppercase', 
          color: 'rgba(255,255,255,0.4)', 
          padding: '0 12px', 
          marginBottom: '8px', 
          fontWeight: 700 
        }}>
          Principal
        </div>
        
        <button 
          onClick={() => handleNavClick('users')} 
          className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
          </svg> 
          Ciudadanos
        </button>
        
        <button 
          onClick={() => handleNavClick('authorities')} 
          className={`admin-nav-item ${activeTab === 'authorities' ? 'active' : ''}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
            <line x1="7" y1="2" x2="7" y2="22"></line>
            <line x1="17" y1="2" x2="17" y2="22"></line>
            <line x1="2" y1="12" x2="22" y2="12"></line>
          </svg> 
          Organizaciones
        </button>
      </nav>

      {/* 3. FOOTER: Perfil del administrador y acción de cierre de sesión */}
      <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ 
            width: '36px', height: '36px', borderRadius: '50%', 
            backgroundColor: 'var(--vibrant-blue)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            fontWeight: 'bold', color: 'white' 
          }}>
            A
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Administrador</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>admin@ciudad.com</div>
          </div>
        </div>
        <button 
          onClick={onLogout} 
          className="logout-btn-admin" 
          style={{ 
            background: 'rgba(255,255,255,0.08)', 
            border: 'none', 
            color: '#fca5a5', // Mantenemos el tono rojizo suave para el logout
            width: '100%', 
            padding: '12px', 
            borderRadius: '8px', 
            cursor: 'pointer', 
            fontWeight: 600, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '8px',
            transition: 'background 0.2s'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg> 
          Salir
        </button>
      </div>
    </aside>
  );
}