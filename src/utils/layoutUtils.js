// Utilidades para manejar layouts
export const calculateOccupancyRate = (spots) => {
  const total = spots.length;
  const occupied = spots.filter(spot => spot.status === 'Ocupado').length;
  
  return total > 0 ? Math.round((occupied / total) * 100) : 0;
};

export const validateLayout = (layout) => {
  const errors = [];
  
  if (!layout || !layout.elements || layout.elements.length === 0) {
    errors.push('El layout debe tener al menos un elemento');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};