import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { List } from 'lucide-react'; // Quitamos PlusCircle
import { AuthContext } from '../../context/AuthContext';
import './MyComplaints.css';

const MyComplaints = () => {
    const { token, user } = useContext(AuthContext);
    const [denuncias, setDenuncias] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMisDenuncias = async () => {
            try {
                const res = await axios.get('http://localhost:3000/api/denuncias', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDenuncias(res.data.mis_denuncias);
            } catch (error) {
                console.error("Error cargando historial:", error);
            } finally {
                setLoading(false);
            }
        };
        if (token) fetchMisDenuncias();
    }, [token]);

    const getStatusClass = (estado) => `badge badge-${estado.toLowerCase()}`;

    return (
        <div className="citizen-page">
            <div className="container">
                
                {/* CABECERA LIMPIA (Sin botón de crear) */}
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Hola, {user?.nombre}</h1>
                        <p style={{color: '#64748b'}}>Aquí tienes el historial de tus reportes ciudadanos.</p>
                    </div>
                </div>

                {/* CONTENIDO */}
                {loading ? (
                    <p>Cargando tu historial...</p>
                ) : denuncias.length === 0 ? (
                    <div className="empty-state">
                        <List size={48} style={{marginBottom:'15px', opacity:0.5}} />
                        <h3>Aún no tienes denuncias registradas</h3>
                        <p>Ve al inicio para reportar tu primera incidencia.</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="complaints-table">
                            <thead>
                                <tr>
                                    <th>Evidencia</th>
                                    <th>Código</th>
                                    <th>Categoría</th>
                                    <th>Distrito</th>
                                    <th>Fecha</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {denuncias.map((d) => (
                                    <tr key={d.id_denuncia}>
                                        <td>
                                            <img 
                                                src={`http://localhost:3000${d.imagen_url}`} 
                                                alt="Foto" className="thumb-img"
                                                onError={(e) => e.target.src = 'https://via.placeholder.com/50'}
                                            />
                                        </td>
                                        <td style={{fontFamily:'monospace', fontWeight:'bold'}}>{d.codigo_seguimiento}</td>
                                        <td>
                                            <span style={{fontWeight:'600', display:'block'}}>{d.categoria}</span>
                                            <small style={{color:'#64748b'}}>{d.subcategoria}</small>
                                        </td>
                                        <td>{d.distrito}</td>
                                        <td>{new Date(d.fecha_creado).toLocaleDateString()}</td>
                                        <td>
                                            <span className={getStatusClass(d.estado)}>
                                                {d.estado.replace('_', ' ')}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyComplaints;