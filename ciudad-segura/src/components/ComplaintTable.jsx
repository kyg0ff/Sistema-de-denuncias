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

export default function ComplaintTable({ data }) {
  return (
    <div className="table-container">
      <table className="custom-table">
        <thead>
          <tr>
            <th>ID Reporte</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Categoría</th>
            <th>Estado</th>
            <th style={{ textAlign: 'right' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td style={{ fontWeight: 700, color: 'var(--deep-blue)' }}>{row.id}</td>
              <td style={{ color: 'var(--text-muted)' }}>{row.date}</td>
              <td style={{ color: 'var(--text-muted)' }}>{row.time}</td>
              <td>{row.category}</td>
              <td><StatusBadge status={row.status} /></td>
              <td style={{ textAlign: 'right' }}>
                <a href={`#`} style={{ 
                  color: 'var(--medium-blue)', fontWeight: '700', textDecoration: 'none',
                  borderBottom: '1px solid transparent', transition: '0.2s'
                }}>
                  Detalles &rarr;
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}