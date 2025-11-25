import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Creamos el contexto (la nube de información)
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  // useNavigate no se puede usar aquí directamente si el Router está fuera, 
  // pero manejaremos la redirección en el componente Login.

  useEffect(() => {
    // Al cargar la app, revisamos si hay un usuario guardado
    const savedUser = localStorage.getItem('user');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, [token]);

  const login = (userData, tokenData) => {
    // 1. Guardar en Estado
    setUser(userData);
    setToken(tokenData);
    
    // 2. Guardar en Navegador (LocalStorage)
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', tokenData);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/'; // Redirigir al home forzosamente
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};