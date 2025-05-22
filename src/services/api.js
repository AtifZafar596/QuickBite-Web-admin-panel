const API_BASE_URL = 'http://localhost:5000/admin/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('adminToken');
};

// Generic fetch wrapper with error handling and auth
const fetchWithErrorHandling = async (url, options = {}) => {
  try {
    const token = getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth API
export const authApi = {
  login: (credentials) => 
    fetchWithErrorHandling(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  logout: () => {
    localStorage.removeItem('adminToken');
  },
};

// Orders API
export const ordersApi = {
  getAll: () => fetchWithErrorHandling(`${API_BASE_URL}/orders`),
  getById: (id) => fetchWithErrorHandling(`${API_BASE_URL}/orders/${id}`),
  updateStatus: (id, status) => 
    fetchWithErrorHandling(`${API_BASE_URL}/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
};

// Categories API
export const categoriesApi = {
  getAll: () => fetchWithErrorHandling(`${API_BASE_URL}/categories`),
  create: (data) => 
    fetchWithErrorHandling(`${API_BASE_URL}/categories`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) => 
    fetchWithErrorHandling(`${API_BASE_URL}/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id) => 
    fetchWithErrorHandling(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
    }),
};

// Stores API
export const storesApi = {
  getAll: () => fetchWithErrorHandling(`${API_BASE_URL}/stores`),
  getById: (id) => fetchWithErrorHandling(`${API_BASE_URL}/stores/${id}`),
  create: (data) => 
    fetchWithErrorHandling(`${API_BASE_URL}/stores`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) => 
    fetchWithErrorHandling(`${API_BASE_URL}/stores/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id) => 
    fetchWithErrorHandling(`${API_BASE_URL}/stores/${id}`, {
      method: 'DELETE',
    }),
};

// Menus API
export const menusApi = {
  getAll: () => fetchWithErrorHandling(`${API_BASE_URL}/menus`),
  getById: (id) => fetchWithErrorHandling(`${API_BASE_URL}/menus/${id}`),
  getAllByStore: (storeId) => fetchWithErrorHandling(`${API_BASE_URL}/stores/${storeId}/menu`),
  createForStore: (storeId, data) =>
    fetchWithErrorHandling(`${API_BASE_URL}/stores/${storeId}/menu`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    fetchWithErrorHandling(`${API_BASE_URL}/menu/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    fetchWithErrorHandling(`${API_BASE_URL}/menu/${id}`, {
      method: 'DELETE',
    }),
}; 