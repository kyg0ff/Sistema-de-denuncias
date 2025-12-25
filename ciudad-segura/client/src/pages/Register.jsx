import React, { useState } from "react";
import Button from "../components/Button";
import Modal from "../components/Modal";
import { authService } from "../services/api";
import "../App.css";

/**
 * COMPONENTE: RegisterPage
 * Pantalla para el registro de nuevos ciudadanos con validaciones y auto-llenado por DNI.
 * * FUNCIONAMIENTO:
 * 1. Consulta DNI: Al detectar 8 dígitos, consulta una API externa para traer nombres y apellidos.
 * 2. Máscara de Teléfono: Formatea el input en tiempo real para mejorar la experiencia de usuario.
 * 3. Validación de Negocio: Verifica contraseñas coincidentes, formato de correo y longitud de DNI.
 * 4. Navegación: Permite regresar al Home (onBack) o cambiar al flujo de Login (onGoLogin).
 */
const RegisterPage = ({ onGoLogin, onBack }) => {
  // --- 1. ESTADOS DEL FORMULARIO ---
  const [dni, setDNI] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [remember, setRemember] = useState(false);

  // --- 2. ESTADOS DE CONTROL Y UI ---
  const [error, setError] = useState(""); 
  const [message, setMessage] = useState(""); 
  const [isLoading, setIsLoading] = useState(false); 
  const [showSuccessModal, setShowSuccessModal] = useState(false); 

  /**
   * Consulta API para autocompletar datos por DNI
   */
  const fetchDNI = async (dni) => {
    if (dni.length !== 8) return;
    try {
      const response = await fetch(`https://api.peru.dev/api/dni/${dni}`);
      if (!response.ok) {
        setMessage("No se encontró información para este DNI");
        setName(""); setLastName("");
        return;
      }
      const data = await response.json();
      if (data?.nombres) {
        setName(data.nombres);
        setLastName(`${data.apellido_paterno} ${data.apellido_materno}`);
        setMessage("Datos cargados automáticamente");
      } else {
        setMessage("No se encontró información, completa manualmente");
        setName(""); setLastName("");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error al consultar el DNI");
    }
  };

  const handleDNIChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setDNI(value);
    setMessage("");
    if (value.length === 8) fetchDNI(value);
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 0) {
      if (value.length <= 2) value = `+${value}`;
      else if (value.length <= 5) value = `+${value.slice(0, 2)} ${value.slice(2)}`;
      else if (value.length <= 8) value = `+${value.slice(0, 2)} ${value.slice(2, 5)} ${value.slice(5)}`;
      else value = `+${value.slice(0, 2)} ${value.slice(2, 5)} ${value.slice(5, 8)} ${value.slice(8, 11)}`;
    }
    setPhone(value);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!dni || !name || !lastName || !email || !phone || !password || !confirmPassword) {
      setError("Completa todos los campos obligatorios (*).");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const userData = {
        dni,
        name,
        lastName,
        email,
        phone: phone.replace(/\D/g, ""),
        password,
      };

      const response = await authService.register(userData);
      if (response.success) {
        setShowSuccessModal(true);
      } else {
        setError(response.message || "Error en el registro");
      }
    } catch (err) {
      setError(err.message || "Error de conexión con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: "550px", marginTop: "40px", paddingBottom: "80px" }}>
      
      {/* BOTÓN VOLVER: Estilo con efecto Hover y Sombra */}
      <div style={{ marginBottom: '24px' }}>
        <Button 
          onClick={onBack}
          style={{ 
            backgroundColor: 'var(--deep-blue)', 
            color: 'white', 
            padding: '10px 20px',
            borderRadius: '10px',
            fontSize: '0.95rem',
            fontWeight: 700,
            border: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            boxShadow: '0 4px 6px -1px rgba(30, 58, 138, 0.2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#2563eb';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--deep-blue)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Volver al inicio
        </Button>
      </div>

      <div className="profile-card" style={{ padding: "40px", boxShadow: "var(--shadow-lg)", backgroundColor: "white" }}>
        <h2 style={{ marginBottom: "24px", textAlign: "center", color: "var(--deep-blue)", fontWeight: 800 }}>
          Crear Cuenta
        </h2>

        <form onSubmit={handleRegister}>
          <div className="input-group">
            <label style={{ color: 'var(--deep-blue)', fontWeight: 700 }}>DNI * <small style={{ color: "var(--text-muted)", fontWeight: 400 }}>(8 dígitos)</small></label>
            <div className="input-wrapper">
              <input type="text" value={dni} onChange={handleDNIChange} placeholder="Ingresa tu DNI" maxLength={8} required />
            </div>
            {message && (
              <small style={{ color: message.includes("cargados") ? "#059669" : "var(--text-muted)", display: "block", marginTop: "4px" }}>
                {message}
              </small>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="input-group">
              <label style={{ color: 'var(--deep-blue)', fontWeight: 700 }}>Nombre *</label>
              <div className="input-wrapper">
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" required />
              </div>
            </div>
            <div className="input-group">
              <label style={{ color: 'var(--deep-blue)', fontWeight: 700 }}>Apellido *</label>
              <div className="input-wrapper">
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Tus apellidos" required />
              </div>
            </div>
          </div>

          <div className="input-group">
            <label style={{ color: 'var(--deep-blue)', fontWeight: 700 }}>Correo electrónico *</label>
            <div className="input-wrapper">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ejemplo@correo.com" required />
            </div>
          </div>

          <div className="input-group">
            <label style={{ color: 'var(--deep-blue)', fontWeight: 700 }}>Teléfono *</label>
            <div className="input-wrapper">
              <input type="tel" value={phone} onChange={handlePhoneChange} placeholder="+51 999 888 777" required maxLength={17} />
            </div>
          </div>

          <div className="input-group">
            <label style={{ color: 'var(--deep-blue)', fontWeight: 700 }}>Contraseña *</label>
            <div className="input-wrapper">
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" required minLength={6} />
            </div>
          </div>

          <div className="input-group">
            <label style={{ color: 'var(--deep-blue)', fontWeight: 700 }}>Confirmar contraseña *</label>
            <div className="input-wrapper">
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repite tu contraseña" required />
            </div>
          </div>

          {error && (
            <p style={{ color: "#ef4444", fontSize: "14px", marginBottom: "12px", textAlign: "center", backgroundColor: "#fee2e2", padding: "10px", borderRadius: "8px" }}>
              {error}
            </p>
          )}

          <Button type="submit" variant="primary" style={{ width: "100%", padding: "14px", fontSize: "1rem", fontWeight: 700 }} disabled={isLoading}>
            {isLoading ? "Registrando..." : "Crear Cuenta"}
          </Button>

          <p style={{ marginTop: "20px", textAlign: "center", color: "var(--text-muted)" }}>
            ¿Ya tienes cuenta?{" "}
            <span onClick={onGoLogin} style={{ color: "var(--vibrant-blue)", cursor: "pointer", fontWeight: 700, textDecoration: "underline" }}>
              Inicia sesión
            </span>
          </p>
        </form>
      </div>

      <Modal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          if (onGoLogin) onGoLogin();
        }}
        title="¡Registro exitoso!"
        message="Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión."
      />
    </div>
  );
};

export default RegisterPage;