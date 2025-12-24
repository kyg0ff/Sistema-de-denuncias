import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import StatCard from '../components/StatCard';
import AdminSidebar from '../components/AdminSidebar';
import AdminModal from '../components/AdminModal';
import { adminService } from '../services/api';

/**
 * DASHBOARD DE ADMINISTRACIÓN - Versión Completa con Estilos y Lógica Sincronizada
 */
export default function AdminDashboard({ onLogout }) {
  // --- 1. ESTADOS DE DATOS ---
  const [users, setUsers] = useState([]);         
  const [orgs, setOrgs] = useState([]);           
  const [authorities, setAuthorities] = useState([]); 
  const [statistics, setStatistics] = useState(null); 
  const [availablePersonnel, setAvailablePersonnel] = useState([]); // Para el filtro de asignación
  
  // --- 2. ESTADOS DE NAVEGACIÓN Y UI ---
  const [activeTab, setActiveTab] = useState('users'); 
  const [selectedOrg, setSelectedOrg] = useState(null); 
  const [isLoading, setIsLoading] = useState(true);

  // --- 3. ESTADOS DE GESTIÓN (MODALES) ---
  const [modalType, setModalType] = useState(null);   
  const [modalMode, setModalMode] = useState('add');  
  const [currentItem, setCurrentItem] = useState(null); 
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formData, setFormData] = useState({});       

  // --- 4. FEEDBACK ---
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // --- CICLO DE VIDA ---
  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedOrg) {
      loadAuthoritiesByOrg(selectedOrg.id);
    }
  }, [selectedOrg]);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
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

  const loadAuthoritiesByOrg = async (orgId) => {
    try {
      const response = await adminService.getAuthoritiesByOrg(orgId);
      if (response.success) setAuthorities(response.data);
    } catch (error) {
      console.error('Error cargando autoridades:', error);
    }
  };

  // --- MANEJO DE MODALES ---
  const openModal = async (type, mode, item = null) => {
    setModalType(type);
    setModalMode(mode);
    setCurrentItem(item);
    
    if (type === 'user') {
      setFormData(item || {
        dni: '', nombres: '', apellidos: '', correo: '', telefono: '', 
        contraseña_hash: '', rol: 'ciudadano', estado: 'activo'
      });
    } else if (type === 'auth') {
      // Cargamos solo autoridades "libres" para el selector
      try {
        const response = await adminService.getAvailableAuthorities();
        if (response.success) setAvailablePersonnel(response.data);
      } catch (e) { console.error("Error al cargar disponibles"); }
      
      setFormData({ usuario_id: '', organizacion_id: selectedOrg?.id, cargo: '' });
    } else if (type === 'org') {
      setFormData(item || {
        nombre: '', correo_contacto: '', numero_contacto: '',
        ubicacion: { lat: -13.5167, lng: -71.9781 }
      });
    } else if (type === 'delete') {
      setDeleteTarget(mode);
    }
  };

  const closeModal = () => { 
    setModalType(null); setFormData({}); setCurrentItem(null); setDeleteTarget(null);
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setSuccessModalOpen(true);
  };

  // --- OPERACIONES ---
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (modalType === 'user') {
        if (modalMode === 'add') {
          const res = await adminService.createUser(formData);
          if (res.success) { setUsers([...users, res.data]); showSuccess('Usuario creado'); }
        } else {
          const res = await adminService.updateUser(currentItem.id, formData);
          if (res.success) {
            setUsers(users.map(u => u.id === currentItem.id ? res.data : u));
            showSuccess('Usuario actualizado');
          }
        }
      } else if (modalType === 'auth') {
        const res = await adminService.assignAuthority(formData);
        if (res.success) { loadAuthoritiesByOrg(selectedOrg.id); showSuccess('Personal asignado'); }
      } else if (modalType === 'org') {
        const res = await adminService.createOrganization(formData);
        if (res.success) { setOrgs([...orgs, res.data]); showSuccess('Organización creada'); }
      }
      closeModal();
      loadInitialData();
    } catch (error) { alert('Error: ' + error.message); }
  };

  const handleToggleStatus = async (user, newStatus) => {
    try {
      const res = await adminService.updateUser(user.id, { ...user, estado: newStatus });
      if (res.success) {
        setUsers(users.map(u => u.id === user.id ? res.data : u));
        showSuccess(`Usuario ${newStatus === 'activo' ? 'activado' : 'desactivado'}`);
      }
    } catch (e) { alert('Error al cambiar estado'); }
  };

  const handleDelete = async () => {
    try {
      if (deleteTarget === 'user') {
        const res = await adminService.deleteUser(currentItem.id);
        if (res.success) {
          setUsers(users.map(u => u.id === currentItem.id ? { ...u, estado: 'inactivo' } : u));
          showSuccess('Usuario desactivado');
        }
      }
      closeModal();
    } catch (e) { alert('No se pudo completar la acción'); }
  };

  // --- RENDERS CON ESTILOS COMPLETOS ---

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
      
      <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '16px', textAlign: 'left' }}>Nombre y Apellidos</th>
              <th>DNI</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Estado</th>
              <th style={{ textAlign: 'right', paddingRight: '24px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9', opacity: u.estado === 'inactivo' ? 0.7 : 1 }}>
                <td style={{ padding: '16px', fontWeight: 600 }}>{`${u.nombres} ${u.apellidos}`}</td>
                <td>{u.dni}</td>
                <td>{u.correo}</td>
                <td><span className={`badge ${u.rol}`}>{u.rol.toUpperCase()}</span></td>
                <td>
                  <span style={{ 
                    padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 800,
                    backgroundColor: u.estado === 'activo' ? '#dcfce7' : '#fee2e2',
                    color: u.estado === 'activo' ? '#166534' : '#991b1b'
                  }}>
                    {u.estado ? u.estado.toUpperCase() : 'ACTIVO'}
                  </span>
                </td>
                <td style={{ textAlign: 'right', paddingRight: '24px' }}>
                  <button onClick={() => openModal('user', 'edit', u)} style={{ marginRight: '12px', color: '#4f46e5', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>Editar</button>
                  {u.estado === 'inactivo' ? (
                    <button onClick={() => handleToggleStatus(u, 'activo')} style={{ color: '#059669', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>Reactivar</button>
                  ) : (
                    <button onClick={() => openModal('delete', 'user', u)} style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer' }}>Baja</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOrgList = () => (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--deep-blue)', fontWeight: 700 }}>Entidades del Sistema</h2>
          <p style={{ color: 'var(--text-muted)' }}>Organizaciones vinculadas a la seguridad ciudadana.</p>
        </div>
        <Button onClick={() => openModal('org', 'add')} style={{ backgroundColor: 'var(--vibrant-blue)', color: 'white' }}>+ Nueva Organización</Button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {orgs.map(org => (
          <div key={org.id} onClick={() => setSelectedOrg(org)} className="card-hover-effect" style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid var(--border)', padding: '24px', cursor: 'pointer', transition: 'all 0.2s' }}>
            <div style={{ width: '48px', height: '48px', backgroundColor: '#e0e7ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5', marginBottom: '16px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18v-8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8z"></path><path d="M12 2L3 7v3h18V7L12 2z"></path></svg>
            </div>
            <h3 style={{ margin: '0 0 4px 0', color: 'var(--deep-blue)' }}>{org.nombre}</h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{org.correo_contacto}</p>
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f1f5f9', fontSize: '0.8rem', color: '#4f46e5', fontWeight: 600 }}>Ver personal asignado →</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderOrgDetails = () => (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <button onClick={() => setSelectedOrg(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
        ← Volver a Entidades
      </button>
      <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '32px', border: '1px solid var(--border)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
        <div className="flex-between" style={{ marginBottom: '32px' }}>
          <div>
            <h2 style={{ margin: 0, color: 'var(--deep-blue)', fontSize: '1.8rem' }}>{selectedOrg.nombre}</h2>
            <p style={{ color: 'var(--text-muted)' }}>Personal con acceso autorizado a esta organización.</p>
          </div>
          <Button onClick={() => openModal('auth', 'add')} style={{ backgroundColor: 'var(--deep-blue)', color: 'white' }}>Asignar Nuevo Personal</Button>
        </div>
        
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ paddingBottom: '16px', borderBottom: '2px solid #f1f5f9' }}>Nombre del Personal</th>
              <th style={{ paddingBottom: '16px', borderBottom: '2px solid #f1f5f9' }}>Cargo / Función</th>
              <th style={{ paddingBottom: '16px', borderBottom: '2px solid #f1f5f9', textAlign: 'right' }}>Estado del Vínculo</th>
            </tr>
          </thead>
          <tbody>
            {authorities.map(auth => (
              <tr key={auth.usuario_id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '20px 0', fontWeight: 600, color: '#1e293b' }}>{auth.nombres} {auth.apellidos}</td>
                <td style={{ color: '#64748b' }}>{auth.cargo}</td>
                <td style={{ textAlign: 'right' }}>
                  <span style={{ color: '#059669', fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#dcfce7', padding: '4px 12px', borderRadius: '12px' }}>ACTIVO</span>
                </td>
              </tr>
            ))}
            {authorities.length === 0 && (
              <tr><td colSpan="3" style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Esta entidad aún no tiene personal asignado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} resetSelection={() => setSelectedOrg(null)} />

      <main style={{ flex: 1, marginLeft: '280px', padding: '40px' }}>
        {!selectedOrg && statistics && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
            <StatCard title="Total Denuncias" value={statistics.total_denuncias} color="#4f46e5" icon="📋" />
            <StatCard title="Resueltas" value={statistics.denuncias_resueltas} color="#059669" icon="✅" />
            <StatCard title="Usuarios" value={users.length} color="#d97706" icon="👥" />
            <StatCard title="Entidades" value={orgs.length} color="#7c3aed" icon="🏛️" />
          </div>
        )}

        {activeTab === 'users' && renderUsers()}
        {activeTab === 'authorities' && (selectedOrg ? renderOrgDetails() : renderOrgList())}
      </main>

      {/* --- MODALES --- */}

      <AdminModal isOpen={modalType === 'user'} onClose={closeModal} title={modalMode === 'add' ? 'Registrar Nuevo Usuario' : 'Editar Información de Usuario'}>
        <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="admin-input-group"><label>Nombres</label><input value={formData.nombres || ''} onChange={e => setFormData({...formData, nombres: e.target.value})} required /></div>
          <div className="admin-input-group"><label>Apellidos</label><input value={formData.apellidos || ''} onChange={e => setFormData({...formData, apellidos: e.target.value})} required /></div>
          <div className="admin-input-group"><label>DNI</label><input value={formData.dni || ''} onChange={e => setFormData({...formData, dni: e.target.value})} required /></div>
          <div className="admin-input-group"><label>Correo Electrónico</label><input type="email" value={formData.correo || ''} onChange={e => setFormData({...formData, correo: e.target.value})} required /></div>
          <div className="admin-input-group"><label>Teléfono</label><input value={formData.telefono || ''} onChange={e => setFormData({...formData, telefono: e.target.value})} /></div>
          <div className="admin-input-group"><label>Rol en el Sistema</label>
            <select value={formData.rol || 'ciudadano'} onChange={e => setFormData({...formData, rol: e.target.value})}>
              <option value="ciudadano">Ciudadano</option>
              <option value="administrador">Administrador</option>
              <option value="autoridad">Autoridad</option>
            </select>
          </div>
          {modalMode === 'add' && (
            <div className="admin-input-group" style={{ gridColumn: 'span 2' }}><label>Contraseña Inicial</label><input type="password" value={formData.contraseña_hash || ''} onChange={e => setFormData({...formData, contraseña_hash: e.target.value})} required /></div>
          )}
          <Button type="submit" style={{ gridColumn: 'span 2', backgroundColor: 'var(--deep-blue)', color: 'white', marginTop: '10px' }}>Guardar Cambios</Button>
        </form>
      </AdminModal>

      <AdminModal isOpen={modalType === 'org'} onClose={closeModal} title="Nueva Organización">
        <form onSubmit={handleSave} style={{ display: 'grid', gap: '20px' }}>
          <div className="admin-input-group"><label>Nombre de la Entidad</label><input value={formData.nombre || ''} onChange={e => setFormData({...formData, nombre: e.target.value})} required /></div>
          <div className="admin-input-group"><label>Correo de Contacto Institucional</label><input type="email" value={formData.correo_contacto || ''} onChange={e => setFormData({...formData, correo_contacto: e.target.value})} required /></div>
          <div className="admin-input-group"><label>Teléfono / Central</label><input value={formData.numero_contacto || ''} onChange={e => setFormData({...formData, numero_contacto: e.target.value})} /></div>
          <Button type="submit" style={{ backgroundColor: 'var(--vibrant-blue)', color: 'white' }}>Registrar Entidad</Button>
        </form>
      </AdminModal>

      <AdminModal isOpen={modalType === 'auth'} onClose={closeModal} title="Asignar Personal a Organización">
        <form onSubmit={handleSave} style={{ display: 'grid', gap: '20px' }}>
          <div className="admin-input-group">
            <label>Seleccionar Autoridad (Solo personal sin asignar)</label>
            <select value={formData.usuario_id || ''} onChange={e => setFormData({...formData, usuario_id: e.target.value})} required>
              <option value="">-- Seleccione un usuario libre --</option>
              {availablePersonnel.map(u => (
                <option key={u.id} value={u.id}>{u.nombres} {u.apellidos} (DNI: {u.dni})</option>
              ))}
            </select>
            {availablePersonnel.length === 0 && <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '8px' }}>⚠️ No hay personal de rol 'autoridad' disponible para asignar.</p>}
          </div>
          <div className="admin-input-group"><label>Cargo o Título</label><input placeholder="Ej. Comisario, Jefe de Serenazgo..." value={formData.cargo || ''} onChange={e => setFormData({...formData, cargo: e.target.value})} required /></div>
          <Button type="submit" disabled={availablePersonnel.length === 0} style={{ backgroundColor: 'var(--deep-blue)', color: 'white' }}>Confirmar Asignación</Button>
        </form>
      </AdminModal>

      <AdminModal isOpen={modalType === 'delete'} onClose={closeModal} title="Confirmación de Seguridad">
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#dc2626', marginBottom: '20px' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          </div>
          <h3>¿Está seguro de desactivar al usuario?</h3>
          <p style={{ color: 'var(--text-muted)' }}>Esta acción restringirá el acceso del usuario inmediatamente, pero conservará sus datos históricos.</p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button onClick={handleDelete} style={{ flex: 1, padding: '12px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Sí, desactivar</button>
            <button onClick={closeModal} style={{ flex: 1, padding: '12px', backgroundColor: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Cancelar</button>
          </div>
        </div>
      </AdminModal>

      <AdminModal isOpen={successModalOpen} onClose={() => setSuccessModalOpen(false)} title="Operación Exitosa">
        <div style={{ textAlign: 'center', padding: '10px' }}>
          <div style={{ color: '#059669', marginBottom: '16px' }}>
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <p style={{ fontSize: '1.1rem', fontWeight: 500, color: '#1e293b' }}>{successMessage}</p>
          <Button onClick={() => setSuccessModalOpen(false)} style={{ backgroundColor: '#059669', color: 'white', marginTop: '20px', width: '100%' }}>Entendido</Button>
        </div>
      </AdminModal>
    </div>
  );
}