import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import { complaintsService } from '../services/api';

/**
 * COMPONENTE INTERNO: ComplaintRow
 */
const ComplaintRow = ({ item, onClick }) => {
  const getStatusStyle = (status) => {
    const styles = {
      'Pendiente': { color: '#f59e0b', bg: '#fffbeb' },
      'En Revisión': { color: '#3b82f6', bg: '#eff6ff' },
      'Resuelto': { color: '#10b981', bg: '#ecfdf5' },
      'Urgente': { color: '#ef4444', bg: '#fef2f2' }
    };
    return styles[status] || { color: '#64748b', bg: '#f8fafc' };
  };

  const style = getStatusStyle(item.status);

  return (
    <div
      onClick={() => onClick(item.id)}
      className="complaint-row-card"
      style={{
        display: 'grid',
        gridTemplateColumns: '1.5fr 1.2fr 1.8fr 1.5fr 1.2fr',
        alignItems: 'center',
        padding: '20px 24px',
        backgroundColor: 'white',
        borderBottom: '1px solid #f1f5f9',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        gap: '12px'
      }}
    >
      <span style={{ fontWeight: 800, color: 'var(--vibrant-blue)', fontFamily: 'monospace', fontSize: '1.15rem' }}>
        {item.codigo_seguimiento}
      </span>
      <span style={{ color: 'var(--text-muted)', fontSize: '1.05rem', fontWeight: 500 }}>
        {item.date}
      </span>
      {/* CORRECCIÓN: Usa los campos reales del backend */}
      <span style={{ color: 'var(--deep-blue)', fontWeight: 600, fontSize: '1.1rem' }}>
        {item.categoria_titulo || item.categoria_slug || 'Sin categoría'}
      </span>
      <div style={{ display: 'flex' }}>
        <span style={{
          backgroundColor: '#f1f5f9',
          padding: '6px 14px',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: 700,
          color: '#334155',
          border: '2px solid #e2e8f0',
          minWidth: '100px',
          textAlign: 'center',
          letterSpacing: '0.5px'
        }}>
          {item.plate || 'SIN PLACA'}
        </span>
      </div>
      <div style={{ textAlign: 'right' }}>
        <span style={{
          backgroundColor: style.bg,
          color: style.color,
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '0.9rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {item.status}
        </span>
      </div>
    </div>
  );
};

export default function ViewAllComplaints({ onBack, onViewDetails }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [complaints, setComplaints] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    setIsLoading(true);
    try {
      const response = await complaintsService.getAll();
      if (response.success) {
        const transformed = response.data.map(c => ({
          id: c.id,
          codigo_seguimiento: c.codigo_seguimiento,
          date: new Date(c.fecha_creacion).toLocaleDateString('es-PE'),
          // CORRECCIÓN: Usamos los campos reales del JOIN
          categoria_titulo: c.categoria_titulo,
          categoria_slug: c.categoria_slug,
          plate: c.placa || 'SIN PLACA',
          status: {
            'pendiente': 'Pendiente',
            'en_revision': 'En Revisión',
            'resuelto': 'Resuelto',
            'urgente': 'Urgente'
          }[c.estado] || c.estado
        }));
        setComplaints(transformed);
        setFilteredData(transformed);
      }
    } catch (err) {
      console.error('Error cargando denuncias:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const lower = searchTerm.toLowerCase();
    const filtered = complaints.filter(c => {
      const matchesSearch = 
        c.codigo_seguimiento.toLowerCase().includes(lower) ||
        (c.plate && c.plate.toLowerCase().includes(lower));
      
      const matchesCategory = selectedCategory === '' || 
        c.categoria_slug === selectedCategory;

      return matchesSearch && matchesCategory;
    });
    setFilteredData(filtered);
  }, [searchTerm, selectedCategory, complaints]);

  // CORRECCIÓN: Categorías dinámicas desde los datos reales (no hardcodeadas)
  const availableCategories = Array.from(
    new Set(complaints.map(c => c.categoria_slug).filter(Boolean))
  ).map(slug => {
    const complaint = complaints.find(c => c.categoria_slug === slug);
    return {
      id: slug,
      label: complaint?.categoria_titulo || slug.charAt(0).toUpperCase() + slug.slice(1)
    };
  });

  return (
    <main className="container" style={{ padding: '40px 0' }}>
      {/* HEADER MEJORADO - BOTÓN VOLVER VISIBLE */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 900, color: 'var(--deep-blue)', margin: 0, letterSpacing: '-1px' }}>
            Denuncias y Seguimiento
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginTop: '5px' }}>
            Listado oficial de reportes ciudadanos registrados.
          </p>
        </div>
        <Button
          onClick={onBack}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          }
          style={{
            backgroundColor: 'var(--deep-blue)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '12px',
            fontSize: '1.1rem',
            fontWeight: 700,
            border: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            boxShadow: '0 4px 6px -1px rgba(30, 58, 138, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#2563eb';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--deep-blue)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Volver
        </Button>
      </div>

      {/* FILTROS */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <input
          type="text"
          placeholder="Buscar por código o placa..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 2, padding: '18px 25px', borderRadius: '16px', border: '2px solid #e2e8f0',
            fontSize: '1.1rem', fontWeight: 600, outline: 'none'
          }}
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            flex: 1, padding: '18px', borderRadius: '16px', border: '2px solid #e2e8f0',
            fontSize: '1.1rem', fontWeight: 600, backgroundColor: 'white'
          }}
        >
          <option value="">Todas las Categorías</option>
          {availableCategories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.label}</option>
          ))}
        </select>
      </div>

      {/* CONTENEDOR TIPO TABLA */}
      <div style={{
        backgroundColor: 'white', borderRadius: '24px', overflow: 'hidden',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0'
      }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1.5fr 1.2fr 1.8fr 1.5fr 1.2fr', padding: '22px 24px',
          backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0',
          fontSize: '0.95rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '1.5px', gap: '12px'
        }}>
          <span>Cód. Seguimiento</span>
          <span>Fecha</span>
          <span>Categoría</span>
          <span>Placa</span>
          <span style={{ textAlign: 'right' }}>Estado</span>
        </div>

        {isLoading ? (
          <div style={{ padding: '100px', textAlign: 'center' }}>
            <div className="loader"></div>
            <p style={{ marginTop: '20px', color: 'var(--text-muted)', fontWeight: 600 }}>Cargando registros...</p>
          </div>
        ) : filteredData.length > 0 ? (
          filteredData.map(item => <ComplaintRow key={item.id} item={item} onClick={onViewDetails} />)
        ) : (
          <div style={{ padding: '100px', textAlign: 'center', color: '#94a3b8' }}>
            <h2 style={{ fontSize: '1.8rem', color: '#cbd5e1' }}>Sin resultados</h2>
            <p style={{ fontSize: '1.1rem' }}>No se encontraron denuncias.</p>
          </div>
        )}
      </div>

      <style>{`
        .complaint-row-card:hover { background-color: #f8fafc !important; transform: scale(1.005); }
        .loader { width: 45px; height: 45px; margin: 0 auto; border: 5px solid #f3f3f3; border-top: 5px solid var(--vibrant-blue); border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </main>
  );
}