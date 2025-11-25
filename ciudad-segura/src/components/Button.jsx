import React from 'react';

export default function Button({ children, variant = 'primary', icon, ...props }) {
  return (
    <button className={`btn btn-${variant}`} {...props}>
      {icon && <span className="btn-icon">{icon}</span>}
      {children}
    </button>
  );
}