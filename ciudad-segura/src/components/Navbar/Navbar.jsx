import React from 'react';
import { BarChart3 } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <BarChart3 size={24} />
          <span>Ciudad Segura – Denuncias Urbanas</span>
        </div>
        <div className="navbar-actions">
          <button className="btn btn-primary">Registrar Denuncia</button>
          <button className="btn btn-outline">Iniciar Sesión</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;