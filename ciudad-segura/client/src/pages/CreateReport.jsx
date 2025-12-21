import React, { useState } from 'react';
import Button from '../components/Button';
import ReportMap from '../components/ReportMap';
import ReportCategory from '../components/ReportCategory';
import ReportEvidence from '../components/ReportEvidence';

export default function CreateReport({ user, onBack, onSubmitSuccess, onViewDetails, onCreateReport }) {
  // Estados Globales del Formulario
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');
  const [newComplaintId, setNewComplaintId] = useState('');
  
  // Estados pasados a hijos
  const [position, setPosition] = useState({ lat: -13.5167, lng: -71.9781 });
  const [mapReady, setMapReady] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [plate, setPlate] = useState('');
  const [description, setDescription] = useState('');
  const [reference, setReference] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (user && !acceptedTerms) {
      alert("Para continuar, debes declarar que la información es verdadera.");
      return;
    }

    if (!selectedCategory) {
      alert("Debes seleccionar una categoría.");
      return;
    }

    setIsSubmitting(true);

    try {
      const reportData = {
        category: selectedCategory,
        title: `Reporte de ${selectedCategory}`,
        description,
        location: {
          lat: position.lat,
          lng: position.lng,
          address: reference
        },
        plate,
        reference
      };

      const result = await onCreateReport(reportData);
      
      if (result.success) {
        setTrackingCode(result.trackingCode);
        setNewComplaintId(result.complaintId);
        setShowSuccess(true);
      } else {
        alert(result.error || 'Error al crear el reporte');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al enviar el reporte');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSuccess = () => { 
    setShowSuccess(false); 
    onSubmitSuccess(); 
  };

  // Estilos comunes
  const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: '#fcfdfe', color: 'var(--deep-blue)', fontWeight: 600, fontSize: '0.95rem', outline: 'none' };
  const labelStyle = { fontSize: '1rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' };

  return (
    <div style={{ backgroundColor: 'var(--bg-body)', minHeight: '100vh' }}>
      <main className="container" style={{ paddingBottom: '80px' }}>
        
        {/* Header */}
        <div style={{ padding: '40px 0 20px 0' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '15px', fontWeight: 600 }}>← Cancelar y volver</button>
        </div>

        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ marginBottom: '32px', textAlign: 'center' }}>
            <h1 style={{ fontSize: '2.5rem', margin: '0', color: 'var(--deep-blue)', fontWeight: 800 }}>Nuevo Reporte</h1>
          </div>

          <form onSubmit={handleSubmit} className="profile-card" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* 1. SECCIÓN: CATEGORÍA */}
            <div>
              <h3 className="section-header" style={{ borderBottom: 'none', paddingBottom: '8px', marginBottom: '16px', fontSize: '1.25rem' }}>1. Detalles del Incidente</h3>
              <ReportCategory 
                selectedCategory={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)} 
              />
              <div className="input-group" style={{ marginTop: '20px' }}>
                <label style={labelStyle}>Descripción <span style={{fontWeight:400, textTransform:'none', color:'#94a3b8'}}>(Opcional)</span></label>
                <div className="input-wrapper">
                  <textarea 
                    rows="3" 
                    placeholder="Detalles adicionales..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ ...inputStyle, fontFamily: 'inherit', resize: 'vertical' }}
                  ></textarea>
                </div>
              </div>
            </div>

            {/* 2. SECCIÓN: MAPA */}
            <div>
              <h3 className="section-header" style={{ borderBottom: 'none', paddingBottom: '8px', marginBottom: '16px', fontSize: '1.25rem' }}>2. Ubicación Exacta</h3>
              <div className="input-group" style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Ubicación en Mapa *</label>
                <ReportMap 
                  position={position} 
                  setPosition={setPosition} 
                  mapReady={mapReady} 
                  setMapReady={setMapReady} 
                />
              </div>
              <div className="input-group">
                <label style={labelStyle}>Referencia <span style={{fontWeight:400, textTransform:'none', color:'#94a3b8'}}>(Opcional)</span></label>
                <div className="input-wrapper">
                  <input 
                    type="text" 
                    placeholder="Ej. Frente al parque..."
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    style={inputStyle} 
                  />
                </div>
              </div>
            </div>

            {/* 3. SECCIÓN: EVIDENCIA */}
            <div>
              <h3 className="section-header" style={{ borderBottom: 'none', paddingBottom: '8px', marginBottom: '16px', fontSize: '1.25rem' }}>3. Evidencia y Datos</h3>
              <ReportEvidence plate={plate} setPlate={setPlate} />
            </div>

            {/* 4. DECLARACIÓN JURADA */}
            {user && (
              <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginTop: '10px' }}>
                <label style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={acceptedTerms} 
                    onChange={(e) => setAcceptedTerms(e.target.checked)} 
                    style={{ width: '20px', height: '20px', accentColor: 'var(--deep-blue)', marginTop: '2px' }} 
                  />
                  <span style={{ fontSize: '0.9rem', color: 'var(--deep-blue)', lineHeight: 1.5 }}>
                    <strong>Declaración Jurada:</strong> Declaro bajo juramento que la información y evidencia adjunta son verdaderas y actuales. Entiendo que proporcionar información falsa acarrea responsabilidad administrativa y penal.
                  </span>
                </label>
              </div>
            )}

            {/* BOTÓN ENVIAR */}
            <div style={{ paddingTop: '20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                type="submit" 
                disabled={isSubmitting || (user && !acceptedTerms) || !selectedCategory}
                style={{ 
                  backgroundColor: (user && !acceptedTerms) || !selectedCategory ? '#94a3b8' : 'var(--deep-blue)', 
                  color: 'white', 
                  width: '200px', 
                  height: '48px', 
                  fontSize: '1rem', 
                  cursor: (user && !acceptedTerms) || !selectedCategory ? 'not-allowed' : 'pointer' 
                }}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Reporte'}
              </Button>
            </div>
          </form>
        </div>
      </main>

      {/* MODAL DE ÉXITO */}
      {showSuccess && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(14, 42, 59, 0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '40px', maxWidth: '450px', width: '90%', textAlign: 'center', boxShadow: '0 20px 25px rgba(0,0,0,0.2)', animation: 'scaleUp 0.3s ease-out' }}>
            <div style={{ width: '80px', height: '80px', margin: '0 auto 24px', backgroundColor: '#dcfce7', color: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h2 style={{ color: 'var(--deep-blue)', margin: '0 0 10px 0', fontSize: '1.8rem' }}>¡Reporte Enviado!</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Hemos recibido tu denuncia correctamente.</p>
            <div style={{ backgroundColor: '#f1f5f9', padding: '16px', borderRadius: '12px', marginBottom: '32px', border: '2px dashed var(--border)' }}>
              <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>Código de Seguimiento</span>
              <span style={{ display: 'block', fontSize: '2rem', fontWeight: 800, color: 'var(--deep-blue)', letterSpacing: '2px', fontFamily: 'monospace' }}>{trackingCode}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Button 
                onClick={() => onViewDetails(newComplaintId)} 
                style={{ width: '100%', backgroundColor: 'var(--vibrant-blue)', color: 'white' }}
              >
                Ver Detalles
              </Button>
              <Button 
                onClick={handleCloseSuccess} 
                variant="ghost" 
                style={{ width: '100%', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
              >
                Volver al Inicio
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}