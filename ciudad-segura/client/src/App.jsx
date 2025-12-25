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
import { authService, complaintsService, notificationsService } from './services/api';
import './App.css';

function App() {
  // --- 1. ESTADOS DE IDENTIDAD Y NAVEGACIÓN ---
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('home'); 
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);

  // --- ESTADO PARA VOLVER ATRÁS ---
  const [previousPage, setPreviousPage] = useState('home');
  
  // --- 2. ESTADOS DE INTERFAZ (MODALES) ---
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAnonymousModal, setShowAnonymousModal] = useState(false);
  
  const [notifications, setNotifications] = useState([]);

  // --- 4. EFECTOS ---
  useEffect(() => {
    if (user) {
      loadNotifications(user.id);
    } else {
      setNotifications([]); 
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = () => { 
      if (showNotifications) setShowNotifications(false); 
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showNotifications]);

  // --- 5. LÓGICA DE NOTIFICACIONES ---
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

  // --- 6. LÓGICA DE AUTENTICACIÓN (Mantenida intacta) ---
  const handleLogin = async (username, password) => {
    try {
      const response = await authService.login(username, password);
      if (response.success) {
        setUser(response.user);
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
      throw error;
    }
  };

  const handleLogout = () => { 
    setUser(null); 
    setCurrentPage('home'); 
    setShowNotifications(false); 
    setShowLogoutModal(true); 
  };

  // --- 7. LÓGICA DE DENUNCIAS ---
  const handleCreateReport = async (reportData) => {
    try {
      const response = await complaintsService.create(reportData);
      if (response.success) {
        return {
          success: true,
          trackingCode: response.data?.codigo_seguimiento || response.trackingCode,
          complaintId: response.data?.id || response.complaintId
        };
      }
      return response;
    } catch (error) {
      console.error('Error creando reporte:', error);
      return { success: false, error: error.message };
    }
  };

  // --- 8. FUNCIONES DE NAVEGACIÓN ---
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

  // --- CAMBIO 1: Guardamos la página donde estamos antes de ir al detalle ---
  const handleViewDetails = (id) => { 
    setPreviousPage(currentPage); // Guardamos si venimos de 'home', 'profile', 'notifications', etc.
    setSelectedComplaintId(id); 
    setCurrentPage('complaint-detail'); 
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

  // --- 9. RENDERIZADO ---
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {currentPage === 'admin-dashboard' ? (
        <AdminDashboard onLogout={handleLogout} />
      ) : (
        <>
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
            onViewDetails={handleViewDetails}
          />
          
          <Modal isOpen={showLogoutModal} onClose={closeModal} title="¡Hasta pronto!" message="Has cerrado sesión correctamente." />
          <ContactModal isOpen={showContactModal} onClose={handleCloseContact} />
          <AnonymousModal 
            isOpen={showAnonymousModal} 
            onClose={() => setShowAnonymousModal(false)}
            onLogin={handleLoginFromAnonymous}
            onContinueAnonymous={handleContinueAnonymous}
          />
          <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onLogin={handleLogin} />

          <div style={{ flex: 1 }}>
            
            {currentPage === 'register' && <RegisterPage onGoLogin={goToLogin} onBack={handleBackToHome} />}
            {currentPage === 'home' && <Home onCreateReport={handleNavigateToCreateReport} onViewDetails={handleViewDetails} onViewAll={handleNavigateToAllComplaints} />}
            {currentPage === 'profile' && user && <Profile user={user} onLogout={handleLogout} onBack={handleBackToHome} onViewDetails={handleViewDetails} />}
            {currentPage === 'notifications' && user && <Notifications user={user} onBack={handleBackToHome} onViewDetails={handleViewDetails} />}
            {currentPage === 'about' && <About onBack={handleBackToHome} />}
            {currentPage === 'create-report' && (
              <CreateReport 
                user={user} onBack={handleBackToHome} onSubmitSuccess={handleBackToHome} 
                onViewDetails={handleViewDetails} onCreateReport={handleCreateReport} 
              />
            )}
            
            {/* --- CAMBIO 2: Usar previousPage para volver --- */}
            {currentPage === 'complaint-detail' && (
              <ComplaintDetails 
                complaintId={selectedComplaintId} 
                onBack={() => {
                   setCurrentPage(previousPage); // <--- Vuelve dinámicamente
                   window.scrollTo(0, 0);
                }} 
              />
            )}
            
            {currentPage === 'view-all-complaints' && <ViewAllComplaints onBack={handleBackToHome} onViewDetails={handleViewDetails} />}
          </div>
          
          <Footer onNavigateToAbout={handleNavigateToAbout} onOpenContact={handleOpenContact} />
        </>
      )}
    </div>
  );
}

export default App;