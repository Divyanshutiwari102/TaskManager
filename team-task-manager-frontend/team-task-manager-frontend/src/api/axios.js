import axios from 'axios';

// ✅ FIX: production backend URL
const API = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL ||
    'https://balanced-curiosity-production.up.railway.app/api',
});

// ✅ Attach JWT token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Handle auth errors
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default API;
