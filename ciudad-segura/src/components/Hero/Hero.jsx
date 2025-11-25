import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1>
          Haz tu ciudad mejor.<br />
          Reporta incidencias y<br />
          ayuda a resolver los<br />
          problemas urbanos
        </h1>
        <p>
          Únete a la comunidad de ciudadanos activos que están 
          transformando nuestros barrios, una denuncia a la vez.
        </p>
        <div className="hero-buttons">
          <button className="hero-btn btn-dark">Reportar denuncia ahora</button>
          <button className="hero-btn btn-orange">Ver otras denuncias</button>
        </div>
      </div>
    </section>
  );
};

export default Hero;