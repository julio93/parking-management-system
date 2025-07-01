import React, { useState } from 'react';
import { useEstablishments } from '../contexts/EstablishmentContext';
import ParkingLayoutViewer from './ParkingLayoutViewer';
import SpotDetailsModal from './SpotDetailsModal';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom'; // Import createPortal

const EstablishmentDetails = ({ establishment, onClose }) => {
  const { establishments, loading, error } = useEstablishments();
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [activeFloor, setActiveFloor] = useState(establishment.floors[0]?.id || null);
  const [parkingLayout, setParkingLayout] = useState(establishment.floors[0]?.layout || null);
  const [modalOpen, setModalOpen] = useState(false);

  console.log('EstablishmentDetails props:', establishment);  

  if (loading) return <div>Cargando detalles del establecimiento...</div>;
  if (error) return <div>Error: {error}</div>;

  //const establishment = establishments.find(est => est.id.toString() === establishmentId);

  if (!establishment) {
    return <div>Establecimiento no encontrado</div>;
  }

  const handleSpotClick = (spotData) => {
    setSelectedSpot(spotData);
    setModalOpen(true);
  };

  const handleUpdateSpot = (updatedSpot) => {
    // Aquí puedes agregar la lógica para actualizar el estado del espacio en el backend
    console.log('Actualizando espacio:', updatedSpot);
    setModalOpen(false);
  };

    // Use createPortal to render the modal directly to the document body
  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto z-[1001] relative">
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold">{establishment.name}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="mt-4">
          <p className="text-gray-600">{establishment.address}</p>
          <p className="mt-2">
            <span className="font-semibold">Status: </span>
            <span className={establishment.status === 'Disponible' ? 'text-green-600' : 'text-red-600'}>
              {establishment.status}
            </span>
          </p>
          <p className="mt-1">
            <span className="font-semibold">Floors: </span>
            {establishment.floors.length}
          </p>
        </div>

        {establishment.floors.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Plano del piso</h3>
            
            <div className="flex space-x-2 mb-4">
              {establishment.floors.map(floor => (
                <button
                  key={floor.id}
                  className={`px-4 py-2 rounded ${
                    activeFloor === floor.id 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                  onClick={() => setActiveFloor(floor.id)}
                >
                  Floor {floor.number}
                </button>
              ))}
            </div>
            
             <div className="floors-section">
        <h2>Layout de Parqueos</h2>
        {establishment.floors?.map(floor => (
          <ParkingLayoutViewer
            key={floor.id}
            floor={floor}
            onSpotClick={handleSpotClick}
            editable={false}
          />
        ))}
      </div>
          </div>
        )}
      </div>
    </div>,
    document.body // Render the modal to the body
  );
};

EstablishmentDetails.propTypes = {
  establishment: PropTypes.string.isRequired
};

export default EstablishmentDetails;