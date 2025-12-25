import React from 'react';

/**
 * COMPONENTE: Button
 * Un componente de botón atómico y reutilizable para toda la aplicación.
 * * * FUNCIONAMIENTO:
 * 1. Variantes Dinámicas: Utiliza el prop 'variant' para construir la clase CSS, 
 * permitiendo estilos como 'btn-primary', 'btn-ghost', etc.
 * 2. Composición de Iconos: Renderiza condicionalmente un contenedor para iconos 
 * si la prop 'icon' está presente, facilitando el diseño alineado.
 * 3. Herencia de Atributos: Mediante '...props', el botón acepta automáticamente 
 * cualquier atributo estándar de HTML (type, onClick, disabled, title, etc.).
 * 4. Flexibilidad de Contenido: Usa 'children' para permitir texto, etiquetas o 
 * estructuras complejas dentro del botón.
 */
export default function Button({ 
  children, 
  variant = 'primary', // Valor por defecto para evitar errores visuales
  icon, 
  style,               // Permite sobrescribir estilos específicos si es necesario
  ...props 
}) {
  return (
    <button 
      className={`btn btn-${variant}`} 
      style={style} // Se integra para permitir personalización puntual sin hardcode
      {...props}    // Pasa todas las demás propiedades (onClick, type, etc.)
    >
      {/* RENDERIZADO CONDICIONAL: Solo muestra el icono si se pasa la prop */}
      {icon && (
        <span className="btn-icon" style={{ display: 'inline-flex', alignItems: 'center' }}>
          {icon}
        </span>
      )}
      
      {/* TEXTO O CONTENIDO DEL BOTÓN */}
      {children}
    </button>
  );
}