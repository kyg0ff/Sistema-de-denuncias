import React, { useState } from 'react';

export default function ReportEvidence({ plate, setPlate, files, setFiles }) {
  const [previews, setPreviews] = useState([]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Guardamos los archivos reales para el envío al servidor
    setFiles(prev => [...prev, ...selectedFiles]);

    // Generamos URLs temporales para ver las miniaturas en la interfaz
    const newPreviews = selectedFiles.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith('video') ? 'video' : 'image',
      name: file.name
    }));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const labelStyle = { fontSize: '1rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' };
  const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: '#fcfdfe', color: 'var(--deep-blue)', fontWeight: 600, fontSize: '0.95rem', outline: 'none' };

  return (
    <>
      {/* SECCIÓN DE SUBIDA */}
      <div className="input-group" style={{ marginBottom: '24px' }}>
        <label style={labelStyle}>Evidencia Visual * (Fotos/Videos)</label>
        <div 
          onClick={() => document.getElementById('multi-upload').click()}
          style={{ border: '2px dashed var(--vibrant-blue)', borderRadius: '12px', padding: '30px', backgroundColor: '#f0f9ff', textAlign: 'center', cursor: 'pointer' }}
        >
          <input 
            id="multi-upload"
            type="file" 
            multiple 
            accept="image/*,video/*" 
            onChange={handleFileChange} 
            style={{ display: 'none' }} 
          />
          <div style={{ color: 'var(--medium-blue)', marginBottom: '10px' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
          </div>
          <p style={{ fontWeight: 600, color: 'var(--deep-blue)', margin: 0 }}>Toca para seleccionar archivos</p>
        </div>

        {/* LISTA DE PREVISUALIZACIÓN */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '15px', flexWrap: 'wrap' }}>
          {previews.map((src, index) => (
            <div key={index} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '2px solid white', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
              {src.type === 'image' ? (
                <img src={src.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="preview" />
              ) : (
                <div style={{ width: '100%', height: '100%', backgroundColor: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '10px' }}>VIDEO</div>
              )}
              <button 
                onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(220, 38, 38, 0.8)', color: 'white', border: 'none', borderRadius: '50%', width: '18px', height: '18px', cursor: 'pointer', fontSize: '12px' }}
              >✕</button>
            </div>
          ))}
        </div>
      </div>

      {/* SECCIÓN DE PLACA */}
      <div className="input-group">
        <label style={labelStyle}>Placa del Vehículo <span style={{fontWeight:400, textTransform:'none', color:'#94a3b8'}}>(Si aplica)</span></label>
        <input 
          type="text" 
          placeholder="Ej: V1Z-982" 
          value={plate} 
          onChange={(e) => setPlate(e.target.value.toUpperCase())} 
          style={{ ...inputStyle, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }} 
        />
      </div>
    </>
  );
}