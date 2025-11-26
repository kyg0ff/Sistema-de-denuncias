import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Modal from './components/Modal';
import ContactModal from './components/ContactModal'; // Importamos el Modal de Contacto

// Importación de Páginas
import Home from './pages/Home';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import About from './pages/About';
import LoginModal from './pages/LoginModal';
import RegisterPage from './pages/Register';
import './App.css';



function App() {
  // --- ESTADOS GLOBALES ---
  const [user, setUser] = useState(null); // Estado del usuario (null = no logueado)
  const [currentPage, setCurrentPage] = useState('home'); // Navegación: 'home', 'profile', 'notifications', 'about'
  
  // Estados de UI (Modales y Dropdowns)
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false); // Estado para el modal de contacto
  const [showLoginModal, setShowLoginModal] = useState(false); // Estado para el modal de login

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
    setUser({ name: userdata.email });
    setCurrentPage('home');
  };
  
  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
    setShowNotifications(false);
    setShowLogoutModal(true); // Muestra confirmación de salida
  };

  const closeModal = () => {
    setShowLogoutModal(false);
  };
  // --- NAVEGACIÓN A REGISTRO ---
  const onNavigateToRegister = () => {
    setCurrentPage('register');
  };
  const goToLogin = () => {
    setShowLoginModal(true);  // abre el modal de login
    setCurrentPage("home");   // vuelve a home
  };
  const handleNavigateToAbout = () => {
    setCurrentPage('about');
    window.scrollTo(0, 0); // Scroll arriba al cambiar de página
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    window.scrollTo(0, 0);
  };

  // --- MANEJADORES DE NAVEGACIÓN Y UI ---
  const toggleNotifications = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setShowNotifications(prev => !prev);
  };

  const handleViewAllNotifications = () => {
    setCurrentPage('notifications');
    setShowNotifications(false);
  };

  // Manejadores para el Modal de Contacto
  const handleOpenContact = () => setShowContactModal(true);
  const handleCloseContact = () => setShowContactModal(false);

  // --- LÓGICA DE DATOS ---
  const handleMarkAsRead = (idx) => {
    const updated = [...notifications];
    // Nota: En producción usaríamos ID, aquí usamos índice para demo visual
    if(updated[idx]) updated[idx].read = true; 
    setNotifications(updated);
  };

  // Efecto: Cerrar dropdown de notificaciones al hacer click fuera
  useEffect(() => {
    const handleClickOutside = () => {
      if (showNotifications) setShowNotifications(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showNotifications]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* 1. HEADER (Navegación Superior) */}
      <Header 
        onLogin={() => setShowLoginModal(true)}   // abrir modal login
        user={user} 
        onNavigateToProfile={() => setCurrentPage('profile')}
        onNavigateToRegister={onNavigateToRegister}
        onNavigateToHome={handleBackToHome}
        notifications={notifications}
        showNotifications={showNotifications}
        toggleNotifications={toggleNotifications}
        onViewAllNotifications={handleViewAllNotifications} 
      />
      
      {/* 2. MODALES GLOBALES */}
      
      {/* Modal de Confirmación de Logout */}
      <Modal 
        isOpen={showLogoutModal} 
        onClose={closeModal} 
        title="¡Hasta pronto!" 
        message="Has cerrado sesión correctamente. Gracias por contribuir a mejorar tu ciudad." 
      />

      {/* Modal de Contacto (Desarrolladores) */}
      <ContactModal 
        isOpen={showContactModal} 
        onClose={handleCloseContact} 
      />
      {/* Modal de Login */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={(username, pass) => {
          handleLogin({ email: username });
          setShowLoginModal(false);
        }}
      />

      {/* 3. CONTENIDO PRINCIPAL (Router Casero) */}
      <div style={{ flex: 1 }}>
        {currentPage === 'register' && (
          <RegisterPage
            onGoLogin={goToLogin}
            onBack={handleBackToHome}
          />
        )}

        
        {currentPage === 'home' && (
          <Home />
        )}
        
        {currentPage === 'profile' && (
          <Profile 
            onLogout={handleLogout} 
            onBack={handleBackToHome} 
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

      </div>
      
      {/* 4. FOOTER (Navegación Inferior) */}
      <Footer 
        onNavigateToAbout={handleNavigateToAbout} 
        onOpenContact={handleOpenContact} 
      />
      
    </div>
  );
}

export default App;