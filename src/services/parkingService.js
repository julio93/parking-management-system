// Servicio para manejar operaciones de parqueo
export const parkingService = {
  getParkingSpots: async (establishmentId, floorId) => {
    // Simular carga de espacios de parqueo
    console.log('Cargando espacios de parqueo para:', { establishmentId, floorId });
    return Promise.resolve([
      { id: 1, number: 'A1', status: 'Disponible' },
      { id: 2, number: 'A2', status: 'Ocupado' }
    ]);
  },

  updateSpotStatus: async (spotId, newStatus) => {
    // Simular actualización de estado
    console.log('Actualizando estado del espacio:', { spotId, newStatus });
    return Promise.resolve({ success: true });
  }
};