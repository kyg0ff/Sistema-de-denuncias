import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCheck, Lock, Mail } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext); // Traemos la función login del contexto
    
    const [formData, setFormData] = useState({ correo: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await axios.post('http://localhost:3000/api/usuarios/login', formData);
            
            // 1. Guardamos en el contexto
            login(res.data.usuario, res.data.token);

            // 2. CORRECCIÓN: Redirigir SIEMPRE al Home
            navigate('/');

        } catch (err) {
            // Si sale mal (credenciales inválidas)
            setError(err.response?.data?.error || 'Error al conectar con el servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-icon-wrapper">
                    <UserCheck size={32} />
                </div>
                <h2 className="login-title">Iniciar Sesión</h2>

                {error && <div className="error-msg">{error}</div>}

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Correo Electrónico</label>
                        <div style={{position: 'relative'}}>
                            <input 
                                type="email" 
                                name="correo"
                                className="form-control" 
                                placeholder="ejemplo@correo.com"
                                value={formData.correo}
                                onChange={handleChange}
                                required
                                style={{paddingLeft: '40px'}}
                            />
                            <Mail size={18} style={{position: 'absolute', left: '12px', top: '14px', color: '#94a3b8'}}/>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Contraseña</label>
                        <div style={{position: 'relative'}}>
                            <input 
                                type="password" 
                                name="password"
                                className="form-control" 
                                placeholder="••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                style={{paddingLeft: '40px'}}
                            />
                            <Lock size={18} style={{position: 'absolute', left: '12px', top: '14px', color: '#94a3b8'}}/>
                        </div>
                    </div>

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? 'Verificando...' : 'Ingresar'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;