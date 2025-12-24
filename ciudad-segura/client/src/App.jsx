import React, { useState, useEffect } from 'react';
// --- IMPORTACIÓN DE COMPONENTES GLOBALES (UI) ---
import Header from './components/Header';
import Footer from './components/Footer';
import Modal from './components/Modal';
import ContactModal from './components/ContactModal';
import AnonymousModal from './components/AnonymousModal';

// --- IMPORTACIÓN DE PÁGINAS (VISTAS) ---
import Home from './pages/Home';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import About from './pages/About';
import LoginModal from './pages/LoginModal';
import RegisterPage from './pages/Register';
import CreateReport from './pages/CreateReport';
import ComplaintDetails from './pages/ComplaintDetails';
import AdminDashboard from './pages/AdminDashboard';
import ViewAllComplaints from './pages/ViewAllComplaints'; 

// --- IMPORTACIÓN DE SERVICIOS (API) ---
// Estos archivos contienen las funciones que hacen fetch/axios al backend
import { authService, complaintsService, notificationsService } from './services/api';
import './App.css';

function App() {
  // --- 1. ESTADOS DE IDENTIDAD Y NAVEGACIÓN ---
  // Almacena el objeto del usuario logueado (null si es invitado)
  const [user, setUser] = useState(null);
  // Controla qué "página" se muestra (sistema de rutas manual)
  const [currentPage, setCurrentPage] = useState('home'); 
  // Guarda el ID de la denuncia seleccionada para ver su detalle
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  
  // --- 2. ESTADOS DE INTERFAZ (MODALES) ---
  // Controlan la visibilidad de los diferentes diálogos emergentes
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAnonymousModal, setShowAnonymousModal] = useState(false);
  
  // --- 3. ESTADOS DE DATOS GLOBALES ---
  const [notifications, setNotifications] = useState([]);

  // --- 4. EFECTOS (SIDE EFFECTS) ---
  
  /**
   * EFECTO: Sincronización de Notificaciones
   * Se ejecuta cada vez que el estado 'user' cambia. Si el usuario entra, busca sus avisos;
   * si sale, limpia la lista para evitar fugas de información.
   */
  useEffect(() => {
    if (user) {
      loadNotifications(user.id);
    } else {
      setNotifications([]); 
    }
  }, [user]);

  /**
   * EFECTO: UX de Notificaciones
   * Escucha clicks en cualquier parte del documento para cerrar el dropdown de notificaciones
   * automáticamente si está abierto.
   */
  useEffect(() => {
    const handleClickOutside = () => { 
      if (showNotifications) setShowNotifications(false); 
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showNotifications]);

  // --- 5. LÓGICA DE NOTIFICACIONES ---
  
  // Conecta con el servicio para traer las alertas del usuario desde la DB
  const loadNotifications = async (userId) => {
    try {
      const response = await notificationsService.getUserNotifications(userId);
      if (response.success) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error('Error cargando notificaciones:', error);
    }
  };

  // Cambia el estado 'leído' en la DB y actualiza la lista local para reflejar el cambio en UI
  const handleMarkAsRead = async (notificationId) => {
    if (user) {
      try {
        await notificationsService.markAsRead(user.id, notificationId);
        setNotifications(prev => prev.map(notif => 
          notif.id === notificationId ? { ...notif, read: true } : notif
        ));
      } catch (error) {
        console.error('Error marcando como leída:', error);
      }
    }
  };

  // --- 6. LÓGICA DE AUTENTICACIÓN ---
  
  /**
   * handleLogin: Procesa el inicio de sesión.
   * Si tiene éxito, guarda el usuario en el estado y redirige según el rol (Admin o Ciudadano).
   */
  const handleLogin = async (username, password) => {
    try {
      const response = await authService.login(username, password);
      
      if (response.success) {
        setUser(response.user);
        
        // Lógica de redirección por roles
        if (response.user.rol === 'administrador') {
          setCurrentPage('admin-dashboard');
        } else {
          setCurrentPage('home');
        }
        
        setShowLoginModal(false);
      } else {
        throw new Error('Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error; // El error se relanza para que el LoginModal lo muestre en su UI
    }
  };

  // Limpia el estado del usuario y regresa al Home al cerrar sesión
  const handleLogout = () => { 
    setUser(null); 
    setCurrentPage('home'); 
    setShowNotifications(false); 
    setShowLogoutModal(true); 
  };

  // --- 7. LÓGICA DE DENUNCIAS ---
  
  // Envía la nueva denuncia al servidor adjuntando el ID del usuario si está logueado
  const handleCreateReport = async (reportData) => {
    try {
      const complaintData = {
        ...reportData,
        userId: user ? user.id : null
      };
      
      const response = await complaintsService.create(complaintData);
      
      if (response.success) {
        return {
          success: true,
          trackingCode: response.data.trackingCode,
          complaintId: response.data.id
        };
      }
    } catch (error) {
      console.error('Error creando reporte:', error);
      return { 
        success: false, 
        error: error.message || 'Error al crear el reporte' 
      };
    }
  };

  // --- 8. FUNCIONES DE NAVEGACIÓN Y UI ---
  
  const closeModal = () => setShowLogoutModal(false);
  
  // Helper para mover la vista al inicio al cambiar de página
  const onNavigateToRegister = () => { 
    setCurrentPage('register'); 
    window.scrollTo(0, 0); 
  };
  
  const handleBackToHome = () => { 
    setCurrentPage('home'); 
    window.scrollTo(0, 0); 
  };
  
  const handleNavigateToAbout = () => { 
    setCurrentPage('about'); 
    window.scrollTo(0, 0); 
  };

  // Lógica de acceso: si no está logueado, pregunta si quiere denunciar como anónimo
  const handleNavigateToCreateReport = () => {
    if (user) {
      setCurrentPage('create-report');
      window.scrollTo(0, 0);
    } else {
      setShowAnonymousModal(true);
    }
  };

  const handleNavigateToAllComplaints = () => {
    setCurrentPage('view-all-complaints');
    window.scrollTo(0, 0);
  };

  // Flujo del modal de reporte anónimo
  const handleContinueAnonymous = () => {
    setShowAnonymousModal(false);
    setCurrentPage('create-report');
    window.scrollTo(0, 0);
  };

  const handleLoginFromAnonymous = () => {
    setShowAnonymousModal(false);
    setShowLoginModal(true);
  };

  const goToLogin = () => { 
    setShowLoginModal(true); 
    if (currentPage === 'register') setCurrentPage("home"); 
  };

  // Al seleccionar una denuncia en el Home/Lista, se guarda su ID y se cambia de vista
  const handleViewDetails = (id) => { 
    setSelectedComplaintId(id); 
    setCurrentPage('complaint-details'); 
    window.scrollTo(0, 0); 
  };

  const toggleNotifications = (e) => { 
    if (e && e.stopPropagation) e.stopPropagation(); 
    setShowNotifications(prev => !prev); 
  };

  const handleViewAllNotifications = () => { 
    setCurrentPage('notifications'); 
    setShowNotifications(false); 
  };

  const handleOpenContact = () => setShowContactModal(true);
  const handleCloseContact = () => setShowContactModal(false);

  // --- 9. RENDERIZADO DEL COMPONENTE ---
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* LOGICA DE RUTA ADMIN: 
        Si el estado es 'admin-dashboard', se renderiza una vista limpia sin Header/Footer estándar.
      */}
      {currentPage === 'admin-dashboard' ? (
        <AdminDashboard onLogout={handleLogout} />
      ) : (
        <>
          {/* COMPONENTES PERSISTENTES (HEADER Y MODALES) */}
          <Header 
            user={user} 
            onLogin={() => setShowLoginModal(true)}
            onNavigateToProfile={() => setCurrentPage('profile')}
            onNavigateToRegister={onNavigateToRegister}
            onNavigateToHome={handleBackToHome}
            notifications={notifications}
            showNotifications={showNotifications}
            toggleNotifications={toggleNotifications}
            onViewAllNotifications={handleViewAllNotifications}
            onMarkAsRead={handleMarkAsRead}
          />
          
          <Modal 
            isOpen={showLogoutModal} 
            onClose={closeModal} 
            title="¡Hasta pronto!" 
            message="Has cerrado sesión correctamente." 
          />
          
          <ContactModal 
            isOpen={showContactModal} 
            onClose={handleCloseContact} 
          />
          
          <AnonymousModal 
            isOpen={showAnonymousModal} 
            onClose={() => setShowAnonymousModal(false)}
            onLogin={handleLoginFromAnonymous}
            onContinueAnonymous={handleContinueAnonymous}
          />

          <LoginModal
            isOpen={showLoginModal}
            onClose={() => setShowLoginModal(false)}
            onLogin={handleLogin}
          />

          {/* CONTENEDOR DE PÁGINAS (ENRUTADOR MANUAL):
            Aquí se decide qué componente mostrar basándose en el estado 'currentPage'.
          */}
          <div style={{ flex: 1 }}>
            
            {currentPage === 'register' && (
              <RegisterPage onGoLogin={goToLogin} onBack={handleBackToHome} />
            )}
            
            {currentPage === 'home' && (
              <Home 
                onCreateReport={handleNavigateToCreateReport} 
                onViewDetails={handleViewDetails}
                onViewAll={handleNavigateToAllComplaints}
              />
            )}
            
            {currentPage === 'profile' && user && (
              <Profile 
                user={user}
                onLogout={handleLogout} 
                onBack={handleBackToHome} 
                onViewDetails={handleViewDetails} 
              />
            )}
            
            {currentPage === 'notifications' && user && (
              <Notifications user={user} onBack={handleBackToHome} />
            )}
            
            {currentPage === 'about' && (
              <About onBack={handleBackToHome} />
            )}
            
            {currentPage === 'create-report' && (
              <CreateReport 
                user={user}
                onBack={handleBackToHome} 
                onSubmitSuccess={handleBackToHome} 
                onViewDetails={handleViewDetails}
                onCreateReport={handleCreateReport}
              />
            )}
            
            {currentPage === 'complaint-details' && (
              <ComplaintDetails 
                complaintId={selectedComplaintId} 
                onBack={handleBackToHome} 
              />
            )}
            
            {currentPage === 'view-all-complaints' && (
              <ViewAllComplaints 
                onBack={handleBackToHome}
                onViewDetails={handleViewDetails}
              />
            )}
          </div>
          
          {/* FOOTER PERSISTENTE */}
          <Footer 
            onNavigateToAbout={handleNavigateToAbout} 
            onOpenContact={handleOpenContact} 
          />
        </>
      )}
    </div>
  );
}

export default App;