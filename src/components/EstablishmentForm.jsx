// src/components/EstablishmentForm.jsx
import React, { useState, useEffect } from 'react';
import ParkingLayoutEditor from './ParkingLayoutEditor';
import { layoutService } from '../services/layoutService';
import { saveEstablishment } from '../services/api';
import '../styles/EstablishmentForm.css'; 

const EstablishmentForm = ({ establishment, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    status: 'Disponible'
  });
  
  const [floors, setFloors] = useState([]);
  const [currentEditingFloor, setCurrentEditingFloor] = useState(null);
  const [showLayoutEditor, setShowLayoutEditor] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (establishment) {
      setFormData({
        id: establishment.id || '',
        name: establishment.name || '',
        address: establishment.address || '',
        latitude: establishment.latitude || '',
        longitude: establishment.longitude || '',
        status: establishment.status || 'Disponible'
      });
      setFloors(establishment.floors || []);
    }
  }, [establishment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addFloor = () => {
    const newFloor = {
      id: `temp-${Date.now()}`,
      number: String(floors.length + 1),
      spots: [],
      layout: null // Para guardar el layout del editor
    };
    setFloors(prev => [...prev, newFloor]);
  };

  const removeFloor = (floorId) => {
    setFloors(prev => prev.filter(floor => floor.id !== floorId));
  };

  const openLayoutEditor = (floor) => {
    setCurrentEditingFloor(floor);
    setShowLayoutEditor(true);
  };

  const handleLayoutSave = async (updatedLayout) => {
    try {
      setLoading(true);
      
      // Actualizar el piso con el nuevo layout
      const updatedFloors = floors.map(floor => 
        floor.id === currentEditingFloor.id 
          ? { ...floor, layout: updatedLayout, spots: updatedLayout.spots }
          : floor
      );
      
      setFloors(updatedFloors);
      setShowLayoutEditor(false);
      setCurrentEditingFloor(null);
      
      // Guardar layout en el servidor si ya existe el establecimiento
      if (formData.id) {
        await layoutService.saveLayout(formData.id, currentEditingFloor.id, updatedLayout);
      }
      
    } catch (err) {
      setError('Error al guardar el layout. Inténtalo de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLayoutCancel = () => {
    setShowLayoutEditor(false);
    setCurrentEditingFloor(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validar que al menos un piso tenga layout configurado
      const floorsWithLayout = floors.filter(floor => floor.spots.length > 0);
      if (floorsWithLayout.length === 0) {
        setError('Debes configurar al menos un piso con espacios de parqueo.');
        setLoading(false);
        return;
      }

      // Combinar datos del formulario con pisos
      const dataToSave = {
        ...formData,
        floors: floors.map(floor => ({
          ...floor,
          spots: floor.spots || []
        }))
      };

      const savedEstablishment = await saveEstablishment(dataToSave);
      onSubmit(savedEstablishment);
      
    } catch (err) {
      setError('Error al guardar el establecimiento. Inténtalo de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Si está mostrando el editor de layout
  if (showLayoutEditor && currentEditingFloor) {
    return (
      <div className="establishment-form-container">
        <div className="layout-editor-header">
          <h2>Editor de Layout - {formData.name} - Piso {currentEditingFloor.number}</h2>
          <button 
            onClick={handleLayoutCancel}
            className="close-button"
          >
            ✕
          </button>
        </div>
        
        <ParkingLayoutEditor
          floor={currentEditingFloor}
          onSaveLayout={handleLayoutSave}
          onCancel={handleLayoutCancel}
          establishmentName={formData.name}
        />
      </div>
    );
  }

  return (
    <div className="establishment-form-overlay">
      <div className="establishment-form-container">
        <div className="form-header">
          <h2>{establishment ? 'Editar Establecimiento' : 'Crear Nuevo Establecimiento'}</h2>
          <button onClick={onClose} className="close-button">✕</button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="establishment-form">
          {/* Información Básica */}
          <div className="form-section">
            <h3>Información Básica</h3>
            
            <div className="form-group">
              <label htmlFor="name">Nombre del Establecimiento *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Ej: Mall del Sol"
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Dirección *</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Ej: 4ª Pasaje 1 NE, Guayaquil 090513"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="latitude">Latitud *</label>
                <input
                  type="number"
                  id="latitude"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  step="any"
                  required
                  placeholder="-2.1722041"
                />
              </div>

              <div className="form-group">
                <label htmlFor="longitude">Longitud *</label>
                <input
                  type="number"
                  id="longitude"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  step="any"
                  required
                  placeholder="-79.8886425"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="status">Estado</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Disponible">Disponible</option>
                <option value="Ocupado">Ocupado</option>
                <option value="Cerrado">Cerrado</option>
              </select>
            </div>
          </div>

          {/* Gestión de Pisos */}
          <div className="form-section">
            <div className="section-header">
              <h3>Configuración de Pisos</h3>
              <button type="button" onClick={addFloor} className="add-floor-btn">
                <i className="fas fa-plus"></i> Agregar Piso
              </button>
            </div>

            {floors.length > 0 ? (
              <div className="floors-list">
                {floors.map((floor) => (
                  <div key={floor.id} className="floor-item">
                    <div className="floor-info">
                      <h4>Piso {floor.number}</h4>
                      <div className="floor-stats">
                        <span className="stat">
                          <i className="fas fa-car"></i> 
                          {floor.spots?.length || 0} espacios
                        </span>
                        <span className="stat">
                          <i className="fas fa-check-circle"></i> 
                          {floor.spots?.filter(s => s.status === 'Disponible').length || 0} disponibles
                        </span>
                      </div>
                    </div>

                    <div className="floor-actions">
                      <button
                        type="button"
                        onClick={() => openLayoutEditor(floor)}
                        className="edit-layout-btn"
                      >
                        <i className="fas fa-edit"></i> 
                        {floor.spots?.length > 0 ? 'Editar Layout' : 'Crear Layout'}
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => removeFloor(floor.id)}
                        className="remove-floor-btn"
                        disabled={floors.length === 1}
                      >
                        <i className="fas fa-trash"></i>
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-floors-message">
                <i className="fas fa-info-circle"></i>
                <p>No hay pisos configurados. Agrega al menos un piso para continuar.</p>
              </div>
            )}
          </div>

          {/* Acciones del Formulario */}
          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              <i className="fas fa-times"></i> Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading || floors.length === 0}
              className="save-btn"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Guardando...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i> 
                  {establishment ? 'Actualizar' : 'Crear'} Establecimiento
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EstablishmentForm;