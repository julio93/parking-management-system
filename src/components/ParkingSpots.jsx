// src/components/ParkingSpots.jsx
import React from 'react';

const ParkingSpots = ({ spots }) => {
  if (!spots || spots.length === 0) {
    return <div className="text-center py-4">No parking spots available for this floor</div>;
  }

  // Calculate grid dimensions based on the number of spots
  const gridCols = Math.ceil(Math.sqrt(spots.length));
  
  return (
    <div 
      className="grid gap-4" 
      style={{ 
        gridTemplateColumns: `repeat(${Math.min(gridCols, 5)}, minmax(0, 1fr))` 
      }}
    >
      {spots.map(spot => (
        <div 
          key={spot.id}
          className={`
            aspect-square flex items-center justify-center rounded-md text-white font-bold
            ${spot.status === 'Disponible' ? 'bg-green-500' : 'bg-red-500'}
          `}
        >
          {spot.number}
        </div>
      ))}
    </div>
  );
};

export default ParkingSpots;