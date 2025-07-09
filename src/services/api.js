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

// ============ ESTABLECIMIENTOS ============

/**
 * Obtiene todos los establecimientos con sus detalles completos
 * @returns {Promise<Array>} Lista de establecimientos con floors y spots
 */
export const fetchEstablishments = async () => {
  try {
    const response = await apiClient.get('/establishments');
    return response.data.establishments || response.data;
  } catch (error) {
    console.error('Error fetching establishments:', error);
    throw error;
  }
};

/**
 * Obtiene un establecimiento específico por ID
 * @param {string|number} establishmentId - ID del establecimiento
 * @returns {Promise<Object>} Establecimiento con floors y spots
 */
export const fetchEstablishment = async (establishmentId) => {
  try {
    const response = await apiClient.get(`/establishments/${establishmentId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching establishment ${establishmentId}:`, error);
    throw error;
  }
};

/**
 * Obtiene el estado de parqueo de todos los pisos de un establecimiento
 * @param {string|number} establishmentId - ID del establecimiento
 * @returns {Promise<Array>} Estado de parqueo por piso
 */
export const fetchEstablishmentParkingStatus = async (establishmentId) => {
  try {
    const response = await apiClient.get(`/establishments/${establishmentId}/parking-status`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching establishment parking status:`, error);
    throw error;
  }
};

/**
 * Guarda o actualiza un establecimiento completo
 * @param {Object} establishment - Datos del establecimiento
 * @param {string} establishment.id - ID del establecimiento (opcional para crear)
 * @param {string} establishment.name - Nombre del establecimiento
 * @param {string} establishment.address - Dirección
 * @param {number} establishment.latitude - Latitud
 * @param {number} establishment.longitude - Longitud
 * @param {string} establishment.status - Estado del establecimiento
 * @param {Array} establishment.floors - Array de pisos con sus spots
 * @returns {Promise<Object>} Establecimiento guardado
 */
export const saveEstablishment = async (establishment) => {
  try {
    // Validar datos requeridos
    if (!establishment.name || !establishment.address) {
      throw new Error('Name and address are required');
    }

    // Preparar datos para envío
    const establishmentData = {
      name: establishment.name,
      address: establishment.address,
      latitude: parseFloat(establishment.latitude),
      longitude: parseFloat(establishment.longitude),
      status: establishment.status || 'Disponible',
      floors: establishment.floors || []
    };

    if (establishment.id) {
      // Actualizar establecimiento existente
      const response = await apiClient.put(`/establishments/${establishment.id}`, establishmentData);
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


/**
 * Obtiene el estado de las plazas de parqueo de un piso específico
 * @param {string|number} floorId - ID del piso
 * @returns {Promise<Array>} Lista de spots con su estado actual
 */
export const fetchParkingStatus = async (floorId) => {
  try {
    const response = await apiClient.get(`/floors/${floorId}/parking-status`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching parking status for floor ${floorId}:`, error);
    throw error;
  }
};

/**
 * Elimina un establecimiento
 * @param {string|number} establishmentId - ID del establecimiento
 * @returns {Promise<Object>} Confirmación de eliminación
 */
export const deleteEstablishment = async (establishmentId) => {
  try {
    const response = await apiClient.delete(`/establishments/${establishmentId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting establishment ${establishmentId}:`, error);
    throw error;
  }
};

// ============ PISOS ============

/**
 * Obtiene todos los pisos de un establecimiento
 * @param {string|number} establishmentId - ID del establecimiento
 * @returns {Promise<Array>} Lista de pisos con sus spots
 */
export const fetchFloors = async (establishmentId) => {
  try {
    const response = await apiClient.get(`/establishments/${establishmentId}/floors`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching floors for establishment ${establishmentId}:`, error);
    throw error;
  }
};

/**
 * Obtiene un piso específico
 * @param {string|number} establishmentId - ID del establecimiento
 * @param {string|number} floorId - ID del piso
 * @returns {Promise<Object>} Piso con sus spots
 */
export const fetchFloor = async (establishmentId, floorId) => {
  try {
    const response = await apiClient.get(`/establishments/${establishmentId}/floors/${floorId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching floor ${floorId}:`, error);
    throw error;
  }
};

/**
 * Guarda o actualiza un piso
 * @param {string|number} establishmentId - ID del establecimiento
 * @param {Object} floor - Datos del piso
 * @returns {Promise<Object>} Piso guardado
 */
export const saveFloor = async (establishmentId, floor) => {
  try {
    const floorData = {
      number: floor.number,
      spots: floor.spots || []
    };

    if (floor.id) {
      // Actualizar piso existente
      const response = await apiClient.put(`/establishments/${establishmentId}/floors/${floor.id}`, floorData);
      return response.data;
    } else {
      // Crear nuevo piso
      const response = await apiClient.post(`/establishments/${establishmentId}/floors`, floorData);
      return response.data;
    }
  } catch (error) {
    console.error('Error saving floor:', error);
    throw error;
  }
};

/**
 * Elimina un piso
 * @param {string|number} establishmentId - ID del establecimiento
 * @param {string|number} floorId - ID del piso
 * @returns {Promise<Object>} Confirmación de eliminación
 */
export const deleteFloor = async (establishmentId, floorId) => {
  try {
    const response = await apiClient.delete(`/establishments/${establishmentId}/floors/${floorId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting floor ${floorId}:`, error);
    throw error;
  }
};

// ============ LAYOUT MANAGEMENT ============

/**
 * Guarda el layout completo de un piso (canvas, elementos, spots)
 * @param {Object} layoutData - Datos del layout
 * @param {string|number} layoutData.establishmentId - ID del establecimiento
 * @param {string|number} layoutData.floorId - ID del piso
 * @param {Array} layoutData.spots - Array de spots de parqueo
 * @param {Array} layoutData.elements - Array de elementos del canvas (paredes, columnas, etc.)
 * @param {Object} layoutData.canvasConfig - Configuración del canvas
 * @returns {Promise<Object>} Layout guardado
 */
export const saveLayout = async (layoutData) => {
  try {
    // Validar datos requeridos
    if (!layoutData.establishmentId || !layoutData.floorId) {
      throw new Error('Establishment ID and Floor ID are required');
    }

    const payload = {
      establishmentId: layoutData.establishmentId,
      floorId: layoutData.floorId,
      spots: layoutData.spots || [],
      elements: layoutData.elements || [],
      canvasConfig: {
        width: layoutData.canvasConfig?.width || 1000,
        height: layoutData.canvasConfig?.height || 700,
        gridSize: layoutData.canvasConfig?.gridSize || 20,
        ...layoutData.canvasConfig
      },
      metadata: {
        lastModified: new Date().toISOString(),
        version: layoutData.metadata?.version || '1.0',
        ...layoutData.metadata
      }
    };

    const response = await apiClient.post('/layouts', payload);
    return response.data;
  } catch (error) {
    console.error('Error saving layout:', error);
    throw error;
  }
};

/**
 * Obtiene el layout de un piso
 * @param {string|number} establishmentId - ID del establecimiento
 * @param {string|number} floorId - ID del piso
 * @returns {Promise<Object>} Layout del piso
 */
export const fetchLayout = async (establishmentId, floorId) => {
  try {
    const response = await apiClient.get(`/layouts/${establishmentId}/${floorId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching layout for floor ${floorId}:`, error);
    throw error;
  }
};

/**
 * Actualiza el layout de un piso
 * @param {string|number} layoutId - ID del layout
 * @param {Object} layoutData - Datos del layout
 * @returns {Promise<Object>} Layout actualizado
 */
export const updateLayout = async (layoutId, layoutData) => {
  try {
    const response = await apiClient.put(`/layouts/${layoutId}`, layoutData);
    return response.data;
  } catch (error) {
    console.error(`Error updating layout ${layoutId}:`, error);
    throw error;
  }
};

// ============ SPOTS MANAGEMENT ============

/**
 * Actualiza el estado de un spot específico
 * @param {string|number} spotId - ID del spot
 * @param {string} status - Nuevo estado ('Disponible', 'Ocupado', 'Reservado', 'Fuera de servicio')
 * @returns {Promise<Object>} Spot actualizado
 */
export const updateSpotStatus = async (spotId, status) => {
  try {
    const response = await apiClient.patch(`/spots/${spotId}`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating spot ${spotId} status:`, error);
    throw error;
  }
};

/**
 * Actualiza múltiples spots en lote
 * @param {Array} spotsData - Array de spots con sus nuevos estados
 * @returns {Promise<Array>} Spots actualizados
 */
export const updateMultipleSpots = async (spotsData) => {
  try {
    const response = await apiClient.patch('/spots/batch', { spots: spotsData });
    return response.data;
  } catch (error) {
    console.error('Error updating multiple spots:', error);
    throw error;
  }
};

/**
 * Obtiene estadísticas de ocupación de un establecimiento
 * @param {string|number} establishmentId - ID del establecimiento
 * @returns {Promise<Object>} Estadísticas de ocupación
 */
export const fetchOccupancyStats = async (establishmentId) => {
  try {
    const response = await apiClient.get(`/establishments/${establishmentId}/stats`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching occupancy stats:`, error);
    throw error;
  }
};

// ============ REAL-TIME UPDATES ============

/**
 * Establece conexión WebSocket para actualizaciones en tiempo real
 * @param {string|number} establishmentId - ID del establecimiento
 * @param {Function} onUpdate - Callback para manejar actualizaciones
 * @returns {WebSocket} Conexión WebSocket
 */
export const subscribeToUpdates = (establishmentId, onUpdate) => {
  try {
    const wsUrl = API_URL.replace('http', 'ws');
    const ws = new WebSocket(`${wsUrl}/ws/establishments/${establishmentId}`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onUpdate(data);
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    return ws;
  } catch (error) {
    console.error('Error establishing WebSocket connection:', error);
    throw error;
  }
};

// ============ EXPORT DEFAULT ============

export default {
  // Establishments
  fetchEstablishments,
  fetchEstablishment,
  saveEstablishment,
  deleteEstablishment,
  
  // Floors
  fetchFloors,
  fetchFloor,
  saveFloor,
  deleteFloor,
  
  // Parking Status
  fetchParkingStatus,
  fetchEstablishmentParkingStatus,
  
  // Layout Management
  saveLayout,
  fetchLayout,
  updateLayout,
  
  // Spots Management
  updateSpotStatus,
  updateMultipleSpots,
  
  // Statistics
  fetchOccupancyStats,
  
  // Real-time
  subscribeToUpdates
};