import React from 'react';

const ProgressBar = ({ label, percentage, color }) => (
  <div style={{ marginBottom: '20px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontWeight: 600 }}>
      <span style={{ color: '#1e293b' }}>{label}</span>
      <span style={{ color: '#3b82f6' }}>{percentage}%</span>
    </div>
    <div style={{ width: '100%', height: '10px', backgroundColor: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
      <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: color, borderRadius: '10px', transition: 'width 1s ease' }} />
    </div>
  </div>
);

export default function Stats({ homeStats }) {
  if (!homeStats) {
    return <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>Cargando estadísticas...</div>;
  }

  const { totalComplaints, resolutionRate, averageResponseTime, categoriesDistribution } = homeStats;

  return (
    <div style={{ padding: '40px 0 80px 0' }}>
      <h2 style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: 800, marginBottom: '40px' }}>Impacto Social</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div className="stat-card" style={cardStyle('#3b82f6')}>
          <div style={valStyle}>{totalComplaints || 0}</div>
          <div style={labelStyle}>Denuncias Recibidas</div>
        </div>
        <div className="stat-card" style={cardStyle('#10b981')}>
          <div style={valStyle}>{resolutionRate || 0}%</div>
          <div style={labelStyle}>Casos Resueltos</div>
        </div>
        <div className="stat-card" style={cardStyle('#8b5cf6')}>
          <div style={valStyle}>{averageResponseTime || 0}h</div>
          <div style={labelStyle}>Tiempo de Respuesta</div>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '30px' }}>Reportes por Categoría (%)</h3>
        {categoriesDistribution && categoriesDistribution.length > 0 ? (
          categoriesDistribution.map((cat, i) => (
            <ProgressBar 
              key={i} 
              label={cat.label} 
              percentage={totalComplaints > 0 ? Math.round((cat.value / totalComplaints) * 100) : 0} 
              color={cat.color} 
            />
          ))
        ) : (
          <p>No hay datos disponibles.</p>
        )}
      </div>
    </div>
  );
}

// Estilos rápidos
const cardStyle = (color) => ({
  padding: '30px', backgroundColor: 'white', borderRadius: '20px', textAlign: 'center', borderBottom: `4px solid ${color}`, boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
});
const valStyle = { fontSize: '2.5rem', fontWeight: 800, color: '#0f172a' };
const labelStyle = { color: '#64748b', fontWeight: 500, marginTop: '5px' };