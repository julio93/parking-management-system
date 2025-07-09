// src/components/ParkingLayoutEditor.jsx
import React, { useState, useRef, useEffect } from 'react';
import ParkingLayoutViewer from './ParkingLayoutViewer';
import PropTypes from 'prop-types';
import '../styles/ParkingLayoutEditor.css';

const ParkingLayoutEditor = ({ floor, onSaveLayout, onCancel, establishmentName }) => {
  const canvasRef = useRef(null);
  const [spots, setSpots] = useState(floor?.spots || []);
  const [editMode, setEditMode] = useState(true);
  const [selectedTool, setSelectedTool] = useState('parking_spot');
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [spotOrientation, setSpotOrientation] = useState('horizontal'); // horizontal o vertical
  const [gridSize] = useState(20);

  const tools = [
    { id: 'parking_spot', name: 'Espacio de Parqueo', icon: '🚗', color: '#4CAF50' },
/*     { id: 'wall', name: 'Pared', icon: '🧱', color: '#795548' },
    { id: 'pillar', name: 'Columna', icon: '⬛', color: '#424242' },
    { id: 'stairs', name: 'Escaleras', icon: '🪜', color: '#FF9800' },
    { id: 'elevator', name: 'Ascensor', icon: '🛗', color: '#9C27B0' }, */
    { id: 'select', name: 'Seleccionar', icon: '👆', color: '#2196F3' }
  ];

  useEffect(() => {
    if (canvasRef.current) {
      drawCanvas();
    }
  }, [spots, selectedSpot]);

// Función para generar número de spot con formato A1, A2, B1, B2...
  const generateSpotNumber = (x, y) => {
    // Calcular la fila basada en la posición Y (cada 80px una nueva fila)
    const row = Math.floor(y / 80);
    const letter = String.fromCharCode(65 + row); // A, B, C, D...
    
    // Calcular el número basado en la posición X y los spots existentes en esa fila
    const spotsInRow = spots.filter(spot => {
      const spotRow = Math.floor(spot.y / 80);
      return spotRow === row && spot.type === 'parking_spot';
    });
    
    const number = spotsInRow.length + 1;
    return `${letter}${number}`;
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dibujar grid
    drawGrid(ctx);
    
    // Dibujar elementos
    spots.forEach((spot, index) => {
      drawElement(ctx, spot, index === selectedSpot);
    });
  };

  const drawGrid = (ctx) => {
    const gridSize = 20;
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;
    
    for (let x = 0; x <= 1000; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 700);
      ctx.stroke();
    }
    
    for (let y = 0; y <= 700; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1000, y);
      ctx.stroke();
    }
  };

  const drawElement = (ctx, element, isSelected) => {
    const { x, y, width, height, type, status, number, orientation } = element;
    
    // Colores según tipo y estado
    let fillColor = '#4CAF50';
    if (type === 'parking_spot') {
      const statusColors = {
        'Disponible': '#4CAF50',
        'Ocupado': '#f44336',
        'Reservado': '#FF9800',
        'Fuera de servicio': '#9E9E9E'
      };
      fillColor = statusColors[status] || '#4CAF50';
    } else {
      const tool = tools.find(t => t.id === type);
      fillColor = tool?.color || '#2196F3';
    }
    
    // Dibujar elemento
    ctx.fillStyle = fillColor;
    ctx.strokeStyle = isSelected ? '#FF5722' : '#333';
    ctx.lineWidth = isSelected ? 3 : 1;
    
    ctx.fillRect(x, y, width, height);
    ctx.strokeRect(x, y, width, height);
    
    // Dibujar texto
    if (type === 'parking_spot' && number) {
      ctx.fillStyle = 'white';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(number, x + width/2, y + height/2 + 4);
    }

    // Dibujar indicador de orientación para parking spots
    /* if (type === 'parking_spot') {
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      if (orientation === 'horizontal') {
        // Línea horizontal en el centro
        ctx.moveTo(x + 5, y + height/2);
        ctx.lineTo(x + width - 5, y + height/2);
      } else {
        // Línea vertical en el centro
        ctx.moveTo(x + width/2, y + 5);
        ctx.lineTo(x + width/2, y + height - 5);
      }
      ctx.stroke();
    } */
  };

  const getMousePos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const snapToGrid = (pos) => {
    return {
      x: Math.round(pos.x / gridSize) * gridSize,
      y: Math.round(pos.y / gridSize) * gridSize
    };
  };

  const findSpotAtPosition = (pos) => {
    return spots.findIndex(spot => 
      pos.x >= spot.x && pos.x <= spot.x + spot.width &&
      pos.y >= spot.y && pos.y <= spot.y + spot.height
    );
  };

  const handleMouseDown = (e) => {
    const mousePos = getMousePos(e);
    const snappedPos = snapToGrid(mousePos);
    
    if (selectedTool === 'select') {
      const spotIndex = findSpotAtPosition(snappedPos);
      
      if (spotIndex >= 0) {
        setSelectedSpot(spotIndex);
        setIsDragging(true);
        setDragOffset({
          x: snappedPos.x - spots[spotIndex].x,
          y: snappedPos.y - spots[spotIndex].y
        });
      } else {
        setSelectedSpot(null);
      }
    } else {
      // Crear nuevo elemento
      const dimensions = getElementDimensions(selectedTool);
      const newElement = {
        id: Date.now(),
        x: snappedPos.x,
        y: snappedPos.y,
        width: dimensions.width,
        height: dimensions.height,
        type: selectedTool,
        status: selectedTool === 'parking_spot' ? 'Disponible' : null,
        number: selectedTool === 'parking_spot' 
          ? generateSpotNumber(snappedPos.x, snappedPos.y) 
          : null,
        orientation: selectedTool === 'parking_spot' ? spotOrientation : null
      };
      
      setSpots([...spots, newElement]);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging || selectedSpot === null) return;
    
    const mousePos = getMousePos(e);
    const snappedPos = snapToGrid(mousePos);
    
    const updatedSpots = [...spots];
    const spot = updatedSpots[selectedSpot];
    
    // Actualizar posición
    spot.x = snappedPos.x - dragOffset.x;
    spot.y = snappedPos.y - dragOffset.y;
    
    // Regenerar número si es parking spot
    if (spot.type === 'parking_spot') {
      spot.number = generateSpotNumber(spot.x, spot.y);
    }
    
    setSpots(updatedSpots);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  };

  const getElementDimensions = (toolType) => {
    const dimensions = {
      parking_spot: spotOrientation === 'horizontal' 
        ? { width: 40, height: 20 } 
        : { width: 20, height: 40 }
      /* wall: { width: 80, height: 20 },
      pillar: { width: 20, height: 20 },
      stairs: { width: 60, height: 60 },
      elevator: { width: 80, height: 80 } */
    };
    
    return dimensions[toolType] || { width: 40, height: 40 };
  };

  const toggleSpotOrientation = () => {
    if (selectedSpot !== null && spots[selectedSpot].type === 'parking_spot') {
      const updatedSpots = [...spots];
      const spot = updatedSpots[selectedSpot];
      
      // Cambiar orientación
      spot.orientation = spot.orientation === 'horizontal' ? 'vertical' : 'horizontal';
      
      // Intercambiar dimensiones
      const temp = spot.width;
      spot.width = spot.height;
      spot.height = temp;
      
      setSpots(updatedSpots);
    }
  };

  const handleSpotStatusChange = (spotIndex, newStatus) => {
    const updatedSpots = [...spots];
    updatedSpots[spotIndex].status = newStatus;
    setSpots(updatedSpots);
  };

  const deleteSelectedSpot = () => {
    if (selectedSpot !== null) {
      const updatedSpots = spots.filter((_, index) => index !== selectedSpot);
      setSpots(updatedSpots);
      setSelectedSpot(null);
    }
  };

  const handleSave = () => {
    const layoutData = {
      floorId: floor.id,
      floorNumber: floor.number,
      spots: spots.filter(spot => spot.type === 'parking_spot'),
      elements: spots.filter(spot => spot.type !== 'parking_spot')
    };
    onSaveLayout(layoutData);
  };

  const clearCanvas = () => {
    setSpots([]);
    setSelectedSpot(null);
  };

  return (
    <div className="parking-layout-editor">
      <div className="editor-header">
        <h2>Editor de Layout - {establishmentName} - Piso {floor.number}</h2>
        <div className="header-actions">
          <button onClick={handleSave} className="save-btn">
            <i className="fas fa-save"></i> Guardar Layout
          </button>
          <button onClick={onCancel} className="cancel-btn">
            <i className="fas fa-times"></i> Cancelar
          </button>
        </div>
      </div>

      <div className="orientation-section">
          <strong><h3>Orientación de Espacios</h3></strong>
          <div className="tool-palette">
            <button
              onClick={() => setSpotOrientation('horizontal')}
              className={`tool-button ${spotOrientation === 'horizontal' ? 'active' : ''}`}
            >
              <i className="fas fa-arrows-alt-h"></i> Horizontal
            </button>
            <button
              onClick={() => setSpotOrientation('vertical')}
              className={`tool-button ${spotOrientation === 'vertical' ? 'active' : ''}`}
            >
              <i className="fas fa-arrows-alt-v"></i> Vertical
            </button>
          </div>
        </div>
      
      <div className="editor-toolbar">
        <div className="tool-section">
          <strong><h3>Herramientas</h3></strong>
          <div className="tool-palette">
            {tools.map(tool => (
              <button
                key={tool.id}
                onClick={() => setSelectedTool(tool.id)}
                className={`tool-button ${selectedTool === tool.id ? 'active' : ''}`}
                title={tool.name}
              >
                <span className="tool-icon">{tool.icon}</span>
                <span className="tool-name">{tool.name}</span>
              </button>
            ))}
            <button onClick={clearCanvas} className="tool-button">
            <i className="fas fa-trash"></i> Limpiar Todo
          </button>
          {selectedSpot !== null && (
                <button onClick={toggleSpotOrientation} className="tool-button">
                  <i className="fas fa-redo"></i> Rotar
                </button>
              )}
          {selectedSpot !== null && (
            <button onClick={deleteSelectedSpot} className="tool-button">
              <i className="fas fa-trash"></i> Eliminar Seleccionado
            </button>
          )}
          </div>
        </div>

        

        {/* <div className="action-section">
          <button onClick={clearCanvas} className="clear-btn">
            <i className="fas fa-trash"></i> Limpiar Todo
          </button>
          {selectedSpot !== null && (
            <button onClick={deleteSelectedSpot} className="delete-btn">
              <i className="fas fa-trash"></i> Eliminar Seleccionado
            </button>
          )}
        </div> */}
      </div>

      <div className="editor-content">
        <div className="canvas-container">
          <canvas
            ref={canvasRef}
            width={1000}
            height={700}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="layout-canvas"
            //style={{ cursor: isDragging ? 'grabbing' : selectedTool === 'select' ? 'grab' : 'crosshair' }}
          />
        </div>

        <div className="sidebar">
          <div className="properties-panel">
            <h3>Propiedades</h3>
            {selectedSpot !== null && spots[selectedSpot] && (
              <div className="spot-properties">
                <h4>Elemento Seleccionado</h4>
                <p><strong>Tipo:</strong> {spots[selectedSpot].type}</p>
                {spots[selectedSpot].number && (
                  <p><strong>Número:</strong> {spots[selectedSpot].number}</p>
                )}
                {spots[selectedSpot].type === 'parking_spot' && (
                  <div className="status-selector">
                    <label>Estado:</label>
                    <select 
                      value={spots[selectedSpot].status} 
                      onChange={(e) => handleSpotStatusChange(selectedSpot, e.target.value)}
                    >
                      <option value="Disponible">Disponible</option>
                      <option value="Ocupado">Ocupado</option>
                      <option value="Fuera de servicio">Fuera de servicio</option>
                    </select>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="legend">
            <h3>Leyenda</h3>
            <div className="legend-item">
              <div className="legend-color" style={{backgroundColor: '#4CAF50'}}></div>
              <span>Disponible</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{backgroundColor: '#f44336'}}></div>
              <span>Ocupado</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{backgroundColor: '#9E9E9E'}}></div>
              <span>Fuera de servicio</span>
            </div>
          </div>

          <div className="stats">
            <h3>Estadísticas</h3>
            <div className="stat-item">
              <strong>Total espacios:</strong> {spots.filter(s => s.type === 'parking_spot').length}
            </div>
            <div className="stat-item">
              <strong>Disponibles:</strong> {spots.filter(s => s.type === 'parking_spot' && s.status === 'Disponible').length}
            </div>
            <div className="stat-item">
              <strong>Ocupados:</strong> {spots.filter(s => s.type === 'parking_spot' && s.status === 'Ocupado').length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ParkingLayoutEditor.propTypes = {
  floor: PropTypes.object.isRequired,
  onSaveLayout: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  establishmentName: PropTypes.string
};

export default ParkingLayoutEditor;