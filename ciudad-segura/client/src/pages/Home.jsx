import React, { useState, useEffect } from 'react';
// Importación de sub-componentes visuales
import Hero from '../components/Hero';
import ComplaintCard from '../components/ComplaintCard';
import Stats from '../components/Stats';
// Servicios para la comunicación con el Backend
import { statsService, complaintsService } from '../services/api';

/**
 * COMPONENTE HOME: Página de aterrizaje principal
 * Corregido para estandarizar los datos del backend con el diseño del frontend.
 */
export default function Home({ onCreateReport, onViewDetails, onViewAll }) {
  // --- ESTADOS DE LA PÁGINA ---
  const [recentComplaints, setRecentComplaints] = useState([]); // Lista de las últimas denuncias
  const [homeStats, setHomeStats] = useState(null);           // Objeto con totales y contadores
  const [isLoading, setIsLoading] = useState(true);           // Control del indicador de carga
  const [userData, setUserData] = useState(null);             // Datos de sesión del usuario

  /**
   * EFECTO DE INICIALIZACIÓN:
   */
  useEffect(() => {
    const savedUser = localStorage.getItem('userData');
    if (savedUser) {
      try {
        setUserData(JSON.parse(savedUser));
      } catch (e) {
        console.error("Error al parsear usuario", e);
      }
    }
    loadHomeData();
  }, []);

  /**
   * CARGA DE DATOS:
   * Realiza la transformación para que los nombres del Backend (Postgres)
   * coincidan con lo que espera el componente visual.
   */
  const loadHomeData = async () => {
    setIsLoading(true);
    try {
      // statsService trae totales y complaintsService trae la lista general
      const [statsResponse, complaintsResponse] = await Promise.all([
        statsService.getHomeStats().catch(() => ({ success: false })), // Catch preventivo
        complaintsService.getAll()
      ]);

      // 1. Manejo de Estadísticas
      if (statsResponse.success) {
        setHomeStats(statsResponse.data);
      }

      // 2. Manejo de Denuncias Reales (Transformación de Datos)
      if (complaintsResponse.success) {
        // Tomamos solo las 6 más recientes para el Home
        const rawData = complaintsResponse.data.slice(0, 3); // numero de DENUNICIAS QUE APAREZCAN EN EL HOME

        const transformed = rawData.map(complaint => {
          // Diccionario para traducir estados técnicos del backend a visuales
          const statusMap = {
            'pendiente': 'Urgente',
            'en_revision': 'En Revisión',
            'resuelto': 'Resuelta',
            'urgente': 'Urgente'
          };

          // Retornamos un objeto estandarizado
          return {
            ...complaint, // Mantenemos ID, evidencias, etc.
            id: complaint.id,
            // Normalizamos campos para el ComplaintCard
            category: complaint.categoria, 
            title: complaint.titulo || `Reporte #${complaint.id}`,
            status: statusMap[complaint.estado] || 'Pendiente',
            // La ubicación la pasamos tal cual (el Card ya sabe manejar el objeto)
            location: complaint.ubicacion, 
            // Imagen de respaldo si no hay evidencias subidas
            img: getCategoryImage(complaint.categoria)
          };
        });

        setRecentComplaints(transformed);
      }
    } catch (error) {
      console.error('Error cargando datos del home:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * HELPER: Selector de Imágenes (Fallback)
   */
  const getCategoryImage = (category) => {
    const images = {
      'obstruccion': 'https://images.unsplash.com/photo-1562512685-2e6f2cb66258?q=80&w=800',
      'invasion': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800',
      'zonas': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800',
      'accesos': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800',
      'conducta': 'https://images.unsplash.com/photo-1549924231-f129b911e442?q=80&w=800'
    };
    return images[category] || 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=800';
  };

  return (
    <main>
      {/* SECCIÓN HERO */}
      <div className="container">
        <Hero onCreateReport={onCreateReport} onViewAll={onViewAll} userData={userData} />
      </div>

      {/* SECCIÓN DE DENUNCIAS RECIENTES */}
      <section className="container" style={{ marginTop: '80px', marginBottom: '20px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '2rem', margin: '0 0 8px 0', fontWeight: 800 }}>Denuncias Recientes</h2>
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>
            Mira lo que está reportando tu comunidad en tiempo real.
            {homeStats && ` Total: ${homeStats.totalComplaints || 0} denuncias`}
          </p>
        </div>
        
        {/* RENDERIZADO CONDICIONAL */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{ 
              width: '40px', height: '40px', margin: '0 auto 20px',
              border: '3px solid #e2e8f0', borderTopColor: 'var(--vibrant-blue)',
              borderRadius: '50%', animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Sincronizando con la ciudad...</p>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <div className="cards-grid">
            {recentComplaints.length > 0 ? (
              recentComplaints.map(item => (
                <ComplaintCard 
                  key={item.id} 
                  item={item} 
                  onClick={() => onViewDetails(item.id)} 
                />
              ))
            ) : (
              <p style={{ textAlign: 'center', gridColumn: '1/-1', padding: '40px', color: 'var(--text-muted)' }}>
                No hay denuncias recientes para mostrar.
              </p>
            )}
          </div>
        )}
      </section>

      {/* SECCIÓN DE ESTADÍSTICAS */}
      <div className="container" style={{ paddingTop: '40px' }}>
        <Stats homeStats={homeStats} />
      </div>
    </main>
  );
}