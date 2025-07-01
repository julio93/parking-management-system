// components/ParkingLayoutEditor.jsx
import React, { useState } from 'react';
import ParkingLayoutViewer from './ParkingLayoutViewer';
import PropTypes from 'prop-types';

const ParkingLayoutEditor = ({ floor, onSaveLayout }) => {
  const [editMode, setEditMode] = useState(false);
  const [selectedTool, setSelectedTool] = useState('parking_spot');

  const tools = [
    { id: 'parking_spot', name: 'Parqueo', icon: '🚗' },
    { id: 'wall', name: 'Pared', icon: '🧱' },
    { id: 'pillar', name: 'Columna', icon: '⬛' },
    { id: 'stairs', name: 'Escaleras', icon: '🪜' },
    { id: 'elevator', name: 'Ascensor', icon: '🛗' }
  ];

  return (
    <div className="parking-layout-editor">
      <div className="editor-toolbar">
        <button 
          onClick={() => setEditMode(!editMode)}
          className={`edit-toggle ${editMode ? 'active' : ''}`}
        >
          {editMode ? 'Salir de Edición' : 'Editar Layout'}
        </button>
        
        {editMode && (
          <div className="tool-palette">
            {tools.map(tool => (
              <button
                key={tool.id}
                onClick={() => setSelectedTool(tool.id)}
                className={`tool-button ${selectedTool === tool.id ? 'active' : ''}`}
                title={tool.name}
              >
                {tool.icon} {tool.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <ParkingLayoutViewer
        floor={floor}
        editable={editMode}
        selectedTool={selectedTool}
        onSpotClick={(spotData) => console.log('Spot clicked:', spotData)}
      />
    </div>
  );
};

ParkingLayoutEditor.propTypes = {
  floor: PropTypes.object.isRequired,
  onSaveLayout: PropTypes.func
};

export default ParkingLayoutEditor;