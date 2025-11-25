import React from 'react';
import Hero from '../components/Hero';
import ComplaintCard from '../components/ComplaintCard';
import Stats from '../components/Stats';

export default function Home() {
  const data = [
    { 
      id: 1, 
      category: 'Parques y Jardines', 
      title: 'Mobiliario infantil dañado en Parque Norte', 
      status: 'En Progreso', 
      location: 'Parque de la Alameda', 
      img: 'https://www.auto-tecnica.es/wp-content/uploads/2022/08/barrio-de-torrero-la-paz-1080x630.jpeg' 
    },
    { 
      id: 2, 
      category: 'Alumbrado Público', 
      title: 'Farolas fundidas en cruce peatonal', 
      status: 'En Progreso', 
      location: 'Av. Constitución', 
      img: 'https://www.auto-tecnica.es/wp-content/uploads/2022/08/barrio-de-torrero-la-paz-1080x630.jpeg' 
    },
    { 
      id: 3, 
      category: 'Vía Pública', 
      title: 'Bache profundo peligroso para motos', 
      status: 'Resuelta', 
      location: 'Calle Mayor, 45', 
      img: 'https://www.auto-tecnica.es/wp-content/uploads/2022/08/barrio-de-torrero-la-paz-1080x630.jpeg'
    }
  ];

  return (
    <main>
      {/* CAMBIO: Hero ahora está dentro de un contenedor */}
      <div className="container">
        <Hero />
      </div>

      <section className="container" style={{ marginTop: '80px', marginBottom: '20px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '2rem', margin: '0 0 8px 0', fontWeight: 800 }}>Denuncias Recientes</h2>
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>Mira lo que está reportando tu comunidad en tiempo real.</p>
        </div>
        
        <div className="cards-grid">
          {data.map(item => (
            <ComplaintCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      <div className="container">
        <Stats />
      </div>
    </main>
  );
}