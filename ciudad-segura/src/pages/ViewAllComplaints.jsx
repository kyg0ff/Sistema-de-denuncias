import React, { useState } from 'react';
import ComplaintTable from '../components/ComplaintTable';
import Button from '../components/Button';

// --- DATOS SIMULADOS (MOCK DATA) ---
// DEBES REEMPLAZAR ESTO CON TU FUNCIÓN DE CARGA DE DATOS REALES DE TU API.
const ALL_COMPLAINTS_DATA = [
  { id: 'RPT-1001', category: 'Parques y Jardines', title: 'Mobiliario infantil dañado', status: 'Urgente', location: 'Parque Alameda', date: '28 Nov 2024', time: '10:00' },
  { id: 'RPT-1002', category: 'Alumbrado Público', title: 'Farolas fundidas en cruce peatonal', status: 'En Revisión', location: 'Av. Constitución', date: '27 Nov 2024', time: '18:15' },
  { id: 'RPT-1003', category: 'Vía Pública', title: 'Bache profundo peligroso', status: 'Resuelto', location: 'Calle Mayor, 45', date: '26 Nov 2024', time: '11:00' },
  { id: 'RPT-1004', category: 'Vía Pública', title: 'Señalización de Pare oculta', status: 'Pendiente', location: 'Esquina Av. Pardo', date: '25 Nov 2024', time: '09:00' },
  { id: 'RPT-1005', category: 'Tránsito', title: 'Semáforo dañado en Av. El Sol', status: 'En Revisión', location: 'Av. El Sol', date: '24 Nov 2024', time: '15:00' },
  { id: 'RPT-1006', category: 'Medio Ambiente', title: 'Poda ilegal de árboles', status: 'Urgente', location: 'Av. Huáscar', date: '24 Nov 2024', time: '12:00' },
];


// NUEVA PÁGINA: ViewAllComplaints
export default function ViewAllComplaints({ onBack, onViewDetails }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Lógica de búsqueda: filtra por ID, título y categoría
  const filteredData = ALL_COMPLAINTS_DATA.filter(complaint =>
    complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complaint.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complaint.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="container" style={{ padding: '40px 0' }}>
      
      {/* Encabezado y Botón de Regreso (Back) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--deep-blue)', margin: 0 }}>
          Denuncias y Seguimiento
        </h1>
        {/* Usamos onBack para volver a la página anterior (Home) */}
        <Button 
          onClick={onBack}
          variant="ghost" 
          style={{ fontSize: '1rem', color: 'var(--text-muted)' }}
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5"></path><polyline points="12 19 5 12 12 5"></polyline></svg>}
        >
          Volver
        </Button>
      </div>

      {/* Barra de Búsqueda */}
      <div style={{ marginBottom: '40px' }}>
          <input
              type="text"
              placeholder="Buscar por ID, título o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                  width: '100%', padding: '14px 24px', borderRadius: '12px', 
                  border: '1px solid var(--border)', fontSize: '16px',
                  boxShadow: 'var(--shadow-sm)'
              }}
          />
      </div>

      {/* Contenedor de la Tabla */}
      <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: 'var(--shadow-lg)', padding: '20px' }}>
        <ComplaintTable 
            data={filteredData} 
            onViewDetails={onViewDetails} // Para permitir ver el detalle al hacer clic en el ID
        />
        {/* Mensaje si no hay resultados */}
        {filteredData.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>
                No se encontraron denuncias que coincidan con la búsqueda "{searchTerm}".
            </p>
        )}
      </div>
      
    </main>
  );
}