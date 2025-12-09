import React from 'react';
import Hero from '../components/Hero';
import ComplaintCard from '../components/ComplaintCard';
import Stats from '../components/Stats';
import EntitiesSection from '../components/EntitiesSection'; // 1. IMPORTAR

// Recibimos 'onViewDetails' y 'onViewAll'
export default function Home({ onCreateReport, onViewDetails, onViewAll }) {
  const data = [
    { id: 1, category: 'Parques y Jardines', title: 'Mobiliario infantil dañado en Parque Norte', status: 'Urgente', location: 'Parque de la Alameda', img: 'https://www.auto-tecnica.es/wp-content/uploads/2022/08/barrio-de-torrero-la-paz-1080x630.jpeg' },
    { id: 2, category: 'Alumbrado Público', title: 'Farolas fundidas en cruce peatonal', status: 'En Progreso', location: 'Av. Constitución', img: 'https://www.auto-tecnica.es/wp-content/uploads/2022/08/barrio-de-torrero-la-paz-1080x630.jpeg' },
    { id: 3, category: 'Vía Pública', title: 'Bache profundo peligroso para motos', status: 'Resuelta', location: 'Calle Mayor, 45', img: 'https://www.auto-tecnica.es/wp-content/uploads/2022/08/barrio-de-torrero-la-paz-1080x630.jpeg' }
  ];

  return (
    <main>
      <div className="container">
        <Hero onCreateReport={onCreateReport} onViewAll={onViewAll} />
      </div>

      <section className="container" style={{ marginTop: '80px', marginBottom: '20px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '2rem', margin: '0 0 8px 0', fontWeight: 800 }}>Denuncias Recientes</h2>
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>Mira lo que está reportando tu comunidad en tiempo real.</p>
        </div>
        
        <div className="cards-grid">
          {data.map(item => (
            // Pasamos la función al hacer click
            <ComplaintCard 
              key={item.id} 
              item={item} 
              onClick={() => onViewDetails(item.id)} 
            />
          ))}
        </div>
      </section>

      {/* 2. NUEVA SECCIÓN: ¿Quién resuelve tus reportes? */}
      <EntitiesSection />

      <div className="container" style={{ paddingTop: '40px' }}>
        <Stats />
      </div>
    </main>
  );
}