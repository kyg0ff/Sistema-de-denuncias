import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Modal from './components/Modal';
import ContactModal from './components/ContactModal';

// Importación de Páginas
import Home from './pages/Home';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import About from './pages/About';
import LoginModal from './pages/LoginModal';
import RegisterPage from './pages/Register';
import CreateReport from './pages/CreateReport';
import ComplaintDetails from './pages/ComplaintDetails';
import AdminDashboard from './pages/AdminDashboard'; // Panel de Administrador
import ViewAllComplaints from './pages/ViewAllComplaints';


import './App.css';

function App() {
  // --- ESTADOS GLOBALES ---
  const [user, setUser] = useState(null); // Usuario logueado
  const [currentPage, setCurrentPage] = useState('home'); // Control de navegación
  const [selectedComplaintId, setSelectedComplaintId] = useState(null); // ID para ver detalles
  const [userRole, setUserRole] = useState('guest'); // 'guest', 'user', 'admin'
  
  // --- ESTADOS DE INTERFAZ (UI) ---
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Datos simulados de notificaciones
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'update', message: 'Tu denuncia RPT-8822 ha sido asignada a una cuadrilla.', time: 'Hace 5 min', read: false },
    { id: 2, type: 'resolved', message: 'La denuncia RPT-8821 ha sido resuelta exitosamente.', time: 'Hace 1 hora', read: false },
    { id: 3, type: 'new_report', message: 'Alerta: Nuevo reporte de baches en Calle Sol.', time: 'Ayer', read: true },
    { id: 4, type: 'update', message: 'Tu denuncia RPT-8823 está en revisión por el municipio.', time: '2 días', read: true },
    { id: 5, type: 'update', message: 'Bienvenido a CiudadSegura. Completa tu perfil.', time: '1 semana', read: true },
  ]);

  // --- MANEJADORES DE SESIÓN ---
  const handleLogin = (username, password, remember, role) => {
    // 1. Lógica de ADMINISTRADOR
    if (role === 'admin' && username === 'admin' && password === '123456') {
      setUser({ name: 'Administrador', role: 'admin' });
      setUserRole('admin');
      setCurrentPage('admin-dashboard'); // Redirigir al panel admin
      setShowLoginModal(false);
    } 
    // 2. Lógica de USUARIO CIUDADANO
    else if (role === 'citizen') {
      setUser({ name: username, role: 'citizen' });
      setUserRole('citizen');
      setCurrentPage('home');
      setShowLoginModal(false);
    } 
    // Cerrar modal y forzar re-render del header
    setShowLoginModal(false);
    console.log('handleLogin -> user:', { username, role });
  };
  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
    setShowNotifications(false);
    setShowLogoutModal(true); // Confirmación visual
  };

  const closeModal = () => setShowLogoutModal(false);

  // --- SISTEMA DE NAVEGACIÓN ---
  const onNavigateToRegister = () => {
    setCurrentPage('register');
    window.scrollTo(0, 0);
  };
  
  const goToLogin = () => {
    setShowLoginModal(true);
    if (currentPage === 'register') setCurrentPage("home");
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
    setCurrentPage('create-report');
    window.scrollTo(0, 0);
  };

  // Navegación a Detalles (desde Home, Perfil o Crear Reporte)
  const handleViewDetails = (id) => {
    setSelectedComplaintId(id);
    setCurrentPage('complaint-details');
    window.scrollTo(0, 0);
  };

  // Navegación a Notificaciones (desde Header)
  const handleViewAllNotifications = () => {
    setCurrentPage('notifications');
    setShowNotifications(false);
    window.scrollTo(0, 0);
  };
  // Navegación a la página "Ver todas las denuncias"
  const handleNavigateToViewAll = () => {
    setCurrentPage('view-all-complaints');
    window.scrollTo(0, 0);
  };
  // --- MANEJADORES DE UI ---
  const toggleNotifications = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setShowNotifications(prev => !prev);
  };

  const handleOpenContact = () => setShowContactModal(true);
  const handleCloseContact = () => setShowContactModal(false);

  const handleMarkAsRead = (idx) => {
    const updated = [...notifications];
    if(updated[idx]) updated[idx].read = true; 
    setNotifications(updated);
  };

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = () => {
      if (showNotifications) setShowNotifications(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showNotifications]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* RENDERIZADO CONDICIONAL: ADMIN VS USUARIO */}
      
      {currentPage === 'admin-dashboard' ? (
        // VISTA DE ADMINISTRADOR (Sin Header/Footer normales)
        <AdminDashboard onBack={handleBackToHome} onLogout={handleLogout} />
      ) : (
        // VISTA DE CIUDADANO (Con navegación normal)
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
          
          {/* --- MODALES --- */}
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
          
          <LoginModal
            isOpen={showLoginModal}
            onClose={() => setShowLoginModal(false)}
            onLogin={(username, pass, remember, role) => handleLogin(username, pass, remember, role)}
          />

          {/* --- CONTENIDO PRINCIPAL --- */}
          <div style={{ flex: 1 }}>
            
            {currentPage === 'register' && (
              <RegisterPage onGoLogin={goToLogin} onBack={handleBackToHome} />
            )}

            {currentPage === 'home' && (
              <Home 
                onCreateReport={handleNavigateToCreateReport} 
                onViewDetails={handleViewDetails} 
                onViewAll={handleNavigateToViewAll}
              />
            )}
            
            {currentPage === 'profile' && (
              <Profile 
                onLogout={handleLogout} 
                onBack={handleBackToHome}
                onViewDetails={handleViewDetails} 
              />
            )}
            
            {currentPage === 'notifications' && (
              <Notifications 
                notifications={notifications} 
                onMarkAsRead={handleMarkAsRead} 
                onBack={handleBackToHome} 
              />
            )}

            {currentPage === 'about' && (
              <About onBack={handleBackToHome} />
            )}

            {currentPage === 'create-report' && (
              <CreateReport 
                onBack={handleBackToHome} 
                onSubmitSuccess={handleBackToHome} 
                onViewDetails={handleViewDetails} 
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