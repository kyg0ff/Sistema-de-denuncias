import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Modal from './components/Modal';
import ContactModal from './components/ContactModal';
import AnonymousModal from './components/AnonymousModal';

import Home from './pages/Home';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import About from './pages/About';
import LoginModal from './pages/LoginModal';
import RegisterPage from './pages/Register';
import CreateReport from './pages/CreateReport';
import ComplaintDetails from './pages/ComplaintDetails';
import AdminDashboard from './pages/AdminDashboard';
import ViewAllComplaints from './pages/ViewAllComplaints'; // <-- Asegúrate de importar

import { authService, complaintsService, notificationsService } from './services/api';
import './App.css';

function App() {
  // --- ESTADOS PRINCIPALES ---
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('home'); 
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  
  // --- ESTADOS DE MODALES ---
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAnonymousModal, setShowAnonymousModal] = useState(false);
  
  // --- ESTADOS DE DATOS ---
  const [notifications, setNotifications] = useState([]);

  // --- EFECTOS ---
  
  // Cargar notificaciones cuando el usuario cambie
  useEffect(() => {
    if (user) {
      loadNotifications(user.id);
    } else {
      setNotifications([]); // Limpiar notificaciones si no hay usuario
    }
  }, [user]);

  // Cerrar notificaciones al hacer click fuera
  useEffect(() => {
    const handleClickOutside = () => { 
      if (showNotifications) setShowNotifications(false); 
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showNotifications]);

  // --- FUNCIONES DE DATOS ---
  
  // Cargar notificaciones del backend
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

  // Marcar notificación como leída
  const handleMarkAsRead = async (notificationId) => {
    if (user) {
      try {
        await notificationsService.markAsRead(user.id, notificationId);
        // Actualizar estado local
        setNotifications(prev => prev.map(notif => 
          notif.id === notificationId ? { ...notif, read: true } : notif
        ));
      } catch (error) {
        console.error('Error marcando como leída:', error);
      }
    }
  };

  // --- FUNCIONES DE AUTENTICACIÓN ---
  
  // Login con backend
  // En App.jsx, modifica la función handleLogin:
  const handleLogin = async (username, password) => {
    try {
      const response = await authService.login(username, password);
      
      if (response.success) {
        setUser(response.user);
        
        // Redireccionar según rol
        if (response.user.role === 'admin') {
          setCurrentPage('admin-dashboard');
        } else {
          setCurrentPage('home');
        }
        
        setShowLoginModal(false);
      } else {
        // Lanzar error para que LoginModal muestre el modal
        throw new Error('Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Login error:', error);
      // Relanzar el error para que LoginModal lo capture
      throw error;
    }
  };

  // Logout
  const handleLogout = () => { 
    setUser(null); 
    setCurrentPage('home'); 
    setShowNotifications(false); 
    setShowLogoutModal(true); 
  };

  // --- FUNCIONES DE DENUNCIAS ---
  
  // Crear denuncia con backend
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

  // --- FUNCIONES DE NAVEGACIÓN ---
  
  const closeModal = () => setShowLogoutModal(false);
  
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

  // Navegar a crear reporte (con modal anónimo si no hay usuario)
  const handleNavigateToCreateReport = () => {
    if (user) {
      setCurrentPage('create-report');
      window.scrollTo(0, 0);
    } else {
      setShowAnonymousModal(true);
    }
  };

  // Navegar a ver todas las denuncias
  const handleNavigateToAllComplaints = () => {
    setCurrentPage('view-all-complaints');
    window.scrollTo(0, 0);
  };

  // Funciones del modal anónimo
  const handleContinueAnonymous = () => {
    setShowAnonymousModal(false);
    setCurrentPage('create-report');
    window.scrollTo(0, 0);
  };

  const handleLoginFromAnonymous = () => {
    setShowAnonymousModal(false);
    setShowLoginModal(true);
  };

  // Otras funciones de navegación
  const goToLogin = () => { 
    setShowLoginModal(true); 
    if (currentPage === 'register') setCurrentPage("home"); 
  };

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

  // --- RENDER PRINCIPAL ---
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* ADMIN DASHBOARD (página completa separada) */}
      {currentPage === 'admin-dashboard' ? (
        <AdminDashboard onLogout={handleLogout} />
      ) : (
        <>
          {/* HEADER */}
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
          
          {/* MODALES GLOBALES */}
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

          {/* CONTENIDO PRINCIPAL (páginas) */}
          <div style={{ flex: 1 }}>
            {/* REGISTRO */}
            {currentPage === 'register' && (
              <RegisterPage 
                onGoLogin={goToLogin} 
                onBack={handleBackToHome} 
              />
            )}
            
            {/* HOME */}
            {currentPage === 'home' && (
              <Home 
                onCreateReport={handleNavigateToCreateReport} 
                onViewDetails={handleViewDetails}
                onViewAll={handleNavigateToAllComplaints}
              />
            )}
            
            {/* PERFIL */}
            {currentPage === 'profile' && user && (
              <Profile 
                user={user}
                onLogout={handleLogout} 
                onBack={handleBackToHome} 
                onViewDetails={handleViewDetails} 
              />
            )}
            
            {/* NOTIFICACIONES */}
            {currentPage === 'notifications' && user && (
              <Notifications 
                user={user}
                onBack={handleBackToHome} 
              />
            )}
            
            {/* ACERCA DE */}
            {currentPage === 'about' && (
              <About onBack={handleBackToHome} />
            )}
            
            {/* CREAR REPORTE */}
            {currentPage === 'create-report' && (
              <CreateReport 
                user={user}
                onBack={handleBackToHome} 
                onSubmitSuccess={handleBackToHome} 
                onViewDetails={handleViewDetails}
                onCreateReport={handleCreateReport}
              />
            )}
            
            {/* DETALLE DE DENUNCIA */}
            {currentPage === 'complaint-details' && (
              <ComplaintDetails 
                complaintId={selectedComplaintId} 
                onBack={handleBackToHome} 
              />
            )}
            
            {/* VER TODAS LAS DENUNCIAS */}
            {currentPage === 'view-all-complaints' && (
              <ViewAllComplaints 
                onBack={handleBackToHome}
                onViewDetails={handleViewDetails}
              />
            )}
          </div>
          
          {/* FOOTER (solo en páginas no-admin) */}
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