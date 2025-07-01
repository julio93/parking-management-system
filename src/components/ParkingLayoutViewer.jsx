// components/ParkingLayoutViewer.jsx
import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import '../styles/ParkingLayoutViewer.css';

const ParkingLayoutViewer = ({ floor, onSpotClick, editable = false }) => {
  const [selectedElement, setSelectedElement] = useState(null);
  const canvasRef = useRef(null);

  console.log('ParkingLayoutViewer props:', { floor, onSpotClick, editable });

  const { layout } = floor;
  const { width, height, gridSize, elements } = layout;

  const getElementStyle = (element) => {
    const baseStyle = {
      position: 'absolute',
      left: `${element.x * gridSize}px`,
      top: `${element.y * gridSize}px`,
      width: `${element.width * gridSize}px`,
      height: `${element.height * gridSize}px`,
      transform: `rotate(${element.rotation || 0}deg)`,
      transformOrigin: 'center center'
    };

    switch (element.type) {
      case 'parking_spot':
        console.log('Element style for parking_spot:', element);
        return {
          ...baseStyle,
          backgroundColor: getSpotColor(element.spotData?.status),
          border: '2px solid #333',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: 'bold',
          cursor: 'pointer'
        };
      case 'wall':
        return {
          ...baseStyle,
          backgroundColor: '#666',
          border: '1px solid #333'
        };
      case 'pillar':
        return {
          ...baseStyle,
          backgroundColor: '#999',
          borderRadius: '50%',
          border: '2px solid #333'
        };
      case 'stairs':
        return {
          ...baseStyle,
          backgroundColor: '#e0e0e0',
          border: '2px dashed #666',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '10px'
        };
      case 'elevator':
        return {
          ...baseStyle,
          backgroundColor: '#ffd700',
          border: '2px solid #333',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '10px'
        };
      default:
        return baseStyle;
    }
  };

  const getSpotColor = (status) => {
    switch (status) {
      case 'Disponible':
        return '#d4edda';
      case 'Ocupado':
        return '#f8d7da';
      case 'Reservado':
        return '#fff3cd';
      default:
        return '#f8f9fa';
    }
  };

  const handleElementClick = (element) => {
    if (element.type === 'parking_spot' && onSpotClick) {
      onSpotClick(element.spotData);
    }
    if (editable) {
      setSelectedElement(element);
    }
  };

  const renderElement = (element) => {
    const style = getElementStyle(element);
    
    return (
      <div
        key={element.id}
        style={style}
        className={`layout-element ${element.type} ${
          selectedElement?.id === element.id ? 'selected' : ''
        }`}
        onClick={() => handleElementClick(element)}
        title={element.spotData ? `${element.spotData.number} - ${element.spotData.status}` : element.type}
      >
        {element.type === 'parking_spot' && element.spotData?.number}
        {element.type === 'stairs' && '🪜'}
        {element.type === 'elevator' && '🛗'}
      </div>
    );
  };

  return (
    <div className="parking-layout-viewer">
      <div className="layout-header">
        <h3>Piso {floor.number}</h3>
        <div className="layout-legend">
          <div className="legend-item">
            <div className="legend-color available"></div>
            <span>Disponible</span>
          </div>
          <div className="legend-item">
            <div className="legend-color occupied"></div>
            <span>Ocupado</span>
          </div>
{/*           <div className="legend-item">
            <div className="legend-color reserved"></div>
            <span>Reservado</span>
          </div> */}
        </div>
      </div>
      
      <div 
        className="layout-canvas"
        ref={canvasRef}
        style={{
          width: `${width * gridSize}px`,
          height: `${height * gridSize}px`,
          position: 'relative',
          border: '2px solid #333',
          backgroundColor: '#f8f9fa',
          margin: '20px auto'
        }}
      >
        {/* Grid de fondo para edición */}
        {editable && (
          <div 
            className="grid-overlay"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `
                linear-gradient(to right, #ddd 1px, transparent 1px),
                linear-gradient(to bottom, #ddd 1px, transparent 1px)
              `,
              backgroundSize: `${gridSize}px ${gridSize}px`,
              pointerEvents: 'none',
              opacity: 0.5
            }}
          />
        )}
        
        {/* Renderizar todos los elementos */}
        {elements.map(renderElement)}
      </div>

      {/* Panel de estadísticas */}
      <div className="layout-stats">
        {(() => {
          const spots = elements.filter(el => el.type === 'parking_spot');
          const available = spots.filter(el => el.spotData?.status === 'Disponible').length;
          const occupied = spots.filter(el => el.spotData?.status === 'Ocupado').length;
          const total = spots.length;
          
          return (
            <div className="stats-row">
              <span>Total: {total}</span>
              <span>Disponibles: {available}</span>
              <span>Ocupados: {occupied}</span>
              <span>Ocupación: {total > 0 ? Math.round((occupied / total) * 100) : 0}%</span>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

ParkingLayoutViewer.propTypes = {
  floor: PropTypes.object.isRequired,
  onSpotClick: PropTypes.func,
  editable: PropTypes.bool
};

export default ParkingLayoutViewer;