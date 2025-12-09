import React from 'react';

export default function StatCard({ title, value, icon, color }) {
  return (
    <div style={{ 
      backgroundColor: 'white', 
      borderRadius: '16px', 
      padding: '24px', 
      boxShadow: 'var(--shadow-sm)', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '20px', 
      border: '1px solid var(--border)' 
    }}>
      <div style={{ 
        width: '56px', 
        height: '56px', 
        borderRadius: '12px', 
        backgroundColor: color + '20', // Opacidad baja del color
        color: color, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        {icon}
      </div>
      <div>
        <p style={{ 
          margin: 0, 
          color: 'var(--text-muted)', 
          fontSize: '0.85rem', 
          fontWeight: 700, 
          textTransform: 'uppercase', 
          letterSpacing: '0.05em' 
        }}>
          {title}
        </p>
        <h3 style={{ 
          margin: 0, 
          fontSize: '1.8rem', 
          color: 'var(--deep-blue)', 
          fontWeight: 800 
        }}>
          {value}
        </h3>
      </div>
    </div>
  );
}