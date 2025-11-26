import React, { useState, useEffect } from "react";

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");

  const [navHeight, setNavHeight] = useState(0);

  // 🔥 Lee la altura real del navbar
  useEffect(() => {
    const nav = document.querySelector("nav"); // Asegúrate de que tu navbar es <nav>
    if (nav) {
      setNavHeight(nav.offsetHeight);
    }
  }, []);

  if (!isOpen) return null;

  const handleLogin = () => {
    if (!username || !password) {
      setError("Debes completar todos los campos.");
      return;
    }
    setError("");
    onLogin(username, password, remember);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",

        // ⭐ Modal se ubica automáticamente debajo del navbar
        justifyContent: "center",      
        alignItems: "flex-start",
        // 🔥 Shift vertical dinámico según navbar + 20px extra
        paddingTop: `${navHeight + 60}px`,

        // ⭐ Ajuste horizontal hacia la derecha
        paddingLeft: "730px",

        zIndex: 9999,
      }}
      onClick={onClose} //
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
        <h2 style={{ marginBottom: 20, textAlign: "center" }}>Iniciar Sesión</h2>

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
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 12px 12px 38px",
              borderRadius: "8px",
              border: "1px solid #ccc",
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
            style={{
              width: "100%",
              padding: "12px 12px 12px 38px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        {/* Error de validación */}
        {error && (
          <p
            style={{
              color: "red",
              fontSize: "14px",
              marginBottom: "10px",
              textAlign: "center",
            }}
          >
            {error}
          </p>
        )}

        {/* Checkbox */}
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
          Recuérdame
        </label>

        {/* Botón */}
        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            background: "#4169e1",
            color: "white",
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Ingresar
        </button>

        {/* Recuperación */}
        <p
          style={{
            marginTop: "15px",
            textAlign: "center",
            color: "#555",
            fontSize: "14px",
          }}
        >
          ¿Olvidaste tu{" "}
          <span
            style={{
              color: "#4169e1",
              textDecoration: "underline",
              cursor: "pointer",
              fontWeight: "bold",
            }}
            onClick={() => alert("Recuperar usuario o contraseña")}
          >
            usuario o contraseña
          </span>
          ?
        </p>
      </div>

      {/* Animación */}
      <style>
        {`
          @keyframes scaleIn {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default LoginModal;
