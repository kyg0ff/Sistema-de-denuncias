import React from 'react';

const entities = [
  {
    name: "Municipalidad Distrital",
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18v-8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8z"></path><polyline points="9 10 9 21 15 21 15 10"></polyline><path d="M12 2L3 7v3h18V7L12 2z"></path></svg>,
    desc: "Gestión urbana y licencias."
  },
  {
    name: "Policía de Tránsito",
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>,
    desc: "Control y multas vehiculares."
  },
  {
    name: "Servicio de Grúas",
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path><circle cx="7" cy="17" r="2"></circle><path d="M9 17h6"></path><circle cx="17" cy="17" r="2"></circle></svg>,
    desc: "Remolque de vehículos."
  },
  {
    name: "Defensa Civil",
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>,
    desc: "Seguridad y riesgos."
  },
  {
    name: "Fiscalización",
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
    desc: "Control de espacios públicos."
  }
];

export default function EntitiesSection() {
  // Duplicamos la lista para crear el efecto infinito sin cortes
  const infiniteEntities = [...entities, ...entities, ...entities]; 

  return (
    <section style={{ padding: '60px 0', borderTop: '1px solid var(--border)', backgroundColor: 'white' }}>
      
      <div className="container" style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2rem', color: 'var(--deep-blue)', fontWeight: 800, marginBottom: '10px' }}>
          Autoridades Conectadas
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Tu reporte llega directamente a quien puede resolverlo.
        </p>
      </div>

      {/* Contenedor del Carrusel */}
      <div className="slider-container">
        <div className="slide-track">
          
          {infiniteEntities.map((ent, index) => (
            <div key={index} className="entity-card">
              <div style={{ 
                width: '60px', height: '60px', margin: '0 auto 16px', borderRadius: '50%', 
                backgroundColor: '#e0f2fe', color: 'var(--medium-blue)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center' 
              }}>
                {ent.icon}
              </div>
              <h4 style={{ margin: '0 0 8px 0', color: 'var(--deep-blue)', fontSize: '1.1rem' }}>
                {ent.name}
              </h4>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {ent.desc}
              </p>
            </div>
          ))}

        </div>
      </div>

    </section>
  );
}