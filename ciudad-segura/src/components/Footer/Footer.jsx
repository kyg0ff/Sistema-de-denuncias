import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-links">
        <a href="#">Sobre el sistema</a>
        <a href="#">Sobre nosotros</a>
      </div>
      <p className="copyright">© 2024 Ciudad Segura. Todos los derechos reservados.</p>
    </footer>
  );
};

export default Footer;