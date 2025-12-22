import React, { useState } from "react";
import Button from "../components/Button";
import "../App.css";
import Modal from "../components/Modal";
import { authService } from "../services/api";

const RegisterPage = ({ onGoLogin, onBack }) => {
  const [dni, setDNI] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); // <-- NUEVO: Teléfono
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const TOKEN = "6fc3a3134a4e726dc88066d7b1d6db430cd2348230fc4409415add3fa799";

  // Función para consultar DNI
  const fetchDNI = async (dni) => {
    if (dni.length !== 8) return;

    try {
      const response = await fetch("https://api.json.pe/api/dni", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dni }),
      });

      if (!response.ok) {
        setMessage("No se encontró información para este DNI");
        setName("");
        setLastName("");
        return;
      }

      const data = await response.json();

      if (data?.nombres) {
        setName(data.nombres);
        setLastName(`${data.apellido_paterno} ${data.apellido_materno}`);
        setMessage("Datos cargados automáticamente");
      } else {
        setMessage("No se encontró información, completa manualmente");
        setName("");
        setLastName("");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error al consultar el DNI");
    }
  };

  const handleDNIChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Solo números
    setDNI(value);
    setMessage("");
    if (value.length === 8) {
      fetchDNI(value);
    }
  };

  // Formatear teléfono mientras se escribe
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Solo números
    
    // Formato: +51 XXX XXX XXX
    if (value.length > 0) {
      if (value.length <= 2) {
        value = `+${value}`;
      } else if (value.length <= 5) {
        value = `+${value.slice(0, 2)} ${value.slice(2)}`;
      } else if (value.length <= 8) {
        value = `+${value.slice(0, 2)} ${value.slice(2, 5)} ${value.slice(5)}`;
      } else {
        value = `+${value.slice(0, 2)} ${value.slice(2, 5)} ${value.slice(5, 8)} ${value.slice(8, 11)}`;
      }
    }
    
    setPhone(value);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!dni || !name || !lastName || !email || !phone || !password || !confirmPassword) {
      setError("Completa todos los campos obligatorios (*).");
      return;
    }
    
    if (dni.length !== 8) {
      setError("El DNI debe tener 8 dígitos.");
      return;
    }
    
    // Validar teléfono (mínimo 9 dígitos + código país)
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 9) {
      setError("El teléfono debe tener al menos 9 dígitos.");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Ingresa un correo electrónico válido.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      // Llamar al backend
      const userData = {
        dni,
        name,
        lastName,
        email,
        phone: phone.replace(/\D/g, ''), // Guardar solo números
        password
      };

      const response = await authService.register(userData);
      
      if (response.success) {
        setShowSuccessModal(true);
        // Limpiar formulario
        setDNI("");
        setName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setPassword("");
        setConfirmPassword("");
      } else {
        setError(response.message || "Error en el registro");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Error de conexión con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: "500px", marginTop: "80px" }}>
      <div className="profile-card" style={{ padding: "40px", boxShadow: "var(--shadow-lg)" }}>
        <h2 style={{ marginBottom: "24px", textAlign: "center", color: "var(--deep-blue)" }}>
          Crear Cuenta
        </h2>

        <form onSubmit={handleRegister}>
          {/* DNI */}
          <div className="input-group">
            <label>
              DNI *
              <span style={{ fontSize: "0.75rem", color: "#94a3b8", marginLeft: "8px", fontWeight: "normal" }}>
                (8 dígitos)
              </span>
            </label>
            <div className="input-wrapper">
              <input
                type="text"
                value={dni}
                onChange={handleDNIChange}
                placeholder="Ingresa tu DNI"
                maxLength={8}
                required
              />
            </div>
            {message && (
              <small style={{ 
                color: message.includes("cargados") ? "#059669" : "#555", 
                display: "block", 
                marginTop: "4px",
                fontSize: "0.8rem"
              }}>
                {message}
              </small>
            )}
          </div>

          {/* Nombre */}
          <div className="input-group">
            <label>Nombre *</label>
            <div className="input-wrapper">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                required
              />
            </div>
          </div>

          {/* Apellido */}
          <div className="input-group">
            <label>Apellido *</label>
            <div className="input-wrapper">
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Tus apellidos"
                required
              />
            </div>
          </div>
          
          {/* Email */}
          <div className="input-group">
            <label>Correo electrónico *</label>
            <div className="input-wrapper">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                required
              />
            </div>
          </div>

          {/* Teléfono */}
          <div className="input-group">
            <label>
              Teléfono *
              <span style={{ fontSize: "0.75rem", color: "#94a3b8", marginLeft: "8px", fontWeight: "normal" }}>
                (Código país + número)
              </span>
            </label>
            <div className="input-wrapper">
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="+51 999 888 777"
                required
                maxLength={17} // +51 999 888 777 = 15 caracteres
              />
            </div>
          </div>

          {/* Contraseña */}
          <div className="input-group">
            <label>
              Contraseña *
              <span style={{ fontSize: "0.75rem", color: "#94a3b8", marginLeft: "8px", fontWeight: "normal" }}>
                (Mínimo 6 caracteres)
              </span>
            </label>
            <div className="input-wrapper">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Crea una contraseña segura"
                required
                minLength={6}
              />
            </div>
          </div>

          {/* Confirmar contraseña */}
          <div className="input-group">
            <label>Confirmar contraseña *</label>
            <div className="input-wrapper">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite tu contraseña"
                required
                minLength={6}
              />
            </div>
          </div>

          {/* Recordarme */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "8px", 
              cursor: "pointer", 
              color: "var(--text-muted)",
              fontSize: "0.9rem"
            }}>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Recordar mis datos en este dispositivo
            </label>
          </div>

          {/* Error */}
          {error && (
            <p style={{ 
              color: "#ef4444", 
              fontSize: "14px", 
              marginBottom: "12px", 
              textAlign: "center", 
              backgroundColor: "#fee2e2", 
              padding: "8px", 
              borderRadius: "6px" 
            }}>
              {error}
            </p>
          )}

          {/* Botón de registro */}
          <Button
            type="submit"
            variant="primary"
            style={{ width: "100%", padding: "12px", fontSize: "16px" }}
            disabled={isLoading}
          >
            {isLoading ? "Registrando..." : "Crear Cuenta"}
          </Button>

          {/* Ya tienes cuenta */}
          <p style={{ marginTop: "20px", textAlign: "center", color: "var(--text-muted)" }}>
            ¿Ya tienes cuenta?{" "}
            <span
              onClick={onGoLogin}
              style={{
                color: "var(--medium-blue)",
                cursor: "pointer",
                fontWeight: "bold",
                textDecoration: "underline",
              }}
            >
              Inicia sesión
            </span>
          </p>
        </form>
      </div>
      
      {/* MODAL DE ÉXITO */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          if (onGoLogin) onGoLogin();   // <-- redirige al login
        }}
        title="¡Registro exitoso!"
        message="Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión con tus credenciales."
      />
    </div>
  );
};

export default RegisterPage;