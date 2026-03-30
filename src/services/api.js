import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('laf_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('laf_token');
      localStorage.removeItem('laf_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

// Items (public)
export const publicAPI = {
  getItems: () => api.get('/items/public'),
  searchItems: (keyword) => api.get(`/items/public/search?keyword=${keyword}`),
  getByType: (type) => api.get(`/items/public/type/${type}`),
  getById: (id) => api.get(`/items/public/${id}`),
};

// Items (authenticated)
export const itemsAPI = {
  create: (data) => api.post('/items', data),
  getMyItems: () => api.get('/items/my-items'),
  claim: (id, data) => api.post(`/items/${id}/claim`, data),
  reportFound: (id, data) => api.post(`/items/${id}/report-found`, data),
};

// Admin
export const adminAPI = {
  getStats: () => api.get('/admin/dashboard/stats'),
  getAllItems: () => api.get('/admin/items'),
  updateStatus: (id, status) => api.patch(`/admin/items/${id}/status?status=${status}`),
  approveClaim: (id) => api.patch(`/admin/items/${id}/approve-claim`),
  rejectClaim: (id) => api.patch(`/admin/items/${id}/reject-claim`),
  deleteItem: (id) => api.delete(`/admin/items/${id}`),
  getAllUsers: () => api.get('/admin/users'),
  toggleUser: (id) => api.patch(`/admin/users/${id}/toggle`),
};

export default api;
