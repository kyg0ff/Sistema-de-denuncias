import React, { useState } from 'react';
import Button from '../components/Button';
import StatCard from '../components/StatCard';     // Componente Reutilizado
import AdminSidebar from '../components/AdminSidebar'; // Componente Reutilizado
import AdminModal from '../components/AdminModal';     // Componente Reutilizado

// --- DATOS MOCK ---
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

export default function AdminDashboard({ onLogout }) {
  // --- ESTADOS ---
  const [users, setUsers] = useState(INITIAL_USERS);
  const [orgs, setOrgs] = useState(INITIAL_ORGS);
  const [authorities, setAuthorities] = useState(INITIAL_AUTHORITIES);
  
  const [activeTab, setActiveTab] = useState('users');
  const [selectedOrg, setSelectedOrg] = useState(null);

  // Estados de Modal
  const [modalType, setModalType] = useState(null); // 'user', 'auth', 'org', 'delete'
  const [modalMode, setModalMode] = useState('add'); 
  const [currentItem, setCurrentItem] = useState(null); 
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formData, setFormData] = useState({});

  // --- HANDLERS MODALES ---
  const openModal = (type, mode, item = null) => {
    setModalType(type);
    setModalMode(mode);
    setCurrentItem(item);
    // Configurar datos iniciales según el caso
    if (type === 'user') setFormData(item || { name: '', email: '', role: 'Ciudadano', status: 'Activo' });
    if (type === 'auth') setFormData(item || { name: '', cargo: '', status: 'Activo' });
    if (type === 'org') setFormData(item || { name: '', type: 'Gobierno Local', color: '#4f46e5' });
    if (type === 'delete') setDeleteTarget(mode); // 'user' o 'auth'
  };

  const closeModal = () => { setModalType(null); setFormData({}); setCurrentItem(null); };

  // --- CRUD LOGIC ---
  const handleSave = (e) => {
    e.preventDefault();
    const id = Date.now();
    
    if (modalType === 'user') {
      if (modalMode === 'add') setUsers([...users, { ...formData, id }]);
      else setUsers(users.map(u => u.id === currentItem.id ? { ...formData, id: u.id } : u));
    }
    else if (modalType === 'auth') {
      if (modalMode === 'add') setAuthorities([...authorities, { ...formData, id, orgId: selectedOrg.id }]);
      else setAuthorities(authorities.map(a => a.id === currentItem.id ? { ...formData, id: a.id, orgId: selectedOrg.id } : a));
    }
    else if (modalType === 'org') {
      if (modalMode === 'add') setOrgs([...orgs, { ...formData, id }]);
    }
    closeModal();
  };

  const handleDelete = () => {
    if (deleteTarget === 'user') setUsers(users.filter(u => u.id !== currentItem.id));
    if (deleteTarget === 'auth') setAuthorities(authorities.filter(a => a.id !== currentItem.id));
    closeModal();
  };

  // --- RENDERS ---
  const renderUsers = () => (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <div><h2 style={{ fontSize: '1.5rem', color: 'var(--deep-blue)', margin: 0, fontWeight: 700 }}>Directorio de Ciudadanos</h2><p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)' }}>Gestiona el acceso y estado de los usuarios.</p></div>
        <Button onClick={() => openModal('user', 'add')} style={{ backgroundColor: 'var(--deep-blue)', color: 'white' }}>+ Nuevo Usuario</Button>
      </div>
      <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)', overflow: 'hidden' }}>
        <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr><th>Usuario</th><th>Rol</th><th>Estado</th><th style={{ textAlign: 'right' }}>Acciones</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--soft-blue)', color: 'var(--deep-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>{u.name.charAt(0)}</div><div><div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{u.name}</div><div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{u.email}</div></div></td>
                <td><span style={{ backgroundColor: '#f1f5f9', padding: '4px 10px', borderRadius: '6px', fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>{u.role}</span></td>
                <td><span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, backgroundColor: u.status === 'Activo' ? '#dcfce7' : '#fee2e2', color: u.status === 'Activo' ? '#166534' : '#991b1b' }}>{u.status}</span></td>
                <td style={{ textAlign: 'right' }}><button onClick={() => openModal('user', 'edit', u)} className="action-btn edit">Editar</button><button onClick={() => openModal('delete', 'user', u)} className="action-btn delete">Eliminar</button></td>
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
        <div><h2 style={{ fontSize: '1.5rem', color: 'var(--deep-blue)', margin: 0, fontWeight: 700 }}>Entidades y Organizaciones</h2><p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)' }}>Selecciona una entidad para gestionar su personal.</p></div>
        <Button onClick={() => openModal('org', 'add')} style={{ backgroundColor: 'var(--vibrant-blue)', color: 'white' }}>+ Nueva Organización</Button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {orgs.map(org => (
          <div key={org.id} onClick={() => setSelectedOrg(org)} className="card-hover-effect" style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', cursor: 'pointer', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', transition: '0.2s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '12px', backgroundColor: org.color + '15', color: org.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18v-8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8z"></path><polyline points="9 10 9 21 15 21 15 10"></polyline><path d="M12 2L3 7v3h18V7L12 2z"></path></svg></div>
              <span style={{ backgroundColor: '#f1f5f9', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>{authorities.filter(a => a.orgId === org.id).length} Autoridades</span>
            </div>
            <div><h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', color: 'var(--deep-blue)' }}>{org.name}</h3><p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>{org.type}</p></div>
            <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #f1f5f9', color: 'var(--medium-blue)', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>Gestionar Personal →</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderOrgDetails = () => (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div style={{ marginBottom: '24px' }}>
        <button onClick={() => setSelectedOrg(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 600, marginBottom: '16px' }}>← Volver</button>
        <div className="flex-between">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
             <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: selectedOrg.color + '15', color: selectedOrg.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18v-8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8z"></path><polyline points="9 10 9 21 15 21 15 10"></polyline><path d="M12 2L3 7v3h18V7L12 2z"></path></svg></div>
             <div><h2 style={{ fontSize: '1.5rem', color: 'var(--deep-blue)', margin: 0, fontWeight: 700 }}>{selectedOrg.name}</h2><p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)' }}>Gestión de autoridades</p></div>
          </div>
          <Button onClick={() => openModal('auth', 'add')} style={{ backgroundColor: 'var(--deep-blue)', color: 'white' }}>+ Añadir Autoridad</Button>
        </div>
      </div>
      <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)', overflow: 'hidden' }}>
        <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr><th>Nombre</th><th>Cargo</th><th>Estado</th><th style={{ textAlign: 'right' }}>Acciones</th></tr></thead>
          <tbody>
            {authorities.filter(a => a.orgId === selectedOrg.id).map(auth => (
              <tr key={auth.id}>
                <td style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#f1f5f9', color: 'var(--deep-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>{auth.name.charAt(0)}</div><span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{auth.name}</span></td>
                <td style={{ color: 'var(--text-muted)' }}>{auth.cargo}</td>
                <td><span style={{ backgroundColor: auth.status === 'Activo' ? '#dcfce7' : '#fef9c3', color: auth.status === 'Activo' ? '#166534' : '#854d0e', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>{auth.status}</span></td>
                <td style={{ textAlign: 'right' }}><button onClick={() => openModal('auth', 'edit', auth)} className="action-btn edit">Editar</button><button onClick={() => openModal('delete', 'auth', auth)} className="action-btn delete">Remover</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f3f6f8' }}>
      
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} resetSelection={() => setSelectedOrg(null)} />

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

      {/* --- FORMULARIOS MODALES --- */}
      
      {/* 1. Modal Usuario */}
      <AdminModal 
        isOpen={modalType === 'user'} 
        onClose={closeModal} 
        title={modalMode === 'add' ? 'Nuevo Usuario' : 'Editar Usuario'}
        footer={<><button onClick={closeModal} className="cancel-btn">Cancelar</button><button onClick={handleSave} className="save-btn">Guardar</button></>}
      >
        <form>
          <div className="admin-input-group"><label>Nombre</label><input value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
          <div className="admin-input-group"><label>Correo</label><input value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
          <div className="admin-input-group"><label>Estado</label><select value={formData.status || 'Activo'} onChange={e => setFormData({...formData, status: e.target.value})}><option>Activo</option><option>Baneado</option></select></div>
        </form>
      </AdminModal>

      {/* 2. Modal Autoridad */}
      <AdminModal 
        isOpen={modalType === 'auth'} 
        onClose={closeModal} 
        title={modalMode === 'add' ? 'Añadir Autoridad' : 'Editar Autoridad'}
        footer={<><button onClick={closeModal} className="cancel-btn">Cancelar</button><button onClick={handleSave} className="save-btn">Guardar</button></>}
      >
        <form>
          <div className="admin-input-group"><label>Nombre</label><input value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
          <div className="admin-input-group"><label>Cargo</label><input value={formData.cargo || ''} onChange={e => setFormData({...formData, cargo: e.target.value})} /></div>
          <div className="admin-input-group"><label>Estado</label><select value={formData.status || 'Activo'} onChange={e => setFormData({...formData, status: e.target.value})}><option>Activo</option><option>Inactivo</option></select></div>
        </form>
      </AdminModal>

      {/* 3. Modal Organización (NUEVO) */}
      <AdminModal 
        isOpen={modalType === 'org'} 
        onClose={closeModal} 
        title="Nueva Organización"
        footer={<><button onClick={closeModal} className="cancel-btn">Cancelar</button><button onClick={handleSave} className="save-btn">Crear</button></>}
      >
        <form>
          <div className="admin-input-group"><label>Nombre Entidad</label><input value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ej. Comisaría Central" /></div>
          <div className="admin-input-group"><label>Tipo</label><select value={formData.type || 'Gobierno Local'} onChange={e => setFormData({...formData, type: e.target.value})}><option>Gobierno Local</option><option>Seguridad</option><option>Salud</option></select></div>
          <div className="admin-input-group"><label>Color</label><select value={formData.color || '#4f46e5'} onChange={e => setFormData({...formData, color: e.target.value})}><option value="#4f46e5">Azul</option><option value="#059669">Verde</option><option value="#d97706">Ámbar</option></select></div>
        </form>
      </AdminModal>

      {/* 4. Modal Eliminar */}
      <AdminModal 
        isOpen={modalType === 'delete'} 
        onClose={closeModal}
        footer={<><button onClick={closeModal} className="cancel-btn">Cancelar</button><button onClick={handleDelete} className="delete-btn-confirm">Eliminar</button></>}
      >
        <div style={{textAlign:'center'}}>
          <h3 style={{color:'#991b1b', marginTop:0}}>¿Estás seguro?</h3>
          <p>Esta acción es irreversible.</p>
        </div>
      </AdminModal>

    </div>
  );
}