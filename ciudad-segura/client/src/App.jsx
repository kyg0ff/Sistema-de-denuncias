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
import { authService, complaintsService, notificationsService } from './services/api'; // <-- NUEVO
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('home'); 
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAnonymousModal, setShowAnonymousModal] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Cargar notificaciones del backend
  useEffect(() => {
    if (user) {
      loadNotifications(user.id);
    }
  }, [user]);

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

  // Login con backend
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
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Credenciales incorrectas');
    }
  };

  // Logout
  const handleLogout = () => { 
    setUser(null); 
    setCurrentPage('home'); 
    setShowNotifications(false); 
    setShowLogoutModal(true); 
  };

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
      return { success: false, error: 'Error al crear el reporte' };
    }
  };

  // Resto del código se mantiene similar...
  const closeModal = () => setShowLogoutModal(false);
  const onNavigateToRegister = () => { setCurrentPage('register'); window.scrollTo(0, 0); };
  const handleBackToHome = () => { setCurrentPage('home'); window.scrollTo(0, 0); };
  const handleNavigateToAbout = () => { setCurrentPage('about'); window.scrollTo(0, 0); };

  const handleNavigateToCreateReport = () => {
    if (user) {
      setCurrentPage('create-report');
      window.scrollTo(0, 0);
    } else {
      setShowAnonymousModal(true);
    }
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

  const handleMarkAsRead = (idx) => { 
    const updatedNotifications = [...notifications];
    updatedNotifications[idx].read = true;
    setNotifications(updatedNotifications);
  };

  useEffect(() => {
    const handleClickOutside = () => { 
      if (showNotifications) setShowNotifications(false); 
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showNotifications]);

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
          />
          
          <Modal isOpen={showLogoutModal} onClose={closeModal} title="¡Hasta pronto!" message="Has cerrado sesión correctamente." />
          <ContactModal isOpen={showContactModal} onClose={handleCloseContact} />
          
          <AnonymousModal 
            isOpen={showAnonymousModal} 
            onClose={() => setShowAnonymousModal(false)}
            onLogin={handleLoginFromAnonymous}
            onContinueAnonymous={handleContinueAnonymous}
          />

          <LoginModal
            isOpen={showLoginModal}
            onClose={() => setShowLoginModal(false)}
            onLogin={handleLogin} // <-- Ya no recibe remember y userRole
          />

          <div style={{ flex: 1 }}>
            {currentPage === 'register' && <RegisterPage onGoLogin={goToLogin} onBack={handleBackToHome} />}
            {currentPage === 'home' && <Home onCreateReport={handleNavigateToCreateReport} onViewDetails={handleViewDetails} />}
            {currentPage === 'profile' && <Profile user={user} onLogout={handleLogout} onBack={handleBackToHome} onViewDetails={handleViewDetails} />}
            {currentPage === 'notifications' && <Notifications notifications={notifications} onMarkAsRead={handleMarkAsRead} onBack={handleBackToHome} />}
            {currentPage === 'about' && <About onBack={handleBackToHome} />}
            
            {currentPage === 'create-report' && (
              <CreateReport 
                user={user}
                onBack={handleBackToHome} 
                onSubmitSuccess={handleBackToHome} 
                onViewDetails={handleViewDetails}
                onCreateReport={handleCreateReport} // <-- Pasar función
              />
            )}

            {currentPage === 'complaint-details' && <ComplaintDetails complaintId={selectedComplaintId} onBack={handleBackToHome} />}
          </div>
          
          <Footer onNavigateToAbout={handleNavigateToAbout} onOpenContact={handleOpenContact} />
        </>
      )}
    </div>
  );
}

export default App;