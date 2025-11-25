import React from 'react';
import Button from '../components/Button';

// Iconos SVG simples para ilustrar las secciones
const Icons = {
  Target: () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  Alert: () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Map: () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 21 18 21 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>,
  Users: () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
};

export default function About({ onBack }) {
  return (
    <div style={{ backgroundColor: 'var(--bg-body)', minHeight: '100vh' }}>
      
      {/* HERO SECTION */}
      <div style={{ 
        backgroundImage: `linear-gradient(135deg, var(--deep-blue) 0%, var(--medium-blue) 100%)`,
        color: 'white', padding: '80px 24px', textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '20px', color: 'white' }}>
            Recuperando el Orden Urbano
          </h1>
          <p style={{ fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto 40px', opacity: 0.9, lineHeight: 1.6 }}>
            Desarrollamos tecnología accesible para conectar a ciudadanos y autoridades, transformando el caos vehicular en espacios seguros y fluidos para todos.
          </p>
          <Button variant="secondary" onClick={onBack}>Volver al Inicio</Button>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '80px' }}>
        
        {/* SECCIÓN 1: LA PROBLEMÁTICA */}
        <section style={{ marginTop: '60px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-block', padding: '12px', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '12px', marginBottom: '20px' }}>
              <Icons.Alert />
            </div>
            <h2 style={{ fontSize: '2rem', color: 'var(--deep-blue)', marginBottom: '20px', fontWeight: 700 }}>
              El Desafío de la Movilidad
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '16px' }}>
              El estacionamiento en zonas prohibidas no es solo una infracción; es una barrera que afecta la calidad de vida. Obstruye rampas para personas con discapacidad, bloquea el paso de ambulancias y genera congestión en horas punta.
            </p>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
              Actualmente, reportar estos incidentes es lento y burocrático. Nuestra misión es romper esa barrera con tecnología ágil y transparente.
            </p>
          </div>
          <div style={{ 
            backgroundColor: 'white', borderRadius: '24px', padding: '30px', 
            boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)' 
          }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {['Obstrucción de rampas y veredas', 'Riesgo en zonas escolares', 'Bloqueo de transporte público', 'Congestión vehicular'].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--deep-blue)', fontWeight: 600 }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--vibrant-blue)' }}></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* SECCIÓN 2: OBJETIVOS (TARJETAS) */}
        <section style={{ marginTop: '80px' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--deep-blue)', fontWeight: 800, marginBottom: '16px' }}>
              Nuestros Objetivos
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
              Una plataforma integral diseñada para la acción y el análisis.
            </p>
          </div>

          <div className="grid-stats"> {/* Reutilizamos tu grid de CSS */}
            <div className="card-hover-effect" style={{ padding: '30px', borderRadius: '16px', backgroundColor: 'white' }}>
              <div style={{ color: 'var(--medium-blue)', marginBottom: '20px' }}><Icons.Users /></div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Participación Ciudadana</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Facilitar la carga de denuncias con evidencia visual y geolocalización en tiempo real.
              </p>
            </div>
            <div className="card-hover-effect" style={{ padding: '30px', borderRadius: '16px', backgroundColor: 'white' }}>
              <div style={{ color: 'var(--vibrant-blue)', marginBottom: '20px' }}><Icons.Target /></div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Gestión Eficiente</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Herramientas para que las autoridades validen, asignen recursos y resuelvan casos rápidamente.
              </p>
            </div>
            <div className="card-hover-effect" style={{ padding: '30px', borderRadius: '16px', backgroundColor: 'white' }}>
              <div style={{ color: 'var(--deep-blue)', marginBottom: '20px' }}><Icons.Map /></div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Análisis de Datos</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Generación de estadísticas para identificar "puntos calientes" y mejorar la planificación urbana.
              </p>
            </div>
          </div>
        </section>

        {/* SECCIÓN 3: DÓNDE ACTUAMOS */}
        <section style={{ marginTop: '80px', backgroundColor: '#f0fafa', borderRadius: '24px', padding: '60px 40px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--deep-blue)', fontWeight: 800, marginBottom: '40px', textAlign: 'center' }}>
              Ámbitos de Aplicación
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
              {['Zonas Escolares', 'Hospitales', 'Rampas de Discapacidad', 'Paraderos de Bus', 'Vías Exclusivas', 'Esquinas y Cruces', 'Accesos a Garajes'].map((tag, i) => (
                <span key={i} style={{ 
                  padding: '10px 20px', 
                  backgroundColor: 'white', 
                  color: 'var(--medium-blue)', 
                  borderRadius: '30px', 
                  fontWeight: 600,
                  border: '1px solid var(--soft-blue)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}>
                  {tag}
                </span>
              ))}
            </div>
            <p style={{ marginTop: '30px', color: 'var(--text-muted)', maxWidth: '600px', textAlign: 'center' }}>
              Iniciamos a nivel distrital con proyección a escalar regional y nacionalmente.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}