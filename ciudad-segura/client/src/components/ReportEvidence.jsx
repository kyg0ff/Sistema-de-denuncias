import React, { useRef, useState } from 'react';
import Button from './Button';

export default function ReportEvidence({ plate, setPlate }) {
  const [isOcrLoading, setIsOcrLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleOcrUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsOcrLoading(true);
      // Simulación de OCR
      setTimeout(() => { setPlate('V1Z-982'); setIsOcrLoading(false); }, 1500);
    }
  };

  const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: '#fcfdfe', color: 'var(--deep-blue)', fontWeight: 600, fontSize: '0.95rem', outline: 'none' };
  const labelStyle = { fontSize: '1rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' };

  return (
    <>
      <div className="input-group" style={{ marginBottom: '24px' }}>
        <label style={labelStyle}>Evidencia Visual *</label>
        <div className="upload-area" style={{ border: '2px dashed var(--vibrant-blue)', borderRadius: '12px', padding: '30px', backgroundColor: '#f0f9ff', textAlign: 'center', cursor: 'pointer', transition: '0.2s' }}>
          <div style={{ color: 'var(--medium-blue)', marginBottom: '10px' }}><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg></div>
          <p style={{ fontWeight: 600, color: 'var(--deep-blue)', margin: 0, fontSize: '0.95rem' }}>Subir foto o video</p>
        </div>
      </div>

      <div className="input-group">
        <label style={labelStyle}>Placa del Vehículo *</label>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ flex: 1 }}>
            <input type="text" placeholder="ABC-123" value={plate} onChange={(e) => setPlate(e.target.value.toUpperCase())} style={{ ...inputStyle, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }} />
          </div>
          <div style={{ width: 'auto' }}>
            <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleOcrUpload} />
            <Button type="button" onClick={() => fileInputRef.current.click()} style={{ height: '45px', backgroundColor: 'var(--medium-blue)', color: 'white', padding: '0 20px', fontSize: '0.9rem' }}>
              {isOcrLoading ? 'Leyendo...' : 'Escanear Placa'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}