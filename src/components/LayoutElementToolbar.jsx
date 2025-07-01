import React from 'react';
import PropTypes from 'prop-types';

const LayoutElementToolbar = ({ selectedTool, setSelectedTool }) => {
  const tools = [
    { id: 'parking_spot', name: 'Parqueo', icon: '🚗' },
    { id: 'wall', name: 'Pared', icon: '🧱' },
    { id: 'pillar', name: 'Columna', icon: '⬛' },
    { id: 'stairs', name: 'Escaleras', icon: '🪜' },
    { id: 'elevator', name: 'Ascensor', icon: '🛗' }
  ];

  return (
    <div className="toolbar">
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
  );
};

LayoutElementToolbar.propTypes = {
  selectedTool: PropTypes.string.isRequired,
  setSelectedTool: PropTypes.func.isRequired
};

export default LayoutElementToolbar;