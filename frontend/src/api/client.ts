import axios from 'axios';

// Si existe la variable VITE_API_URL se usa, de lo contrario usamos la ruta relativa '/api' con el proxy de Vite o puerto 5055
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Extraer mensaje del ServiceResult devuelto por el backend si existe
    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.join(', ') ||
      error.message ||
      'Ocurrió un error inesperado al comunicarse con el servidor.';
    return Promise.reject(new Error(message));
  }
);
