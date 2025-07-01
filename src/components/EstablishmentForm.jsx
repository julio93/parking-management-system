// src/components/EstablishmentForm.jsx
import React, { useState, useEffect } from 'react';
import { saveEstablishment } from '../services/api';

const EstablishmentForm = ({ establishment, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    floors: [],
    status: 'Disponible'
  });
  const [floors, setFloors] = useState([]);
  const [newFloor, setNewFloor] = useState({ number: '', spots: [] });
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
        floors: [],
        status: establishment.status || 'Disponible'
      });
      setFloors(establishment.floors || []);
    }
  }, [establishment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFloorChange = (e) => {
    const { name, value } = e.target;
    setNewFloor(prev => ({ ...prev, [name]: value }));
  };

  const addFloor = () => {
    if (!newFloor.number) {
      setError('Floor number is required');
      return;
    }

    // Check if floor number already exists
    if (floors.some(floor => floor.number === newFloor.number)) {
      setError('Floor number already exists');
      return;
    }

    const floorToAdd = {
      id: `temp-${Date.now()}`, // Temporary ID, will be replaced by backend
      number: newFloor.number,
      spots: []
    };

    setFloors(prev => [...prev, floorToAdd]);
    setNewFloor({ number: '', spots: [] });
    setError('');
  };

  const removeFloor = (floorId) => {
    setFloors(prev => prev.filter(floor => floor.id !== floorId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Combine formData with floors
      const dataToSave = {
        ...formData,
        floors: floors
      };

      await saveEstablishment(dataToSave);
      onSubmit();
    } catch (err) {
      setError('Failed to save establishment. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold">
            {establishment ? 'Edit Establishment' : 'Add New Establishment'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Latitude</label>
                <input
                  type="number"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  step="any"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Longitude</label>
                <input
                  type="number"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  step="any"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="Disponible">Disponible</option>
                <option value="Ocupado">Ocupado</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Floors</h3>
              </div>

              {floors.length > 0 ? (
                <div className="mb-4 border rounded-md divide-y">
                  {floors.map((floor, index) => (
                    <div key={floor.id} className="p-3 flex justify-between items-center">
                      <div>
                        <span className="font-medium">Floor {floor.number}</span>
                        <span className="ml-2 text-sm text-gray-500">
                          ({floor.spots.length} parking spots)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFloor(floor.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 bg-gray-50 rounded-md mb-4">
                  <p className="text-gray-500">No floors added yet</p>
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="text-sm font-medium mb-2">Add New Floor</h4>
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <input
                      type="number"
                      name="number"
                      value={newFloor.number}
                      onChange={handleFloorChange}
                      placeholder="Floor Number"
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addFloor}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Add Floor
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Establishment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EstablishmentForm;