import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import ComplaintTable from '../components/ComplaintTable';
import Modal from '../components/Modal';
// Importación de servicios que manejan las peticiones HTTP (Axios/Fetch) al backend
import { userService, complaintsService } from '../services/api';

/**
 * COMPONENTE AUXILIAR: ReadOnlyField
 * Se encarga de renderizar campos de formulario que el usuario no puede editar directamente.
 * Se usa para mostrar información estática como DNI o Correo.
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
 * Props:
 * - user: Objeto con la sesión básica del usuario (usualmente id y tipo).
 * - onLogout: Función para cerrar sesión.
 * - onBack: Función para regresar a la vista anterior.
 * - onViewDetails: Función para ver el detalle de una denuncia específica.
 */
export default function Profile({ user, onLogout, onBack, onViewDetails }) {
  // --- ESTADOS DE UI (Modales y Cargas) ---
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Modal genérico de éxito
  const [showPhoneModal, setShowPhoneModal] = useState(false);     // Modal para editar teléfono
  const [showPasswordModal, setShowPasswordModal] = useState(false); // Modal para cambiar contraseña
  const [isLoadingPhone, setIsLoadingPhone] = useState(false);     // Estado de carga para el teléfono
  const [isLoadingPassword, setIsLoadingPassword] = useState(false); // Estado de carga para la contraseña
  
  // --- ESTADOS DE DATOS ---
  const [userData, setUserData] = useState(null);       // Información detallada del perfil
  const [myComplaints, setMyComplaints] = useState([]); // Lista de denuncias del usuario
  
  // --- ESTADOS DE FORMULARIOS ---
  const [newPhone, setNewPhone] = useState('');         // Campo del nuevo teléfono
  const [phoneError, setPhoneError] = useState('');     // Error de validación de teléfono
  
  const [currentPassword, setCurrentPassword] = useState(''); // Contraseña vieja (validación)
  const [newPassword, setNewPassword] = useState('');         // Nueva contraseña
  const [confirmPassword, setConfirmPassword] = useState(''); // Confirmación
  const [passwordError, setPasswordError] = useState('');     // Error de validación de contraseña

  /**
   * EFECTO DE CARGA INICIAL:
   * Se dispara cuando el componente se monta o cuando el objeto 'user' cambia.
   * Llama a las funciones que traen datos de la API.
   */
  useEffect(() => {
    if (user) {
      loadUserProfile();
      loadUserComplaints();
    }
  }, [user]);

  /**
   * CARGA DE PERFIL:
   * Obtiene los datos completos del usuario desde el servicio 'userService'.
   */
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
   * 1. Trae todas las denuncias.
   * 2. Filtra localmente por el ID del usuario actual.
   * 3. Formatea los datos (fechas y categorías) para que coincidan con lo que espera el componente Tabla.
   */
  const loadUserComplaints = async () => {
    try {
      const response = await complaintsService.getAll();
      if (response.success) {
        // Filtro por la llave foránea 'usuario_id' definida en tu DB
        const userComplaints = response.data.filter(c => c.usuario_id === user.id);
        
        // Mapeo: Transformamos los nombres de campos de la DB a nombres de campos para la UI
        const formattedComplaints = userComplaints.map(complaint => ({
          id: complaint.id,
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
          status: mapStatus(complaint.estado) // Traducimos el estado técnico a algo legible
        }));
        
        setMyComplaints(formattedComplaints);
      }
    } catch (error) {
      console.error('Error cargando denuncias:', error);
    }
  };

  /**
   * HELPER: Mapeo de estados
   * Convierte los valores 'snake_case' de la DB a 'Título' para el usuario.
   */
  const mapStatus = (status) => {
    const statusMap = {
      'pendiente': 'Pendiente',
      'en_revision': 'En Revisión',
      'resuelto': 'Resuelto',
      'urgente': 'Urgente'
    };
    return statusMap[status] || status;
  };

  /**
   * CONTROLADOR: Abrir modal de teléfono
   * Inicializa el campo de entrada con el valor que ya tiene el usuario.
   */
  const handleOpenPhoneModal = () => {
    setNewPhone(formatPhoneForDisplay(userData?.telefono || ''));
    setPhoneError('');
    setShowPhoneModal(true);
  };

  /**
   * LÓGICA: Actualizar Teléfono
   * Limpia el formato (deja solo números) y envía la petición PUT/PATCH al servidor.
   */
  const handleUpdatePhone = async () => {
    const phoneDigits = newPhone.replace(/\D/g, ''); // Quita espacios y el '+'
    
    // Validación básica de longitud
    if (phoneDigits.length < 9) {
      setPhoneError('El teléfono debe tener al menos 9 dígitos');
      return;
    }

    setIsLoadingPhone(true);
    setPhoneError('');
    
    try {
      // Petición al backend usando el ID del usuario
      const response = await userService.updateProfile(user.id, { 
        telefono: phoneDigits 
      });
      
      if (response.success) {
        setUserData(response.data); // Actualizamos el estado local con la respuesta del servidor
        setShowPhoneModal(false);   // Cerramos modal
        setShowSuccessModal(true);  // Mostramos confirmación de éxito
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

  /**
   * LÓGICA: Cambiar Contraseña
   * Realiza validaciones de cliente antes de tocar la API para ahorrar recursos.
   */
  const handleChangePassword = async () => {
    // Validar campos vacíos
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Completa todos los campos');
      return;
    }
    
    // Validar seguridad mínima
    if (newPassword.length < 6) {
      setPasswordError('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    // Validar igualdad
    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }
    
    setIsLoadingPassword(true);
    setPasswordError('');
    
    try {
      // Nota: Aquí se envía 'password', asegúrate que tu backend lo reciba con ese nombre
      const response = await userService.updateProfile(user.id, { 
        password: newPassword
      });
      
      if (response.success) {
        alert('Contraseña actualizada correctamente');
        setShowPasswordModal(false);
        // Reset de campos para seguridad
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

  /**
   * FORMATO: Teléfono
   * Convierte "51999888777" en "+51 999 888 777" para que se vea bien en la UI.
   */
  const formatPhoneForDisplay = (phoneNumber) => {
    if (!phoneNumber) return '';
    const digits = phoneNumber.replace(/\D/g, '');
    if (digits.length === 9) {
      return `+51 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
    }
    return phoneNumber;
  };

  /**
   * MASCARA DE ENTRADA: Teléfono
   * Aplica espacios automáticamente mientras el usuario escribe en el modal.
   */
  const handlePhoneInputChange = (value) => {
    let digits = value.replace(/\D/g, '');
    if (digits.length > 0) {
      if (digits.length <= 2) value = `+${digits}`;
      else if (digits.length <= 5) value = `+${digits.slice(0, 2)} ${digits.slice(2)}`;
      else if (digits.length <= 8) value = `+${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
      else value = `+${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 11)}`;
    }
    setNewPhone(value);
  };

  // Renderizado condicional mientras se obtienen los datos del backend
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
        
        {/* CABECERA DE NAVEGACIÓN */}
        <div className="flex-between" style={{ padding: '40px 0 20px 0' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '15px', fontWeight: 600 }}>
            ← Volver al inicio
          </button>
        </div>

        {/* TÍTULO Y BIENVENIDA */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '3rem', margin: '0 0 10px 0', color: 'var(--deep-blue)', letterSpacing: '-0.03em', fontWeight: 800 }}>
            Hola, {userData.nombres}
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', margin: 0, maxWidth: '600px' }}>
            Bienvenido a tu panel ciudadano. Aquí puedes gestionar tu información personal y hacer seguimiento a tus reportes.
          </p>
        </div>

        {/* CUERPO DEL PERFIL: 2 Columnas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' }}>
          
          {/* COLUMNA 1: Datos Personales (Formulario de lectura y botones de acción) */}
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
                  <Button 
                    onClick={handleOpenPhoneModal}
                    style={{ backgroundColor: 'var(--medium-blue)', color: 'white', width: '100%' }}
                  >
                    Actualizar Teléfono
                  </Button>
                  
                  <Button 
                    onClick={() => setShowPasswordModal(true)}
                    style={{ backgroundColor: '#f1f5f9', color: 'var(--deep-blue)', width: '100%', border: '1px solid var(--border)' }}
                  >
                    Cambiar Contraseña
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMNA 2: Historial de Reportes */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: 'var(--deep-blue)' }}>Historial de Reportes</h3>
              <Button onClick={onLogout} style={{ backgroundColor: '#fff1f2', color: '#e11d48', border: '1px solid #fda4af', height: '36px', fontSize: '0.85rem', padding: '0 16px' }}>
                Cerrar sesión
              </Button>
            </div>
            
            <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
              {/* Si hay denuncias, mostramos la tabla; si no, un mensaje informativo */}
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

      {/* --- MODALES --- */}

      {/* MODAL 1: Notificación de Éxito */}
      <Modal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)} 
        title="¡Datos Actualizados!" 
        message="Tu información ha sido guardada correctamente." 
      />

      {/* MODAL 2: Formulario de actualización de teléfono (Renderizado condicional) */}
      {showPhoneModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(14, 42, 59, 0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '32px', maxWidth: '450px', width: '90%', boxShadow: '0 20px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ marginBottom: '24px', color: 'var(--deep-blue)', fontWeight: 800 }}>Actualizar Teléfono</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ backgroundColor: '#f0f9ff', padding: '12px', borderRadius: '8px', fontSize: '0.9rem' }}>
                <strong>Teléfono actual:</strong> {formatPhoneForDisplay(userData?.telefono)}
              </div>
              <div className="input-group">
                <label>Nuevo Teléfono</label>
                <input type="tel" value={newPhone} onChange={(e) => handlePhoneInputChange(e.target.value)} placeholder="+51 999 888 777" />
              </div>
              {phoneError && <div style={{ color: '#dc2626', fontSize: '0.9rem' }}>{phoneError}</div>}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button onClick={() => setShowPhoneModal(false)} style={{ background: 'none', border: '1px solid var(--border)', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>Cancelar</button>
                <button onClick={handleUpdatePhone} disabled={isLoadingPhone} style={{ backgroundColor: 'var(--deep-blue)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
                  {isLoadingPhone ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Cambio de Contraseña (Renderizado condicional) */}
      {showPasswordModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(14, 42, 59, 0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2001 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '32px', maxWidth: '450px', width: '90%', boxShadow: '0 20px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ marginBottom: '24px', color: 'var(--deep-blue)', fontWeight: 800 }}>Cambiar Contraseña</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div className="input-group">
                <label>Contraseña Actual</label>
                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
              </div>
              <div className="input-group">
                <label>Nueva Contraseña</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              </div>
              <div className="input-group">
                <label>Confirmar Nueva Contraseña</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
              {passwordError && <div style={{ color: '#dc2626', fontSize: '0.9rem' }}>{passwordError}</div>}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button onClick={() => setShowPasswordModal(false)} style={{ background: 'none', border: '1px solid var(--border)', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>Cancelar</button>
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