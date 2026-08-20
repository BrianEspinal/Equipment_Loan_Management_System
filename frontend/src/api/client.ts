import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5055/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Extraer mensaje detallado del ServiceResult devuelto por el backend
    const errorsList = error.response?.data?.errors;
    const message =
      (Array.isArray(errorsList) && errorsList.length > 0 ? errorsList.join(', ') : null) ||
      error.response?.data?.message ||
      error.message ||
      'Ocurrió un error inesperado al comunicarse con el servidor.';
    return Promise.reject(new Error(message));
  }
);
