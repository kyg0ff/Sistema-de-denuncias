import React, { useState, useEffect } from 'react';
import ComplaintTable from '../components/ComplaintTable';
import Button from '../components/Button';
import { complaintsService } from '../services/api'; // <-- NUEVO

// Transformar datos del backend al formato de la tabla
const transformComplaintData = (complaints) => {
  return complaints.map(complaint => {
    // Mapear estados del backend a los que usa el frontend
    const statusMap = {
      'pendiente': 'Pendiente',
      'en_revision': 'En Revisión',
      'resuelto': 'Resuelto',
      'urgente': 'Urgente'
    };
    
    const categoryMap = {
      'obstruccion': 'Obstrucción',
      'invasion': 'Invasión Peatonal',
      'zonas': 'Zonas Prohibidas',
      'accesos': 'Accesos Públicos',
      'conducta': 'Conducta Indebida'
    };

    return {
      id: complaint.id,
      title: complaint.title || `Denuncia ${complaint.id}`,
      category: categoryMap[complaint.category] || complaint.category,
      status: statusMap[complaint.status] || complaint.status,
      location: complaint.location?.address || 'Ubicación no especificada',
      date: new Date(complaint.createdAt).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      time: new Date(complaint.createdAt).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      // Datos adicionales para búsqueda
      originalData: complaint
    };
  });
};

export default function ViewAllComplaints({ onBack, onViewDetails }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [complaints, setComplaints] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar denuncias del backend
  useEffect(() => {
    loadComplaints();
  }, []);

  // Filtrar datos cuando cambia searchTerm o complaints
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredData(complaints);
    } else {
      const filtered = complaints.filter(complaint =>
        complaint.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchTerm, complaints]);

  const loadComplaints = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await complaintsService.getAll();
      
      if (response.success) {
        const transformedData = transformComplaintData(response.data);
        setComplaints(transformedData);
        setFilteredData(transformedData);
      } else {
        setError('Error al cargar las denuncias');
      }
    } catch (err) {
      console.error('Error cargando denuncias:', err);
      setError('Error de conexión con el servidor');
      
      // Datos de respaldo si el backend falla
      const backupData = transformComplaintData([
        {
          id: 'RPT-1001',
          category: 'obstruccion',
          title: 'Vehículo mal estacionado en zona escolar',
          status: 'en_revision',
          location: { address: 'Av. La Cultura 800, Wanchaq' },
          createdAt: '2024-11-25T10:30:00Z'
        },
        {
          id: 'RPT-1002',
          category: 'invasion',
          title: 'Estacionamiento sobre acera peatonal',
          status: 'pendiente',
          location: { address: 'Av. El Sol 450' },
          createdAt: '2024-11-24T15:45:00Z'
        }
      ]);
      setComplaints(backupData);
      setFilteredData(backupData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    loadComplaints();
  };

  const handleViewDetails = (id) => {
    // Buscar el complaint original para pasar al detalle
    const originalComplaint = complaints.find(c => c.id === id)?.originalData;
    if (onViewDetails) {
      onViewDetails(id, originalComplaint);
    }
  };

  return (
    <main className="container" style={{ padding: '40px 0', minHeight: '80vh' }}>
      
      {/* Encabezado y Botón de Regreso */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--deep-blue)', margin: 0 }}>
            Denuncias y Seguimiento
          </h1>
          <p style={{ margin: '8px 0 0 0', color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            Todas las denuncias reportadas en el sistema
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button 
            onClick={handleRefresh}
            variant="ghost"
            style={{ fontSize: '0.9rem', color: 'var(--medium-blue)' }}
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6"></path><path d="M1 20v-6h6"></path><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"></path><path d="M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>}
          >
            Actualizar
          </Button>
          
          <Button 
            onClick={onBack}
            variant="ghost" 
            style={{ fontSize: '1rem', color: 'var(--text-muted)' }}
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5"></path><polyline points="12 19 5 12 12 5"></polyline></svg>}
          >
            Volver
          </Button>
        </div>
      </div>

      {/* Barra de Búsqueda y Filtros */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '16px', 
        padding: '24px', 
        marginBottom: '32px',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border)'
      }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              type="text"
              placeholder="Buscar por ID, título, categoría o ubicación..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%', 
                padding: '14px 20px 14px 48px', 
                borderRadius: '12px', 
                border: '1px solid var(--border)', 
                fontSize: '16px',
                backgroundColor: '#fcfdfe',
                color: 'var(--deep-blue)',
                fontWeight: 600
              }}
            />
            <div style={{ 
              position: 'absolute', 
              left: '16px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>
          
          <Button 
            onClick={() => setSearchTerm('')}
            style={{ 
              backgroundColor: 'var(--light-gray)', 
              color: 'var(--text-muted)',
              padding: '14px 20px'
            }}
            disabled={!searchTerm}
          >
            Limpiar
          </Button>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            {isLoading ? (
              <span style={{ color: 'var(--text-muted)' }}>Cargando denuncias...</span>
            ) : (
              <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
                Mostrando {filteredData.length} de {complaints.length} denuncias
                {searchTerm && ` para "${searchTerm}"`}
              </span>
            )}
          </div>
          
          {error && (
            <div style={{ 
              backgroundColor: '#fee2e2', 
              color: '#dc2626', 
              padding: '8px 16px', 
              borderRadius: '8px',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Contenedor de la Tabla */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '16px', 
        boxShadow: 'var(--shadow-lg)', 
        overflow: 'hidden',
        border: '1px solid var(--border)'
      }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ 
              width: '50px', 
              height: '50px', 
              margin: '0 auto 20px',
              border: '4px solid var(--light-gray)',
              borderTopColor: 'var(--medium-blue)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Cargando denuncias...</p>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : filteredData.length > 0 ? (
          <>
            <ComplaintTable 
              data={filteredData} 
              onViewDetails={handleViewDetails}
            />
            
            {/* Paginación simple (futura implementación) */}
            <div style={{ 
              padding: '20px 24px', 
              borderTop: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#f8fafc'
            }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Página 1 de 1
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button 
                  variant="ghost" 
                  style={{ fontSize: '0.9rem' }}
                  disabled={true}
                >
                  Anterior
                </Button>
                <Button 
                  variant="ghost" 
                  style={{ fontSize: '0.9rem' }}
                  disabled={true}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              margin: '0 auto 20px',
              backgroundColor: '#f1f5f9',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.5rem', color: 'var(--deep-blue)' }}>
              No se encontraron denuncias
            </h3>
            <p style={{ margin: '0 0 20px 0', fontSize: '1rem' }}>
              {searchTerm ? `No hay resultados para "${searchTerm}"` : 'No hay denuncias en el sistema'}
            </p>
            {searchTerm && (
              <Button 
                onClick={() => setSearchTerm('')}
                style={{ backgroundColor: 'var(--medium-blue)', color: 'white' }}
              >
                Ver todas las denuncias
              </Button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}