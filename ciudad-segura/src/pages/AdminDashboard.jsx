import React, { useState } from 'react';
import Button from '../components/Button';

// --- DATOS MOCK INICIALES ---
const INITIAL_USERS = [
  { id: 1, name: 'Juan Perez', email: 'juan@gmail.com', role: 'Ciudadano', status: 'Activo' },
  { id: 2, name: 'Maria Lopez', email: 'maria@outlook.com', role: 'Ciudadano', status: 'Activo' },
  { id: 3, name: 'Carlos Diaz', email: 'carlos@yahoo.com', role: 'Ciudadano', status: 'Baneado' },
  { id: 4, name: 'Lucia Mendez', email: 'lucia@gmail.com', role: 'Ciudadano', status: 'Activo' },
];

const INITIAL_ORGS = [
  { id: 1, name: 'Municipalidad de Wanchaq', type: 'Gobierno Local', color: '#4f46e5' },
  { id: 2, name: 'Policía de Tránsito', type: 'Seguridad', color: '#059669' },
  { id: 3, name: 'Fiscalización Ambiental', type: 'Salud/Ambiente', color: '#d97706' },
];

const INITIAL_AUTHORITIES = [
  { id: 1, name: 'Oficial Roberto Gómez', cargo: 'Jefe de Tránsito', orgId: 2, status: 'Activo' },
  { id: 2, name: 'Inspector Luis Alva', cargo: 'Supervisor de Vías', orgId: 1, status: 'Activo' },
  { id: 3, name: 'Ana Torres', cargo: 'Agente de Campo', orgId: 2, status: 'Vacaciones' },
  { id: 4, name: 'Ing. Marco Polo', cargo: 'Director Ambiental', orgId: 3, status: 'Activo' },
];

// COMPONENTE INTERNO: Tarjeta de Estadística
const StatCard = ({ title, value, icon, color }) => (
  <div style={{ 
    backgroundColor: 'white', borderRadius: '16px', padding: '24px', 
    boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', 
    gap: '20px', border: '1px solid var(--border)' 
  }}>
    <div style={{ 
      width: '56px', height: '56px', borderRadius: '12px', 
      backgroundColor: color + '20', color: color, 
      display: 'flex', alignItems: 'center', justifyContent: 'center' 
    }}>
      {icon}
    </div>
    <div>
      <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {title}
      </p>
      <h3 style={{ margin: 0, fontSize: '1.8rem', color: 'var(--deep-blue)', fontWeight: 800 }}>
        {value}
      </h3>
    </div>
  </div>
);

export default function AdminDashboard({ onLogout }) {
  // --- ESTADOS DE DATOS ---
  const [users, setUsers] = useState(INITIAL_USERS);
  const [orgs, setOrgs] = useState(INITIAL_ORGS); // <--- CORREGIDO: Añadido setOrgs
  const [authorities, setAuthorities] = useState(INITIAL_AUTHORITIES);
  
  const [activeTab, setActiveTab] = useState('users');
  const [selectedOrg, setSelectedOrg] = useState(null);

  // --- ESTADOS DE MODALES ---
  const [modalType, setModalType] = useState(null); // 'user', 'auth', 'org', 'delete'
  const [modalMode, setModalMode] = useState('add'); 
  const [currentItem, setCurrentItem] = useState(null); 
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formData, setFormData] = useState({});

  // --- HANDLERS: ABRIR MODALES ---

  // 1. Usuarios
  const openAddUser = () => { setModalType('user'); setModalMode('add'); setFormData({ name: '', email: '', role: 'Ciudadano', status: 'Activo' }); };
  const openEditUser = (u) => { setModalType('user'); setModalMode('edit'); setCurrentItem(u); setFormData({ ...u }); };
  const openDeleteUser = (u) => { setModalType('delete'); setDeleteTarget('user'); setCurrentItem(u); };

  // 2. Autoridades
  const openAddAuth = () => { setModalType('auth'); setModalMode('add'); setFormData({ name: '', cargo: '', status: 'Activo' }); };
  const openEditAuth = (a) => { setModalType('auth'); setModalMode('edit'); setCurrentItem(a); setFormData({ ...a }); };
  const openDeleteAuth = (a) => { setModalType('delete'); setDeleteTarget('auth'); setCurrentItem(a); };

  // 3. Organizaciones (NUEVO)
  const openAddOrg = () => { 
    setModalType('org'); 
    setModalMode('add'); 
    setFormData({ name: '', type: 'Gobierno Local', color: '#4f46e5' }); 
  };

  const closeModal = () => { setModalType(null); setFormData({}); setCurrentItem(null); };

  // --- HANDLERS: GUARDAR DATOS ---

  const handleSaveUser = (e) => {
    e.preventDefault();
    if (modalMode === 'add') setUsers([...users, { ...formData, id: Date.now() }]);
    else setUsers(users.map(u => u.id === currentItem.id ? { ...formData, id: u.id } : u));
    closeModal();
  };

  const handleSaveAuth = (e) => {
    e.preventDefault();
    if (modalMode === 'add') setAuthorities([...authorities, { ...formData, id: Date.now(), orgId: selectedOrg.id }]);
    else setAuthorities(authorities.map(a => a.id === currentItem.id ? { ...formData, id: a.id, orgId: selectedOrg.id } : a));
    closeModal();
  };

  // NUEVO: Guardar Organización
  const handleSaveOrg = (e) => {
    e.preventDefault();
    if (modalMode === 'add') {
      setOrgs([...orgs, { ...formData, id: Date.now() }]);
    }
    // Aquí podrías añadir lógica de edición si quisieras
    closeModal();
  };

  const handleConfirmDelete = () => {
    if (deleteTarget === 'user') setUsers(users.filter(u => u.id !== currentItem.id));
    else if (deleteTarget === 'auth') setAuthorities(authorities.filter(a => a.id !== currentItem.id));
    closeModal();
  };

  // --- RENDERIZADO ---

  const renderUsers = () => (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--deep-blue)', margin: 0, fontWeight: 700 }}>Directorio de Ciudadanos</h2>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)' }}>Gestiona el acceso y estado de los usuarios registrados.</p>
        </div>
        <Button onClick={openAddUser} style={{ backgroundColor: 'var(--deep-blue)', color: 'white' }}>+ Nuevo Usuario</Button>
      </div>
      <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)', overflow: 'hidden' }}>
        <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr><th>Usuario</th><th>Rol</th><th>Estado</th><th style={{ textAlign: 'right' }}>Acciones</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--soft-blue)', color: 'var(--deep-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>{u.name.charAt(0)}</div>
                  <div><div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{u.name}</div><div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{u.email}</div></div>
                </td>
                <td><span style={{ backgroundColor: '#f1f5f9', padding: '4px 10px', borderRadius: '6px', fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>{u.role}</span></td>
                <td><span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, backgroundColor: u.status === 'Activo' ? '#dcfce7' : '#fee2e2', color: u.status === 'Activo' ? '#166534' : '#991b1b' }}>{u.status}</span></td>
                <td style={{ textAlign: 'right' }}>
                  <button onClick={() => openEditUser(u)} className="action-btn edit">Editar</button>
                  <button onClick={() => openDeleteUser(u)} className="action-btn delete">Eliminar</button>
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
          <h2 style={{ fontSize: '1.5rem', color: 'var(--deep-blue)', margin: 0, fontWeight: 700 }}>Entidades y Organizaciones</h2>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)' }}>Selecciona una entidad para gestionar su personal.</p>
        </div>
        {/* BOTÓN CONECTADO */}
        <Button onClick={openAddOrg} style={{ backgroundColor: 'var(--vibrant-blue)', color: 'white' }}>+ Nueva Organización</Button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {orgs.map(org => {
          const count = authorities.filter(a => a.orgId === org.id).length;
          return (
            <div key={org.id} onClick={() => setSelectedOrg(org)} className="card-hover-effect" style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', cursor: 'pointer', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', transition: '0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '12px', backgroundColor: org.color + '15', color: org.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18v-8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8z"></path><polyline points="9 10 9 21 15 21 15 10"></polyline><path d="M12 2L3 7v3h18V7L12 2z"></path></svg></div>
                <span style={{ backgroundColor: '#f1f5f9', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>{count} Autoridades</span>
              </div>
              <div><h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', color: 'var(--deep-blue)' }}>{org.name}</h3><p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>{org.type}</p></div>
              <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #f1f5f9', color: 'var(--medium-blue)', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>Gestionar Personal →</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderOrgDetails = () => {
    const orgAuths = authorities.filter(a => a.orgId === selectedOrg.id);
    return (
      <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
        <div style={{ marginBottom: '24px' }}>
          <button onClick={() => setSelectedOrg(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 600, marginBottom: '16px' }}>← Volver a Organizaciones</button>
          <div className="flex-between">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
               <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: selectedOrg.color + '15', color: selectedOrg.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18v-8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8z"></path><polyline points="9 10 9 21 15 21 15 10"></polyline><path d="M12 2L3 7v3h18V7L12 2z"></path></svg></div>
               <div><h2 style={{ fontSize: '1.5rem', color: 'var(--deep-blue)', margin: 0, fontWeight: 700 }}>{selectedOrg.name}</h2><p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)' }}>Gestión de autoridades para {selectedOrg.type}</p></div>
            </div>
            <Button onClick={openAddAuth} style={{ backgroundColor: 'var(--deep-blue)', color: 'white' }}>+ Añadir Autoridad</Button>
          </div>
        </div>
        <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><th>Nombre</th><th>Cargo</th><th>Estado</th><th style={{ textAlign: 'right' }}>Acciones</th></tr></thead>
            <tbody>
              {orgAuths.length > 0 ? orgAuths.map(auth => (
                <tr key={auth.id}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#f1f5f9', color: 'var(--deep-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>{auth.name.charAt(0)}</div>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{auth.name}</span>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{auth.cargo}</td>
                  <td><span style={{ backgroundColor: auth.status === 'Activo' ? '#dcfce7' : '#fef9c3', color: auth.status === 'Activo' ? '#166534' : '#854d0e', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>{auth.status}</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <button onClick={() => openEditAuth(auth)} className="action-btn edit">Editar</button>
                    <button onClick={() => openDeleteAuth(auth)} className="action-btn delete">Remover</button>
                  </td>
                </tr>
              )) : <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No hay autoridades registradas en esta entidad.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f3f6f8' }}>
      
      {/* SIDEBAR */}
      <aside style={{ width: '280px', backgroundColor: 'var(--deep-blue)', color: 'white', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', zIndex: 10 }}>
        <div style={{ padding: '32px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.03em' }}>Admin<span style={{ color: 'var(--soft-blue)' }}>Panel</span></h2>
        </div>
        <nav style={{ flex: 1, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button onClick={() => { setActiveTab('users'); setSelectedOrg(null); }} className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg> Ciudadanos
          </button>
          <button onClick={() => { setActiveTab('authorities'); setSelectedOrg(null); }} className={`admin-nav-item ${activeTab === 'authorities' ? 'active' : ''}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line></svg> Organizaciones
          </button>
        </nav>
        <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button onClick={onLogout} className="logout-btn-admin" style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fca5a5', width: '100%', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg> Salir
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, marginLeft: '280px', padding: '40px' }}>
        {!selectedOrg && (
          <div style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: '1.8rem', color: 'var(--deep-blue)', margin: '0 0 24px 0', fontWeight: 800 }}>Panel de Control</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
              <StatCard title="Usuarios Totales" value={users.length} color="#4f46e5" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>} />
              <StatCard title="Organizaciones" value={orgs.length} color="#059669" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line></svg>} />
              <StatCard title="Autoridades Activas" value={authorities.length} color="#d97706" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>} />
            </div>
          </div>
        )}

        {activeTab === 'users' && renderUsers()}
        {activeTab === 'authorities' && (selectedOrg ? renderOrgDetails() : renderOrgList())}
      </main>

      {/* --- MODALES --- */}

      {/* 1. Usuario */}
      {modalType === 'user' && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal-content" onClick={e => e.stopPropagation()}>
            <h3>{modalMode === 'add' ? 'Nuevo Usuario' : 'Editar Usuario'}</h3>
            <form onSubmit={handleSaveUser}>
              <div className="admin-input-group"><label>Nombre</label><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required /></div>
              <div className="admin-input-group"><label>Correo</label><input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required /></div>
              <div className="admin-input-group"><label>Estado</label><select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}><option>Activo</option><option>Baneado</option></select></div>
              <div className="admin-modal-actions"><button type="button" onClick={closeModal} className="cancel-btn">Cancelar</button><button type="submit" className="save-btn">Guardar</button></div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Autoridad */}
      {modalType === 'auth' && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal-content" onClick={e => e.stopPropagation()}>
            <h3>{modalMode === 'add' ? 'Añadir Autoridad' : 'Editar Autoridad'}</h3>
            <form onSubmit={handleSaveAuth}>
              <div className="admin-input-group"><label>Nombre</label><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required /></div>
              <div className="admin-input-group"><label>Cargo</label><input type="text" value={formData.cargo} onChange={e => setFormData({...formData, cargo: e.target.value})} required /></div>
              <div className="admin-input-group"><label>Estado</label><select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}><option>Activo</option><option>Inactivo</option></select></div>
              <div className="admin-modal-actions"><button type="button" onClick={closeModal} className="cancel-btn">Cancelar</button><button type="submit" className="save-btn">Guardar</button></div>
            </form>
          </div>
        </div>
      )}

      {/* 3. ORGANIZACIÓN (NUEVO MODAL) */}
      {modalType === 'org' && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal-content" onClick={e => e.stopPropagation()}>
            <h3>Nueva Organización</h3>
            <form onSubmit={handleSaveOrg}>
              <div className="admin-input-group">
                <label>Nombre de la Entidad</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required placeholder="Ej. Comisaría Central" />
              </div>
              <div className="admin-input-group">
                <label>Tipo</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                  <option>Gobierno Local</option>
                  <option>Seguridad</option>
                  <option>Salud/Ambiente</option>
                  <option>Transporte</option>
                </select>
              </div>
              <div className="admin-input-group">
                <label>Color Distintivo</label>
                <select value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})}>
                  <option value="#4f46e5">Azul Índigo</option>
                  <option value="#059669">Verde Esmeralda</option>
                  <option value="#d97706">Ámbar</option>
                  <option value="#dc2626">Rojo Alerta</option>
                </select>
              </div>
              <div className="admin-modal-actions">
                <button type="button" onClick={closeModal} className="cancel-btn">Cancelar</button>
                <button type="submit" className="save-btn">Crear Entidad</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Eliminar */}
      {modalType === 'delete' && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal-content delete-modal" onClick={e => e.stopPropagation()}>
            <h3 style={{color:'#991b1b'}}>¿Confirmar eliminación?</h3>
            <p style={{marginBottom:'24px'}}>Se eliminará a <strong>{currentItem?.name}</strong> permanentemente.</p>
            <div className="admin-modal-actions"><button onClick={closeModal} className="cancel-btn">Cancelar</button><button onClick={handleConfirmDelete} className="delete-btn-confirm">Eliminar</button></div>
          </div>
        </div>
      )}

    </div>
  );
}