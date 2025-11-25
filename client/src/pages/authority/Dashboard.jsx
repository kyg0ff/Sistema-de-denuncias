import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { MapPin, CheckCircle, AlertTriangle } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
    const { token } = useContext(AuthContext);
    const [denuncias, setDenuncias] = useState([]);
    const [distrito, setDistrito] = useState('');
    const [loading, setLoading] = useState(true);

    // 1. Cargar Denuncias al iniciar
    const fetchDenuncias = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/autoridad/bandeja', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDenuncias(res.data.denuncias);
            setDistrito(res.data.distrito_asignado);
            setLoading(false);
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudieron cargar las denuncias', 'error');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDenuncias();
    }, [token]);

    // 2. Función para Atender (Cambiar Estado)
    const handleAtender = async (id_denuncia) => {
        // Popup para pedir detalles
        const { value: observacion } = await Swal.fire({
            title: 'Atender Denuncia',
            input: 'textarea',
            inputLabel: 'Ingrese las acciones tomadas (Ej: Se envió grúa)',
            inputPlaceholder: 'Escriba aquí...',
            showCancelButton: true,
            confirmButtonText: 'Marcar En Proceso',
            inputValidator: (value) => {
                if (!value) return '¡Debe escribir una observación!';
            }
        });

        if (observacion) {
            try {
                await axios.put(`http://localhost:3000/api/autoridad/atender/${id_denuncia}`, 
                {
                    nuevo_estado: 'EN_PROCESO',
                    observacion: observacion
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                });

                Swal.fire('¡Listo!', 'La denuncia ha sido actualizada.', 'success');
                fetchDenuncias(); // Recargar la lista

            } catch (error) {
                Swal.fire('Error', 'No se pudo actualizar el estado', 'error');
            }
        }
    };

    if (loading) return <div style={{textAlign: 'center', padding: '50px'}}>Cargando panel...</div>;

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="dashboard-header">
                    <h1 className="dashboard-title">
                        Bandeja de Entrada 
                        <span className="district-badge">{distrito}</span>
                    </h1>
                </div>

                {denuncias.length === 0 ? (
                    <div style={{textAlign: 'center', padding: '40px', color: '#64748b'}}>
                        <CheckCircle size={48} style={{marginBottom: '10px', color: '#10b981'}}/>
                        <h3>¡Todo limpio!</h3>
                        <p>No hay denuncias pendientes en tu jurisdicción.</p>
                    </div>
                ) : (
                    <div className="complaints-grid">
                        {denuncias.map((d) => (
                            <div key={d.id_denuncia} className="complaint-card">
                                {/* Cabecera */}
                                <div className="card-header">
                                    <span className={`status-badge status-${d.estado.toLowerCase()}`}>
                                        {d.estado.replace('_', ' ')}
                                    </span>
                                    <span className="card-date">
                                        {new Date(d.fecha_creado).toLocaleDateString()}
                                    </span>
                                </div>

                                {/* Cuerpo */}
                                <div className="card-body">
                                    {/* Mostramos la imagen real del servidor */}
                                    <img 
                                        src={`http://localhost:3000${d.imagen_url}`} 
                                        alt="Evidencia" 
                                        className="card-img"
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=Sin+Imagen'; }} 
                                    />
                                    <div className="card-category">{d.categoria}</div>
                                    <p className="card-desc">{d.descripcion}</p>
                                    <div className="card-location">
                                        <MapPin size={16} />
                                        {d.direccion_referencia || 'Sin dirección exacta'}
                                    </div>
                                </div>

                                {/* Acciones */}
                                <div className="card-actions">
                                    <a 
                                        href={`https://www.google.com/maps/search/?api=1&query=${d.latitud},${d.longitud}`} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="btn-action btn-map"
                                    >
                                        <MapPin size={16} /> Mapa
                                    </a>
                                    
                                    {d.estado === 'RECIBIDA' && (
                                        <button 
                                            className="btn-action btn-attend"
                                            onClick={() => handleAtender(d.id_denuncia)}
                                        >
                                            <AlertTriangle size={16} /> Atender
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;