import React from 'react';

export default function AdminModal({ title, isOpen, onClose, children, footer }) {
  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
        {title && <h3>{title}</h3>}
        
        <div style={{ marginBottom: '24px' }}>
          {children}
        </div>

        {/* Acciones (Botones) */}
        {footer && (
          <div className="admin-modal-actions">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}