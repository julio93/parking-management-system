// Utilidades para manejar coordenadas y posiciones
export const getGridCoordinates = (spot) => {
  return {
    x: spot.x * spot.gridSize,
    y: spot.y * spot.gridSize
  };
};

export const convertToGridPosition = (x, y, gridSize) => {
  return {
    gridX: Math.floor(x / gridSize),
    gridY: Math.floor(y / gridSize)
  };
};