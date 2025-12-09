import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Modal from './components/Modal';
import ContactModal from './components/ContactModal';
import AnonymousModal from './components/AnonymousModal'; // 1. IMPORTAR

import Home from './pages/Home';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import About from './pages/About';
import LoginModal from './pages/LoginModal';
import RegisterPage from './pages/Register';
import CreateReport from './pages/CreateReport';
import ComplaintDetails from './pages/ComplaintDetails';
import AdminDashboard from './pages/AdminDashboard';

import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('home'); 
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // 2. NUEVO ESTADO PARA MODAL ANÓNIMO
  const [showAnonymousModal, setShowAnonymousModal] = useState(false);

  // ... (Datos de notifications, handleLogin, handleLogout IGUALES) ...
  const [notifications, setNotifications] = useState([/*...*/]);
  const handleLogin = (userdata) => {
    if (userdata.email === 'admin' && userdata.password === '123456') {
      setUser({ name: 'Administrador', role: 'admin' });
      setCurrentPage('admin-dashboard');
    } else {
      setUser({ name: userdata.email, role: 'user' });
      setCurrentPage('home');
    }
  };
  const handleLogout = () => { setUser(null); setCurrentPage('home'); setShowNotifications(false); setShowLogoutModal(true); };
  const closeModal = () => setShowLogoutModal(false);

  // ... (Navegación Register, About IGUALES) ...
  const onNavigateToRegister = () => { setCurrentPage('register'); window.scrollTo(0, 0); };
  const handleBackToHome = () => { setCurrentPage('home'); window.scrollTo(0, 0); };
  const handleNavigateToAbout = () => { setCurrentPage('about'); window.scrollTo(0, 0); };

  // 3. MODIFICACIÓN: INTERCEPTAR EL REPORTE
  const handleNavigateToCreateReport = () => {
    if (user) {
      // Si está logueado, pasa directo
      setCurrentPage('create-report');
      window.scrollTo(0, 0);
    } else {
      // Si NO está logueado, muestra el modal de decisión
      setShowAnonymousModal(true);
    }
  };

  // 4. NUEVO: Handler para "Continuar como Anónimo"
  const handleContinueAnonymous = () => {
    setShowAnonymousModal(false);
    setCurrentPage('create-report');
    window.scrollTo(0, 0);
  };

  // 5. Handler para "Iniciar Sesión" desde el modal anónimo
  const handleLoginFromAnonymous = () => {
    setShowAnonymousModal(false);
    setShowLoginModal(true);
  };

  const goToLogin = () => { setShowLoginModal(true); if (currentPage === 'register') setCurrentPage("home"); };
  const handleViewDetails = (id) => { setSelectedComplaintId(id); setCurrentPage('complaint-details'); window.scrollTo(0, 0); };
  const toggleNotifications = (e) => { if (e && e.stopPropagation) e.stopPropagation(); setShowNotifications(prev => !prev); };
  const handleViewAllNotifications = () => { setCurrentPage('notifications'); setShowNotifications(false); };
  const handleOpenContact = () => setShowContactModal(true);
  const handleCloseContact = () => setShowContactModal(false);
  const handleMarkAsRead = (idx) => { /*...*/ };

  useEffect(() => {
    const handleClickOutside = () => { if (showNotifications) setShowNotifications(false); };
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
          
          {/* 6. RENDERIZAR EL MODAL ANÓNIMO */}
          <AnonymousModal 
            isOpen={showAnonymousModal} 
            onClose={() => setShowAnonymousModal(false)}
            onLogin={handleLoginFromAnonymous}
            onContinueAnonymous={handleContinueAnonymous}
          />

          <LoginModal
            isOpen={showLoginModal}
            onClose={() => setShowLoginModal(false)}
            onLogin={(username, pass) => {
              handleLogin({ email: username, password: pass });
              setShowLoginModal(false);
            }}
          />

          <div style={{ flex: 1 }}>
            {currentPage === 'register' && <RegisterPage onGoLogin={goToLogin} onBack={handleBackToHome} />}
            {currentPage === 'home' && <Home onCreateReport={handleNavigateToCreateReport} onViewDetails={handleViewDetails} />}
            {currentPage === 'profile' && <Profile onLogout={handleLogout} onBack={handleBackToHome} onViewDetails={handleViewDetails} />}
            {currentPage === 'notifications' && <Notifications notifications={notifications} onMarkAsRead={handleMarkAsRead} onBack={handleBackToHome} />}
            {currentPage === 'about' && <About onBack={handleBackToHome} />}
            
            {/* 7. PASAR EL USUARIO A CREATEREPORT */}
            {currentPage === 'create-report' && (
              <CreateReport 
                user={user} // Pasamos el usuario para saber si es anónimo o no
                onBack={handleBackToHome} 
                onSubmitSuccess={handleBackToHome} 
                onViewDetails={handleViewDetails} 
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