import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import ComplaintTable from '../components/ComplaintTable';
import Modal from '../components/Modal';
// Importación de servicios que manejan las peticiones HTTP
import { userService, complaintsService } from '../services/api';

/**
 * COMPONENTE AUXILIAR: ReadOnlyField
 * Mantiene el estilo original de tu perfil.
 */
const ReadOnlyField = ({ label, value }) => (
  <div className="input-group">
    <label>{label}</label>
    <div className="input-wrapper disabled">
      <input 
        type="text" 
        value={value || ''} 
        disabled={true} 
        readOnly
      />
    </div>
  </div>
);

/**
 * COMPONENTE PRINCIPAL: Profile
 */
export default function Profile({ user, onLogout, onBack, onViewDetails }) {
  // --- ESTADOS DE UI ---
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isLoadingPhone, setIsLoadingPhone] = useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  
  // --- ESTADOS DE DATOS ---
  const [userData, setUserData] = useState(null);
  const [myComplaints, setMyComplaints] = useState([]);
  
  // --- ESTADOS DE FORMULARIOS ---
  const [newPhone, setNewPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (user) {
      loadUserProfile();
      loadUserComplaints();
    }
  }, [user]);

  const loadUserProfile = async () => {
    try {
      const response = await userService.getProfile(user.id);
      if (response.success) {
        setUserData(response.data);
      }
    } catch (error) {
      console.error('Error cargando perfil:', error);
    }
  };

  /**
   * CARGA DE DENUNCIAS:
   * Ahora incluye 'trackingCode' (codigo_seguimiento) para la tabla.
   */
  const loadUserComplaints = async () => {
    try {
      const response = await complaintsService.getAll();
      if (response.success) {
        const userComplaints = response.data.filter(c => c.usuario_id === user.id);
        
        const formattedComplaints = userComplaints.map(complaint => ({
          id: complaint.id, // ID interno para navegación
          trackingCode: complaint.codigo_seguimiento, // Código visual (ej: D-2025-001)
          date: new Date(complaint.fecha_creacion).toLocaleDateString('es-ES', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric' 
          }),
          time: new Date(complaint.fecha_creacion).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
          }),
          category: complaint.categoria, 
          status: mapStatus(complaint.estado)
        }));
        
        setMyComplaints(formattedComplaints);
      }
    } catch (error) {
      console.error('Error cargando denuncias:', error);
    }
  };

  const mapStatus = (status) => {
    const statusMap = {
      'pendiente': 'Pendiente',
      'en_revision': 'En Revisión',
      'resuelto': 'Resuelto',
      'urgente': 'Urgente'
    };
    return statusMap[status] || status;
  };

  const handleOpenPhoneModal = () => {
    setNewPhone(userData?.telefono || '');
    setPhoneError('');
    setShowPhoneModal(true);
  };

  const handleUpdatePhone = async () => {
    const phoneDigits = newPhone.replace(/\D/g, '');
    if (phoneDigits.length < 9) {
      setPhoneError('El teléfono debe tener al menos 9 dígitos');
      return;
    }

    setIsLoadingPhone(true);
    setPhoneError('');
    try {
      const response = await userService.updateProfile(user.id, { telefono: phoneDigits });
      if (response.success) {
        setUserData(response.data);
        setShowPhoneModal(false);
        setShowSuccessModal(true);
      } else {
        setPhoneError('Error al actualizar teléfono');
      }
    } catch (error) {
      setPhoneError('Error de conexión');
    } finally {
      setIsLoadingPhone(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Completa todos los campos');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }
    setIsLoadingPassword(true);
    setPasswordError('');
    try {
      const response = await userService.updateProfile(user.id, { password: newPassword });
      if (response.success) {
        setShowPasswordModal(false);
        setShowSuccessModal(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordError('Error al actualizar contraseña');
      }
    } catch (error) {
      setPasswordError('Error de conexión');
    } finally {
      setIsLoadingPassword(false);
    }
  };

  const formatPhoneForDisplay = (phoneNumber) => {
    if (!phoneNumber) return '';
    const digits = phoneNumber.replace(/\D/g, '');
    return digits.length === 9 ? `+51 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}` : phoneNumber;
  };

  if (!user || !userData) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px' }}>
        <p>Cargando perfil...</p>
        <Button onClick={onBack}>Volver al inicio</Button>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-body)', minHeight: '100vh' }}>
      <main className="container" style={{ paddingBottom: '80px' }}>
        
        {/* CABECERA CON BOTÓN MEJORADO */}
        <div className="flex-between" style={{ padding: '40px 0 20px 0' }}>
          <Button 
            onClick={onBack}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            }
            style={{ 
              backgroundColor: 'var(--deep-blue)', 
              color: 'white', 
              padding: '12px 24px',
              borderRadius: '12px',
              fontSize: '1.05rem',
              fontWeight: 700,
              border: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(30, 58, 138, 0.3)'
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
            Volver al inicio
          </Button>
        </div>

        {/* TÍTULO */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '3rem', margin: '0 0 10px 0', color: 'var(--deep-blue)', letterSpacing: '-0.03em', fontWeight: 800 }}>
            Hola, {userData.nombres}
          </h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' }}>
          
          {/* COLUMNA 1: Datos Personales */}
          <div>
            <div className="profile-card">
              <div className="section-header">
                <h3>Mis Datos Personales</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <ReadOnlyField label="DNI" value={userData.dni} />
                <div className="form-grid-compact">
                  <ReadOnlyField label="Nombre" value={userData.nombres} />
                  <ReadOnlyField label="Apellidos" value={userData.apellidos} />
                </div>
                <ReadOnlyField label="Correo electrónico" value={userData.correo} />
                
                <div style={{ paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <Button onClick={handleOpenPhoneModal} style={{ backgroundColor: 'var(--medium-blue)', color: 'white', width: '100%' }}>
                    Actualizar Teléfono
                  </Button>
                  <Button onClick={() => setShowPasswordModal(true)} style={{ backgroundColor: '#f1f5f9', color: 'var(--deep-blue)', width: '100%', border: '1px solid var(--border)' }}>
                    Cambiar Contraseña
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMNA 2: Historial */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: 'var(--deep-blue)' }}>Historial de Reportes</h3>
              <Button onClick={onLogout} style={{ backgroundColor: '#fff1f2', color: '#e11d48', border: '1px solid #fda4af', height: '36px', fontSize: '0.85rem', padding: '0 16px' }}>
                Cerrar sesión
              </Button>
            </div>
            <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
              {myComplaints.length > 0 ? (
                <ComplaintTable data={myComplaints} onViewDetails={onViewDetails} />
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                  <p>No has creado ninguna denuncia aún.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Modal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} title="¡Datos Actualizados!" message="Tu información ha sido guardada correctamente." />

      {/* MODAL ACTUALIZAR TELÉFONO */}
      {showPhoneModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(14, 42, 59, 0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '32px', maxWidth: '450px', width: '90%', boxShadow: '0 20px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ marginBottom: '24px', color: 'var(--deep-blue)', fontWeight: 800 }}>Actualizar Teléfono</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ backgroundColor: '#f0f9ff', padding: '12px', borderRadius: '8px', fontSize: '0.9rem', color: 'var(--medium-blue)' }}>
                <strong>Teléfono actual:</strong> {formatPhoneForDisplay(userData?.telefono)}
              </div>
              <div className="input-group">
                <label>NUEVO TELÉFONO</label>
                <div className="input-wrapper">
                  <input type="tel" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="999888777" />
                </div>
              </div>
              {phoneError && <div style={{ color: '#dc2626', fontSize: '0.9rem' }}>{phoneError}</div>}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button onClick={() => setShowPhoneModal(false)} style={{ background: 'none', border: '1px solid var(--border)', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Cancelar</button>
                <button onClick={handleUpdatePhone} disabled={isLoadingPhone} style={{ backgroundColor: 'var(--deep-blue)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
                  {isLoadingPhone ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CAMBIAR CONTRASEÑA */}
      {showPasswordModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(14, 42, 59, 0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2001 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '32px', maxWidth: '450px', width: '90%', boxShadow: '0 20px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ marginBottom: '24px', color: 'var(--deep-blue)', fontWeight: 800 }}>Cambiar Contraseña</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div className="input-group">
                <label>CONTRASEÑA ACTUAL</label>
                <div className="input-wrapper">
                  <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                </div>
              </div>
              <div className="input-group">
                <label>NUEVA CONTRASEÑA</label>
                <div className="input-wrapper">
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>
              </div>
              <div className="input-group">
                <label>CONFIRMAR NUEVA CONTRASEÑA</label>
                <div className="input-wrapper">
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
              </div>
              {passwordError && <div style={{ color: '#dc2626', fontSize: '0.9rem' }}>{passwordError}</div>}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button onClick={() => setShowPasswordModal(false)} style={{ background: 'none', border: '1px solid var(--border)', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Cancelar</button>
                <button onClick={handleChangePassword} disabled={isLoadingPassword} style={{ backgroundColor: 'var(--deep-blue)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
                  {isLoadingPassword ? 'Cambiando...' : 'Cambiar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}