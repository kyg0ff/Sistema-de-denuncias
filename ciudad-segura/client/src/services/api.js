// Configuración base para todas las llamadas API

// const API_BASE_URL = '/api';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Función helper para hacer fetch
/**
 * Función helper para hacer peticiones fetch de forma centralizada.
 * Maneja automáticamente el Content-Type según el tipo de datos enviados.
 */
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  // 1. Copiamos las cabeceras que vengan en las opciones (como Authorization si lo usas)
  const headers = { ...options.headers };

  // 2. LÓGICA CRÍTICA: 
  // - Si el body es un FormData (cuando subes archivos), NO debemos poner Content-Type.
  //   El navegador lo pondrá automáticamente como 'multipart/form-data' con un "boundary" único.
  // - Si el body NO es FormData y existe, le ponemos 'application/json'.
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const config = {
    ...options,
    headers: headers,
  };

  try {
    const response = await fetch(url, config);

    // Si la respuesta no es 2xx, intentamos leer el error del servidor
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    // Retornamos la respuesta ya convertida a objeto JS
    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// =====================
// Servicios específicos
// =====================

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

// =====================
// Complaints Service
// =====================

export const complaintsService = {
  getAll: () => apiRequest('/complaints'),

  getById: (id) => apiRequest(`/complaints/${id}`),

  // MODIFICADO: Ahora recibe FormData para soportar imágenes y videos
  create: (formData) => {
    // Usamos la URL base definida al inicio de tu archivo api.js
    const url = `${API_BASE_URL}/complaints`;

    return fetch(url, {
      method: 'POST',
      body: formData,
      // IMPORTANTE: No definimos 'Content-Type' aquí. 
      // Al pasar un objeto FormData, el navegador lo hace por nosotros
      // incluyendo el "boundary" necesario para que el servidor procese los archivos.
    }).then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    });
  },

  // Obtener denuncias por usuario
  getByUser: (userId) =>
    apiRequest(`/complaints/user/${userId}`),
};

// =====================
// User Service
// =====================

export const userService = {
  getProfile: (userId) =>
    apiRequest(`/users/profile/${userId}`),

  updateProfile: (userId, updates) =>
    apiRequest(`/users/profile/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
};

// =====================
// Notifications Service
// =====================

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

  // Crear notificación (testing)
  createNotification: (userId, data) =>
    apiRequest(`/notifications/${userId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// =====================
// Admin Service
// =====================

export const adminService = {
  // --- ESTADÍSTICAS ---
  getStatistics: () => apiRequest('/admin/statistics'),

  // --- USUARIOS ---
  getUsers: () => apiRequest('/admin/users'),

  // 1. AGREGADO: Esta función es la que te está dando el error actual
  createUser: (userData) => 
    apiRequest('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  updateUser: (userId, updates) =>
    apiRequest(`/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  deleteUser: (userId) =>
    apiRequest(`/admin/users/${userId}`, {
      method: 'DELETE',
    }),

  // --- ORGANIZACIONES ---
  getOrganizations: () => apiRequest('/admin/organizations'),

  createOrganization: (orgData) =>
    apiRequest('/admin/organizations', {
      method: 'POST',
      body: JSON.stringify(orgData),
    }),

  // --- AUTORIDADES ---
  getAuthorities: () => apiRequest('/admin/authorities'),

  getAuthoritiesByOrg: (orgId) =>
    apiRequest(`/admin/organizations/${orgId}/authorities`),

  getAvailableAuthorities: () => 
    apiRequest('/admin/authorities/available'),

  // 2. SOLUCIÓN DE NOMBRE: Definimos createAuthority y le creamos un alias
  createAuthority: (authData) =>
    apiRequest('/admin/authorities', {
      method: 'POST',
      body: JSON.stringify(authData),
    }),

  // Creamos el alias 'assignAuthority' para que coincida con tu AdminDashboard.jsx
  assignAuthority: (authData) => 
    adminService.createAuthority(authData),

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

// =====================
// Stats Service
// =====================

export const statsService = {
  // Estadísticas para el Home
  getHomeStats: () => apiRequest('/stats/home'),

  // Estadísticas completas (admin)
  getAllStats: () => apiRequest('/admin/statistics'),
};

// =====================
// Categories Service
// =====================

export const categoriesService = {
  getAll: () => apiRequest('/categories'),
};