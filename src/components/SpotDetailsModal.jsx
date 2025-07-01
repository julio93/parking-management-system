import React from 'react';
import PropTypes from 'prop-types';
import '../styles/SpotDetailsModal.css';

const SpotDetailsModal = ({ spot, isOpen, onClose, onUpdateSpot }) => {
  if (!isOpen || !spot) return null;

  console.log('SpotDetailsModal props:', { spot, isOpen, onClose, onUpdateSpot });

  const handleStatusChange = (newStatus) => {
    onUpdateSpot({ ...spot, status: newStatus });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Detalles del Espacio {spot.number}</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="spot-info">
            <p><strong>Número:</strong> {spot.number}</p>
            <p><strong>Estado:</strong> {spot.status}</p>
            <p><strong>Tipo:</strong> {spot.type || 'Regular'}</p>
          </div>
          
          <div className="status-controls">
            <h4>Cambiar Estado:</h4>
            <div className="status-buttons">
              <button 
                className={`status-btn available ${spot.status === 'Disponible' ? 'active' : ''}`}
                onClick={() => handleStatusChange('Disponible')}
              >
                Disponible
              </button>
              <button 
                className={`status-btn occupied ${spot.status === 'Ocupado' ? 'active' : ''}`}
                onClick={() => handleStatusChange('Ocupado')}
              >
                Ocupado
              </button>
{/*               <button 
                className={`status-btn reserved ${spot.status === 'Reservado' ? 'active' : ''}`}
                onClick={() => handleStatusChange('Reservado')}
              >
                Reservado
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

SpotDetailsModal.propTypes = {
  spot: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdateSpot: PropTypes.func.isRequired
};

export default SpotDetailsModal;