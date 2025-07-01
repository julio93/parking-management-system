// src/pages/MapView.jsx
import React, { useState, useEffect } from 'react';
import Map from '../components/Map';
import EstablishmentDetails from '../components/EstablishmentDetails';
import { useEstablishments } from '../contexts/EstablishmentContext';

const MapView = () => {
  const { selectedEstablishment, setSelectedEstablishment } = useEstablishments();
  const [showDetails, setShowDetails] = useState(false);

  // When selectedEstablishment changes, show the details panel
  useEffect(() => {
    if (selectedEstablishment) {
      setShowDetails(true);
    }
  }, [selectedEstablishment]);

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedEstablishment(null);
  };

  return (
    <div className="relative h-full">
      {/* Map component takes the full available height */}
      <Map />
      
      {/* Overlay for establishment details */}
      {showDetails && selectedEstablishment && (
        <EstablishmentDetails 
          establishment={selectedEstablishment} 
          onClose={handleCloseDetails} 
        />
      )}
      
      {/* Legend for map markers */}
      <div className="absolute bottom-5 right-5 bg-white p-3 rounded-lg shadow-md z-10">
        <h3 className="font-bold text-sm mb-2">Parking Spots Status</h3>
        <div className="flex items-center mb-1">
          <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
          <span className="text-sm">Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
          <span className="text-sm">Occupied</span>
        </div>
      </div>
      
      {/* Quick info panel */}
      <div className="absolute top-5 left-5 bg-white p-3 rounded-lg shadow-md z-10 max-w-xs">
        <h3 className="font-bold text-sm mb-1">Parking Monitor</h3>
        <p className="text-xs text-gray-600">
          Click on any marker to view detailed information about the parking establishment.
        </p>
      </div>
    </div>
  );
};

export default MapView;