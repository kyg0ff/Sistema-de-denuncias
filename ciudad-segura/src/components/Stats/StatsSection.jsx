import React from 'react';
import { FileText, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import './Stats.css';

const chartData = [
  { name: 'Medio Ambiente', value: 20 },
  { name: 'Infraestructura', value: 45 },
  { name: 'Servicios', value: 30 },
  { name: 'Seguridad', value: 15 },
  { name: 'Otros', value: 10 },
];

const StatsSection = () => {
  return (
    <section className="stats-section">
      <div className="stats-header">
        <h2>Impacto Ciudadano en Números</h2>
        <p>Visualiza cómo la participación de la comunidad está generando un cambio real.</p>
      </div>

      {/* Grid de números */}
      <div className="stats-cards-grid">
        <div className="stat-card">
          <div className="icon-wrapper blue-icon">
            <FileText size={32} />
          </div>
          <span className="stat-number">1,234</span>
          <span className="stat-label">Total de denuncias</span>
        </div>

        <div className="stat-card">
          <div className="icon-wrapper green-icon">
            <CheckCircle size={32} />
          </div>
          <span className="stat-number">75%</span>
          <span className="stat-label">Denuncias resueltas</span>
        </div>
      </div>

      {/* Gráfica */}
      <div className="chart-container-box">
        <div className="chart-header">
          <h3>Denuncias por Categoría</h3>
          <span>Últimos 30 días</span>
        </div>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis 
                dataKey="name" 
                tick={{fontSize: 12, fill: '#666'}} 
                axisLine={false} 
                tickLine={false} 
              />
              <Tooltip 
                cursor={{fill: 'transparent'}}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="value" radius={[4, 4, 4, 4]} barSize={40}>
                 {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#e2e8f0" className="bar-cell"/>
                  ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;