import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import ComplaintTable from '../components/ComplaintTable';
import Modal from '../components/Modal';
import { userService, complaintsService } from '../services/api';

// Componente de input (solo lectura para mostrar datos)
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

export default function Profile({ user, onLogout, onBack, onViewDetails }) {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false); // <-- NUEVO: Modal para teléfono
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPhone, setIsLoadingPhone] = useState(false); // <-- NUEVO
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  const [userData, setUserData] = useState(null);
  const [myComplaints, setMyComplaints] = useState([]);
  
  // Estados para los modales
  const [newPhone, setNewPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Cargar datos del usuario
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

  const loadUserComplaints = async () => {
    try {
      const response = await complaintsService.getAll();
      if (response.success) {
        const userComplaints = response.data.filter(c => c.userId === user.id);
        
        const formattedComplaints = userComplaints.map(complaint => ({
          id: complaint.id,
          date: new Date(complaint.createdAt).toLocaleDateString('es-ES', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric' 
          }),
          time: new Date(complaint.createdAt).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
          }),
          category: complaint.category,
          status: mapStatus(complaint.status)
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

  // Abrir modal para actualizar teléfono
  const handleOpenPhoneModal = () => {
    setNewPhone(formatPhoneForDisplay(userData?.phone || ''));
    setPhoneError('');
    setShowPhoneModal(true);
  };

  // Actualizar teléfono
  const handleUpdatePhone = async () => {
    // Validar teléfono
    const phoneDigits = newPhone.replace(/\D/g, '');
    if (phoneDigits.length < 9) {
      setPhoneError('El teléfono debe tener al menos 9 dígitos');
      return;
    }

    setIsLoadingPhone(true);
    setPhoneError('');
    
    try {
      const response = await userService.updateProfile(user.id, { 
        phone: phoneDigits 
      });
      
      if (response.success) {
        setUserData(response.data);
        setShowPhoneModal(false);
        setShowSuccessModal(true);
        // No limpiar newPhone aquí para mantenerlo si el usuario quiere editar de nuevo
      } else {
        setPhoneError('Error al actualizar teléfono');
      }
    } catch (error) {
      console.error('Error actualizando teléfono:', error);
      setPhoneError('Error de conexión');
    } finally {
      setIsLoadingPhone(false);
    }
  };

  // Cambiar contraseña
  const handleChangePassword = async () => {
    // Validaciones
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Completa todos los campos');
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }
    
    setIsLoadingPassword(true);
    setPasswordError('');
    
    try {
      const response = await userService.updateProfile(user.id, { 
        password: newPassword
      });
      
      if (response.success) {
        alert('Contraseña actualizada correctamente');
        setShowPasswordModal(false);
        // Limpiar campos
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordError('Error al actualizar contraseña');
      }
    } catch (error) {
      console.error('Error cambiando contraseña:', error);
      setPasswordError('Error de conexión');
    } finally {
      setIsLoadingPassword(false);
    }
  };

  // Formatear teléfono para mostrar
  const formatPhoneForDisplay = (phoneNumber) => {
    if (!phoneNumber) return '';
    const digits = phoneNumber.replace(/\D/g, '');
    if (digits.length === 9) {
      return `+51 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
    }
    return phoneNumber;
  };

  // Formatear teléfono mientras se escribe
  const handlePhoneInputChange = (value) => {
    let digits = value.replace(/\D/g, '');
    
    // Formato: +51 XXX XXX XXX
    if (digits.length > 0) {
      if (digits.length <= 2) {
        value = `+${digits}`;
      } else if (digits.length <= 5) {
        value = `+${digits.slice(0, 2)} ${digits.slice(2)}`;
      } else if (digits.length <= 8) {
        value = `+${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
      } else {
        value = `+${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 11)}`;
      }
    }
    
    setNewPhone(value);
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
        
        <div className="flex-between" style={{ padding: '40px 0 20px 0' }}>
          <button onClick={onBack} style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            color: 'var(--text-muted)', 
            fontSize: '15px', 
            fontWeight: 600 
          }}>
            ← Volver al inicio
          </button>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ 
            fontSize: '3rem', 
            margin: '0 0 10px 0', 
            color: 'var(--deep-blue)', 
            letterSpacing: '-0.03em', 
            fontWeight: 800 
          }}>
            Hola, {userData.name}
          </h1>
          <p style={{ 
            fontSize: '1.2rem', 
            color: 'var(--text-muted)', 
            margin: 0, 
            maxWidth: '600px' 
          }}>
            Bienvenido a tu panel ciudadano. Aquí puedes gestionar tu información personal y hacer seguimiento a tus reportes.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' }}>
          
          {/* COLUMNA 1: Datos Personales */}
          <div>
            <div className="profile-card">
              <div className="section-header">
                <h3>Mis Datos Personales</h3>
                <p style={{ 
                  fontSize: '0.85rem', 
                  color: 'var(--text-muted)', 
                  margin: '8px 0 0 0',
                  fontWeight: 'normal'
                }}>
                  Datos registrados en el sistema
                </p>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* DNI (solo lectura) */}
                <ReadOnlyField 
                  label="DNI" 
                  value={userData.dni} 
                />
                
                {/* Nombre y Apellido (solo lectura) */}
                <div className="form-grid-compact">
                  <div className="input-group">
                    <label>Nombre</label>
                    <div className="input-wrapper disabled">
                      <input 
                        type="text" 
                        value={userData.name || ''} 
                        disabled={true} 
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="input-group">
                    <label>Apellidos</label>
                    <div className="input-wrapper disabled">
                      <input 
                        type="text" 
                        value={userData.lastName || ''} 
                        disabled={true} 
                        readOnly
                      />
                    </div>
                  </div>
                </div>
                
                {/* Email (solo lectura) */}
                <ReadOnlyField 
                  label="Correo electrónico" 
                  value={userData.email} 
                />
                                
                {/* Botones de acción */}
                <div style={{ 
                  paddingTop: '20px', 
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <Button 
                    onClick={handleOpenPhoneModal}
                    style={{ 
                      backgroundColor: 'var(--medium-blue)', 
                      color: 'white', 
                      width: '100%' 
                    }}
                  >
                    Actualizar Teléfono
                  </Button>
                  
                  <Button 
                    onClick={() => setShowPasswordModal(true)}
                    style={{ 
                      backgroundColor: '#f1f5f9', 
                      color: 'var(--deep-blue)', 
                      width: '100%',
                      border: '1px solid var(--border)'
                    }}
                  >
                    Cambiar Contraseña
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMNA 2: Historial de Reportes */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ 
              marginBottom: '20px', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: 700, 
                margin: 0, 
                color: 'var(--deep-blue)' 
              }}>
                Historial de Reportes
              </h3>
              
              <Button 
                onClick={onLogout}
                style={{ 
                  backgroundColor: '#fff1f2', 
                  color: '#e11d48', 
                  border: '1px solid #fda4af', 
                  height: '36px', 
                  fontSize: '0.85rem', 
                  padding: '0 16px' 
                }}
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                }
              >
                Cerrar sesión
              </Button>
            </div>
            
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '16px', 
              padding: '24px', 
              boxShadow: 'var(--shadow-sm)', 
              border: '1px solid var(--border)' 
            }}>
              {myComplaints.length > 0 ? (
                <ComplaintTable data={myComplaints} onViewDetails={onViewDetails} />
              ) : (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '40px 0', 
                  color: 'var(--text-muted)' 
                }}>
                  <p>No has creado ninguna denuncia aún.</p>
                  <Button 
                    onClick={() => window.location.reload()} 
                    style={{ marginTop: '10px' }}
                  >
                    Refrescar
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* MODAL: Confirmación de actualización */}
      <Modal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)} 
        title="¡Datos Actualizados!" 
        message="Tu información ha sido guardada correctamente en nuestro sistema." 
      />

      {/* MODAL: Actualizar Teléfono */}
      {showPhoneModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(14, 42, 59, 0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '24px',
            padding: '32px',
            maxWidth: '450px',
            width: '90%',
            boxShadow: '0 20px 25px rgba(0,0,0,0.2)',
            animation: 'scaleUp 0.3s ease-out'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h3 style={{ 
                margin: 0, 
                fontSize: '1.5rem', 
                color: 'var(--deep-blue)',
                fontWeight: 800
              }}>
                Actualizar Teléfono
              </h3>
              <button 
                onClick={() => setShowPhoneModal(false)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  color: 'var(--text-muted)' 
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Información actual */}
              <div style={{ 
                backgroundColor: '#f0f9ff', 
                padding: '12px 16px', 
                borderRadius: '8px',
                fontSize: '0.9rem',
                color: 'var(--medium-blue)'
              }}>
                <div style={{ fontWeight: 600, marginBottom: '4px' }}>Teléfono actual:</div>
                <div>{formatPhoneForDisplay(userData?.phone) || 'No registrado'}</div>
              </div>

              {/* Nuevo teléfono */}
              <div className="input-group">
                <label>Nuevo Teléfono *</label>
                <div className="input-wrapper">
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={(e) => handlePhoneInputChange(e.target.value)}
                    placeholder="+51 999 888 777"
                    required
                    maxLength={17}
                  />
                </div>
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: 'var(--text-muted)', 
                  marginTop: '4px'
                }}>
                  Formato: +51 XXX XXX XXX
                </div>
              </div>

              {/* Error de teléfono */}
              {phoneError && (
                <div style={{ 
                  backgroundColor: '#fee2e2', 
                  color: '#dc2626', 
                  padding: '10px', 
                  borderRadius: '8px',
                  fontSize: '0.9rem'
                }}>
                  {phoneError}
                </div>
              )}

              {/* Botones */}
              <div style={{ 
                display: 'flex', 
                gap: '12px', 
                marginTop: '10px',
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={() => setShowPhoneModal(false)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: 'white',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text-muted)',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpdatePhone}
                  disabled={isLoadingPhone}
                  style={{
                    padding: '10px 24px',
                    backgroundColor: 'var(--deep-blue)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    opacity: isLoadingPhone ? 0.7 : 1
                  }}
                >
                  {isLoadingPhone ? 'Actualizando...' : 'Actualizar Teléfono'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Cambiar Contraseña */}
      {showPasswordModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(14, 42, 59, 0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2001 // Mayor que phone modal
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '24px',
            padding: '32px',
            maxWidth: '450px',
            width: '90%',
            boxShadow: '0 20px 25px rgba(0,0,0,0.2)',
            animation: 'scaleUp 0.3s ease-out'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h3 style={{ 
                margin: 0, 
                fontSize: '1.5rem', 
                color: 'var(--deep-blue)',
                fontWeight: 800
              }}>
                Cambiar Contraseña
              </h3>
              <button 
                onClick={() => setShowPasswordModal(false)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  color: 'var(--text-muted)' 
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Contraseña actual */}
              <div className="input-group">
                <label>Contraseña Actual *</label>
                <div className="input-wrapper">
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Ingresa tu contraseña actual"
                    required
                  />
                </div>
              </div>

              {/* Nueva contraseña */}
              <div className="input-group">
                <label>Nueva Contraseña *</label>
                <div className="input-wrapper">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              {/* Confirmar contraseña */}
              <div className="input-group">
                <label>Confirmar Nueva Contraseña *</label>
                <div className="input-wrapper">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repite la nueva contraseña"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              {/* Error de contraseña */}
              {passwordError && (
                <div style={{ 
                  backgroundColor: '#fee2e2', 
                  color: '#dc2626', 
                  padding: '10px', 
                  borderRadius: '8px',
                  fontSize: '0.9rem'
                }}>
                  {passwordError}
                </div>
              )}

              {/* Botones */}
              <div style={{ 
                display: 'flex', 
                gap: '12px', 
                marginTop: '10px',
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: 'white',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text-muted)',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleChangePassword}
                  disabled={isLoadingPassword}
                  style={{
                    padding: '10px 24px',
                    backgroundColor: 'var(--deep-blue)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    opacity: isLoadingPassword ? 0.7 : 1
                  }}
                >
                  {isLoadingPassword ? 'Actualizando...' : 'Cambiar Contraseña'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};