import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, FileText } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './Login.css'; // Reutilizamos el CSS del Login para que se vea igual

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: '', apellido: '', dni: '', correo: '', password: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:3000/api/usuarios/registro', formData);
            Swal.fire('¡Cuenta Creada!', 'Ahora puedes iniciar sesión.', 'success');
            navigate('/login');
        } catch (err) {
            Swal.fire('Error', err.response?.data?.error || 'Error al registrarse', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card" style={{maxWidth: '500px'}}>
                <div className="login-icon-wrapper">
                    <UserPlus size={32} />
                </div>
                <h2 className="login-title">Crear Cuenta Ciudadana</h2>
                
                <form className="login-form" onSubmit={handleSubmit}>
                    <div style={{display:'flex', gap:'10px'}}>
                        <div className="form-group" style={{flex:1}}>
                            <label className="form-label">Nombre</label>
                            <input type="text" name="nombre" className="form-control" onChange={handleChange} required />
                        </div>
                        <div className="form-group" style={{flex:1}}>
                            <label className="form-label">Apellido</label>
                            <input type="text" name="apellido" className="form-control" onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">DNI</label>
                        <div style={{position: 'relative'}}>
                            <input type="text" name="dni" className="form-control" style={{paddingLeft: '40px'}} onChange={handleChange} required maxLength={8} />
                            <FileText size={18} style={{position: 'absolute', left: '12px', top: '14px', color: '#94a3b8'}}/>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Correo Electrónico</label>
                        <div style={{position: 'relative'}}>
                            <input type="email" name="correo" className="form-control" style={{paddingLeft: '40px'}} onChange={handleChange} required />
                            <Mail size={18} style={{position: 'absolute', left: '12px', top: '14px', color: '#94a3b8'}}/>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Contraseña</label>
                        <div style={{position: 'relative'}}>
                            <input type="password" name="password" className="form-control" style={{paddingLeft: '40px'}} onChange={handleChange} required />
                            <Lock size={18} style={{position: 'absolute', left: '12px', top: '14px', color: '#94a3b8'}}/>
                        </div>
                    </div>

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? 'Registrando...' : 'Registrarse'}
                    </button>
                    
                    <div style={{marginTop:'20px', fontSize:'0.9rem'}}>
                        ¿Ya tienes cuenta? <Link to="/login" style={{color: 'var(--primary-color)', fontWeight:'bold'}}>Inicia Sesión</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;