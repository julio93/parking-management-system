// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:3001';
//const API_URL = 'https://virtserver.swaggerhub.com/unir-5f3/establishment/1.0.0';

// Configuración base de axios
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para manejo de errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// **ESTABLECIMIENTOS**
export const fetchEstablishments = async () => {
  try {
    const response = await apiClient.get('/establishments');
    return response.data;
  } catch (error) {
    console.error('Error fetching establishments:', error);
    throw error;
  }
};

// **ESTADO DE PARQUEOS**
export const fetchParkingStatus = async (floorId) => {
  try {
    //const response = await apiClient.get('/establishments/status?floorId=${floorId}');
    const response = await apiClient.get('/establishments/status');
    return response.data;
  } catch (error) {
    console.error('Error fetching parking status:', error);
    throw error;
  }
};

// **GUARDAR ESTABLECIMIENTO**
export const saveEstablishment = async (establishmentData) => {
  try {
    if (establishmentData.id) {
      // Actualizar establecimiento existente
      //eslint-disable-next-line
      const response = await apiClient.put('/establishments/${establishmentData.id}', establishmentData);
      return response.data;
    } else {
      // Crear nuevo establecimiento
      const response = await apiClient.post('/establishments', establishmentData);
      return response.data;
    }
  } catch (error) {
    console.error('Error saving establishment:', error);
    throw error;
  }
};