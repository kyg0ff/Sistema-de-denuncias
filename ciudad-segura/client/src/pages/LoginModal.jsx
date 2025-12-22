import React, { useState, useEffect } from "react";

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false); // <-- NUEVO ESTADO
  const [errorMessage, setErrorMessage] = useState(""); // <-- NUEVO ESTADO

  const [navHeight, setNavHeight] = useState(0);

  // 🔥 Lee la altura real del navbar
  useEffect(() => {
    const nav = document.querySelector("nav");
    if (nav) {
      setNavHeight(nav.offsetHeight);
    }
  }, []);

  // Cerrar error modal
  useEffect(() => {
    if (showErrorModal) {
      const timer = setTimeout(() => {
        setShowErrorModal(false);
      }, 3000); // Auto-cerrar después de 3 segundos
      return () => clearTimeout(timer);
    }
  }, [showErrorModal]);

  if (!isOpen) return null;

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Debes completar todos los campos.");
      return;
    }
    
    setError("");
    
    try {
      // Llamar a la función onLogin que ahora maneja el backend
      await onLogin(username, password);
      // Si onLogin no lanza error, significa que fue exitoso
      // (El modal se cierra automáticamente desde App.jsx)
    } catch (err) {
      // Mostrar modal de error
      setErrorMessage("Credenciales incorrectas. Verifica tu email y contraseña.");
      setShowErrorModal(true);
      console.error(err);
    }
  };

  // Manejar Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <>
      {/* MODAL DE ERROR */}
      {showErrorModal && (
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
                Error de autenticación
              </p>
              <p style={{ 
                margin: "4px 0 0 0", 
                fontSize: "0.85rem",
                color: "#991b1b"
              }}>
                {errorMessage}
              </p>
            </div>
            <button
              onClick={() => setShowErrorModal(false)}
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
      )}

      {/* MODAL DE LOGIN PRINCIPAL */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",      
          alignItems: "flex-start",
          paddingTop: `${navHeight + 60}px`,
          paddingLeft: "730px",
          zIndex: 9999,
        }}
        onClick={onClose}
      >
        {/* CONTENEDOR DEL MODAL */}
        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "14px",
            width: "360px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
            animation: "scaleIn 0.25s ease",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 style={{ 
            marginBottom: "20px", 
            textAlign: "center", 
            color: "var(--deep-blue)",
            fontSize: "1.8rem",
            fontWeight: 800
          }}>
            Iniciar Sesión
          </h2>

          {/* Usuario */}
          <div style={{ position: "relative", marginBottom: "15px" }}>
            <span
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#777",
              }}
            >
              👤
            </span>

            <input
              type="text"
              placeholder="Correo electrónico"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              style={{
                width: "100%",
                padding: "12px 12px 12px 38px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "#fcfdfe",
                color: "var(--deep-blue)",
                fontWeight: 600,
                fontSize: "0.95rem",
                outline: "none",
              }}
            />
          </div>

          {/* Contraseña */}
          <div style={{ position: "relative", marginBottom: "10px" }}>
            <span
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#777",
              }}
            >
              🔒
            </span>

            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              style={{
                width: "100%",
                padding: "12px 12px 12px 38px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "#fcfdfe",
                color: "var(--deep-blue)",
                fontWeight: 600,
                fontSize: "0.95rem",
                outline: "none",
              }}
            />
          </div>

          {/* Error de validación (campos vacíos) */}
          {error && (
            <p
              style={{
                color: "#ef4444",
                fontSize: "14px",
                marginBottom: "10px",
                textAlign: "center",
                backgroundColor: "#fee2e2",
                padding: "8px",
                borderRadius: "6px",
              }}
            >
              {error}
            </p>
          )}

          {/* Checkbox Recordarme */}
          <label
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "20px",
              cursor: "pointer",
              fontSize: "14px",
              color: "#555",
            }}
          >
            <input
              type="checkbox"
              checked={remember}
              onChange={() => setRemember(!remember)}
              style={{ marginRight: 8 }}
            />
            Recordarme en este dispositivo
          </label>

          {/* Botón de Login */}
          <button
            onClick={handleLogin}
            style={{
              width: "100%",
              background: "var(--deep-blue)",
              color: "white",
              padding: "12px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "1rem",
              transition: "0.2s",
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = "var(--medium-blue)"}
            onMouseLeave={(e) => e.target.style.backgroundColor = "var(--deep-blue)"}
          >
            Iniciar Sesión
          </button>

          {/* Datos de prueba (solo en desarrollo) */}
          {process.env.NODE_ENV === 'development' && (
            <div style={{ 
              marginTop: "20px", 
              padding: "10px", 
              backgroundColor: "#f0f9ff", 
              borderRadius: "8px",
              fontSize: "12px",
              color: "var(--text-muted)",
              border: "1px dashed var(--soft-blue)"
            }}>
              <div style={{ fontWeight: 700, color: "var(--medium-blue)", marginBottom: "4px" }}>
                Credenciales de prueba:
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <div>
                  <span style={{ fontWeight: 600 }}>Ciudadano:</span> luis.gallegos@gmail.com / 123456
                </div>
                <div>
                  <span style={{ fontWeight: 600 }}>Administrador:</span> admin@ciudadsegura.com / admin123
                </div>
              </div>
            </div>
          )}
          
        </div>
      </div>

      {/* Animaciones CSS */}
      <style>
        {`
          @keyframes scaleIn {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          
          @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
          }
        `}
      </style>
    </>
  );
};

export default LoginModal;