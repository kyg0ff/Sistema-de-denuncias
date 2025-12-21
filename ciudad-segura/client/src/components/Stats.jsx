import React from 'react';

const ProgressBar = ({ label, percentage, color }) => (
  <div style={{ marginBottom: '20px' }}>
    <div className="flex-between" style={{ marginBottom: '8px', fontSize: '0.95rem', fontWeight: 600, color: 'var(--deep-blue)' }}>
      <span>{label}</span>
      <span>{percentage}%</span>
    </div>
    <div style={{ 
      width: '100%', height: '10px', backgroundColor: 'var(--light-gray)', 
      borderRadius: '99px', overflow: 'hidden'
    }}>
      <div style={{ 
        width: `${percentage}%`, height: '100%', backgroundColor: color, 
        borderRadius: '99px', transition: 'width 1s ease-in-out' 
      }} />
    </div>
  </div>
);

const StatItem = ({ val, label, icon, colorVar }) => {
  const colorStyle = `var(${colorVar})`;
  return (
  <div className="card-hover-effect" style={{ 
    padding: '32px', borderRadius: '16px', 
    display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
    borderBottom: `4px solid ${colorStyle}`
  }}>
    <div style={{ 
      width: '64px', height: '64px', borderRadius: '50%', 
      /* Usamos el cian claro para el fondo del icono */
      background: 'var(--soft-blue)', 
      color: colorStyle,
      display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px'
    }}>
      {icon}
    </div>
    <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--deep-blue)', lineHeight: 1 }}>
      {val}
    </div>
    <div style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '8px' }}>
      {label}
    </div>
  </div>
)};

export default function Stats() {
  return (
    <div style={{ padding: '20px 0 60px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 16px 0', color: 'var(--deep-blue)' }}>
          Impacto Real
        </h2>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          Gracias a la colaboración ciudadana, estamos mejorando la ciudad día a día.
        </p>
      </div>
      
      <div className="grid-stats" style={{ marginBottom: '40px' }}>
        <StatItem 
          val="1,234" label="Denuncias Gestionadas" colorVar="--deep-blue"
          icon={<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>}
        />
        <StatItem 
          val="82%" label="Tasa de Resolución" colorVar="--vibrant-blue"
          icon={<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>}
        />
        <StatItem 
          val="48h" label="Tiempo Medio Respuesta" colorVar="--medium-blue"
          icon={<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>}
        />
      </div>

      <div className="card-hover-effect" style={{ 
        padding: '40px', borderRadius: '24px', backgroundColor: 'white',
        border: '1px solid var(--soft-blue)'
      }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '32px', color: 'var(--deep-blue)' }}>
          Denuncias por Categoría
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Distribución monocromática usando tu paleta */}
          <ProgressBar label="Medio Ambiente" percentage={35} color="var(--deep-blue)" />
          <ProgressBar label="Infraestructura" percentage={25} color="var(--medium-blue)" />
          <ProgressBar label="Servicios" percentage={20} color="var(--vibrant-blue)" />
          <ProgressBar label="Seguridad" percentage={15} color="#eab308" /> {/* Mantenemos alerta amarilla por semántica estándar */}
          <ProgressBar label="Otros" percentage={5} color="var(--soft-blue)" />
        </div>
      </div>
    </div>
  );
}