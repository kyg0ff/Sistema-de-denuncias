import React from 'react';

const StatusBadge = ({ status }) => {
  const styles = {
    'Resuelto': { bg: '#dcfce7', color: '#166534' },
    'En Revisión': { bg: '#fef9c3', color: '#854d0e' },
    'Pendiente': { bg: '#f1f5f9', color: '#475569' },
    'Urgente': { bg: '#fee2e2', color: '#991b1b' }
  };
  const style = styles[status] || styles['Pendiente'];
  
  return (
    <span style={{ 
      backgroundColor: style.bg, color: style.color, 
      padding: '6px 14px', borderRadius: '30px', 
      fontSize: '11px', fontWeight: '800', letterSpacing: '0.02em',
      textTransform: 'uppercase'
    }}>
      {status}
    </span>
  );
};

export default function ComplaintTable({ data, onViewDetails }) {
  return (
    <div className="table-container">
      <table className="custom-table">
        <thead>
          <tr>
            {/* Título actualizado solicitado */}
            <th>Cod. Seguimiento</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Categoría</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="hover-row">
              <td>
                <button 
                  /* Navega usando el ID numérico interno */
                  onClick={() => onViewDetails(row.id)}
                  style={{ 
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontWeight: 700, color: 'var(--vibrant-blue)', 
                    textDecoration: 'underline', textUnderlineOffset: '4px',
                    fontSize: '0.95rem',
                    padding: 0,
                    textAlign: 'left'
                  }}
                >
                  {/* Muestra el código alfanumérico al usuario */}
                  {row.trackingCode}
                </button>
              </td>
              <td style={{ color: 'var(--text-muted)' }}>{row.date}</td>
              <td style={{ color: 'var(--text-muted)' }}>{row.time}</td>
              <td>{row.categoria_titulo || row.categoria_slug || row.category}</td>
              <td><StatusBadge status={row.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}