import React, { useState, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import MapSelector from '../../components/MapSelector';
import { AuthContext } from '../../context/AuthContext';
import './CreateDenuncia.css';

const CreateDenuncia = () => {
    const navigate = useNavigate();
    const { token, user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        categoria: '',
        subcategoria: 'General',
        descripcion: '',
        distrito: '',
        direccion_referencia: '',
        latitud: null,
        longitud: null,
    });
    const [imagenFile, setImagenFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleLocationSelect = (latlng) => setFormData(prev => ({ ...prev, latitud: latlng.lat, longitud: latlng.lng }));
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) { setImagenFile(file); setPreviewUrl(URL.createObjectURL(file)); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.categoria || !formData.distrito || !formData.latitud || !imagenFile) {
            Swal.fire('Error', 'Por favor complete todos los campos y la foto.', 'error');
            return;
        }

        setLoading(true);

        try {
            const data = new FormData();
            data.append('categoria', formData.categoria);
            data.append('subcategoria', formData.subcategoria);
            data.append('descripcion', formData.descripcion);
            data.append('distrito', formData.distrito);
            data.append('direccion_referencia', formData.direccion_referencia);
            data.append('latitud', formData.latitud);
            data.append('longitud', formData.longitud);
            data.append('imagen', imagenFile);

            let response;
            
            if (token) {
                // Logueado
                response = await axios.post('http://localhost:3000/api/denuncias', data, {
                    headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` }
                });
            } else {
                // Anónimo
                response = await axios.post('http://localhost:3000/api/denuncias/anonima', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            setLoading(false);

            // OBTENER EL CÓDIGO (La estructura cambia levemente entre los dos endpoints)
            // Si es logueado: response.data.denuncia.codigo_seguimiento
            // Si es anónimo: response.data.datos.codigo_seguimiento
            const codigo = response.data.denuncia?.codigo_seguimiento || response.data.datos?.codigo_seguimiento;

            // ALERTA UNIFICADA (Siempre mostramos el código)
            Swal.fire({
                title: '¡Denuncia Registrada!',
                html: `
                    <p>Su reporte ha sido enviado exitosamente.</p>
                    <div style="background:#f1f5f9; padding:10px; border-radius:8px; margin-top:10px;">
                        <small>CÓDIGO DE SEGUIMIENTO:</small><br>
                        <b style="font-size:1.4rem; color:#0284c7">${codigo}</b>
                    </div>
                `,
                icon: 'success',
                confirmButtonText: 'Entendido'
            }).then(() => {
                if (token) {
                    navigate('/ciudadano/mis-denuncias');
                } else {
                    navigate('/');
                }
            });

        } catch (error) {
            console.error(error);
            setLoading(false);
            Swal.fire('Error', 'Hubo un problema al enviar la denuncia', 'error');
        }
    };

    return (
        <div className="form-page">
            <div className="form-container">
                <div className="form-header">
                    <h1 className="form-title">
                        {user ? 'Nuevo Reporte Ciudadano' : 'Crear Denuncia Anónima'}
                    </h1>
                    <p className="form-subtitle">
                        Complete el formulario. Recibirá un código de seguimiento al finalizar.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* INPUTS IGUALES QUE ANTES... */}
                    <div className="form-group">
                        <label className="form-label">Categoría *</label>
                        <select name="categoria" className="form-control" value={formData.categoria} onChange={handleInputChange} required>
                            <option value="">Seleccione una categoría</option>
                            <option value="Zona Prohibida">Estacionamiento en Zona Prohibida</option>
                            <option value="Obstrucción">Obstrucción de Paso</option>
                            <option value="Abandono">Vehículo Abandonado</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Descripción *</label>
                        <textarea name="descripcion" className="form-control" value={formData.descripcion} onChange={handleInputChange} required></textarea>
                    </div>

                    <div className="form-row">
                        <div className="col form-group">
                            <label className="form-label">Distrito *</label>
                            <select name="distrito" className="form-control" value={formData.distrito} onChange={handleInputChange} required>
                                <option value="">Seleccione distrito</option>
                                <option value="Cusco">Cusco (central)</option>
                                <option value="Wanchaq">Wanchaq</option>
                                <option value="San Sebastián">San Sebastián</option>
                                <option value="San Jerónimo">San Jerónimo</option>
                                <option value="Santiago">Santiago</option>
                                <option value="Poroy">Poroy</option>
                            </select>
                        </div>
                        <div className="col form-group">
                            <label className="form-label">Dirección de referencia</label>
                            <input type="text" name="direccion_referencia" className="form-control" value={formData.direccion_referencia} onChange={handleInputChange} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Ubicación exacta *</label>
                        <MapSelector onLocationSelect={handleLocationSelect} />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Adjuntar Foto *</label>
                        <div className="file-upload-wrapper">
                            <input type="file" accept="image/*" onChange={handleFileChange} required />
                            {previewUrl && <img src={previewUrl} alt="Preview" className="preview-img" />}
                        </div>
                    </div>

                    <div className="btn-group">
                        <button type="button" className="btn btn-cancel" onClick={() => navigate('/')}>Cancelar</button>
                        <button type="submit" className="btn btn-submit" disabled={loading}>
                            {loading ? 'Enviando...' : 'Enviar Denuncia'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateDenuncia;