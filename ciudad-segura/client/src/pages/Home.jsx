import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import ComplaintCard from '../components/ComplaintCard';
import Stats from '../components/Stats';
import { statsService, complaintsService } from '../services/api';

export default function Home({ onCreateReport, onViewDetails, onViewAll }) {
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [homeStats, setHomeStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Error al parsear usuario", e);
      }
    }
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    setIsLoading(true);
    try {
      const [statsResponse, complaintsResponse] = await Promise.all([
        statsService.getHomeStats(),
        complaintsService.getAll()
      ]);

      if (statsResponse.success) {
        setHomeStats(statsResponse.data);
        
        if (statsResponse.data.recentComplaints) {
          const transformedComplaints = statsResponse.data.recentComplaints.map(complaint => {
            const statusMap = {
              'pendiente': 'Pendiente',
              'en_revision': 'En Revisión',
              'resuelto': 'Resuelta',
              'urgente': 'Urgente'
            };

            return {
              id: complaint.id,
              category: complaint.categoria || complaint.category, 
              title: complaint.titulo || complaint.title || `Denuncia ${complaint.codigo_seguimiento}`,
              status: statusMap[complaint.estado || complaint.status] || 'Pendiente',
              location: complaint.ubicacion || complaint.location || 'Sin ubicación',
              createdAt: complaint.fecha_creacion || complaint.createdAt,
              img: getCategoryImage(complaint.categoria || complaint.category)
            };
          });
          setRecentComplaints(transformedComplaints);
        }
      }
    } catch (error) {
      console.error('Error cargando datos del home:', error);
      // Datos de respaldo...
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryImage = (category) => {
    const images = {
      'obstruccion': 'https://images.unsplash.com/photo-1562512685-2e6f2cb66258?q=80&w=800',
      'invasion': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800',
      'zonas': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800',
      'accesos': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800',
      'conducta': 'https://images.unsplash.com/photo-1549924231-f129b911e442?q=80&w=800'
    };
    return images[category] || 'https://www.auto-tecnica.es/wp-content/uploads/2022/08/barrio-de-torrero-la-paz-1080x630.jpeg';
  };

  return (
    <main>
      <div className="container">
        <Hero onCreateReport={onCreateReport} onViewAll={onViewAll} user={user} />
      </div>

      <section className="container" style={{ marginTop: '80px', marginBottom: '20px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '2rem', margin: '0 0 8px 0', fontWeight: 800 }}>Denuncias Recientes</h2>
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>
            Mira lo que está reportando tu comunidad en tiempo real.
            {homeStats && ` Total: ${homeStats.totalComplaints} denuncias`}
          </p>
        </div>
        
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ 
              width: '40px', height: '40px', margin: '0 auto 20px',
              border: '3px solid var(--light-gray)', borderTopColor: 'var(--medium-blue)',
              borderRadius: '50%', animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ color: 'var(--text-muted)' }}>Cargando denuncias...</p>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <div className="cards-grid">
            {recentComplaints.map(item => (
              <ComplaintCard 
                key={item.id} 
                item={item} 
                onClick={() => onViewDetails(item.id)} 
              />
            ))}
          </div>
        )}
      </section>

      <div className="container" style={{ paddingTop: '40px' }}>
        <Stats homeStats={homeStats} />
      </div>
    </main>
  );
}