// Configuración base para todas las llamadas API
// const API_BASE_URL = '/api';
const API_BASE_URL = 'https://sistema-de-denuncias.onrender.com/api';


// Función helper para hacer fetch
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Servicios específicos
export const authService = {
  login: (email, password) => 
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (userData) => 
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
};

// En la sección de complaintsService, agrega:
export const complaintsService = {
  getAll: () => apiRequest('/complaints'),
  
  getById: (id) => apiRequest(`/complaints/${id}`),
  
  create: (complaintData) => 
    apiRequest('/complaints', {
      method: 'POST',
      body: JSON.stringify(complaintData),
    }),
    
  // Nuevo: Obtener denuncias por usuario (si implementas ese endpoint)
  getByUser: (userId) => 
    apiRequest(`/complaints/user/${userId}`),
};

export const userService = {
  getProfile: (userId) => apiRequest(`/users/profile/${userId}`),
  
  updateProfile: (userId, updates) => 
    apiRequest(`/users/profile/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
};

export const notificationsService = {
  // Obtener notificaciones de usuario
  getUserNotifications: (userId) => 
    apiRequest(`/notifications/${userId}`),
  
  // Marcar como leída
  markAsRead: (userId, notificationId) => 
    apiRequest(`/notifications/${userId}/read/${notificationId}`, {
      method: 'PUT',
    }),
  
  // Marcar todas como leídas
  markAllAsRead: (userId) => 
    apiRequest(`/notifications/${userId}/read-all`, {
      method: 'PUT',
    }),
  
  // Eliminar notificación
  deleteNotification: (userId, notificationId) => 
    apiRequest(`/notifications/${userId}/${notificationId}`, {
      method: 'DELETE',
    }),
  
  // Crear notificación (para testing)
  createNotification: (userId, data) => 
    apiRequest(`/notifications/${userId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export const adminService = {
  // Estadísticas
  getStatistics: () => apiRequest('/admin/statistics'),
  
  // Usuarios
  getUsers: () => apiRequest('/admin/users'),
  updateUser: (userId, updates) => 
    apiRequest(`/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  deleteUser: (userId) => 
    apiRequest(`/admin/users/${userId}`, {
      method: 'DELETE',
    }),
  
  // Organizaciones
  getOrganizations: () => apiRequest('/admin/organizations'),
  createOrganization: (orgData) => 
    apiRequest('/admin/organizations', {
      method: 'POST',
      body: JSON.stringify(orgData),
    }),
  
  // Autoridades
  getAuthorities: () => apiRequest('/admin/authorities'),
  getAuthoritiesByOrg: (orgId) => 
    apiRequest(`/admin/organizations/${orgId}/authorities`),
  createAuthority: (authData) => 
    apiRequest('/admin/authorities', {
      method: 'POST',
      body: JSON.stringify(authData),
    }),
  updateAuthority: (authId, updates) => 
    apiRequest(`/admin/authorities/${authId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  deleteAuthority: (authId) => 
    apiRequest(`/admin/authorities/${authId}`, {
      method: 'DELETE',
    }),
};

export const statsService = {
  // Estadísticas para el Home
  getHomeStats: () => apiRequest('/stats/home'),
  
  // Estadísticas completas (para admin también puede usar)
  getAllStats: () => apiRequest('/admin/statistics'),
};

