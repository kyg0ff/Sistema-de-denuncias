import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import StatCard from '../components/StatCard';
import AdminSidebar from '../components/AdminSidebar';
import AdminModal from '../components/AdminModal';
import { adminService } from '../services/api';

/**
 * DASHBOARD DE ADMINISTRACIÓN - Versión sincronizada con DB ciudad_segura
 */
export default function AdminDashboard({ onLogout }) {
  // --- 1. ESTADOS DE DATOS (Mapeados a tablas de la DB) ---
  const [users, setUsers] = useState([]);         // Tabla: usuarios
  const [orgs, setOrgs] = useState([]);           // Tabla: organizaciones
  const [authorities, setAuthorities] = useState([]); // Tabla: autoridades_detalle + usuarios
  const [statistics, setStatistics] = useState(null); // Basado en vista_estadisticas y conteos
  
  // --- 2. ESTADOS DE NAVEGACIÓN Y UI ---
  const [activeTab, setActiveTab] = useState('users'); 
  const [selectedOrg, setSelectedOrg] = useState(null); // Controla la vista de personal de una organización
  const [isLoading, setIsLoading] = useState(true);

  // --- 3. ESTADOS DE GESTIÓN (MODALES) ---
  const [modalType, setModalType] = useState(null);   // 'user', 'auth', 'org', 'delete'
  const [modalMode, setModalMode] = useState('add');  // 'add' o 'edit'
  const [currentItem, setCurrentItem] = useState(null); // Fila seleccionada para editar/borrar
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formData, setFormData] = useState({});       // Datos que viajan al backend

  // --- 4. ESTADOS DE FEEDBACK ---
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // --- CICLO DE VIDA ---
  useEffect(() => {
    loadInitialData();
  }, []);

  // Recarga automática de autoridades cuando se selecciona una organización específica
  useEffect(() => {
    if (selectedOrg) {
      loadAuthoritiesByOrg(selectedOrg.id);
    }
  }, [selectedOrg]);

  /**
   * Carga inicial de datos desde el servidor
   */
  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      // Llamadas paralelas para optimizar velocidad
      const [statsRes, usersRes, orgsRes] = await Promise.all([
        adminService.getStatistics(),
        adminService.getUsers(),
        adminService.getOrganizations()
      ]);

      if (statsRes.success) setStatistics(statsRes.data);
      if (usersRes.success) setUsers(usersRes.data);
      if (orgsRes.success) setOrgs(orgsRes.data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Carga personal de una organización (JOIN entre usuarios y autoridades_detalle)
   */
  const loadAuthoritiesByOrg = async (orgId) => {
    try {
      const response = await adminService.getAuthoritiesByOrg(orgId);
      if (response.success) {
        setAuthorities(response.data);
      }
    } catch (error) {
      console.error('Error cargando autoridades:', error);
    }
  };

  // --- MANEJO DE MODALES ---
  const openModal = (type, mode, item = null) => {
    setModalType(type);
    setModalMode(mode);
    setCurrentItem(item);
    
    // Inicialización de formularios según campos de la DB SQL
    if (type === 'user') {
      setFormData(item || {
        dni: '',
        nombres: '',
        apellidos: '',
        correo: '',
        telefono: '',
        contraseña_hash: '', // Mapeado a la tabla usuarios
        rol: 'ciudadano',     // Valor de Enum rol_usuario
        estado: 'activo'
      });
    } else if (type === 'auth') {
      // Para autoridades_detalle
      setFormData(item || { 
        usuario_id: '', 
        organizacion_id: selectedOrg?.id, 
        cargo: '' 
      });
    } else if (type === 'org') {
      // Para tabla organizaciones
      setFormData(item || {
        nombre: '',
        correo_contacto: '',
        numero_contacto: '',
        ubicacion: { lat: -13.5167, lng: -71.9781 } // Default Cusco (JSONB)
      });
    } else if (type === 'delete') {
      setDeleteTarget(mode);
    }
  };

  const closeModal = () => { 
    setModalType(null); 
    setFormData({}); 
    setCurrentItem(null); 
    setDeleteTarget(null);
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setSuccessModalOpen(true);
  };

  // --- OPERACIONES CRUD ---

  /**
   * Guarda o actualiza registros según el tipo de entidad
   */
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // GESTIÓN DE USUARIOS
      if (modalType === 'user') {
        if (modalMode === 'add') {
          const response = await adminService.createUser(formData);
          if (response.success) {
            setUsers([...users, response.data]);
            showSuccess('Usuario creado correctamente');
          }
        } else {
          const response = await adminService.updateUser(currentItem.id, formData);
          if (response.success) {
            setUsers(users.map(u => u.id === currentItem.id ? response.data : u));
            showSuccess('Usuario actualizado');
          }
        }
      }
      // GESTIÓN DE ORGANIZACIONES
      else if (modalType === 'org') {
        if (modalMode === 'add') {
          const response = await adminService.createOrganization(formData);
          if (response.success) {
            setOrgs([...orgs, response.data]);
            showSuccess('Organización registrada');
          }
        }
      }
      // ASIGNACIÓN DE AUTORIDAD (Tabla autoridades_detalle)
      else if (modalType === 'auth') {
        const response = await adminService.assignAuthority(formData);
        if (response.success) {
          loadAuthoritiesByOrg(selectedOrg.id); // Refrescar lista local
          showSuccess('Autoridad asignada con éxito');
        }
      }
      
      closeModal();
      loadInitialData(); // Actualizar estadísticas globales
    } catch (error) {
      alert('Error en el servidor: ' + error.message);
    }
  };

  /**
   * Ejecuta eliminaciones físicas (autoridades) o lógicas (usuarios)
   */
  const handleDelete = async () => {
    try {
      if (deleteTarget === 'user') {
        // En usuarios hacemos un update a estado='inactivo' (Borrado Lógico)
        const response = await adminService.updateUser(currentItem.id, { estado: 'inactivo' });
        if (response.success) {
          setUsers(users.map(u => u.id === currentItem.id ? { ...u, estado: 'inactivo' } : u));
          showSuccess('El usuario ha sido desactivado');
        }
      }
      if (deleteTarget === 'auth') {
        // En autoridades eliminamos el vínculo en autoridades_detalle
        const response = await adminService.deleteAuthority(currentItem.usuario_id);
        if (response.success) {
          setAuthorities(authorities.filter(a => a.usuario_id !== currentItem.usuario_id));
          showSuccess('Personal removido de la organización');
        }
      }
      closeModal();
    } catch (error) {
      alert('No se pudo completar la eliminación');
    }
  };

  // --- RENDERIZADO DE TABLAS ---

  /**
   * Renderiza la tabla de usuarios (Sincronizada con tabla 'usuarios')
   */
  const renderUsers = () => (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--deep-blue)', fontWeight: 700 }}>Directorio de Usuarios</h2>
          <p style={{ color: 'var(--text-muted)' }}>Gestión de ciudadanos, administradores y personal.</p>
        </div>
        <Button onClick={() => openModal('user', 'add')} style={{ backgroundColor: 'var(--deep-blue)', color: 'white' }}>
          + Nuevo Usuario
        </Button>
      </div>
      
      <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden' }}>
        <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Nombre y Apellidos</th>
              <th>DNI</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Estado</th>
              <th style={{ textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td style={{ fontWeight: 600 }}>{`${u.nombres} ${u.apellidos}`}</td>
                <td>{u.dni}</td>
                <td>{u.correo}</td>
                <td>
                  <span className={`badge ${u.rol}`}>
                    {u.rol.toUpperCase()}
                  </span>
                </td>
                <td>
                  <span style={{ 
                    padding: '4px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800,
                    backgroundColor: u.estado === 'activo' ? '#dcfce7' : '#fee2e2',
                    color: u.estado === 'activo' ? '#166534' : '#991b1b'
                  }}>
                    {u.estado ? u.estado.toUpperCase() : 'ACTIVO'}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button onClick={() => openModal('user', 'edit', u)} style={{ marginRight: '8px', color: '#4f46e5', background: 'none', border: 'none', cursor: 'pointer' }}>Editar</button>
                  <button onClick={() => openModal('delete', 'user', u)} style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer' }}>Baja</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  /**
   * Renderiza lista de organizaciones (Sincronizada con tabla 'organizaciones')
   */
  const renderOrgList = () => (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--deep-blue)', fontWeight: 700 }}>Entidades del Sistema</h2>
          <p style={{ color: 'var(--text-muted)' }}>Comisarías, Serenazgo y otras entidades registradas.</p>
        </div>
        <Button onClick={() => openModal('org', 'add')} style={{ backgroundColor: 'var(--vibrant-blue)', color: 'white' }}>
          + Nueva Organización
        </Button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {orgs.map(org => (
          <div key={org.id} onClick={() => setSelectedOrg(org)} className="card-hover-effect" style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid var(--border)', padding: '24px', cursor: 'pointer' }}>
            <div style={{ width: '48px', height: '48px', backgroundColor: '#e0e7ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5', marginBottom: '16px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18v-8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8z"></path><path d="M12 2L3 7v3h18V7L12 2z"></path></svg>
            </div>
            <h3 style={{ margin: '0 0 4px 0' }}>{org.nombre}</h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{org.correo_contacto}</p>
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f1f5f9', fontSize: '0.8rem', color: '#64748b' }}>
              Click para ver personal asignado
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /**
   * Renderiza detalle de personal (JOIN entre usuarios y autoridades_detalle)
   */
  const renderOrgDetails = () => (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <button onClick={() => setSelectedOrg(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        ← Volver a Organizaciones
      </button>
      <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '32px', border: '1px solid var(--border)' }}>
        <div className="flex-between" style={{ marginBottom: '24px' }}>
          <div>
            <h2 style={{ margin: 0 }}>{selectedOrg.nombre}</h2>
            <p style={{ color: 'var(--text-muted)' }}>Lista de personal autorizado en esta entidad.</p>
          </div>
          <Button onClick={() => openModal('auth', 'add')} style={{ border: '1px solid #e2e8f0' }}>Asignar Personal</Button>
        </div>
        
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#64748b', fontSize: '0.85rem' }}>
              <th style={{ paddingBottom: '12px' }}>Personal</th>
              <th style={{ paddingBottom: '12px' }}>Cargo</th>
              <th style={{ paddingBottom: '12px', textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {authorities.map(auth => (
              <tr key={auth.usuario_id} style={{ borderTop: '1px solid #f1f5f9' }}>
                <td style={{ padding: '16px 0', fontWeight: 600 }}>{auth.nombres} {auth.apellidos}</td>
                <td>{auth.cargo}</td>
                <td style={{ textAlign: 'right' }}>
                  <button onClick={() => openModal('delete', 'auth', auth)} style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer' }}>Remover</button>
                </td>
              </tr>
            ))}
            {authorities.length === 0 && (
              <tr><td colSpan="3" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No hay personal asignado a esta entidad.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  // --- RENDERIZADO DEL DASHBOARD ---

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      
      {/* Sidebar de navegación lateral */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} resetSelection={() => setSelectedOrg(null)} />

      <main style={{ flex: 1, marginLeft: '280px', padding: '40px' }}>
        
        {/* Sección de Resumen (Visible solo en el home del dashboard) */}
        {!selectedOrg && statistics && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
            <StatCard title="Total Denuncias" value={statistics.total_denuncias} color="#4f46e5" />
            <StatCard title="Resueltas" value={statistics.denuncias_resueltas} color="#059669" />
            <StatCard title="Usuarios" value={users.length} color="#d97706" />
            <StatCard title="Entidades" value={orgs.length} color="#7c3aed" />
          </div>
        )}

        {/* Cambio dinámico de contenido */}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'authorities' && (selectedOrg ? renderOrgDetails() : renderOrgList())}
      </main>

      {/* MODAL 1: GESTIÓN DE USUARIOS */}
      <AdminModal 
        isOpen={modalType === 'user'} 
        onClose={closeModal} 
        title={modalMode === 'add' ? 'Registrar Usuario' : 'Editar Usuario'}
      >
        <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="admin-input-group">
            <label>Nombres</label>
            <input value={formData.nombres || ''} onChange={e => setFormData({...formData, nombres: e.target.value})} required />
          </div>
          <div className="admin-input-group">
            <label>Apellidos</label>
            <input value={formData.apellidos || ''} onChange={e => setFormData({...formData, apellidos: e.target.value})} required />
          </div>
          <div className="admin-input-group">
            <label>DNI</label>
            <input value={formData.dni || ''} onChange={e => setFormData({...formData, dni: e.target.value})} required maxLength={20} />
          </div>
          <div className="admin-input-group">
            <label>Correo Institucional/Personal</label>
            <input type="email" value={formData.correo || ''} onChange={e => setFormData({...formData, correo: e.target.value})} required />
          </div>
          <div className="admin-input-group">
            <label>Teléfono</label>
            <input value={formData.telefono || ''} onChange={e => setFormData({...formData, telefono: e.target.value})} />
          </div>
          <div className="admin-input-group">
            <label>Rol (Enum rol_usuario)</label>
            <select value={formData.rol || 'ciudadano'} onChange={e => setFormData({...formData, rol: e.target.value})}>
              <option value="ciudadano">ciudadano</option>
              <option value="administrador">administrador</option>
              <option value="autoridad">autoridad</option>
            </select>
          </div>
          {modalMode === 'add' && (
            <div className="admin-input-group" style={{ gridColumn: 'span 2' }}>
              <label>Contraseña (contraseña_hash)</label>
              <input type="password" value={formData.contraseña_hash || ''} onChange={e => setFormData({...formData, contraseña_hash: e.target.value})} required />
            </div>
          )}
          <div style={{ gridColumn: 'span 2', display: 'flex', gap: '12px', marginTop: '16px' }}>
            <Button type="submit" style={{ flex: 2, backgroundColor: '#1e293b', color: 'white' }}>Guardar Registro</Button>
            <Button onClick={closeModal} style={{ flex: 1, backgroundColor: '#f1f5f9' }}>Cancelar</Button>
          </div>
        </form>
      </AdminModal>

      {/* MODAL 2: GESTIÓN DE ORGANIZACIONES */}
      <AdminModal 
        isOpen={modalType === 'org'} 
        onClose={closeModal} 
        title="Nueva Organización"
      >
        <form onSubmit={handleSave} style={{ display: 'grid', gap: '20px' }}>
          <div className="admin-input-group">
            <label>Nombre de la Entidad (ej. Comisaría Cusco)</label>
            <input value={formData.nombre || ''} onChange={e => setFormData({...formData, nombre: e.target.value})} required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="admin-input-group">
              <label>Correo de Contacto</label>
              <input type="email" value={formData.correo_contacto || ''} onChange={e => setFormData({...formData, correo_contacto: e.target.value})} required />
            </div>
            <div className="admin-input-group">
              <label>Número de Contacto</label>
              <input value={formData.numero_contacto || ''} onChange={e => setFormData({...formData, numero_contacto: e.target.value})} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <Button type="submit" style={{ flex: 1, backgroundColor: '#4f46e5', color: 'white' }}>Crear Organización</Button>
            <Button onClick={closeModal} style={{ backgroundColor: '#f1f5f9' }}>Cancelar</Button>
          </div>
        </form>
      </AdminModal>

      {/* MODAL 3: ASIGNAR AUTORIDAD (Tabla autoridades_detalle) */}
      <AdminModal 
        isOpen={modalType === 'auth'} 
        onClose={closeModal} 
        title="Asignar Autoridad a Entidad"
      >
        <form onSubmit={handleSave} style={{ display: 'grid', gap: '20px' }}>
          <div className="admin-input-group">
            <label>Seleccionar Usuario (Solo con rol 'autoridad')</label>
            <select value={formData.usuario_id || ''} onChange={e => setFormData({...formData, usuario_id: e.target.value})} required>
              <option value="">-- Seleccione un usuario --</option>
              {users.filter(u => u.rol === 'autoridad').map(u => (
                <option key={u.id} value={u.id}>{u.nombres} {u.apellidos} (DNI: {u.dni})</option>
              ))}
            </select>
          </div>
          <div className="admin-input-group">
            <label>Cargo Específico (ej. Jefe de Operaciones)</label>
            <input value={formData.cargo || ''} onChange={e => setFormData({...formData, cargo: e.target.value})} required />
          </div>
          <Button type="submit" style={{ backgroundColor: '#1e293b', color: 'white' }}>Confirmar Asignación</Button>
        </form>
      </AdminModal>

      {/* MODAL 4: CONFIRMACIÓN DE ELIMINACIÓN */}
      <AdminModal isOpen={modalType === 'delete'} onClose={closeModal} title="Atención: Acción Requerida">
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </div>
          <h3>¿Confirmar baja del registro?</h3>
          <p style={{ color: '#64748b' }}>
            {deleteTarget === 'user' 
              ? 'El usuario será marcado como "inactivo" y no podrá iniciar sesión.' 
              : 'Se eliminará el vínculo de la autoridad con esta organización.'}
          </p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button onClick={handleDelete} style={{ flex: 1, padding: '12px', border: 'none', borderRadius: '8px', backgroundColor: '#dc2626', color: 'white', fontWeight: 700, cursor: 'pointer' }}>Sí, confirmar</button>
            <button onClick={closeModal} style={{ flex: 1, padding: '12px', border: 'none', borderRadius: '8px', backgroundColor: '#f1f5f9', fontWeight: 600, cursor: 'pointer' }}>No, cancelar</button>
          </div>
        </div>
      </AdminModal>

      {/* MODAL 5: ÉXITO */}
      <AdminModal isOpen={successModalOpen} onClose={() => setSuccessModalOpen(false)} title="Operación Exitosa">
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ color: '#059669', marginBottom: '16px' }}>
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>{successMessage}</p>
          <Button onClick={() => setSuccessModalOpen(false)} style={{ backgroundColor: '#059669', color: 'white', marginTop: '20px', width: '100%' }}>Aceptar</Button>
        </div>
      </AdminModal>

    </div>
  );
}