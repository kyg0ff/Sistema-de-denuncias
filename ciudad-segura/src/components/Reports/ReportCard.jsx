import React from 'react';
import { MapPin } from 'lucide-react';

const ReportCard = ({ data }) => {
  // Función simple para determinar clase de estado
  const getStatusClass = (status) => {
    if (status === 'Resuelta') return 'status-success';
    if (status === 'En Progreso') return 'status-warning';
    return 'status-default';
  };

  return (
    <div className="report-card">
      <div className="card-image-container">
        <img src={data.image} alt={data.title} className="card-image" />
        <span className={`status-badge ${getStatusClass(data.status)}`}>
          {data.status}
        </span>
      </div>
      <div className="card-body">
        <span className="card-category">{data.category}</span>
        <h3 className="card-title">{data.title}</h3>
        <div className="card-footer">
          <MapPin size={16} />
          <span>{data.address}</span>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;