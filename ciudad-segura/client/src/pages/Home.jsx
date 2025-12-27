import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import ComplaintCard from '../components/ComplaintCard';
import Stats from '../components/Stats';
import { statsService, complaintsService } from '../services/api';

export default function Home({ onCreateReport, onViewDetails, onViewAll }) {
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [homeStats, setHomeStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('userData');
    if (savedUser) {
      try { setUserData(JSON.parse(savedUser)); } catch (e) { console.error(e); }
    }
    loadHomeData();
  }, []);

  // --- EL NUEVO LOADHOMEDATA QUE FUNCIONA CON TUS STATS + FIX DE IMÁGENES ---
  const loadHomeData = async () => {
    setIsLoading(true);
    try {
      // 1. Llamamos a tus servicios
      const [statsRes, complaintsRes] = await Promise.all([
        statsService.getHomeStats(),
        complaintsService.getAll()
      ]);

      // 2. Procesamos Estadísticas (Tu backend ya las manda listas)
      if (statsRes.success && statsRes.data) {
        setHomeStats(statsRes.data); 
      }

      // 3. Procesamos Denuncias Recientes (Usamos complaintsRes para tener las evidencias/imágenes)
      if (complaintsRes.success && Array.isArray(complaintsRes.data)) {
        const transformed = complaintsRes.data.slice(0, 3).map(c => ({
          ...c,
          // Mapeamos título si no existe
          title: c.titulo || `Denuncia ${c.codigo_seguimiento}`,
          // Recuperamos la categoría
          category: c.categoria_titulo || 'General',
          // ARMAMOS LA URL DE LA IMAGEN:
          // Si tiene evidencias usamos la primera, si no, usamos la de la categoría
          img: (c.evidencias && c.evidencias.length > 0) 
               ? `http://localhost:5000${c.evidencias[0]}` 
               : getCategoryImage(c.categoria_slug),
          // Mapeamos el estado a nombres bonitos
          status: {
            'pendiente': 'Pendiente',
            'en_revision': 'En Revisión',
            'resuelto': 'Resuelto',
            'urgente': 'Urgente'
          }[c.estado] || 'Pendiente'
        }));
        
        setRecentComplaints(transformed);
      }

    } catch (error) {
      console.error("Error cargando datos del Home:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <div className="container">
        <Hero onCreateReport={onCreateReport} onViewAll={onViewAll} userData={userData} />
      </div>

      <section className="container" style={{ marginTop: '60px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '24px' }}>Denuncias Recientes</h2>
        
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>Cargando denuncias...</div>
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

      <div className="container">
        <Stats homeStats={homeStats} />
      </div>
    </main>
  );
}