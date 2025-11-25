import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, Calendar, MapPin, AlertCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import './TrackDenuncia.css';

const TrackDenuncia = () => {
    const { codigoUrl } = useParams(); // Leer si viene en la URL
    const navigate = useNavigate();

    const [codigo, setCodigo] = useState(codigoUrl || '');
    const [denuncia, setDenuncia] = useState(null);
    const [loading, setLoading] = useState(false);

    // Función para buscar
    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        
        if (!codigo.trim()) return;

        setLoading(true);
        setDenuncia(null);

        try {
            const res = await axios.get(`http://localhost:3000/api/denuncias/seguimiento/${codigo}`);
            setDenuncia(res.data);
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'No encontrada',
                text: 'No existe ninguna denuncia con ese código de seguimiento.',
                confirmButtonColor: '#ef4444'
            });
        } finally {
            setLoading(false);
        }
    };

    // Si entra por URL directa, buscar automático
    useEffect(() => {
        if (codigoUrl) {
            handleSearch();
        }
    }, [codigoUrl]);

    // Helper para clases de color según estado
    const getStatusColor = (estado) => {
        switch(estado) {
            case 'RECIBIDA': return { bg: '#fef3c7', color: '#d97706' };
            case 'EN_PROCESO': return { bg: '#dbeafe', color: '#2563eb' };
            case 'RESUELTA': return { bg: '#dcfce7', color: '#16a34a' };
            default: return { bg: '#f1f5f9', color: '#64748b' };
        }
    };

    return (
        <div className="track-page">
            <div className="search-section">
                <h1 className="track-title">Consulta tu Denuncia</h1>
                <p className="track-subtitle">Ingresa el código único que recibiste al registrar tu reporte (Ej: D-123456)</p>
                
                <form className="search-box" onSubmit={handleSearch}>
                    <input 
                        type="text" 
                        className="search-input"
                        placeholder="Ingresa tu código aquí..."
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value)}
                    />
                    <button type="submit" className="search-btn" disabled={loading}>
                        {loading ? 'Buscando...' : <Search size={20} />}
                    </button>
                </form>
            </div>

            {/* RESULTADO DE LA BÚSQUEDA */}
            {denuncia && (
                <div className="result-card">
                    <div className="result-header">
                        <span className="result-code">Seguimiento: {denuncia.codigo_seguimiento}</span>
                        <span style={{opacity: 0.8, fontSize: '0.9rem'}}>Pública y Anónima</span>
                    </div>

                    <div className="result-body">
                        <div className="result-info">
                            <div className="info-row">
                                <div className="info-label">Estado Actual</div>
                                <span 
                                    className="status-big"
                                    style={{
                                        backgroundColor: getStatusColor(denuncia.estado).bg,
                                        color: getStatusColor(denuncia.estado).color
                                    }}
                                >
                                    {denuncia.estado.replace('_', ' ')}
                                </span>
                            </div>

                            <div className="info-row">
                                <div className="info-label"><Calendar size={14} style={{verticalAlign:'middle'}}/> Fecha de reporte</div>
                                <div className="info-value">
                                    {new Date(denuncia.fecha_creado).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="info-row">
                                <div className="info-label"><MapPin size={14} style={{verticalAlign:'middle'}}/> Ubicación</div>
                                <div className="info-value">{denuncia.distrito}</div>
                            </div>

                            <div className="info-row">
                                <div className="info-label"><AlertCircle size={14} style={{verticalAlign:'middle'}}/> Categoría</div>
                                <div className="info-value">{denuncia.categoria}</div>
                            </div>
                        </div>

                        <div className="result-img-container">
                            {/* Nota: El backend debe devolver imagen_url en este endpoint. 
                                Si no sale, revisa que el SELECT en denunciaController.js incluya 'imagen_url' 
                            */}
                            <img 
                                src={denuncia.imagen_url ? `http://localhost:3000${denuncia.imagen_url}` : 'https://via.placeholder.com/300'}
                                alt="Evidencia" 
                                className="result-img"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrackDenuncia;