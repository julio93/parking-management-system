// Servicio para manejar operaciones de layout
export const layoutService = {
  saveLayout: async (establishmentId, floorId, layout) => {
    // Simular guardado en API
    console.log('Saving layout:', { establishmentId, floorId, layout });
    return Promise.resolve({ success: true });
  },

  loadLayout: async (establishmentId, floorId) => {
    // Simular carga desde API
    console.log('Loading layout:', { establishmentId, floorId });
    return Promise.resolve(null);
  },

  validateLayout: (layout) => {
    // Validar que el layout sea correcto
    const errors = [];
    
    if (!layout.elements || layout.elements.length === 0) {
      errors.push('El layout debe tener al menos un elemento');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
};