// Configuración base para todas las llamadas API
const API_BASE_URL = '/api';

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

export const complaintsService = {
  getAll: () => apiRequest('/complaints'),
  
  getById: (id) => apiRequest(`/complaints/${id}`),
  
  create: (complaintData) => 
    apiRequest('/complaints', {
      method: 'POST',
      body: JSON.stringify(complaintData),
    }),
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
  getUserNotifications: (userId) => 
    apiRequest(`/notifications/${userId}`),
};

export const adminService = {
  getStatistics: () => apiRequest('/admin/statistics'),
  
  getUsers: () => apiRequest('/admin/users'),
};