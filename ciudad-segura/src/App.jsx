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

import './App.css';

function App() {
  // --- ESTADOS GLOBALES DE DATOS ---
  const [user, setUser] = useState(null); // Usuario logueado (null = invitado)
  const [currentPage, setCurrentPage] = useState('home'); // Control de navegación
  const [selectedComplaintId, setSelectedComplaintId] = useState(null); // ID para ver detalles
  
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
  const handleLogin = (userdata) => {
    setUser({ name: userdata.email }); // En un caso real, usarías el nombre real
    setCurrentPage('home');
  };
  
  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
    setShowNotifications(false);
    setShowLogoutModal(true); // Confirmación visual
  };

  // --- SISTEMA DE NAVEGACIÓN ---
  
  // 1. Ir al Registro
  const onNavigateToRegister = () => {
    setCurrentPage('register');
    window.scrollTo(0, 0);
  };
  
  // 2. Abrir Login (desde header o registro)
  const goToLogin = () => {
    setShowLoginModal(true);
    if (currentPage === 'register') setCurrentPage("home");
  };

  // 3. Volver al Inicio
  const handleBackToHome = () => {
    setCurrentPage('home');
    window.scrollTo(0, 0);
  };

  // 4. Ir a "Sobre Nosotros"
  const handleNavigateToAbout = () => {
    setCurrentPage('about');
    window.scrollTo(0, 0);
  };

  // 5. Ir a "Crear Reporte" (Desde el Hero)
  const handleNavigateToCreateReport = () => {
    setCurrentPage('create-report');
    window.scrollTo(0, 0);
  };

  // 6. Ir a "Detalles de Denuncia" (Desde Home, Perfil o éxito de crear reporte)
  const handleViewDetails = (id) => {
    setSelectedComplaintId(id); // Guardamos el ID (o código)
    setCurrentPage('complaint-details');
    window.scrollTo(0, 0);
  };

  // 7. Ir a "Notificaciones" (Bandeja completa)
  const handleViewAllNotifications = () => {
    setCurrentPage('notifications');
    setShowNotifications(false); // Cerramos el dropdown
    window.scrollTo(0, 0);
  };

  // --- MANEJADORES DE UI ---
  const toggleNotifications = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setShowNotifications(prev => !prev);
  };

  const handleOpenContact = () => setShowContactModal(true);
  const handleCloseContact = () => setShowContactModal(false);
  const closeModal = () => setShowLogoutModal(false);

  const handleMarkAsRead = (idx) => {
    const updated = [...notifications];
    if(updated[idx]) updated[idx].read = true; 
    setNotifications(updated);
  };

  // Efecto: Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = () => {
      if (showNotifications) setShowNotifications(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showNotifications]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* HEADER SUPERIOR */}
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
      
      {/* --- MODALES GLOBALES --- */}
      
      {/* Modal Logout */}
      <Modal 
        isOpen={showLogoutModal} 
        onClose={closeModal} 
        title="¡Hasta pronto!" 
        message="Has cerrado sesión correctamente. Gracias por contribuir a mejorar tu ciudad." 
      />

      {/* Modal Contacto */}
      <ContactModal 
        isOpen={showContactModal} 
        onClose={handleCloseContact} 
      />
      
      {/* Modal Login */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={(username, pass) => {
          handleLogin({ email: username });
          setShowLoginModal(false);
        }}
      />

      {/* --- CONTENIDO PRINCIPAL (ROUTER) --- */}
      <div style={{ flex: 1 }}>
        
        {currentPage === 'register' && (
          <RegisterPage 
            onGoLogin={goToLogin} 
            onBack={handleBackToHome} 
          />
        )}

        {currentPage === 'home' && (
          <Home 
            onCreateReport={handleNavigateToCreateReport} 
            onViewDetails={handleViewDetails} 
          />
        )}
        
        {currentPage === 'profile' && (
          <Profile 
            onLogout={handleLogout} 
            onBack={handleBackToHome}
            onViewDetails={handleViewDetails} // <--- AQUÍ CONECTAMOS LA TABLA DEL PERFIL
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
          <About 
            onBack={handleBackToHome} 
          />
        )}

        {currentPage === 'create-report' && (
          <CreateReport 
            onBack={handleBackToHome} 
            onSubmitSuccess={handleBackToHome} // Acción por defecto "Salir"
            onViewDetails={handleViewDetails}  // Acción para el botón "Ver Detalles"
          />
        )}

        {currentPage === 'complaint-details' && (
          <ComplaintDetails 
            complaintId={selectedComplaintId} 
            onBack={handleBackToHome} 
          />
        )}

      </div>
      
      {/* FOOTER INFERIOR */}
      <Footer 
        onNavigateToAbout={handleNavigateToAbout} 
        onOpenContact={handleOpenContact} 
      />
      
    </div>
  );
}

export default App;