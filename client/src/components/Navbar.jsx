import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { User, LogOut, Building2 } from 'lucide-react'; // Quitamos PlusCircle
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  const dashboardLink = user?.rol === 'AUTORIDAD' 
    ? '/autoridad/dashboard' 
    : '/ciudadano/mis-denuncias';

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        
        <Link to="/" className="logo-area">
          <Building2 size={24} className="logo-icon" />
          <span className="logo-text">DENUNCIAS.COM</span>
        </Link>

        <div className="user-actions">
          {user ? (
            <>
              {/* ENLACE AL PERFIL (Nombre + Avatar) */}
              <Link to={dashboardLink} className="user-profile-link" title="Ir a mi panel">
                <div style={{textAlign: 'right'}}>
                    <span className="user-name-text">{user.nombre}</span>
                    <span className="user-role-text">{user.rol}</span>
                </div>
                <div className="user-avatar-circle">
                    <User size={20} />
                </div>
              </Link>

              {/* Botón Cerrar Sesión */}
              <button className="icon-btn logout-btn" onClick={logout} title="Cerrar Sesión">
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <>
              {/* INVITADO */}
              <Link to="/login" className="btn" style={{
                  border: '1px solid var(--primary-color)', 
                  color: 'var(--primary-color)',
                  marginRight: '10px',
                  textDecoration: 'none',
                  display: 'flex', alignItems: 'center', gap: '5px',
                  backgroundColor: 'transparent'
              }}>
                <User size={18} /> Iniciar Sesión
              </Link>

              <Link to="/registro" className="btn btn-primary" style={{
                  textDecoration: 'none', display: 'flex', alignItems: 'center'
              }}>
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;