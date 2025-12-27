import React from 'react';
// import { CATEGORY_INFO } from '../data/categories'; // Importamos la data separada

export default function ReportCategory({ selectedCategory, onChange, categoriesList = [] }) {
  // Buscamos la info de la categoría seleccionada dentro del array que viene de la DB
  const categoryData = categoriesList.find(cat => cat.slug === selectedCategory);

  return (
    <div className="form-grid">
      <div className="input-group">
        <label>Categoría *</label>
        <select value={selectedCategory} onChange={onChange}>
          <option value="">Selecciona una categoría...</option>
          {/* CAMBIO: Mapeo dinámico desde la Base de Datos */}
          {categoriesList.map(cat => (
            <option key={cat.id} value={cat.slug}>
              {cat.titulo} (Prioridad: {cat.prioridad})
            </option>
          ))}
        </select>

        {/* Info Card Dinámica usando los campos de la DB */}
        {selectedCategory && categoryData && (
          <div className="info-card">
            <h4>ℹ️ {categoryData.titulo}</h4>
            <p>{categoryData.descripcion}</p>
            <ul>
              {/* infracciones ahora es un array que viene del JSONB de la DB */}
              {categoryData.infracciones?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}