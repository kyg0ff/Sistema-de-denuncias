import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [searchCode, setSearchCode] = useState('');
  
  // Estados para datos reales del backend
  const [recientes, setRecientes] = useState([]);
  const [stats, setStats] = useState({ total_denuncias: 0, resueltas_pct: 0, tiempo_promedio: '-' });
  const [loading, setLoading] = useState(true);

  // Cargar datos al entrar
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Hacemos las dos peticiones en paralelo
        const [resRecientes, resStats] = await Promise.all([
            axios.get('http://localhost:3000/api/denuncias/recientes'),
            axios.get('http://localhost:3000/api/denuncias/estadisticas')
        ]);

        setRecientes(resRecientes.data);
        setStats(resStats.data);
      } catch (error) {
        console.error("Error cargando home:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchCode.trim()) {
      navigate(`/seguimiento/${searchCode.trim()}`);
    }
  };

  return (
    <div className="home-page">
      
      {/* HERO SECTION */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Tu voz cuenta. Reporta, participa y <br /> mejoremos Cusco
          </h1>
          <Link to="/nueva-denuncia" className="hero-btn">
            Reportar denuncia ahora
          </Link>
        </div>
      </div>

      <div className="container">
        
        {/* DENUNCIAS RECIENTES (DINÁMICO) */}
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Denuncias Recientes</h2>
            <div className="search-pill" style={{cursor: 'text'}}>
              <Search size={16} />
              <input 
                type="text" 
                placeholder="Buscar por código..." 
                style={{border:'none', outline:'none', background:'transparent', color:'#334155', width: '150px'}}
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                onKeyDown={handleSearch}
              />
            </div>
          </div>

          <div className="cards-grid">
            {loading ? (
                <p>Cargando denuncias...</p>
            ) : recientes.length === 0 ? (
                <p>Aún no hay denuncias registradas.</p>
            ) : (
                recientes.map(denuncia => (
                    <div className="news-card" key={denuncia.id_denuncia}>
                        <img 
                            src={`http://localhost:3000${denuncia.imagen_url}`} 
                            alt="Evidencia" 
                            className="news-img"
                            onError={(e) => {e.target.src = 'https://via.placeholder.com/300'}} 
                        />
                        <div className="news-title">
                            <span style={{display:'block', color:'#64748b', fontSize:'0.8rem', marginBottom:'5px'}}>
                                {denuncia.distrito} • {new Date(denuncia.fecha_creado).toLocaleDateString()}
                            </span>
                            {denuncia.categoria}
                        </div>
                    </div>
                ))
            )}
          </div>
        </div>

        {/* ESTADÍSTICAS PÚBLICAS (DINÁMICO) */}
        <div className="section-container">
          <h2 className="section-title" style={{marginBottom: '20px'}}>Estadísticas Públicas</h2>
          <div className="cards-grid">
            <div className="stat-card">
              <div className="stat-label"><TrendingUp size={18} style={{verticalAlign:'middle'}}/> Total de denuncias</div>
              <div className="stat-number">{stats.total_denuncias}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label"><CheckCircle size={18} style={{verticalAlign:'middle'}}/> Efectividad</div>
              <div className="stat-number">{stats.resueltas_pct}%</div>
              <small style={{color:'#64748b'}}>Denuncias resueltas</small>
            </div>
            <div className="stat-card">
              <div className="stat-label"><Clock size={18} style={{verticalAlign:'middle'}}/> Tiempo promedio</div>
              <div className="stat-number">{stats.tiempo_promedio}</div>
            </div>
          </div>
        </div>

        <footer style={{textAlign: 'center', padding: '40px 0', color: '#64748b', fontSize: '0.85rem'}}>
          <p>© 2025 Denuncias.com Todos los derechos reservados.</p>
        </footer>

      </div>
    </div>
  );
};

export default Home;