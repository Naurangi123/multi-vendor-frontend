import axios from 'axios';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import { tokenRefresh } from './apiServices';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8005';

const axiosInstance = axios.create({
  baseURL: apiUrl,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      sessionStorage.getItem(REFRESH_TOKEN)
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = sessionStorage.getItem(REFRESH_TOKEN);
        const res = await tokenRefresh({ refresh: refreshToken });

        if (res?.status === 200 && res.data?.access) {
          sessionStorage.setItem(ACCESS_TOKEN, res.data.access);
          originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
          return axiosInstance(originalRequest);
        } else {
          sessionStorage.clear();
        }
      } catch (refreshError) {
        console.error('Auto-refresh failed:', refreshError);
        sessionStorage.clear();
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;