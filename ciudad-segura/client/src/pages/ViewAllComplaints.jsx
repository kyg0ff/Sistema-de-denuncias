import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import { complaintsService } from '../services/api';

/**
 * COMPONENTE INTERNO: ComplaintRow
 * Representa una fila con fuentes más grandes y legibles.
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
        gridTemplateColumns: '1.5fr 1.2fr 1.8fr 1fr 1.2fr',
        alignItems: 'center',
        padding: '20px 24px', // Más espaciado vertical
        backgroundColor: 'white',
        borderBottom: '1px solid #f1f5f9',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        gap: '12px'
      }}
    >
      {/* 1. Código de Seguimiento (Más grande y resaltado) */}
      <span style={{ 
        fontWeight: 800, 
        color: 'var(--vibrant-blue)', 
        fontFamily: 'monospace', 
        fontSize: '1.15rem' // <--- Agrandado
      }}>
        {item.codigo_seguimiento}
      </span>

      {/* 2. Fecha */}
      <span style={{ 
        color: 'var(--text-muted)', 
        fontSize: '1.05rem', // <--- Agrandado
        fontWeight: 500 
      }}>
        {item.date}
      </span>

      {/* 3. Categoría */}
      <span style={{ 
        color: 'var(--deep-blue)', 
        fontWeight: 600, 
        fontSize: '1.1rem' // <--- Agrandado
      }}>
        {item.category}
      </span>

      {/* 4. Placa (Estilo placa metálica) */}
      <div style={{ display: 'flex' }}>
        <span style={{ 
          backgroundColor: '#f1f5f9', 
          padding: '6px 12px', 
          borderRadius: '8px', 
          fontSize: '1.05rem', // <--- Agrandado
          fontWeight: 700, 
          color: '#334155',
          border: '2px solid #e2e8f0',
          minWidth: '90px',
          textAlign: 'center'
        }}>
          {item.plate}
        </span>
      </div>

      {/* 5. Estado */}
      <div style={{ textAlign: 'right' }}>
        <span style={{ 
          backgroundColor: style.bg, 
          color: style.color, 
          padding: '8px 16px', 
          borderRadius: '20px', 
          fontSize: '0.9rem', // <--- Agrandado
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

  const categories = [
    { id: 'obstruccion', label: 'Obstrucción' },
    { id: 'invasion', label: 'Invasión Peatonal' },
    { id: 'zonas', label: 'Zonas Prohibidas' },
    { id: 'accesos', label: 'Accesos Públicos' },
    { id: 'conducta', label: 'Conducta Indebida' }
  ];

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
          category: categories.find(cat => cat.id === c.categoria)?.label || c.categoria,
          categoryRaw: c.categoria,
          plate: c.placa || 'SIN PLACA',
          status: {
            'pendiente': 'Pendiente', 'en_revision': 'En Revisión',
            'resuelto': 'Resuelto', 'urgente': 'Urgente'
          }[c.estado] || c.estado
        }));
        setComplaints(transformed);
        setFilteredData(transformed);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const lower = searchTerm.toLowerCase();
    const filtered = complaints.filter(c => {
      const matchesSearch = c.codigo_seguimiento.toLowerCase().includes(lower) || 
                            c.plate.toLowerCase().includes(lower);
      const matchesCategory = selectedCategory === '' || c.categoryRaw === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    setFilteredData(filtered);
  }, [searchTerm, selectedCategory, complaints]);

  return (
    <main className="container" style={{ padding: '40px 0' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 900, color: 'var(--deep-blue)', margin: 0, letterSpacing: '-1px' }}>
            Denuncias y Seguimiento
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginTop: '5px' }}>
            Listado oficial de reportes ciudadanos registrados.
          </p>
        </div>
        <Button onClick={onBack} variant="ghost" style={{ fontSize: '1.1rem' }}>Volver</Button>
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
            fontSize: '1.1rem', fontWeight: 600, outline: 'none', transition: 'border-color 0.2s'
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--vibrant-blue)'}
          onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ 
            flex: 1, padding: '18px', borderRadius: '16px', border: '2px solid #e2e8f0', 
            fontSize: '1.1rem', fontWeight: 600, backgroundColor: 'white', cursor: 'pointer'
          }}
        >
          <option value="">Todas las Categorías</option>
          {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
        </select>
      </div>

      {/* CONTENEDOR TIPO TABLA */}
      <div style={{ 
        backgroundColor: 'white', borderRadius: '24px', overflow: 'hidden', 
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' 
      }}>
        
        {/* Cabecera con fuente más legible */}
        <div style={{ 
          display: 'grid', gridTemplateColumns: '1.5fr 1.2fr 1.8fr 1fr 1.2fr', padding: '22px 24px', 
          backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', 
          fontSize: '0.95rem', // <--- Cabecera agrandada
          fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '1.5px', gap: '12px'
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
          filteredData.map(item => (
            <ComplaintRow key={item.id} item={item} onClick={onViewDetails} />
          ))
        ) : (
          <div style={{ padding: '100px', textAlign: 'center', color: '#94a3b8' }}>
            <h2 style={{ fontSize: '1.8rem', color: '#cbd5e1' }}>Sin resultados</h2>
            <p style={{ fontSize: '1.1rem' }}>No se encontraron denuncias con esos criterios.</p>
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