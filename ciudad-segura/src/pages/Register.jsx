import React, { useState } from "react";
import Button from "../components/Button";
import "../App.css";
import Modal from "../components/Modal";


const RegisterPage = ({ onGoLogin, onBack }) => {
  const [dni, setDNI] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [district, setDistrict] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const TOKEN = "6fc3a3134a4e726dc88066d7b1d6db430cd2348230fc4409415add3fa799"; // Pon tu token aquí

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
        setDistrict("");
        return;
      }

      const data = await response.json();

      if (data?.nombres) {
        setName(data.nombres);
        setLastName(`${data.apellido_paterno} ${data.apellido_materno}`);
        setDistrict(data.distrito || ""); // Si la API devuelve distrito
        setMessage("Datos cargados automáticamente");
      } else {
        setMessage("No se encontró información, completa manualmente");
        setName("");
        setLastName("");
        setDistrict("");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error al consultar el DNI");
    }
  };

  const handleDNIChange = (e) => {
    const value = e.target.value;
    setDNI(value);
    setMessage("");
    if (value.length === 8) {
      fetchDNI(value);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!dni || !name || !lastName || !email || !password || !confirmPassword) {
      setError("Completa todos los campos.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setError("");
    setShowSuccessModal(true);
    //if (onBack) onBack();  // Regresa al Home
  };

  return (
    <div className="container" style={{ maxWidth: "500px", marginTop: "80px" }}>
      <div className="profile-card" style={{ padding: "40px", boxShadow: "var(--shadow-lg)" }}>
        <h2 style={{ marginBottom: "24px", textAlign: "center" }}>Crear Cuenta</h2>

        <form onSubmit={handleRegister}>
          {/* DNI */}
          <div className="input-group">
            <label>DNI</label>
            <div className="input-wrapper">
              <input
                type="text"
                value={dni}
                onChange={handleDNIChange}
                placeholder="Ingresa tu DNI"
                maxLength={8}
              />
            </div>
            {message && (
              <small style={{ color: "#555", display: "block", marginTop: "4px" }}>
                {message}
              </small>
            )}
          </div>

          {/* Nombre */}
          <div className="input-group">
            <label>Nombre</label>
            <div className="input-wrapper">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
              />
            </div>
          </div>

          {/* Apellido */}
          <div className="input-group">
            <label>Apellido</label>
            <div className="input-wrapper">
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Tus apellidos"
              />
            </div>
          </div>
          
          {/* Email */}
          <div className="input-group">
            <label>Correo electrónico</label>
            <div className="input-wrapper">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
              />
            </div>
          </div>

          {/* Contraseña */}
          <div className="input-group">
            <label>Contraseña</label>
            <div className="input-wrapper">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
              />
            </div>
          </div>

          {/* Confirmar contraseña */}
          <div className="input-group">
            <label>Confirmar contraseña</label>
            <div className="input-wrapper">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="********"
              />
            </div>
          </div>

          {/* Recordarme */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Recordarme
            </label>
          </div>

          {/* Error */}
          {error && (
            <p style={{ color: "red", fontSize: "14px", marginBottom: "12px", textAlign: "center" }}>
              {error}
            </p>
          )}

          {/* Botón de registro */}
          <Button
            type="submit"
            variant="primary"
            style={{ width: "100%", padding: "12px", fontSize: "16px" }}
          >
            Registrarse
          </Button>
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
        message="Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión."
      />
    </div>
  );
};

export default RegisterPage;
