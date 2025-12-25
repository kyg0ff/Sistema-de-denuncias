import React from 'react';

/**
 * COMPONENTE: AdminModal
 * Proporciona una interfaz de ventana emergente para acciones administrativas.
 * * FUNCIONAMIENTO:
 * 1. Control de Estado: Utiliza la prop 'isOpen' para decidir si se renderiza o no (Early Return).
 * 2. Cierre Externo: El contenedor principal (overlay) captura el clic para cerrar el modal.
 * 3. Prevención de Burbujeo: El contenido interno usa 'e.stopPropagation()' para evitar que los clics 
 * dentro del modal activen el cierre accidental de la ventana.
 * 4. Flexibilidad: Permite inyectar cualquier contenido vía 'children' y botones de acción vía 'footer'.
 */
export default function AdminModal({ 
  title, 
  isOpen, 
  onClose, 
  children, 
  footer,
  width = '800px'  // Prop personalizable: define el ancho máximo del contenedor
}) {
  
  // Si el modal no debe estar abierto, no se renderiza nada en el DOM
  if (!isOpen) return null;

  return (
    <div 
      className="admin-modal-overlay" 
      onClick={onClose} // Cierra al hacer clic en el fondo oscuro
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px', // Espaciado de seguridad para pantallas móviles
        animation: 'fadeIn 0.3s ease-out' // Transición de entrada definida en App.css
      }}
    >
      <div 
        className="admin-modal-content"
        onClick={(e) => e.stopPropagation()} // Importante: evita que el clic adentro cierre el modal
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
          width: '100%',
          maxWidth: width,        // Aplicación del prop width
          maxHeight: '90vh',      // Límite de altura para permitir scroll interno
          overflowY: 'auto',      // Scroll automático si el contenido excede la altura
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* CABECERA: Renderizado condicional del título */}
        {title && (
          <div style={{
            padding: '28px 32px 20px',
            borderBottom: '1px solid var(--border)' // Eliminado hardcode #e2e8f0
          }}>
            <h3 style={{
              margin: 0,
              fontSize: '1.6rem',
              fontWeight: 800,
              color: 'var(--deep-blue)',
              letterSpacing: '-0.02em'
            }}>
              {title}
            </h3>
          </div>
        )}

        {/* CONTENIDO PRINCIPAL: Espacio donde se inyectan los children */}
        <div style={{
          padding: '32px',
          flex: 1,
          overflowY: 'auto'
        }}>
          {children}
        </div>

        {/* FOOTER: Sección de acciones con estilo diferenciado */}
        {footer && (
          <div style={{
            padding: '20px 32px',
            borderTop: '1px solid var(--border)', // Eliminado hardcode #e2e8f0
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            backgroundColor: 'var(--bg-body)'     // Eliminado hardcode #f8fafc (usa fondo suave de la app)
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}