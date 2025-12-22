import React, { useEffect } from 'react';

const ErrorModal = ({ isOpen, message, onClose, autoClose = true }) => {
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, onClose]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      top: "20px",
      right: "20px",
      zIndex: 10000,
      animation: "slideIn 0.3s ease-out"
    }}>
      <div style={{
        backgroundColor: "#fee2e2",
        color: "#dc2626",
        padding: "16px 24px",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        borderLeft: "4px solid #dc2626",
        maxWidth: "400px"
      }}>
        <div style={{
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          backgroundColor: "#dc2626",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>
        <div>
          <p style={{ 
            margin: 0, 
            fontWeight: 600, 
            fontSize: "0.95rem",
            color: "#7f1d1d"
          }}>
            Error
          </p>
          <p style={{ 
            margin: "4px 0 0 0", 
            fontSize: "0.85rem",
            color: "#991b1b"
          }}>
            {message}
          </p>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "#991b1b",
            cursor: "pointer",
            padding: "4px",
            marginLeft: "auto",
            flexShrink: 0
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;