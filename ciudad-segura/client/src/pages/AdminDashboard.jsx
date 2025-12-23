import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import StatCard from '../components/StatCard';
import AdminSidebar from '../components/AdminSidebar';
import AdminModal from '../components/AdminModal';
import { adminService } from '../services/api';

export default function AdminDashboard({ onLogout }) {
  // --- ESTADOS ---
  const [users, setUsers] = useState([]);
  const [orgs, setOrgs] = useState([]);
  const [authorities, setAuthorities] = useState([]);
  const [statistics, setStatistics] = useState(null);
  
  const [activeTab, setActiveTab] = useState('users');
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Estados de Modal
  const [modalType, setModalType] = useState(null);
  const [modalMode, setModalMode] = useState('add'); 
  const [currentItem, setCurrentItem] = useState(null); 
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formData, setFormData] = useState({});

  // Modal de éxito
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // --- CARGAR DATOS ---
  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedOrg) {
      loadAuthoritiesByOrg(selectedOrg.id);
    }
  }, [selectedOrg]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, usersRes, orgsRes, authRes] = await Promise.all([
        adminService.getStatistics(),
        adminService.getUsers(),
        adminService.getOrganizations(),
        adminService.getAuthorities()
      ]);

      if (statsRes.success) setStatistics(statsRes.data);
      if (usersRes.success) setUsers(usersRes.data);
      if (orgsRes.success) setOrgs(orgsRes.data);
      if (authRes.success) setAuthorities(authRes.data);
    } catch (error) {
      console.error('Error cargando datos admin:', error);
      alert('Error cargando datos del panel');
    } finally {
      setIsLoading(false);
    }
  };

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

  // --- HANDLERS MODALES ---
  const openModal = (type, mode, item = null) => {
    setModalType(type);
    setModalMode(mode);
    setCurrentItem(item);
    
    if (type === 'user') {
      setFormData(item || {
        name: '',
        lastName: '',
        dni: '',
        email: '',
        phone: '',
        password: '',
        role: 'Ciudadano',
        status: 'Activo',
        orgId: '',
        cargo: ''
      });
    } else if (type === 'auth') {
      setFormData(item || { name: '', cargo: '', status: 'Activo', orgId: selectedOrg?.id });
    } else if (type === 'org') {
      setFormData(item || {
        name: '',
        contactEmail: '',
        contactPhone: ''
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

  // --- CRUD OPERACIONES ---
  const handleSave = async (e) => {
    e.preventDefault();
    
    try {
      if (modalType === 'user') {
        if (modalMode === 'add') {
          showSuccess('Función de creación de usuario desde admin pendiente');
        } else {
          const response = await adminService.updateUser(currentItem.id, formData);
          if (response.success) {
            setUsers(users.map(u => u.id === currentItem.id ? response.data : u));
            showSuccess('Usuario actualizado exitosamente');
          }
        }
      }
      else if (modalType === 'auth') {
        if (modalMode === 'add') {
          const response = await adminService.createAuthority({
            ...formData,
            orgId: selectedOrg.id
          });
          if (response.success) {
            setAuthorities([...authorities, response.data]);
            showSuccess('Autoridad creada exitosamente');
          }
        } else {
          const response = await adminService.updateAuthority(currentItem.id, formData);
          if (response.success) {
            setAuthorities(authorities.map(a => a.id === currentItem.id ? response.data : a));
            showSuccess('Autoridad actualizada exitosamente');
          }
        }
      }
      else if (modalType === 'org') {
        if (modalMode === 'add') {
          const response = await adminService.createOrganization(formData);
          if (response.success) {
            setOrgs([...orgs, response.data]);
            showSuccess('Organización creada exitosamente');
          }
        }
      }
      
      closeModal();
      if (selectedOrg) {
        loadAuthoritiesByOrg(selectedOrg.id);
      } else {
        loadData();
      }
    } catch (error) {
      console.error('Error guardando:', error);
      alert('Error al guardar: ' + (error.message || 'Desconocido'));
    }
  };

  const handleDelete = async () => {
    try {
      if (deleteTarget === 'user') {
        const response = await adminService.deleteUser(currentItem.id);
        if (response.success) {
          setUsers(users.filter(u => u.id !== currentItem.id));
          showSuccess('Usuario marcado como inactivo');
        }
      }
      if (deleteTarget === 'auth') {
        const response = await adminService.deleteAuthority(currentItem.id);
        if (response.success) {
          setAuthorities(authorities.filter(a => a.id !== currentItem.id));
          showSuccess('Autoridad eliminada exitosamente');
        }
      }
      closeModal();
    } catch (error) {
      console.error('Error eliminando:', error);
      alert('Error al eliminar');
    }
  };

  // --- RENDERS ---
  const renderUsers = () => (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--deep-blue)', margin: 0, fontWeight: 700 }}>Directorio de Ciudadanos</h2>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)' }}>Gestiona el acceso y estado de los usuarios.</p>
        </div>
        <Button 
          onClick={() => openModal('user', 'add')} 
          style={{ backgroundColor: 'var(--deep-blue)', color: 'white' }}
        >
          + Nuevo Usuario
        </Button>
      </div>
      
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Cargando usuarios...</p>
        </div>
      ) : (
        <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Estado</th>
                <th style={{ textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              // Ejemplo de cómo mostrar los nombres en la tabla de AdminDashboard.jsx
              {users.map((u) => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 600 }}>
                    {/* Si viene del back es u.nombres, si es manual u.name */}
                    {u.nombres ? `${u.nombres} ${u.apellidos}` : u.name}
                  </td>
                  <td>{u.correo || u.email}</td>
                  <td>{u.dni}</td>
                  <td>
                    <span className={`badge ${u.rol === 'administrador' ? 'admin' : 'user'}`}>
                      {u.rol}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderOrgList = () => (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--deep-blue)', margin: 0, fontWeight: 700 }}>Entidades y Organizaciones</h2>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)' }}>Selecciona una entidad para ver su personal.</p>
        </div>
        <Button 
          onClick={() => openModal('org', 'add')} 
          style={{ backgroundColor: 'var(--vibrant-blue)', color: 'white' }}
        >
          + Nueva Organización
        </Button>
      </div>
      
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Cargando organizaciones...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {orgs.map(org => {
            const orgAuthorities = authorities.filter(a => a.orgId === org.id);
            return (
              <div 
                key={org.id} 
                onClick={() => setSelectedOrg(org)}
                className="card-hover-effect" 
                style={{ 
                  backgroundColor: 'white', 
                  borderRadius: '16px', 
                  border: '1px solid var(--border)', 
                  boxShadow: 'var(--shadow-sm)', 
                  cursor: 'pointer', 
                  padding: '24px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '16px', 
                  transition: '0.2s' 
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ 
                    width: '56px', 
                    height: '56px', 
                    borderRadius: '12px', 
                    backgroundColor: '#e0e7ff', 
                    color: '#4f46e5', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 21h18v-8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8z"></path>
                      <polyline points="9 10 9 21 15 21 15 10"></polyline>
                      <path d="M12 2L3 7v3h18V7L12 2z"></path>
                    </svg>
                  </div>
                  <span style={{ 
                    backgroundColor: '#f1f5f9', 
                    padding: '4px 10px', 
                    borderRadius: '20px', 
                    fontSize: '0.75rem', 
                    fontWeight: 700, 
                    color: 'var(--text-muted)' 
                  }}>
                    {orgAuthorities.length} Autoridades
                  </span>
                </div>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', color: 'var(--deep-blue)' }}>
                    {org.name}
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Ver personal →
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  // VISTA DETALLADA DE ORGANIZACIÓN (SIN BOTÓN DE AÑADIR NI ACCIONES)
  const renderOrgDetails = () => (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div style={{ marginBottom: '24px' }}>
        <button 
          onClick={() => setSelectedOrg(null)} 
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            color: 'var(--text-muted)', 
            fontSize: '0.95rem', 
            fontWeight: 600, 
            marginBottom: '16px' 
          }}
        >
          ← Volver a organizaciones
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            borderRadius: '12px', 
            backgroundColor: '#e0e7ff', 
            color: '#4f46e5', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 21h18v-8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8z"></path>
              <polyline points="9 10 9 21 15 21 15 10"></polyline>
              <path d="M12 2L3 7v3h18V7L12 2z"></path>
            </svg>
          </div>
          <div>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--deep-blue)', margin: 0, fontWeight: 700 }}>
              {selectedOrg.name}
            </h2>
            <p style={{ margin: '8px 0 0 0', color: 'var(--text-muted)', fontSize: '1rem' }}>
              Personal de la organización
            </p>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Cargando autoridades...</p>
        </div>
      ) : (
        <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Cargo</th>
              </tr>
            </thead>
            <tbody>
              {authorities.filter(a => a.orgId === selectedOrg.id).map(auth => (
                <tr key={auth.id}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 0' }}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%', 
                      backgroundColor: '#f1f5f9', 
                      color: 'var(--deep-blue)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontWeight: 'bold', 
                      fontSize: '1rem' 
                    }}>
                      {auth.name.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{auth.name}</span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                    {auth.cargo || '—'}
                  </td>
                </tr>
              ))}
              {authorities.filter(a => a.orgId === selectedOrg.id).length === 0 && (
                <tr>
                  <td colSpan="2" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No hay autoridades registradas en esta organización.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f3f6f8' }}>
      
      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={onLogout} 
        resetSelection={() => setSelectedOrg(null)} 
      />

      <main style={{ flex: 1, marginLeft: '280px', padding: '40px' }}>
        {!selectedOrg && (
          <div style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: '1.8rem', color: 'var(--deep-blue)', margin: '0 0 24px 0', fontWeight: 800 }}>
              Panel de Control
            </h1>
            
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p>Cargando estadísticas...</p>
              </div>
            ) : statistics && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
                <StatCard title="Usuarios Totales" value={statistics.totalUsers} color="#4f46e5" />
                <StatCard title="Organizaciones" value={statistics.totalOrganizations} color="#059669" />
                <StatCard title="Autoridades Activas" value={statistics.totalAuthorities} color="#d97706" />
                <StatCard title="Denuncias Activas" value={statistics.activeComplaints} color="#dc2626" />
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && renderUsers()}
        {activeTab === 'authorities' && (selectedOrg ? renderOrgDetails() : renderOrgList())}
      </main>

      {/* --- FORMULARIOS MODALES --- */}
      
      {/* 1. Modal Usuario */}
      <AdminModal 
        isOpen={modalType === 'user'} 
        onClose={closeModal} 
        title={modalMode === 'add' ? 'Nuevo Usuario' : 'Editar Usuario'}
        footer={
          <>
            <button onClick={closeModal} className="cancel-btn">Cancelar</button>
            <button onClick={handleSave} className="save-btn">Guardar</button>
          </>
        }
      >
        <form onSubmit={handleSave} style={{ display: 'grid', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="admin-input-group">
              <label>Nombre</label>
              <input 
                value={formData.name || ''} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                required
              />
            </div>
            <div className="admin-input-group">
              <label>Apellido</label>
              <input 
                value={formData.lastName || ''} 
                onChange={e => setFormData({...formData, lastName: e.target.value})} 
                required
              />
            </div>
            <div className="admin-input-group">
              <label>DNI</label>
              <input 
                value={formData.dni || ''} 
                onChange={e => setFormData({...formData, dni: e.target.value})} 
                required
              />
            </div>
            <div className="admin-input-group">
              <label>Correo</label>
              <input 
                type="email"
                value={formData.email || ''} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
                required
              />
            </div>
            <div className="admin-input-group">
              <label>Teléfono</label>
              <input 
                value={formData.phone || ''} 
                onChange={e => setFormData({...formData, phone: e.target.value})} 
              />
            </div>
            {modalMode === 'add' && (
              <div className="admin-input-group">
                <label>Contraseña</label>
                <input 
                  type="password"
                  value={formData.password || ''} 
                  onChange={e => setFormData({...formData, password: e.target.value})} 
                  required
                />
              </div>
            )}
            <div className="admin-input-group">
              <label>Rol</label>
              <select 
                value={formData.role || 'Ciudadano'} 
                onChange={e => setFormData({...formData, role: e.target.value})}
              >
                <option value="Ciudadano">Ciudadano</option>
                <option value="Autoridad">Autoridad</option>
                <option value="Administrador">Administrador</option>
              </select>
            </div>
            <div className="admin-input-group">
              <label>Estado</label>
              <select 
                value={formData.status || 'Activo'} 
                onChange={e => setFormData({...formData, status: e.target.value})}
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
          </div>
          {formData.role === 'Autoridad' && (
            <div style={{ marginTop: '8px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
              <h4 style={{ margin: '0 0 12px 0', color: 'var(--deep-blue)', fontSize: '1rem' }}>
                Datos de Autoridad
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="admin-input-group">
                  <label>Organización</label>
                  <select 
                    value={formData.orgId || ''} 
                    onChange={e => setFormData({...formData, orgId: e.target.value})}
                    required
                  >
                    <option value="">Seleccionar organización</option>
                    {orgs.map(org => (
                      <option key={org.id} value={org.id}>{org.name}</option>
                    ))}
                  </select>
                </div>
                <div className="admin-input-group">
                  <label>Cargo</label>
                  <input 
                    value={formData.cargo || ''} 
                    onChange={e => setFormData({...formData, cargo: e.target.value})} 
                    placeholder="Ej. Jefe de Seguridad"
                    required
                  />
                </div>
              </div>
            </div>
          )}
        </form>
      </AdminModal>

      {/* 2. Modal Autoridad */}
      <AdminModal 
        isOpen={modalType === 'auth'} 
        onClose={closeModal} 
        title={modalMode === 'add' ? 'Añadir Autoridad' : 'Editar Autoridad'}
        footer={
          <>
            <button onClick={closeModal} className="cancel-btn">Cancelar</button>
            <button onClick={handleSave} className="save-btn">Guardar</button>
          </>
        }
      >
        <form onSubmit={handleSave}>
          <div className="admin-input-group">
            <label>Nombre</label>
            <input 
              value={formData.name || ''} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
            />
          </div>
          <div className="admin-input-group">
            <label>Cargo</label>
            <input 
              value={formData.cargo || ''} 
              onChange={e => setFormData({...formData, cargo: e.target.value})} 
            />
          </div>
          <div className="admin-input-group">
            <label>Estado</label>
            <select 
              value={formData.status || 'Activo'} 
              onChange={e => setFormData({...formData, status: e.target.value})}
            >
              <option>Activo</option>
              <option>Inactivo</option>
              <option>Vacaciones</option>
            </select>
          </div>
        </form>
      </AdminModal>

      {/* 3. Modal Organización - Actualizado con nuevos campos */}
      <AdminModal 
        isOpen={modalType === 'org'} 
        onClose={closeModal} 
        title={modalMode === 'add' ? 'Nueva Organización' : 'Editar Organización'}
        footer={
          <>
            <button onClick={closeModal} className="cancel-btn">Cancelar</button>
            <button onClick={handleSave} className="save-btn">Crear</button>
          </>
        }
      >
        <form onSubmit={handleSave} style={{ display: 'grid', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="admin-input-group">
              <label>Nombre de la Organización</label>
              <input 
                value={formData.name || ''} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                placeholder="Ej. Comisaría Central"
                required
              />
            </div>
            <div className="admin-input-group">
              <label>Correo de Contacto</label>
              <input 
                type="email"
                value={formData.contactEmail || ''} 
                onChange={e => setFormData({...formData, contactEmail: e.target.value})} 
                placeholder="ejemplo@organizacion.gob"
                required
              />
            </div>
            <div className="admin-input-group">
              <label>Número de Contacto</label>
              <input 
                value={formData.contactPhone || ''} 
                onChange={e => setFormData({...formData, contactPhone: e.target.value})} 
                placeholder="+51 999 888 777"
              />
            </div>
            {/* Espacio vacío para equilibrar */}
            <div></div>
          </div>
          <div style={{ marginTop: '12px' }}>
            <button
              type="button"
              onClick={() => alert('Funcionalidad de mapa en desarrollo. Pronto podrás marcar la ubicación en un mapa interactivo.')}
              style={{
                width: '100%',
                padding: '14px 20px',
                backgroundColor: '#f1f5f9',
                border: '2px dashed #94a3b8',
                borderRadius: '12px',
                color: '#475569',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: '0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#e2e8f0'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#f1f5f9'}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              Marcar ubicación en el mapa
            </button>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '8px 0 0 0', textAlign: 'center' }}>
              Próximamente: selecciona la ubicación exacta con un clic en el mapa.
            </p>
          </div>
        </form>
      </AdminModal>

      {/* 4. Modal Eliminar */}
      <AdminModal 
        isOpen={modalType === 'delete'} 
        onClose={closeModal}
        title="Confirmar Eliminación"
        footer={
          <>
            <button onClick={closeModal} className="cancel-btn">Cancelar</button>
            <button onClick={handleDelete} className="delete-btn-confirm">
              {deleteTarget === 'user' ? 'Desactivar Usuario' : 'Eliminar Autoridad'}
            </button>
          </>
        }
      >
        <div style={{textAlign:'center'}}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            margin: '0 auto 20px', 
            backgroundColor: '#fee2e2', 
            color: '#dc2626', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18"></path>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </div>
          <h3 style={{color:'#991b1b', marginTop:0, marginBottom: '10px'}}>¿Estás seguro?</h3>
          <p style={{color: 'var(--text-muted)', marginBottom: 0}}>
            {deleteTarget === 'user' 
              ? 'El usuario será marcado como inactivo y no podrá acceder al sistema.' 
              : 'Esta acción es irreversible. La autoridad será eliminada permanentemente.'}
          </p>
        </div>
      </AdminModal>

      {/* Nuevo Modal de Éxito (ventana emergente para todas las operaciones) */}
      <AdminModal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        title="Operación Exitosa"
        width="500px" // Más pequeño para mensajes de éxito
      >
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" style={{ marginBottom: '16px' }}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '20px' }}>
            {successMessage}
          </p>
          <Button onClick={() => setSuccessModalOpen(false)} style={{ backgroundColor: '#059669', color: 'white' }}>
            Cerrar
          </Button>
        </div>
      </AdminModal>

    </div>
  );
}