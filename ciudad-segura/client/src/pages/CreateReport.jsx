import React, { useState } from 'react';
import Button from '../components/Button';
import ReportMap from '../components/ReportMap';
import ReportCategory from '../components/ReportCategory';
import ReportEvidence from '../components/ReportEvidence';

/**
 * COMPONENTE: CreateReport
 * Maneja la creación de denuncias con soporte para archivos multimedia (JSONB en DB)
 */
export default function CreateReport({ user, onBack, onSubmitSuccess, onViewDetails, onCreateReport }) {
  // --- ESTADOS DE UI ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');
  const [newComplaintId, setNewComplaintId] = useState('');
  
  // --- ESTADOS DE DATOS DEL FORMULARIO ---
  const [position, setPosition] = useState({ lat: -13.5167, lng: -71.9781 });
  const [mapReady, setMapReady] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [plate, setPlate] = useState('');
  const [description, setDescription] = useState('');
  const [reference, setReference] = useState('');
  const [files, setFiles] = useState([]); // Almacena los archivos binarios (File objects)
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // --- LÓGICA DE ENVÍO ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Validaciones básicas (Se mantienen igual)
    if (user && !acceptedTerms) {
      alert("Para continuar, debes aceptar la declaración jurada.");
      return;
    }
    if (!selectedCategory) {
      alert("Por favor, selecciona una categoría para el reporte.");
      return;
    }
    if (files.length === 0) {
      alert("Debes subir al menos una evidencia visual (foto o video).");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      
      // CAMPOS ESTÁNDAR
      formData.append('categoria', selectedCategory);
      formData.append('titulo', `Reporte de ${selectedCategory}`);
      formData.append('descripcion', description || 'Sin descripción adicional');
      formData.append('placa', plate);
      formData.append('referencia', reference);
      
      // --- EL ARREGLO PARA EL ID DE USUARIO ---
      // Solo agregamos 'usuario_id' si el objeto user existe y tiene un ID.
      // Si no, no lo agregamos al FormData. El backend recibirá 'undefined' 
      // y tu modelo Complaint.js hará: complaintData.usuario_id || null (resultando en null).
      if (user && user.id) {
        formData.append('usuario_id', user.id);
      }

      // UBICACIÓN
      formData.append('ubicacion', JSON.stringify({
        lat: position.lat,
        lng: position.lng,
        address: reference || 'Ubicación marcada en mapa'
      }));

      // EVIDENCIAS
      files.forEach((file) => {
        formData.append('evidencias', file);
      });

      // Envío al servidor
      const result = await onCreateReport(formData);
      
      if (result.success) {
        setTrackingCode(result.trackingCode);
        setNewComplaintId(result.complaintId);
        setShowSuccess(true);
      } else {
        alert(result.error || 'Hubo un problema al procesar el reporte.');
      }
    } catch (error) {
      console.error('Error en el envío del reporte:', error);
      alert('Error de conexión. Inténtalo de nuevo más tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSuccess = () => { 
    setShowSuccess(false); 
    onSubmitSuccess(); 
  };

  // --- ESTILOS ---
  const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: '#fcfdfe', color: 'var(--deep-blue)', fontWeight: 600, fontSize: '0.95rem', outline: 'none' };
  const labelStyle = { fontSize: '1rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' };

  return (
    <div style={{ backgroundColor: 'var(--bg-body)', minHeight: '100vh', animation: 'fadeIn 0.4s ease-out' }}>
      <main className="container" style={{ paddingBottom: '80px' }}>
        
        {/* Header de navegación */}
        <div style={{ padding: '40px 0 20px 0' }}>
          <button 
            onClick={onBack} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '15px', fontWeight: 600 }}
          >
            ← Cancelar y volver
          </button>
        </div>

        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ marginBottom: '32px', textAlign: 'center' }}>
            <h1 style={{ fontSize: '2.5rem', margin: '0', color: 'var(--deep-blue)', fontWeight: 800 }}>Nuevo Reporte</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Proporcione información precisa para una atención rápida.</p>
          </div>

          <form onSubmit={handleSubmit} className="profile-card" style={{ display: 'flex', flexDirection: 'column', gap: '32px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', borderRadius: '24px', padding: '40px', backgroundColor: 'white' }}>
            
            {/* 1. SECCIÓN: CATEGORÍA Y DESCRIPCIÓN */}
            <div>
              <h3 className="section-header" style={{ borderBottom: '2px solid #f1f5f9', paddingBottom: '12px', marginBottom: '24px', fontSize: '1.25rem', color: 'var(--deep-blue)' }}>1. Detalles del Incidente</h3>
              <ReportCategory 
                selectedCategory={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)} 
              />
              <div className="input-group" style={{ marginTop: '24px' }}>
                <label style={labelStyle}>Descripción de los hechos <span style={{fontWeight:400, textTransform:'none', color:'#94a3b8'}}>(Opcional)</span></label>
                <textarea 
                  rows="3" 
                  placeholder="Explique brevemente lo que está sucediendo..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ ...inputStyle, fontFamily: 'inherit', resize: 'vertical', minHeight: '100px' }}
                ></textarea>
              </div>
            </div>

            {/* 2. SECCIÓN: UBICACIÓN */}
            <div>
              <h3 className="section-header" style={{ borderBottom: '2px solid #f1f5f9', paddingBottom: '12px', marginBottom: '24px', fontSize: '1.25rem', color: 'var(--deep-blue)' }}>2. Ubicación Exacta</h3>
              <div className="input-group" style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Marque el punto en el mapa *</label>
                <ReportMap 
                  position={position} 
                  setPosition={setPosition} 
                  mapReady={mapReady} 
                  setMapReady={setMapReady} 
                />
              </div>
              <div className="input-group">
                <label style={labelStyle}>Referencia de ubicación <span style={{fontWeight:400, textTransform:'none', color:'#94a3b8'}}>(Opcional)</span></label>
                <input 
                  type="text" 
                  placeholder="Ej. Frente a la tienda roja, altura cuadra 5..."
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  style={inputStyle} 
                />
              </div>
            </div>

            {/* 3. SECCIÓN: EVIDENCIA (SIN BOTÓN ESCANEAR) */}
            <div>
              <h3 className="section-header" style={{ borderBottom: '2px solid #f1f5f9', paddingBottom: '12px', marginBottom: '24px', fontSize: '1.25rem', color: 'var(--deep-blue)' }}>3. Evidencia y Datos</h3>
              <ReportEvidence 
                plate={plate} 
                setPlate={setPlate} 
                files={files} 
                setFiles={setFiles} 
              />
            </div>

            {/* 4. DECLARACIÓN JURADA (Solo para usuarios logueados) */}
            {user && (
              <div style={{ backgroundColor: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <label style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={acceptedTerms} 
                    onChange={(e) => setAcceptedTerms(e.target.checked)} 
                    style={{ width: '22px', height: '22px', accentColor: 'var(--deep-blue)', marginTop: '2px' }} 
                  />
                  <span style={{ fontSize: '0.9rem', color: 'var(--deep-blue)', lineHeight: 1.6 }}>
                    <strong>Declaración Jurada:</strong> Declaro bajo juramento que la información y evidencias adjuntas son verdaderas. Entiendo que proporcionar información falsa es un delito y asumo la responsabilidad legal correspondiente.
                  </span>
                </label>
              </div>
            )}

            {/* ACCIÓN FINAL */}
            <div style={{ paddingTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
              <Button 
                type="submit" 
                disabled={isSubmitting || (user && !acceptedTerms) || !selectedCategory || files.length === 0}
                style={{ 
                  backgroundColor: isSubmitting ? '#94a3b8' : 'var(--deep-blue)', 
                  color: 'white', 
                  minWidth: '220px', 
                  height: '56px', 
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  boxShadow: '0 4px 14px rgba(14, 42, 59, 0.2)'
                }}
              >
                {isSubmitting ? 'Subiendo archivos...' : 'Enviar Reporte Ahora'}
              </Button>
            </div>
          </form>
        </div>
      </main>

      {/* MODAL DE ÉXITO */}
      {showSuccess && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(14, 42, 59, 0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '32px', padding: '48px', maxWidth: '480px', width: '90%', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', animation: 'scaleUp 0.3s ease-out' }}>
            <div style={{ width: '90px', height: '90px', margin: '0 auto 28px', backgroundColor: '#dcfce7', color: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h2 style={{ color: 'var(--deep-blue)', margin: '0 0 12px 0', fontSize: '2rem', fontWeight: 800 }}>¡Reporte Exitoso!</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '1.05rem' }}>Tu denuncia ha sido registrada en el sistema de seguridad.</p>
            
            <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '20px', marginBottom: '32px', border: '2px dashed #e2e8f0' }}>
              <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 800, marginBottom: '8px' }}>Código de Seguimiento</span>
              <span style={{ display: 'block', fontSize: '2.2rem', fontWeight: 900, color: 'var(--vibrant-blue)', letterSpacing: '3px', fontFamily: 'monospace' }}>{trackingCode}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Button 
                onClick={() => onViewDetails(newComplaintId)} 
                style={{ width: '100%', backgroundColor: 'var(--deep-blue)', color: 'white', height: '52px' }}
              >
                Ver Detalles del Reporte
              </Button>
              <Button 
                onClick={handleCloseSuccess} 
                variant="ghost" 
                style={{ width: '100%', color: '#64748b', fontWeight: 600 }}
              >
                Volver al Panel Principal
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}