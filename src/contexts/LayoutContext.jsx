import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const LayoutContext = createContext();

export const LayoutProvider = ({ children }) => {
  const [selectedElement, setSelectedElement] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedTool, setSelectedTool] = useState('parking_spot');
  const [layoutHistory, setLayoutHistory] = useState([]);

  const value = {
    selectedElement,
    setSelectedElement,
    editMode,
    setEditMode,
    selectedTool,
    setSelectedTool,
    layoutHistory,
    setLayoutHistory
  };

  return (
    <LayoutContext.Provider value={value}>
      {children}
    </LayoutContext.Provider>
  );
};

LayoutProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};