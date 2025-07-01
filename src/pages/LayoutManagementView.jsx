import React, { useState } from 'react';
import { useEstablishments } from '../contexts/EstablishmentContext';
import ParkingLayoutEditor from '../components/ParkingLayoutEditor';
import '../styles/LayoutManagement.css';

const LayoutManagementView = () => {
  const { establishments } = useEstablishments();
  const [selectedEstablishment, setSelectedEstablishment] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);

  return (
    <div className="layout-management">
      <h1>Gestión de Layouts de Parqueo</h1>
      
      <div className="establishment-selector">
        <select 
          value={selectedEstablishment?.id || ''}
          onChange={(e) => {
            const est = establishments.find(e => e.id.toString() === e.target.value);
            setSelectedEstablishment(est);
            setSelectedFloor(null);
          }}
        >
          <option value="">Seleccionar Establecimiento</option>
          {establishments.map(est => (
            <option key={est.id} value={est.id}>
              {est.name}
            </option>
          ))}
        </select>
        
        {selectedEstablishment && (
          <select
            value={selectedFloor?.id || ''}
            onChange={(e) => {
              const floor = selectedEstablishment.floors.find(f => f.id.toString() === e.target.value);
              setSelectedFloor(floor);
            }}
          >
            <option value="">Seleccionar Piso</option>
            {selectedEstablishment.floors.map(floor => (
              <option key={floor.id} value={floor.id}>
                Piso {floor.number}
              </option>
            ))}
          </select>
        )}
      </div>
      
      {selectedFloor && (
        <ParkingLayoutEditor
          floor={selectedFloor}
          onSaveLayout={(layout) => console.log('Layout saved:', layout)}
        />
      )}
    </div>
  );
};

export default LayoutManagementView;