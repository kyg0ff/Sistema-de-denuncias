import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import ReportCard from './ReportCard';
import './Reports.css';

// Datos falsos
const reportsData = [
  {
    id: 1,
    title: "Basura acumulada en parque público",
    category: "MEDIO AMBIENTE",
    status: "En Progreso",
    address: "Parque Central, Distrito Capital",
    image: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    title: "Fallo en alumbrado público",
    category: "SERVICIOS PÚBLICOS",
    status: "Recibida",
    address: "Av. de los Próceres, 23",
    image: "https://images.unsplash.com/photo-1555848962-6e79363ec58f?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    title: "Bache peligroso en calzada",
    category: "INFRAESTRUCTURA",
    status: "Resuelta",
    address: "Calle del Sol, Barrio Alto",
    image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800"
  }
];

const RecentReports = () => {
  return (
    <section className="reports-section">
      <div className="section-header">
        <h2>Denuncias Recientes</h2>
        <div className="nav-buttons">
          <button className="nav-btn"><ArrowLeft size={20} /></button>
          <button className="nav-btn"><ArrowRight size={20} /></button>
        </div>
      </div>
      
      <div className="reports-grid">
        {reportsData.map(report => (
          <ReportCard key={report.id} data={report} />
        ))}
      </div>
    </section>
  );
};

export default RecentReports;