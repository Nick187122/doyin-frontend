import axios from 'axios';

export const AUTH_TOKEN_KEY = 'admin_token';
export const DEVICE_TOKEN_KEY = 'device_token';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
export const API_ORIGIN = new URL(API_BASE_URL).origin;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { Accept: 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
  const deviceToken = sessionStorage.getItem(DEVICE_TOKEN_KEY);

  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (deviceToken) config.headers['X-Device-Token'] = deviceToken;

  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      sessionStorage.removeItem(AUTH_TOKEN_KEY);
      sessionStorage.removeItem(DEVICE_TOKEN_KEY);
      window.location.href = '/admin/login';
    }

    return Promise.reject(err);
  }
);

export default api;
