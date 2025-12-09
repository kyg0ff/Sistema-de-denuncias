import React from 'react';
import { CATEGORY_INFO } from '../data/categories'; // Importamos la data separada

export default function ReportCategory({ selectedCategory, onChange }) {
  return (
    <div className="form-grid">
      <div className="input-group">
        <label style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Categoría *
        </label>
        <div className="input-wrapper">
          <select 
            required 
            style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: '#fcfdfe', color: 'var(--deep-blue)', fontWeight: 600, fontSize: '0.95rem', outline: 'none' }}
            value={selectedCategory}
            onChange={onChange}
          >
            <option value="">Selecciona una categoría...</option>
            <option value="obstruccion">1. Obstrucción (Prioridad Alta)</option>
            <option value="invasion">2. Invasión Peatonal (Prioridad Alta/Media)</option>
            <option value="zonas">3. Zonas Prohibidas (Prioridad Media)</option>
            <option value="accesos">4. Accesos y Servicios Públicos</option>
            <option value="conducta">5. Conducta Indebida (Prioridad Baja)</option>
          </select>
        </div>

        {/* Info Card Dinámica */}
        {selectedCategory && CATEGORY_INFO[selectedCategory] && (
          <div style={{ marginTop: '16px', backgroundColor: '#f0f9ff', borderLeft: '4px solid var(--vibrant-blue)', padding: '20px', borderRadius: '0 8px 8px 0', animation: 'fadeIn 0.3s ease-out' }}>
            <h4 style={{ margin: '0 0 8px 0', color: 'var(--deep-blue)', fontSize: '1rem', fontWeight: 700 }}>
              ℹ️ {CATEGORY_INFO[selectedCategory].title}
            </h4>
            <p style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: 'var(--text-main)', fontStyle: 'italic' }}>
              {CATEGORY_INFO[selectedCategory].desc}
            </p>
            <ul style={{ paddingLeft: '20px', margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              {CATEGORY_INFO[selectedCategory].items.map((item, index) => (
                <li key={index} style={{ marginBottom: '6px' }}>
                  {item.split(' ').map((word, i) => (
                    /^[A-Z]\d{2}$/.test(word.replace('.', '')) ? <strong key={i}>{word} </strong> : word + ' '
                  ))}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}